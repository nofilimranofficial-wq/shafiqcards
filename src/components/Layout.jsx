import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import AiChatbot from './AiChatbot';
import WhatsAppButton from './WhatsAppButton';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <Header />
      <main className="flex-grow">
        {children || <Outlet />}
      </main>
      <Footer />
      <AiChatbot />
      <WhatsAppButton />
    </div>
  );
};

export default Layout;
