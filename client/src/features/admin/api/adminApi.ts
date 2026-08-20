import { api, setAccessToken, unwrap } from '@/lib/api';

export async function adminLogin(email: string, password: string) {
  const data = await unwrap<{ accessToken: string; admin: { id: string; name: string; email: string; role: string } }>(
    api.post('/auth/login', { email, password }),
  );
  setAccessToken(data.accessToken);
  return data;
}

export async function adminMe() {
  return unwrap<{ admin: { id: string; name: string; email: string; role: string } }>(api.get('/auth/me'));
}

export async function adminLogout() {
  await api.post('/auth/logout');
  setAccessToken(null);
}

export async function fetchDashboard() {
  return unwrap<{ registrations: number; paid: number; workshops: number; payments: number; recent: unknown[] }>(
    api.get('/admin/dashboard'),
  );
}

export async function listCollection(path: string) {
  return unwrap<{ items: Record<string, unknown>[]; meta: { total: number } }>(api.get(`/admin/${path}`));
}

function stripMeta(payload: Record<string, unknown>) {
  const copy = { ...payload };
  delete copy.id;
  delete copy._id;
  delete copy.__v;
  delete copy.createdAt;
  delete copy.updatedAt;
  return copy;
}

export async function saveCollection(path: string, id: string | null, payload: Record<string, unknown>) {
  const body = stripMeta(payload);
  if (id) return unwrap(api.patch(`/admin/${path}/${id}`, body));
  return unwrap(api.post(`/admin/${path}`, body));
}

export async function deleteCollection(path: string, id: string) {
  return unwrap(api.delete(`/admin/${path}/${id}`));
}

export async function toggleCollection(path: string, id: string, isActive: boolean) {
  return unwrap(api.patch(`/admin/${path}/${id}/active`, { isActive }));
}

export async function getSingleton(path: string) {
  return unwrap<Record<string, unknown>>(api.get(`/admin/${path}`));
}

export async function saveSingleton(path: string, payload: Record<string, unknown>) {
  return unwrap(api.patch(`/admin/${path}`, stripMeta(payload)));
}
