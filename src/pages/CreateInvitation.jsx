import React, { useState, useEffect, Fragment } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { TEMPLATES } from '../data/webInviteTemplates';

const emptyEvent = () => ({ name: '', date: '', time: '', venue: '' });

const StepIndicator = ({ step }) => (
  <div className="flex flex-col items-center gap-4 mb-10 sm:flex-row sm:justify-center sm:gap-6">
    {[1, 2].map((n) => (
      <Fragment key={n}>
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold transition ${step >= n ? 'bg-gradient-to-br from-[#c59d5f] to-[#b8863f] text-slate-950 shadow-xl' : 'bg-slate-800 border border-slate-700 text-slate-400'}`}>
            {n}
          </div>
          <span className={`hidden sm:inline text-xs font-semibold uppercase tracking-[0.35em] ${step >= n ? 'text-slate-100' : 'text-slate-500'}`}>
            {n === 1 ? 'Choose design' : 'Fill details'}
          </span>
        </div>
        {n === 1 && (
          <div className={`hidden sm:block flex-1 h-1 rounded-full ${step > 1 ? 'bg-gradient-to-r from-[#c59d5f] to-[#b8863f]' : 'bg-slate-200'}`} />
        )}
      </Fragment>
    ))}
  </div>
);

const CreateInvitation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [selectedTemplate, setTemplate] = useState('template1');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [otpModal, setOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  useEffect(() => {
    const templateId = searchParams.get('template');
    if (templateId && TEMPLATES.some((t) => t.id === templateId)) {
      setTemplate(templateId);
      setStep(2);
    }
  }, [searchParams]);

  const [form, setForm] = useState({
    email: '',
    password: '',
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

  const setEventField = (i, key, val) =>
    setForm((f) => ({
      ...f,
      events: f.events.map((ev, idx) => (idx === i ? { ...ev, [key]: val } : ev)),
    }));

  const addEvent = () => setForm((f) => ({ ...f, events: [...f.events, emptyEvent()] }));
  const removeEvent = (i) => setForm((f) => ({ ...f, events: f.events.filter((_, idx) => idx !== i) }));

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');
    if (!form.brideName.trim() || !form.groomName.trim() || !form.email.trim() || !form.password.trim()) {
      setError('Bride name, Groom name, Email, and Password are required.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE_URL}/web-invitations/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 409) {
          setError(`This email is already associated with an existing invitation. Please delete the existing invitation first before creating a new one.`);
        } else if (res.status === 503) {
          setError('SERVICE_UNAVAILABLE');
        } else {
          setError(data.message || 'OTP request failed');
        }
        return;
      }
      setOtpModal(true);
      setError('');
    } catch (err) {
      setError('Could not connect to the server. Please check your internet connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const verifyAndSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!otpCode.trim()) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('brideName', form.brideName.trim());
      formData.append('groomName', form.groomName.trim());
      formData.append('email', form.email.trim());
      formData.append('password', form.password.trim());
      formData.append('whatsappNumber', form.whatsappNumber.trim());
      formData.append('otp', otpCode.trim());
      if (form.weddingDate) formData.append('weddingDate', form.weddingDate);
      formData.append('description', form.description.trim());
      formData.append('template', selectedTemplate);
      const events = form.events.filter((ev) => ev.name.trim());
      formData.append('events', JSON.stringify(events));
      const mediaInput = document.getElementById('media-upload');
      if (mediaInput?.files) {
        Array.from(mediaInput.files).forEach((file) => formData.append('media', file));
      }

      const res = await fetch(`${API_BASE_URL}/web-invitations/verify-and-create`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Verification failed');
      setOtpModal(false);
      navigate(`/${data.slug}`);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
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
            <h1 className="mt-8 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Build your elegant wedding website in minutes.</h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">Choose a premium invitation layout, share your event details, and publish a polished web invite for guests.</p>
          </div>
          <StepIndicator step={step} />
          {step === 1 ? (
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
          ) : (
            <section>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-[11px] uppercase tracking-[0.35em] text-slate-500">Bride Name</label>
                    <input value={form.brideName} onChange={(e) => set('brideName', e.target.value)} className="w-full rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#c59d5f] focus:ring focus:ring-[#c59d5f]/30" />
                  </div>
                  <div>
                    <label className="mb-2 block text-[11px] uppercase tracking-[0.35em] text-slate-500">Groom Name</label>
                    <input value={form.groomName} onChange={(e) => set('groomName', e.target.value)} className="w-full rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#c59d5f] focus:ring focus:ring-[#c59d5f]/30" />
                  </div>
                  <div>
                    <label className="mb-2 block text-[11px] uppercase tracking-[0.35em] text-slate-500">Email</label>
                    <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} className="w-full rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#c59d5f] focus:ring focus:ring-[#c59d5f]/30" />
                  </div>
                  <div>
                    <label className="mb-2 block text-[11px] uppercase tracking-[0.35em] text-slate-500">Password</label>
                    <input type="password" value={form.password} onChange={(e) => set('password', e.target.value)} className="w-full rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#c59d5f] focus:ring focus:ring-[#c59d5f]/30" />
                  </div>
                  <div>
                    <label className="mb-2 block text-[11px] uppercase tracking-[0.35em] text-slate-500">WhatsApp Number</label>
                    <input value={form.whatsappNumber} onChange={(e) => set('whatsappNumber', e.target.value)} className="w-full rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#c59d5f] focus:ring focus:ring-[#c59d5f]/30" />
                  </div>
                  <div>
                    <label className="mb-2 block text-[11px] uppercase tracking-[0.35em] text-slate-500">Wedding Date</label>
                    <input type="date" value={form.weddingDate} onChange={(e) => set('weddingDate', e.target.value)} className="w-full rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#c59d5f] focus:ring focus:ring-[#c59d5f]/30" />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-[11px] uppercase tracking-[0.35em] text-slate-500">Description</label>
                  <textarea rows="4" value={form.description} onChange={(e) => set('description', e.target.value)} className="w-full rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#c59d5f] focus:ring focus:ring-[#c59d5f]/30" />
                </div>
                <div>
                  <label className="mb-2 block text-[11px] uppercase tracking-[0.35em] text-slate-500">Media Upload</label>
                  <input id="media-upload" type="file" multiple className="w-full rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#c59d5f] focus:ring focus:ring-[#c59d5f]/30" />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] uppercase tracking-[0.35em] text-slate-500">Events</label>
                    <button type="button" onClick={addEvent} className="rounded-full bg-[#c59d5f] px-4 py-2 text-xs font-semibold text-slate-950">Add Event</button>
                  </div>
                  <div className="mt-4 space-y-4">
                    {form.events.map((event, index) => (
                      <div key={index} className="grid gap-3 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 md:grid-cols-5">
                        <input value={event.name} onChange={(e) => setEventField(index, 'name', e.target.value)} placeholder="Event name" className="rounded-[1rem] border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none" />
                        <input type="date" value={event.date} onChange={(e) => setEventField(index, 'date', e.target.value)} className="rounded-[1rem] border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none" />
                        <input type="time" value={event.time} onChange={(e) => setEventField(index, 'time', e.target.value)} className="rounded-[1rem] border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none" />
                        <input value={event.venue} onChange={(e) => setEventField(index, 'venue', e.target.value)} placeholder="Venue" className="rounded-[1rem] border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none" />
                        <button type="button" onClick={() => removeEvent(index)} className="rounded-[1rem] border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">Remove</button>
                      </div>
                    ))}
                  </div>
                </div>
                {error && <p className="text-sm text-rose-500">{error}</p>}
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setStep(1)} className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-900">Back</button>
                  <button type="submit" disabled={submitting} className="rounded-full bg-[#c59d5f] px-6 py-3 text-sm font-semibold text-slate-950 disabled:opacity-60">{submitting ? 'Submitting...' : 'Continue'}</button>
                </div>
              </form>
            </section>
          )}
        </div>
      </div>
      {otpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-semibold text-slate-900">Verify your email</h3>
            <p className="mt-2 text-sm text-slate-600">Enter the OTP sent to your email.</p>
            <form onSubmit={verifyAndSubmit} className="mt-5 space-y-4">
              <input value={otpCode} onChange={(e) => setOtpCode(e.target.value)} className="w-full rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#c59d5f] focus:ring focus:ring-[#c59d5f]/30" placeholder="OTP code" />
              {error && <p className="text-sm text-rose-500">{error}</p>}
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setOtpModal(false)} className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-900">Cancel</button>
                <button type="submit" disabled={submitting} className="rounded-full bg-[#c59d5f] px-6 py-3 text-sm font-semibold text-slate-950 disabled:opacity-60">{submitting ? 'Verifying...' : 'Submit'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateInvitation;
