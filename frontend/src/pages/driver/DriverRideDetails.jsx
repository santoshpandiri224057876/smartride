import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { driverService } from '../../services/api';
import {
  Car,
  Calendar,
  Clock,
  Users,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Edit,
  Trash2,
  ArrowLeft,
  UserCheck
} from 'lucide-react';

export const DriverRideDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ride, setRide] = useState(null);
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelModal, setCancelModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchRideAndPassengers = async () => {
      try {
        const [rideRes, passRes] = await Promise.all([
          driverService.getRideById(id),
          driverService.getRidePassengers(id),
        ]);
        setRide(rideRes.data.data);
        setPassengers(passRes.data.data);
      } catch (err) {
        setError('Failed to load ride details.');
      } finally {
        setLoading(false);
      }
    };
    fetchRideAndPassengers();
  }, [id]);

  const handleCancel = async () => {
    setActionLoading(true);
    try {
      await driverService.cancelRide(id);
      navigate('/driver/rides');
    } catch (err) {
      setError('Failed to cancel ride.');
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading trip specifics...</p>
      </div>
    );
  }

  if (error || !ride) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 24px' }}>
        <div className="alert alert-error">{error || 'Ride not found.'}</div>
        <Link to="/driver/rides" className="btn btn-secondary">
          <ArrowLeft size={16} /> Back to My Rides
        </Link>
      </div>
    );
  }

  const confirmedSeats = passengers
    .filter((p) => p.bookingStatus === 'CONFIRMED' || p.bookingStatus === 'COMPLETED')
    .reduce((sum, p) => sum + p.seatsBooked, 0);

  const earnings = confirmedSeats * ride.pricePerSeat;

  return (
    <div>
      {/* Cancel Confirmation Modal */}
      {cancelModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.3rem', marginBottom: '12px' }}>Confirm Ride Cancellation</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.5 }}>
              Are you sure you want to cancel this trip from <strong>{ride.source} to {ride.destination}</strong>?
              All booked passengers will be notified of cancellation.
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setCancelModal(false)}
                disabled={actionLoading}
              >
                No, Keep Trip
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleCancel}
                disabled={actionLoading}
              >
                {actionLoading ? 'Cancelling...' : 'Yes, Cancel Trip'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Breadcrumb */}
      <div style={{ marginBottom: '24px' }}>
        <Link to="/driver/rides" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Back to Active Rides
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 style={{ fontSize: '2rem' }}>
              {ride.source} → {ride.destination}
            </h1>
            <span className={`badge badge-${ride.status}`}>{ride.status}</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Scheduled for {ride.departureDate} at {ride.departureTime?.substring(0, 5)}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to={`/driver/rides/${id}/passengers`} className="btn btn-secondary">
            <Users size={16} /> View Passengers ({passengers.length})
          </Link>
          {ride.status === 'ACTIVE' && (
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={() => setCancelModal(true)}
            >
              <Trash2 size={16} /> Cancel Ride
            </button>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{ride.availableSeats} / {ride.totalSeats}</div>
            <div className="stat-label">Available Seats</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <UserCheck size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{confirmedSeats}</div>
            <div className="stat-label">Confirmed Seats Booked</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green" style={{ fontWeight: 800, fontSize: '1.4rem' }}>
            ₹
          </div>
          <div className="stat-info">
            <div className="stat-value">₹{Math.round(earnings)}</div>
            <div className="stat-label">Estimated Trip Revenue</div>
          </div>
        </div>
      </div>

      {/* Ride Details Card */}
      <div className="card" style={{ padding: '28px', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Trip Details</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Assigned Vehicle</div>
            <div style={{ fontWeight: 600 }}>{ride.vehicleName}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Fare Per Seat</div>
            <div style={{ fontWeight: 600 }}>₹{Math.round(ride.pricePerSeat)}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Ride Created</div>
            <div style={{ fontWeight: 600 }}>{ride.createdAt ? ride.createdAt.substring(0, 10) : 'Recent'}</div>
          </div>
        </div>

        {ride.description && (
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Notes</div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>{ride.description}</p>
          </div>
        )}
      </div>

      {/* Passenger Roster Table */}
      <div className="card" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.25rem' }}>Booked Passengers</h3>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            {passengers.length} bookings recorded
          </span>
        </div>

        {passengers.length > 0 ? (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Passenger</th>
                  <th>Phone</th>
                  <th>Seats</th>
                  <th>Total Paid</th>
                  <th>Status</th>
                  <th>Booking Date</th>
                </tr>
              </thead>
              <tbody>
                {passengers.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{p.passengerName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.passengerEmail}</div>
                    </td>
                    <td>{p.passengerPhone || 'N/A'}</td>
                    <td><strong>{p.seatsBooked}</strong></td>
                    <td><strong style={{ color: 'var(--primary)' }}>₹{Math.round(p.totalPrice)}</strong></td>
                    <td>
                      <span className={`badge badge-${p.bookingStatus}`}>{p.bookingStatus}</span>
                    </td>
                    <td>{p.bookedAt ? p.bookedAt.substring(0, 10) : 'Recent'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px' }}>
            No passengers have booked this ride yet.
          </p>
        )}
      </div>
    </div>
  );
};
