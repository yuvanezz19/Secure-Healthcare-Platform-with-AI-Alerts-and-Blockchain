import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { PatientProfile, Prescription, LabReport } from '../types';
import { BlockchainBadge } from '../components/common/BlockchainBadge';
import { AISafetyBanner } from '../components/common/AISafetyBanner';
import { Search, User, Pill, FileText, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';

export const DoctorPatientViewPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const patientIdParam = searchParams.get('patient_id') || 'DEMO-PAT-101';

  const [patient, setPatient] = useState<PatientProfile | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [labs, setLabs] = useState<LabReport[]>([]);

  useEffect(() => {
    async function load() {
      const p = await api.getPatientById(patientIdParam);
      const prs = await api.getPrescriptions(patientIdParam);
      const lbs = await api.getLabReports(patientIdParam);
      setPatient(p);
      setPrescriptions(prs);
      setLabs(lbs);
    }
    load();
  }, [patientIdParam]);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-sunset-600 font-extrabold uppercase tracking-wider">Authorized Clinical Access</span>
          <h1 className="font-display text-3xl font-extrabold text-charcoal">Patient Record Vault</h1>
        </div>
        <BlockchainBadge txHash="TX_0x9a8b7c6d5e4f3a2b1c" />
      </div>

      <AISafetyBanner />

      <div className="glass-card-strong p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <h2 className="font-display text-2xl font-bold text-charcoal">{patient?.full_name || 'Alex Mercer'}</h2>
          <p className="text-xs text-mutedgray">
            ID: <span className="font-mono text-sunset-600 font-bold">{patient?.patient_id}</span> • DOB: {patient?.dob} • Blood: <strong className="text-rose-500">{patient?.blood_group}</strong>
          </p>
        </div>

        <Link
          to="/doctor/upload-prescription"
          className="btn-sunset-primary text-xs shadow-md self-start md:self-auto"
        >
          <span>New Prescription Capture</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Allergies Notice */}
      <div className="glass-card p-4 space-y-2 border border-rose-200 bg-rose-50/50">
        <span className="text-xs font-bold text-rose-700 flex items-center gap-1.5 uppercase">
          <AlertTriangle className="w-4 h-4 text-rose-500" />
          Documented Allergy Profile
        </span>
        <div className="flex flex-wrap gap-2 text-xs">
          {patient?.allergies?.map((a) => (
            <span key={a.id} className="bg-white/90 text-rose-800 border border-rose-200 px-3 py-1.5 rounded-full font-bold shadow-xs">
              {a.allergen} ({a.severity}) — {a.reaction}
            </span>
          ))}
        </div>
      </div>

      {/* Prescriptions & Lab Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 space-y-4 shadow-xs">
          <h3 className="font-display text-base font-bold text-charcoal flex items-center gap-2">
            <Pill className="w-4 h-4 text-sunset-500" /> Prescriptions History
          </h3>
          <div className="space-y-3 text-xs">
            {prescriptions.map((p) => (
              <div key={p.id} className="bg-white/80 p-3.5 rounded-2xl border border-sunset-100 space-y-1 shadow-xs">
                <div className="flex items-center justify-between font-bold text-charcoal">
                  <span>{p.doctor_name}</span>
                  <span className="text-[10px] text-mutedgray">{p.prescription_date}</span>
                </div>
                <p className="text-mutedgray">{p.medicines?.map(m => m.medicine_name).join(', ')}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6 space-y-4 shadow-xs">
          <h3 className="font-display text-base font-bold text-charcoal flex items-center gap-2">
            <FileText className="w-4 h-4 text-sunset-500" /> Diagnostic Lab Reports
          </h3>
          <div className="space-y-3 text-xs">
            {labs.map((l) => (
              <div key={l.id} className="bg-white/80 p-3.5 rounded-2xl border border-sunset-100 space-y-1 shadow-xs">
                <div className="flex items-center justify-between font-bold text-charcoal">
                  <span>{l.test_name}</span>
                  <span className="text-[10px] bg-sunset-100 text-sunset-600 px-2 py-0.5 rounded-full font-bold">{l.status}</span>
                </div>
                <p className="text-mutedgray">Date: {l.test_date} • Dr. {l.doctor_name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
