import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SearchBox } from '../components/SearchBox';
import { RideCard } from '../components/RideCard';
import { rideService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Car,
  ShieldCheck,
  Search,
  DollarSign,
  Leaf,
  Users,
  Clock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Navigation
} from 'lucide-react';

export const Home = () => {
  const { user, isApprovedDriver, switchMode } = useAuth();
  const navigate = useNavigate();
  const [featuredRides, setFeaturedRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedRides = async () => {
      try {
        const res = await rideService.searchRides({ seats: 1 });
        setFeaturedRides(res.data.data.slice(0, 3));
      } catch (err) {
        console.error('Failed to load featured rides', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedRides();
  }, []);

  const handleSelectMode = (mode) => {
    switchMode(mode);
    if (mode === 'DRIVER') {
      navigate('/driver/dashboard');
    } else {
      navigate('/find-rides');
    }
  };

  return (
    <div>
      {/* Post-login mode selection banner if user is logged in */}
      {user && (
        <div style={{ background: '#1e293b', color: '#ffffff', padding: '16px 0', borderBottom: '1px solid #334155' }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Sparkles size={20} color="#60a5fa" />
              <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                How do you want to use SmartRide today, {user.name.split(' ')[0]}?
              </span>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => handleSelectMode('PASSENGER')}
              >
                <Search size={14} /> Find a Ride
              </button>

              {isApprovedDriver ? (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleSelectMode('DRIVER')}
                >
                  <Navigation size={14} /> Driver Mode
                </button>
              ) : (
                <Link to="/become-driver" className="btn btn-secondary btn-sm">
                  <Car size={14} /> Drive & Earn
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-tagline">
            <ShieldCheck size={16} /> India's Trusted Intercity Carpooling & Ride Sharing Platform
          </div>

          <h1 className="hero-title">
            Share your journey. Save money. Travel smarter across India.
          </h1>

          <p className="hero-subtitle">
            Find affordable rides or share your empty car seats with people travelling your way across Indian cities.
          </p>

          <SearchBox />
        </div>
      </section>

      {/* Section 1: How SmartRide Works */}
      <section className="section" style={{ background: '#ffffff' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How SmartRide Works</h2>
            <p className="section-desc">
              Carpooling made effortless in three simple and secure steps.
            </p>
          </div>

          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Search size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>1. Search or Offer</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Passengers enter departure and destination cities to find upcoming trips. Verified drivers post their available seats and itinerary in seconds.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Users size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>2. Book & Connect</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Choose your ride, view driver reviews and vehicle details, then instantly confirm your seat booking with direct contact details.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Leaf size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>3. Travel & Save</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Meet at the agreed pick-up spot, enjoy a comfortable trip together, split the travel costs, and leave feedback for your companion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Rides from MySQL */}
      <section className="section" style={{ background: 'var(--bg-main)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
            <div>
              <h2 className="section-title" style={{ marginBottom: '6px' }}>Popular Upcoming Rides</h2>
              <p className="section-desc">Real rides offered by approved drivers across top routes.</p>
            </div>

            <Link to="/find-rides" className="btn btn-outline-primary">
              View All Rides <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="loading-screen" style={{ minHeight: '200px' }}>
              <div className="spinner"></div>
            </div>
          ) : featuredRides.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
              {featuredRides.map((ride) => (
                <RideCard key={ride.id} ride={ride} />
              ))}
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
              <p style={{ color: 'var(--text-muted)' }}>No scheduled rides right now. Be the first to offer one!</p>
            </div>
          )}
        </div>
      </section>

      {/* Section 2 & 3: Find Affordable Rides & Share Your Ride */}
      <section className="section" style={{ background: '#ffffff' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '32px' }}>
            {/* Find Affordable Rides */}
            <div className="card" style={{ padding: '36px', borderTop: '4px solid #2563eb' }}>
              <span className="badge badge-primary" style={{ marginBottom: '16px', background: '#eff6ff', color: '#2563eb' }}>
                For Passengers
              </span>
              <h3 style={{ fontSize: '1.6rem', marginBottom: '14px' }}>Find Affordable Rides</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
                Say goodbye to crowded bus terminals and expensive train tickets. Travel comfortably door-to-city with trusted drivers who are already traveling your route.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
                  <CheckCircle2 size={18} color="#10b981" /> Up to 70% cheaper than trains and regional flights
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
                  <CheckCircle2 size={18} color="#10b981" /> Transparent fixed pricing with zero hidden surcharges
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
                  <CheckCircle2 size={18} color="#10b981" /> Instant seat reservations and convenient pick-up points
                </li>
              </ul>
              <Link to="/find-rides" className="btn btn-primary">
                Search Rides Now <ArrowRight size={16} />
              </Link>
            </div>

            {/* Share Your Ride */}
            <div className="card" style={{ padding: '36px', borderTop: '4px solid #10b981' }}>
              <span className="badge badge-success" style={{ marginBottom: '16px' }}>
                For Drivers
              </span>
              <h3 style={{ fontSize: '1.6rem', marginBottom: '14px' }}>Share Your Ride & Earn</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
                Driving somewhere with empty seats? Share your trip, meet interesting travelers, and recover up to 100% of your fuel and highway toll expenses.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
                  <CheckCircle2 size={18} color="#10b981" /> Offset soaring gas and car maintenance costs
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
                  <CheckCircle2 size={18} color="#10b981" /> Set your own schedule, departure times, and prices
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
                  <CheckCircle2 size={18} color="#10b981" /> Full control over who joins your vehicle
                </li>
              </ul>
              <Link to="/become-driver" className="btn btn-secondary">
                Become a Driver Today <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Safe and Verified Drivers */}
      <section className="section" style={{ background: '#f8fafc', borderTop: '1px solid var(--border-light)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Safe and Verified Drivers</h2>
            <p className="section-desc">
              Your safety and peace of mind are our highest priorities.
            </p>
          </div>

          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper" style={{ background: '#ecfdf5', color: '#10b981' }}>
                <ShieldCheck size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Manual Admin Verification</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Every driver application is reviewed by our administration team. Government driving licenses and vehicle registration records are validated before any ride can be published.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper" style={{ background: '#eff6ff', color: '#2563eb' }}>
                <Users size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Real Community Ratings</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Authentic peer reviews from fellow travelers let you know your driver's punctuality, car cleanliness, and driving habits before you confirm.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper" style={{ background: '#fffbeb', color: '#f59e0b' }}>
                <Car size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Roadworthy Vehicle Standards</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Drivers register vehicle specifications, color, model, and seat caps. You always know exactly what car will pick you up.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Why Choose SmartRide */}
      <section className="section" style={{ background: '#ffffff', borderTop: '1px solid var(--border-light)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose SmartRide</h2>
            <p className="section-desc">
              The premier carpooling network designed for reliability and shared savings.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            <div className="card">
              <DollarSign size={32} color="#2563eb" style={{ marginBottom: '14px' }} />
              <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Unbeatable Cost Savings</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Split travel expenses fairly with drivers who are already traveling on the same highway.
              </p>
            </div>

            <div className="card">
              <Leaf size={32} color="#10b981" style={{ marginBottom: '14px' }} />
              <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Eco-Friendly Travel</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Fill empty seats to dramatically reduce single-occupancy vehicles on the road and lower CO2 emissions.
              </p>
            </div>

            <div className="card">
              <Clock size={32} color="#f59e0b" style={{ marginBottom: '14px' }} />
              <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Direct Route Convenience</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Avoid train interchanges and airport layovers. Connect directly with drivers going straight to your destination.
              </p>
            </div>

            <div className="card">
              <Users size={32} color="#8b5cf6" style={{ marginBottom: '14px' }} />
              <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Vibrant Travel Community</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Meet professionals, students, and adventurers traveling across regions safely and socially.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
