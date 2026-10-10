import React, { useState, useEffect } from 'react';
import { driverService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Car,
  ShieldCheck,
  FileText,
  User,
  CheckCircle,
  AlertCircle,
  Fuel
} from 'lucide-react';
import { INDIAN_VEHICLE_MAKES, FUEL_TYPES } from '../../data/indianLocations';

export const DriverProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    licenseNumber: '',
    licenseExpiry: '',
    vehicleType: 'Sedan',
    fuelType: 'Petrol',
    vehicleMake: '',
    vehicleModel: '',
    vehicleNumber: '',
    vehicleColor: '',
    totalSeats: 4,
    profilePhoto: '',
    vehiclePhoto: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await driverService.getProfile();
        const d = res.data.data;
        setProfile(d);
        if (d) {
          setFormData({
            licenseNumber: d.licenseNumber || '',
            licenseExpiry: d.licenseExpiry || '',
            vehicleType: d.vehicleType || 'Sedan',
            fuelType: d.fuelType || 'Petrol',
            vehicleMake: d.vehicleMake || '',
            vehicleModel: d.vehicleModel || '',
            vehicleNumber: d.vehicleNumber || '',
            vehicleColor: d.vehicleColor || '',
            totalSeats: d.totalSeats || 4,
            profilePhoto: d.profilePhoto || '',
            vehiclePhoto: d.vehiclePhoto || '',
          });
        }
      } catch (err) {
        setError('Failed to load driver profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await driverService.updateProfile({
        ...formData,
        totalSeats: Number(formData.totalSeats),
      });
      setProfile(res.data.data);
      setSuccess('Driver and vehicle specifications updated successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading driver credentials...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '6px' }}>Driver & Vehicle Profile</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Manage your verified driver credentials and vehicle specifications.
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

      {/* Account Overview */}
      <div className="card" style={{ padding: '24px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="avatar-circle" style={{ width: '56px', height: '56px', fontSize: '1.4rem' }}>
              {profile?.userName ? profile.userName.charAt(0).toUpperCase() : 'D'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '1.2rem' }}>{profile?.userName}</h3>
                <span className={`badge badge-${profile?.verificationStatus}`}>
                  {profile?.verificationStatus}
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{profile?.userEmail} • {profile?.userPhone}</p>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Registered Driver ID</span>
            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>#{profile?.id}</div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="card" style={{ padding: '36px' }}>
        <form onSubmit={handleSubmit}>
          {/* Driver Licensing */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} color="var(--primary)" /> Driver License
            </h3>

            <div className="form-row">
              <div className="form-group">
                <label>Driving License Number</label>
                <input
                  className="form-control"
                  type="text"
                  name="licenseNumber"
                  required
                  value={formData.licenseNumber}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>License Expiry Date</label>
                <input
                  className="form-control"
                  type="date"
                  name="licenseExpiry"
                  required
                  value={formData.licenseExpiry}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Vehicle Information */}
          <div style={{ marginBottom: '28px', borderTop: '1px solid var(--border-light)', paddingTop: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Car size={18} color="var(--primary)" /> Vehicle Details (India)
            </h3>

            <div className="form-row">
              <div className="form-group">
                <label>Vehicle Type</label>
                <select
                  className="form-control"
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                >
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV / Crossover</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="MUV / Minivan">MUV / Minivan</option>
                </select>
              </div>

              <div className="form-group">
                <label>Fuel Type</label>
                <select
                  className="form-control"
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleChange}
                >
                  {FUEL_TYPES.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Make</label>
                <input
                  className="form-control"
                  type="text"
                  name="vehicleMake"
                  list="driver-profile-makes"
                  placeholder="e.g. Maruti Suzuki, Tata Motors"
                  required
                  value={formData.vehicleMake}
                  onChange={handleChange}
                />
                <datalist id="driver-profile-makes">
                  {INDIAN_VEHICLE_MAKES.map((m) => (
                    <option key={m} value={m} />
                  ))}
                </datalist>
              </div>

              <div className="form-group">
                <label>Model</label>
                <input
                  className="form-control"
                  type="text"
                  name="vehicleModel"
                  placeholder="e.g. Swift Dzire, Nexon, Ertiga"
                  required
                  value={formData.vehicleModel}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row" style={{ marginTop: '12px' }}>
              <div className="form-group" style={{ flex: '1.5' }}>
                <label>Registration Number (RC Plate)</label>
                <input
                  className="form-control"
                  type="text"
                  name="vehicleNumber"
                  placeholder="e.g. TS09AB1234, MH12XY5678, or 22 BH 1234 AA"
                  required
                  value={formData.vehicleNumber}
                  onChange={handleChange}
                />
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  State (TS, KA, MH, DL, etc.) or BH-series
                </span>
              </div>

              <div className="form-group">
                <label>Vehicle Color</label>
                <input
                  className="form-control"
                  type="text"
                  name="vehicleColor"
                  placeholder="e.g. White, Silver, Grey"
                  required
                  value={formData.vehicleColor}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Total Passenger Seats</label>
                <input
                  className="form-control"
                  type="number"
                  min="1"
                  max="8"
                  name="totalSeats"
                  required
                  value={formData.totalSeats}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving}
          >
            {saving ? 'Updating Credentials...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};
