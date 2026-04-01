#!/usr/bin/env python3
"""Check for new Lizard Lens access requests and email Ivan.

Runs via cron every minute. Only sends one email per request
(tracks with 'notifiedAt' field).
"""
import json, os, sys, urllib.request
from datetime import datetime
from dotenv import load_dotenv

load_dotenv("/opt/cmejor-newsletter/.env")

import google.auth.transport.requests
from google.oauth2 import service_account

# SendGrid
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Email, To, Content

SG_KEY = os.getenv("SENDGRID_API_KEY", "")
SA_PATH = "/opt/cmejor-newsletter/firebase-sa.json"
ADMIN_EMAIL = "ivan.pinney@gmail.com"
PROJECT_ID = "chorizomejor-app"
COLLECTION = "lizardlens_access"
ADMIN_URL = "https://nawgames.com/lizardlens/admin"

def get_firestore_token():
    creds = service_account.Credentials.from_service_account_file(
        SA_PATH, scopes=["https://www.googleapis.com/auth/datastore"]
    )
    creds.refresh(google.auth.transport.requests.Request())
    return creds.token

def get_pending_requests(token):
    """Query Firestore for pending requests without notifiedAt."""
    # Use structured query to find pending, un-notified requests
    url = f"https://firestore.googleapis.com/v1/projects/{PROJECT_ID}/databases/(default)/documents/{COLLECTION}"
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {token}"})
    try:
        data = json.loads(urllib.request.urlopen(req).read())
    except Exception as e:
        print(f"Error fetching docs: {e}")
        return []

    pending = []
    for doc in data.get("documents", []):
        fields = doc.get("fields", {})
        status = fields.get("status", {}).get("stringValue", "")
        notified = fields.get("notifiedAt", None)

        if status == "pending" and notified is None:
            uid = doc["name"].split("/")[-1]
            pending.append({
                "uid": uid,
                "name": fields.get("name", {}).get("stringValue", "Unknown"),
                "email": fields.get("email", {}).get("stringValue", ""),
                "relationship": fields.get("relationship", {}).get("stringValue", ""),
                "doc_path": doc["name"],
            })

    return pending

def mark_notified(token, doc_path):
    """Set notifiedAt timestamp on the document."""
    url = f"https://firestore.googleapis.com/v1/{doc_path}?updateMask.fieldPaths=notifiedAt"
    body = json.dumps({
        "fields": {
            "notifiedAt": {"stringValue": datetime.utcnow().isoformat() + "Z"}
        }
    }).encode()
    req = urllib.request.Request(
        url, data=body, method="PATCH",
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
    )
    urllib.request.urlopen(req)

def send_notification(request_info):
    """Send email to Ivan about a new access request."""
    name = request_info["name"]
    email = request_info["email"]
    relationship = request_info["relationship"]

    html = f"""
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 500px; margin: 0 auto;">
  <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <h1 style="font-size: 20px; margin: 0 0 8px; color: #1a1a1a;">🦎 New Lizard Lens Access Request</h1>
    <p style="color: #666; font-size: 14px; margin: 0 0 24px;">Someone wants to watch Blappy &amp; Pineapple!</p>

    <div style="background: #f9f9f9; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
      <p style="margin: 0 0 8px; font-size: 13px;"><span style="color: #888;">Name:</span> <strong>{name}</strong></p>
      <p style="margin: 0 0 8px; font-size: 13px;"><span style="color: #888;">Email:</span> {email}</p>
      <p style="margin: 0; font-size: 13px;"><span style="color: #888;">Relationship:</span> {relationship}</p>
    </div>

    <a href="{ADMIN_URL}" style="display: inline-block; background: #10b981; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
      Review &amp; Approve →
    </a>
  </div>
</div>
"""

    sg = SendGridAPIClient(SG_KEY)
    message = Mail(
        from_email=Email("andi@barrioenergy.com", "NAW Games — Lizard Lens"),
        to_emails=To(ADMIN_EMAIL),
        subject=f"🦎 Lizard Lens Access Request from {name}",
        html_content=Content("text/html", html),
    )
    response = sg.send(message)
    print(f"  Email sent to {ADMIN_EMAIL} — status {response.status_code}")

def main():
    if not SG_KEY:
        print("ERROR: SENDGRID_API_KEY not set")
        sys.exit(1)

    token = get_firestore_token()
    pending = get_pending_requests(token)

    if not pending:
        # Nothing to do
        return

    print(f"Found {len(pending)} new pending request(s)")

    for req in pending:
        print(f"  Notifying about: {req['name']} ({req['email']})")
        try:
            send_notification(req)
            mark_notified(token, req["doc_path"])
            print(f"  ✓ Done: {req['name']}")
        except Exception as e:
            print(f"  ✗ Error notifying about {req['name']}: {e}")

if __name__ == "__main__":
    main()
