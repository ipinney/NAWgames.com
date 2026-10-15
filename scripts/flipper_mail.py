#!/usr/bin/env python3
"""House Flipper emails to Ivan.

  flipper_mail.py grad     - every 15 min: send the graduation email once when Addie graduates.
  flipper_mail.py weekly   - Sundays 6 pm Central: weekly summary of the past 7 days.
  flipper_mail.py weekly --dry   - render the weekly email to /tmp/flipper_weekly.html, send nothing.

Reads Firestore (chorizomejor-app) with the shared service account and sends with SendGrid,
the same path notify_lizardlens.py uses. Output is pure ASCII HTML (entities only).
"""
import json, os, sys, html, urllib.request
from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo
from dotenv import load_dotenv

load_dotenv("/opt/cmejor-newsletter/.env")
import google.auth.transport.requests
from google.oauth2 import service_account
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Email, To, Content

SG_KEY = os.getenv("SENDGRID_API_KEY", "")
SA_PATH = "/opt/cmejor-newsletter/firebase-sa.json"
PROJECT = "chorizomejor-app"
TO = "ivan@barrioenergy.com"
UID = "zy8WSqtL3GUuyw89u1X1ZzENULP2"
URL = "https://nawgames.com/projects/addie/house-flipper"
BASE = f"https://firestore.googleapis.com/v1/projects/{PROJECT}/databases/(default)/documents"
CT = ZoneInfo("America/Chicago")
LEVELS = {1: "Rookie Flipper", 2: "House Hunter", 3: "Fix-It Planner", 4: "Price Detective",
          5: "Deal Maker", 6: "Money Raiser", 7: "Partner Builder", 8: "Pitch Pro"}


def token():
    c = service_account.Credentials.from_service_account_file(SA_PATH, scopes=["https://www.googleapis.com/auth/datastore"])
    c.refresh(google.auth.transport.requests.Request())
    return c.token


