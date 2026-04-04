import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { getInvitationAuth } from '../utils/invitationAuth';

const emptyEvent = () => ({ name: '', date: '', time: '', venue: '' });

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
      setError('Failed to load invitation');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const auth = getInvitationAuth();
      if (!auth?.token) {
        setError('Not authenticated');
        return;
      }

      const res = await fetch(`${API_BASE_URL}/web-invitations/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: auth.token,
          ...form,
          events: form.events.filter(ev => ev.name.trim())
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setSuccess('Invitation updated successfully!');
      setTimeout(() => navigate(`/${slug}`), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const setEventField = (i, key, val) =>
    setForm(f => ({
      ...f,
      events: f.events.map((ev, idx) => idx === i ? { ...ev, [key]: val } : ev)
    }));

  const addEvent = () => setForm(f => ({ ...f, events: [...f.events, emptyEvent()] }));
  const removeEvent = (i) => setForm(f => ({ ...f, events: f.events.filter((_, idx) => idx !== i) }));

  const inputClass = 'w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm focus:border-[#c59d5f] focus:ring focus:ring-[#c59d5f]/30';
  const labelClass = 'block text-sm font-medium text-slate-700 mb-2';

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f1eb] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c59d5f] mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading invitation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f1eb] py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Edit Your Invitation</h1>
            <p className="text-slate-600 mt-2">Update your wedding invitation details</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Bride's Name</label>
                <input
                  className={inputClass}
                  value={form.brideName}
                  onChange={(e) => set('brideName', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Groom's Name</label>
                <input
                  className={inputClass}
                  value={form.groomName}
                  onChange={(e) => set('groomName', e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>WhatsApp Number</label>
              <input
                type="tel"
                className={inputClass}
                value={form.whatsappNumber}
                onChange={(e) => set('whatsappNumber', e.target.value)}
              />
            </div>

            <div>
              <label className={labelClass}>Wedding Date</label>
              <input
                type="date"
                className={inputClass}
                value={form.weddingDate}
                onChange={(e) => set('weddingDate', e.target.value)}
              />
            </div>

            <div>
              <label className={labelClass}>Description</label>
              <textarea
                className={`${inputClass} resize-none`}
                rows={4}
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                placeholder="Tell guests about your special day..."
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <label className={labelClass}>Wedding Events</label>
                <button
                  type="button"
                  onClick={addEvent}
                  className="px-4 py-2 bg-[#c59d5f] text-white rounded-lg hover:bg-[#b8863f] transition text-sm"
                >
                  Add Event
                </button>
              </div>

              <div className="space-y-4">
                {form.events.map((event, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium text-slate-900">Event {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeEvent(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        className={inputClass}
                        placeholder="Event name"
                        value={event.name}
                        onChange={(e) => setEventField(index, 'name', e.target.value)}
                      />
                      <input
                        type="date"
                        className={inputClass}
                        value={event.date}
                        onChange={(e) => setEventField(index, 'date', e.target.value)}
                      />
                      <input
                        type="time"
                        className={inputClass}
                        value={event.time}
                        onChange={(e) => setEventField(index, 'time', e.target.value)}
                      />
                      <input
                        className={inputClass}
                        placeholder="Venue"
                        value={event.venue}
                        onChange={(e) => setEventField(index, 'venue', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate(`/${slug}`)}
                className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-6 py-3 bg-[#c59d5f] text-white rounded-lg hover:bg-[#b8863f] transition disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditInvitation;