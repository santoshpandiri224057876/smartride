import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import {
  BookCheck,
  Search,
  Calendar,
  DollarSign,
  AlertCircle
} from 'lucide-react';

export const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await adminService.getBookings();
        setBookings(res.data.data);
      } catch (err) {
        setError('Failed to fetch platform bookings.');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((b) => {
    const q = searchTerm.toLowerCase();
    return (
      b.passengerName?.toLowerCase().includes(q) ||
      b.passengerEmail?.toLowerCase().includes(q) ||
      b.driverName?.toLowerCase().includes(q) ||
      b.source?.toLowerCase().includes(q) ||
      b.destination?.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>Platform Bookings</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Complete audit trail of passenger reservations, seat counts, and payments.
          </p>
        </div>

        <div className="search-input-field" style={{ width: '320px', background: '#ffffff' }}>
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search passenger, driver, city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

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
            <p>Loading bookings ledger...</p>
          </div>
        ) : filteredBookings.length > 0 ? (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Passenger</th>
                  <th>Driver</th>
                  <th>Journey Route</th>
                  <th>Trip Date</th>
                  <th>Seats</th>
                  <th>Total Amount</th>
                  <th>Booked On</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((b) => (
                  <tr key={b.id}>
                    <td>#{b.id}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{b.passengerName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{b.passengerEmail}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{b.driverName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{b.driverPhone || 'N/A'}</div>
                    </td>
                    <td>
                      <strong>{b.source} → {b.destination}</strong>
                    </td>
                    <td>{b.departureDate}</td>
                    <td><strong>{b.seatsBooked}</strong> {b.seatsBooked === 1 ? 'seat' : 'seats'}</td>
                    <td>
                      <strong style={{ color: 'var(--primary)', fontSize: '1.05rem' }}>
                        ₹{Math.round(b.totalPrice)}
                      </strong>
                    </td>
                    <td>{b.bookedAt ? b.bookedAt.substring(0, 10) : 'Recent'}</td>
                    <td>
                      <span className={`badge badge-${b.bookingStatus}`}>{b.bookingStatus}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 24px' }}>
            <p style={{ color: 'var(--text-muted)' }}>No bookings found matching "{searchTerm}".</p>
          </div>
        )}
      </div>
    </div>
  );
};
