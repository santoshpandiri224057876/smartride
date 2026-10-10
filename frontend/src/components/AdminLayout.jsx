import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

export const AdminLayout = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-layout">
      <AdminSidebar />

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Administrative Console</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
              <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>{user?.name}</span>
              <span className="badge badge-admin">
                <ShieldAlert size={13} /> Super Administrator
              </span>
            </div>
          </div>
        </header>

        <section className="dashboard-body">
          <Outlet />
        </section>
      </main>
    </div>
  );
};
