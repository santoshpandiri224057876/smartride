import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { driverService } from '../../services/api';
import {
  Car,
  Calendar,
  Clock,
  Users,
  DollarSign,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  PlusCircle,
  Eye,
  X
} from 'lucide-react';

export const DriverRides = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const wasCreated = searchParams.get('created') === 'true';

  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState(wasCreated ? 'Ride published successfully!' : '');

  // Edit Modal State
  const [editModalRide, setEditModalRide] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [editLoading, setEditLoading] = useState(false);

  // Cancel Modal State
  const [cancelModalRide, setCancelModalRide] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRides = async () => {
    try {
      const res = await driverService.getRides();
      setRides(res.data.data);
    } catch (err) {
      setError('Failed to fetch rides.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);

  const openEditModal = (ride) => {
    setEditModalRide(ride);
    setEditFormData({
      source: ride.source,
      destination: ride.destination,
      departureDate: ride.departureDate,
      departureTime: ride.departureTime ? ride.departureTime.substring(0, 5) : '',
      totalSeats: ride.totalSeats,
      pricePerSeat: ride.pricePerSeat,
      vehicleName: ride.vehicleName || '',
      description: ride.description || '',
      status: ride.status,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setError('');
    setMessage('');

    try {
      await driverService.updateRide(editModalRide.id, {
        ...editFormData,
        totalSeats: Number(editFormData.totalSeats),
        pricePerSeat: parseFloat(editFormData.pricePerSeat),
      });
      setMessage('Ride updated successfully.');
      setEditModalRide(null);
      await fetchRides();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update ride.');
    } finally {
      setEditLoading(false);
    }
  };

  const handleCancelRide = async () => {
    if (!cancelModalRide) return;
    setActionLoading(true);
    setError('');
    setMessage('');

    try {
      await driverService.cancelRide(cancelModalRide.id);
      setMessage('Ride cancelled successfully.');
      setCancelModalRide(null);
      await fetchRides();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel ride.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div>
      {/* Edit Modal */}
      {editModalRide && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.3rem' }}>Edit Scheduled Ride</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => setEditModalRide(null)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Source City</label>
                  <input
                    className="form-control"
                    type="text"
                    required
                    value={editFormData.source}
                    onChange={(e) => setEditFormData({ ...editFormData, source: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Destination City</label>
                  <input
                    className="form-control"
                    type="text"
                    required
                    value={editFormData.destination}
                    onChange={(e) => setEditFormData({ ...editFormData, destination: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    className="form-control"
                    type="date"
                    required
                    value={editFormData.departureDate}
                    onChange={(e) => setEditFormData({ ...editFormData, departureDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input
                    className="form-control"
                    type="time"
                    required
                    value={editFormData.departureTime}
                    onChange={(e) => setEditFormData({ ...editFormData, departureTime: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Total Seats</label>
                  <input
                    className="form-control"
                    type="number"
                    min="1"
                    required
                    value={editFormData.totalSeats}
                    onChange={(e) => setEditFormData({ ...editFormData, totalSeats: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Price Per Seat (₹)</label>
                  <input
                    className="form-control"
                    type="number"
                    step="10"
                    min="10"
                    required
                    value={editFormData.pricePerSeat}
                    onChange={(e) => setEditFormData({ ...editFormData, pricePerSeat: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  className="form-control"
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div className="form-group">
                <label>Trip Description</label>
                <textarea
                  className="form-control"
                  rows={2}
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditModalRide(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={editLoading}
                >
                  {editLoading ? 'Saving Changes...' : 'Save Updates'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelModalRide && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.3rem', marginBottom: '12px' }}>Confirm Ride Cancellation</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.5 }}>
              Are you sure you want to cancel the ride from <strong>{cancelModalRide.source} to {cancelModalRide.destination}</strong> on <strong>{cancelModalRide.departureDate}</strong>?
              Any booked passengers will have their reservations marked as cancelled.
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setCancelModalRide(null)}
                disabled={actionLoading}
              >
                Keep Active
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleCancelRide}
                disabled={actionLoading}
              >
                {actionLoading ? 'Cancelling...' : 'Yes, Cancel Ride'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>My Active Rides</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Manage scheduled trips, seat allocations, and passenger rosters.
          </p>
        </div>

        <Link to="/driver/offer-ride" className="btn btn-primary">
          <PlusCircle size={18} /> Offer New Ride
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
          <p>Loading your rides...</p>
        </div>
      ) : rides.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
          {rides.map((ride) => (
            <div key={ride.id} className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className={`badge badge-${ride.status}`}>
                  {ride.status}
                </span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
                  ₹{Math.round(ride.pricePerSeat)} <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--text-muted)' }}>/ seat</span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>
                  {ride.source} → {ride.destination}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={14} color="var(--primary)" /> {ride.departureDate}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={14} color="var(--primary)" /> {ride.departureTime?.substring(0, 5)}
                  </span>
                </div>
              </div>

              {/* Seat Details Box */}
              <div style={{ background: 'var(--bg-main)', padding: '12px 16px', borderRadius: 'var(--radius-md)', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', textAlign: 'center', fontSize: '0.85rem' }}>
                <div>
                  <div style={{ color: 'var(--text-muted)' }}>Total</div>
                  <strong style={{ fontSize: '1.05rem' }}>{ride.totalSeats}</strong>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)' }}>Booked</div>
                  <strong style={{ fontSize: '1.05rem', color: '#2563eb' }}>{ride.bookedSeats}</strong>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)' }}>Available</div>
                  <strong style={{ fontSize: '1.05rem', color: '#10b981' }}>{ride.availableSeats}</strong>
                </div>
              </div>

              {/* Actions Footer */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', paddingTop: '8px', borderTop: '1px solid var(--border-light)' }}>
                <Link to={`/driver/rides/${ride.id}`} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                  <Eye size={14} /> View
                </Link>
                <Link to={`/driver/rides/${ride.id}/passengers`} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                  <Users size={14} /> Passengers ({ride.passengerCount || 0})
                </Link>
                {ride.status === 'ACTIVE' && (
                  <>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => openEditModal(ride)}
                      title="Edit Ride"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => setCancelModalRide(ride)}
                      title="Cancel Ride"
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '60px 24px' }}>
          <Car size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>No rides offered yet</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Publish your empty seats to start earning on trips you are already taking.
          </p>
          <Link to="/driver/offer-ride" className="btn btn-primary">
            <PlusCircle size={16} /> Offer a Ride Now
          </Link>
        </div>
      )}
    </div>
  );
};
