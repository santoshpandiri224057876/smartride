import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { rideService, bookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  MapPin,
  Calendar,
  Clock,
  Car,
  Users,
  ShieldCheck,
  Star,
  DollarSign,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Info
} from 'lucide-react';

export const RideDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(null);

  useEffect(() => {
    const fetchRide = async () => {
      try {
        const res = await rideService.getRideById(id);
        setRide(res.data.data);
      } catch (err) {
        setError('Ride not found or could not be loaded.');
      } finally {
        setLoading(false);
      }
    };
    fetchRide();
  }, [id]);

  const handleBookRide = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/ride/${id}` } });
      return;
    }

    if (user.id === ride.driverUserId) {
      setError('You cannot book your own offered ride.');
      return;
    }

    if (ride.availableSeats < selectedSeats) {
      setError(`Only ${ride.availableSeats} seats remaining.`);
      return;
    }

    setBookingLoading(true);
    setError('');

    try {
      const res = await bookingService.createBooking({
        rideId: Number(id),
        seatsBooked: selectedSeats,
      });
      setBookingSuccess(res.data.data);
      // Refresh available seats locally
      setRide((prev) => ({
        ...prev,
        availableSeats: prev.availableSeats - selectedSeats,
      }));
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to book this ride. Please try again.';
      setError(msg);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container loading-screen">
        <div className="spinner"></div>
        <p>Loading trip details...</p>
      </div>
    );
  }

  if (error && !ride) {
    return (
      <div className="container" style={{ padding: '60px 24px', textAlign: 'center' }}>
        <div className="alert alert-error" style={{ maxWidth: '480px', margin: '0 auto 20px' }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
        <Link to="/find-rides" className="btn btn-primary">
          Back to Search Rides
        </Link>
      </div>
    );
  }

  const isOwnRide = user && ride && user.id === ride.driverUserId;
  const totalPrice = selectedSeats * (ride?.pricePerSeat || 0);

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      {/* Success Modal */}
      {bookingSuccess && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--success-bg)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <CheckCircle size={36} />
            </div>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '8px' }}>Booking Confirmed!</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.95rem' }}>
              Your seat reservation has been confirmed for <strong>{ride.source} → {ride.destination}</strong> on <strong>{ride.departureDate}</strong>.
            </p>

            <div style={{ background: 'var(--bg-main)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '24px', textAlign: 'left', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Seats Booked:</span>
                <strong>{bookingSuccess.seatsBooked}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Total Amount:</span>
                <strong style={{ color: 'var(--primary)' }}>₹{Math.round(bookingSuccess.totalPrice)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Driver:</span>
                <strong>{ride.driverName}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Departure Time:</span>
                <strong>{ride.departureTime?.substring(0, 5)}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <Link to="/my-bookings" className="btn btn-primary">
                View My Bookings
              </Link>
              <Link to="/find-rides" className="btn btn-secondary">
                Search More Rides
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '32px', alignItems: 'start' }}>
        {/* Left: Journey & Driver Details */}
        <div>
          {error && (
            <div className="alert alert-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Route Card */}
          <div className="card" style={{ padding: '32px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <span className="badge badge-success">
                {ride.status} RIDE
              </span>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Ride ID: #{ride.id}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '24px', marginBottom: '28px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '4px' }}>
                <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: 'var(--primary)', border: '3px solid #bfdbfe' }}></div>
                <div style={{ width: '2px', height: '56px', background: 'var(--border-light)', margin: '4px 0' }}></div>
                <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#10b981', border: '3px solid #a7f3d0' }}></div>
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '20px' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Departure ({ride.departureTime?.substring(0, 5)})</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800 }}>{ride.source}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Destination</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800 }}>{ride.destination}</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.92rem' }}>
                <Calendar size={18} color="var(--primary)" />
                <span>Date: <strong>{ride.departureDate}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.92rem' }}>
                <Clock size={18} color="var(--primary)" />
                <span>Time: <strong>{ride.departureTime?.substring(0, 5)}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.92rem' }}>
                <Users size={18} color="var(--primary)" />
                <span>Available Seats: <strong>{ride.availableSeats}</strong> / {ride.totalSeats}</span>
              </div>
            </div>
          </div>

          {/* Driver Information Card */}
          <div className="card" style={{ padding: '28px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Driver Profile</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '20px' }}>
              {ride.driverProfilePhoto ? (
                <img
                  src={ride.driverProfilePhoto}
                  alt={ride.driverName}
                  className="driver-avatar-img"
                  style={{ width: '64px', height: '64px' }}
                />
              ) : (
                <div className="avatar-circle" style={{ width: '64px', height: '64px', fontSize: '1.4rem' }}>
                  {ride.driverName ? ride.driverName.charAt(0).toUpperCase() : 'D'}
                </div>
              )}

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h4 style={{ fontSize: '1.2rem' }}>{ride.driverName}</h4>
                  {ride.driverVerificationStatus === 'APPROVED' && (
                    <span className="badge badge-success">
                      <ShieldCheck size={13} /> Verified Driver
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f59e0b', marginTop: '4px' }}>
                  <Star size={15} fill="#f59e0b" />
                  <span style={{ fontWeight: 700 }}>{ride.driverRating || '4.8'}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>rating based on community trips</span>
                </div>
              </div>
            </div>

            {/* Vehicle Details */}
            <div style={{ background: 'var(--bg-main)', padding: '16px', borderRadius: 'var(--radius-md)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Vehicle Model</div>
                <div style={{ fontWeight: 600 }}>{ride.vehicleName || 'Standard'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Vehicle Type</div>
                <div style={{ fontWeight: 600 }}>{ride.vehicleType || 'Sedan'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Color</div>
                <div style={{ fontWeight: 600 }}>{ride.vehicleColor || 'Silver'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Plate Registration</div>
                <div style={{ fontWeight: 600 }}>{ride.vehicleNumber || 'Verified'}</div>
              </div>
            </div>
          </div>

          {/* Trip Description */}
          {ride.description && (
            <div className="card" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>Trip Notes & Preferences</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                {ride.description}
              </p>
            </div>
          )}
        </div>

        {/* Right: Booking Summary Card */}
        <div className="card" style={{ padding: '28px', position: 'sticky', top: '100px' }}>
          <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '20px', marginBottom: '20px' }}>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Price per seat</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary)' }}>
              ₹{Math.round(ride.pricePerSeat)}
            </div>
          </div>

          {isOwnRide ? (
            <div className="alert alert-info">
              <Info size={18} />
              <span>You are the driver of this ride. You cannot book your own trip.</span>
            </div>
          ) : ride.availableSeats <= 0 ? (
            <div className="alert alert-warning">
              <AlertCircle size={18} />
              <span>This ride is fully booked. No remaining seats.</span>
            </div>
          ) : (
            <>
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label>Select Number of Seats</label>
                <select
                  className="form-control"
                  value={selectedSeats}
                  onChange={(e) => setSelectedSeats(Number(e.target.value))}
                >
                  {Array.from({ length: Math.min(ride.availableSeats, 4) }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? 'seat' : 'seats'} (₹{Math.round(n * ride.pricePerSeat)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Breakdown */}
              <div style={{ background: 'var(--bg-main)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.92rem' }}>
                  <span>{selectedSeats} × ₹{Math.round(ride.pricePerSeat)}</span>
                  <span>₹{Math.round(selectedSeats * ride.pricePerSeat)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.92rem' }}>
                  <span>Booking fee</span>
                  <span style={{ color: '#10b981', fontWeight: 600 }}>FREE</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: '10px', fontWeight: 800, fontSize: '1.15rem' }}>
                  <span>Total Amount</span>
                  <span style={{ color: 'var(--primary)' }}>₹{Math.round(totalPrice)}</span>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
                onClick={handleBookRide}
                disabled={bookingLoading}
              >
                {bookingLoading ? 'Processing Booking...' : `Book Ride (₹${Math.round(totalPrice)})`}
              </button>

              <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '12px' }}>
                Instant confirmation. No credit card pre-charge.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
