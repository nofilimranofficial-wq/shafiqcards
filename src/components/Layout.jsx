import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import AiChatbot from './AiChatbot';
import WhatsAppButton from './WhatsAppButton';
import { getInvitationAuth } from '../utils/invitationAuth';

const Layout = ({ children }) => {
  const location = useLocation();
  const invitationAuth = getInvitationAuth();
  const pathParts = location.pathname.split('/').filter(Boolean);
  const isAuthInvitationPage =
    pathParts.length === 1 &&
    invitationAuth?.slug &&
    invitationAuth.slug === pathParts[0];
  const isWebInvitesPage = location.pathname === '/web-invites' || location.pathname.startsWith('/web-invites/');

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <Header />
      <main className="flex-grow">
        {children || <Outlet />}
      </main>
      <Footer />
      {!isAuthInvitationPage && !isWebInvitesPage && <AiChatbot />}
      <WhatsAppButton />
    </div>
  );
};

export default Layout;
