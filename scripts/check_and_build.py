#!/usr/bin/env python3
"""
NAW Games Auto-Builder
Checks Firestore for pending game requests, builds them,
tests with Playwright, auto-fixes errors, and deploys.

Runs nightly at 2am via cron, or manually.
"""

import json
import os
import re
import subprocess
import sys
import urllib.request
from datetime import datetime

import google.auth.transport.requests
from google.oauth2 import service_account

# --- Config ---
NAWGAMES_DIR = '/opt/nawgames'
SA_PATH = '/opt/cmejor-newsletter/firebase-sa.json'
PROJECT_ID = 'chorizomejor-app'
MAX_FIX_ATTEMPTS = 3
LOG_FILE = '/opt/nawgames/scripts/build.log'

def log(msg):
    ts = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    line = f'[{ts}] {msg}'
    print(line)
    with open(LOG_FILE, 'a') as f:
        f.write(line + '\n')

def get_firestore_creds():
    creds = service_account.Credentials.from_service_account_file(
        SA_PATH, scopes=['https://www.googleapis.com/auth/datastore'])
    creds.refresh(google.auth.transport.requests.Request())
    return creds

def firestore_get(creds, path):
    url = f'https://firestore.googleapis.com/v1/projects/{PROJECT_ID}/databases/(default)/documents/{path}'
    req = urllib.request.Request(url, headers={'Authorization': f'Bearer {creds.token}'})
    return json.loads(urllib.request.urlopen(req).read())

def firestore_patch(creds, path, fields):
    mask = '&'.join([f'updateMask.fieldPaths={k}' for k in fields.keys()])
    url = f'https://firestore.googleapis.com/v1/projects/{PROJECT_ID}/databases/(default)/documents/{path}?{mask}'
    body = json.dumps({'fields': {k: {'stringValue': v} for k, v in fields.items()}}).encode()
    req = urllib.request.Request(url, data=body, method='PATCH',
        headers={'Authorization': f'Bearer {creds.token}', 'Content-Type': 'application/json'})
    urllib.request.urlopen(req)

def get_pending_requests(creds):
    """Get all pending game requests from Firestore."""
    try:
        data = firestore_get(creds, 'game_requests')
        pending = []
        for doc in data.get('documents', []):
            fields = doc['fields']
            status = fields.get('status', {}).get('stringValue', '')
            if status == 'pending':
                pending.append({
                    'doc_id': doc['name'].split('/')[-1],
                    'name': fields.get('gameName', {}).get('stringValue', 'Unknown'),
                    'type': fields.get('gameType', {}).get('stringValue', 'arcade'),
                    'description': fields.get('description', {}).get('stringValue', ''),
                    'inspiration': fields.get('inspiration', {}).get('stringValue', ''),
                    'requester': fields.get('requesterName', {}).get('stringValue', 'Unknown'),
                })
        return pending
    except Exception as e:
        log(f'Error fetching requests: {e}')
        return []

def slugify(name):
    """Convert game name to URL slug."""
    s = re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')
    return s[:50]

def test_game(html_path):
    """Run Playwright tests on a game file. Returns (success, errors_json)."""
    try:
        result = subprocess.run(
            ['node', '/opt/nawgames/scripts/test_game.js', html_path],
            capture_output=True, text=True, timeout=30,
            cwd=NAWGAMES_DIR
        )
        try:
            data = json.loads(result.stdout)
            return data.get('success', False), data.get('errors', [])
        except json.JSONDecodeError:
            return False, [{'type': 'test_crash', 'message': result.stderr[:500]}]
    except subprocess.TimeoutExpired:
        return False, [{'type': 'timeout', 'message': 'Test timed out after 30s'}]
    except Exception as e:
        return False, [{'type': 'exception', 'message': str(e)}]

