#!/usr/bin/env python3
"""
KeyHero Song Auto-Builder
Checks keyhero_song_requests in Firestore for pending requests,
finds MIDI files, renders OGG audio, extracts note charts,
and injects the new song into keyhero.html.

Usage: python3 /opt/nawgames/scripts/build_keyhero_song.py
"""

import json, os, sys, re, subprocess, urllib.request, urllib.parse, urllib.error
import mido
import math
import hashlib

# ── Firestore helpers ──────────────────────────────────────────

def get_creds():
    import google.auth.transport.requests
    from google.oauth2 import service_account
    creds = service_account.Credentials.from_service_account_file(
        '/opt/cmejor-newsletter/firebase-sa.json',
        scopes=['https://www.googleapis.com/auth/datastore']
    )
    creds.refresh(google.auth.transport.requests.Request())
    return creds

def firestore_get(creds, collection):
    url = f'https://firestore.googleapis.com/v1/projects/chorizomejor-app/databases/(default)/documents/{collection}'
    req = urllib.request.Request(url, headers={'Authorization': f'Bearer {creds.token}'})
    return json.loads(urllib.request.urlopen(req).read())

def firestore_update_status(creds, doc_id, status):
    url = f'https://firestore.googleapis.com/v1/projects/chorizomejor-app/databases/(default)/documents/keyhero_song_requests/{doc_id}?updateMask.fieldPaths=status'
    body = json.dumps({'fields': {'status': {'stringValue': status}}}).encode()
    req = urllib.request.Request(url, data=body, method='PATCH',
        headers={'Authorization': f'Bearer {creds.token}', 'Content-Type': 'application/json'})
    urllib.request.urlopen(req)

# ── MIDI sourcing ──────────────────────────────────────────────

def slugify(text):
    """Convert text to URL-friendly slug."""
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_]+', '-', text)
    text = re.sub(r'-+', '-', text)
    return text.strip('-')

def search_midis101(song_name, artist):
    """Search midis101.com for a MIDI file. Returns (midi_id, slug) or None."""
    queries = [
        f"{artist} {song_name}",
        f"{song_name} {artist}",
        song_name,
    ]
    for query in queries:
        try:
            # midis101 needs + for spaces, not %20
            encoded = query.replace(' ', '+')
            url = f'https://www.midis101.com/search/{encoded}'
            req = urllib.request.Request(url, headers={
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
            })
            html = urllib.request.urlopen(req, timeout=15).read().decode('utf-8', errors='ignore')
            # Look for links like /free-midi/12345-artist-song-name
            matches = re.findall(r'/free-midi/(\d+)-([a-z0-9-]+)', html)
            if matches:
                # Try to find best match by checking if artist or song name appears in slug
                artist_slug = slugify(artist)
                song_slug = slugify(song_name)
                for mid_id, mid_slug in matches:
                    if artist_slug[:6] in mid_slug or song_slug[:6] in mid_slug:
                        return (mid_id, mid_slug)
                # Fall back to first result
                return (matches[0][0], matches[0][1])
        except Exception as e:
            print(f"  midis101 search failed for '{query}': {e}")
    return None

def download_midis101(midi_id, midi_slug, output_path):
    """Download a MIDI from midis101.com with proper Referer header."""
    page_url = f'https://www.midis101.com/free-midi/{midi_id}-{midi_slug}'
    dl_url = f'https://www.midis101.com/download/{midi_id}-{midi_slug}'
    req = urllib.request.Request(dl_url, headers={
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Referer': page_url,
    })
    try:
        data = urllib.request.urlopen(req, timeout=30).read()
        if len(data) < 100 or data[:4] not in (b'MThd', b'RIFF'):
            print(f"  Downloaded data doesn't look like MIDI ({len(data)} bytes, starts with {data[:4]})")
            return False
        with open(output_path, 'wb') as f:
            f.write(data)
        print(f"  Downloaded MIDI: {len(data)} bytes")
        return True
    except Exception as e:
        print(f"  Download failed: {e}")
        return False

