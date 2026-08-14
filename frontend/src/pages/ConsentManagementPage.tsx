import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Consent } from '../types';
import { BlockchainBadge } from '../components/common/BlockchainBadge';
import { AISafetyBanner } from '../components/common/AISafetyBanner';
import { Lock, Shield, Plus, Trash2, CheckCircle2, UserCheck, ArrowRight } from 'lucide-react';

export const ConsentManagementPage: React.FC = () => {
  const [consents, setConsents] = useState<Consent[]>([]);
  const [grantedTo, setGrantedTo] = useState('Dr. Marcus Vance');
  const [role, setRole] = useState('DOCTOR');
  const [purpose, setPurpose] = useState('Second opinion clinical evaluation');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    api.getConsents("DEMO-PAT-101").then(setConsents);
  }, []);

  const handleGrant = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      const newConsent = await api.grantConsent(grantedTo, role, purpose, 30);
      setConsents([newConsent, ...consents]);
    } finally {
      setAdding(false);
    }
  };

  const handleRevoke = async (id: string) => {
    await api.revokeConsent(id);
    setConsents(consents.map(c => c.id === id ? { ...c, is_active: false } : c));
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8 animate-fade-in">
      <div className="space-y-2">
        <span className="text-xs text-sunset-600 font-extrabold uppercase tracking-wider">Patient Sovereignty & Zero-Trust</span>
        <h1 className="font-display text-3xl font-extrabold text-charcoal">Blockchain Consent Management</h1>
        <p className="text-mutedgray text-sm">Patients hold full authority to grant or revoke health data access to clinicians, pharmacies, or researchers.</p>
      </div>

      <AISafetyBanner />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Grant New Consent Form */}
        <form onSubmit={handleGrant} className="glass-card-strong p-6 space-y-4 shadow-lg">
          <div className="flex items-center gap-2 border-b border-sunset-100 pb-3">
            <UserCheck className="w-5 h-5 text-sunset-500" />
            <h2 className="font-display text-lg font-bold text-charcoal">Grant New Access Consent</h2>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal">Grantee Entity / Practitioner</label>
            <input
              type="text"
              value={grantedTo}
              onChange={(e) => setGrantedTo(e.target.value)}
              className="w-full bg-white/80 border border-sunset-100 rounded-2xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:border-sunset-400 shadow-xs"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal">Entity Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-white/80 border border-sunset-100 rounded-2xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:border-sunset-400 shadow-xs"
            >
              <option value="DOCTOR">Doctor / Clinician</option>
              <option value="PHARMACY">Pharmacy</option>
              <option value="RESEARCH">Anonymized Research</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal">Clinical Purpose</label>
            <textarea
              rows={2}
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full bg-white/80 border border-sunset-100 rounded-2xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:border-sunset-400 shadow-xs"
              required
            />
          </div>

          <button
            type="submit"
            disabled={adding}
            className="w-full btn-sunset-primary py-3 text-xs shadow-md"
          >
            {adding ? 'Cryptographically Signing...' : 'Sign & Grant Access →'}
          </button>
        </form>

        {/* Active Consents List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-display text-lg font-bold text-charcoal">Active Data Permissions ({consents.filter(c => c.is_active).length})</h2>
          
          <div className="space-y-3">
            {consents.map((c) => (
              <div
                key={c.id}
                className={`p-5 rounded-2xl border space-y-3 transition-all ${
                  c.is_active ? 'glass-card shadow-xs' : 'bg-white/40 border-sunset-100 opacity-60'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-charcoal text-sm">{c.granted_to_name}</span>
                    <span className="text-[11px] text-mutedgray block">{c.granted_to_role} • Purpose: {c.purpose}</span>
                  </div>
                  <BlockchainBadge txHash={c.blockchain_tx_hash} />
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-sunset-100">
                  <span className="text-mutedgray">Expires: {new Date(c.expiration_time).toLocaleDateString()}</span>
                  {c.is_active ? (
                    <button
                      onClick={() => handleRevoke(c.id)}
                      className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3.5 py-1 rounded-full text-xs font-semibold transition-colors"
                    >
                      Revoke Consent
                    </button>
                  ) : (
                    <span className="text-rose-600 text-xs font-bold uppercase">REVOKED</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
