import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Leaf, Activity, Lock, Cpu, BarChart3, ArrowRight, CheckCircle2, Sparkles, RefreshCw, Zap } from 'lucide-react';
import { AISafetyBanner } from '../components/common/AISafetyBanner';

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-24 py-8 animate-fade-in">
      {/* 2026 Spatial Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20">
        {/* Soft Ambient Sunset Glow Behind Hero */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sunset-200/35 blur-[160px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-1/4 right-1/4 w-[350px] h-[350px] bg-sunset-300/20 blur-[130px] rounded-full pointer-events-none -z-10" />
        
        <div className="max-w-6xl mx-auto text-center space-y-8 px-4 relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-md border border-sunset-200/80 text-sunset-600 px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase shadow-xs">
            <Sparkles className="w-4 h-4 text-sunset-500" />
            <span>2026 Healthcare Intelligence Network</span>
          </div>

          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-extrabold text-charcoal tracking-tight leading-[1.08]">
            Your Health. Your Data.<br />
            <span className="gradient-text-sunset italic">Zero Waste.</span>
          </h1>

          <p className="text-mutedgray text-lg sm:text-2xl max-w-3xl mx-auto leading-relaxed font-normal">
            A patient-owned green healthcare intelligence platform combining AES-256 encrypted health vaults, automated prescription OCR parsing, transparent AI clinical safety guardrails, and real-time sustainability analytics.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/patient/dashboard"
              className="btn-sunset-primary px-8 py-4 text-base shadow-xl group"
            >
              <span>Explore Patient Vault</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/doctor/upload-prescription"
              className="btn-sunset-glass px-8 py-4 text-base shadow-md group"
            >
              <Cpu className="w-5 h-5 text-sunset-500" />
              <span>Launch OCR Prescription Engine</span>
            </Link>
          </div>

          <div className="pt-8 max-w-3xl mx-auto">
            <AISafetyBanner />
          </div>
        </div>
      </section>

      {/* Spatial Feature Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-sunset-500">Core Architecture</span>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-charcoal">Six Pillars of Intelligence</h2>
          <p className="text-mutedgray text-base max-w-xl mx-auto font-normal">
            Engineered for patient sovereignty, clinical accuracy, and zero-waste stewardship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="glass-card p-8 space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-sunset-50 border border-sunset-100 flex items-center justify-center text-sunset-500 shadow-xs">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="font-display text-xl font-bold text-charcoal">1. Patient Health Vault</h3>
            <p className="text-mutedgray text-sm leading-relaxed">
              Patient owns and controls access to prescriptions, allergies, lab reports, and medical history with field-level AES-256 encryption.
            </p>
            <div className="flex items-center gap-2 text-sunset-600 text-xs font-semibold pt-2">
              <CheckCircle2 className="w-4 h-4 text-sunset-500" /> Cryptographic Zero-Trust Access
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-card p-8 space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-sunset-50 border border-sunset-100 flex items-center justify-center text-sunset-500 shadow-xs">
              <Cpu className="w-7 h-7" />
            </div>
            <h3 className="font-display text-xl font-bold text-charcoal">2. OCR Prescription Capture</h3>
            <p className="text-mutedgray text-sm leading-relaxed">
              OCR & NER pipeline extracts patient details, dosage, frequency, and instructions from uploaded images/PDFs with doctor human-in-the-loop verification.
            </p>
            <div className="flex items-center gap-2 text-sunset-600 text-xs font-semibold pt-2">
              <CheckCircle2 className="w-4 h-4 text-sunset-500" /> Doctor Verification Required
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass-card p-8 space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-sunset-50 border border-sunset-100 flex items-center justify-center text-sunset-500 shadow-xs">
              <Activity className="w-7 h-7" />
            </div>
            <h3 className="font-display text-xl font-bold text-charcoal">3. AI Clinical Safety Engine</h3>
            <p className="text-mutedgray text-sm leading-relaxed">
              Rule-based clinical checking for drug-drug interactions, penicillin cross-allergy conflicts, duplicate active medications, and dosage anomalies.
            </p>
            <div className="flex items-center gap-2 text-sunset-600 text-xs font-semibold pt-2">
              <CheckCircle2 className="w-4 h-4 text-sunset-500" /> Transparent Advisory Guardrails
            </div>
          </div>

          {/* Card 4 */}
          <div className="glass-card p-8 space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-sunset-50 border border-sunset-100 flex items-center justify-center text-sunset-500 shadow-xs">
              <RefreshCw className="w-7 h-7" />
            </div>
            <h3 className="font-display text-xl font-bold text-charcoal">4. Duplicate Test Prevention</h3>
            <p className="text-mutedgray text-sm leading-relaxed">
              Evaluates diagnostic repeat validity windows to flag redundant test orders, preventing unnecessary patient blood draws and hazardous lab waste.
            </p>
            <div className="flex items-center gap-2 text-sunset-600 text-xs font-semibold pt-2">
              <CheckCircle2 className="w-4 h-4 text-sunset-500" /> Avoids Hazardous Lab Waste
            </div>
          </div>

          {/* Card 5 */}
          <div className="glass-card p-8 space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-sunset-50 border border-sunset-100 flex items-center justify-center text-sunset-500 shadow-xs">
              <BarChart3 className="w-7 h-7" />
            </div>
            <h3 className="font-display text-xl font-bold text-charcoal">5. Demand Forecast & Expiry</h3>
            <p className="text-mutedgray text-sm leading-relaxed">
              Pharmacy inventory color-coded expiry tracking (0-30 days critical, 31-90 days near expiry) paired with a 30-day medicine demand forecasting model.
            </p>
            <div className="flex items-center gap-2 text-sunset-600 text-xs font-semibold pt-2">
              <CheckCircle2 className="w-4 h-4 text-sunset-500" /> Stock Redistribution Intelligence
            </div>
          </div>

          {/* Card 6 */}
          <div className="glass-card p-8 space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-sunset-50 border border-sunset-100 flex items-center justify-center text-sunset-500 shadow-xs">
              <Shield className="w-7 h-7" />
            </div>
            <h3 className="font-display text-xl font-bold text-charcoal">6. Blockchain Consent Audit</h3>
            <p className="text-mutedgray text-sm leading-relaxed">
              Cryptographic ledger simulation generating SHA-256 transaction hashes for every health vault access, doctor consent grant, and record view.
            </p>
            <div className="flex items-center gap-2 text-sunset-600 text-xs font-semibold pt-2">
              <CheckCircle2 className="w-4 h-4 text-sunset-500" /> Tamper-Proof Audit Trail
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Workflow Section */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="glass-card-strong p-10 sm:p-12 space-y-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <span className="text-xs text-sunset-600 font-extrabold uppercase tracking-widest">Live Experience</span>
              <h2 className="font-display text-3xl font-extrabold text-charcoal mt-1">End-to-End OCR & AI Safety Flow</h2>
            </div>
            <Link
              to="/doctor/upload-prescription"
              className="btn-sunset-primary text-xs shadow-md self-start sm:self-auto"
            >
              <span>Start Live Workflow</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div className="bg-white/80 p-5 rounded-2xl border border-sunset-100 space-y-2 shadow-xs hover:border-sunset-300 transition-colors">
              <span className="inline-block px-2 py-0.5 rounded-full bg-sunset-100 text-sunset-600 font-extrabold text-[10px]">STEP 1</span>
              <p className="font-bold text-charcoal text-sm">Upload Prescription</p>
              <p className="text-mutedgray text-xs">Doctor uploads JPG/PNG/PDF file or picks sample.</p>
            </div>
            <div className="bg-white/80 p-5 rounded-2xl border border-sunset-100 space-y-2 shadow-xs hover:border-sunset-300 transition-colors">
              <span className="inline-block px-2 py-0.5 rounded-full bg-sunset-100 text-sunset-600 font-extrabold text-[10px]">STEP 2</span>
              <p className="font-bold text-charcoal text-sm">OCR Parsing & Review</p>
              <p className="text-mutedgray text-xs">Extracts structured JSON for doctor inspection & editing.</p>
            </div>
            <div className="bg-white/80 p-5 rounded-2xl border border-sunset-100 space-y-2 shadow-xs hover:border-sunset-300 transition-colors">
              <span className="inline-block px-2 py-0.5 rounded-full bg-sunset-100 text-sunset-600 font-extrabold text-[10px]">STEP 3</span>
              <p className="font-bold text-charcoal text-sm">Doctor Verification</p>
              <p className="text-mutedgray text-xs">Doctor verifies & cryptographically saves to vault.</p>
            </div>
            <div className="bg-white/80 p-5 rounded-2xl border border-sunset-100 space-y-2 shadow-xs hover:border-sunset-300 transition-colors">
              <span className="inline-block px-2 py-0.5 rounded-full bg-sunset-100 text-sunset-600 font-extrabold text-[10px]">STEP 4</span>
              <p className="font-bold text-charcoal text-sm">AI Safety & Eco Log</p>
              <p className="text-mutedgray text-xs">Flags allergy conflicts & records SHA-256 audit hash.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