def search_freemidi_org(song_name, artist):
    """Try freemidi.org as fallback. Returns download URL or None."""
    try:
        query = urllib.parse.quote(f"{artist} {song_name}")
        url = f'https://freemidi.org/search?q={query}'
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        })
        html = urllib.request.urlopen(req, timeout=15).read().decode('utf-8', errors='ignore')
        # Look for song page links
        matches = re.findall(r'href="(/song-[^"]+)"', html)
        if matches:
            return f'https://freemidi.org{matches[0]}'
    except Exception as e:
        print(f"  freemidi.org search failed: {e}")
    return None

def find_and_download_midi(song_name, artist, output_path):
    """Try multiple sources to find and download a MIDI file."""
    print(f"  Searching for MIDI: '{song_name}' by '{artist}'")

    # Source 1: midis101.com
    print("  Trying midis101.com...")
    result = search_midis101(song_name, artist)
    if result:
        midi_id, midi_slug = result
        print(f"  Found on midis101: ID={midi_id}, slug={midi_slug}")
        if download_midis101(midi_id, midi_slug, output_path):
            return True

    # Source 2: Try variations of the song name
    variations = []
    # Remove parenthetical content
    clean_name = re.sub(r'\([^)]*\)', '', song_name).strip()
    if clean_name != song_name:
        variations.append(clean_name)
    # Remove "the" from artist
    clean_artist = re.sub(r'^the\s+', '', artist, flags=re.I).strip()
    if clean_artist != artist:
        variations.append((clean_name or song_name, clean_artist))

    for var in variations:
        if isinstance(var, tuple):
            s, a = var
        else:
            s, a = var, artist
        result = search_midis101(s, a)
        if result:
            midi_id, midi_slug = result
            print(f"  Found variation on midis101: ID={midi_id}")
            if download_midis101(midi_id, midi_slug, output_path):
                return True

    # Source 3: bitmidi.com
    print("  Trying bitmidi.com...")
    bitmidi_result = search_bitmidi(song_name, artist)
    if bitmidi_result and download_bitmidi(bitmidi_result, output_path):
        return True

    print("  Could not find MIDI from any source")
    return False

def search_bitmidi(song_name, artist):
    """Search bitmidi.com for a MIDI file. Returns a MIDI page path or None."""
    queries = [f"{artist} {song_name}", song_name]
    for query in queries:
        try:
            url = f'https://bitmidi.com/search?q={query.replace(" ", "+")}'
            req = urllib.request.Request(url, headers={
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
            })
            html = urllib.request.urlopen(req, timeout=15).read().decode('utf-8', errors='ignore')
            # Find MIDI links like /song-name-mid
            matches = re.findall(r'href="(/[^"]*-mid)"', html)
            if matches:
                artist_slug = slugify(artist)
                song_slug = slugify(song_name)
                # Try to find a match with artist or song in the URL
                for m in matches:
                    m_lower = m.lower()
                    if song_slug[:8] in m_lower or artist_slug[:6] in m_lower:
                        print(f"  Found on bitmidi: {m}")
                        return m
                # Fall back to first result
                print(f"  Found on bitmidi (first result): {matches[0]}")
                return matches[0]
        except Exception as e:
            print(f"  bitmidi search failed for '{query}': {e}")
    return None

def download_bitmidi(page_path, output_path):
    """Download MIDI from bitmidi.com."""
    try:
        # The download link on bitmidi is typically the page path with /download appended
        # or the page itself contains the direct download link
        page_url = f'https://bitmidi.com{page_path}'
        req = urllib.request.Request(page_url, headers={
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        })
        html = urllib.request.urlopen(req, timeout=15).read().decode('utf-8', errors='ignore')
        # Look for download link
        dl_matches = re.findall(r'href="([^"]*\.mid[^"]*)"', html, re.I)
        if not dl_matches:
            dl_matches = re.findall(r'href="(/uploads/[^"]+)"', html)
        if dl_matches:
            dl_url = dl_matches[0]
            if not dl_url.startswith('http'):
                dl_url = f'https://bitmidi.com{dl_url}'
            req2 = urllib.request.Request(dl_url, headers={
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
            })
            data = urllib.request.urlopen(req2, timeout=30).read()
            if len(data) > 100 and data[:4] in (b'MThd', b'RIFF'):
                with open(output_path, 'wb') as f:
                    f.write(data)
                print(f"  Downloaded from bitmidi: {len(data)} bytes")
                return True
            else:
                print(f"  bitmidi download doesn't look like MIDI ({len(data)} bytes)")
    except Exception as e:
        print(f"  bitmidi download failed: {e}")
    return False