def apply_common_fixes(html_path, errors):
    """
    Try to auto-fix common game errors.
    Returns True if a fix was applied.
    """
    with open(html_path, 'r') as f:
        content = f.read()
    
    original = content
    
    for err in errors:
        msg = err.get('message', '')
        
        # Fix: "X is not iterable" - uninitialized arrays
        match = re.search(r"(\w+) is not iterable", msg)
        if match:
            var_name = match.group(1)
            log(f'  Auto-fix: initializing {var_name}=[] before draw loop')
            # Find the loop() call at the bottom and add initialization before it
            content = re.sub(
                r'(generateWorld\(\))',
                f'{var_name}=[];\\1',
                content, count=1
            )
        
        # Fix: "X is not defined" for common game arrays
        match = re.search(r"(\w+) is not defined", msg)
        if match:
            var_name = match.group(1)
            common_arrays = ['shelters','campfires','items','bullets','particles','animals','messages','flowers','trees','rocks','waters']
            if var_name in common_arrays:
                log(f'  Auto-fix: declaring {var_name}=[]')
                content = content.replace(
                    'let worldW=',
                    f'let {var_name}=[];let worldW=',
                    1
                )
        
        # Fix: "Cannot read properties of null" for DOM elements
        if "Cannot read properties of null" in msg:
            log(f'  Auto-fix: adding null checks for DOM elements')
            # Wrap HUD updates in try-catch
            content = content.replace(
                "document.getElementById('hpBar')",
                "try{document.getElementById('hpBar')"
            )
            if "try{" in content and content.count("try{") == 1:
                content = content.replace(
                    "document.getElementById('scoreVal').textContent=score;",
                    "document.getElementById('scoreVal').textContent=score;}catch(e){}"
                )
        
        # Fix: flat rendering (canvas draws but world doesn't show)
        if err.get('type') == 'flat_render':
            log(f'  Auto-fix: ensuring arrays initialized before first draw')
            # Make sure ALL arrays are initialized before loop()
            init_arrays = "shelters=[];campfires=[];items=[];bullets=[];particles=[];animals=[];messages=[];"
            if init_arrays not in content:
                content = content.replace('loop();', init_arrays + 'loop();')
    
    if content != original:
        with open(html_path, 'w') as f:
            f.write(content)
        return True
    return False

def generate_preview(slug):
    """Generate preview screenshot with Playwright."""
    html_path = f'{NAWGAMES_DIR}/public/games/{slug}.html'
    img_path = f'{NAWGAMES_DIR}/public/images/{slug}-preview.png'
    try:
        subprocess.run(
            ['node', '-e', f"""
const pw = require('playwright');
(async () => {{
  const browser = await pw.chromium.launch({{ args: ['--no-sandbox'] }});
  const page = await browser.newPage({{ viewport: {{ width: 800, height: 450 }} }});
  await page.goto('file://{html_path}');
  await page.waitForTimeout(2000);
  // Click start to get gameplay screenshot
  const btn = await page.$('#startBtn');
  if (btn) {{ await btn.click(); await page.waitForTimeout(1500); }}
  await page.screenshot({{ path: '{img_path}' }});
  await browser.close();
}})();
"""],
            capture_output=True, text=True, timeout=20,
            cwd=NAWGAMES_DIR
        )
        log(f'  Preview generated: {img_path}')
        return True
    except Exception as e:
        log(f'  Preview generation failed: {e}')
        return False

def update_games_js(slug, title, creator, description):
    """Add a new game entry to games.js."""
    games_path = f'{NAWGAMES_DIR}/src/lib/games.js'
    with open(games_path, 'r') as f:
        content = f.read()
    
    # Check if already registered
    if f"slug: '{slug}'" in content:
        log(f'  Game {slug} already registered in games.js')
        return
    
    today = datetime.now().strftime('%Y-%m-%d')
    new_entry = f"""  {{
    slug: '{slug}',
    title: '{title.replace("'", "\\'")}',
    creator: '{creator.replace("'", "\\'")}',
    description: '{description.replace("'", "\\'")}',
    createdAt: '{today}',
    thumbnail: '/images/{slug}-preview.png',
    color: 'from-amber-500 to-green-700',
  }},
];"""
    
    content = content.replace('];', new_entry)
    with open(games_path, 'w') as f:
        f.write(content)
    log(f'  Registered {slug} in games.js')

