import React, { useEffect, useState } from 'react';
import { getTrafficSummary } from '../../utils/api';

const Traffic = () => {
  const [traffic, setTraffic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadTraffic = async () => {
      try {
        const data = await getTrafficSummary();
        setTraffic(data);
        setError('');
      } catch (err) {
        console.error(err);
        setError(err.message || 'Unable to load traffic information.');
      } finally {
        setLoading(false);
      }
    };

    loadTraffic();
  }, []);

  const formatDate = (value) => {
    if (!value) return 'No visits yet';
    const date = new Date(value);
    return date.toLocaleString([], {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 display-serif">Traffic Insights</h1>
            <p className="text-slate-500 mt-2 max-w-2xl">
              Monitor wedding invitation traffic across created sites, referrals, and recent visits.
            </p>
          </div>
          <div className="rounded-3xl bg-amber-50 border border-amber-100 px-6 py-4">
            <p className="text-xs uppercase tracking-[0.35em] text-amber-700 font-semibold">Total Audience</p>
            <p className="text-4xl font-black text-slate-900 mt-2">{loading ? '...' : traffic?.totalAudience ?? 0}</p>
          </div>
        </div>
      </div>

      {error ? (
        <div className="rounded-[2rem] bg-rose-50 border border-rose-100 p-8 text-rose-700">
          {error}
        </div>
      ) : loading ? (
        <div className="flex flex-col items-center justify-center min-h-[280px] rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium uppercase tracking-widest mt-4">Loading traffic summary...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.6fr] gap-6">
          <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm p-8 overflow-x-auto">
            <div className="flex items-center justify-between mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Invitation Traffic</h2>
                <p className="text-slate-500 mt-2">Top invitation sites and the latest visit details.</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Active invitations</p>
                <p className="text-3xl font-black text-slate-900 mt-2">{traffic.invitations.length}</p>
              </div>
            </div>

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase tracking-[0.25em]">
                  <th className="px-6 py-4">Invitation</th>
                  <th className="px-6 py-4 hidden lg:table-cell">Last Visit</th>
                  <th className="px-6 py-4 text-right">Total Views</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {traffic.invitations.map((item) => (
                  <tr key={item.slug} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-5">
                      <p className="font-semibold text-slate-900 capitalize line-clamp-1">{item.couple}</p>
                      <p className="text-xs text-slate-500 mt-1">/{item.slug}</p>
                    </td>
                    <td className="px-6 py-5 hidden lg:table-cell text-slate-500">{formatDate(item.lastVisitAt)}</td>
                    <td className="px-6 py-5 text-right">
                      <span className="inline-flex items-center justify-center rounded-full bg-slate-100 text-slate-900 px-3 py-1 text-sm font-semibold">{item.totalViews}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Top Referrers</h3>
              <div className="space-y-4">
                {traffic.invitations.slice(0, 4).map((item) => {
                  const sources = Object.entries(item.sourceCounts || {}).sort((a, b) => b[1] - a[1]);
                  return (
                    <div key={item.slug} className="rounded-3xl bg-slate-50 p-4">
                      <p className="text-sm font-semibold text-slate-900">{item.couple}</p>
                      {sources.length > 0 ? (
                        <div className="mt-3 space-y-2">
                          {sources.slice(0, 3).map(([source, count]) => (
                            <div key={source} className="flex items-center justify-between text-sm text-slate-500">
                              <span>{source}</span>
                              <span>{count}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-500 mt-2">No referral data tracked yet.</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Traffic Snapshot</h3>
              <div className="space-y-3 text-sm text-slate-500">
                <p><span className="font-semibold text-slate-900">Total Invitations:</span> {traffic.invitations.length}</p>
                <p><span className="font-semibold text-slate-900">Total Audience:</span> {traffic.totalAudience}</p>
                <p><span className="font-semibold text-slate-900">Last updated:</span> {formatDate(new Date())}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Traffic;
