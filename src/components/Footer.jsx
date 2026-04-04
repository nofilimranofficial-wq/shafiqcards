import React from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../utils/api';
import logo from '../assets/golden.webp';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-100 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Shafiq Cards Logo" className="h-8 w-auto" />
              <h2 className="text-lg font-extrabold">Shafiq Cards</h2>
            </div>
            <p className="text-sm text-slate-600">Defining premium invitation standards for over two decades. Global shipping available for all invitaion orders.</p>
          </div>
          <div>
            <h6 className="font-bold mb-4 text-sm uppercase tracking-widest">Collections</h6>
            <ul className="space-y-3 text-sm text-slate-600">
              <li><a className="hover:text-amber-600 transition-colors" href="#">Wedding Invitations</a></li>
              <li><a className="hover:text-amber-600 transition-colors" href="#">Box Packaging</a></li>
              <li><a className="hover:text-amber-600 transition-colors" href="#">Stationery Sets</a></li>
              <li><a className="hover:text-amber-600 transition-colors" href="#">Acrylic Invites</a></li>
            </ul>
          </div>
          <div>
            <h6 className="font-bold mb-4 text-sm uppercase tracking-widest">Services</h6>
            <ul className="space-y-3 text-sm text-slate-600">
              <li><a className="hover:text-amber-600 transition-colors" href="#">Custom Design</a></li>
              <li><a className="hover:text-amber-600 transition-colors" href="#">Foil Printing</a></li>
              <li><a className="hover:text-amber-600 transition-colors" href="#">Global Logistics</a></li>
              <li><a className="hover:text-amber-600 transition-colors" href="#">Brand Packaging</a></li>
            </ul>
          </div>
          <div>
            <h6 className="font-bold mb-4 text-sm uppercase tracking-widest">Connect</h6>
            <div className="flex gap-3 mb-4">
              <a
                href="https://www.facebook.com/shafiqcards"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center hover:bg-slate-400 text-slate-600 hover:text-white transition-all"
                title="Visit Facebook"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://www.instagram.com/shafiqcards/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center hover:bg-slate-400 text-slate-600 hover:text-white transition-all"
                title="Visit Instagram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849s.013-3.583.07-4.849c.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.015-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.322a1.44 1.44 0 11.806-2.806 1.44 1.44 0 01-.806 2.806z"/>
                </svg>
              </a>
              {/* <a
                href="mailto:shafiqcards1@gmail.com"
                className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center hover:bg-slate-400 text-slate-600 hover:text-white transition-all"
                title="Contact via Gmail"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </a> */}
            </div>
            <p className="text-xs text-slate-500">Headquarters: Dubai Design District, UAE</p>
          </div>
        </div>
        <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">© 2026 Shafiq Cards Luxury Packaging. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-slate-500 items-center">
            <a className="hover:text-slate-900 transition-colors" href="#">Privacy Policy</a>
            <a className="hover:text-slate-900 transition-colors" href="#">Terms of Service</a>
            {isAuthenticated() ? (
              <Link to="/admin/dashboard" className="hover:text-amber-600 transition-colors font-medium">
                Admin Panel
              </Link>
            ) : (
              <Link to="/admin/login" className="hover:text-amber-600 transition-colors font-medium">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
