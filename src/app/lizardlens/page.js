'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const GO2RTC_URL = 'https://spark-2f53.tail8a7863.ts.net';
const ADMIN_UID = 'zy8WSqtL3GUuyw89u1X1ZzENULP2';

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
    if (reconnectTID.current) return;

    const delay = Math.max(RECONNECT_TIMEOUT - (Date.now() - connectTS.current), 1000);
    setStatus('reconnecting');

    reconnectTID.current = setTimeout(() => {
      reconnectTID.current = null;
      if (mountedRef.current) connect();
    }, delay);
  }, []);

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
    const buf = new Uint8Array(2 * 1024 * 1024);
    let bufLen = 0;

    ws.onopen = () => {
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
        const codecs = getSupportedCodecs();
        ws.send(JSON.stringify({ type: 'mse', value: codecs }));
      }, { once: true });

      if (ManagedMS) {
        if (videoRef.current) {
          videoRef.current.disableRemotePlayback = true;
          videoRef.current.srcObject = ms;
        }
      } else {
        if (videoRef.current) {
          videoRef.current.src = URL.createObjectURL(ms);
          videoRef.current.srcObject = null;
        }
      }

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
          try {
            sb = ms.addSourceBuffer(msg.value);
            sb.mode = 'segments';

            sb.addEventListener('updateend', () => {
              if (!sb.updating && bufLen > 0) {
                try {
                  const data = buf.slice(0, bufLen);
                  sb.appendBuffer(data);
                  bufLen = 0;
                } catch (e) {}
              }

              if (!sb.updating && sb.buffered && sb.buffered.length) {
                const end = sb.buffered.end(sb.buffered.length - 1);
                const start = end - 5;
                const start0 = sb.buffered.start(0);

                if (start > start0) {
                  try {
                    sb.remove(start0, start);
                    ms.setLiveSeekableRange(start, end);
                  } catch (e) {}
                }

                if (videoRef.current && videoRef.current.currentTime < start) {
                  videoRef.current.currentTime = start;
                }

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
          ws.close();
        }
      } else {
        if (sb) {
          if (sb.updating || bufLen > 0) {
            const b = new Uint8Array(ev.data);
            if (bufLen + b.byteLength <= buf.byteLength) {
              buf.set(b, bufLen);
              bufLen += b.byteLength;
            }
          } else {
            try {
              sb.appendBuffer(ev.data);
            } catch (e) {}
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

    if (videoRef.current) {
      videoRef.current.onerror = () => {
        const err = videoRef.current?.error;
        console.error('[LizardLens] Video error:', err?.code, err?.message);
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
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

/* ────────────────────────────────────────────────────
   ACCESS REQUEST FORM
   ──────────────────────────────────────────────────── */
function AccessRequestForm({ user, onSubmitted }) {
  const [name, setName] = useState(user?.displayName || '');
  const [relationship, setRelationship] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !relationship.trim()) return;

    setSubmitting(true);
    setError('');

    try {
      // Write to Firestore — doc ID is the user's UID
      await setDoc(doc(db, 'lizardlens_access', user.uid), {
        name: name.trim(),
        relationship: relationship.trim(),
        email: user.email,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      onSubmitted();
    } catch (err) {
      console.error('Error submitting access request:', err);
      setError('Something went wrong. Please try again.');
    }
    setSubmitting(false);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-naw-card rounded-2xl border border-white/10 p-6 sm:p-8">
        <div className="text-center mb-6">
          <span className="text-5xl block mb-3">🔒</span>
          <h2 className="text-white font-bold text-xl mb-2">Request Access</h2>
          <p className="text-white/50 text-sm">
            Lizard Lens is a private family cam. Tell us who you are and we&apos;ll review your request!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white/70 text-sm font-medium mb-1.5">Your Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Grandma Sue"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-naw-green focus:outline-none focus:ring-1 focus:ring-naw-green transition-colors"
            />
          </div>

          <div>
            <label className="block text-white/70 text-sm font-medium mb-1.5">How do you know the family?</label>
            <textarea
              required
              rows={3}
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              placeholder="e.g., I'm Ivan's mom, Uncle Joe from Dallas, family friend from church..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-naw-green focus:outline-none focus:ring-1 focus:ring-naw-green transition-colors resize-none"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={submitting || !name.trim() || !relationship.trim()}
            className="w-full bg-gradient-to-r from-naw-green to-naw-cyan text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Request Access'}
          </button>
        </form>

        <p className="text-white/30 text-xs text-center mt-4">
          Signed in as {user.email}
        </p>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────
   MAIN PAGE
   ──────────────────────────────────────────────────── */
export default function LizardLensPage() {
  const { user, loading, loginWithGoogle } = useAuth();
  const [accessStatus, setAccessStatus] = useState(null); // null = loading, 'none' | 'pending' | 'approved' | 'denied'
  const [checkingAccess, setCheckingAccess] = useState(true);

  // Check user's access status in Firestore
  useEffect(() => {
    if (loading) return;

    if (!user) {
      setAccessStatus('none');
      setCheckingAccess(false);
      return;
    }

    // Admin always has access
    if (user.uid === ADMIN_UID) {
      setAccessStatus('approved');
      setCheckingAccess(false);
      return;
    }

    const checkAccess = async () => {
      try {
        const docRef = doc(db, 'lizardlens_access', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setAccessStatus(docSnap.data().status);
        } else {
          setAccessStatus('none');
        }
      } catch (err) {
        console.error('Error checking access:', err);
        setAccessStatus('none');
      }
      setCheckingAccess(false);
    };

    checkAccess();
  }, [user, loading]);

  // Loading state
  if (loading || checkingAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-naw-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/40 text-sm">Loading Lizard Lens...</p>
        </div>
      </div>
    );
  }

  // Not signed in
  if (!user) {
    return (
      <div className="min-h-screen">
        <div className="max-w-lg mx-auto px-4 pt-16 pb-12">
          <div className="text-center mb-8">
            <span className="text-6xl block mb-4">🦎</span>
            <h1 className="font-game text-lg sm:text-2xl mb-3">
              <span className="bg-gradient-to-r from-naw-green via-naw-cyan to-naw-green bg-clip-text text-transparent">
                LIZARD LENS
              </span>
            </h1>
            <p className="text-white/50 text-sm sm:text-base mb-2">
              Live cameras on Blappy & Pineapple
            </p>
            <p className="text-white/30 text-xs">
              This is a private family cam — sign in to request access.
            </p>
          </div>

          <div className="bg-naw-card rounded-2xl border border-white/10 p-8 text-center">
            <p className="text-white/60 mb-5 text-sm">Sign in to get started</p>
            <button
              onClick={loginWithGoogle}
              className="bg-white text-gray-800 px-6 py-2.5 rounded-xl font-medium hover:bg-gray-100 transition-colors inline-flex items-center gap-2 text-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>
          </div>

          <div className="text-center mt-6">
            <Link href="/" className="text-white/30 hover:text-white/50 text-xs transition-colors">
              Back to NAW Games
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Signed in but access is pending
  if (accessStatus === 'pending') {
    return (
      <div className="min-h-screen">
        <div className="max-w-lg mx-auto px-4 pt-16 pb-12">
          <div className="text-center">
            <span className="text-6xl block mb-4">⏳</span>
            <h1 className="font-game text-lg sm:text-2xl mb-3">
              <span className="bg-gradient-to-r from-naw-green via-naw-cyan to-naw-green bg-clip-text text-transparent">
                LIZARD LENS
              </span>
            </h1>
            <div className="bg-naw-card rounded-2xl border border-yellow-500/20 p-8 mt-6">
              <h2 className="text-white font-bold text-lg mb-2">Request Pending</h2>
              <p className="text-white/50 text-sm mb-4">
                Your access request has been submitted! Ivan will review it and you&apos;ll be able to watch the lizard cams once approved.
              </p>
              <p className="text-white/30 text-xs">
                Signed in as {user.email}
              </p>
            </div>
            <div className="mt-6">
              <Link href="/" className="text-white/30 hover:text-white/50 text-xs transition-colors">
                Back to NAW Games
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Signed in but denied
  if (accessStatus === 'denied') {
    return (
      <div className="min-h-screen">
        <div className="max-w-lg mx-auto px-4 pt-16 pb-12">
          <div className="text-center">
            <span className="text-6xl block mb-4">🚫</span>
            <h1 className="font-game text-lg sm:text-2xl mb-3">
              <span className="bg-gradient-to-r from-naw-green via-naw-cyan to-naw-green bg-clip-text text-transparent">
                LIZARD LENS
              </span>
            </h1>
            <div className="bg-naw-card rounded-2xl border border-red-500/20 p-8 mt-6">
              <h2 className="text-white font-bold text-lg mb-2">Access Denied</h2>
              <p className="text-white/50 text-sm">
                Your request wasn&apos;t approved. If you think this is a mistake, reach out to the family directly.
              </p>
            </div>
            <div className="mt-6">
              <Link href="/" className="text-white/30 hover:text-white/50 text-xs transition-colors">
                Back to NAW Games
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Signed in but no request yet — show the form
  if (accessStatus === 'none') {
    return (
      <div className="min-h-screen">
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
          </div>
        </div>

        <div className="px-4 pb-12">
          <AccessRequestForm
            user={user}
            onSubmitted={() => setAccessStatus('pending')}
          />
        </div>
      </div>
    );
  }

  // APPROVED — show the full cam page
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
