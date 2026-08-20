import { useQuery } from '@tanstack/react-query';
import { fetchDashboard } from '../api/adminApi';

type RecentRow = {
  registrationCode?: string;
  fullName?: string;
  email?: string;
  status?: string;
  amount?: number;
};

export function DashboardPage() {
  const query = useQuery({ queryKey: ['admin-dashboard'], queryFn: fetchDashboard });
  const data = query.data;
  const recent = (data?.recent ?? []) as RecentRow[];

  const stats = [
    ['Registrations', data?.registrations],
    ['Paid seats', data?.paid],
    ['Workshops', data?.workshops],
    ['Payments', data?.payments],
  ] as const;

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-2xl font-extrabold sm:text-3xl">Overview</h1>
      <p className="mt-1 text-sm text-ink/50">Workshop studio at a glance</p>

      {query.isLoading ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-paper-300" />
          ))}
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(([label, value]) => (
            <div key={label} className="rounded-xl border border-line-paper bg-white p-5 shadow-sm">
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-ink/50">{label}</p>
              <p className="mt-2 font-display text-3xl font-extrabold tabular">{value ?? '—'}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 overflow-hidden rounded-xl border border-line-paper bg-white shadow-sm">
        <div className="border-b border-line-paper px-4 py-3 sm:px-5">
          <h2 className="font-display text-lg font-bold">Recent registrations</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-paper-100 font-mono text-[0.62rem] uppercase tracking-wider text-ink/50">
              <tr>
                <th className="px-4 py-3 sm:px-5">Code</th>
                <th className="px-4 py-3 sm:px-5">Name</th>
                <th className="hidden px-4 py-3 sm:table-cell sm:px-5">Email</th>
                <th className="px-4 py-3 sm:px-5">Status</th>
                <th className="px-4 py-3 text-right sm:px-5">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-paper">
              {recent.length ? (
                recent.map((row, index) => (
                  <tr key={row.registrationCode ?? index} className="hover:bg-paper-100/80">
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs sm:px-5">{row.registrationCode ?? '—'}</td>
                    <td className="px-4 py-3 sm:px-5">{row.fullName ?? '—'}</td>
                    <td className="hidden px-4 py-3 text-ink/60 sm:table-cell sm:px-5">{row.email ?? '—'}</td>
                    <td className="px-4 py-3 capitalize sm:px-5">{row.status ?? '—'}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-right tabular sm:px-5">{row.amount != null ? `₹${row.amount}` : '—'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-ink/50 sm:px-5">
                    No registrations yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
