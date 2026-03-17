# KeyHero — Guitar Hero Clone (Shake It Off)

**File:** `public/games/keyhero.html`
**Preview:** `public/images/keyhero-preview.png`
**Audio:** `public/games/shake-it-off.ogg`
**Registered in:** `src/lib/games.js`
**Live:** https://nawgames.com/games/keyhero

---

## Overview

KeyHero is a Guitar Hero / rhythm game clone built as a single-file HTML canvas game. Players press keyboard keys (or tap mobile buttons) in time with a falling-note chart synchronized to the Shake It Off backing track. Features 6 difficulty/hand combinations: Easy / Medium / Hard × Left Hand (ASDF) / Right Hand (JKL;).

---

## Architecture

### Audio Engine

The game uses a **pre-rendered OGG backing track** (`shake-it-off.ogg`) played via Web Audio API's `AudioBufferSourceNode`. This approach gives zero drift — all timing is derived from a single clock:

```javascript
// Single source of truth for timing
let songStartTime = 0;  // audioCtx.currentTime when song started

function getCurrentBeat() {
  return (audioCtx.currentTime - songStartTime) * (BPM / 60);
}
```

**Why OGG instead of synthesized audio:**
Earlier versions used a Web Audio lookahead scheduler to synthesize notes in real-time. This caused audio/visual drift because multiple AudioNodes created simultaneously have scheduling jitter. The OGG approach locks everything to one `AudioBufferSourceNode` started at a known `currentTime`.

**Track loading:**
```javascript
fetch('/games/shake-it-off.ogg')
  .then(r => r.arrayBuffer())
  .then(ab => audioCtx.decodeAudioData(ab))
  .then(buf => { trackBuffer = buf; trackLoaded = true; });
```

**Track playback (at game start):**
```javascript
trackSource = audioCtx.createBufferSource();
trackSource.buffer = trackBuffer;
const gain = audioCtx.createGain();
gain.gain.value = 0.55;
trackSource.connect(gain);
gain.connect(audioCtx.destination);
trackSource.start(songStartTime, 0);
```

---

## MIDI -> OGG Pipeline

### Source MIDI

**Site:** https://www.midis101.com
**Song:** Taylor Swift — Shake It Off
**MIDI ID:** 94713
**Direct download URL:** `https://www.midis101.com/download/94713-taylor-swift-shake-it-off`
**Page URL:** `https://www.midis101.com/free-midi/94713-taylor-swift-shake-it-off`

> **IMPORTANT:** The download URL requires a `Referer` header matching the page URL. Without it the server returns garbage data.

```bash
curl -L \
  -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" \
  -H "Referer: https://www.midis101.com/free-midi/94713-taylor-swift-shake-it-off" \
  -o /tmp/shake_midis101.mid \
  "https://www.midis101.com/download/94713-taylor-swift-shake-it-off"
```

Verify it's a real MIDI file:
```bash
file /tmp/shake_midis101.mid
# Should output: Standard MIDI data (format 1) using 14 tracks
```

### MIDI Structure (Shake It Off)

| Track | Channel | Instrument | Program | Notes | Role |
|-------|---------|-----------|---------|-------|------|
| 0 | - | Tempo/meta | - | - | 160 BPM |
| 1-9 | various | - | - | - | Accompaniment |
| **10** | **8** | **Alto Sax** | **66** | **360** | **Main melody** |
| 11-13 | various | Drums, etc. | - | - | - |

**Track 10 stats:**
- 360 notes
- MIDI pitch range: 67-86 (G4 to D6)
- Beat range: 14.0 - 582.5
- BPM: 160

### Rendering WAV -> OGG

```bash
# On Vultr server (209.250.250.75)

# Render MIDI to WAV using FluidSynth + FluidR3_GM soundfont
fluidsynth -ni \
  -F /tmp/shake_kh.wav \
  /usr/share/sounds/sf2/FluidR3_GM.sf2 \
  /tmp/shake_midis101.mid

# Convert WAV to OGG (q6 = ~192kbps, good quality)
ffmpeg -i /tmp/shake_kh.wav \
  -c:a libvorbis -q:a 6 \
  /opt/nawgames/public/games/shake-it-off.ogg

# Verify output
ls -lh /opt/nawgames/public/games/shake-it-off.ogg
# Should be ~4-5 MB, ~3:48 duration
```

