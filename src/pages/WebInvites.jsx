import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TEMPLATES } from '../data/webInviteTemplates';
import InvitationLogin from '../components/InvitationLogin';
import { getInvitationAuth } from '../utils/invitationAuth';

const WebInvites = () => {
  const [invitationAuth, setInvitationAuth] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setInvitationAuth(getInvitationAuth());
  }, []);

  const handleFloatingEditClick = () => {
    if (invitationAuth?.slug) {
      navigate(`/edit/${invitationAuth.slug}`);
    } else {
      setLoginModalOpen(true);
    }
  };

  const handleLoginSuccess = (invitation) => {
    setInvitationAuth(invitation);
    setLoginModalOpen(false);
    if (invitation?.slug) {
      navigate(`/edit/${invitation.slug}`);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 font-sans overflow-hidden">
      <section id="templates" className="templates-section py-20 px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-10 template-heading">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-slate-500">Wedding invitation showcase</p>
              <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-slate-950">Beautiful invitation designs for your wedding website.</h2>
            </div>
            <div className="flex flex-col gap-3 items-start md:items-end">
              <p className="max-w-xl text-sm leading-6 text-slate-600">Each invitation design uses clean white-gray tones and a premium gold finish for a polished presentation.</p>
              {invitationAuth && (
                <Link
                  to={`/edit/${invitationAuth.slug}`}
                  className="inline-flex items-center justify-center rounded-full bg-[#c59d5f] px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-[#b8863f]"
                >
                  Edit Your Invitation
                </Link>
              )}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TEMPLATES.map((template) => (
              <Link
                key={template.id}
                to={`/preview/${template.id}`}
                className="template-card group relative overflow-hidden rounded-[2rem] p-[1px] bg-gradient-to-br from-[#d4af37]/70 via-[#c59d5f]/80 to-[#b8863f]/70 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="flex h-full flex-col rounded-[1.75rem] bg-white p-7 transition duration-300 group-hover:shadow-xl">
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Invitation</p>
                      <h3 className="mt-3 text-2xl font-semibold text-slate-950">{template.name}</h3>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase text-slate-600">Preview</span>
                  </div>

                  <p className="text-slate-600 leading-7 max-h-20 overflow-hidden">{template.description}</p>

                  <div className="mt-8 rounded-[1.5rem] bg-slate-50 p-5 shadow-sm border border-slate-200">
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Demo view</p>
                    <div className="mt-3 h-28 rounded-2xl bg-gradient-to-br from-white via-slate-100 to-slate-200" />
                  </div>

                  <div className="mt-6 flex items-center justify-between gap-3">
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase text-slate-600">Live</span>
                    <span className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white">Use this</span>
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
              <Link
                to="/create-invitation"
                className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                Start your web invite
              </Link>
              <a
                href="https://wa.me/923492578726?text=Hi!%20I'm%20interested%20in%20a%20simple%20web%20invite%20service"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-slate-800 px-8 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Enquire on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="fixed bottom-6 right-6 z-50">
        <div className="group relative">
          <button
            onClick={handleFloatingEditClick}
            className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#c59d5f] text-white shadow-2xl transition hover:bg-[#b8863f]"
            aria-label="Edit invitation"
          >
            <span className="material-symbols-outlined text-2xl">edit</span>
          </button>
          <div className="pointer-events-none absolute bottom-full right-0 mb-3 hidden w-72 rounded-2xl bg-white p-4 text-xs text-slate-800 shadow-xl ring-1 ring-slate-200 group-hover:block">
            <p className="font-semibold text-slate-900">{invitationAuth ? 'Edit your web invite' : 'Login to edit your web invite'}</p>
            <p className="mt-2 text-slate-600 leading-5">
              {invitationAuth
                ? 'Use this feature if you already have a created website invitation and want to update the details or design instantly.'
                : 'Please login to your invitation account first. After signing in, this button will open your web invite edit page.'}
            </p>
          </div>
        </div>
      </div>

      <InvitationLogin
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default WebInvites;
