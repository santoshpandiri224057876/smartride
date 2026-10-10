import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, User, Mail, Phone, Lock, AlertCircle, ArrowRight } from 'lucide-react';

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const indianPhoneRegex = /^(\+91[\-\s]?)?[6-9]\d{9}$/;
    if (!indianPhoneRegex.test(formData.phone.trim())) {
      setError('Please enter a valid 10-digit Indian mobile number (e.g. +91 9876543210 or 9876543210)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please check the entered fields.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '64px 24px', minHeight: 'calc(100vh - 150px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '480px', width: '100%' }}>
        <div className="card" style={{ padding: '36px' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div className="brand-icon" style={{ margin: '0 auto 16px', width: '48px', height: '48px' }}>
              <UserPlus size={24} />
            </div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>Create an Account</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Join SmartRide today as a passenger and driver with a single account.
            </p>
          </div>

          {error && (
            <div className="alert alert-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <div className="search-input-field">
                <User size={18} color="var(--text-muted)" />
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Rahul Sharma"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <div className="search-input-field">
                <Mail size={18} color="var(--text-muted)" />
                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Mobile Number (India +91)</label>
              <div className="search-input-field">
                <Phone size={18} color="var(--text-muted)" />
                <input
                  type="tel"
                  name="phone"
                  placeholder="+91 98765 43210"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password (min 6 characters)</label>
              <div className="search-input-field">
                <Lock size={18} color="var(--text-muted)" />
                <input
                  type="password"
                  name="password"
                  placeholder="Choose a secure password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <div className="search-input-field">
                <Lock size={18} color="var(--text-muted)" />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Re-enter password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '12px' }}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Complete Registration'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Already registered on SmartRide?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
