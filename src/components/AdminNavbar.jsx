import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { clearInvitationAuth } from '../utils/invitationAuth';

const AdminNavbar = ({ slug, invitationAuth, onStatusChange, invitationData }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const buttonClasses =
    'rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60';
  const mobileButtonClasses = `${buttonClasses} w-full text-left`;

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
    <div className="fixed inset-x-0 top-0 z-50 bg-slate-950/95 text-white shadow-2xl backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💒</span>
            <div>
              <p className="text-base font-semibold text-amber-300">Wedding Admin</p>
              {invitationData?.email && (
                <p className="text-xs text-slate-300">{invitationData.email}</p>
              )}
            </div>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={() => navigate('/')}
              disabled={isLoading}
              className={buttonClasses}
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => navigate(`/edit/${slug}`)}
              disabled={isLoading}
              className={buttonClasses}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={handleToggleStatus}
              disabled={isLoading}
              className={buttonClasses}
            >
              Toggle Status
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isLoading}
              className={buttonClasses}
            >
              Delete
            </button>
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoading}
              className={buttonClasses}
            >
              Logout
            </button>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <span className="text-sm text-slate-300">Menu</span>
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white hover:bg-white/10"
              aria-expanded={menuOpen}
              aria-label="Toggle admin menu"
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="flex flex-col gap-2 rounded-3xl border border-white/10 bg-slate-950/95 p-3 md:hidden">
            <button
              type="button"
              onClick={() => {
                navigate('/');
                setMenuOpen(false);
              }}
              disabled={isLoading}
              className={mobileButtonClasses}
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => {
                navigate(`/edit/${slug}`);
                setMenuOpen(false);
              }}
              disabled={isLoading}
              className={mobileButtonClasses}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => {
                handleToggleStatus();
                setMenuOpen(false);
              }}
              disabled={isLoading}
              className={mobileButtonClasses}
            >
              Toggle Status
            </button>
            <button
              type="button"
              onClick={() => {
                handleDelete();
                setMenuOpen(false);
              }}
              disabled={isLoading}
              className={mobileButtonClasses}
            >
              Delete
            </button>
            <button
              type="button"
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              disabled={isLoading}
              className={mobileButtonClasses}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNavbar;
