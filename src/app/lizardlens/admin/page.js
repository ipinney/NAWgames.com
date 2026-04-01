'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const ADMIN_UID = 'zy8WSqtL3GUuyw89u1X1ZzENULP2';

export default function LizardLensAdminPage() {
  const { user, loading } = useAuth();
  const [requests, setRequests] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const isAdmin = user?.uid === ADMIN_UID;

  useEffect(() => {
    if (loading || !isAdmin) return;

    const fetchRequests = async () => {
      try {
        const q = query(collection(db, 'lizardlens_access'));
        const snapshot = await getDocs(q);
        const docs = [];
        snapshot.forEach((d) => {
          docs.push({ id: d.id, ...d.data() });
        });
        // Sort: pending first, then approved, then denied
        const order = { pending: 0, approved: 1, denied: 2 };
        docs.sort((a, b) => (order[a.status] ?? 3) - (order[b.status] ?? 3));
        setRequests(docs);
      } catch (err) {
        console.error('Error fetching requests:', err);
      }
      setFetching(false);
    };

    fetchRequests();
  }, [user, loading, isAdmin]);

  const handleAction = async (uid, action) => {
    setActionLoading(uid);
    try {
      const docRef = doc(db, 'lizardlens_access', uid);
      if (action === 'delete') {
        await deleteDoc(docRef);
        setRequests((prev) => prev.filter((r) => r.id !== uid));
      } else {
        await updateDoc(docRef, {
          status: action,
          reviewedAt: new Date().toISOString(),
        });
        setRequests((prev) =>
          prev.map((r) => (r.id === uid ? { ...r, status: action } : r))
        );
      }
    } catch (err) {
      console.error('Error updating:', err);
      alert('Failed to update. Try again.');
    }
    setActionLoading(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-naw-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <span className="text-4xl block mb-3">🔒</span>
          <p className="text-white/60 text-sm">Admin access only.</p>
          <Link href="/" className="text-naw-cyan text-xs hover:underline mt-3 inline-block">
            Back to NAW Games
          </Link>
        </div>
      </div>
    );
  }

  const pending = requests.filter((r) => r.status === 'pending');
  const approved = requests.filter((r) => r.status === 'approved');
  const denied = requests.filter((r) => r.status === 'denied');

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/lizardlens" className="text-white/40 hover:text-white/70 text-xs transition-colors">
              ← Back to Lizard Lens
            </Link>
            <h1 className="text-white font-bold text-xl mt-2">Lizard Lens — Access Manager</h1>
          </div>
          <div className="flex gap-3 text-xs">
            <span className="text-yellow-400">{pending.length} pending</span>
            <span className="text-green-400">{approved.length} approved</span>
            <span className="text-red-400">{denied.length} denied</span>
          </div>
        </div>

        {fetching ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-naw-green border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-white/40 text-sm">Loading requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-4xl block mb-3">🦎</span>
            <p className="text-white/40 text-sm">No access requests yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((r) => (
              <div
                key={r.id}
                className={`bg-naw-card rounded-xl border p-4 ${
                  r.status === 'pending'
                    ? 'border-yellow-500/30'
                    : r.status === 'approved'
                    ? 'border-green-500/20'
                    : 'border-red-500/20'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-semibold text-sm truncate">{r.name}</h3>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          r.status === 'pending'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : r.status === 'approved'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {r.status}
                      </span>
                    </div>
                    <p className="text-white/40 text-xs mb-1">{r.email}</p>
                    <p className="text-white/60 text-xs">
                      <span className="text-white/30">How they know us:</span>{' '}
                      {r.relationship}
                    </p>
                    {r.createdAt && (
                      <p className="text-white/20 text-[10px] mt-1">
                        Requested: {r.createdAt?.toDate ? r.createdAt.toDate().toLocaleDateString() : new Date(r.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 shrink-0">
                    {r.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleAction(r.id, 'approved')}
                          disabled={actionLoading === r.id}
                          className="bg-green-500/20 text-green-400 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-green-500/30 transition-colors disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(r.id, 'denied')}
                          disabled={actionLoading === r.id}
                          className="bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-500/30 transition-colors disabled:opacity-50"
                        >
                          Deny
                        </button>
                      </>
                    )}
                    {r.status === 'approved' && (
                      <button
                        onClick={() => handleAction(r.id, 'denied')}
                        disabled={actionLoading === r.id}
                        className="bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-500/30 transition-colors disabled:opacity-50"
                      >
                        Revoke
                      </button>
                    )}
                    {r.status === 'denied' && (
                      <>
                        <button
                          onClick={() => handleAction(r.id, 'approved')}
                          disabled={actionLoading === r.id}
                          className="bg-green-500/20 text-green-400 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-green-500/30 transition-colors disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(r.id, 'delete')}
                          disabled={actionLoading === r.id}
                          className="bg-white/5 text-white/30 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-white/10 transition-colors disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
