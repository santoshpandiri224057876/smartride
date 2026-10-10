import React from 'react';
import { Link } from 'react-router-dom';
import { Car, ShieldCheck, Heart, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <div className="brand-logo" style={{ color: '#ffffff', marginBottom: '16px' }}>
              <div className="brand-icon">
                <Car size={22} />
              </div>
              <span>SmartRide</span>
            </div>
            <p style={{ maxWidth: '320px', lineHeight: 1.6, fontSize: '0.9rem' }}>
              SmartRide connects drivers with empty seats to passengers traveling along the same route. Share rides, save money, and reduce carbon emissions together.
            </p>
          </div>

          <div className="footer-col">
            <h4>For Passengers</h4>
            <ul className="footer-links">
              <li><Link to="/find-rides">Find a Ride</Link></li>
              <li><Link to="/how-it-works">How SmartRide Works</Link></li>
              <li><Link to="/my-bookings">My Bookings</Link></li>
              <li><Link to="/about">Safety Guidelines</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>For Drivers</h4>
            <ul className="footer-links">
              <li><Link to="/become-driver">Become a Driver</Link></li>
              <li><Link to="/driver/offer-ride">Offer a Ride</Link></li>
              <li><Link to="/driver/earnings">Driver Earnings</Link></li>
              <li><Link to="/how-it-works">Driver Verification</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <ul className="footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/how-it-works">Trust & Safety</Link></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} SmartRide India. All rights reserved. Dedicated inter-city carpooling across Indian highways.</p>
        </div>
      </div>
    </footer>
  );
};
