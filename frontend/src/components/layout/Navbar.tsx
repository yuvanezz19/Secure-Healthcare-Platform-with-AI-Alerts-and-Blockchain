import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types';
import { Leaf, User, Stethoscope, Building2, Store, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, role, setRole } = useAuth();
  const location = useLocation();

  const roles: { key: Role; label: string; icon: any }[] = [
    { key: 'PATIENT', label: 'Patient', icon: User },
    { key: 'DOCTOR', label: 'Doctor', icon: Stethoscope },
    { key: 'PHARMACY', label: 'Pharmacy', icon: Store },
    { key: 'ADMIN', label: 'Hospital/Admin', icon: Building2 }
  ];

  return (
    <header className="sticky top-0 z-50 glass-nav shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Title */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sunset-400 to-sunset-500 flex items-center justify-center shadow-lg shadow-sunset-400/25 group-hover:scale-105 transition-all duration-300">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-display font-extrabold text-xl tracking-tight text-charcoal flex items-center gap-1">
                VORTEXA<span className="text-sunset-500 font-medium">-Sustain</span>
              </span>
              <span className="block text-[10px] text-mutedgray font-semibold tracking-widest uppercase -mt-0.5">
                Green Healthcare Intelligence
              </span>
            </div>
          </Link>

          {/* Sunset Role Switcher Pills */}
          <div className="hidden md:flex items-center bg-white/60 p-1.5 rounded-full border border-sunset-100/80 backdrop-blur-md shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-sunset-600 px-3">Role:</span>
            {roles.map((r) => {
              const Icon = r.icon;
              const active = role === r.key;
              return (
                <button
                  key={r.key}
                  onClick={() => setRole(r.key)}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                    active
                      ? 'bg-gradient-to-r from-sunset-400 to-sunset-500 text-white shadow-md shadow-sunset-400/30 scale-105'
                      : 'text-mutedgray hover:text-charcoal hover:bg-sunset-50/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{r.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Navigation Controls & Eco Score */}
          <div className="flex items-center gap-3">
            <Link
              to="/sustainability"
              className="hidden sm:flex items-center gap-2 bg-sunset-50/80 hover:bg-sunset-100/80 border border-sunset-200 text-sunset-600 px-4 py-2 rounded-full text-xs font-semibold transition-all shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-sunset-500" />
              <span>Eco Score: <strong className="text-charcoal font-bold">88/100</strong></span>
            </Link>

            {user ? (
              <div className="flex items-center gap-2.5 bg-white/80 border border-sunset-100 px-3.5 py-1.5 rounded-full shadow-xs">
                <div className="w-8 h-8 rounded-full bg-sunset-100 text-sunset-600 border border-sunset-200 flex items-center justify-center text-xs font-bold">
                  {user.full_name.charAt(0)}
                </div>
                <div className="hidden lg:block text-left">
                  <span className="block text-xs font-semibold text-charcoal leading-tight">{user.full_name}</span>
                  <span className="block text-[10px] text-sunset-500 font-bold uppercase tracking-wider">{user.role}</span>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="btn-sunset-primary text-xs"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Sub-Navigation Bar */}
      <div className="bg-white/40 border-t border-sunset-100/60 px-4 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center space-x-1.5 py-2 text-xs scrollbar-none">
          <NavLink to="/" label="Overview" active={location.pathname === '/'} />
          
          {role === 'PATIENT' && (
            <>
              <NavLink to="/patient/dashboard" label="Patient Dashboard" active={location.pathname === '/patient/dashboard'} />
              <NavLink to="/patient/vault" label="Health Vault" active={location.pathname === '/patient/vault'} />
              <NavLink to="/prescriptions/history" label="Prescriptions" active={location.pathname.startsWith('/prescriptions')} />
              <NavLink to="/labs" label="Lab Reports" active={location.pathname === '/labs'} />
              <NavLink to="/ai-alerts" label="AI Safety Alerts" active={location.pathname === '/ai-alerts'} />
              <NavLink to="/consents" label="Consent Management" active={location.pathname === '/consents'} />
              <NavLink to="/blockchain-log" label="Blockchain Audit" active={location.pathname === '/blockchain-log'} />
              <NavLink to="/sustainability" label="Eco Analytics" active={location.pathname === '/sustainability'} />
            </>
          )}

          {role === 'DOCTOR' && (
            <>
              <NavLink to="/doctor/dashboard" label="Doctor Dashboard" active={location.pathname === '/doctor/dashboard'} />
              <NavLink to="/doctor/upload-prescription" label="OCR Prescription Capture" active={location.pathname === '/doctor/upload-prescription'} />
              <NavLink to="/doctor/patient-view" label="Patient Vault Search" active={location.pathname === '/doctor/patient-view'} />
              <NavLink to="/labs" label="Duplicate Test Check" active={location.pathname === '/labs'} />
              <NavLink to="/ai-alerts" label="Clinical Alerts" active={location.pathname === '/ai-alerts'} />
              <NavLink to="/blockchain-log" label="Audit Trail" active={location.pathname === '/blockchain-log'} />
            </>
          )}

          {role === 'PHARMACY' && (
            <>
              <NavLink to="/pharmacy/dashboard" label="Pharmacy Dashboard" active={location.pathname === '/pharmacy/dashboard'} />
              <NavLink to="/pharmacy/inventory" label="Inventory Management" active={location.pathname === '/pharmacy/inventory'} />
              <NavLink to="/pharmacy/forecast" label="Demand Forecast" active={location.pathname === '/pharmacy/forecast'} />
              <NavLink to="/prescriptions/history" label="Verified Prescriptions" active={location.pathname.startsWith('/prescriptions')} />
              <NavLink to="/sustainability" label="Waste Metrics" active={location.pathname === '/sustainability'} />
            </>
          )}

          {role === 'ADMIN' && (
            <>
              <NavLink to="/admin/dashboard" label="Hospital Dashboard" active={location.pathname === '/admin/dashboard'} />
              <NavLink to="/blockchain-log" label="Master Audit Ledger" active={location.pathname === '/blockchain-log'} />
              <NavLink to="/sustainability" label="Eco Analytics" active={location.pathname === '/sustainability'} />
              <NavLink to="/pharmacy/forecast" label="Supply Intelligence" active={location.pathname === '/pharmacy/forecast'} />
            </>
          )}
        </div>
      </div>
    </header>
  );
};

const NavLink: React.FC<{ to: string; label: string; active: boolean }> = ({ to, label, active }) => (
  <Link
    to={to}
    className={`px-4 py-1.5 rounded-full font-semibold transition-all duration-200 shrink-0 ${
      active
        ? 'bg-sunset-100 text-sunset-600 border border-sunset-200/80 shadow-xs'
        : 'text-mutedgray hover:text-charcoal hover:bg-white/60'
    }`}
  >
    {label}
  </Link>
);
