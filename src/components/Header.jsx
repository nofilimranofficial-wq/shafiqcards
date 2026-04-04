import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { isAuthenticated } from '../utils/api';
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
  const menuRef = useRef(null);
  const popupRef = useRef(null);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    const query = searchQuery.toLowerCase();
    let path = '/';
    let isValidCode = false;
    if (query.startsWith('sfc-')) {
      const num = parseInt(query.split('-')[1]);
      if (num >= 1101 && num <= 1200) {
        path = '/invitations';
        isValidCode = true;
      } else if (num >= 2101 && num <= 2150) {
        path = '/envelopes';
        isValidCode = true;
      } else {
        setPopupMessage('This Type Of Code Design Does Not Added Yet.');
        setShowPopup(true);
        setSearchOpen(false);
        setSearchQuery('');
        return;
      }
    } else if (query.startsWith('sfc-box-')) {
      path = '/box-packaging';
      isValidCode = true;
    } else if (query.startsWith('sfc-reel-')) {
      path = '/digital-invites';
      isValidCode = true;
    } else if (query.includes('invitation') || query.includes('card')) {
      path = '/invitations';
    } else if (query.includes('envelope')) {
      path = '/envelopes';
    } else if (query.includes('box') || query.includes('corporate') || query.includes('packaging')) {
      path = '/box-packaging';
    } else if (query.includes('digital') || query.includes('reel')) {
      path = '/digital-invites';
    }
    navigate(`${path}?search=${encodeURIComponent(searchQuery)}`);
    setSearchOpen(false);
    setSearchQuery('');
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        setSearchOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
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

          <div className="flex items-center gap-6 text-slate-600">
            <a aria-label="Facebook" href="https://www.facebook.com/shafiqcards" className="hover:text-gray-600">Facebook</a>
            <a aria-label="LinkedIn" href="https://www.instagram.com/shafiqcards/" className="hover:text-gray-600">Instagram</a>
          </div>
        </div>
      </div>

      {/* Main header: centered logo with actions on the right (desktop) */}
      <div className={`border-b border-slate-100 transform transition-transform duration-300 ease-in-out ${compact ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}>
        <div className="max-w-7xl mx-auto px-6 h-28 flex items-center justify-between">
          <div className="flex-1 flex items-center">
            {/* left placeholder for symmetry on desktop */}
          </div>

          <Link to="/" className="flex-shrink-0 flex items-center justify-center">
            <img src={logo} alt="Shafiq Cards Logo" className="h-20 object-contain" />
          </Link>

          <div className="flex-1 flex items-center justify-end gap-4">
            {searchOpen && (
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search collection..."
                className="hidden md:block px-4 py-2 bg-slate-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
                autoFocus
              />
            )}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-full bg-gray-100 hover:bg-gray-200"
            >
              <span className="material-symbols-outlined">{searchOpen ? 'close' : 'search'}</span>
            </button>
            {/* <Link to="/account" className="hidden md:inline-flex text-slate-700">Account</Link>
            <Link to="/cart" className="hidden md:inline-flex text-slate-700">Cart (0)</Link> */}

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

    </header>
  );
};

export default Header;
