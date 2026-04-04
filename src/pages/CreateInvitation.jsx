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
    if (!form.brideName.trim() || !form.groomName.trim() || !form.email.trim()) {
      setError('Bride name, Groom name, and Email address are required.');
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
        if (res.status === 503) {
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
      formData.append('whatsappNumber', form.whatsappNumber.trim());
      formData.append('otp', otpCode.trim());
      if (form.weddingDate) formData.append('weddingDate', form.weddingDate);
      formData.append('description', form.description.trim());
      formData.append('template', selectedTemplate);

      const validEvents = form.events.filter((ev) => ev.name.trim());
      formData.append('events', JSON.stringify(validEvents));

      const fileInput = document.getElementById('media-upload');
      if (fileInput && fileInput.files) {
        Array.from(fileInput.files).forEach((file) => formData.append('media', file));
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
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#c59d5f] focus:ring focus:ring-[#c59d5f]/30';
  const labelClass = 'block text-[11px] uppercase tracking-[0.35em] text-slate-500 mb-2 font-semibold';
  const sectionClass = 'rounded-[1.75rem] border border-slate-200/80 bg-white/90 p-6 shadow-[0_24px_80px_-40px_rgba(148,118,76,0.18)]';

  return (
    <div className="min-h-screen bg-[#f6f1eb] text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="rounded-[2rem] border border-slate-200/80 bg-white/95 p-6 shadow-[0_30px_80px_-30px_rgba(148,118,76,0.18)] backdrop-blur-sm sm:p-10">
          <div className="text-center mb-12">
            <span className="inline-flex rounded-full border border-[#c59d5f]/30 bg-[#c59d5f]/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.4em] text-[#f8e1b2]">
              Shafiq Cards · Web Invitations
            </span>
            <h1 className="mt-8 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Build your elegant wedding website in minutes.
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Choose a premium invitation layout, share your event details, and publish a polished web invite for guests.
            </p>
          </div>

          <StepIndicator step={step} />

          {step === 1 ? (
            <section className="space-y-10">
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {TEMPLATES.map((template) => {
                  const isSelected = selectedTemplate === template.id;
                  return (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => setTemplate(template.id)}
                      className={`group overflow-hidden rounded-[1.75rem] border-2 p-1 transition ${
                        isSelected
                          ? 'border-[#c59d5f] bg-gradient-to-br from-[#c59d5f]/10 via-[#b8863f]/10 to-[#c59d5f]/10 shadow-[0_20px_60px_-30px_rgba(197,157,95,0.9)]'
                          : 'border-slate-200 bg-white/90 hover:border-slate-300'
                      }`}
                    >
                      <div className="rounded-[1.5rem] bg-[#fffbf4] p-5">
                        <div className="mb-5 flex items-start justify-between gap-4">
                          <div>
                            <p className="text-[11px] uppercase tracking-[0.35em] text-slate-500">Invitation</p>
                            <h2 className="mt-3 text-2xl font-semibold text-slate-900">{template.name}</h2>
                          </div>
                          {isSelected && (
                            <span className="inline-flex rounded-full bg-[#c59d5f] px-3 py-1 text-[11px] font-semibold uppercase text-slate-950">
                              Selected
                            </span>
                          )}
                        </div>
                        <div className="mb-5 min-h-[180px] overflow-hidden rounded-[1.5rem] bg-[#fff6eb] p-5 text-slate-900">
                          <p className="text-[11px] uppercase tracking-[0.35em] text-slate-500">Preview</p>
                          <div className="mt-4 flex flex-col items-start gap-2">
                            <span className="text-sm text-slate-500">✦ You Are Invited ✦</span>
                            <p className="text-2xl font-semibold text-slate-900">Bride</p>
                            <p className="text-base italic text-[#c59d5f]">&amp;</p>
                            <p className="text-2xl font-semibold text-slate-900">Groom</p>
                          </div>
                        </div>
                        <p className="text-sm leading-6 text-slate-600">{template.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col items-center gap-4 text-center">
                <p className="max-w-2xl text-sm text-slate-400">
                  Pick a design that matches your wedding mood, then personalize it with your story and schedule.
                </p>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#c59d5f] to-[#b8863f] px-8 py-3 text-sm font-semibold text-slate-950 shadow-[0_12px_40px_-16px_rgba(197,157,95,0.8)] transition hover:-translate-y-0.5"
                >
                  Next: Fill your invite details
                </button>
              </div>
            </section>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div
                  className={`rounded-[1.5rem] px-5 py-4 text-sm leading-6 ${
                    error === 'SERVICE_UNAVAILABLE'
                      ? 'bg-amber-950/80 border border-amber-400 text-amber-200'
                      : 'bg-rose-950/80 border border-rose-400 text-rose-200'
                  }`}
                >
                  {error === 'SERVICE_UNAVAILABLE' ? (
                    <div className="space-y-2">
                      <p className="font-semibold">⚠ Email service is temporarily unavailable.</p>
                      <p>
                        We're unable to send verification emails right now. Please try again later or{' '}
                        <a
                          href="https://wa.me/923492578726?text=Hi!%20I%20want%20to%20create%20a%20Web%20Invite%20but%20the%20email%20verification%20is%20down."
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#c59d5f] underline"
                        >contact us on WhatsApp</a>.
                      </p>
                    </div>
                  ) : (
                    error
                  )}
                </div>
              )}

              <div className={sectionClass}>
                <div className="mb-7 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#c59d5f]/15 text-[#c59d5f]">✦</div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.35em] text-slate-500">Account & Couple</p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-900">Your wedding details</h2>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Your Email (for verification) *</label>
                    <input
                      type="email"
                      className={inputClass}
                      required
                      value={form.email}
                      onChange={(e) => set('email', e.target.value)}
                      placeholder="your.email@gmail.com"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>WhatsApp Number (optional)</label>
                    <input
                      type="tel"
                      className={inputClass}
                      value={form.whatsappNumber}
                      onChange={(e) => set('whatsappNumber', e.target.value)}
                      placeholder="0310 254 6466"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Bride's Name *</label>
                    <input
                      className={inputClass}
                      required
                      value={form.brideName}
                      onChange={(e) => set('brideName', e.target.value)}
                      placeholder="Amina"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Groom's Name *</label>
                    <input
                      className={inputClass}
                      required
                      value={form.groomName}
                      onChange={(e) => set('groomName', e.target.value)}
                      placeholder="Ahmad"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Wedding Date</label>
                    <input
                      type="date"
                      className={inputClass}
                      value={form.weddingDate}
                      onChange={(e) => set('weddingDate', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className={sectionClass}>
                <div className="mb-7 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#c59d5f]/15 text-[#c59d5f]">♥</div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.35em] text-slate-500">Your Love Story</p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-900">A personal message</h2>
                  </div>
                </div>
                <label className={labelClass}>Description / Story</label>
                <textarea
                  rows={5}
                  className={`${inputClass} min-h-[150px] resize-none`}
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                  placeholder="Share your love story, how you met, and what makes your day special..."
                />
              </div>

              <div className={sectionClass}>
                <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.35em] text-slate-500">Events / Ceremonies</p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-900">Schedule your celebrations</h2>
                  </div>
                  <button
                    type="button"
                    onClick={addEvent}
                    className="inline-flex items-center justify-center rounded-full border border-[#c59d5f]/30 bg-[#c59d5f]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-[#f5e4b5] transition hover:bg-[#c59d5f]/20"
                  >
                    + Add event
                  </button>
                </div>
                <div className="space-y-5">
                  {form.events.map((event, index) => (
                    <div key={index} className="rounded-[1.5rem] border border-slate-200 bg-white/90 p-5">
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <h3 className="text-sm font-semibold text-slate-900">Event {index + 1}</h3>
                        {form.events.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeEvent(index)}
                            className="rounded-full border border-rose-500/40 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-200"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className={labelClass}>Event name</label>
                          <input
                            className={inputClass}
                            value={event.name}
                            onChange={(e) => setEventField(index, 'name', e.target.value)}
                            placeholder="Mehndi / Barat / Walima"
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Date</label>
                          <input
                            type="date"
                            className={inputClass}
                            value={event.date}
                            onChange={(e) => setEventField(index, 'date', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Time</label>
                          <input
                            className={inputClass}
                            value={event.time}
                            onChange={(e) => setEventField(index, 'time', e.target.value)}
                            placeholder="7:00 PM"
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Venue</label>
                          <input
                            className={inputClass}
                            value={event.venue}
                            onChange={(e) => setEventField(index, 'venue', e.target.value)}
                            placeholder="Pearl Continental, Lahore"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={sectionClass}>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#c59d5f]/15 text-[#c59d5f]">📷</div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.35em] text-slate-500">Photo / Video Gallery</p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-900">Add your memories</h2>
                  </div>
                </div>
                <p className="mb-4 text-sm text-slate-400">
                  Upload photos or short videos to make your wedding page feel personal and memorable.
                </p>
                <label className={labelClass}>Upload media files (optional)</label>
                <input
                  id="media-upload"
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  className={`${inputClass} bg-slate-50 py-3`}
                />
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/90 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#c59d5f] to-[#b8863f] px-8 py-3 text-sm font-semibold text-slate-950 shadow-[0_12px_40px_-16px_rgba(197,157,95,0.9)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? 'Sending OTP…' : 'Receive email code'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {otpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-200/30 px-4 py-8 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white/95 p-8 shadow-2xl">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-3xl bg-[#c59d5f]/15 text-2xl text-[#c59d5f]">✉</div>
            <h2 className="text-2xl font-semibold text-slate-900">Check your email</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              A 6-digit verification code was sent to <span className="font-semibold text-slate-900">{form.email}</span>. Enter it below to publish your invitation.
            </p>
            {error && <p className="mt-4 rounded-[1.5rem] bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
            <input
              type="text"
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              className="mt-6 w-full rounded-[1.5rem] border border-slate-200 bg-slate-50 px-5 py-4 text-center text-2xl tracking-[0.45em] text-slate-900 outline-none focus:border-[#c59d5f] focus:ring focus:ring-[#c59d5f]/30"
              placeholder="000000"
            />
            <button
              type="button"
              onClick={() => {
                setOtpCode('');
                setError('');
                handleSubmit();
              }}
              disabled={submitting}
              className="mt-4 text-sm font-semibold text-[#c59d5f] underline"
            >
              Didn't receive the code? Resend
            </button>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  setOtpModal(false);
                  setError('');
                  setOtpCode('');
                }}
                className="rounded-[1.5rem] border border-slate-200 bg-white/90 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={verifyAndSubmit}
                disabled={submitting}
                className="rounded-[1.5rem] bg-gradient-to-r from-[#c59d5f] to-[#b8863f] px-4 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Verifying…' : 'Submit code'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateInvitation;