# ── MIDI analysis ──────────────────────────────────────────────

def analyze_midi(midi_path):
    """Analyze a MIDI file: find BPM, melody track, extract pitches."""
    mid = mido.MidiFile(midi_path)
    tpb = mid.ticks_per_beat

    # Find BPM from tempo events
    bpm = 120  # default
    for track in mid.tracks:
        for msg in track:
            if msg.type == 'set_tempo':
                bpm = round(mido.tempo2bpm(msg.tempo))
                break
        if bpm != 120:
            break

    print(f"  MIDI: {len(mid.tracks)} tracks, {tpb} ticks/beat, {bpm} BPM")

    # Analyze each track for note content
    track_info = []
    for i, track in enumerate(mid.tracks):
        notes = []
        current_tick = 0
        channels = set()
        for msg in track:
            current_tick += msg.time
            if msg.type == 'note_on' and msg.velocity > 0:
                beat = current_tick / tpb
                notes.append((msg.note, beat))
                channels.add(msg.channel)
        if notes:
            pitches = [n[0] for n in notes]
            track_info.append({
                'index': i,
                'name': track.name,
                'notes': len(notes),
                'channels': channels,
                'pitch_range': (min(pitches), max(pitches)),
                'pitch_spread': max(pitches) - min(pitches),
                'avg_pitch': sum(pitches) / len(pitches),
                'raw_notes': notes,
            })
            print(f"    Track {i}: '{track.name}' - {len(notes)} notes, "
                  f"ch={channels}, range={min(pitches)}-{max(pitches)}, "
                  f"spread={max(pitches)-min(pitches)}")

    # Find best melody track:
    # - Not on channel 9 (drums)
    # - Moderate note count (not too few, not too many = probably chords)
    # - High pitch range (melody tends to be higher)
    # - Good pitch spread (not just repeated notes)
    candidates = [t for t in track_info if 9 not in t['channels'] and 10 not in t['channels']]
    if not candidates:
        candidates = track_info  # fallback

    def melody_score(t):
        note_count = t['notes']
        # Prefer tracks with 50-500 notes
        count_score = 0
        if 50 <= note_count <= 500:
            count_score = 1.0
        elif 30 <= note_count < 50 or 500 < note_count <= 800:
            count_score = 0.6
        else:
            count_score = 0.2

        # Prefer higher average pitch (melody is usually higher than bass)
        pitch_score = min(1.0, (t['avg_pitch'] - 48) / 36)

        # Prefer good pitch spread (at least 10 semitones)
        spread_score = min(1.0, t['pitch_spread'] / 20)

        # Prefer tracks named with melody-related keywords
        name_bonus = 0
        name_lower = t['name'].lower()
        for keyword in ['melody', 'vocal', 'lead', 'sax', 'flute', 'violin', 'trumpet', 'voice', 'sing']:
            if keyword in name_lower:
                name_bonus = 0.5
                break

        return count_score * 2 + pitch_score + spread_score + name_bonus

    candidates.sort(key=melody_score, reverse=True)
    best = candidates[0]
    print(f"  Selected melody track: {best['index']} ('{best['name']}', {best['notes']} notes, score={melody_score(best):.2f})")

    return {
        'bpm': bpm,
        'tpb': tpb,
        'melody_track': best['index'],
        'melody_notes': best['raw_notes'],
        'total_notes': best['notes'],
    }

