import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/api';
import {
  Search,
  Calendar,
  CheckCircle,
  Clock,
  Car,
  Briefcase,
  ArrowRight,
  MapPin,
  Users,
  AlertCircle
} from 'lucide-react';

export const PassengerDashboard = () => {
  const { user, isApprovedDriver, switchMode } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await bookingService.getMyBookings();
        setBookings(res.data.data);
      } catch (err) {
        console.error('Failed to load passenger bookings', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const upcomingBookings = bookings.filter(
    (b) => b.bookingStatus === 'CONFIRMED' || b.bookingStatus === 'PENDING'
  );
  const completedBookings = bookings.filter((b) => b.bookingStatus === 'COMPLETED');
  const cancelledBookings = bookings.filter((b) => b.bookingStatus === 'CANCELLED');

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Passenger Portal
          </span>
          <h1 style={{ fontSize: '2.2rem', marginTop: '4px' }}>
            Welcome, {user?.name}
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/find-rides" className="btn btn-primary">
            <Search size={16} /> Find a Ride
          </Link>
          <Link to="/my-bookings" className="btn btn-secondary">
            <Briefcase size={16} /> My Bookings
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{upcomingBookings.length}</div>
            <div className="stat-label">Upcoming Bookings</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <CheckCircle size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{completedBookings.length}</div>
            <div className="stat-label">Completed Trips</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <Car size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{bookings.length}</div>
            <div className="stat-label">Total Bookings</div>
          </div>
        </div>
      </div>

      {/* Quick Action Banner */}
      <div className="card" style={{ padding: '24px', marginBottom: '36px', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h3 style={{ color: '#ffffff', fontSize: '1.3rem', marginBottom: '6px' }}>
            {isApprovedDriver ? 'Switch to Driver Mode' : 'Want to drive and earn on your trips?'}
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.92rem', maxWidth: '600px' }}>
            {isApprovedDriver
              ? 'You are an approved SmartRide driver. Post seats, manage passengers, and track your revenue.'
              : 'Share empty seats in your car, offset highway tolls and fuel expenses, and travel with verified companions.'}
          </p>
        </div>

        <div>
          {isApprovedDriver ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                switchMode('DRIVER');
                navigate('/driver/dashboard');
              }}
            >
              Go to Driver Dashboard <ArrowRight size={16} />
            </button>
          ) : (
            <Link to="/become-driver" className="btn btn-primary">
              Become a Driver <ArrowRight size={16} />
            </Link>
          )}
        </div>
      </div>

      {/* Upcoming Trips List */}
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2>Upcoming & Active Trips</h2>
        <Link to="/my-bookings" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.92rem' }}>
          View all bookings →
        </Link>
      </div>

      {loading ? (
        <div className="loading-screen" style={{ minHeight: '180px' }}>
          <div className="spinner"></div>
        </div>
      ) : upcomingBookings.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {upcomingBookings.map((b) => (
            <div key={b.id} className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Car size={24} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                      {b.source} → {b.destination}
                    </span>
                    <span className={`badge badge-${b.bookingStatus}`}>
                      {b.bookingStatus}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    <span>Date: <strong>{b.departureDate}</strong></span>
                    <span>Time: <strong>{b.departureTime?.substring(0, 5)}</strong></span>
                    <span>Driver: <strong>{b.driverName}</strong></span>
                    <span>Seats: <strong>{b.seatsBooked}</strong></span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
                    ₹{Math.round(b.totalPrice)}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>total fare</div>
                </div>

                <Link to={`/ride/${b.rideId}`} className="btn btn-secondary btn-sm">
                  View Ride
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <AlertCircle size={40} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>No active bookings yet</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', maxWidth: '420px', margin: '0 auto 20px' }}>
            Ready to travel? Search hundreds of rides with verified drivers traveling your way.
          </p>
          <Link to="/find-rides" className="btn btn-primary">
            <Search size={16} /> Search Available Rides
          </Link>
        </div>
      )}
    </div>
  );
};
