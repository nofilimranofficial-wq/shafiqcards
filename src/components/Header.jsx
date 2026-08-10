import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { isAuthenticated } from '../utils/api';
import InvitationLogin from './InvitationLogin';
import logo from '../assets/golden.webp';

const NAV = [
  { to: '/', label: 'Home' },
  { to: '/invitations', label: 'Invitations' },
  { to: '/box-packaging', label: 'Corporate Gifting & Packaging' },
  { to: '/envelopes', label: 'Envelopes' },
  { to: '/digital-invites', label: 'Digital Invites' },
  { to: '/web-invites', label: 'Web Invites' }
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [loginModal, setLoginModal] = useState(false);
  const [invitationAuth, setInvitationAuth] = useState(null);
  const menuRef = useRef(null);
  const popupRef = useRef(null);
  const navigate = useNavigate();

  const handleLoginSuccess = (invitation) => {
    setInvitationAuth(invitation);
  };

  const handleLogout = () => {
    localStorage.removeItem('invitationAuth');
    setInvitationAuth(null);
    navigate('/');
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/invitations?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        setSearchOpen(false);
        setLoginModal(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    // Check for invitation auth
    const auth = localStorage.getItem('invitationAuth');
    if (auth) {
      try {
        setInvitationAuth(JSON.parse(auth));
      } catch (e) {
        localStorage.removeItem('invitationAuth');
      }
    }
  }, []);

  useEffect(() => {
    if (!menuRef.current) return;
    if (open) menuRef.current.style.maxHeight = menuRef.current.scrollHeight + 'px';
    else menuRef.current.style.maxHeight = '0px';
  }, [open]);

  useEffect(() => {
    const onScroll = () => {
      setCompact(window.scrollY > 120);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (showPopup && popupRef.current) {
      gsap.fromTo(popupRef.current, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' });
    }
  }, [showPopup]);

  return (
    <header className="z-50 bg-white">
      {/* Topbar with contact, slogan and socials */}
      <div className={`border-b border-slate-100 bg-slate-50 text-sm transform transition-transform duration-300 ease-in-out hidden md:flex ${compact ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}>
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between h-12">
          <div className="flex items-center gap-2 text-slate-600">
            <span className="material-symbols-outlined text-[18px]">Phone</span>
            <span>+92 349 2578726</span>
          </div>

          <div className="text-center text-slate-500 px-20">Shafiq-Cards: Printing Beyond Expectations</div>

          <div className="flex items-center gap-4">
            <div className="hidden xl:flex items-center gap-3 text-slate-600">
              {invitationAuth ? (
                <>
                  <span className="text-xs text-slate-600">Logged in</span>
                  <Link
                    to={`/edit/${invitationAuth.slug}`}
                    className="px-3 py-1 rounded-full bg-[#c59d5f]/10 text-[#7c5a27] text-xs font-semibold hover:bg-[#c59d5f]/20 transition"
                  >
                    Edit Invitation
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1 rounded-full border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-100 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setLoginModal(true)}
                  className="px-3 py-1 rounded-full bg-[#c59d5f] text-white text-xs font-semibold hover:bg-[#b8863f] transition"
                >
                  Login to Edit
                </button>
              )}
            </div>

            <div className="flex items-center gap-6 text-slate-600">
              <a aria-label="Facebook" href="https://www.facebook.com/shafiqcards" className="hover:text-gray-600">Facebook</a>
              <a aria-label="Instagram" href="https://www.instagram.com/shafiqcards/" className="hover:text-gray-600">Instagram</a>
            </div>
          </div>
        </div>
      </div>

      {/* Main header: logo on the left and brand text centered with accent colors */}
      <div className={`border-b border-slate-100 transform transition-transform duration-300 ease-in-out ${compact ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 md:py-0 flex flex-col md:flex-row items-center gap-4 md:gap-6">
          <Link to="/" className="flex items-center gap-3 flex-shrink-0 mx-auto md:mx-0">
            <img src={logo} alt="Shafiq Cards Logo" className="h-24 object-contain" />
          </Link>

          <div className="flex-1 w-full md:w-auto flex items-center justify-center">
            <div className="text-center">
              <Link
                to="/"
                className="text-3xl md:text-4xl font-serif font-medium tracking-tight text-[#c59d5f] hover:text-[#ae8d43] transition-colors"
              >
                Shafiqcards.com
              </Link>
              <p className="text-sm md:text-base text-slate-500 mt-1">
                Elegant invitations, premium packaging, and stunning digital reels.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-end w-full md:w-auto">
            {searchOpen && (
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search collection..."
                className="hidden md:block w-full max-w-xs px-4 py-2 bg-slate-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
                autoFocus
              />
            )}
            <button
              onClick={() => setSearchOpen((prev) => !prev)}
              className="hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-full bg-gray-100 hover:bg-gray-200"
            >
              <span className="material-symbols-outlined">{searchOpen ? 'close' : 'search'}</span>
            </button>

            <button
              aria-expanded={open}
              aria-label="Toggle menu"
              onClick={() => setOpen((s) => !s)}
              className="md:hidden w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition"
            >
              <span className="material-symbols-outlined text-gray-700">{open ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Centered navigation bar (stuck when scrolling) */}
      <div className="bg-white sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="hidden lg:flex items-center justify-center gap-10 h-12">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} className="text-base text-slate-700 hover:text-gray-600 transition-colors">{n.label}</Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile panel */}
      <div className="md:hidden px-6">
        <div ref={menuRef} style={{ maxHeight: 0, transition: 'max-height 350ms ease' }} className="overflow-hidden">
          <nav className="flex flex-col gap-3 py-4 border-b border-slate-100">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="py-3 px-2 rounded-lg font-medium text-slate-800 hover:bg-slate-50">{n.label}</Link>
            ))}
          </nav>
          <div className="py-4 flex flex-col gap-3">
            <input
              aria-label="Search mobile"
              className="pl-4 pr-4 py-2 bg-slate-100 rounded-full text-sm"
              placeholder="Search collection..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />

            {/* Mobile Invitation Auth */}
            {invitationAuth ? (
              <div className="space-y-2">
                <p className="text-sm text-slate-600 px-2">
                  Logged in as {invitationAuth.brideName} & {invitationAuth.groomName}
                </p>
                <Link
                  to={`/edit/${invitationAuth.slug}`}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 rounded-lg bg-[#c59d5f] text-white text-center font-medium"
                >
                  Edit Invitation
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setOpen(false);
                  }}
                  className="block w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-700 text-center font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setLoginModal(true);
                  setOpen(false);
                }}
                className="px-4 py-3 rounded-lg bg-[#c59d5f] text-white text-center font-medium"
              >
                Login to Edit Invitation
              </button>
            )}

            <Link to="/quote" className="px-4 py-3 rounded-lg btn-gold text-center font-bold">Request a Quote</Link>
          </div>
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
  <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
    <div ref={popupRef} className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-4">
      <p className="text-center text-slate-700">{popupMessage}</p>
      <button
        onClick={() => setShowPopup(false)}
        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-full"
      >
        OK
      </button>
    </div>
  </div>
)}

      {/* Invitation Login Modal */}
      <InvitationLogin
        isOpen={loginModal}
        onClose={() => setLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />

    </header>
  );
};

export default Header;