def http(method, url, tok, body=None):
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=method, headers={"Authorization": f"Bearer {tok}", "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return json.loads(r.read() or b"{}")
    except urllib.error.HTTPError as e:
        if e.code == 404:
            return None
        raise


def val(v):
    if v is None:
        return None
    k, x = next(iter(v.items()))
    if k in ("stringValue", "booleanValue", "timestampValue"):
        return x
    if k == "integerValue":
        return int(x)
    if k == "doubleValue":
        return float(x)
    if k == "nullValue":
        return None
    if k == "arrayValue":
        return [val(i) for i in x.get("values", [])]
    if k == "mapValue":
        return {kk: val(vv) for kk, vv in x.get("fields", {}).items()}
    return x


def doc(tok, path):
    d = http("GET", f"{BASE}/{path}", tok)
    return {k: val(v) for k, v in d.get("fields", {}).items()} if d else None


def a(s):
    """ASCII-safe HTML text."""
    s = str(s).replace("—", ", ").replace("–", "-").replace("’", "'").replace("‘", "'").replace("“", '"').replace("”", '"')
    return html.escape(s).encode("ascii", "xmlcharrefreplace").decode("ascii")


def money(n):
    n = int(round(n or 0))
    return ("-$" if n < 0 else "$") + f"{abs(n):,}"


def send(subject, body_html):
    page = f'<html><body style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#111">{body_html}<p><a href="{URL}">Open House Flipper</a></p></body></html>'
    page.encode("ascii")  # raises if anything non-ASCII slipped through
    if not SG_KEY:
        raise SystemExit("SENDGRID_API_KEY missing")
    m = Mail(from_email=Email("beto@chorizomejor.com", "House Flipper"), to_emails=To(TO), subject=subject, html_content=Content("text/html", page))
    r = SendGridAPIClient(SG_KEY).send(m)
    print(datetime.now().isoformat(), "sent", subject, r.status_code)


def grad():
    tok = token()
    p = doc(tok, f"hf_profile/{UID}")
    if not p or not p.get("gradEmailPending"):
        return
    flips = [f for f in (p.get("flips") or []) if (f.get("profit") or 0) > 0]
    parts = [f"Practice flip {f.get('practice')}: {a(f.get('address'))}, {money(f.get('profit'))} profit" for f in flips[-3:]]
    body = (f"<p>Addie graduated from Flip Academy today and earned her Flipper License.</p>"
            f"<p>She finished all 8 skill levels and won three practice flips: {'; '.join(parts)}.</p>"
            f"<p>Real Deals is unlocked on her home screen as a placeholder. Building it out (real Houston properties, the pitch to you and Sarah) is the next phase.</p>")
    send("Addie graduated from Flip Academy", body)
    http("PATCH", f"{BASE}/hf_profile/{UID}?updateMask.fieldPaths=gradEmailPending", tok, {"fields": {"gradEmailPending": {"booleanValue": False}}})


def weekly(dry=False):
    tok = token()
    p = doc(tok, f"hf_profile/{UID}") or {}
    now = datetime.now(CT)
    since = now - timedelta(days=7)
    days = [(now - timedelta(days=i)).strftime("%Y-%m-%d") for i in range(7)]

    def recent(iso):
        try:
            return datetime.fromisoformat(iso.replace("Z", "+00:00")) >= since.astimezone(timezone.utc)
        except Exception:
            return False

    lv = p.get("levels") or {}
    new_levels = sorted(int(k) for k, v in lv.items() if v and recent(v.get("at", "")))
    flips = [f for f in (p.get("flips") or []) if recent(f.get("at", ""))]
    kid, redirects, spend, turns = [], [], 0.0, 0
    for d in days:
        s = doc(tok, f"hf_sessions/{UID}_{d}")
        if s:
            msgs = s.get("messages") or []
            for i, m in enumerate(msgs):
                if m.get("role") == "kid":
                    kid.append(m.get("text", ""))
                    nxt = msgs[i + 1].get("text", "") if i + 1 < len(msgs) else ""
                    if any(w in nxt.lower() for w in ["mom or dad", "mom and dad", "private", "house-flipping fox", "steer", "back to the houses"]):
                        redirects.append(m.get("text", ""))
        u = doc(tok, f"hf_usage/{UID}_{d}")
        if u:
            spend += u.get("usd") or 0
            turns += u.get("turns") or 0

    if not new_levels and not flips and not kid:
        print(now.isoformat(), "no activity this week, nothing sent")
        return

    paras = []
    done = len([k for k, v in lv.items() if v])
    line = f"Addie is at {p.get('xp', 0)} XP with {done} of 8 skill levels done and {p.get('profitableFlips', 0)} of 3 practice flips won."
    if new_levels:
        line += " This week she finished " + ", ".join(f"Level {n} ({LEVELS.get(n, '')}, {lv[str(n)].get('score', 0)} stars)" for n in new_levels) + "."
    paras.append(a(line))
    if flips:
        paras.append(a("Practice flips this week: " + "; ".join(
            f"flip {f.get('practice')} at {f.get('address')}, planned {money(f.get('planned'))}, actual {money(f.get('profit'))} over {f.get('months')} months" for f in flips) + "."))
    if kid:
        sample = [k for k in kid if len(k) > 6][-8:]
        paras.append(a(f"She asked Flip {len(kid)} questions. Recent ones: ") + "; ".join(f'"{a(k[:140])}"' for k in sample) + ".")
    if redirects:
        paras.append(a("Flip steered these back on topic or told her to keep personal details private: ") + "; ".join(f'"{a(k[:140])}"' for k in redirects[-5:]) + ".")
    else:
        paras.append("Flip did not need to redirect anything this week.")
    paras.append(a(f"Coach spend for the week: {money(spend) if spend >= 1 else '$' + format(spend, '.2f')} across {turns} chat turns (cap is $5 a day)."))
    body = "".join(f"<p>{x}</p>" for x in paras)
    subject = f"House Flipper: Addie's week ({now.strftime('%b %-d')})"
    if dry:
        open("/tmp/flipper_weekly.html", "w").write(body)
        print("DRY", subject)
        print(body)
        return
    send(subject, body)


if __name__ == "__main__":
    mode = sys.argv[1] if len(sys.argv) > 1 else ""
    if mode == "grad":
        grad()
    elif mode == "weekly":
        n = datetime.now(CT)
        # Cron fires at two UTC hours to cover daylight saving; only Sunday 6 pm Central sends.
        if "--dry" in sys.argv or "--force" in sys.argv or (n.weekday() == 6 and n.hour == 18):
            weekly(dry="--dry" in sys.argv)
    else:
        print(__doc__)
