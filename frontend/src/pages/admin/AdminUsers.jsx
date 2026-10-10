import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  Search,
  ShieldAlert,
  ShieldCheck,
  Ban,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export const AdminUsers = () => {
  const { user: currentAdmin } = useAuth();

  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await adminService.getUsers();
      setUsers(res.data.data);
    } catch (err) {
      setError('Failed to fetch user directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleBlockUser = async (userId) => {
    if (userId === currentAdmin?.id) {
      setError('Administrator cannot block their own account.');
      return;
    }

    setActionLoading(userId);
    setError('');
    setMessage('');
    try {
      await adminService.blockUser(userId);
      setMessage(`User #${userId} has been suspended/blocked.`);
      await fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to block user.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnblockUser = async (userId) => {
    setActionLoading(userId);
    setError('');
    setMessage('');
    try {
      await adminService.unblockUser(userId);
      setMessage(`User #${userId} has been restored to active.`);
      await fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to unblock user.');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchTerm.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone?.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>User Management</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Search and manage member accounts, roles, and platform permissions.
          </p>
        </div>

        <div className="search-input-field" style={{ width: '320px', background: '#ffffff' }}>
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {message && (
        <div className="alert alert-success">
          <CheckCircle size={18} />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="card" style={{ padding: '24px' }}>
        {loading ? (
          <div className="loading-screen" style={{ minHeight: '220px' }}>
            <div className="spinner"></div>
            <p>Loading registered users...</p>
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th>Role</th>
                  <th>Driver Status</th>
                  <th>Account Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => {
                  const isCurrentAdmin = u.id === currentAdmin?.id;
                  return (
                    <tr key={u.id}>
                      <td>#{u.id}</td>
                      <td>
                        <div style={{ fontWeight: 700 }}>{u.name}</div>
                        {isCurrentAdmin && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>
                            (Your Current Account)
                          </span>
                        )}
                      </td>
                      <td>{u.email}</td>
                      <td>{u.phone}</td>
                      <td>
                        <span className={`badge badge-${u.role}`}>{u.role}</span>
                      </td>
                      <td>
                        <span className={`badge badge-${u.driverVerificationStatus || 'secondary'}`}>
                          {u.driverVerificationStatus || 'NOT APPLIED'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge badge-${u.status}`}>{u.status}</span>
                      </td>
                      <td>
                        {isCurrentAdmin ? (
                          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Protected</span>
                        ) : u.status === 'ACTIVE' ? (
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleBlockUser(u.id)}
                            disabled={actionLoading === u.id}
                          >
                            <Ban size={14} /> Block
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            style={{ background: '#10b981', borderColor: '#10b981' }}
                            onClick={() => handleUnblockUser(u.id)}
                            disabled={actionLoading === u.id}
                          >
                            <CheckCircle size={14} /> Unblock
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 24px' }}>
            <p style={{ color: 'var(--text-muted)' }}>No users found matching "{searchTerm}".</p>
          </div>
        )}
      </div>
    </div>
  );
};
