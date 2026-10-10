import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { driverService } from '../services/api';
import {
  Car,
  ShieldCheck,
  Clock,
  XCircle,
  CheckCircle,
  FileText,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Fuel
} from 'lucide-react';
import { INDIAN_VEHICLE_MAKES, FUEL_TYPES } from '../data/indianLocations';

export const BecomeDriver = () => {
  const { user, refreshUser, switchMode, isApprovedDriver, isPendingDriver, isRejectedDriver } = useAuth();
  const navigate = useNavigate();

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

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Pre-load existing driver profile if exists
  useEffect(() => {
    const fetchExisting = async () => {
      try {
        const res = await driverService.getProfile();
        const d = res.data.data;
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
        // No driver profile yet, ignore
      }
    };
    if (user?.driverVerificationStatus) {
      fetchExisting();
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await driverService.apply({
        ...formData,
        totalSeats: Number(formData.totalSeats),
      });
      await refreshUser();
      setSuccessMsg('Your driver application has been submitted and is waiting for admin approval.');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit driver application.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 24px', maxWidth: '800px' }}>
      {/* Title & Introduction */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div className="brand-icon" style={{ margin: '0 auto 16px', width: '52px', height: '52px' }}>
          <Car size={26} />
        </div>
        <h1 style={{ fontSize: '2.4rem', marginBottom: '10px' }}>
          Become a SmartRide Driver
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '580px', margin: '0 auto' }}>
          Turn your empty seats into savings by sharing your journey. Offset high fuel costs and connect with verified passengers.
        </p>
      </div>

      {/* Driver Status Banner */}
      {isApprovedDriver && (
        <div className="alert alert-success" style={{ padding: '20px', marginBottom: '28px' }}>
          <CheckCircle size={24} />
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Your driver account has been approved!</h4>
            <p style={{ fontSize: '0.92rem' }}>
              You have full access to offer rides and accept bookings.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => {
              switchMode('DRIVER');
              navigate('/driver/dashboard');
            }}
          >
            Switch to Driver Mode <ArrowRight size={14} />
          </button>
        </div>
      )}

      {isPendingDriver && (
        <div className="alert alert-warning" style={{ padding: '20px', marginBottom: '28px' }}>
          <Clock size={24} />
          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Your driver application is under review</h4>
            <p style={{ fontSize: '0.92rem' }}>
              Your application has been submitted and is waiting for admin approval. Once approved, you will be able to offer rides.
            </p>
          </div>
        </div>
      )}

      {isRejectedDriver && (
        <div className="alert alert-error" style={{ padding: '20px', marginBottom: '28px' }}>
          <XCircle size={24} />
          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Your driver application was rejected</h4>
            <p style={{ fontSize: '0.92rem' }}>
              Please review your details below, ensure your license number and expiry are correct, and re-apply.
            </p>
          </div>
        </div>
      )}

      {successMsg && (
        <div className="alert alert-success">
          <CheckCircle size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Driver Application Form */}
      <div className="card" style={{ padding: '36px' }}>
        <form onSubmit={handleSubmit}>
          {/* Section 1: Personal Information */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={20} color="var(--primary)" /> 1. Personal Information
            </h3>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input className="form-control" type="text" value={user?.name || ''} disabled />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input className="form-control" type="email" value={user?.email || ''} disabled />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input className="form-control" type="tel" value={user?.phone || ''} disabled />
              </div>
            </div>
          </div>

          {/* Section 2: Driver Licensing */}
          <div style={{ marginBottom: '32px', borderTop: '1px solid var(--border-light)', paddingTop: '24px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={20} color="var(--primary)" /> 2. Driver License Information
            </h3>
            <div className="form-row">
              <div className="form-group">
                <label>Indian Driving License Number *</label>
                <input
                  className="form-control"
                  type="text"
                  name="licenseNumber"
                  placeholder="e.g. TS0920210048123 or DL-1420110012345"
                  required
                  value={formData.licenseNumber}
                  onChange={handleChange}
                />
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Enter state code followed by RTO and license digits.</span>
              </div>
              <div className="form-group">
                <label>License Expiry Date *</label>
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

          {/* Section 3: Vehicle Information */}
          <div style={{ marginBottom: '32px', borderTop: '1px solid var(--border-light)', paddingTop: '24px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Car size={20} color="var(--primary)" /> 3. Vehicle Specifications (India)
            </h3>
            <div className="form-row">
              <div className="form-group">
                <label>Vehicle Type *</label>
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
                <label>Fuel Type *</label>
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
                <label>Vehicle Make *</label>
                <input
                  className="form-control"
                  type="text"
                  name="vehicleMake"
                  list="indian-makes-list"
                  placeholder="e.g. Maruti Suzuki, Tata Motors, Hyundai"
                  required
                  value={formData.vehicleMake}
                  onChange={handleChange}
                />
                <datalist id="indian-makes-list">
                  {INDIAN_VEHICLE_MAKES.map((m) => (
                    <option key={m} value={m} />
                  ))}
                </datalist>
              </div>

              <div className="form-group">
                <label>Vehicle Model *</label>
                <input
                  className="form-control"
                  type="text"
                  name="vehicleModel"
                  placeholder="e.g. Swift Dzire, Nexon, Creta, Ertiga"
                  required
                  value={formData.vehicleModel}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row" style={{ marginTop: '12px' }}>
              <div className="form-group" style={{ flex: '1.5' }}>
                <label>Vehicle Registration Number (RC Plate) *</label>
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
                  Supports state plates (e.g. TS09AB1234, KA01MN1234) & Bharat series (YY BH #### XX).
                </span>
              </div>

              <div className="form-group">
                <label>Vehicle Color *</label>
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
                <label>Passenger Seats *</label>
                <input
                  className="form-control"
                  type="number"
                  name="totalSeats"
                  min="1"
                  max="8"
                  required
                  value={formData.totalSeats}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: '24px' }}>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
            >
              {loading
                ? 'Submitting Application...'
                : isRejectedDriver
                ? 'Resubmit Driver Application'
                : isApprovedDriver
                ? 'Update Driver Credentials'
                : 'Submit Driver Application'}
            </button>
            <Link to="/dashboard" className="btn btn-secondary">
              Cancel & Return
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
