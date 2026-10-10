import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, Clock, XCircle, ArrowRight } from 'lucide-react';

export const DriverRoute = ({ children }) => {
  const { user, loading, isApprovedDriver, isPendingDriver, isRejectedDriver } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Verifying driver status...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (isPendingDriver) {
    return (
      <div className="driver-guard-page">
        <div className="driver-guard-card">
          <div className="guard-icon pending">
            <Clock size={48} />
          </div>
          <h2>Application Under Review</h2>
          <p className="guard-text">
            Your driver account is still waiting for approval. Our administration team is currently reviewing your vehicle and driving credentials.
          </p>
          <div className="guard-actions">
            <Link to="/become-driver" className="btn btn-secondary">View Application Status</Link>
            <Link to="/dashboard" className="btn btn-primary">Return to Passenger Mode</Link>
          </div>
        </div>
      </div>
    );
  }

  if (isRejectedDriver) {
    return (
      <div className="driver-guard-page">
        <div className="driver-guard-card">
          <div className="guard-icon rejected">
            <XCircle size={48} />
          </div>
          <h2>Application Not Approved</h2>
          <p className="guard-text">
            Your driver account has not been approved. You can review your details and submit an updated application.
          </p>
          <div className="guard-actions">
            <Link to="/become-driver" className="btn btn-primary">
              Re-apply to Become a Driver <ArrowRight size={16} />
            </Link>
            <Link to="/dashboard" className="btn btn-secondary">Go to Passenger Dashboard</Link>
          </div>
        </div>
      </div>
    );
  }

  if (!isApprovedDriver) {
    return (
      <div className="driver-guard-page">
        <div className="driver-guard-card">
          <div className="guard-icon info">
            <AlertCircle size={48} />
          </div>
          <h2>Driver Registration Required</h2>
          <p className="guard-text">
            You need to be an approved SmartRide driver to access driver features and publish rides.
          </p>
          <div className="guard-actions">
            <Link to="/become-driver" className="btn btn-primary">
              Apply to Become a Driver <ArrowRight size={16} />
            </Link>
            <Link to="/dashboard" className="btn btn-secondary">Go to Passenger Mode</Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
};
