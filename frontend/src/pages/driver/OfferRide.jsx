import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { driverService } from '../../services/api';
import {
  Car,
  MapPin,
  Navigation,
  Calendar,
  Clock,
  Users,
  FileText,
  AlertCircle,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { getAllIndianCities } from '../../data/indianLocations';

export const OfferRide = () => {
  const navigate = useNavigate();
  const indianCities = getAllIndianCities();

  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    departureDate: '',
    departureTime: '',
    totalSeats: 3,
    pricePerSeat: 350,
    vehicleName: '',
    description: '',
  });

  const [driverProfile, setDriverProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await driverService.getProfile();
        const profile = res.data.data;
        setDriverProfile(profile);

        if (profile) {
          const autoVehicle = `${profile.vehicleMake || ''} ${profile.vehicleModel || ''}`.trim();
          setFormData((prev) => ({
            ...prev,
            vehicleName: autoVehicle || 'Personal Vehicle',
            totalSeats: profile.totalSeats || 3,
          }));
        }
      } catch (err) {
        setError('Could not load your driver profile.');
      } finally {
        setProfileLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await driverService.offerRide({
        ...formData,
        totalSeats: Number(formData.totalSeats),
        pricePerSeat: parseFloat(formData.pricePerSeat),
      });
      navigate('/driver/rides?created=true');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to offer ride. Please check all fields.');
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading vehicle profile...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '6px' }}>Offer a New Ride</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Publish your upcoming journey to share travel costs with verified passengers.
        </p>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="card" style={{ padding: '36px' }}>
        <form onSubmit={handleSubmit}>
          {/* Route Info */}
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Navigation size={18} color="var(--primary)" /> Route Details
            </h3>

            <div className="form-row">
              <div className="form-group">
                <label>Leaving From (Source City/Location) *</label>
                <div className="search-input-field">
                  <MapPin size={18} color="var(--text-muted)" />
                  <input
                    type="text"
                    name="source"
                    list="offer-cities-list"
                    placeholder="e.g. Hyderabad, Telangana"
                    required
                    value={formData.source}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Going To (Destination City/Location) *</label>
                <div className="search-input-field">
                  <Navigation size={18} color="var(--text-muted)" />
                  <input
                    type="text"
                    name="destination"
                    list="offer-cities-list"
                    placeholder="e.g. Bengaluru, Karnataka"
                    required
                    value={formData.destination}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <datalist id="offer-cities-list">
              {indianCities.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>

          {/* Schedule */}
          <div style={{ marginBottom: '28px', borderTop: '1px solid var(--border-light)', paddingTop: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={18} color="var(--primary)" /> Date & Departure Time
            </h3>

            <div className="form-row">
              <div className="form-group">
                <label>Departure Date *</label>
                <div className="search-input-field">
                  <Calendar size={18} color="var(--text-muted)" />
                  <input
                    type="date"
                    name="departureDate"
                    required
                    value={formData.departureDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Departure Time *</label>
                <div className="search-input-field">
                  <Clock size={18} color="var(--text-muted)" />
                  <input
                    type="time"
                    name="departureTime"
                    required
                    value={formData.departureTime}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & Seats */}
          <div style={{ marginBottom: '28px', borderTop: '1px solid var(--border-light)', paddingTop: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem' }}>₹</span> Capacity & Seat Pricing (INR)
            </h3>

            <div className="form-row">
              <div className="form-group">
                <label>Seats Offered (Max vehicle cap: {driverProfile?.totalSeats}) *</label>
                <div className="search-input-field">
                  <Users size={18} color="var(--text-muted)" />
                  <input
                    type="number"
                    name="totalSeats"
                    min="1"
                    max={driverProfile?.totalSeats || 6}
                    required
                    value={formData.totalSeats}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Price Per Passenger Seat (₹) *</label>
                <div className="search-input-field">
                  <span style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: '1rem', paddingLeft: '4px' }}>₹</span>
                  <input
                    type="number"
                    step="10"
                    min="10"
                    name="pricePerSeat"
                    required
                    placeholder="e.g. 450"
                    value={formData.pricePerSeat}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle & Notes */}
          <div style={{ marginBottom: '32px', borderTop: '1px solid var(--border-light)', paddingTop: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Car size={18} color="var(--primary)" /> Vehicle & Trip Guidelines
            </h3>

            <div className="form-group">
              <label>Vehicle Name (Auto-populated from Driver Profile)</label>
              <div className="search-input-field">
                <Car size={18} color="var(--text-muted)" />
                <input
                  type="text"
                  name="vehicleName"
                  value={formData.vehicleName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Pickup / Drop Locality & Guidelines</label>
              <textarea
                className="form-control"
                rows={3}
                name="description"
                placeholder="Mention pickup point (e.g. Hitec City, Gachibowli ORR junction), drop point (e.g. Silk Board, Hebbal), AC, boot space, etc."
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
            >
              {loading ? 'Publishing Ride...' : 'Publish Ride Now'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/driver/rides')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
