import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { BrandMark } from '@/components/ui/BrandMark';
import { Button } from '@/components/ui/Button';
import { getApiErrorMessage } from '@/lib/api';
import { useAuth } from '../auth/AuthContext';

export function LoginPage() {
  const { admin, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  if (admin) return <Navigate to="/admin" replace />;

  return (
    <main className="grid min-h-screen place-items-center bg-ink px-4 py-10 sm:px-6">
      <form
        className="panel w-full max-w-md rounded-2xl p-6 sm:p-8"
        onSubmit={async (event) => {
          event.preventDefault();
          setBusy(true);
          try {
            await login(email, password);
            navigate('/admin');
          } catch (error) {
            toast.error(getApiErrorMessage(error, 'Could not sign in.'));
          } finally {
            setBusy(false);
          }
        }}
      >
        <BrandMark linkToHome />
        <h1 className="mt-6 font-display text-xl font-extrabold sm:text-2xl">Studio access</h1>
        <p className="mt-2 text-sm text-mist-muted">Sign in to manage workshop content.</p>
        <label className="mt-6 block text-sm">
          <span className="label-mono text-mist-muted">Email</span>
          <input
            type="email"
            autoComplete="username"
            required
            className="mt-1.5 w-full rounded-lg border border-line bg-ink px-3 py-2.5 text-base text-paper outline-none focus:border-royal-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="mt-4 block text-sm">
          <span className="label-mono text-mist-muted">Password</span>
          <input
            type="password"
            autoComplete="current-password"
            required
            className="mt-1.5 w-full rounded-lg border border-line bg-ink px-3 py-2.5 text-base text-paper outline-none focus:border-royal-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <Button type="submit" className="mt-6 w-full" disabled={busy}>
          {busy ? 'Signing in…' : 'Enter studio'}
        </Button>
      </form>
    </main>
  );
}
