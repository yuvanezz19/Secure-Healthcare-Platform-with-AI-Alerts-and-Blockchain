import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Role, User as UserType } from '../types';
import { 
  ShieldCheck, 
  ArrowRight, 
  User, 
  Stethoscope, 
  Store, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Check, 
  Activity, 
  Building
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Role selection
  const [selectedRole, setSelectedRole] = useState<Role>('PATIENT');

  // Common fields
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Role-specific fields
  // Patient
  const [dob, setDob] = useState('1998-06-15');
  const [gender, setGender] = useState('Male');
  const [bloodGroup, setBloodGroup] = useState('O+');

  // Doctor
  const [specialization, setSpecialization] = useState('Cardiology & Internal Medicine');
  const [licenseNumber, setLicenseNumber] = useState('MED-REG-2026-881');
  const [hospitalName, setHospitalName] = useState('Metro University Health Network');

  // Pharmacy
  const [pharmacyLicense, setPharmacyLicense] = useState('PHARM-LIC-5542');
  const [facilityAddress, setFacilityAddress] = useState('Block 4, Central Health Boulevard');

  // Form states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return { score: 0, label: 'None', color: 'bg-sunset-200' };
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    switch (score) {
      case 1:
        return { score: 25, label: 'Weak', color: 'bg-red-500' };
      case 2:
        return { score: 50, label: 'Fair', color: 'bg-amber-500' };
      case 3:
        return { score: 75, label: 'Good', color: 'bg-sunset-500' };
      case 4:
        return { score: 100, label: 'Strong (Protected)', color: 'bg-emerald-500' };
      default:
        return { score: 10, label: 'Too short', color: 'bg-red-400' };
    }
  };

  const strength = getPasswordStrength();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your entries.');
      return;
    }

    if (!agreeTerms) {
      setError('You must accept the HIPAA/GDPR zero-knowledge security agreement.');
      return;
    }

    setLoading(true);

    try {
      const registrationPayload: any = {
        username: username.trim() || email.split('@')[0].toLowerCase(),
        email: email.trim().toLowerCase(),
        password: password,
        full_name: fullName.trim(),
        role: selectedRole
      };

      if (selectedRole === 'PATIENT') {
        registrationPayload.dob = dob;
        registrationPayload.gender = gender;
        registrationPayload.blood_group = bloodGroup;
      } else if (selectedRole === 'DOCTOR') {
        registrationPayload.specialization = specialization;
        registrationPayload.license_number = licenseNumber;
        registrationPayload.hospital_name = hospitalName;
      } else if (selectedRole === 'PHARMACY') {
        registrationPayload.pharmacy_license = pharmacyLicense;
        registrationPayload.facility_address = facilityAddress;
      }

      const res = await api.register(registrationPayload);

      const createdUser: UserType = {
        id: res.user_id || `USR-${Date.now()}`,
        username: res.username || registrationPayload.username,
        email: res.email || email,
        full_name: res.full_name || fullName,
        role: (res.role as Role) || selectedRole
      };

      login(createdUser, res.access_token || 'bearer-token-live');

      // Auto-navigate based on registered role
      if (selectedRole === 'DOCTOR') navigate('/doctor/dashboard');
      else if (selectedRole === 'PHARMACY') navigate('/pharmacy/dashboard');
      else navigate('/patient/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please check network or try a different email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-sunset-50 border border-sunset-200 text-sunset-600 shadow-sm mb-1">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="font-display text-3xl font-extrabold text-charcoal tracking-tight">
          Create Secure Account
        </h1>
        <p className="text-mutedgray text-xs font-medium">
          Zero-Knowledge Encrypted Clinical & Health Vault Platform
        </p>
      </div>

      {/* Role Selection */}
      <div className="grid grid-cols-3 gap-2 p-1.5 bg-white/70 rounded-2xl border border-sunset-100 shadow-xs">
        <button
          type="button"
          onClick={() => setSelectedRole('PATIENT')}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 flex flex-col items-center gap-1 cursor-pointer ${
            selectedRole === 'PATIENT'
              ? 'bg-sunset-600 text-white shadow-sm'
              : 'text-mutedgray hover:text-charcoal hover:bg-sunset-50/50'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Patient</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedRole('DOCTOR')}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 flex flex-col items-center gap-1 cursor-pointer ${
            selectedRole === 'DOCTOR'
              ? 'bg-sunset-600 text-white shadow-sm'
              : 'text-mutedgray hover:text-charcoal hover:bg-sunset-50/50'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          <span>Doctor</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedRole('PHARMACY')}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 flex flex-col items-center gap-1 cursor-pointer ${
            selectedRole === 'PHARMACY'
              ? 'bg-sunset-600 text-white shadow-sm'
              : 'text-mutedgray hover:text-charcoal hover:bg-sunset-50/50'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Pharmacy</span>
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-3.5 rounded-2xl bg-red-50/90 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 shadow-xs animate-shake">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold block">Registration Error</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleRegister} className="glass-card-strong p-6 space-y-4 shadow-xl border border-sunset-100/80">
        {/* Full Name */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-charcoal">
            {selectedRole === 'PHARMACY' ? 'Pharmacy / Facility Name' : 'Full Legal Name'}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-mutedgray">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder={selectedRole === 'DOCTOR' ? 'Dr. Jordan Rivera, MD' : selectedRole === 'PHARMACY' ? 'Apex Care Pharmacy' : 'Jordan Rivera'}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-white/90 border border-sunset-100 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-charcoal placeholder:text-mutedgray/60 focus:outline-none focus:border-sunset-500 focus:ring-2 focus:ring-sunset-200/50 shadow-xs"
              required
            />
          </div>
        </div>

        {/* Username */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-charcoal flex items-center justify-between">
            <span>Username</span>
            <span className="text-[10px] text-mutedgray font-normal">e.g. dr_jordan or jordan_patient</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-mutedgray">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white/90 border border-sunset-100 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-charcoal placeholder:text-mutedgray/60 focus:outline-none focus:border-sunset-500 focus:ring-2 focus:ring-sunset-200/50 shadow-xs"
            />
          </div>
        </div>

        {/* Email Address */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-charcoal">Official Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-mutedgray">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              placeholder="jordan.rivera@vortexa.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/90 border border-sunset-100 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-charcoal placeholder:text-mutedgray/60 focus:outline-none focus:border-sunset-500 focus:ring-2 focus:ring-sunset-200/50 shadow-xs"
              required
              autoComplete="email"
            />
          </div>
        </div>

        {/* DYNAMIC ROLE FIELDS: Patient */}
        {selectedRole === 'PATIENT' && (
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            <div className="space-y-1">
              <label className="text-xs font-bold text-charcoal">Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full bg-white/90 border border-sunset-100 rounded-2xl px-3 py-2 text-xs text-charcoal focus:outline-none focus:border-sunset-500 shadow-xs"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-charcoal">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-white/90 border border-sunset-100 rounded-2xl px-2 py-2 text-xs text-charcoal focus:outline-none focus:border-sunset-500 shadow-xs"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-Binary">Non-Binary</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-charcoal">Blood Group</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full bg-white/90 border border-sunset-100 rounded-2xl px-2 py-2 text-xs text-charcoal focus:outline-none focus:border-sunset-500 shadow-xs"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
          </div>
        )}

        {/* DYNAMIC ROLE FIELDS: Doctor */}
        {selectedRole === 'DOCTOR' && (
          <div className="space-y-3 pt-1 border-t border-sunset-100/80">
            <div className="space-y-1">
              <label className="text-xs font-bold text-charcoal">Clinical Specialization</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-mutedgray">
                  <Activity className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. Cardiology, Neurology, General Medicine"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="w-full bg-white/90 border border-sunset-100 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-sunset-500 shadow-xs"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-charcoal">Medical License #</label>
                <input
                  type="text"
                  placeholder="e.g. DOC-99120"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  className="w-full bg-white/90 border border-sunset-100 rounded-2xl px-3 py-2 text-xs text-charcoal focus:outline-none focus:border-sunset-500 shadow-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-charcoal">Hospital / Clinic</label>
                <input
                  type="text"
                  placeholder="Metro University Hospital"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  className="w-full bg-white/90 border border-sunset-100 rounded-2xl px-3 py-2 text-xs text-charcoal focus:outline-none focus:border-sunset-500 shadow-xs"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* DYNAMIC ROLE FIELDS: Pharmacy */}
        {selectedRole === 'PHARMACY' && (
          <div className="space-y-3 pt-1 border-t border-sunset-100/80">
            <div className="space-y-1">
              <label className="text-xs font-bold text-charcoal">Pharmacy License ID</label>
              <input
                type="text"
                placeholder="PHARM-REG-8821"
                value={pharmacyLicense}
                onChange={(e) => setPharmacyLicense(e.target.value)}
                className="w-full bg-white/90 border border-sunset-100 rounded-2xl px-3 py-2 text-xs text-charcoal focus:outline-none focus:border-sunset-500 shadow-xs"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-charcoal">Facility Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-mutedgray">
                  <Building className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="104 Health Boulevard, Sector 5"
                  value={facilityAddress}
                  onChange={(e) => setFacilityAddress(e.target.value)}
                  className="w-full bg-white/90 border border-sunset-100 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-sunset-500 shadow-xs"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Passwords */}
        <div className="space-y-3 pt-1">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-charcoal">Create Master Password</label>
              {password && (
                <span className="text-[10px] font-bold text-mutedgray">
                  Strength: <span className={strength.score >= 75 ? 'text-emerald-600' : 'text-sunset-600'}>{strength.label}</span>
                </span>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-mutedgray">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className="w-full bg-white/90 border border-sunset-100 rounded-2xl pl-10 pr-11 py-2.5 text-sm text-charcoal placeholder:text-mutedgray/60 focus:outline-none focus:border-sunset-500 focus:ring-2 focus:ring-sunset-200/50 shadow-xs"
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-mutedgray hover:text-charcoal"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Strength Meter Bar */}
            {password && (
              <div className="w-full bg-sunset-100 rounded-full h-1.5 overflow-hidden mt-1">
                <div
                  className={`h-full transition-all duration-300 ${strength.color}`}
                  style={{ width: `${strength.score}%` }}
                />
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-charcoal">Confirm Master Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-mutedgray">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-type password"
                className={`w-full bg-white/90 border rounded-2xl pl-10 pr-4 py-2.5 text-sm text-charcoal placeholder:text-mutedgray/60 focus:outline-none shadow-xs ${
                  confirmPassword && password !== confirmPassword
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-sunset-100 focus:border-sunset-500 focus:ring-2 focus:ring-sunset-200/50'
                }`}
                required
                autoComplete="new-password"
              />
              {confirmPassword && password === confirmPassword && (
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-emerald-600">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* HIPAA / Security Consent */}
        <div className="pt-2">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-sunset-200 text-sunset-600 focus:ring-sunset-400 accent-sunset-600 shrink-0"
            />
            <span className="text-[11px] text-mutedgray leading-tight">
              I consent to AES-256 encrypted health data storage and audit trail logging on the VORTEXA blockchain ledger.
            </span>
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full btn-sunset-primary py-3.5 text-sm shadow-md flex items-center justify-center gap-2 group mt-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              <span>Generating Encrypted Keypair...</span>
            </>
          ) : (
            <>
              <span>Create {selectedRole.charAt(0) + selectedRole.slice(1).toLowerCase()} Account</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>

      {/* Footer Navigation: Sign In Link */}
      <div className="text-center space-y-1">
        <p className="text-xs text-mutedgray">
          Already have an account?{' '}
          <Link to="/login" className="text-sunset-600 font-bold hover:text-sunset-700 hover:underline">
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
};
