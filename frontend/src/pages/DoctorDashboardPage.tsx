import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { AISafetyBanner } from '../components/common/AISafetyBanner';
import { Stethoscope, Upload, Search, Users, CheckCircle2, ShieldAlert, Plus, ArrowRight } from 'lucide-react';

export const DoctorDashboardPage: React.FC = () => {
  const [stats, setStats] = useState({ authorized_patients_count: 3, prescriptions_verified_count: 12, ai_safety_alerts_count: 2, duplicate_tests_prevented: 14 });
  const [patients, setPatients] = useState<any[]>([]);

  useEffect(() => {
    api.getDoctorStats().then(setStats);
    api.listPatients().then(setPatients);
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs text-sunset-600 font-extrabold uppercase tracking-wider">DOCTOR CLINICAL WORKSPACE</span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-charcoal">Dr. Sarah Jenkins, MD</h1>
          <p className="text-mutedgray text-xs">Internal Medicine & Cardiology • Metro Central Medical Center</p>
        </div>

        <Link
          to="/doctor/upload-prescription"
          className="btn-sunset-primary text-xs shadow-md self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>Upload & Verify Prescription (OCR)</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <AISafetyBanner />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="glass-card p-5 space-y-1">
          <span className="text-xs text-mutedgray font-semibold uppercase">Authorized Patients</span>
          <p className="font-display text-3xl font-extrabold text-charcoal">{stats.authorized_patients_count}</p>
        </div>
        <div className="glass-card p-5 space-y-1">
          <span className="text-xs text-mutedgray font-semibold uppercase">Prescriptions Verified</span>
          <p className="font-display text-3xl font-extrabold text-sunset-600">{stats.prescriptions_verified_count}</p>
        </div>
        <div className="glass-card p-5 space-y-1">
          <span className="text-xs text-mutedgray font-semibold uppercase">Active Safety Warnings</span>
          <p className="font-display text-3xl font-extrabold text-rose-500">{stats.ai_safety_alerts_count}</p>
        </div>
        <div className="glass-card p-5 space-y-1">
          <span className="text-xs text-mutedgray font-semibold uppercase">Duplicate Labs Avoided</span>
          <p className="font-display text-3xl font-extrabold text-sunset-500">{stats.duplicate_tests_prevented}</p>
        </div>
      </div>

      {/* Patient Search & List */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-sunset-500" />
            <h2 className="font-display text-lg font-bold text-charcoal">Authorized Patient Roster</h2>
          </div>
          <Link to="/doctor/patient-view" className="text-xs font-semibold text-sunset-600 hover:text-sunset-700 flex items-center gap-1">
            <span>Search Vault</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {patients.map((p) => (
            <div key={p.patient_id} className="bg-white/80 p-4 rounded-2xl border border-sunset-100 space-y-2 shadow-xs hover:border-sunset-300 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-bold text-charcoal text-sm">{p.full_name}</span>
                <span className="text-[10px] bg-sunset-100 text-sunset-600 px-2 py-0.5 rounded-full font-bold">
                  Score: {p.eco_score}
                </span>
              </div>
              <p className="text-xs text-mutedgray">DOB: {p.dob} • Blood: <strong className="text-rose-500">{p.blood_group}</strong></p>
              <Link
                to={`/doctor/patient-view?patient_id=${p.patient_id}`}
                className="inline-flex items-center gap-1 text-xs font-semibold text-sunset-600 hover:text-sunset-700 pt-1"
              >
                <span>Inspect Health Vault</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
