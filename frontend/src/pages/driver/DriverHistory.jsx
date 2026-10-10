import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { driverService } from '../../services/api';
import {
  History,
  Calendar,
  Clock,
  Car,
  Users,
  DollarSign,
  AlertCircle
} from 'lucide-react';

export const DriverHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await driverService.getHistory();
        setHistory(res.data.data);
      } catch (err) {
        setError('Failed to load ride history.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading past ride records...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '6px' }}>Trip History</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Record of all your completed journeys and cancelled rides.
        </p>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="card" style={{ padding: '24px' }}>
        {history.length > 0 ? (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Route</th>
                  <th>Date & Time</th>
                  <th>Vehicle</th>
                  <th>Total Seats</th>
                  <th>Passengers</th>
                  <th>Price/Seat</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((ride) => (
                  <tr key={ride.id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{ride.source} → {ride.destination}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ride ID: #{ride.id}</div>
                    </td>
                    <td>
                      <div>{ride.departureDate}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{ride.departureTime?.substring(0, 5)}</div>
                    </td>
                    <td>{ride.vehicleName}</td>
                    <td>{ride.totalSeats} seats</td>
                    <td>
                      <span className="badge badge-secondary">
                        <Users size={12} /> {ride.passengerCount || 0} passengers
                      </span>
                    </td>
                    <td>₹{Math.round(ride.pricePerSeat)}</td>
                    <td>
                      <span className={`badge badge-${ride.status}`}>
                        {ride.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '48px 24px' }}>
            <History size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>No historical trips yet</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Completed and past trips will be archived here for your records.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
