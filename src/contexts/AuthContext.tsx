import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/services/api';
import type { Siswa, Admin } from '@/types';

// ==================== TYPES ====================
type UserRole = 'siswa' | 'admin' | null;

interface AuthContextType {
  siswa: Siswa | null;
  admin: Admin | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginSiswa: (siswa: Siswa) => void;
  loginAdmin: (admin: Admin) => void;
  logout: () => void;
}

// ==================== CONTEXT ====================
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ==================== PROVIDER ====================
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [siswa, setSiswa] = useState<Siswa | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedSiswa = authService.getCurrentSiswa();
    const storedAdmin = authService.getCurrentAdmin();

    if (storedSiswa) {
      setSiswa(storedSiswa);
    } else if (storedAdmin) {
      setAdmin(storedAdmin);
    }

    setIsLoading(false);
  }, []);

  const loginSiswa = (siswaData: Siswa) => {
    setSiswa(siswaData);
    setAdmin(null);
    localStorage.setItem('siswa', JSON.stringify(siswaData));
    localStorage.removeItem('admin');
  };

  const loginAdmin = (adminData: Admin) => {
    setAdmin(adminData);
    setSiswa(null);
    localStorage.setItem('admin', JSON.stringify(adminData));
    localStorage.removeItem('siswa');
  };

  const logout = () => {
    setSiswa(null);
    setAdmin(null);
    authService.logout();
  };

  const role: UserRole = siswa ? 'siswa' : admin ? 'admin' : null;
  const isAuthenticated = !!siswa || !!admin;

  return (
    <AuthContext.Provider
      value={{
        siswa,
        admin,
        role,
        isAuthenticated,
        isLoading,
        loginSiswa,
        loginAdmin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ==================== HOOK ====================
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
