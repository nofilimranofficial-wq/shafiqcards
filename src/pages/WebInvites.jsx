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

  const getTemplateImage = (template) => `/webinvite-thumbnails/${template.thumbnail}`;

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,249,240,0.95),_rgba(255,255,255,1)_55%)] text-slate-900">
      <section id="templates" className="px-4 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col gap-5 rounded-[2rem] border border-[#f0e4c7] bg-white/80 p-8 shadow-[0_30px_90px_-40px_rgba(91,64,24,0.45)] backdrop-blur md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.4em] text-[#aa7d36]">Wedding invitation showcase</p>
              <h2 className="mt-4 text-3xl font-bold leading-tight text-slate-950 sm:text-4xl">
                Beautiful wedding website templates with a timeless, modern finish.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-600">
              Each design is crafted to feel elegant, polished, and memorable, with premium visuals and a soft luxury aesthetic.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {TEMPLATES.map((template) => (
              <Link
                key={template.id}
                to={`/preview/${template.id}`}
                className="group relative overflow-hidden rounded-[2rem] border border-[#ead7a6] bg-white shadow-[0_24px_70px_-30px_rgba(120,84,31,0.45)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_34px_90px_-28px_rgba(197,157,95,0.55)]"
              >
                <div className="absolute inset-0 bg-[linear-gradient(135deg,_rgba(255,248,234,0.95),_rgba(255,255,255,1)_65%)]" />
                <div className="relative p-4 sm:p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="rounded-full border border-[#efe0af] bg-[#fbf4e4] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.38em] text-[#9a6c1b]">
                      {template.tag}
                    </span>
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#efe0af] bg-white text-slate-700 transition group-hover:bg-[#c59d5f] group-hover:text-white">
                      <span className="text-base">↗</span>
                    </span>
                  </div>

                  <div className="relative min-h-[10rem] overflow-hidden rounded-[1.45rem] border border-[#f1e3be] bg-[#fefbf3] p-3">
                    <div className="absolute right-4 top-4 h-16 w-16 rounded-full border border-[#f0deaa] bg-[#fcf7e8]" />
                    <div className="absolute bottom-4 left-4 h-10 w-10 rounded-full border border-[#f0deaa] bg-[#fcf7e8]" />
                    <div className="relative h-full min-h-[9rem] overflow-hidden rounded-[1.2rem] border border-[#f3e4ba] bg-white/90 shadow-inner">
                      <img
                        src={getTemplateImage(template)}
                        alt={template.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                      <div className="absolute left-4 top-4 rounded-full border border-white/80 bg-white/75 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.38em] text-slate-700 shadow-sm">
                        {template.tag}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 px-1 pb-1">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-xl font-semibold text-slate-950">{template.name}</h3>
                      <span className="text-xs font-semibold uppercase tracking-[0.32em] text-[#a9843d]">Preview</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{template.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-900 px-6 py-24 text-white">
        <div className="mx-auto max-w-5xl text-center">
          <div className="rounded-[2.5rem] border border-white/10 bg-slate-950 p-12 shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-slate-500">Ready to go live</p>
            <h2 className="mt-5 text-3xl font-bold sm:text-4xl">Simple web invites with premium presentation and fast delivery.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-300">
              Choose a clean invitation design, share your event details, and we’ll turn it into a polished web invitation page.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link to="/create-invitation" className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
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

      <section className="px-6 pb-24 pt-10">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Manage your invitation</p>
              <p className="mt-3 font-semibold text-slate-900">{invitationAuth ? 'Edit your web invite' : 'Login to edit your web invite'}</p>
            </div>
            <Link
              to={invitationAuth ? `/edit/${invitationAuth.slug}` : '/'}
              className="inline-flex items-center justify-center rounded-full bg-[#c59d5f] px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-[#b8863f]"
            >
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
