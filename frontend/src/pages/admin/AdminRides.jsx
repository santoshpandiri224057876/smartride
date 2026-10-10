import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import {
  Car,
  Search,
  Calendar,
  Clock,
  Trash2,
  AlertCircle,
  CheckCircle,
  Eye,
  X
} from 'lucide-react';

export const AdminRides = () => {
  const [rides, setRides] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null); // ride to delete
  const [viewRide, setViewRide] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchRides = async () => {
    try {
      const res = await adminService.getRides();
      setRides(res.data.data);
    } catch (err) {
      setError('Failed to fetch platform rides.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);

  const handleDeleteRide = async () => {
    if (!deleteModal) return;
    setActionLoading(deleteModal.id);
    setError('');
    setMessage('');
    try {
      await adminService.deleteRide(deleteModal.id);
      setMessage(`Ride #${deleteModal.id} was removed/cancelled by administrator.`);
      setDeleteModal(null);
      await fetchRides();
    } catch (err) {
      setError('Failed to cancel ride.');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredRides = rides.filter((r) => {
    const q = searchTerm.toLowerCase();
    return (
      r.source?.toLowerCase().includes(q) ||
      r.destination?.toLowerCase().includes(q) ||
      r.driverName?.toLowerCase().includes(q) ||
      r.vehicleName?.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.3rem', marginBottom: '12px' }}>Admin Cancellation</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.5 }}>
              Are you sure you want to cancel and deactivate the ride from <strong>{deleteModal.source} to {deleteModal.destination}</strong> (Driver: {deleteModal.driverName})?
              All booked passengers will have their reservations marked as cancelled.
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setDeleteModal(null)}
                disabled={actionLoading}
              >
                Keep Ride
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDeleteRide}
                disabled={actionLoading}
              >
                {actionLoading ? 'Cancelling...' : 'Cancel Ride'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {viewRide && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '580px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.3rem' }}>Ride #{viewRide.id} Details</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => setViewRide(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                {viewRide.source} → {viewRide.destination}
              </div>
              <span className={`badge badge-${viewRide.status}`} style={{ marginTop: '6px' }}>
                {viewRide.status}
              </span>
            </div>

            <div style={{ background: 'var(--bg-main)', padding: '16px', borderRadius: 'var(--radius-md)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '0.9rem', marginBottom: '20px' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Driver:</span>
                <div><strong>{viewRide.driverName}</strong></div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Driver Phone:</span>
                <div>{viewRide.driverPhone || 'N/A'}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Departure:</span>
                <div>{viewRide.departureDate} at {viewRide.departureTime?.substring(0, 5)}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Seats:</span>
                <div>{viewRide.availableSeats} available / {viewRide.totalSeats} total</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Fare Per Seat:</span>
                <div><strong>₹{Math.round(viewRide.pricePerSeat)}</strong></div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Vehicle:</span>
                <div>{viewRide.vehicleName}</div>
              </div>
            </div>

            {viewRide.description && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '4px' }}>Description / Notes:</div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{viewRide.description}</p>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setViewRide(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>Ride Management</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Monitor and moderate all scheduled rides offered across the platform.
          </p>
        </div>

        <div className="search-input-field" style={{ width: '320px', background: '#ffffff' }}>
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search by city, driver, or vehicle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
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

      <div className="card" style={{ padding: '24px' }}>
        {loading ? (
          <div className="loading-screen" style={{ minHeight: '220px' }}>
            <div className="spinner"></div>
            <p>Loading platform rides...</p>
          </div>
        ) : filteredRides.length > 0 ? (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Ride ID</th>
                  <th>Driver</th>
                  <th>Route</th>
                  <th>Date & Time</th>
                  <th>Seats</th>
                  <th>Price/Seat (₹)</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRides.map((r) => (
                  <tr key={r.id}>
                    <td>#{r.id}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{r.driverName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{r.vehicleName}</div>
                    </td>
                    <td>
                      <strong>{r.source} → {r.destination}</strong>
                    </td>
                    <td>
                      <div>{r.departureDate}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{r.departureTime?.substring(0, 5)}</div>
                    </td>
                    <td>
                      {r.availableSeats} avail / {r.totalSeats}
                    </td>
                    <td>
                      <strong>₹{Math.round(r.pricePerSeat)}</strong>
                    </td>
                    <td>
                      <span className={`badge badge-${r.status}`}>{r.status}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => setViewRide(r)}
                        >
                          <Eye size={14} /> View
                        </button>
                        {r.status === 'ACTIVE' && (
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => setDeleteModal(r)}
                            title="Cancel / Remove Ride"
                          >
                            <Trash2 size={14} />
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
          <div style={{ textAlign: 'center', padding: '40px 24px' }}>
            <p style={{ color: 'var(--text-muted)' }}>No rides found matching "{searchTerm}".</p>
          </div>
        )}
      </div>
    </div>
  );
};
