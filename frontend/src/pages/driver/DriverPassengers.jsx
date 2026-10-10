import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { driverService } from '../../services/api';
import {
  Users,
  ArrowLeft,
  Calendar,
  Phone,
  Mail,
  Car,
  AlertCircle
} from 'lucide-react';

export const DriverPassengers = () => {
  const { id } = useParams();
  const [passengers, setPassengers] = useState([]);
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [passRes, rideRes] = await Promise.all([
          driverService.getRidePassengers(id),
          driverService.getRideById(id),
        ]);
        setPassengers(passRes.data.data);
        setRide(rideRes.data.data);
      } catch (err) {
        setError('Failed to load passenger list.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading passengers...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Link to={`/driver/rides/${id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Back to Trip Details
        </Link>
      </div>

      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '6px' }}>
          Passenger Manifest
        </h1>
        {ride && (
          <p style={{ color: 'var(--text-secondary)' }}>
            Passengers for <strong>{ride.source} → {ride.destination}</strong> on <strong>{ride.departureDate}</strong> at {ride.departureTime?.substring(0, 5)}
          </p>
        )}
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="card" style={{ padding: '24px' }}>
        {passengers.length > 0 ? (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Passenger Name</th>
                  <th>Contact Phone</th>
                  <th>Email</th>
                  <th>Seats Booked</th>
                  <th>Amount</th>
                  <th>Booking Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {passengers.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{p.passengerName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Passenger ID: #{p.passengerId}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Phone size={14} color="var(--primary)" />
                        <strong>{p.passengerPhone || 'N/A'}</strong>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                        <Mail size={14} />
                        {p.passengerEmail}
                      </div>
                    </td>
                    <td>
                      <strong>{p.seatsBooked}</strong> {p.seatsBooked === 1 ? 'seat' : 'seats'}
                    </td>
                    <td>
                      <strong style={{ color: 'var(--primary)' }}>₹{Math.round(p.totalPrice)}</strong>
                    </td>
                    <td>{p.bookedAt ? p.bookedAt.substring(0, 10) : 'Recent'}</td>
                    <td>
                      <span className={`badge badge-${p.bookingStatus}`}>{p.bookingStatus}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '48px 24px' }}>
            <Users size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>No passengers booked yet</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              When travelers book a seat on your ride, their names and contact details will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
