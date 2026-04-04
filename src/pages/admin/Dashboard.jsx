import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../../config';

const Dashboard = () => {
  const [stats, setStats] = useState({
    invitations: 0,
    envelopes: 0,
    boxes: 0,
    reels: 0
  });

  // Fetch quick stats by calling category routes just for counting
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [invRes, envRes, boxRes, reelRes] = await Promise.all([
          fetch(`${API_BASE_URL}/products/category/invitation?limit=1`),
          fetch(`${API_BASE_URL}/products/category/envelope?limit=1`),
          fetch(`${API_BASE_URL}/products/category/box?limit=1`),
          fetch(`${API_BASE_URL}/products/category/reel?limit=1`)
        ]);
        
        const [invData, envData, boxData, reelData] = await Promise.all([
          invRes.json(), envRes.json(), boxRes.json(), reelRes.json()
        ]);

        setStats({
          invitations: invData.data?.pagination?.total || 0,
          envelopes: envData.data?.pagination?.total || 0,
          boxes: boxData.data?.pagination?.total || 0,
          reels: reelData.data?.pagination?.total || 0
        });
      } catch (e) {
        console.error("Failed to load stats", e);
      }
    };
    fetchStats();
  }, []);

  const total = stats.invitations + stats.envelopes + stats.boxes + stats.reels;

  return (
    <div className="min-h-[calc(100vh-100px)] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 display-serif">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1 font-medium">Manage your premium collection and monitor inventory.</p>
        </div>
        <Link 
          to="/admin/create-product" 
          className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-[#c59d5f] to-[#b8863f] text-slate-950 rounded-2xl font-bold uppercase tracking-widest text-xs hover:shadow-lg hover:shadow-[#c59d5f]/20 hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
          Create Product
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Products', value: total, icon: 'inventory_2', color: 'from-blue-100 to-blue-200', iconColor: 'text-blue-500' },
          { label: 'Invitations', value: stats.invitations, icon: 'style', color: 'from-emerald-100 to-emerald-200', iconColor: 'text-emerald-500' },
          { label: 'Envelopes', value: stats.envelopes, icon: 'mail', color: 'from-amber-100 to-amber-200', iconColor: 'text-amber-500' },
          { label: 'Digital Reels', value: stats.reels, icon: 'movie', color: 'from-rose-100 to-rose-200', iconColor: 'text-rose-500' }
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} blur-3xl -mr-16 -mt-16 opacity-60 group-hover:opacity-100 transition-opacity duration-500`}></div>
            
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-100 border border-slate-200 mb-6 group-hover:scale-110 transition-transform duration-500 ${stat.iconColor}`}>
              <span className="material-symbols-outlined">{stat.icon}</span>
            </div>
            
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-4xl font-black text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions / Recent Activity Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
          <div className="lg:col-span-2 bg-white border border-slate-200 p-8 rounded-3xl min-h-[300px]">
             <h3 className="text-xl font-bold text-slate-900 display-serif mb-6">Recent Additions</h3>
             <div className="flex flex-col items-center justify-center h-48 text-slate-500 border border-dashed border-slate-200 rounded-2xl">
                <span className="material-symbols-outlined text-4xl mb-2 text-slate-400">history</span>
                <p className="text-sm font-medium">Activity logs will appear here</p>
             </div>
          </div>
          <div className="bg-white border border-slate-200 p-8 rounded-3xl">
             <h3 className="text-xl font-bold text-slate-900 display-serif mb-6">Quick Settings</h3>
             <div className="space-y-4">
                {['Database Status: Healthy', 'Backup: Automated', 'Storage: 12% Used'].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl text-xs font-bold text-slate-500 uppercase tracking-wider border border-slate-200">
                     <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                     {item}
                  </div>
                ))}
             </div>
          </div>
      </div>
    </div>
  );
};

export default Dashboard;