def git_deploy():
    """Commit and push to GitHub for Vercel deployment."""
    import base64
    import hashlib
    
    os.chdir(NAWGAMES_DIR)
    
    # Git add and commit
    subprocess.run(['git', 'add', '-A'], capture_output=True)
    result = subprocess.run(
        ['git', 'commit', '-m', f'Auto-build: new game(s) added [{datetime.now().strftime("%Y-%m-%d %H:%M")}]'],
        capture_output=True, text=True
    )
    if 'nothing to commit' in result.stdout + result.stderr:
        log('  Nothing to commit')
        return False
    
    # Decrypt GitHub token
    with open('/etc/machine-id') as f:
        mid = f.read().strip()
    key = hashlib.sha256(mid.encode()).digest()
    with open('/opt/barrio-secrets/github_token.enc') as f:
        enc = f.read().strip()
    dec = bytes([a ^ b for a, b in zip(base64.b64decode(enc), key * 2)])
    token = dec.decode().strip()
    
    # Push
    subprocess.run(['git', 'remote', 'set-url', 'origin', f'https://{token}@github.com/ipinney/NAWgames.com.git'], capture_output=True)
    result = subprocess.run(['git', 'push', 'origin', 'main'], capture_output=True, text=True)
    subprocess.run(['git', 'remote', 'set-url', 'origin', 'https://github.com/ipinney/NAWgames.com.git'], capture_output=True)
    
    if result.returncode == 0:
        log('  Pushed to GitHub - Vercel deploying')
        return True
    else:
        log(f'  Push failed: {result.stderr[:200]}')
        return False

def build_game(request, creds):
    """
    Build a single game from a request.
    Tests and auto-fixes up to MAX_FIX_ATTEMPTS times.
    """
    slug = slugify(request['name'])
    html_path = f'{NAWGAMES_DIR}/public/games/{slug}.html'
    
    log(f'Building: {request["name"]} (slug: {slug})')
    log(f'  Type: {request["type"]}, Requested by: {request["requester"]}')
    log(f'  Description: {request["description"][:100]}...')
    
    # Update status to building
    firestore_patch(creds, f'game_requests/{request["doc_id"]}', {'status': 'building'})
    
    # Check if HTML already exists (from a previous partial build)
    if not os.path.exists(html_path):
        log(f'  ERROR: No game HTML found at {html_path}')
        log(f'  Game HTML must be created manually or by Claude. Skipping.')
        firestore_patch(creds, f'game_requests/{request["doc_id"]}', {'status': 'pending'})
        return False
    
    # TEST AND FIX LOOP
    for attempt in range(1, MAX_FIX_ATTEMPTS + 1):
        log(f'  Test attempt {attempt}/{MAX_FIX_ATTEMPTS}...')
        success, errors = test_game(html_path)
        
        if success:
            log(f'  PASSED on attempt {attempt}!')
            break
        
        log(f'  FAILED: {len(errors)} error(s)')
        for err in errors:
            log(f'    - [{err.get("type")}] {err.get("message", "")[:150]}')
        
        if attempt < MAX_FIX_ATTEMPTS:
            fixed = apply_common_fixes(html_path, errors)
            if not fixed:
                log(f'  No auto-fix available for these errors. Stopping.')
                break
            log(f'  Applied fixes, retesting...')
        else:
            log(f'  Max fix attempts reached.')
    else:
        success = False
    
    if not success:
        log(f'  BUILD FAILED for {slug}. Leaving status as building for manual review.')
        return False
    
    # Generate preview screenshot
    generate_preview(slug)
    
    # Register in games.js
    desc_short = request['description'][:200].replace("'", "\\'").replace('\n', ' ')
    update_games_js(slug, request['name'], request['requester'], desc_short)
    
    # Update Firestore status
    firestore_patch(creds, f'game_requests/{request["doc_id"]}', {'status': 'completed'})
    log(f'  BUILD SUCCESS: {slug}')
    return True

def main():
    log('='*60)
    log('NAW Games Auto-Builder starting')
    
    creds = get_firestore_creds()
    pending = get_pending_requests(creds)
    
    if not pending:
        log('No pending game requests. Done.')
        return
    
    log(f'Found {len(pending)} pending request(s)')
    
    built = 0
    for req in pending:
        if build_game(req, creds):
            built += 1
    
    if built > 0:
        log(f'Deploying {built} new game(s)...')
        git_deploy()
    
    log(f'Done. Built {built}/{len(pending)} games.')
    log('='*60)

if __name__ == '__main__':
    main()
