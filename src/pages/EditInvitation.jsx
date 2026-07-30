import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { getInvitationAuth } from '../utils/invitationAuth';

const EditInvitation = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    brideName: '',
    groomName: '',
    whatsappNumber: '',
    weddingDate: '',
    description: '',
    events: []
  });

  useEffect(() => {
    loadInvitation();
  }, [slug]);

  const loadInvitation = async () => {
    try {
      const auth = getInvitationAuth();
      if (!auth?.token) {
        navigate('/');
        return;
      }

      const res = await fetch(`${API_BASE_URL}/web-invitations/${slug}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setForm({
        brideName: data.data.brideName || '',
        groomName: data.data.groomName || '',
        whatsappNumber: data.data.whatsappNumber || '',
        weddingDate: data.data.weddingDate ? data.data.weddingDate.split('T')[0] : '',
        description: data.data.description || '',
        events: data.data.events || []
      });
    } catch (err) {
      setError(err.message || 'Failed to load invitation');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEventChange = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      events: prev.events.map((event, i) => i === index ? { ...event, [field]: value } : event)
    }));
  };

  const handleAddEvent = () => {
    setForm((prev) => ({ ...prev, events: [...prev.events, { name: '', date: '', time: '', venue: '' }] }));
  };

  const handleRemoveEvent = (index) => {
    setForm((prev) => ({
      ...prev,
      events: prev.events.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const auth = getInvitationAuth();
      if (!auth?.token) {
        navigate('/');
        return;
      }

      const res = await fetch(`${API_BASE_URL}/web-invitations/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: auth.token,
          ...form,
          events: form.events.filter((event) => event.name.trim())
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update invitation');
      setSuccess('Invitation updated successfully!');
      setTimeout(() => navigate(`/${slug}`), 1500);
    } catch (err) {
      setError(err.message || 'Failed to save invitation');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center text-white">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#c59d5f]/20 border-t-[#c59d5f]" />
          <p className="mt-4 text-sm text-slate-300">Loading invitation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-16 text-slate-100">
      <div className="mx-auto max-w-5xl rounded-[2rem] bg-white p-8 text-slate-900 shadow-2xl">
        <h1 className="text-3xl font-semibold">Edit Invitation</h1>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">Bride Name</label>
              <input name="brideName" value={form.brideName} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-4 py-3" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Groom Name</label>
              <input name="groomName" value={form.groomName} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-4 py-3" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">WhatsApp Number</label>
              <input name="whatsappNumber" value={form.whatsappNumber} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-4 py-3" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Wedding Date</label>
              <input type="date" name="weddingDate" value={form.weddingDate} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-4 py-3" />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Description</label>
            <textarea name="description" rows="4" value={form.description} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-4 py-3" />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Events</h2>
              <button type="button" onClick={handleAddEvent} className="rounded-full bg-[#c59d5f] px-4 py-2 text-sm font-semibold text-slate-950">Add Event</button>
            </div>
            <div className="mt-4 space-y-4">
              {form.events.map((event, index) => (
                <div key={index} className="grid gap-3 rounded-xl border border-slate-200 p-4 md:grid-cols-5">
                  <input value={event.name || ''} onChange={(e) => handleEventChange(index, 'name', e.target.value)} placeholder="Event name" className="rounded-xl border border-slate-200 px-3 py-2" />
                  <input type="date" value={event.date || ''} onChange={(e) => handleEventChange(index, 'date', e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2" />
                  <input type="time" value={event.time || ''} onChange={(e) => handleEventChange(index, 'time', e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2" />
                  <input value={event.venue || ''} onChange={(e) => handleEventChange(index, 'venue', e.target.value)} placeholder="Venue" className="rounded-xl border border-slate-200 px-3 py-2" />
                  <button type="button" onClick={() => handleRemoveEvent(index)} className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold">Remove</button>
                </div>
              ))}
            </div>
          </div>
          {error && <p className="text-sm text-rose-500">{error}</p>}
          {success && <p className="text-sm text-emerald-600">{success}</p>}
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => navigate('/') } className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold">Cancel</button>
            <button type="submit" disabled={saving} className="rounded-full bg-[#c59d5f] px-6 py-3 text-sm font-semibold text-slate-950 disabled:opacity-60">{saving ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditInvitation;
