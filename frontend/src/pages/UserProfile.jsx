import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/api';
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Clock,
  Car
} from 'lucide-react';

export const UserProfile = () => {
  const { user, refreshUser } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    try {
      await userService.updateProfile(formData);
      await refreshUser();
      setSuccess('Profile updated successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 24px', maxWidth: '720px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '6px' }}>Account Profile</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Manage your personal details and view verification credentials.
        </p>
      </div>

      {success && (
        <div className="alert alert-success">
          <CheckCircle size={18} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Account Overview Card */}
      <div className="card" style={{ padding: '28px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
          <div className="avatar-circle" style={{ width: '64px', height: '64px', fontSize: '1.5rem' }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 style={{ fontSize: '1.3rem' }}>{user?.name}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{user?.email}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', background: 'var(--bg-main)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Role</div>
            <span className={`badge badge-${user?.role}`} style={{ marginTop: '4px' }}>
              {user?.role}
            </span>
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Driver Status</div>
            <span
              className={`badge badge-${user?.driverVerificationStatus || 'secondary'}`}
              style={{ marginTop: '4px' }}
            >
              {user?.driverVerificationStatus || 'NOT REGISTERED'}
            </span>
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Account ID</div>
            <div style={{ fontWeight: 600, marginTop: '4px' }}>#{user?.id}</div>
          </div>
        </div>
      </div>

      {/* Edit Information Form */}
      <div className="card" style={{ padding: '32px' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Personal Information</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address (Primary Login)</label>
            <div className="search-input-field" style={{ background: 'var(--bg-subtle)' }}>
              <Mail size={18} color="var(--text-muted)" />
              <input type="email" value={user?.email || ''} disabled style={{ color: 'var(--text-muted)' }} />
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Email cannot be changed once registered.</span>
          </div>

          <div className="form-group">
            <label>Full Name</label>
            <div className="search-input-field">
              <User size={18} color="var(--text-muted)" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Indian Mobile Number (Shared with booked passengers)</label>
            <div className="search-input-field">
              <Phone size={18} color="var(--text-muted)" />
              <input
                type="tel"
                required
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Enter 10-digit Indian mobile number (+91 optional).</span>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ marginTop: '12px' }}
            disabled={loading}
          >
            {loading ? 'Saving Changes...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};
