import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { OCRExtraction, Medicine } from '../types';
import { AISafetyBanner } from '../components/common/AISafetyBanner';
import { CheckCircle2, Edit3, Plus, Trash2, Lock, Eye, ArrowRight } from 'lucide-react';

export const OCRVerificationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const extraction: OCRExtraction = location.state?.extraction || {
    patient_name: "Alex Mercer",
    patient_id: "DEMO-PAT-101",
    doctor_name: "Dr. Sarah Jenkins, MD",
    hospital_name: "Metro Health Medical Center",
    prescription_date: new Date().toISOString().split('T')[0],
    confidence: 0.96,
    raw_ocr_text: "VORTEXA OCR ENGINE EXTRACTED TEXT:\nHOSPITAL: Metro Health Medical Center\nDOCTOR: Dr. Sarah Jenkins, MD\nPATIENT: Alex Mercer\nPRESCRIPTION:\n- Amoxicillin 500mg TID 7 days\n- Paracetamol 650mg PRN 5 days",
    extracted_medicines: [
      { medicine_name: "Amoxicillin", generic_name: "Amoxicillin Trihydrate", dosage: "500mg", frequency: "Three times daily (TID)", duration: "7 days", instructions: "Take after meals" },
      { medicine_name: "Paracetamol", generic_name: "Acetaminophen", dosage: "650mg", frequency: "As needed (PRN)", duration: "5 days", instructions: "For fever or pain" }
    ]
  };

  const [doctorName, setDoctorName] = useState(extraction.doctor_name);
  const [hospitalName, setHospitalName] = useState(extraction.hospital_name);
  const [date, setDate] = useState(extraction.prescription_date);
  const [medicines, setMedicines] = useState<Medicine[]>(extraction.extracted_medicines);
  const [verifying, setVerifying] = useState(false);

  const handleMedChange = (index: number, field: keyof Medicine, val: string) => {
    const updated = [...medicines];
    updated[index] = { ...updated[index], [field]: val };
    setMedicines(updated);
  };

  const handleAddMedicine = () => {
    setMedicines([...medicines, { medicine_name: "", dosage: "500mg", frequency: "Once daily", duration: "5 days" }]);
  };

  const handleRemoveMedicine = (index: number) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleVerify = async () => {
    setVerifying(true);
    try {
      const prescId = `PRES-${Date.now().toString().slice(-4)}`;
      const saved = await api.verifyPrescription(prescId, doctorName, hospitalName, date, medicines, "DEMO-PAT-101");
      navigate(`/prescriptions/${saved.id || prescId}`);
    } catch (err) {
      console.error(err);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="bg-sunset-100 text-sunset-600 text-xs font-bold px-3 py-1 rounded-full border border-sunset-200 uppercase tracking-widest">
            MAIN DEMO FEATURE • STEP 2 OF 2
          </span>
          <h1 className="font-display text-3xl font-extrabold text-charcoal mt-1">Doctor OCR Review & Verification</h1>
        </div>

        <div className="flex items-center gap-2 bg-white/80 border border-sunset-100 px-3.5 py-1.5 rounded-full text-xs font-bold text-sunset-600 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-sunset-500" />
          <span>OCR Confidence: {(extraction.confidence * 100).toFixed(0)}%</span>
        </div>
      </div>

      <AISafetyBanner message="Review extracted prescription parameters carefully before signing into patient vault." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Raw OCR View */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-sunset-100 pb-3">
            <Eye className="w-4 h-4 text-sunset-500" />
            <span className="font-display text-base font-bold text-charcoal">Raw OCR Text Stream</span>
          </div>

          <div className="bg-white/80 p-4 rounded-2xl border border-sunset-100 font-mono text-xs text-charcoal whitespace-pre-wrap leading-relaxed shadow-xs">
            {extraction.raw_ocr_text}
          </div>
        </div>

        {/* Right Column: Editable Verification Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card-strong p-8 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-sunset-100 pb-3">
              <div className="flex items-center gap-2.5">
                <Edit3 className="w-5 h-5 text-sunset-500" />
                <h2 className="font-display text-xl font-bold text-charcoal">Structured Prescription Parameters</h2>
              </div>
              <span className="text-xs text-sunset-600 font-bold uppercase">Editable Form</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-charcoal">Doctor Name</label>
                <input
                  type="text"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full bg-white/80 border border-sunset-100 rounded-xl px-3 py-2 text-xs text-charcoal focus:outline-none focus:border-sunset-400 shadow-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-charcoal">Hospital / Clinic</label>
                <input
                  type="text"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  className="w-full bg-white/80 border border-sunset-100 rounded-xl px-3 py-2 text-xs text-charcoal focus:outline-none focus:border-sunset-400 shadow-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-charcoal">Prescription Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-white/80 border border-sunset-100 rounded-xl px-3 py-2 text-xs text-charcoal focus:outline-none focus:border-sunset-400 shadow-xs"
                />
              </div>
            </div>

            {/* Extracted Medicines Table */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-bold text-charcoal">Extracted Medicines ({medicines.length})</h3>
                <button
                  onClick={handleAddMedicine}
                  className="flex items-center gap-1.5 text-xs font-bold text-sunset-600 hover:text-sunset-700"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Medicine Row</span>
                </button>
              </div>

              <div className="space-y-3">
                {medicines.map((m, idx) => (
                  <div key={idx} className="bg-white/80 p-4 rounded-2xl border border-sunset-100 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-sunset-600">Medicine #{idx + 1}</span>
                      <button onClick={() => handleRemoveMedicine(idx)} className="text-rose-500 hover:text-rose-600 text-xs">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                      <input
                        placeholder="Medicine Name"
                        value={m.medicine_name}
                        onChange={(e) => handleMedChange(idx, 'medicine_name', e.target.value)}
                        className="bg-sunset-50/50 border border-sunset-100 rounded-lg px-2.5 py-1.5 text-charcoal focus:outline-none focus:border-sunset-400"
                      />
                      <input
                        placeholder="Dosage (e.g. 500mg)"
                        value={m.dosage}
                        onChange={(e) => handleMedChange(idx, 'dosage', e.target.value)}
                        className="bg-sunset-50/50 border border-sunset-100 rounded-lg px-2.5 py-1.5 text-charcoal focus:outline-none focus:border-sunset-400"
                      />
                      <input
                        placeholder="Frequency (e.g. TID)"
                        value={m.frequency}
                        onChange={(e) => handleMedChange(idx, 'frequency', e.target.value)}
                        className="bg-sunset-50/50 border border-sunset-100 rounded-lg px-2.5 py-1.5 text-charcoal focus:outline-none focus:border-sunset-400"
                      />
                      <input
                        placeholder="Duration (e.g. 7 days)"
                        value={m.duration}
                        onChange={(e) => handleMedChange(idx, 'duration', e.target.value)}
                        className="bg-sunset-50/50 border border-sunset-100 rounded-lg px-2.5 py-1.5 text-charcoal focus:outline-none focus:border-sunset-400"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-sunset-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-mutedgray">
                <Lock className="w-4 h-4 text-sunset-500" />
                <span>Will be AES-256 encrypted and logged to Blockchain audit.</span>
              </div>

              <button
                onClick={handleVerify}
                disabled={verifying}
                className="btn-sunset-primary px-6 py-3.5 text-sm shadow-xl"
              >
                {verifying ? 'Verifying & Saving...' : (
                  <>
                    <span>Verify & Save to Patient Vault</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
