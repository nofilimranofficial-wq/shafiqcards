import React, { useState, useEffect, Fragment } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { setInvitationAuth } from '../utils/invitationAuth';
import { TEMPLATES } from '../data/webInviteTemplates';

const emptyEvent = () => ({ name: '', date: '', time: '', venue: '' });

const StepIndicator = ({ step }) => (
  <div className="flex flex-col items-center gap-4 mb-10 sm:flex-row sm:justify-center sm:gap-6">
    {[1, 2, 3].map((n) => (
      <Fragment key={n}>
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold transition ${step >= n ? 'bg-gradient-to-br from-[#c59d5f] to-[#b8863f] text-slate-950 shadow-xl' : 'bg-slate-800 border border-slate-700 text-slate-400'}`}>
            {n}
          </div>
          <span className={`hidden sm:inline text-xs font-semibold uppercase tracking-[0.35em] ${step >= n ? 'text-slate-100' : 'text-slate-500'}`}>
            {n === 1 ? 'Choose design' : n === 2 ? 'Sign in with Google' : 'Add wedding details'}
          </span>
        </div>
        {n !== 3 && (
          <div className={`hidden sm:block flex-1 h-1 rounded-full ${step > n ? 'bg-gradient-to-r from-[#c59d5f] to-[#b8863f]' : 'bg-slate-200'}`} />
        )}
      </Fragment>
    ))}
  </div>
);

const MAX_MEDIA_FILES = 5;
const MAX_MEDIA_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_MEDIA_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime'];

const CreateInvitation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [selectedTemplate, setTemplate] = useState('template1');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [googleUser, setGoogleUser] = useState(null);
  const [googleIdToken, setGoogleIdToken] = useState('');

  useEffect(() => {
    const templateId = searchParams.get('template');
    if (templateId && TEMPLATES.some((t) => t.id === templateId)) {
      setTemplate(templateId);
      setStep(2);
    }
  }, [searchParams]);

  const [form, setForm] = useState({
    whatsappNumber: '',
    brideName: '',
    groomName: '',
    weddingDate: '',
    description: '',
    events: [
      { name: 'Mehndi', date: '', time: '', venue: '' },
      { name: 'Barat', date: '', time: '', venue: '' },
      { name: 'Walima', date: '', time: '', venue: '' },
    ],
  });

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const decodeJwt = (token) => {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decodeURIComponent(decoded.split('').map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`).join('')));
    } catch (err) {
      return null;
    }
  };

  const setEventField = (i, key, val) =>
    setForm((f) => ({
      ...f,
      events: f.events.map((ev, idx) => (idx === i ? { ...ev, [key]: val } : ev)),
    }));

  const addEvent = () => setForm((f) => ({ ...f, events: [...f.events, emptyEvent()] }));
  const removeEvent = (i) => setForm((f) => ({ ...f, events: f.events.filter((_, idx) => idx !== i) }));

  const initGoogleButton = () => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!googleClientId) {
      setError('Google client ID is not configured. Add VITE_GOOGLE_CLIENT_ID to Client/.env.');
      return;
    }
    if (!window.google || !window.google.accounts || !window.google.accounts.id) return;
    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: (response) => {
        const profile = decodeJwt(response.credential);
        if (profile?.email) {
          setGoogleUser({ email: profile.email, name: profile.name, picture: profile.picture });
          setGoogleIdToken(response.credential);
          setStep(3);
          setError('');
        } else {
          setError('Google sign-in failed. Please try again.');
        }
      },
      ux_mode: 'popup',
    });
    window.google.accounts.id.renderButton(document.getElementById('google-signin-button'), {
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      shape: 'pill',
      width: 300,
    });
  };

  useEffect(() => {
    if (step !== 2) return;
    if (window.google && window.google.accounts && window.google.accounts.id) {
      initGoogleButton();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initGoogleButton;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [step]);

  const validateMediaFiles = (files) => {
    if (!files || files.length === 0) return null;
    if (files.length > MAX_MEDIA_FILES) {
      return `Please upload at most ${MAX_MEDIA_FILES} files.`;
    }

    for (const file of Array.from(files)) {
      if (!ALLOWED_MEDIA_TYPES.includes(file.type)) {
        return `Unsupported file type: ${file.type}. Allowed types are JPG, PNG, WEBP, MP4, MOV.`;
      }
      if (file.size > MAX_MEDIA_FILE_SIZE) {
        return `Each file must be smaller than 10 MB. ${file.name} is too large.`;
      }
    }

    return null;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');
    if (!googleUser || !googleIdToken) {
      setError('Please sign in with Google to continue.');
      return;
    }
    if (!form.brideName.trim() || !form.groomName.trim()) {
      setError('Bride name and Groom name are required.');
      return;
    }

    const mediaInput = document.getElementById('media-upload');
    const mediaError = validateMediaFiles(mediaInput?.files);
    if (mediaError) {
      setError(mediaError);
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('idToken', googleIdToken);
      formData.append('template', selectedTemplate);
      formData.append('whatsappNumber', form.whatsappNumber.trim());
      formData.append('brideName', form.brideName.trim());
      formData.append('groomName', form.groomName.trim());
      if (form.weddingDate) formData.append('weddingDate', form.weddingDate);
      formData.append('description', form.description.trim());
      const events = form.events.filter((ev) => ev.name.trim());
      formData.append('events', JSON.stringify(events));
      if (mediaInput?.files) {
        Array.from(mediaInput.files).forEach((file) => formData.append('media', file));
      }

      const res = await fetch(`${API_BASE_URL}/web-invitations/google-create`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Failed to create invitation.');
        return;
      }
      setInvitationAuth({
        token: data.token,
        slug: data.slug,
        invitation: data.invitation,
      });
      navigate(`/${data.slug}`);
    } catch (err) {
      setError('Could not connect to the server. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="rounded-[2rem] border border-slate-200/80 bg-white/95 p-6 shadow-[0_30px_80px_-30px_rgba(148,118,76,0.18)] backdrop-blur-sm sm:p-10">
          <div className="text-center mb-12">
            <span className="inline-flex rounded-full border border-[#c59d5f]/30 bg-[#c59d5f]/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.4em] text-[#f8e1b2]">Shafiq Cards · Web Invitations</span>
            <h1 className="mt-8 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Create your wedding invite with one Google login.</h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">Pick a design, sign in with Google, and add your wedding details — no password or OTP required.</p>
          </div>
          <StepIndicator step={step} />
          {step === 1 && (
            <section className="space-y-10">
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {TEMPLATES.map((template) => {
                  const selected = selectedTemplate === template.id;
                  return (
                    <button
                      type="button"
                      key={template.id}
                      onClick={() => {
                        setTemplate(template.id);
                        setStep(2);
                      }}
                      className={`group overflow-hidden rounded-[1.75rem] border-2 p-1 transition ${selected ? 'border-[#c59d5f] bg-gradient-to-br from-[#c59d5f]/10 via-[#b8863f]/10 to-[#c59d5f]/10 shadow-[0_20px_60px_-30px_rgba(197,157,95,0.9)]' : 'border-slate-200 bg-white/90 hover:border-[#c59d5f]/50 hover:bg-slate-50'}`}
                    >
                      <div className="rounded-[1.4rem] bg-slate-50 p-4">
                        <div className="h-52 rounded-[1.1rem] p-5" style={{ background: `linear-gradient(135deg, ${template.colors.bg}, #111827)` }}>
                          <div className="flex h-full flex-col justify-between rounded-[0.95rem] border border-white/10 p-5 backdrop-blur-sm">
                            <div>
                              <p className="text-[10px] uppercase tracking-[0.36em]" style={{ color: template.colors.text, opacity: 0.8 }}>Shafiq Cards</p>
                              <h3 className="mt-3 text-2xl font-semibold" style={{ color: template.colors.text }}>{template.name}</h3>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm" style={{ color: template.colors.text, opacity: 0.8 }}>Wedding invite</span>
                              <span className="h-10 w-10 rounded-full border border-white/15" style={{ background: template.colors.accent }} />
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 text-left">
                          <h3 className="text-lg font-semibold text-slate-900">{template.name}</h3>
                          <p className="mt-1 text-sm text-slate-600">{template.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          )}
          {step === 2 && (
            <section className="space-y-8">
              <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-8 text-slate-900 shadow-sm">
                <h2 className="text-2xl font-semibold">Sign in with Google</h2>
                <p className="mt-3 text-sm text-slate-600">Use your Google account to create the invitation. We only need your name and email to personalize the invite and skip the OTP/password flow.</p>
                <div id="google-signin-button" className="mt-8" />
                {error && <p className="mt-4 text-sm text-rose-500">{error}</p>}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
                  <button type="button" onClick={() => setStep(1)} className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900">Back</button>
                  <button type="button" onClick={() => initGoogleButton()} className="rounded-full bg-[#c59d5f] px-6 py-3 text-sm font-semibold text-slate-950">Reload Google Sign-in</button>
                </div>
              </div>
            </section>
          )}
          {step === 3 && (
            <section>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Signed in as</p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">{googleUser?.name}</p>
                      <p className="text-sm text-slate-600">{googleUser?.email}</p>
                    </div>
                    {googleUser?.picture && (
                      <img src={googleUser.picture} alt="Google profile" className="h-16 w-16 rounded-full border border-slate-200 object-cover" />
                    )}
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-[11px] uppercase tracking-[0.35em] text-slate-500">Bride Name</label>
                    <input value={form.brideName} onChange={(e) => set('brideName', e.target.value)} className="w-full rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#c59d5f] focus:ring focus:ring-[#c59d5f]/30" />
                  </div>
                  <div>
                    <label className="mb-2 block text-[11px] uppercase tracking-[0.35em] text-slate-500">Groom Name</label>
                    <input value={form.groomName} onChange={(e) => set('groomName', e.target.value)} className="w-full rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#c59d5f] focus:ring focus:ring-[#c59d5f]/30" />
                  </div>
                  <div>
                    <label className="mb-2 block text-[11px] uppercase tracking-[0.35em] text-slate-500">WhatsApp Number</label>
                    <input value={form.whatsappNumber} onChange={(e) => set('whatsappNumber', e.target.value)} className="w-full rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#c59d5f] focus:ring focus:ring-[#c59d5f]/30" />
                  </div>
                  <div>
                    <label className="mb-2 block text-[11px] uppercase tracking-[0.35em] text-slate-500">Wedding Date</label>
                    <input type="date" value={form.weddingDate} onChange={(e) => set('weddingDate', e.target.value)} className="w-full rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#c59d5f] focus:ring focus:ring-[#c59d5f]/30" />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-[11px] uppercase tracking-[0.35em] text-slate-500">Description</label>
                  <textarea rows="4" value={form.description} onChange={(e) => set('description', e.target.value)} className="w-full rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#c59d5f] focus:ring focus:ring-[#c59d5f]/30" />
                </div>
                <div>
                  <label className="mb-2 block text-[11px] uppercase tracking-[0.35em] text-slate-500">Media Upload</label>
                  <input
                    id="media-upload"
                    type="file"
                    multiple
                    accept="image/jpeg,image/jpg,image/png,image/webp,video/mp4,video/quicktime"
                    className="w-full rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#c59d5f] focus:ring focus:ring-[#c59d5f]/30"
                  />
                  <p className="mt-2 text-xs text-slate-500">Max {MAX_MEDIA_FILES} files, max 10 MB each.</p>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] uppercase tracking-[0.35em] text-slate-500">Events</label>
                    <button type="button" onClick={addEvent} className="rounded-full bg-[#c59d5f] px-4 py-2 text-xs font-semibold text-slate-950">Add Event</button>
                  </div>
                  <div className="mt-4 space-y-4">
                    {form.events.map((event, index) => (
                      <div key={index} className="grid gap-3 rounded-[1.5rem] border border-slate-200 bg-white p-4 md:grid-cols-5">
                        <input value={event.name} onChange={(e) => setEventField(index, 'name', e.target.value)} placeholder="Event name" className="rounded-[1rem] border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none" />
                        <input type="date" value={event.date} onChange={(e) => setEventField(index, 'date', e.target.value)} className="rounded-[1rem] border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none" />
                        <input type="time" value={event.time} onChange={(e) => setEventField(index, 'time', e.target.value)} className="rounded-[1rem] border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none" />
                        <input value={event.venue} onChange={(e) => setEventField(index, 'venue', e.target.value)} placeholder="Venue" className="rounded-[1rem] border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none" />
                        <button type="button" onClick={() => removeEvent(index)} className="rounded-[1rem] border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">Remove</button>
                      </div>
                    ))}
                  </div>
                </div>
                {error && <p className="text-sm text-rose-500">{error}</p>}
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setStep(2)} className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-900">Back</button>
                  <button type="submit" disabled={submitting} className="rounded-full bg-[#c59d5f] px-6 py-3 text-sm font-semibold text-slate-950 disabled:opacity-60">{submitting ? 'Submitting...' : 'Submit invitation'}</button>
                </div>
              </form>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateInvitation;
