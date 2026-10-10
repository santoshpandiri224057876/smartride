import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Car,
  Search,
  PlusCircle,
  User,
  LogOut,
  Shield,
  Briefcase,
  ChevronDown,
  Navigation
} from 'lucide-react';

export const Navbar = () => {
  const { user, currentMode, switchMode, logout, isApprovedDriver, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
  };

  const handleModeSwitch = (mode) => {
    switchMode(mode);
    if (mode === 'DRIVER') {
      navigate('/driver/dashboard');
    } else if (mode === 'ADMIN') {
      navigate('/admin/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="brand-logo">
          <div className="brand-icon">
            <Car size={22} />
          </div>
          <span>SmartRide</span>
        </Link>

        <nav className="nav-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            Home
          </Link>
          <Link to="/find-rides" className={`nav-link ${isActive('/find-rides') ? 'active' : ''}`}>
            Find Ride
          </Link>
          {isApprovedDriver ? (
            <Link to="/driver/offer-ride" className={`nav-link ${isActive('/driver/offer-ride') ? 'active' : ''}`}>
              Offer Ride
            </Link>
          ) : (
            <Link to="/become-driver" className={`nav-link ${isActive('/become-driver') ? 'active' : ''}`}>
              Offer Ride
            </Link>
          )}
          <Link to="/how-it-works" className={`nav-link ${isActive('/how-it-works') ? 'active' : ''}`}>
            How It Works
          </Link>
          <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>
            About
          </Link>
        </nav>

        <div className="nav-auth">
          {user ? (
            <>
              {/* Mode Switcher */}
              <div className="mode-toggle-group">
                <button
                  type="button"
                  className={`mode-btn ${currentMode === 'PASSENGER' ? 'active' : ''}`}
                  onClick={() => handleModeSwitch('PASSENGER')}
                  title="Switch to Passenger Mode"
                >
                  <Search size={14} /> Passenger
                </button>

                {isApprovedDriver ? (
                  <button
                    type="button"
                    className={`mode-btn ${currentMode === 'DRIVER' ? 'active' : ''}`}
                    onClick={() => handleModeSwitch('DRIVER')}
                    title="Switch to Driver Mode"
                  >
                    <Navigation size={14} /> Driver
                  </button>
                ) : (
                  <Link to="/become-driver" className="mode-btn" title="Apply to become a driver">
                    <Briefcase size={14} /> Drive & Earn
                  </Link>
                )}

                {isAdmin && (
                  <button
                    type="button"
                    className={`mode-btn ${currentMode === 'ADMIN' ? 'active' : ''}`}
                    onClick={() => handleModeSwitch('ADMIN')}
                    title="Switch to Admin Mode"
                  >
                    <Shield size={14} /> Admin
                  </button>
                )}
              </div>

              {/* User Dropdown */}
              <div className="user-menu-wrapper">
                <button
                  type="button"
                  className="user-badge-btn"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <div className="avatar-circle">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown size={16} />
                </button>

                {dropdownOpen && (
                  <div className="user-dropdown" onClick={() => setDropdownOpen(false)}>
                    <div className="dropdown-user-info">
                      <div className="dropdown-user-name">{user.name}</div>
                      <div className="dropdown-user-email">{user.email}</div>
                      {user.role === 'ADMIN' && (
                        <span className="badge badge-admin" style={{ marginTop: '6px' }}>
                          Administrator
                        </span>
                      )}
                    </div>

                    <Link to="/dashboard" className="dropdown-item">
                      <Search size={16} /> Passenger Dashboard
                    </Link>
                    <Link to="/my-bookings" className="dropdown-item">
                      <Briefcase size={16} /> My Bookings
                    </Link>

                    {isApprovedDriver && (
                      <Link to="/driver/dashboard" className="dropdown-item">
                        <Navigation size={16} /> Driver Dashboard
                      </Link>
                    )}

                    {isAdmin && (
                      <Link to="/admin/dashboard" className="dropdown-item">
                        <Shield size={16} /> Admin Panel
                      </Link>
                    )}

                    <Link to="/profile" className="dropdown-item">
                      <User size={16} /> Profile
                    </Link>

                    <div
                      className="dropdown-item"
                      style={{ color: 'var(--danger)', borderTop: '1px solid var(--border-light)' }}
                      onClick={handleLogout}
                    >
                      <LogOut size={16} /> Logout
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
