# MS-2000 Mosquito Shooter: plan v9 (Sep 16, 2026)

Repo copy of the claude.ai Project file claude/mosquito-turret-plan.md. Keep both in sync.

## Start of every session
1. Another session (chat or Cowork) may have changed things. Before editing, run on Vultr:
   `cd /opt/nawgames && git status --short && git log --oneline -10`
   and read `/opt/nawgames/tools/ms2000-cad/PROGRESS.md` (CAD checkpoint) and this file.
2. Read the page you are about to change in full before editing it.
3. If Ivan says another session is working, research only; no writes.

## Live pages (nawgames.com)
- Hub: /projects/addie/mosquito-turret (school due dates, build timeline, rules, page cards)
- Fair guide: /projects/addie/mosquito-turret/fair (due dates, part-by-part guide, variables, Catholic connection, sources, journal, judges, rubric self-score)
- Build: /projects/addie/mosquito-turret/build (steps, how it works, shopping list from parts.js, 3D models, print files, links into the build guide)
- Build guide (static): /projects/addie/ms2000-build-guide.html (16 steps, wiring maps, screw table, 7 MakeCode programs, fixes, glossary)
- Print plan: /projects/addie/mosquito-turret/build/batches
- Learn: /projects/addie/mosquito-turret/learn (11 lessons + glossary)
- Build your own: /projects/addie/mosquito-turret/make (Level 1 micro:bit hit detector with code, Level 2 camera tracker no laser, Level 3 full MS-2000; fair question ideas; grown-up notes)
- Full plan (static): /projects/addie/mosquito-turret.html
- Parts list PDF: /projects/addie/ms2000-parts-list.pdf
- 3D: /projects/addie/ms2000-cad/ (ms2000-turret-3d.html main, ms2000-3d.html whole setup, index.html parts)
- Addie's projects index: /projects/addie (card dueLabel Feb 1, 2027)

## Repo map (Vultr /opt/nawgames, push to main deploys on Vercel in ~1 min)
- src/app/projects/addie/mosquito-turret/
  - ui.js: BASE, CAD, PLAN, PARTS_PDF, meta(), Nav (TABS: overview, fair, build, print, learn, make), Back, Btn, Section, Title, Steps, Placeholder
  - fair.js: DUE (6 school parts with rubric ids), EVENTS (Feb 3, Feb 25), RUBRIC (9 rows), SCORES, daysUntil. Single source for school dates.
  - DueDates.js (client): timeline with days left, next highlighted; `compact` prop hides rubric line (used on hub)
  - RubricCheck.js (client): tap 0/1/3/5 per row, total /45, not saved
  - page.js: hub. PHASES array drives "Where we are" (status done/now/next). To advance a phase edit PHASES here AND the `now` class in the plan HTML "The plan" card.
  - fair/page.js, make/page.js, learn/page.js, build/page.js, build/batches/page.js
  - parts.js: generated from tools/ms2000-parts-list/build.py (export_parts.py). Do not hand-edit.
- public/projects/addie/mosquito-turret.html: static full plan (ids: requirements, lethal, problem, pick, design, prints, experiment, demo, parts, safety, plan)
- tools/ms2000-parts-list: edit build.py data, python3 build.py, node render.js, /opt/pdfenv/bin/python darken.py raw.pdf public/projects/addie/ms2000-parts-list.pdf
- tools/ms2000-cad: CAD workspace, PROGRESS.md checkpoint, `PY=/opt/cad-venv/bin/python ./run.sh`
- Nolan's Dusty (the pattern this copies): src/app/projects/nolan/dusty (page.js, DueDates.js, build/), public/projects/nolan/*.html

## Build, check, deploy (gotchas)
- Local build fails at prerender without Firebase env (every page, not our code). Build with dummy env:
  NEXT_PUBLIC_FIREBASE_API_KEY=AIzaDummyKeyForLocalBuildOnly000000000 plus APP_ID, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID set to any value, then `npx next build`.
- Before `next start -p 3917`, check nothing is already listening (`ss -ltnp | grep 3917`); a stale server from an earlier session serves mismatched files (React error 423, wrong page heights).
- Put build + `npx next start -p 3917` + screenshots in a script file (/tmp/nawcheck.sh) and run it with bash. Never `pkill -f "next start..."` or `pgrep -f next-server | xargs kill` inline: the pattern matches the shell's own command line and kills the whole call.
- Screenshots: /opt/batchzero/venv/bin/python (playwright), 390x844. Check `document.documentElement.scrollWidth == 390` for sideways overflow. Grid children holding `<pre>` need `[&>*]:min-w-0`.
- PIL is in system python3 on Vultr, not in the batchzero venv. Screenshots cannot be viewed from chat by base64 dumping; rely on scrollWidth, page errors, and element checks.
- Btn/Link: PLAN (/projects/addie/mosquito-turret.html) starts with BASE, so Btn renders it as a Next Link. Works, but it is a static file.
- JSX text: use &apos; not \u2019 (escapes render literally in JSX text; fine inside JS strings).
- Deploy: commit, then push with the decrypted token (see nawgames skill Deploy Commands), then reset the remote URL. Verify with curl on the live URLs.
- Writing style on the site: no em dashes, plain words, kid-readable.

