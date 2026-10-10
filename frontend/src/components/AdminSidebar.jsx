import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Car,
  BookCheck,
  ArrowLeftRight,
  LogOut,
  Shield
} from 'lucide-react';

export const AdminSidebar = () => {
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
          <Shield size={22} color="#ec4899" />
          <span>SmartRide</span>
        </div>
        <span className="sidebar-badge admin">Admin</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <Users size={18} />
          <span>User Management</span>
        </NavLink>

        <NavLink
          to="/admin/drivers"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <ShieldCheck size={18} />
          <span>Driver Approvals</span>
        </NavLink>

        <NavLink
          to="/admin/rides"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <Car size={18} />
          <span>Ride Management</span>
        </NavLink>

        <NavLink
          to="/admin/bookings"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <BookCheck size={18} />
          <span>Booking Records</span>
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
          <span>Passenger Mode</span>
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
