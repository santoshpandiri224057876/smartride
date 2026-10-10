import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/api';
import {
  Users,
  ShieldCheck,
  Clock,
  Car,
  BookCheck,
  DollarSign,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowRight
} from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      const res = await adminService.getDashboardStats();
      setStats(res.data.data);
    } catch (err) {
      setError('Failed to fetch administrator statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleApprove = async (driverId) => {
    setActionLoading(driverId);
    setError('');
    setMessage('');
    try {
      await adminService.approveDriver(driverId);
      setMessage(`Driver #${driverId} has been successfully approved.`);
      await fetchStats();
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
      await fetchStats();
    } catch (err) {
      setError('Failed to reject driver.');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Gathering platform metrics...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '6px' }}>Platform Administration</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          High-level overview of users, verification pipelines, active journeys, and platform volume.
        </p>
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

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats?.totalUsers || 0}</div>
            <div className="stat-label">Total Users</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon yellow">
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats?.pendingDrivers || 0}</div>
            <div className="stat-label">Pending Drivers</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <ShieldCheck size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats?.approvedDrivers || 0}</div>
            <div className="stat-label">Approved Drivers</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <Car size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats?.activeRides || 0}</div>
            <div className="stat-label">Active Rides</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <BookCheck size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats?.totalBookings || 0}</div>
            <div className="stat-label">Total Bookings</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue" style={{ fontWeight: 800, fontSize: '1.4rem' }}>
            ₹
          </div>
          <div className="stat-info">
            <div className="stat-value">₹{Math.round(stats?.totalPlatformVolume || 0)}</div>
            <div className="stat-label">Gross Platform Volume</div>
          </div>
        </div>
      </div>

      {/* Pending Applications Queue */}
      <div className="card" style={{ padding: '24px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem' }}>Pending Driver Verifications</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Drivers awaiting license and vehicle background verification before publishing rides.
            </p>
          </div>
          <Link to="/admin/drivers" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>
            All Drivers ({stats?.totalDrivers}) →
          </Link>
        </div>

        {stats?.pendingApplications && stats.pendingApplications.length > 0 ? (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Driver Name</th>
                  <th>Contact</th>
                  <th>License Number</th>
                  <th>Expiry</th>
                  <th>Vehicle Details</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stats.pendingApplications.map((d) => (
                  <tr key={d.id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{d.userName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID: #{d.id}</div>
                    </td>
                    <td>
                      <div>{d.userEmail}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{d.userPhone}</div>
                    </td>
                    <td><code>{d.licenseNumber}</code></td>
                    <td>{d.licenseExpiry}</td>
                    <td>
                      <div>{d.vehicleMake} {d.vehicleModel} ({d.vehicleColor})</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Plate: {d.vehicleNumber} • {d.fuelType ? d.fuelType + ' • ' : ''}{d.totalSeats} seats
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          style={{ background: '#10b981', borderColor: '#10b981' }}
                          onClick={() => handleApprove(d.id)}
                          disabled={actionLoading === d.id}
                        >
                          <CheckCircle size={14} /> Approve
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleReject(d.id)}
                          disabled={actionLoading === d.id}
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '36px' }}>
            <CheckCircle size={40} color="#10b981" style={{ margin: '0 auto 12px' }} />
            <p style={{ color: 'var(--text-secondary)' }}>All driver verification queues are currently cleared.</p>
          </div>
        )}
      </div>

      {/* Recent Bookings Queue */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.25rem' }}>Recent Platform Bookings</h3>
          <Link to="/admin/bookings" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>
            View all bookings →
          </Link>
        </div>

        {stats?.recentBookings && stats.recentBookings.length > 0 ? (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Passenger</th>
                  <th>Driver</th>
                  <th>Route</th>
                  <th>Seats</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentBookings.map((b) => (
                  <tr key={b.id}>
                    <td>#{b.id}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{b.passengerName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{b.passengerEmail}</div>
                    </td>
                    <td>{b.driverName}</td>
                    <td><strong>{b.source} → {b.destination}</strong></td>
                    <td>{b.seatsBooked} seats</td>
                    <td><strong>₹{Math.round(b.totalPrice)}</strong></td>
                    <td>
                      <span className={`badge badge-${b.bookingStatus}`}>{b.bookingStatus}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px' }}>No bookings recorded yet.</p>
        )}
      </div>
    </div>
  );
};
