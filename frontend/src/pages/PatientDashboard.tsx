import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { PatientProfile, Prescription, AIAlert, LabReport } from '../types';
import { AISafetyBanner } from '../components/common/AISafetyBanner';
import { BlockchainBadge } from '../components/common/BlockchainBadge';
import { Shield, Leaf, FileText, AlertTriangle, Lock, Pill, CheckCircle2, ArrowRight } from 'lucide-react';

export const PatientDashboard: React.FC = () => {
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [alerts, setAlerts] = useState<AIAlert[]>([]);
  const [labs, setLabs] = useState<LabReport[]>([]);

  useEffect(() => {
    async function loadData() {
      const [profData, prescs, alrts, lbReports] = await Promise.all([
        api.getMyPatientProfile("u-1"),
        api.getPrescriptions("DEMO-PAT-101"),
        api.getAIAlerts("DEMO-PAT-101"),
        api.getLabReports("DEMO-PAT-101")
      ]);
      setProfile(profData);
      setPrescriptions(prescs);
      setAlerts(alrts);
      setLabs(lbReports);
    }
    loadData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Patient Header & Eco Score Banner */}
      <div className="glass-card-strong p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="bg-sunset-100 text-sunset-600 text-[11px] font-extrabold uppercase px-3 py-1 rounded-full border border-sunset-200">
              PATIENT HEALTH VAULT
            </span>
            <BlockchainBadge txHash="TX_0x8f7e6d5c4b3a2f1e0d9c8b7a" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-charcoal">
            Welcome back, {profile?.full_name || 'Alex Mercer'}
          </h1>
          <div className="flex flex-wrap items-center gap-5 text-xs text-mutedgray font-medium">
            <span>DOB: <strong className="text-charcoal font-bold">{profile?.dob || '1994-05-18'}</strong></span>
            <span>Blood Group: <strong className="text-rose-500 font-bold">{profile?.blood_group || 'O+'}</strong></span>
            <span>ID: <strong className="font-mono text-sunset-600 font-bold">{profile?.patient_id || 'DEMO-PAT-101'}</strong></span>
          </div>
        </div>

        {/* Eco Score Circular Meter Widget */}
        <div className="bg-white/80 p-5 rounded-2xl border border-sunset-100 flex items-center gap-4 shrink-0 shadow-xs">
          <div className="relative w-16 h-16 rounded-full bg-sunset-50 border-4 border-sunset-400 flex items-center justify-center font-display font-extrabold text-2xl text-sunset-600">
            {profile?.eco_score || 88}
          </div>
          <div>
            <span className="text-[10px] text-sunset-600 uppercase font-bold tracking-wider block">Your Eco Score</span>
            <p className="font-display text-base font-bold text-charcoal">Zero-Waste Advocate</p>
            <span className="text-[11px] text-mutedgray">14 Tests Avoided • 18.6kg CO₂ Saved</span>
          </div>
        </div>
      </div>

      <AISafetyBanner />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column: Active Prescriptions & Lab Vault */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Prescriptions */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-sunset-50 flex items-center justify-center text-sunset-500 border border-sunset-100">
                  <Pill className="w-4 h-4" />
                </div>
                <h2 className="font-display text-xl font-bold text-charcoal">Active Prescriptions & Medications</h2>
              </div>
              <Link to="/prescriptions/history" className="text-xs font-semibold text-sunset-600 hover:text-sunset-700 flex items-center gap-1">
                <span>View History</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {prescriptions.map((p) => (
                <div key={p.id} className="bg-white/70 p-4.5 rounded-2xl border border-sunset-100/80 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-charcoal block">{p.doctor_name}</span>
                      <span className="text-[11px] text-mutedgray">{p.hospital_name} • {p.prescription_date}</span>
                    </div>
                    <BlockchainBadge txHash={p.blockchain_tx_hash || "TX_0x98127391a"} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    {p.medicines && p.medicines.map((m, idx) => (
                      <div key={idx} className="bg-sunset-50/50 p-3 rounded-xl border border-sunset-100">
                        <p className="font-bold text-charcoal">{m.medicine_name} ({m.dosage})</p>
                        <p className="text-mutedgray text-[11px]">{m.frequency} • {m.duration}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Lab Reports */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-sunset-50 flex items-center justify-center text-sunset-500 border border-sunset-100">
                  <FileText className="w-4 h-4" />
                </div>
                <h2 className="font-display text-xl font-bold text-charcoal">Lab Reports & Diagnostic History</h2>
              </div>
              <Link to="/labs" className="text-xs font-semibold text-sunset-600 hover:text-sunset-700 flex items-center gap-1">
                <span>Duplicate Test Inspector</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {labs.map((lb) => (
                <div key={lb.id} className="bg-white/70 p-4 rounded-2xl border border-sunset-100 space-y-2 shadow-xs">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-charcoal">{lb.test_name}</span>
                    <span className="text-[10px] bg-sunset-100 text-sunset-600 px-2 py-0.5 rounded-full font-bold">
                      {lb.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-mutedgray">{lb.category} • Date: {lb.test_date}</p>
                  <p className="text-xs text-charcoal bg-sunset-50/40 p-2.5 rounded-xl border border-sunset-100 line-clamp-2">
                    {lb.result_summary}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Column: Allergies, AI Alerts & Consent */}
        <div className="space-y-6">
          {/* Allergies & Safety Notices */}
          <div className="glass-card p-6 space-y-4 border border-rose-200/80">
            <div className="flex items-center gap-2 text-rose-500 font-bold">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-display text-lg">Documented Allergies</h3>
            </div>
            <div className="space-y-2 text-xs">
              {profile?.allergies?.map((alg) => (
                <div key={alg.id} className="bg-rose-50/60 p-3.5 rounded-2xl border border-rose-200/60 space-y-1">
                  <div className="flex items-center justify-between font-bold text-rose-700">
                    <span>{alg.allergen}</span>
                    <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full uppercase font-bold">
                      {alg.severity}
                    </span>
                  </div>
                  <p className="text-mutedgray text-[11px]">{alg.reaction}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Consent Management */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sunset-600 font-bold">
                <Lock className="w-5 h-5" />
                <h3 className="font-display text-lg">Data Access Permissions</h3>
              </div>
              <Link to="/consents" className="text-xs font-semibold text-sunset-600 hover:text-sunset-700 flex items-center gap-1">
                <span>Manage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="bg-white/80 p-3.5 rounded-2xl border border-sunset-100 flex items-center justify-between shadow-xs">
                <div>
                  <p className="font-bold text-charcoal">Dr. Sarah Jenkins</p>
                  <p className="text-[11px] text-mutedgray">Full Health Vault Access</p>
                </div>
                <span className="text-[10px] bg-sunset-100 text-sunset-600 px-2.5 py-1 rounded-full font-bold">Active</span>
              </div>
              <div className="bg-white/80 p-3.5 rounded-2xl border border-sunset-100 flex items-center justify-between shadow-xs">
                <div>
                  <p className="font-bold text-charcoal">Metro Central Pharmacy</p>
                  <p className="text-[11px] text-mutedgray">Prescription Verification</p>
                </div>
                <span className="text-[10px] bg-sunset-100 text-sunset-600 px-2.5 py-1 rounded-full font-bold">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
