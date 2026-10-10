import React, { useState, useEffect } from 'react';
import { driverService } from '../../services/api';
import {
  DollarSign,
  TrendingUp,
  Calendar,
  CheckCircle,
  AlertCircle,
  Users
} from 'lucide-react';

export const DriverEarnings = () => {
  const [earningsData, setEarningsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const res = await driverService.getEarnings();
        setEarningsData(res.data.data);
      } catch (err) {
        setError('Failed to load earnings information.');
      } finally {
        setLoading(false);
      }
    };
    fetchEarnings();
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Calculating earnings...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '6px' }}>Driver Earnings</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Detailed record of your travel expense sharing and passenger seat fares.
        </p>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon green" style={{ fontWeight: 800, fontSize: '1.4rem' }}>
            ₹
          </div>
          <div className="stat-info">
            <div className="stat-value">₹{Math.round(earningsData?.totalEarnings || 0)}</div>
            <div className="stat-label">Total Lifetime Earnings</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue">
            <Calendar size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">₹{Math.round(earningsData?.thisMonthEarnings || 0)}</div>
            <div className="stat-label">This Month</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <TrendingUp size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">₹{Math.round(earningsData?.thisWeekEarnings || 0)}</div>
            <div className="stat-label">This Week</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon yellow">
            <CheckCircle size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{earningsData?.completedRides || 0}</div>
            <div className="stat-label">Completed Rides</div>
          </div>
        </div>
      </div>

      {/* Earnings History Table */}
      <div className="card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Earnings Breakdown by Trip</h3>

        {earningsData?.earningsHistory && earningsData.earningsHistory.length > 0 ? (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Trip Route</th>
                  <th>Date</th>
                  <th>Passengers</th>
                  <th>Seats Sold</th>
                  <th>Gross Amount</th>
                  <th>Ride Status</th>
                </tr>
              </thead>
              <tbody>
                {earningsData.earningsHistory.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{item.source} → {item.destination}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ride ID: #{item.rideId}</div>
                    </td>
                    <td>{item.date}</td>
                    <td>
                      <span className="badge badge-secondary">
                        <Users size={12} /> {item.passengerCount} passengers
                      </span>
                    </td>
                    <td><strong>{item.seatsSold}</strong> seats</td>
                    <td>
                      <strong style={{ color: '#10b981', fontSize: '1.1rem' }}>
                        +₹{Math.round(item.amount || 0)}
                      </strong>
                    </td>
                    <td>
                      <span className={`badge badge-${item.status}`}>{item.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '48px 24px' }}>
            <DollarSign size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>No earnings recorded yet</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Publish rides and as passengers confirm their seats, your earnings will accrue here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
