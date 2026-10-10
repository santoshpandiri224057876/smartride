import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  PlusCircle,
  Car,
  Users,
  History,
  DollarSign,
  UserCheck,
  ArrowLeftRight,
  LogOut,
  Navigation
} from 'lucide-react';

export const DriverSidebar = () => {
  const { user, switchMode, logout } = useAuth();
  const navigate = useNavigate();

  const handleSwitchToPassenger = () => {
    switchMode('PASSENGER');
    navigate('/dashboard');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <Navigation size={22} color="#3b82f6" />
          <span>SmartRide</span>
        </div>
        <span className="sidebar-badge driver">Driver</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/driver/dashboard"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/driver/offer-ride"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <PlusCircle size={18} />
          <span>Offer a Ride</span>
        </NavLink>

        <NavLink
          to="/driver/rides"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <Car size={18} />
          <span>My Active Rides</span>
        </NavLink>

        <NavLink
          to="/driver/history"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <History size={18} />
          <span>Ride History</span>
        </NavLink>

        <NavLink
          to="/driver/earnings"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <DollarSign size={18} />
          <span>Earnings</span>
        </NavLink>

        <NavLink
          to="/driver/profile"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <UserCheck size={18} />
          <span>Driver Profile</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button
          type="button"
          className="nav-item"
          style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left' }}
          onClick={handleSwitchToPassenger}
        >
          <ArrowLeftRight size={18} />
          <span>Switch to Passenger Mode</span>
        </button>

        <button
          type="button"
          className="nav-item"
          style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', color: '#f87171' }}
          onClick={handleLogout}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
