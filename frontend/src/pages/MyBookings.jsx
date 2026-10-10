import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../services/api';
import {
  Car,
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  CheckCircle,
  XCircle,
  Search,
  ArrowRight
} from 'lucide-react';

export const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [cancelModal, setCancelModal] = useState(null); // booking object to cancel
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchBookings = async () => {
    try {
      const res = await bookingService.getMyBookings();
      setBookings(res.data.data);
    } catch (err) {
      setError('Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async () => {
    if (!cancelModal) return;
    setActionLoading(cancelModal.id);
    setError('');
    setMessage('');

    try {
      await bookingService.cancelBooking(cancelModal.id);
      setMessage('Booking cancelled successfully and seats have been restored.');
      setCancelModal(null);
      await fetchBookings();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to cancel booking.';
      setError(msg);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      {/* Cancel Confirmation Modal */}
      {cancelModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.3rem', marginBottom: '12px' }}>Confirm Cancellation</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.5 }}>
              Are you sure you want to cancel your booking for <strong>{cancelModal.source} → {cancelModal.destination}</strong>?
              Your reserved seats ({cancelModal.seatsBooked}) will immediately be returned to available inventory.
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setCancelModal(null)}
                disabled={actionLoading}
              >
                Keep Booking
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleCancelBooking}
                disabled={actionLoading}
              >
                {actionLoading ? 'Cancelling...' : 'Yes, Cancel Booking'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '6px' }}>My Bookings</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Track and manage all your reserved journeys in one place.
          </p>
        </div>

        <Link to="/find-rides" className="btn btn-primary">
          <Search size={16} /> Book Another Ride
        </Link>
      </div>

      {message && (
        <div className="alert alert-success">
          <CheckCircle size={18} />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="loading-screen" style={{ minHeight: '260px' }}>
          <div className="spinner"></div>
          <p>Retrieving your bookings...</p>
        </div>
      ) : bookings.length > 0 ? (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Trip Route</th>
                <th>Driver</th>
                <th>Date & Time</th>
                <th>Seats</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td>
                    <div style={{ fontWeight: 700, fontSize: '0.96rem' }}>
                      {b.source} → {b.destination}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Booking ID: #{b.id}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{b.driverName}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {b.driverPhone || 'Verified Contact'}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} color="var(--text-muted)" />
                      <span>{b.departureDate}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      <Clock size={14} />
                      <span>{b.departureTime?.substring(0, 5)}</span>
                    </div>
                  </td>
                  <td>
                    <strong>{b.seatsBooked}</strong> {b.seatsBooked === 1 ? 'seat' : 'seats'}
                  </td>
                  <td>
                    <strong style={{ color: 'var(--primary)', fontSize: '1.05rem' }}>
                      ₹{Math.round(b.totalPrice)}
                    </strong>
                  </td>
                  <td>
                    <span className={`badge badge-${b.bookingStatus}`}>
                      {b.bookingStatus}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Link to={`/ride/${b.rideId}`} className="btn btn-secondary btn-sm">
                        View Ride
                      </Link>
                      {b.bookingStatus !== 'CANCELLED' && b.bookingStatus !== 'COMPLETED' && (
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => setCancelModal(b)}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '60px 24px' }}>
          <Car size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>No bookings found</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            You haven't reserved any rides yet. Find a driver traveling your route today!
          </p>
          <Link to="/find-rides" className="btn btn-primary">
            Find and Book a Ride
          </Link>
        </div>
      )}
    </div>
  );
};
