import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { adminLogin, adminLogout, adminMe } from '../api/adminApi';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  admin: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminMe()
      .then((data) => setAdmin(data.admin))
      .catch(() => setAdmin(null))
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      admin,
      loading,
      login: async (email, password) => {
        const data = await adminLogin(email, password);
        setAdmin(data.admin);
      },
      logout: async () => {
        await adminLogout();
        setAdmin(null);
      },
    }),
    [admin, loading],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('AuthProvider missing');
  return ctx;
}
