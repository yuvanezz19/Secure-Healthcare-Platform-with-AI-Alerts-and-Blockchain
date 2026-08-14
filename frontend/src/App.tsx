import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { PatientDashboard } from './pages/PatientDashboard';
import { HealthVaultPage } from './pages/HealthVaultPage';
import { PrescriptionHistoryPage } from './pages/PrescriptionHistoryPage';
import { PrescriptionUploadPage } from './pages/PrescriptionUploadPage';
import { OCRVerificationPage } from './pages/OCRVerificationPage';
import { PrescriptionDetailsPage } from './pages/PrescriptionDetailsPage';
import { AISafetyAlertsPage } from './pages/AISafetyAlertsPage';
import { LabReportsPage } from './pages/LabReportsPage';
import { ConsentManagementPage } from './pages/ConsentManagementPage';
import { BlockchainAccessLogPage } from './pages/BlockchainAccessLogPage';
import { SustainabilityDashboardPage } from './pages/SustainabilityDashboardPage';
import { DoctorDashboardPage } from './pages/DoctorDashboardPage';
import { DoctorPatientViewPage } from './pages/DoctorPatientViewPage';
import { PharmacyDashboardPage } from './pages/PharmacyDashboardPage';
import { InventoryManagementPage } from './pages/InventoryManagementPage';
import { MedicineForecastPage } from './pages/MedicineForecastPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col ambient-sunset-bg text-charcoal font-sans selection:bg-sunset-100 selection:text-sunset-600">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Patient Routes */}
              <Route path="/patient/dashboard" element={<PatientDashboard />} />
              <Route path="/patient/vault" element={<HealthVaultPage />} />

              {/* Prescription Routes & Main OCR Flow */}
              <Route path="/prescriptions/history" element={<PrescriptionHistoryPage />} />
              <Route path="/prescriptions/:id" element={<PrescriptionDetailsPage />} />
              <Route path="/doctor/upload-prescription" element={<PrescriptionUploadPage />} />
              <Route path="/doctor/verify-ocr" element={<OCRVerificationPage />} />

              {/* Shared Safety & Lab Routes */}
              <Route path="/ai-alerts" element={<AISafetyAlertsPage />} />
              <Route path="/labs" element={<LabReportsPage />} />
              <Route path="/consents" element={<ConsentManagementPage />} />
              <Route path="/blockchain-log" element={<BlockchainAccessLogPage />} />
              <Route path="/sustainability" element={<SustainabilityDashboardPage />} />

              {/* Doctor Routes */}
              <Route path="/doctor/dashboard" element={<DoctorDashboardPage />} />
              <Route path="/doctor/patient-view" element={<DoctorPatientViewPage />} />

              {/* Pharmacy Routes */}
              <Route path="/pharmacy/dashboard" element={<PharmacyDashboardPage />} />
              <Route path="/pharmacy/inventory" element={<InventoryManagementPage />} />
              <Route path="/pharmacy/forecast" element={<MedicineForecastPage />} />

              {/* Hospital Admin Routes */}
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