## St. Rose Elementary Science Fair 2026-2027 (3rd grade, Miss Taggart)
Sources: due-date sheet, parent letter (Aug 19, 2026, Mrs. Naeher), SRL 3rd/5th rubric.
Each part is its own grade. Project also counts for writing (journal) and handwriting grades.
1. Question: Wed Nov 18
2. Research notes (3-5 bullets), bibliography (2-3 sources), Catholic connection: Wed Dec 2
3. Hypothesis: Wed Dec 9
4. Conduct and complete experiments: Tue Jan 19
5. Data/results and conclusion: Mon Jan 25
6. Final project: Mon Feb 1, 2027
- Exhibition: Wed Feb 3, 2027, 2:00 PM, Parish Hall (letter says 2026; typo)
- Archdiocesan Science Fair: Thu Feb 25, 2027, for school winners
- Journal: handwritten, cursive, required. Board may be typed/printed (title/question, photos, data, graphs, captions).
- Research and writing happen in class (science with Miss Taggart, writing with Mrs. D'Amico, STREAM with Miss Delano). Board and experiments at home.
- Site gives prompts and checklists, not finished text. Addie writes her own words.
Rubric (0 not evident, 1 not clear, 3 somewhat clear, 5 very clear; 9 rows, 45 max): purpose/hypothesis/variables; procedure and materials; data and results; analysis and conclusions; religion reflection; journal; display; oral presentation; other (originality, creativity, presentation, multiple trials).

## Status (Sep 16)
Done: brainstorm, requirements, design pick (A), design lock, 3D print design (12 parts, 5 plates, ~10 h, ~320 g), parts list, website fair guide + build-your-own (commit 0c76d1e), build guide (commit b04f515).
Now: order parts by Sep 30; start the cursive journal (catch-up entries for Sep 15 and Sep 16).
Still by hand: Addie's written reason for A and labeled drawing (journal); ask Miss Taggart about laser rules (Parish Hall and Archdiocesan fair; no published Archdiocesan elementary laser rules found).
Build guide written (Sep 16). Next on the site when it happens: photos and real-part corrections in the guide, advancing PHASES.

## Schedule (refit to Feb 1)
- By Sep 30: order parts, start journal
- Oct 1 to Nov 13: print and build (mosquito + wand, pan-tilt head, backdrop + pendulum, code + sounds); caliper check first, reprint anything off
- Nov 14 to Dec 11: teach camera, pick hit threshold, practice runs, verify data saves. School: question Nov 18, research Dec 2, hypothesis Dec 9 (hypothesis before first real run)
- Dec 12 to Jan 15: experiments, 30 runs, one test per day, winter break; buffer to Jan 19 for redos
- Jan 16 to Jan 25: averages, 2 bar graphs, conclusion
- Jan 26 to Feb 1: trifold board, finish journal, demo practice
- Feb 3 exhibition; Feb 25 Archdiocesan if picked

## Decisions (Sep 15-16)
- Design A picked by Addie: Pan and Tilt Camera Turret. B (lock the tilt) is the fallback. C is out.
- Name: MS-2000 (Mosquito Shooter).
- Lasers required. Class 2 <1 mW kept; lethal laser (~14 W, Class 4) not adopted.
- Trainable on a fake mosquito on a fishing line held by a person; hits affirmatively shown. Stuffed mosquito bought; only a clip-on sensor pod is printed. Poster board backdrop, no printed flight zone.
- Tracking is automatic: HuskyLens (Object Tracking, ID1) reports the box center; the turret micro:bit moves pan (P1) and tilt (P2) by (offset from 160,120) / 20 degrees each loop, clamped to limits, and fires when within 12 px, at most once per second, only during a wand-started run. No search sweep yet: if the camera loses the mosquito the head holds still.
- Sound effects required: laser pew or cannon boom on fire (chosen with the wand's touch logo; turret buttons are inside the base), lock-on beep, hit splat on wand, victory sound on turret. DFRobot FIT0449 speaker module, grille in printed base.
- Experiment and data gathering is a core requirement.
- Experiment reframed (Sep 16): engineering goal + science question "what makes it miss". Light test dropped (it mostly tested the HuskyLens); target size test added.
- 3 ft fair table (Sep 16): laser recalibrated to cross the camera line at 3 ft (P4 toe 2.37 deg; dot 12.6 mm off at 2 and 4 ft, face tolerates ~17 mm, so good ~2 to 4.3 ft). Distance test dropped. Every run at 3 ft; fair demo 2 to 3 ft. Board materials page: /projects/addie/ms2000-board.html.
- Budget flexible (~$192 primary + ~$35 local). Printer: Flashforge Adventurer 5M. All equipment in printed housings.

## Experiments and data
Engineering goal: Can I build a robot that finds, tracks, and hits a flying mosquito by itself?
Science question: What makes the MS-2000 miss more: a faster mosquito or a smaller one? Hits = accuracy; the test that drops hits most is the biggest cause of misses.
- All runs at 3 ft (914 mm lens to pod), where the laser crosses the camera line.
- Test 1 speed: pendulum release 10/20/30 deg, 40 mm cover, room lights
- Test 2 target size: black paper cover over the 40 mm pod face with a 40/20/10 mm hole (10 mm ~ real mosquito; same outside size so camera sees the same object; train once, no retraining between covers); 10 deg, room lights
- Wand names array: speed 10/20/30, size 40/20/10 (pick 0..5). Light level still logged as a room check.
- 5 runs each, 30 total, 30 s per run. Measured: hits in 30 s, time to first hit. Controls: room, batteries, person on the line.
- Wand micro:bit V2 datalogger saves test, setting, run, hits, time to first hit, light level; MY_DATA opens as table/graph/CSV and survives power off. Paper backup sheet.
- Rules: every run counts, 5 per setting, redo only broken runs with a note, one test per day, photo each setup. Averages, one bar graph per test, conclusion frame.

## Lethality math (Keller et al., Sci Rep 2020)
LD90 ~7.1 J/cm2, 2.5 mm beam, 25 ms: 0.35 J, ~14 W. 1 mW ~14,000x short; 5 mW ~2,800x short. ISEF allows Class 1, 2, 3A, 3R only.

## Final parts list (locked Sep 16; links checked Sep 15-16)
Primary, 2 suppliers, $191.94 before shipping/tax:
- DFRobot $154.70: micro:bit V2 MBT0039 x2 $45.80; Xia mi MBT0042 $29.90; HuskyLens SEN0305 $34.90; clutch servo SER0049 x3 $14.70; speaker FIT0449 $6.00; 4xAA holder FIT0918 (switch, DC2.1) $2.00; 2xAAA PH2.0 holder FIT0625 x2 $2.50; M2 kit FIT0665 $12.90; Gravity cables FIT0031 $6.00. Ships from US warehouse by UPS.
- DigiKey $37.24: Quarton VLM-650-03 LPT $25.03; Adafruit 805 arm switch ~$0.95; Adafruit 2748 ALS-PT19 x3 $7.50; Kingbright WP7113ID red LED x10 $1.45; Yageo 220 ohm x10 $0.36; Adafruit 3891 4-wire 28AWG ribbon $1.95.
- Local ~$35: AA/AAA batteries, stuffed mosquito, rod + line, black foam board + dowels, white PLA, craft; solder, micro-USB cables on hand. All-in ~$227.
Backups: Adafruit 4781, micro:Driver DFR0548, DigiKey HuskyLens $54.90, Adafruit SG92R, Quarton VLM-650-22 LPT (Class II), Adafruit 805/2748/297/2780/3890, PAM8302 2130 + speaker 3923, Adafruit 771, Adafruit 4193 (4191 OOS), FIT0665 and FIT0031 via DigiKey. Backup total $174.35 excluding laser.

## Locked design (Sep 16)
- Board: DFRobot Xia mi MBT0042 (5 V HuskyLens I2C port; 5 V GPIO P0 P1 P2 P8; relay + 4 motor channels; 5-12 V external input). micro:Driver is backup.
- Ports: HuskyLens on 5 V HuskyLens port; pan servo P1, tilt P2, speaker P0; P8 spare.
- Laser path: 5 V port -> arm switch -> board relay -> laser.
- Wand: sensor VIN/GND to 3V/GND, OUT -> P0; LED anodes via 220 ohm -> P1.
- Clutch servos. M2 hardware for printed parts; HuskyLens uses its own M3 kit.
- Check on arrival: Xia mi external power connector, whether board powers micro:bit, which 5 V port servos run best on; calipers on board, servos, packs, switch, mosquito, then rebuild CAD.

## Open items
- Place the DFRobot and DigiKey orders (by Sep 30)
- Laser rules from Miss Taggart (school and Archdiocesan)
- Journal: start now; reason for A; labeled drawing
- Photos and real-part corrections into ms2000-build-guide.html as the build happens
