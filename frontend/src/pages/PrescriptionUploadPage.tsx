import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Upload, FileText, Cpu, ArrowRight, CheckCircle2 } from 'lucide-react';
import { AISafetyBanner } from '../components/common/AISafetyBanner';

export const PrescriptionUploadPage: React.FC = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [sampleSelected, setSampleSelected] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleRunOCR = async () => {
    setLoading(true);
    try {
      const uploadFile = file || new File(["sample data"], sampleSelected || "prescription_demo.png", { type: "image/png" });
      const result = await api.uploadPrescriptionFile(uploadFile);
      navigate('/doctor/verify-ocr', { state: { extraction: result } });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <span className="bg-sunset-100 text-sunset-600 text-xs font-bold px-3.5 py-1.5 rounded-full border border-sunset-200 uppercase tracking-widest">
          MAIN DEMO FEATURE • STEP 1 OF 2
        </span>
        <h1 className="font-display text-4xl font-extrabold text-charcoal">Upload Prescription Document</h1>
        <p className="text-mutedgray text-sm">Upload physical prescription photo or PDF for OCR & structured NLP capture.</p>
      </div>

      <AISafetyBanner />

      {/* File Drag-and-drop Card */}
      <div className="glass-card-strong p-10 border-2 border-dashed border-sunset-300 hover:border-sunset-500 transition-all duration-300 text-center space-y-5 shadow-lg">
        <div className="w-16 h-16 rounded-2xl bg-sunset-50 border border-sunset-200 flex items-center justify-center text-sunset-500 mx-auto shadow-xs">
          <Upload className="w-8 h-8" />
        </div>

        <div>
          <label className="cursor-pointer text-base font-display font-bold text-charcoal hover:text-sunset-600 transition-colors">
            <span>Click to upload prescription file</span>
            <input type="file" onChange={handleFileChange} accept=".png,.jpg,.jpeg,.pdf" className="hidden" />
          </label>
          <p className="text-mutedgray text-xs mt-1">Supports PNG, JPG, JPEG, PDF up to 15MB</p>
        </div>

        {file && (
          <div className="inline-flex items-center gap-2 bg-sunset-100/80 border border-sunset-200 text-sunset-600 px-4 py-2 rounded-full text-xs font-semibold shadow-xs">
            <FileText className="w-4 h-4" />
            <span>Selected File: {file.name}</span>
          </div>
        )}
      </div>

      {/* Preset Demo Images Option */}
      <div className="glass-card p-6 space-y-3">
        <span className="text-xs font-extrabold text-sunset-600 uppercase tracking-wider block">Or Choose Demo Prescription Sample:</span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => { setSampleSelected('standard_demo.png'); setFile(null); }}
            className={`p-4 rounded-2xl border text-left text-xs transition-all duration-300 shadow-xs ${
              sampleSelected === 'standard_demo.png'
                ? 'bg-sunset-100 border-sunset-400 text-sunset-700 shadow-sm'
                : 'bg-white/80 border-sunset-100 text-charcoal hover:bg-sunset-50/60'
            }`}
          >
            <p className="font-display font-bold text-sm">Sample A: General Medicine</p>
            <p className="text-[11px] text-mutedgray mt-1">Amoxicillin + Paracetamol + Pantoprazole</p>
          </button>

          <button
            onClick={() => { setSampleSelected('cardio_demo.png'); setFile(null); }}
            className={`p-4 rounded-2xl border text-left text-xs transition-all duration-300 shadow-xs ${
              sampleSelected === 'cardio_demo.png'
                ? 'bg-sunset-100 border-sunset-400 text-sunset-700 shadow-sm'
                : 'bg-white/80 border-sunset-100 text-charcoal hover:bg-sunset-50/60'
            }`}
          >
            <p className="font-display font-bold text-sm">Sample B: Cardiology</p>
            <p className="text-[11px] text-mutedgray mt-1">Atorvastatin + Amlodipine</p>
          </button>

          <button
            onClick={() => { setSampleSelected('pediatric_demo.png'); setFile(null); }}
            className={`p-4 rounded-2xl border text-left text-xs transition-all duration-300 shadow-xs ${
              sampleSelected === 'pediatric_demo.png'
                ? 'bg-sunset-100 border-sunset-400 text-sunset-700 shadow-sm'
                : 'bg-white/80 border-sunset-100 text-charcoal hover:bg-sunset-50/60'
            }`}
          >
            <p className="font-display font-bold text-sm">Sample C: Pediatric</p>
            <p className="text-[11px] text-mutedgray mt-1">Amoxicillin Oral Suspension 250mg</p>
          </button>
        </div>
      </div>

      <div className="pt-2">
        <button
          onClick={handleRunOCR}
          disabled={loading}
          className="w-full btn-sunset-primary py-4 text-base shadow-xl"
        >
          {loading ? (
            <>
              <Cpu className="w-5 h-5 animate-spin text-white" />
              <span>Running OCR & Extraction Pipeline...</span>
            </>
          ) : (
            <>
              <span>Run OCR & Extract Structured JSON</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