def compute_lane_mapping(pitches):
    """Compute lane mapping using quartile breakpoints for even distribution."""
    sorted_p = sorted(set(pitches))
    if len(sorted_p) <= 4:
        # Very few distinct pitches - simple mapping
        mapping = {p: i for i, p in enumerate(sorted_p[:4])}
        return mapping, sorted_p

    # Use quartile breakpoints
    n = len(pitches)
    pitch_sorted = sorted(pitches)
    q1 = pitch_sorted[n // 4]
    q2 = pitch_sorted[n // 2]
    q3 = pitch_sorted[3 * n // 4]

    print(f"  Lane breakpoints: <= {q1} | {q1+1}-{q2} | {q2+1}-{q3} | >= {q3+1}")
    return (q1, q2, q3), pitch_sorted

def pitch_to_lane(pitch, breakpoints):
    """Map MIDI pitch to lane 0-3 using breakpoints."""
    if isinstance(breakpoints, dict):
        return breakpoints.get(pitch, 0)
    q1, q2, q3 = breakpoints
    if pitch <= q1: return 0
    elif pitch <= q2: return 1
    elif pitch <= q3: return 2
    else: return 3

def extract_chart(midi_info):
    """Extract the note chart as [midiPitch, beat] pairs."""
    notes = midi_info['melody_notes']
    # Format as [pitch, beat] with beat rounded to 4 decimals
    chart = [[n[0], round(n[1], 4)] for n in notes]

    # Compute lane distribution for validation
    pitches = [n[0] for n in notes]
    breakpoints, _ = compute_lane_mapping(pitches)
    lanes = [pitch_to_lane(p, breakpoints) for p in pitches]
    dist = [lanes.count(i) / len(lanes) * 100 for i in range(4)]
    print(f"  Lane distribution: {dist[0]:.0f}% / {dist[1]:.0f}% / {dist[2]:.0f}% / {dist[3]:.0f}%")

    # Check if distribution is too lopsided (any lane > 50%)
    if max(dist) > 50:
        print("  WARNING: Lopsided lane distribution, but proceeding anyway")

    return chart

def compute_max_beats(chart, bpm):
    """Compute maxBeats [easy, medium, hard] for difficulty clip points."""
    all_beats = [n[1] for n in chart]
    if not all_beats:
        return [60, 120, 180]

    total_beats = max(all_beats)

    # Easy: ~40% through the song
    # Medium: ~65% through the song
    # Hard: full song
    easy_cutoff = total_beats * 0.4
    medium_cutoff = total_beats * 0.65

    # Snap to nearest note beat that's close to the cutoff
    def nearest_note_beat(target):
        closest = min(all_beats, key=lambda b: abs(b - target))
        return round(closest)

    easy_max = nearest_note_beat(easy_cutoff)
    medium_max = nearest_note_beat(medium_cutoff)
    hard_max = round(total_beats)

    # Ensure they're in order
    if medium_max <= easy_max:
        medium_max = easy_max + 16
    if hard_max <= medium_max:
        hard_max = medium_max + 16

    print(f"  maxBeats: [{easy_max}, {medium_max}, {hard_max}]")
    return [easy_max, medium_max, hard_max]

# ── Audio rendering ────────────────────────────────────────────

def render_ogg(midi_path, ogg_path):
    """Render MIDI to OGG via FluidSynth + ffmpeg."""
    wav_path = '/tmp/keyhero_render.wav'

    # FluidSynth render
    print("  Rendering MIDI → WAV with FluidSynth...")
    result = subprocess.run([
        'fluidsynth', '-ni',
        '-F', wav_path,
        '/usr/share/sounds/sf2/FluidR3_GM.sf2',
        midi_path
    ], capture_output=True, text=True, timeout=120)
    if result.returncode != 0:
        print(f"  FluidSynth error: {result.stderr}")
        return False

    if not os.path.exists(wav_path) or os.path.getsize(wav_path) < 1000:
        print("  FluidSynth produced no/empty WAV")
        return False

    # ffmpeg WAV → OGG
    print("  Converting WAV → OGG with ffmpeg...")
    result = subprocess.run([
        'ffmpeg', '-y', '-i', wav_path,
        '-c:a', 'libvorbis', '-q:a', '6',
        ogg_path
    ], capture_output=True, text=True, timeout=120)
    if result.returncode != 0:
        print(f"  ffmpeg error: {result.stderr}")
        return False

    size = os.path.getsize(ogg_path)
    print(f"  OGG rendered: {size / 1024:.0f} KB")

    # Clean up WAV
    os.remove(wav_path)
    return True

# ── Inject song into keyhero.html ─────────────────────────────

def get_artist_genre_and_color(artist):
    """Auto-detect genre and pick a card color from artist name."""
    artist_lower = artist.lower()

    # Genre/color mappings
    pop_artists = ['taylor swift', 'ariana grande', 'olivia rodrigo', 'dua lipa', 'billie eilish',
                   'harry styles', 'justin bieber', 'katy perry', 'lady gaga', 'post malone',
                   'the weeknd', 'carly rae jepsen', 'meghan trainor', 'sam smith', 'lorde',
                   'sia', 'charlie puth', 'selena gomez', 'shawn mendes', 'camila cabello',
                   'doja cat', 'lizzo', 'halsey', 'p!nk', 'pink', 'bruno mars',
                   'ed sheeran', 'pharrell', 'onerepublic', 'imagine dragons', 'maroon 5',
                   'victorious', 'victorious cast', 'frozen', 'disney', 'nickelodeon']
    country_artists = ['johnny cash', 'dolly parton', 'carrie underwood', 'luke combs',
                       'morgan wallen', 'jason aldean', 'luke bryan', 'blake shelton',
                       'keith urban', 'kenny chesney', 'tim mcgraw', 'john denver',
                       'willie nelson', 'garth brooks', 'reba mcentire', 'zach bryan',
                       'chris stapleton', 'miranda lambert']
    rock_artists = ['queen', 'acdc', 'ac/dc', 'guns n roses', 'led zeppelin', 'nirvana',
                    'foo fighters', 'green day', 'linkin park', 'coldplay', 'u2',
                    'the beatles', 'rolling stones', 'bon jovi', 'journey', 'aerosmith']
    rnb_artists = ['beyonce', 'rihanna', 'usher', 'alicia keys', 'john legend',
                   'the weekend', 'frank ocean', 'sza', 'khalid']

    colors = {
        'pop': 'linear-gradient(135deg,#cc00aa,#ff4488)',
        'country': 'linear-gradient(135deg,#cc6600,#ffaa00)',
        'rock': 'linear-gradient(135deg,#333333,#cc0000)',
        'rnb': 'linear-gradient(135deg,#4400cc,#8800ff)',
        'default': 'linear-gradient(135deg,#0088cc,#00ccaa)',
    }
    emojis = {'pop': '🎤', 'country': '🤠', 'rock': '🎸', 'rnb': '🎵', 'default': '🎶'}

    for a in pop_artists:
        if a in artist_lower:
            return 'pop', colors['pop'], emojis['pop']
    for a in country_artists:
        if a in artist_lower:
            return 'country', colors['country'], emojis['country']
    for a in rock_artists:
        if a in artist_lower:
            return 'rock', colors['rock'], emojis['rock']
    for a in rnb_artists:
        if a in artist_lower:
            return 'rnb', colors['rnb'], emojis['rnb']

    # Default: generate a color from artist name hash
    h = hashlib.md5(artist_lower.encode()).hexdigest()
    hue1 = int(h[:2], 16)
    hue2 = (hue1 + 40) % 360
    return 'pop', f'linear-gradient(135deg,hsl({hue1},70%,45%),hsl({hue2},70%,55%))', emojis['default']

def inject_song_into_html(song_id, title, artist, bpm, chart, max_beats, emoji, color, audio_file):
    """Add a new song entry to the SONGS array in keyhero.html."""
    html_path = '/opt/nawgames/public/games/keyhero.html'

    with open(html_path, 'r') as f:
        html = f.read()

    # Build the pitches array string
    pitches_str = ','.join(f'[{n[0]},{n[1]}]' for n in chart)

    # Escape any single quotes in title/artist
    title_esc = title.replace("'", "\\'")
    artist_esc = artist.replace("'", "\\'")

    # Build new song entry
    new_entry = (
        f"  {{ id:'{song_id}', title:'{title_esc}', artist:'{artist_esc}', bpm:{bpm},\n"
        f"    emoji:'{emoji}', color:'{color}',\n"
        f"    audioFile:'/games/{song_id}.ogg', maxBeats:[{max_beats[0]},{max_beats[1]},{max_beats[2]}],\n"
        f"    pitches:[{pitches_str}] }},\n"
    )

    # Find the SONGS array end by counting brackets from "const SONGS = ["
    songs_start = html.find('const SONGS = [')
    if songs_start == -1:
        print("  ERROR: Could not find SONGS array in keyhero.html")
        return False

    # Walk forward from the opening '[' counting bracket depth
    bracket_start = html.index('[', songs_start)
    depth = 0
    end_pos = -1
    for i in range(bracket_start, len(html)):
        if html[i] == '[':
            depth += 1
        elif html[i] == ']':
            depth -= 1
            if depth == 0:
                end_pos = i
                break

    if end_pos == -1:
        print("  ERROR: Could not find end of SONGS array")
        return False

    # Ensure previous entry has a trailing comma before we insert
    # Walk backwards from end_pos to find the last '}' of the previous entry
    pre = html[:end_pos].rstrip()
    if pre and pre[-1] == '}':
        # No trailing comma — add one
        last_brace = len(pre) - 1
        html = html[:last_brace+1] + ',' + html[last_brace+1:]
        # Recalculate end_pos since we inserted a character
        end_pos += 1

    # Insert the new entry just before the closing ]
    html = html[:end_pos] + new_entry + html[end_pos:]

    with open(html_path, 'w') as f:
        f.write(html)

    # Validate: check that SONGS array brackets are balanced
    with open(html_path, 'r') as vf:
        vhtml = vf.read()
    songs_idx = vhtml.find('const SONGS = [')
    if songs_idx == -1:
        print("  Validation FAILED: SONGS array disappeared!")
        return False
    # Check bracket balance from SONGS start
    depth = 0
    found_end = False
    for i in range(vhtml.index('[', songs_idx), min(len(vhtml), songs_idx + 500000)):
        if vhtml[i] == '[': depth += 1
        elif vhtml[i] == ']': depth -= 1
        if depth == 0:
            found_end = True
            break
    if not found_end:
        print("  Validation FAILED: Unbalanced brackets in SONGS array")
        return False
    # Check the new song ID appears in the file
    if f"id:'{song_id}'" not in vhtml:
        print("  Validation FAILED: Song ID not found after injection")
        return False

    print(f"  Song injected into keyhero.html successfully")
    return True

# ── Main pipeline ──────────────────────────────────────────────

def process_song_request(creds, doc_id, song_name, artist, notes_text):
    """Process a single song request end-to-end."""
    print(f"\n{'='*60}")
    print(f"Processing: '{song_name}' by '{artist}'")
    if notes_text:
        print(f"Notes: {notes_text}")
    print(f"{'='*60}")

    # Generate IDs
    song_slug = slugify(f"{artist}-{song_name}")
    if len(song_slug) > 40:
        song_slug = slugify(song_name)[:40]

    midi_path = f'/tmp/keyhero_{song_slug}.mid'
    ogg_path = f'/opt/nawgames/public/games/{song_slug}.ogg'

    # Step 1: Find and download MIDI
    firestore_update_status(creds, doc_id, 'building')

    if not find_and_download_midi(song_name, artist, midi_path):
        print("  FAILED: Could not find MIDI")
        firestore_update_status(creds, doc_id, 'failed_no_midi')
        return False

    # Step 2: Analyze MIDI
    try:
        midi_info = analyze_midi(midi_path)
    except Exception as e:
        print(f"  FAILED: MIDI analysis error: {e}")
        firestore_update_status(creds, doc_id, 'failed_midi_error')
        return False

    if midi_info['total_notes'] < 20:
        print(f"  FAILED: Too few notes ({midi_info['total_notes']})")
        firestore_update_status(creds, doc_id, 'failed_too_few_notes')
        return False

    # Step 3: Extract chart
    chart = extract_chart(midi_info)
    bpm = midi_info['bpm']
    max_beats = compute_max_beats(chart, bpm)

    # Step 4: Render OGG
    if not render_ogg(midi_path, ogg_path):
        print("  FAILED: OGG rendering error")
        firestore_update_status(creds, doc_id, 'failed_render')
        return False

    # Step 5: Get genre/color
    genre, color, emoji = get_artist_genre_and_color(artist)
    print(f"  Genre: {genre}, Color: {color}")

    # Step 6: Format title properly
    title = song_name.title()
    artist_display = artist.title()

    # Step 7: Inject into keyhero.html
    if not inject_song_into_html(song_slug, title, artist_display, bpm, chart, max_beats, emoji, color, ogg_path):
        print("  FAILED: Could not inject into keyhero.html")
        firestore_update_status(creds, doc_id, 'failed_inject')
        return False

    # Step 8: Mark as completed
    firestore_update_status(creds, doc_id, 'completed')
    print(f"  SUCCESS: '{title}' by {artist_display} added to KeyHero!")

    # Clean up MIDI
    os.remove(midi_path)

    return True

def main():
    print("=== KeyHero Song Auto-Builder ===")
    print()

    creds = get_creds()

    # Get pending song requests
    data = firestore_get(creds, 'keyhero_song_requests')
    docs = data.get('documents', [])

    pending = []
    for doc in docs:
        f = doc['fields']
        status = f.get('status', {}).get('stringValue', '')
        if status == 'pending':
            pending.append({
                'id': doc['name'].split('/')[-1],
                'songName': f.get('songName', {}).get('stringValue', ''),
                'artist': f.get('artist', {}).get('stringValue', ''),
                'notes': f.get('notes', {}).get('stringValue', ''),
            })

    if not pending:
        print("No pending song requests.")
        return 0

    print(f"Found {len(pending)} pending song request(s):")
    for p in pending:
        print(f"  - '{p['songName']}' by '{p['artist']}'")

    # Check which songs already exist in keyhero.html
    with open('/opt/nawgames/public/games/keyhero.html', 'r') as f:
        html = f.read()
    existing_ids = set(re.findall(r"id:'([^']+)'", html))

    successes = []
    failures = []

    for req in pending:
        song_slug = slugify(f"{req['artist']}-{req['songName']}")
        if len(song_slug) > 40:
            song_slug = slugify(req['songName'])[:40]

        if song_slug in existing_ids:
            print(f"\n  SKIP: '{req['songName']}' already exists as '{song_slug}'")
            firestore_update_status(creds, req['id'], 'completed')
            continue

        ok = process_song_request(creds, req['id'], req['songName'], req['artist'], req['notes'])
        if ok:
            successes.append(req['songName'])
        else:
            failures.append(req['songName'])

    # Commit and push if any successes
    if successes:
        print(f"\n{'='*60}")
        print(f"Committing {len(successes)} new song(s)...")
        os.chdir('/opt/nawgames')

        # Git add new files
        subprocess.run(['git', 'add', 'public/games/keyhero.html'], check=True)
        for s in successes:
            slug = slugify(f"{pending[0]['artist']}-{s}")  # approximate
            ogg = f'public/games/{slug}.ogg'
            if os.path.exists(ogg):
                subprocess.run(['git', 'add', ogg])

        # Add all new .ogg files
        subprocess.run(['git', 'add', 'public/games/*.ogg'])

        msg = f"Add KeyHero songs: {', '.join(successes)}"
        subprocess.run(['git', 'commit', '-m', msg], check=True)

        # Push
        token = subprocess.run([
            'python3', '-c',
            "import base64, hashlib\n"
            "with open('/etc/machine-id') as f: mid = f.read().strip()\n"
            "key = hashlib.sha256(mid.encode()).digest()\n"
            "with open('/opt/barrio-secrets/github_token.enc') as f: enc = f.read().strip()\n"
            "dec = bytes([a ^ b for a, b in zip(base64.b64decode(enc), key * 2)])\n"
            "print(dec.decode().strip())"
        ], capture_output=True, text=True).stdout.strip()

        subprocess.run(['git', 'remote', 'set-url', 'origin',
                       f'https://{token}@github.com/ipinney/NAWgames.com.git'], check=True)
        subprocess.run(['git', 'push', 'origin', 'main'], check=True)
        subprocess.run(['git', 'remote', 'set-url', 'origin',
                       'https://github.com/ipinney/NAWgames.com.git'], check=True)

        print("Pushed to GitHub!")

    print(f"\n{'='*60}")
    print(f"RESULTS: {len(successes)} succeeded, {len(failures)} failed")
    if successes:
        print(f"  Added: {', '.join(successes)}")
    if failures:
        print(f"  Failed: {', '.join(failures)}")

    return 0 if not failures else 1

if __name__ == '__main__':
    sys.exit(main())
