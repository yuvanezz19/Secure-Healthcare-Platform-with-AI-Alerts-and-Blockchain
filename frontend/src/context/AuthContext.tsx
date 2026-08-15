import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';

interface AuthContextType {
  user: User | null;
  role: Role;
  loginAsDemo: (role: Role) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  setRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USERS: Record<Role, User> = {
  PATIENT: { id: "DEMO-PAT-101", username: "alex_patient", email: "demo.patient@vortexa.org", full_name: "Alex Mercer", role: "PATIENT" },
  DOCTOR: { id: "DEMO-DOC-101", username: "dr_sarah", email: "demo.doctor@vortexa.org", full_name: "Dr. Sarah Jenkins", role: "DOCTOR" },
  PHARMACY: { id: "DEMO-PHARM-101", username: "metro_pharma", email: "demo.pharmacy@vortexa.org", full_name: "Metro Central Pharmacy", role: "PHARMACY" },
  ADMIN: { id: "DEMO-ADMIN-101", username: "admin", email: "demo.admin@vortexa.org", full_name: "Hospital Administrator", role: "ADMIN" }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('vortexa_user');
    return saved ? JSON.parse(saved) : DEMO_USERS.PATIENT;
  });

  const [role, setRoleState] = useState<Role>(() => {
    return user ? user.role : 'PATIENT';
  });

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    const demoUser = DEMO_USERS[newRole];
    setUser(demoUser);
    localStorage.setItem('vortexa_user', JSON.stringify(demoUser));
  };

  const loginAsDemo = (targetRole: Role) => {
    setRole(targetRole);
  };

  const login = (newUser: User, token: string) => {
    setUser(newUser);
    setRoleState(newUser.role);
    localStorage.setItem('vortexa_user', JSON.stringify(newUser));
    localStorage.setItem('vortexa_token', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vortexa_user');
    localStorage.removeItem('vortexa_token');
  };

  return (
    <AuthContext.Provider value={{ user, role, loginAsDemo, login, logout, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
