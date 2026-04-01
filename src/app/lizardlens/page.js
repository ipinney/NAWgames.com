'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const GO2RTC_URL = 'https://spark-2f53.tail8a7863.ts.net';

function StreamPlayer({ name, emoji, species, streamId }) {
  const videoRef = useRef(null);
  const wsRef = useRef(null);
  const pcRef = useRef(null);
  const [status, setStatus] = useState('connecting');
  const [retryCount, setRetryCount] = useState(0);

  const connect = () => {
    setStatus('connecting');

    // Clean up previous connection
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });
    pcRef.current = pc;

    pc.addTransceiver('video', { direction: 'recvonly' });
    pc.addTransceiver('audio', { direction: 'recvonly' });

    pc.ontrack = (event) => {
      if (event.track.kind === 'video' && videoRef.current) {
        videoRef.current.srcObject = event.streams[0];
        setStatus('live');
      }
    };

    pc.oniceconnectionstatechange = () => {
      if (pc.iceConnectionState === 'disconnected' || pc.iceConnectionState === 'failed') {
        setStatus('offline');
      }
    };

    const wsUrl = `${GO2RTC_URL.replace('https://', 'wss://')}/api/ws?src=${streamId}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      pc.createOffer().then((offer) => {
        pc.setLocalDescription(offer).then(() => {
          ws.send(JSON.stringify({
            type: 'webrtc/offer',
            value: pc.localDescription.sdp,
          }));
        });
      });
    };

    ws.onmessage = (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.type === 'webrtc/answer') {
        pc.setRemoteDescription(new RTCSessionDescription({
          type: 'answer',
          sdp: msg.value,
        }));
      } else if (msg.type === 'webrtc/candidate') {
        pc.addIceCandidate(new RTCIceCandidate(JSON.parse(msg.value)));
      }
    };

    ws.onerror = () => {
      setStatus('offline');
    };

    ws.onclose = () => {
      if (status !== 'live') {
        setStatus('offline');
      }
    };
  };

  useEffect(() => {
    connect();
    return () => {
      if (wsRef.current) wsRef.current.close();
      if (pcRef.current) pcRef.current.close();
    };
  }, [retryCount]);

  const handleRetry = () => {
    setRetryCount((c) => c + 1);
  };

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
          <span className={`w-2 h-2 rounded-full ${status === 'live' ? 'bg-red-500 animate-pulse' : status === 'connecting' ? 'bg-yellow-500 animate-pulse' : 'bg-white/20'}`} />
          <span className={`text-xs font-medium ${status === 'live' ? 'text-red-400' : status === 'connecting' ? 'text-yellow-400' : 'text-white/30'}`}>
            {status === 'live' ? 'LIVE' : status === 'connecting' ? 'CONNECTING...' : 'OFFLINE'}
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
              onClick={handleRetry}
              className="bg-naw-purple/30 border border-naw-purple/40 text-white px-4 py-2 rounded-lg text-xs hover:bg-naw-purple/50 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
        {status === 'connecting' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
            <div className="w-8 h-8 border-2 border-naw-cyan border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-white/50 text-sm">Connecting to {name}&apos;s camera...</p>
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
