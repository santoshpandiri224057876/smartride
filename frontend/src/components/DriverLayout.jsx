import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { DriverSidebar } from './DriverSidebar';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Plus } from 'lucide-react';

export const DriverLayout = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-layout">
      <DriverSidebar />

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Driver Workspace</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
              <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>{user?.name}</span>
              <span className="badge badge-success">
                <ShieldCheck size={13} /> Verified Driver
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link to="/driver/offer-ride" className="btn btn-primary btn-sm">
              <Plus size={16} /> Offer New Ride
            </Link>
          </div>
        </header>

        <section className="dashboard-body">
          <Outlet />
        </section>
      </main>
    </div>
  );
};
