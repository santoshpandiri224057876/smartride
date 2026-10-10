import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { driverService } from '../../services/api';
import {
  Car,
  CheckCircle,
  Users,
  DollarSign,
  PlusCircle,
  History,
  ArrowRight,
  Calendar,
  Clock,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export const DriverDashboard = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await driverService.getDashboard();
        setDashboard(res.data.data);
      } catch (err) {
        setError('Failed to load driver dashboard metrics.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading driver statistics...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>Welcome, Driver</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Overview of your active routes, scheduled passengers, and platform revenue.
          </p>
        </div>

        <Link to="/driver/offer-ride" className="btn btn-primary">
          <PlusCircle size={18} /> Offer New Ride
        </Link>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <Car size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{dashboard?.activeRides || 0}</div>
            <div className="stat-label">Active Rides</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <CheckCircle size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{dashboard?.completedRides || 0}</div>
            <div className="stat-label">Completed Rides</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{dashboard?.totalPassengers || 0}</div>
            <div className="stat-label">Total Passengers</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon yellow" style={{ fontWeight: 800, fontSize: '1.4rem' }}>
            ₹
          </div>
          <div className="stat-info">
            <div className="stat-value">₹{Math.round(dashboard?.totalEarnings || 0)}</div>
            <div className="stat-label">Total Earnings</div>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Quick Actions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
          <Link to="/driver/offer-ride" className="btn btn-primary">
            <PlusCircle size={16} /> Offer New Ride
          </Link>
          <Link to="/driver/rides" className="btn btn-secondary">
            <Car size={16} /> My Active Rides
          </Link>
          <Link to="/driver/history" className="btn btn-secondary">
            <History size={16} /> Ride History
          </Link>
          <Link to="/driver/earnings" className="btn btn-secondary">
            <span style={{ fontWeight: 700 }}>₹</span> Earnings
          </Link>
        </div>
      </div>

      {/* Recent Rides */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.25rem' }}>Recent & Upcoming Rides</h3>
          <Link to="/driver/rides" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>
            View all rides →
          </Link>
        </div>

        {dashboard?.recentRides && dashboard.recentRides.length > 0 ? (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Route</th>
                  <th>Departure Date</th>
                  <th>Time</th>
                  <th>Seats</th>
                  <th>Price (₹)</th>
                  <th>Passengers</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.recentRides.map((ride) => (
                  <tr key={ride.id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{ride.source} → {ride.destination}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{ride.vehicleName}</div>
                    </td>
                    <td>{ride.departureDate}</td>
                    <td>{ride.departureTime?.substring(0, 5)}</td>
                    <td>
                      <strong>{ride.availableSeats}</strong> avail / {ride.totalSeats}
                    </td>
                    <td>₹{Math.round(ride.pricePerSeat)}</td>
                    <td>
                      <span className="badge badge-secondary">
                        <Users size={12} /> {ride.passengerCount || 0}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${ride.status}`}>
                        {ride.status}
                      </span>
                    </td>
                    <td>
                      <Link to={`/driver/rides/${ride.id}`} className="btn btn-secondary btn-sm">
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '36px' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>You haven't scheduled any trips yet.</p>
            <Link to="/driver/offer-ride" className="btn btn-primary">
              <PlusCircle size={16} /> Publish Your First Ride
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
