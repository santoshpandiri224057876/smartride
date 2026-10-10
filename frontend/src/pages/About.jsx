import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Leaf, Heart, Users, Award, MapPin } from 'lucide-react';

export const About = () => {
  return (
    <div className="container" style={{ padding: '48px 24px', maxWidth: '960px' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <span className="hero-tagline">
          <Award size={16} /> Our Mission & Vision
        </span>
        <h1 style={{ fontSize: '2.5rem', marginTop: '12px', marginBottom: '16px' }}>
          About SmartRide
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', lineHeight: 1.6, maxWidth: '680px', margin: '0 auto' }}>
          SmartRide is India's dedicated inter-city carpooling community—connecting travelers across states like Telangana, Andhra Pradesh, Karnataka, Maharashtra, Tamil Nadu, and Delhi NCR for economical, eco-friendly journeys.
        </p>
      </div>

      <div className="card" style={{ padding: '36px', marginBottom: '36px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Why We Built SmartRide for India</h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '16px' }}>
          Every day, millions of passenger vehicles travel along Indian expressways and national highways with 3 or 4 vacant seats. Meanwhile, train waitlists stretch into hundreds and bus fares surge during weekends and festive seasons.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          Inspired by global carpooling platforms like BlaBlaCar, SmartRide bridges this divide with an India-first platform. Verified car owners traveling between cities share journeys, split petrol/diesel/CNG costs, and create comfortable travel for all.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '48px' }}>
        <div className="card" style={{ padding: '28px' }}>
          <div className="feature-icon-wrapper" style={{ background: '#ecfdf5', color: '#10b981' }}>
            <Leaf size={28} />
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Eco-Centric Travel</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.5 }}>
            By filling empty seats, our community actively reduces vehicular emissions, lowers highway gridlock, and fosters a greener future.
          </p>
        </div>

        <div className="card" style={{ padding: '28px' }}>
          <div className="feature-icon-wrapper" style={{ background: '#eff6ff', color: '#2563eb' }}>
            <ShieldCheck size={28} />
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Trust & Safety First</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.5 }}>
            All drivers undergo stringent license verification by our administrators. Verified profiles and peer reviews protect all travelers.
          </p>
        </div>

        <div className="card" style={{ padding: '28px' }}>
          <div className="feature-icon-wrapper" style={{ background: '#faf5ff', color: '#a855f7' }}>
            <Heart size={28} />
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Fair Cost Sharing</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.5 }}>
            No surge pricing and no predatory fees. SmartRide keeps travel affordable by focusing on strictly splitting true journey costs.
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: '36px', textAlign: 'center', background: 'var(--bg-subtle)' }}>
        <h3 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>Join the SmartRide Journey Today</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', maxWidth: '520px', margin: '0 auto 24px' }}>
          Whether you have seats to offer or need an affordable ride, SmartRide is your trusted companion.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link to="/find-rides" className="btn btn-primary">Find a Ride</Link>
          <Link to="/become-driver" className="btn btn-secondary">Become a Driver</Link>
        </div>
      </div>
    </div>
  );
};
