import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { clearInvitationAuth } from '../utils/invitationAuth';

const AdminNavbar = ({ slug, invitationAuth, onStatusChange, invitationData }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/web-invitations/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: invitationAuth.token }),
      });

      if (response.ok) {
        clearInvitationAuth();
        window.location.reload(); // Refresh to hide navbar
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleToggleStatus = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/web-invitations/${slug}/toggle-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: invitationAuth.token }),
      });

      const data = await response.json();
      if (data.success) {
        onStatusChange && onStatusChange(data.disabled);
        alert(data.message);
      } else {
        alert(data.message || 'Failed to toggle status');
      }
    } catch (error) {
      console.error('Toggle status error:', error);
      alert('Failed to toggle invitation status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this invitation? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/web-invitations/${slug}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: invitationAuth.token }),
      });

      const data = await response.json();
      if (data.success) {
        clearInvitationAuth();
        navigate('/');
      } else {
        alert(data.message || 'Failed to delete invitation');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete invitation');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: 'linear-gradient(135deg, #1a1a1a, #2d2d2d)',
      color: 'white',
      padding: '8px 20px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: '14px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Left side - Logo/Title */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <span style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#c59d5f'
        }}>
          💒
        </span>
        <div style={{
          display: 'flex',
          flexDirection: 'column'
        }}>
          <span style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#c59d5f'
          }}>
            Wedding Admin
          </span>
          {invitationData?.email && (
            <span style={{
              fontSize: '12px',
              color: '#a0aec0',
              fontWeight: '400'
            }}>
              {invitationData.email}
            </span>
          )}
        </div>
      </div>

      {/* Right side - Menu Items */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <button
          onClick={() => navigate('/')}
          disabled={isLoading}
          style={{
            background: 'transparent',
            color: '#e2e8f0',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s ease',
            opacity: isLoading ? 0.6 : 1
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.target.style.background = 'rgba(255,255,255,0.1)';
              e.target.style.color = '#c59d5f';
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading) {
              e.target.style.background = 'transparent';
              e.target.style.color = '#e2e8f0';
            }
          }}
          title="Go to Home"
        >
           Home
        </button>

        <button
          onClick={() => navigate(`/edit/${slug}`)}
          disabled={isLoading}
          style={{
            background: 'transparent',
            color: '#e2e8f0',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s ease',
            opacity: isLoading ? 0.6 : 1
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.target.style.background = 'rgba(255,255,255,0.1)';
              e.target.style.color = '#c59d5f';
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading) {
              e.target.style.background = 'transparent';
              e.target.style.color = '#e2e8f0';
            }
          }}
          title="Edit Invitation"
        >
           Edit
        </button>

        <button
          onClick={handleToggleStatus}
          disabled={isLoading}
          style={{
            background: 'transparent',
            color: '#e2e8f0',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s ease',
            opacity: isLoading ? 0.6 : 1
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.target.style.background = 'rgba(255,255,255,0.1)';
              e.target.style.color = '#fbb6ce';
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading) {
              e.target.style.background = 'transparent';
              e.target.style.color = '#e2e8f0';
            }
          }}
          title="Disable/Enable Invitation"
        >
           Toggle Status
        </button>

        <button
          onClick={handleDelete}
          disabled={isLoading}
          style={{
            background: 'transparent',
            color: '#e2e8f0',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s ease',
            opacity: isLoading ? 0.6 : 1
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.target.style.background = 'rgba(255,255,255,0.1)';
              e.target.style.color = '#fc8181';
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading) {
              e.target.style.background = 'transparent';
              e.target.style.color = '#e2e8f0';
            }
          }}
          title="Delete Invitation"
        >
           Delete
        </button>

        <div style={{
          width: '1px',
          height: '20px',
          background: 'rgba(255,255,255,0.2)',
          margin: '0 8px'
        }} />

        <button
          onClick={handleLogout}
          disabled={isLoading}
          style={{
            background: 'transparent',
            color: '#e2e8f0',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s ease',
            opacity: isLoading ? 0.6 : 1
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.target.style.background = 'rgba(255,255,255,0.1)';
              e.target.style.color = '#68d391';
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading) {
              e.target.style.background = 'transparent';
              e.target.style.color = '#e2e8f0';
            }
          }}
          title="Logout"
        >
           Logout
        </button>
      </div>
    </div>
  );
};

export default AdminNavbar;