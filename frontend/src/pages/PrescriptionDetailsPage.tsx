import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Prescription, AIAlert } from '../types';
import { BlockchainBadge } from '../components/common/BlockchainBadge';
import { AISafetyBanner } from '../components/common/AISafetyBanner';
import { Pill, ShieldAlert, CheckCircle2, FileText, ArrowLeft, Leaf, AlertTriangle } from 'lucide-react';

export const PrescriptionDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [alerts, setAlerts] = useState<AIAlert[]>([]);

  useEffect(() => {
    async function loadData() {
      const p = await api.getPrescriptionById(id || "PRES-1001");
      const alrts = await api.getAIAlerts("DEMO-PAT-101");
      setPrescription(p);
      setAlerts(alrts);
    }
    loadData();
  }, [id]);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <Link to="/prescriptions/history" className="flex items-center gap-1.5 text-xs text-mutedgray hover:text-charcoal font-semibold transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Prescription History</span>
        </Link>
        <BlockchainBadge txHash={prescription?.blockchain_tx_hash || "TX_0x9f8b7a6c5d4e3f2a1b"} />
      </div>

      <AISafetyBanner />

      {/* Verified Header */}
      <div className="glass-card-strong p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] bg-sunset-100 text-sunset-600 font-extrabold uppercase px-3 py-1 rounded-full border border-sunset-200">
              VERIFIED PRESCRIPTION RECORD
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-charcoal mt-1">Prescription #{prescription?.id || id}</h1>
            <p className="text-xs text-mutedgray mt-1">
              {prescription?.doctor_name} • {prescription?.hospital_name} • Date: {prescription?.prescription_date}
            </p>
          </div>

          <div className="flex items-center gap-2 text-sunset-600 text-xs font-bold bg-white/80 px-3.5 py-2 rounded-full border border-sunset-100 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-sunset-500" />
            <span>Doctor Signed & Verified</span>
          </div>
        </div>
      </div>

      {/* AI Safety Trigger Warning Banner if Allergy Conflict */}
      {alerts.length > 0 && (
        <div className="glass-card p-6 space-y-3 border border-sunset-300 bg-sunset-50/70">
          <div className="flex items-center gap-2 text-sunset-600 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-sunset-500" />
            <span className="font-display">AI Clinical Safety Warning Triggered</span>
          </div>
          {alerts.map((al) => (
            <div key={al.id} className="bg-white/90 p-4 rounded-2xl border border-sunset-200 space-y-2 text-xs shadow-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-charcoal">{al.title}</span>
                <span className="text-[10px] bg-rose-100 text-rose-700 px-2.5 py-0.5 rounded-full uppercase font-bold">{al.severity}</span>
              </div>
              <p className="text-mutedgray">{al.details}</p>
              <div className="text-sunset-700 text-[11px] font-semibold bg-sunset-100/70 p-2.5 rounded-xl border border-sunset-200">
                Action Recommended: {al.recommended_action}
              </div>
              <span className="block text-[10px] text-sunset-500 font-bold uppercase">{al.disclaimer}</span>
            </div>
          ))}
        </div>
      )}

      {/* Prescribed Medicines List */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-sunset-100 pb-3">
          <Pill className="w-5 h-5 text-sunset-500" />
          <h2 className="font-display text-lg font-bold text-charcoal">Prescribed Medications</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {prescription?.medicines && prescription.medicines.map((m, idx) => (
            <div key={idx} className="bg-white/80 p-4 rounded-2xl border border-sunset-100 space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-charcoal text-sm">{m.medicine_name}</span>
                <span className="text-xs text-sunset-600 font-semibold bg-sunset-50 px-2 py-0.5 rounded-full border border-sunset-100">{m.dosage}</span>
              </div>
              {m.generic_name && <p className="text-[11px] text-mutedgray">Generic: {m.generic_name}</p>}
              <div className="text-xs text-charcoal bg-sunset-50/40 p-3 rounded-xl border border-sunset-100 space-y-1">
                <p>Frequency: <strong className="text-sunset-600">{m.frequency}</strong></p>
                <p className="text-mutedgray">Duration: <span className="text-charcoal font-medium">{m.duration}</span></p>
                {m.instructions && <p className="text-[11px] text-mutedgray italic">Instructions: {m.instructions}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