**Dependencies on Vultr:**
- `fluidsynth` -- `/usr/bin/fluidsynth`
- `FluidR3_GM.sf2` -- `/usr/share/sounds/sf2/FluidR3_GM.sf2`
- `ffmpeg` -- standard install

---

## Note Chart Extraction

The note chart is extracted from Track 10 of the MIDI file using Python's `mido` library.

### Extraction Script

```python
import mido, math

mid = mido.MidiFile('/tmp/shake_midis101.mid')
tpb = mid.ticks_per_beat  # 960
BPM = 160
TICKS_PER_BEAT = tpb

# Find Track 10 (index 10)
track = mid.tracks[10]

def ticks_to_beats(ticks):
    return ticks / TICKS_PER_BEAT

def midi_to_lane(pitch):
    # Musical register mapping -- distributes evenly across 4 lanes
    # Lane 0=A, 1=S, 2=D, 3=F
    if pitch <= 76:   return 0  # G4-E5 (lower register)
    elif pitch <= 79: return 1  # F5-G5
    elif pitch <= 81: return 2  # Ab5-A5
    else:             return 3  # Bb5+ (upper register)

notes = []
current_tick = 0
for msg in track:
    current_tick += msg.time
    if msg.type == 'note_on' and msg.velocity > 0:
        beat = ticks_to_beats(current_tick)
        lane = midi_to_lane(msg.note)
        notes.append([lane, round(beat, 4)])

print(f"Total notes: {len(notes)}")
print(f"Beat range: {notes[0][1]} - {notes[-1][1]}")
```

### Lane Mapping Rationale

Equal-range MIDI bucketing (dividing pitch range into 4 equal parts) fails for this melody because notes cluster in the G5-B5 range, giving a lopsided distribution (1/13/56/30%). Musical register mapping uses quartile breakpoints:

```
MIDI <= 76  -> Lane 0 (A key) -- lower phrases
MIDI 77-79  -> Lane 1 (S key) -- mid-low
MIDI 80-81  -> Lane 2 (D key) -- mid-high
MIDI >= 82  -> Lane 3 (F key) -- upper phrases
```

Result: 15% / 26% / 29% / 30% distribution -- much more playable.

---

## Difficulty & Note Charting

### Phrase-Aware Selection

Research into rhythm game design shows "every Nth note" charting is unmusical. The game uses phrase-aware algorithms that select notes corresponding to melodic phrase starts.

**Easy -- firstInWindow(4.0)**: First note in each 4-beat window. ~72-102 notes, ~0.63 notes/sec. Research sweet spot for beginners.

**Medium -- varietyChart(2.0)**: One note per 2-beat window, avoiding same lane twice, preferring strong beats. ~130-171 notes, ~1.14 notes/sec.

**Hard**: All 360 notes.

```javascript
function firstInWindow(windowBeats) {
  const wins = {};
  SONG.notes.forEach(n => {
    const key = Math.floor(n[1] / windowBeats);
    if (!(key in wins) || n[1] < wins[key][1]) wins[key] = n;
  });
  return Object.values(wins).sort((a, b) => a[1] - b[1]);
}

function varietyChart(windowBeats) {
  const wins = {};
  SONG.notes.forEach(n => {
    const key = Math.floor(n[1] / windowBeats);
    if (!wins[key]) wins[key] = [];
    wins[key].push(n);
  });
  const result = [];
  let prevLane = -1;
  Object.keys(wins).map(Number).sort((a,b)=>a-b).forEach(key => {
    const cands = wins[key];
    const diff  = cands.filter(n => n[0] !== prevLane);
    const pool  = diff.length ? diff : cands;
    const strong = pool.filter(n => Math.abs(n[1] - Math.round(n[1])) < 0.01);
    const best   = (strong.length ? strong : pool).reduce((a,b) => b[1] < a[1] ? b : a);
    result.push(best);
    prevLane = best[0];
  });
  return result;
}
```

