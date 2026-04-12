import React from 'react';
import { Navigate, Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { isAuthenticated, removeToken } from '../../utils/api';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    removeToken();
    navigate('/admin/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Product List', path: '/admin/products' },
    { name: 'Create Product', path: '/admin/create-product' }
  ];

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 h-24">
            <div className="flex items-center gap-4">
              <Link to="/admin/dashboard" className="flex items-center gap-3 group">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300">
                  <span className="text-amber-700 font-bold text-xl">S</span>
                </div>
                <div>
                  <p className="text-base font-semibold text-slate-900">Shafiq Cards Admin</p>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Light Dashboard</p>
                </div>
              </Link>
              <div className="hidden xl:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full p-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                      location.pathname === link.path 
                        ? 'bg-amber-100 text-amber-700 shadow-sm' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link 
                to="/" 
                className="hidden sm:inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-slate-700 hover:bg-slate-100 transition-all duration-300"
              >
                View Site
              </Link>
              <button
                onClick={handleLogout}
                className="px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-slate-900 bg-amber-200 border border-amber-200 rounded-full hover:bg-amber-300 transition-all duration-300"
              >
                Logout
              </button>
            </div>
          </div>
          <div className="mt-4 xl:hidden flex items-center gap-2 overflow-x-auto pb-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  location.pathname === link.path 
                    ? 'bg-amber-100 text-amber-700' 
                    : 'text-slate-600 bg-slate-50 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
