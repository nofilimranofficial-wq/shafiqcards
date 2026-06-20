import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TEMPLATES } from '../data/webInviteTemplates';
import { getInvitationAuth } from '../utils/invitationAuth';

const WebInvites = () => {
  const [invitationAuth, setInvitationAuth] = useState(null);

  useEffect(() => {
    const auth = getInvitationAuth();
    setInvitationAuth(auth);
  }, []);

  return (
    <div className="bg-[#fff] min-h-screen text-slate-900 font-sans overflow-hidden">
      <section id="templates" className="templates-section py-20 px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-10 template-heading">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[#aa7d36]">Wedding invitation showcase</p>
              <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-slate-950">Elegant invitation designs for your wedding website.</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-600">A clean, refined look with soft ivory tones, subtle gold accents, and timeless presentation.</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {TEMPLATES.map((template) => (
              <Link
                key={template.id}
                to={`/preview/${template.id}`}
                className="template-card group relative overflow-hidden rounded-[1.9rem] border border-[#ead7a6] bg-white shadow-[0_18px_50px_-28px_rgba(120,84,31,0.45)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_-24px_rgba(197,157,95,0.5)]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#fffaf0] via-white to-[#fdf8ea]" />
                <div className="relative p-4 sm:p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="inline-flex rounded-full bg-[#f7f1dc] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.38em] text-[#9a6c1b]">Classic</span>
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#efe0af] bg-white text-slate-700 transition group-hover:bg-[#c59d5f] group-hover:text-white">
                      <span className="text-sm">↗</span>
                    </span>
                  </div>
                  <div className="relative h-64 overflow-hidden rounded-[1.45rem] border border-[#f1e3be] bg-[linear-gradient(180deg,#fffaf0_0%,#ffffff_100%)] p-4">
                    <div className="absolute right-4 top-4 h-16 w-16 rounded-full border border-[#f0deaa] bg-[#f9f5e9]" />
                    <div className="absolute bottom-4 left-4 h-10 w-10 rounded-full border border-[#f0deaa] bg-[#f9f5e9]" />
                    <div className="relative flex h-full flex-col justify-between rounded-[1.2rem] border border-[#f5e5b7] bg-white/80 p-5 backdrop-blur-sm">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.44em] text-[#a27a33]">Shafiq Cards</p>
                        <h3 className="mt-3 text-2xl font-semibold leading-tight text-slate-900">{template.name}</h3>
                      </div>
                      <div className="flex items-end justify-between gap-3">
                        <div>
                          <p className="text-sm text-slate-600">Wedding invitation</p>
                        </div>
                        {/* <div className="h-12 w-12 rounded-full border border-[#f1d78b]" style={{ background: template.colors.accent }} /> */}
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 px-1 pb-1">
                    <h3 className="text-xl font-semibold text-slate-950">{template.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{template.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section py-24 px-6 bg-slate-900 text-white">
        <div className="mx-auto max-w-5xl text-center">
          <div className="cta-box rounded-[2.5rem] border border-white/10 bg-slate-950 p-12 shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-slate-500">Ready to go live</p>
            <h2 className="mt-5 text-3xl sm:text-4xl font-bold">Simple web invites with free setup and fast delivery.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-300">Choose a clean invitation design, send your event details, and we’ll turn it into a polished web invitation page.</p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link to="/create-invitation" className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">Start your web invite</Link>
              <a href="https://wa.me/923492578726?text=Hi!%20I'm%20interested%20in%20a%20simple%20web%20invite%20service" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-full border border-white/20 bg-slate-800 px-8 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">Enquire on WhatsApp</a>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 pt-10">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Manage your invitation</p>
              <p className="mt-3 font-semibold text-slate-900">{invitationAuth ? 'Edit your web invite' : 'Login to edit your web invite'}</p>
            </div>
            <Link to={invitationAuth ? `/edit/${invitationAuth.slug}` : '/'} className="inline-flex items-center justify-center rounded-full bg-[#c59d5f] px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-[#b8863f]">
              {invitationAuth ? 'Open Edit Panel' : 'Login to Edit'}
            </Link>
          </div>
          <p className="mt-5 text-sm leading-6 text-slate-600">
            {invitationAuth
              ? 'Use this feature if you already have a created website invitation and want to update the details or design instantly.'
              : 'Please login to your invitation account first. After signing in, this button will open your web invite edit page.'}
          </p>
        </div>
      </section>
    </div>
  );
};

export default WebInvites;
