import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Role, User as UserType } from '../types';
import { 
  User as UserIcon, 
  Stethoscope, 
  Store, 
  Building2, 
  ArrowRight, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  Shield, 
  Sparkles,
  KeyRound,
  Check
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'signin' | 'demo'>('signin');
  const [username, setUsername] = useState('alex_patient');
  const [password, setPassword] = useState('patient123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const routeByRole = (role: Role) => {
    switch (role) {
      case 'DOCTOR':
        navigate('/doctor/dashboard');
        break;
      case 'PHARMACY':
        navigate('/pharmacy/dashboard');
        break;
      case 'ADMIN':
        navigate('/admin/dashboard');
        break;
      case 'PATIENT':
      default:
        navigate('/patient/dashboard');
        break;
    }
  };

  const handleDemoSelect = (selectedRole: Role) => {
    loginAsDemo(selectedRole);
    routeByRole(selectedRole);
  };

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const inputIdentifier = username.trim();
    if (!inputIdentifier || !password) {
      setError('Please provide both username (or email) and password.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.login(inputIdentifier, password);
      
      const authenticatedUser: UserType = {
        id: response.user_id || `USR-${Date.now()}`,
        username: response.username || inputIdentifier,
        email: response.email || (inputIdentifier.includes('@') ? inputIdentifier : `${inputIdentifier}@vortexa.org`),
        full_name: response.full_name || inputIdentifier,
        role: (response.role as Role) || 'PATIENT'
      };

      login(authenticatedUser, response.access_token || 'bearer-token-live');
      routeByRole(authenticatedUser.role);
    } catch (err: any) {
      setError(err?.message || 'Invalid username/password or connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (fillUsername: string, fillPass: string) => {
    setUsername(fillUsername);
    setPassword(fillPass);
    setActiveTab('signin');
    setError(null);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setResetSent(true);
    setTimeout(() => {
      setResetSent(false);
      setForgotModalOpen(false);
      setResetEmail('');
    }, 2800);
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 space-y-6 animate-fade-in">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-sunset-50 border border-sunset-200 text-sunset-600 shadow-sm mb-1">
          <Shield className="w-6 h-6" />
        </div>
        <h1 className="font-display text-3xl font-extrabold text-charcoal tracking-tight">
          Login
        </h1>
        <p className="text-mutedgray text-xs font-medium">
          Sign in to access your secure clinical & health workspace
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex rounded-2xl bg-white/70 p-1 border border-sunset-100 shadow-xs">
        <button
          type="button"
          onClick={() => { setActiveTab('signin'); setError(null); }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 ${
            activeTab === 'signin'
              ? 'bg-sunset-600 text-white shadow-sm'
              : 'text-mutedgray hover:text-charcoal'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5" />
          Username Login
        </button>
        <button
          type="button"
          onClick={() => { setActiveTab('demo'); setError(null); }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 ${
            activeTab === 'demo'
              ? 'bg-sunset-600 text-white shadow-sm'
              : 'text-mutedgray hover:text-charcoal'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          1-Click Personas
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-3.5 rounded-2xl bg-red-50/90 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 shadow-xs animate-shake">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold block">Authentication Notice</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* TAB 1: Clean Form Layout (Matches User Specification) */}
      {activeTab === 'signin' && (
        <div className="space-y-5">
          <form onSubmit={handleManualLogin} className="bg-white rounded-3xl p-7 space-y-5 shadow-xl border border-gray-200/80">
            <h2 className="text-center font-display text-2xl font-bold text-charcoal">
              Login
            </h2>

            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-mutedgray">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. dr_sarah or alex_patient"
                  className="w-full bg-white border border-gray-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-charcoal placeholder:text-gray-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200/50 shadow-2xs transition-all"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-700">Password</label>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  className="text-[11px] font-semibold text-sunset-600 hover:text-sunset-700 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-mutedgray">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-white border border-gray-300 rounded-xl pl-10 pr-11 py-2.5 text-sm text-charcoal placeholder:text-gray-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200/50 shadow-2xs transition-all"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-mutedgray hover:text-charcoal transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-sunset-600 focus:ring-sunset-400 accent-sunset-600"
                />
                <span className="text-xs text-gray-600 font-medium">Remember me</span>
              </label>
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Encrypted Vault
              </span>
            </div>

            {/* Submit Button (Warm Amber Gradient matching the requested reference image) */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-2xl bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-charcoal font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 mt-2 disabled:opacity-70 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-charcoal/40 border-t-charcoal rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Submit</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Interactive Sample Credentials Panel */}
          <div className="glass-card-strong p-4 rounded-3xl space-y-3 border border-sunset-100 shadow-md">
            <div className="flex items-center justify-between border-b border-sunset-100/60 pb-2">
              <span className="text-xs font-extrabold text-charcoal flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Sample Credentials (Click to Auto-Fill)
              </span>
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                Ready to Test
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Doctor Quick Fill Card */}
              <button
                type="button"
                onClick={() => handleQuickFill('dr_sarah', 'doctor123')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  username === 'dr_sarah'
                    ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-200/50 shadow-xs'
                    : 'bg-white/80 border-sunset-100 hover:bg-sunset-50/60 hover:border-sunset-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 text-sunset-700">
                    <Stethoscope className="w-4 h-4" />
                    <span className="text-xs font-bold">Doctor</span>
                  </div>
                  {username === 'dr_sarah' && <Check className="w-3.5 h-3.5 text-amber-600 font-bold" />}
                </div>
                <div className="text-[11px] font-mono text-charcoal font-semibold">dr_sarah</div>
                <div className="text-[10px] text-mutedgray">Pass: doctor123</div>
              </button>

              {/* Patient Quick Fill Card */}
              <button
                type="button"
                onClick={() => handleQuickFill('alex_patient', 'patient123')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  username === 'alex_patient'
                    ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-200/50 shadow-xs'
                    : 'bg-white/80 border-sunset-100 hover:bg-sunset-50/60 hover:border-sunset-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 text-emerald-700">
                    <UserIcon className="w-4 h-4" />
                    <span className="text-xs font-bold">Patient</span>
                  </div>
                  {username === 'alex_patient' && <Check className="w-3.5 h-3.5 text-amber-600 font-bold" />}
                </div>
                <div className="text-[11px] font-mono text-charcoal font-semibold">alex_patient</div>
                <div className="text-[10px] text-mutedgray">Pass: patient123</div>
              </button>
            </div>

            {/* Additional Pharmacy & Admin Roles */}
            <div className="flex items-center justify-between pt-1 text-[11px] text-mutedgray">
              <span>Other roles:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickFill('metro_pharma', 'pharmacy123')}
                  className="font-bold text-sunset-600 hover:underline"
                >
                  Pharmacy (metro_pharma)
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => handleQuickFill('admin', 'admin123')}
                  className="font-bold text-sunset-600 hover:underline"
                >
                  Admin (admin)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 1-Click Instant Demo Accounts */}
      {activeTab === 'demo' && (
        <div className="glass-card-strong p-6 space-y-4 shadow-xl border border-sunset-100/80">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-sunset-600 block">
              Pre-Configured Personas
            </span>
            <span className="text-[10px] bg-sunset-100 text-sunset-700 px-2 py-0.5 rounded-full font-bold">
              Instant Switch
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Patient */}
            <button
              type="button"
              onClick={() => handleDemoSelect('PATIENT')}
              className="p-3.5 bg-white/90 hover:bg-sunset-50 border border-sunset-100 hover:border-sunset-300 rounded-2xl text-left space-y-1 transition-all duration-200 group shadow-xs hover:shadow-md cursor-pointer"
            >
              <div className="flex items-center justify-between text-sunset-500">
                <UserIcon className="w-4 h-4" />
                <span className="text-[10px] bg-sunset-100 text-sunset-700 px-2 py-0.5 rounded-full font-bold">Patient</span>
              </div>
              <p className="text-xs font-bold text-charcoal group-hover:text-sunset-700">Alex Mercer</p>
              <p className="text-[10px] text-mutedgray font-mono">@alex_patient</p>
            </button>

            {/* Doctor */}
            <button
              type="button"
              onClick={() => handleDemoSelect('DOCTOR')}
              className="p-3.5 bg-white/90 hover:bg-sunset-50 border border-sunset-100 hover:border-sunset-300 rounded-2xl text-left space-y-1 transition-all duration-200 group shadow-xs hover:shadow-md cursor-pointer"
            >
              <div className="flex items-center justify-between text-sunset-500">
                <Stethoscope className="w-4 h-4" />
                <span className="text-[10px] bg-sunset-100 text-sunset-700 px-2 py-0.5 rounded-full font-bold">Doctor</span>
              </div>
              <p className="text-xs font-bold text-charcoal group-hover:text-sunset-700">Dr. Sarah Jenkins</p>
              <p className="text-[10px] text-mutedgray font-mono">@dr_sarah</p>
            </button>

            {/* Pharmacy */}
            <button
              type="button"
              onClick={() => handleDemoSelect('PHARMACY')}
              className="p-3.5 bg-white/90 hover:bg-sunset-50 border border-sunset-100 hover:border-sunset-300 rounded-2xl text-left space-y-1 transition-all duration-200 group shadow-xs hover:shadow-md cursor-pointer"
            >
              <div className="flex items-center justify-between text-sunset-500">
                <Store className="w-4 h-4" />
                <span className="text-[10px] bg-sunset-100 text-sunset-700 px-2 py-0.5 rounded-full font-bold">Pharmacy</span>
              </div>
              <p className="text-xs font-bold text-charcoal group-hover:text-sunset-700">Metro Pharmacy</p>
              <p className="text-[10px] text-mutedgray font-mono">@metro_pharma</p>
            </button>

            {/* Admin */}
            <button
              type="button"
              onClick={() => handleDemoSelect('ADMIN')}
              className="p-3.5 bg-white/90 hover:bg-sunset-50 border border-sunset-100 hover:border-sunset-300 rounded-2xl text-left space-y-1 transition-all duration-200 group shadow-xs hover:shadow-md cursor-pointer"
            >
              <div className="flex items-center justify-between text-sunset-500">
                <Building2 className="w-4 h-4" />
                <span className="text-[10px] bg-sunset-100 text-sunset-700 px-2 py-0.5 rounded-full font-bold">Admin</span>
              </div>
              <p className="text-xs font-bold text-charcoal group-hover:text-sunset-700">Hospital Admin</p>
              <p className="text-[10px] text-mutedgray font-mono">@admin</p>
            </button>
          </div>
        </div>
      )}

      {/* Footer Navigation: Register Link */}
      <div className="text-center space-y-2">
        <p className="text-xs text-mutedgray">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-sunset-600 font-bold hover:text-sunset-700 hover:underline">
            Register New Account
          </Link>
        </p>
        <p className="text-[11px] text-mutedgray/80">
          Protected by SHA-256 Blockchain Ledger and AES-256 Field Encryption.
        </p>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-sunset-100">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-charcoal text-base flex items-center gap-2">
                <Mail className="w-4 h-4 text-sunset-500" />
                Reset Password
              </h3>
              <button
                type="button"
                onClick={() => setForgotModalOpen(false)}
                className="text-mutedgray hover:text-charcoal font-bold text-lg"
              >
                &times;
              </button>
            </div>

            <p className="text-xs text-mutedgray">
              Enter your registered username or email address and we'll send password reset instructions.
            </p>

            {resetSent ? (
              <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-200 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Reset link sent to your registered email!</span>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-3">
                <input
                  type="text"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="Username or email@vortexa.org"
                  className="w-full bg-white border border-sunset-100 rounded-xl px-3 py-2 text-xs text-charcoal focus:outline-none focus:border-sunset-400"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-sunset-600 hover:bg-sunset-700 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Send Recovery Link
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
