import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  Eye,
  AlertCircle,
  Car,
  FileText,
  X,
  Filter
} from 'lucide-react';

export const AdminDrivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL'); // ALL, PENDING, APPROVED, REJECTED
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [viewDriver, setViewDriver] = useState(null); // driver object for details modal
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchDrivers = async () => {
    try {
      const res = await adminService.getDrivers();
      setDrivers(res.data.data);
    } catch (err) {
      setError('Failed to fetch driver registry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleApprove = async (driverId) => {
    setActionLoading(driverId);
    setError('');
    setMessage('');
    try {
      await adminService.approveDriver(driverId);
      setMessage(`Driver #${driverId} approved successfully.`);
      if (viewDriver?.id === driverId) {
        setViewDriver((prev) => ({ ...prev, verificationStatus: 'APPROVED' }));
      }
      await fetchDrivers();
    } catch (err) {
      setError('Failed to approve driver.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (driverId) => {
    setActionLoading(driverId);
    setError('');
    setMessage('');
    try {
      await adminService.rejectDriver(driverId);
      setMessage(`Driver #${driverId} application rejected.`);
      if (viewDriver?.id === driverId) {
        setViewDriver((prev) => ({ ...prev, verificationStatus: 'REJECTED' }));
      }
      await fetchDrivers();
    } catch (err) {
      setError('Failed to reject driver.');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredDrivers = drivers.filter((d) => {
    if (filterStatus === 'ALL') return true;
    return d.verificationStatus === filterStatus;
  });

  return (
    <div>
      {/* View Driver Details Modal */}
      {viewDriver && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.3rem' }}>Driver Application Details</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => setViewDriver(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div className="avatar-circle" style={{ width: '56px', height: '56px', fontSize: '1.4rem' }}>
                {viewDriver.userName ? viewDriver.userName.charAt(0).toUpperCase() : 'D'}
              </div>
              <div>
                <h4 style={{ fontSize: '1.2rem' }}>{viewDriver.userName}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{viewDriver.userEmail} • {viewDriver.userPhone}</p>
                <span className={`badge badge-${viewDriver.verificationStatus}`} style={{ marginTop: '4px' }}>
                  {viewDriver.verificationStatus}
                </span>
              </div>
            </div>

            <div style={{ background: 'var(--bg-main)', padding: '18px', borderRadius: 'var(--radius-md)', marginBottom: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '0.9rem' }}>
              <div>
                <div style={{ color: 'var(--text-muted)' }}>License Number</div>
                <strong>{viewDriver.licenseNumber}</strong>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)' }}>License Expiry</div>
                <strong>{viewDriver.licenseExpiry}</strong>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)' }}>Vehicle Model</div>
                <strong>{viewDriver.vehicleMake} {viewDriver.vehicleModel}</strong>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)' }}>Type & Fuel</div>
                <strong>{viewDriver.vehicleType} ({viewDriver.fuelType || 'Petrol'})</strong>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)' }}>Color</div>
                <strong>{viewDriver.vehicleColor}</strong>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)' }}>Registration Plate</div>
                <strong>{viewDriver.vehicleNumber}</strong>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)' }}>Passenger Capacity</div>
                <strong>{viewDriver.totalSeats} seats</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              {viewDriver.verificationStatus !== 'APPROVED' && (
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ background: '#10b981', borderColor: '#10b981' }}
                  onClick={() => handleApprove(viewDriver.id)}
                  disabled={actionLoading === viewDriver.id}
                >
                  <CheckCircle size={16} /> Approve Driver
                </button>
              )}
              {viewDriver.verificationStatus !== 'REJECTED' && (
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => handleReject(viewDriver.id)}
                  disabled={actionLoading === viewDriver.id}
                >
                  <XCircle size={16} /> Reject Application
                </button>
              )}
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setViewDriver(null)}
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
          <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>Driver Management</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Review, verify, and approve drivers eligible to offer rides.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mode-toggle-group">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((st) => (
            <button
              key={st}
              type="button"
              className={`mode-btn ${filterStatus === st ? 'active' : ''}`}
              onClick={() => setFilterStatus(st)}
            >
              {st}
            </button>
          ))}
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
            <p>Loading drivers...</p>
          </div>
        ) : filteredDrivers.length > 0 ? (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Driver Name</th>
                  <th>Contact Email & Phone</th>
                  <th>License Info</th>
                  <th>Vehicle Info</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDrivers.map((d) => (
                  <tr key={d.id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{d.userName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Driver #{d.id} • User #{d.userId}</div>
                    </td>
                    <td>
                      <div>{d.userEmail}</div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{d.userPhone}</div>
                    </td>
                    <td>
                      <div><code>{d.licenseNumber}</code></div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Exp: {d.licenseExpiry}</div>
                    </td>
                    <td>
                      <div>{d.vehicleMake} {d.vehicleModel}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {d.vehicleType} • {d.fuelType ? d.fuelType + ' • ' : ''}{d.vehicleNumber} ({d.totalSeats} seats)
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${d.verificationStatus}`}>
                        {d.verificationStatus}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => setViewDriver(d)}
                          title="View Details"
                        >
                          <Eye size={14} /> View
                        </button>
                        {d.verificationStatus !== 'APPROVED' && (
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            style={{ background: '#10b981', borderColor: '#10b981' }}
                            onClick={() => handleApprove(d.id)}
                            disabled={actionLoading === d.id}
                            title="Approve Driver"
                          >
                            <CheckCircle size={14} /> Approve
                          </button>
                        )}
                        {d.verificationStatus !== 'REJECTED' && (
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleReject(d.id)}
                            disabled={actionLoading === d.id}
                            title="Reject Application"
                          >
                            <XCircle size={14} /> Reject
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
            <p style={{ color: 'var(--text-muted)' }}>No drivers found for status "{filterStatus}".</p>
          </div>
        )}
      </div>
    </div>
  );
};
