import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { PatientProfile } from '../types';
import { BlockchainBadge } from '../components/common/BlockchainBadge';
import { AISafetyBanner } from '../components/common/AISafetyBanner';
import { Lock, FileText, ShieldCheck, AlertCircle, Plus, Eye, Key } from 'lucide-react';

export const HealthVaultPage: React.FC = () => {
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [decrypted, setDecrypted] = useState(false);

  useEffect(() => {
    api.getMyPatientProfile("u-1").then(setProfile);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-sunset-600 font-extrabold uppercase tracking-wider">Patient Controlled Storage</span>
          <h1 className="font-display text-3xl font-extrabold text-charcoal">Encrypted Patient Health Vault</h1>
        </div>

        <div className="flex items-center gap-3">
          <BlockchainBadge txHash="TX_0x7a6b5c4d3e2f1a0b9c8d7e6f" />
          <button
            onClick={() => setDecrypted(!decrypted)}
            className="flex items-center gap-1.5 bg-white/80 hover:bg-white border border-sunset-200 text-charcoal px-4 py-2 rounded-full text-xs font-semibold transition-all shadow-xs"
          >
            <Key className="w-4 h-4 text-sunset-500" />
            <span>{decrypted ? 'Lock Vault (AES-256)' : 'Decrypt Key View'}</span>
          </button>
        </div>
      </div>

      <AISafetyBanner />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Encrypted Profile Card */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-sunset-100 pb-3">
            <span className="text-sm font-bold text-charcoal font-display">Patient Identity Profile</span>
            <span className="text-[10px] bg-sunset-100 text-sunset-600 px-2 py-0.5 rounded-full font-mono font-bold">Encrypted</span>
          </div>

          <div className="space-y-3 text-xs text-mutedgray">
            <div>
              <span className="text-[10px] text-mutedgray/70 uppercase font-semibold block">Full Legal Name</span>
              <span className="font-bold text-charcoal text-sm">{profile?.full_name || 'Alex Mercer'}</span>
            </div>
            <div>
              <span className="text-[10px] text-mutedgray/70 uppercase font-semibold block">Primary Contact & Emergency</span>
              <span className="text-charcoal font-medium">{profile?.emergency_contact || '+1-555-0192'}</span>
            </div>
            <div>
              <span className="text-[10px] text-mutedgray/70 uppercase font-semibold block">Blood Group & Phenotype</span>
              <span className="font-bold text-rose-500 text-sm">{profile?.blood_group || 'O+'}</span>
            </div>
          </div>
        </div>

        {/* Encrypted Clinical History Notes */}
        <div className="glass-card p-6 space-y-4 md:col-span-2">
          <div className="flex items-center justify-between border-b border-sunset-100 pb-3">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-sunset-500" />
              <span className="text-sm font-bold text-charcoal font-display">Encrypted Clinical History & Notes</span>
            </div>
            <span className="text-[10px] text-mutedgray font-mono">AES-256-CBC Payload</span>
          </div>

          <div className="bg-white/80 p-5 rounded-2xl border border-sunset-100 font-mono text-xs text-sunset-600 space-y-2 shadow-xs">
            {decrypted ? (
              <div className="text-charcoal font-sans text-xs space-y-2">
                <p className="font-bold text-sunset-600">Decrypted Payload:</p>
                <p>• Documented severe Penicillin allergy (Urticaria & airway hypersensitivity).</p>
                <p>• History of mild childhood asthma managed with albuterol PRN.</p>
                <p>• Baseline ECG normal. Last Lipid panel cholesterol 195 mg/dL.</p>
              </div>
            ) : (
              <div className="break-all text-mutedgray font-mono">
                ENC::IV_8f912a73b401c::CT_a8f910293847561029384756102938475610293847561029384756102938475610293847561029384756...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
