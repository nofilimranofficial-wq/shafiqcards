import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin, setToken, isAuthenticated } from '../../utils/api';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await loginAdmin(email, password);
      // Depending on backend shape, could be data.token or data.data.token
      const token = data.token || (data.data && data.data.token);
      if (token) {
        setToken(token);
        navigate('/admin/dashboard');
      } else {
        setError('No token received from server');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <Header />
      <main className="flex min-h-[calc(100vh-160px)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Logo/Brand Section */}
          <div className="flex flex-col items-center mb-8">
            {/* <div className="w-16 h-16 rounded-2xl bg-amber-200 flex items-center justify-center shadow-lg mb-4">
              <span className="text-slate-900 font-bold text-3xl">S</span>
            </div> */}
            <h2 className="display-serif text-4xl font-bold text-slate-900 tracking-tight text-center">
              Shafiq <span className="text-[#c59d5f]">Cards</span>
            </h2>
            <p className="mt-3 text-slate-500 text-sm font-semibold uppercase tracking-[0.35em]">
              Admin Portal
            </p>
            {/* <p className="mt-4 max-w-sm text-center text-slate-600 text-sm leading-6">
              This page is for authorized administrators only. If you are not an admin, please do not proceed.
            </p> */}
          </div>

        {/* Login Card */}
        <div className="bg-white border border-slate-200 p-8 rounded-[1rem] shadow-xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm font-medium text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-5">
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-slate-700 text-sm leading-6">
                <p className="font-semibold">Admin access only.</p>
                <p className="text-slate-600">Use your Shafiq Cards admin credentials to sign in. If you are not an administrator, do not proceed.</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                  Admin Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#c59d5f]/30 focus:border-[#c59d5f] transition-all duration-300 placeholder-slate-400 shadow-sm"
                  placeholder="admin@shafiqcards.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                  Admin Password
                </label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#c59d5f]/30 focus:border-[#c59d5f] transition-all duration-300 placeholder-slate-400 shadow-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 px-6 text-sm font-bold uppercase tracking-widest rounded-2xl text-white shadow-xl transition-all duration-300 transform active:scale-[0.98] ${
                  loading 
                    ? 'bg-slate-700 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-[#c59d5f] to-[#b8863f] hover:shadow-[#c59d5f]/25 hover:-translate-y-0.5'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Authenticating...
                  </div>
                ) : 'Admin Login'}
              </button>
            </div>
          </form>
        </div>

        <p className="mt-8 text-center text-xs text-slate-500 uppercase tracking-widest font-medium">
          Shafiq Cards Admin Portal &copy; {new Date().getFullYear()}
        </p>
      </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
