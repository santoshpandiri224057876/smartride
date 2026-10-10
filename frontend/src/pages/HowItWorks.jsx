import React from 'react';
import { Link } from 'react-router-dom';
import { Search, UserCheck, ShieldCheck, Car, DollarSign, CheckCircle2, ArrowRight } from 'lucide-react';

export const HowItWorks = () => {
  return (
    <div className="container" style={{ padding: '48px 24px', maxWidth: '960px' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>How SmartRide Works</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', maxWidth: '640px', margin: '0 auto' }}>
          Carpooling is simple, safe, and transparent. Here is everything you need to know as a passenger or driver.
        </p>
      </div>

      {/* For Passengers */}
      <div className="card" style={{ padding: '36px', marginBottom: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div className="brand-icon" style={{ width: '40px', height: '40px' }}>
            <Search size={20} />
          </div>
          <h2 style={{ fontSize: '1.6rem' }}>For Passengers: 4 Easy Steps</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
              1
            </div>
            <div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Search for Your Journey</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.5 }}>
                Enter where you are leaving from, your destination city, and preferred travel date. Browse through scheduled trips posted by verified drivers.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
              2
            </div>
            <div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Inspect Driver & Vehicle Details</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.5 }}>
                View driver reviews, license verification status, vehicle model, luggage policies, and exact departure times before deciding.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
              3
            </div>
            <div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Book Your Seats Instantly</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.5 }}>
                Choose the number of seats you need and lock in your reservation with immediate confirmation and driver contact details.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
              4
            </div>
            <div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Travel & Save Together</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.5 }}>
                Meet at the agreed pick-up spot, enjoy a smooth ride, and save money compared to high rail tickets or rental cars.
              </p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '28px' }}>
          <Link to="/find-rides" className="btn btn-primary">
            Find a Ride Now <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* For Drivers */}
      <div className="card" style={{ padding: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div className="brand-icon" style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #10b981, #059669)' }}>
            <Car size={20} />
          </div>
          <h2 style={{ fontSize: '1.6rem' }}>For Drivers: Drive & Earn</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#10b981', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
              1
            </div>
            <div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Register & Submit Driver Verification</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.5 }}>
                Submit your driving license and vehicle registration. Our administrative team reviews your credentials to keep our network secure.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#10b981', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
              2
            </div>
            <div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Publish Your Ride Itinerary</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.5 }}>
                Input your starting city, destination, departure date/time, available seats, and fair price per seat in Indian Rupees (₹).
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#10b981', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
              3
            </div>
            <div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Welcome Passengers & Offset Fuel Expenses</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.5 }}>
                As travelers reserve seats, check your passenger list, view earnings, and enjoy good company along the highway.
              </p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '28px' }}>
          <Link to="/become-driver" className="btn btn-secondary">
            Apply to Become a Driver <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};
