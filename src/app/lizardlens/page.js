'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, useCallback } from 'react';

const GO2RTC_URL = 'https://spark-2f53.tail8a7863.ts.net';

// Codecs supported by go2rtc MSE — sent to server so it picks compatible ones
const MSE_CODECS = [
  'avc1.640029', // H.264 high 4.1
  'avc1.64002A', // H.264 high 4.2
  'avc1.640033', // H.264 high 5.1
  'hvc1.1.6.L153.B0', // H.265 main 5.1
  'mp4a.40.2',   // AAC LC
  'mp4a.40.5',   // AAC HE
  'flac',
  'opus',
];

function getSupportedCodecs() {
  const MS = window.ManagedMediaSource || window.MediaSource;
  if (!MS) return '';
  return MSE_CODECS
    .filter(c => MS.isTypeSupported(`video/mp4; codecs="${c}"`))
    .join();
}

function StreamPlayer({ name, emoji, species, streamId }) {
  const videoRef = useRef(null);
  const wsRef = useRef(null);
  const reconnectTID = useRef(null);
  const connectTS = useRef(0);
  const [status, setStatus] = useState('connecting');
  const mountedRef = useRef(true);

  const RECONNECT_TIMEOUT = 10000;

  const cleanup = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.onopen = null;
      wsRef.current.onmessage = null;
      wsRef.current.onerror = null;
      wsRef.current.onclose = null;
      wsRef.current.close();
      wsRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.src = '';
      videoRef.current.srcObject = null;
    }
  }, []);

  const scheduleReconnect = useCallback(() => {
    if (!mountedRef.current) return;
    if (reconnectTID.current) return; // already scheduled

    const delay = Math.max(RECONNECT_TIMEOUT - (Date.now() - connectTS.current), 1000);
    setStatus('reconnecting');

    reconnectTID.current = setTimeout(() => {
      reconnectTID.current = null;
      if (mountedRef.current) connect();
    }, delay);
  }, []); // connect added via ref pattern below

  const connect = useCallback(() => {
    if (!mountedRef.current) return;

    cleanup();
    setStatus('connecting');
    connectTS.current = Date.now();

    const wsUrl = `${GO2RTC_URL.replace('https://', 'wss://')}/api/ws?src=${streamId}`;
    
    let ws;
    try {
      ws = new WebSocket(wsUrl);
    } catch (e) {
      console.error('[LizardLens] WebSocket creation failed:', e);
      scheduleReconnect();
      return;
    }

    ws.binaryType = 'arraybuffer';
    wsRef.current = ws;

    let ms = null;
    let sb = null;
    // Pre-allocated buffer following go2rtc reference implementation
    const buf = new Uint8Array(2 * 1024 * 1024);
    let bufLen = 0;
    let hasReceivedData = false;

    ws.onopen = () => {
      // Follow go2rtc official pattern: create MediaSource FIRST,
      // then send codec list on sourceopen
      const ManagedMS = window.ManagedMediaSource;
      const NativeMS = window.MediaSource;
      const MSConstructor = ManagedMS || NativeMS;

      if (!MSConstructor) {
        console.error('[LizardLens] No MediaSource support');
        setStatus('offline');
        return;
      }

      ms = new MSConstructor();

      ms.addEventListener('sourceopen', () => {
        if (!ManagedMS && videoRef.current) {
          URL.revokeObjectURL(videoRef.current.src);
        }
        // Send supported codecs to server — this is what the official client does
        const codecs = getSupportedCodecs();
        ws.send(JSON.stringify({ type: 'mse', value: codecs }));
      }, { once: true });

      if (ManagedMS) {
        // Safari 17+ path
        if (videoRef.current) {
          videoRef.current.disableRemotePlayback = true;
          videoRef.current.srcObject = ms;
        }
      } else {
        // Standard path
        if (videoRef.current) {
          videoRef.current.src = URL.createObjectURL(ms);
          videoRef.current.srcObject = null;
        }
      }

      // Attempt autoplay (muted to satisfy browser policy)
      if (videoRef.current) {
        videoRef.current.play().catch(() => {
          if (videoRef.current && !videoRef.current.muted) {
            videoRef.current.muted = true;
            videoRef.current.play().catch(() => {});
          }
        });
      }
    };

    ws.onmessage = (ev) => {
      if (typeof ev.data === 'string') {
        const msg = JSON.parse(ev.data);

        if (msg.type === 'mse') {
          // Server confirmed codec — add source buffer
          try {
            sb = ms.addSourceBuffer(msg.value);
            sb.mode = 'segments';

            sb.addEventListener('updateend', () => {
              // Flush queued data
              if (!sb.updating && bufLen > 0) {
                try {
                  const data = buf.slice(0, bufLen);
                  sb.appendBuffer(data);
                  bufLen = 0;
                } catch (e) {
                  // buffer full, skip
                }
              }

              // Keep buffer window tight + catch up to live edge
              // (following go2rtc reference implementation)
              if (!sb.updating && sb.buffered && sb.buffered.length) {
                const end = sb.buffered.end(sb.buffered.length - 1);
                const start = end - 5;
                const start0 = sb.buffered.start(0);

                // Trim old buffer
                if (start > start0) {
                  try {
                    sb.remove(start0, start);
                    ms.setLiveSeekableRange(start, end);
                  } catch (e) { /* ignore */ }
                }

                // Jump forward if we've fallen behind
                if (videoRef.current && videoRef.current.currentTime < start) {
                  videoRef.current.currentTime = start;
                }

                // Adjust playback rate to catch up to live
                if (videoRef.current) {
                  const gap = end - videoRef.current.currentTime;
                  videoRef.current.playbackRate = gap > 0.1 ? gap : 0.1;
                }
              }
            });

            setStatus('live');
          } catch (e) {
            console.error('[LizardLens] addSourceBuffer failed:', e);
            setStatus('offline');
            ws.close();
          }
        } else if (msg.type === 'error') {
          console.error('[LizardLens] Server error:', msg.value);
          // If MSE not supported on server side, it will send an error
          ws.close();
        }
      } else {
        // Binary data — media segment
        hasReceivedData = true;

        if (sb) {
          if (sb.updating || bufLen > 0) {
            const b = new Uint8Array(ev.data);
            if (bufLen + b.byteLength <= buf.byteLength) {
              buf.set(b, bufLen);
              bufLen += b.byteLength;
            }
            // else drop frame to prevent overflow
          } else {
            try {
              sb.appendBuffer(ev.data);
            } catch (e) {
              // buffer errors, skip frame
            }
          }
        }
      }
    };

    ws.onerror = (e) => {
      console.error('[LizardLens] WebSocket error:', e);
    };

    ws.onclose = () => {
      wsRef.current = null;
      if (mountedRef.current) {
        scheduleReconnect();
      }
    };

    // Video error handler — close WS to trigger reconnect (per go2rtc reference)
    if (videoRef.current) {
      videoRef.current.onerror = () => {
        const err = videoRef.current?.error;
        console.error('[LizardLens] Video error:', err?.code, err?.message);
        if (ws.readyState === WebSocket.OPEN) {
          ws.close(); // triggers reconnect
        }
      };
    }
  }, [streamId, cleanup, scheduleReconnect]);

  useEffect(() => {
    mountedRef.current = true;
    connect();

    return () => {
      mountedRef.current = false;
      if (reconnectTID.current) {
        clearTimeout(reconnectTID.current);
        reconnectTID.current = null;
      }
      cleanup();
    };
  }, [connect, cleanup]);

  return (
    <div className="flex flex-col rounded-2xl overflow-hidden border border-white/10 bg-naw-card">
      {/* Stream header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-naw-card to-naw-dark border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{emoji}</span>
          <div>
            <h2 className="text-white font-bold text-sm sm:text-base">{name}</h2>
            <p className="text-white/40 text-xs">{species}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${
            status === 'live' ? 'bg-red-500 animate-pulse' :
            status === 'connecting' || status === 'reconnecting' ? 'bg-yellow-500 animate-pulse' :
            'bg-white/20'
          }`} />
          <span className={`text-xs font-medium ${
            status === 'live' ? 'text-red-400' :
            status === 'connecting' ? 'text-yellow-400' :
            status === 'reconnecting' ? 'text-yellow-400' :
            'text-white/30'
          }`}>
            {status === 'live' ? 'LIVE' :
             status === 'connecting' ? 'CONNECTING...' :
             status === 'reconnecting' ? 'RECONNECTING...' :
             'OFFLINE'}
          </span>
        </div>
      </div>

      {/* Video */}
      <div className="relative aspect-video bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-contain"
        />
        {status === 'offline' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
            <span className="text-4xl mb-3">😴</span>
            <p className="text-white/50 text-sm mb-3">{name} cam is offline</p>
            <button
              onClick={connect}
              className="bg-naw-purple/30 border border-naw-purple/40 text-white px-4 py-2 rounded-lg text-xs hover:bg-naw-purple/50 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
        {(status === 'connecting' || status === 'reconnecting') && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
            <div className="w-8 h-8 border-2 border-naw-cyan border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-white/50 text-sm">
              {status === 'reconnecting' ? `Reconnecting to ${name}'s camera...` : `Connecting to ${name}'s camera...`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LizardLensPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 pt-8 pb-4">
        <Link href="/" className="text-white/40 hover:text-white/70 text-sm mb-4 inline-flex items-center gap-1 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Games
        </Link>

        <div className="text-center mt-4 mb-8">
          <h1 className="font-game text-lg sm:text-2xl mb-3">
            <span className="bg-gradient-to-r from-naw-green via-naw-cyan to-naw-green bg-clip-text text-transparent">
              LIZARD LENS
            </span>
          </h1>
          <p className="text-white/50 text-sm sm:text-base">
            Live cameras on our pet reptiles — watch them eat, sleep, and explore!
          </p>
        </div>
      </div>

      {/* Streams */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StreamPlayer
            name="Blappy"
            emoji="🦎"
            species="Bearded Dragon"
            streamId="blappy"
          />
          <StreamPlayer
            name="Pineapple"
            emoji="🦎"
            species="Crested Gecko"
            streamId="pineapple"
          />
        </div>

        {/* Fun info section */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-naw-card rounded-xl border border-white/5 p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">☀️</span>
              <h3 className="text-white font-semibold text-sm">Blappy</h3>
            </div>
            <p className="text-white/50 text-xs leading-relaxed">
              Bearded dragons are <span className="text-naw-orange font-medium">diurnal</span> — most active during the day! 
              Watch Blappy bask under the heat lamp, munch on greens, and do adorable head bobs.
            </p>
          </div>
          <div className="bg-naw-card rounded-xl border border-white/5 p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🌙</span>
              <h3 className="text-white font-semibold text-sm">Pineapple</h3>
            </div>
            <p className="text-white/50 text-xs leading-relaxed">
              Crested geckos are <span className="text-naw-cyan font-medium">nocturnal</span> — they come alive at night! 
              Check in after dark to see Pineapple climbing, jumping, and hunting. Night vision cameras catch it all.
            </p>
          </div>
        </div>
      </div>

      {/* Footer note */}
      <div className="max-w-6xl mx-auto px-4 pb-8 text-center">
        <p className="text-white/20 text-xs">
          Cameras use 940nm infrared for night vision — completely invisible to the reptiles.
        </p>
      </div>
    </div>
  );
}