### Hit Windows & Fall Speeds

| Difficulty | Perfect window | Good window | Fall speed |
|------------|---------------|-------------|------------|
| Easy       | +/-0.55 beats | +/-0.85 beats | 10.0 beats |
| Medium     | +/-0.28 beats | +/-0.48 beats | 5.5 beats  |
| Hard       | +/-0.12 beats | +/-0.22 beats | 2.5 beats  |

---

## Hand Mode System

Two hand modes let players use either side of the keyboard:

| Mode | Keys | Key Codes |
|------|------|-----------|
| Left Hand  | A, S, D, F | KeyA, KeyS, KeyD, KeyF |
| Right Hand | J, K, L, ; | KeyJ, KeyK, KeyL, Semicolon |

```javascript
const HAND_KEYS  = [['A','S','D','F'], ['J','K','L',';']];
const HAND_CODES = [['KeyA','KeyS','KeyD','KeyF'], ['KeyJ','KeyK','KeyL','Semicolon']];
let selectedHand = 0;
let LANE_KEYS = HAND_KEYS[0].slice();
let LANE_KEY_CODES = HAND_CODES[0].slice();

function selectHand(h) {
  selectedHand   = h;
  LANE_KEYS      = HAND_KEYS[h].slice();
  LANE_KEY_CODES = HAND_CODES[h].slice();
}
```

---

## Anticipation Glow

Hit circles pulse/grow as the next note approaches within 2 beats:

```javascript
const beatsAway = nextNote.beat - currentBeat;
if (beatsAway < 2 && beatsAway > 0) {
  const glow = 1 - (beatsAway / 2);  // 0->1 as note approaches
  // Draw larger/brighter circle scaled by glow
}
```

---

## Adding a New Song

1. Find MIDI on midis101.com -- note the numeric ID from the URL
2. Download with Referer header (see curl command above)
3. Inspect tracks with `mido` to find the melody track
4. Check lane distribution -- run extraction script and verify spread is not lopsided
5. Render OGG with FluidSynth -> ffmpeg, save to `public/games/{song-slug}.ogg`
6. Extract note chart, save as JS array in game file or `/public/games/{slug}-chart.json`
7. Add song selector UI to keyhero.html start screen
8. Update `SONG` object dynamically based on selection before calling `startGame()`

---

## Deployment

All files live in the repo at `/opt/nawgames` on Vultr (209.250.250.75).

```bash
cd /opt/nawgames

TOKEN=$(python3 -c "
import base64, hashlib
with open('/etc/machine-id') as f: mid = f.read().strip()
key = hashlib.sha256(mid.encode()).digest()
with open('/opt/barrio-secrets/github_token.enc') as f: enc = f.read().strip()
dec = bytes([a ^ b for a, b in zip(base64.b64decode(enc), key * 2)])
print(dec.decode().strip())
")
git remote set-url origin "https://${TOKEN}@github.com/ipinney/NAWgames.com.git"
git add -A
git commit -m "your message here"
git push origin main
git remote set-url origin "https://github.com/ipinney/NAWgames.com.git"
```

---

## Troubleshooting

**Audio doesn't start on mobile:** Mobile browsers require a user gesture. Call `ensureAudio()` inside button click handler, not on page load.

**Notes out of sync:** Verify `songStartTime` is set to `audioCtx.currentTime` immediately before `trackSource.start(songStartTime, 0)`.

**MIDI download returns garbage:** midis101.com requires the `Referer` header. See curl command above.

**Lane distribution is lopsided:** Use musical register breakpoints (<=76, 77-79, 80-81, >=82) rather than equal-range bucketing.

**JS syntax error after edit:** Always validate: `node --check /opt/nawgames/public/games/keyhero.html`
