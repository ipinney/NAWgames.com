/**
 * Online Sequencer Note Ripper
 * ============================
 * Paste this into the browser console on any https://onlinesequencer.net/<id> page.
 * It intercepts audio scheduling to capture note names + beat positions.
 *
 * USAGE:
 *   1. Open the sequence page in Chrome
 *   2. Open DevTools > Console
 *   3. Paste this entire script and press Enter
 *   4. Click the PLAY button on the sequencer
 *   5. Let it play through once (or until you have enough notes)
 *   6. Click STOP, then run: copy(JSON.stringify(window.__rippedNotes, null, 2))
 *   7. Paste the clipboard into a .json file
 *
 * OUTPUT FORMAT:
 *   Each note: { inst: number, note: "D6", beat: 4.5, hz: 1174.66, lane: 0 }
 */

(function() {
  // ── Config ──────────────────────────────────────────────────────────────────
  const BPM = 160; // ← Change this to match the sequence BPM (shown in sequencer)
  const beatDur = 60 / BPM;

  // Hz conversion (standard MIDI formula)
  const noteIdx = {C:0,'C#':1,Db:1,D:2,'D#':3,Eb:3,E:4,F:5,'F#':6,Gb:6,G:7,'G#':8,Ab:8,A:9,'A#':10,Bb:10,B:11};
  function noteToHz(name) {
    const m = name.match(/^([A-G]#?b?)(-?\d+)$/);
    if (!m) return 440;
    const midi = 12 * (parseInt(m[2]) + 1) + (noteIdx[m[1]] || 0);
    return Math.round(440 * Math.pow(2, (midi - 69) / 12) * 100) / 100;
  }

  // Lane assignment — maps MIDI range to 4 lanes. Adjust for each song.
  // Default: splits D6-D7 range (Shake It Off). Override after capture if needed.
  function midiToLane(midi) {
    if (midi <= 88) return 0;   // D6, E6
    if (midi <= 91) return 1;   // F#6, G6
    if (midi <= 94) return 2;   // A6
    return 3;                    // B6, C7, D7
  }
  function noteToMidi(name) {
    const m = name.match(/^([A-G]#?b?)(-?\d+)$/);
    if (!m) return 60;
    return 12 * (parseInt(m[2]) + 1) + (noteIdx[m[1]] || 0);
  }

  // ── State ───────────────────────────────────────────────────────────────────
  window.__rawCaptures = [];
  window.__rawTimings  = {};
  let t0 = null;

  // ── Patch playNote ──────────────────────────────────────────────────────────
  const origPlayNote = window.playNote;
  window.playNote = function(inst, note, len) {
    const id = window.__rawCaptures.length;
    window.__rawCaptures.push({ id, inst, note, len });
    return origPlayNote ? origPlayNote.apply(this, arguments) : undefined;
  };

  // ── Patch AudioBufferSourceNode.start ───────────────────────────────────────
  const origStart = AudioBufferSourceNode.prototype.start;
  AudioBufferSourceNode.prototype.start = function(when) {
    const idx = window.__rawCaptures.length - 1;
    if (idx >= 0 && when !== undefined) {
      if (t0 === null) t0 = when;  // First scheduled note = song start
      window.__rawTimings[window.__rawCaptures[idx].id] = when;
    }
    return origStart.apply(this, arguments);
  };

  // ── Process captured data ───────────────────────────────────────────────────
  window.ripNotes = function(opts) {
    opts = opts || {};
    const minMidi  = opts.minMidi  || 0;      // Filter by minimum MIDI note (e.g. 86 for D6+)
    const instFilter = opts.inst   || null;    // Filter by instrument number (e.g. 11 for melody)
    const maxBeat  = opts.maxBeat  || 9999;    // Cutoff beat (to exclude loops)

    // Find earliest scheduled time as song anchor
    const timingVals = Object.values(window.__rawTimings);
    if (timingVals.length === 0) { console.warn('No timings captured yet!'); return []; }
    const t0 = Math.min(...timingVals);

    const seen = new Set();
    const notes = [];

    for (const cap of window.__rawCaptures) {
      if (instFilter !== null && cap.inst !== instFilter) continue;
      if (window.__rawTimings[cap.id] === undefined) continue;

      const when = window.__rawTimings[cap.id];
      const beat = Math.round(((when - t0) / beatDur) * 4) / 4;
      if (beat > maxBeat) continue;

      const midi = noteToMidi(cap.note);
      if (midi < minMidi) continue;

      const key = `${beat}:${midi}`;
      if (seen.has(key)) continue;
      seen.add(key);

      notes.push({
        inst: cap.inst,
        note: cap.note,
        beat,
        hz: noteToHz(cap.note),
        midi,
        lane: midiToLane(midi)
      });
    }

    notes.sort((a, b) => a.beat - b.beat);
    window.__rippedNotes = notes;
    console.log(`✅ Ripped ${notes.length} notes. Instruments:`,
      [...new Set(notes.map(n => n.inst))]);
    console.log(`   Beat range: ${notes[0]?.beat} – ${notes[notes.length-1]?.beat}`);
    console.log(`   Notes by instrument:`,
      notes.reduce((acc, n) => { acc[n.inst] = (acc[n.inst]||0)+1; return acc; }, {}));
    console.log('\nTo copy: copy(JSON.stringify(window.__rippedNotes))');
    console.log('To get game-ready SONG.notes array: copy(window.toGameNotes())');
    return notes;
  };

  // ── Convert to KeyHero SONG.notes format ───────────────────────────────────
  window.toGameNotes = function(inst) {
    const notes = inst
      ? window.__rippedNotes.filter(n => n.inst === inst)
      : window.__rippedNotes;
    const arr = notes.map(n => `[${n.lane},${n.beat},${n.hz}]`);
    return `[\n  ${arr.join(',\n  ')}\n]`;
  };

  // ── Instrument stats ────────────────────────────────────────────────────────
  window.instStats = function() {
    const stats = {};
    for (const cap of window.__rawCaptures) {
      stats[cap.inst] = (stats[cap.inst] || 0) + 1;
    }
    console.table(stats);
    return stats;
  };

  console.log('🎵 Online Sequencer Ripper loaded!');
  console.log('   → Click PLAY on the sequencer, let it run through the song, click STOP');
  console.log('   → Then run: window.ripNotes({ inst: 11, minMidi: 86 })');
  console.log('   → Then run: window.instStats() to see which instrument has the melody');
  console.log('   → Then run: copy(window.toGameNotes()) to copy the SONG.notes array');
})();
