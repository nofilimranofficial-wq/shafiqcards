import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const InvitationPage = () => {
  const { slug } = useParams();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        const res  = await fetch(`${API_BASE_URL}/web-invitations/${slug}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || 'Not found');
        setData(json.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInvitation();
  }, [slug]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #0d0806, #1f110a)',
        flexDirection: 'column', gap: 24,
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          border: '3px solid rgba(197,157,95,0.2)',
          borderTop: '3px solid #c59d5f',
          animation: 'spin 0.8s linear infinite',
        }} />
        <p style={{ color: 'rgba(255,255,255,0.45)', letterSpacing: '0.25em', textTransform: 'uppercase', fontSize: '0.75rem' }}>
          Loading Invitation…
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #0d0806, #1f110a)',
        flexDirection: 'column', gap: 20, padding: 24, textAlign: 'center',
      }}>
        <span style={{ fontSize: '4rem' }}>💌</span>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', color: '#fff', margin: 0 }}>
          Invitation Not Found
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', maxWidth: 380 }}>
          The link you followed may be incorrect or this invitation may no longer be available.
        </p>
        <a href="/web-invites" style={{
          marginTop: 16, padding: '14px 36px', borderRadius: 999,
          background: 'linear-gradient(90deg, #c59d5f, #b8863f)',
          color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.1em',
        }}>
          Create Your Invitation
        </a>
      </div>
    );
  }

  /* Template switcher — we render all templates via the backend HTML engine */
  return (
    <iframe 
      src={`${API_BASE_URL}/web-invitations/html/${slug}`} 
      style={{width: '100%', height: '100vh', border: 'none', margin: 0, padding: 0, display: 'block'}} 
      title="Wedding Invitation" 
    />
  );
};

export default InvitationPage;
