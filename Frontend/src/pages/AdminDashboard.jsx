import React, { useState, useEffect } from 'react';
import axios from '../axios';
import { ShieldCheck, ShieldAlert, Ban, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await axios.get('/api/reports');
      setReports(res.data.data.reports);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id, status, banUser = false) => {
    try {
      await axios.patch(`/api/reports/${id}/resolve`, {
        status,
        banUser
      });
      fetchReports();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
      <Loader2 className="animate-spin" size={48} color="var(--primary)" />
    </div>
  );

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
        <ShieldCheck size={40} color="var(--primary)" />
        <h1 style={{ fontSize: '2.5rem' }}>Admin Moderation Panel</h1>
      </header>

      <div className="glass-card" style={{ padding: '30px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '15px' }}>Reporter</th>
              <th style={{ padding: '15px' }}>Reported Entity</th>
              <th style={{ padding: '15px' }}>Reason</th>
              <th style={{ padding: '15px' }}>Status</th>
              <th style={{ padding: '15px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(report => (
              <tr key={report._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '15px' }}>
                  <div style={{ fontWeight: '500' }}>{report.reporter.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{report.reporter.email}</div>
                </td>
                <td style={{ padding: '15px' }}>
                  {report.reportedProduct ? (
                    <div>
                      <span style={{ fontSize: '0.7rem', background: 'var(--primary)', padding: '2px 6px', borderRadius: '4px', marginRight: '8px' }}>PRODUCT</span>
                      {report.reportedProduct.title}
                    </div>
                  ) : (
                    <div>
                      <span style={{ fontSize: '0.7rem', background: 'var(--secondary)', padding: '2px 6px', borderRadius: '4px', marginRight: '8px' }}>USER</span>
                      {report.reportedUser.name}
                    </div>
                  )}
                </td>
                <td style={{ padding: '15px' }}>{report.reason}</td>
                <td style={{ padding: '15px' }}>
                  <span style={{ 
                    padding: '4px 10px', 
                    borderRadius: '15px', 
                    fontSize: '0.8rem',
                    background: report.status === 'pending' ? 'rgba(234, 179, 8, 0.2)' : report.status === 'resolved' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(100, 116, 139, 0.2)',
                    color: report.status === 'pending' ? '#eab308' : report.status === 'resolved' ? '#22c55e' : '#94a3b8'
                  }}>
                    {report.status.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '15px' }}>
                  {report.status === 'pending' && (
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button 
                        onClick={() => handleResolve(report._id, 'resolved')}
                        className="btn-primary" 
                        style={{ padding: '5px 10px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', border: '1px solid #22c55e' }}
                      >
                        <CheckCircle size={14} /> Resolve
                      </button>
                      {report.reportedUser && !report.reportedUser.isBanned && (
                        <button 
                          onClick={() => handleResolve(report._id, 'resolved', true)}
                          className="btn-primary" 
                          style={{ padding: '5px 10px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid #ef4444' }}
                        >
                          <Ban size={14} /> Ban User
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {reports.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No reports found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
