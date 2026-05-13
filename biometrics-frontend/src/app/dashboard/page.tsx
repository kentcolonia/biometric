'use client';

import { useEffect, useState } from 'react';
import { fetchWithAuth } from '@/lib/api';

interface Device {
  id: number; ip: string; location: string; isActive: boolean; port: number;
}
interface Log {
  id: number; user_id: string; timestamp: string; punch: number; device_id: number;
}

export default function DashboardPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [devicesData, logsData] = await Promise.all([
          fetchWithAuth<any>('/devices'),
          fetchWithAuth<any>('/logs'),
        ]);
        setDevices(Array.isArray(devicesData) ? devicesData : devicesData?.data || devicesData?.devices || []);
        setLogs(Array.isArray(logsData) ? logsData : logsData?.data || logsData?.logs || []);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const activeDevices = devices.filter(d => d.isActive).length;
  const todayLogs = logs.filter(log => new Date(log.timestamp).toDateString() === new Date().toDateString());
  const recentLogs = logs.slice(0, 5);

  function formatTime(ts: string) {
    return new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }
  function formatDate(ts: string) {
    return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  return (
    <div className="page">
      <div className="topbar">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-sub">Welcome back — here's what's happening</p>
        </div>
        <div className="live-badge">
          <span className="live-dot" />
          Live
        </div>
      </div>

      {loading ? (
        <div className="loading">
          <div className="loading-spinner" />
          Loading dashboard...
        </div>
      ) : (
        <>
          <div className="metrics">
            <div className="metric-card">
              <div className="metric-label">Offline Devices</div>
              <div className="metric-value red">{devices.length - activeDevices}</div>
              <div className="metric-bar" style={{ background: 'rgba(239,68,68,0.15)', borderColor: 'rgba(239,68,68,0.2)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Active Devices</div>
              <div className="metric-value green">{activeDevices}<span className="metric-total">/{devices.length}</span></div>
              <div className="metric-bar" style={{ background: 'rgba(16,185,129,0.1)', borderColor: 'rgba(16,185,129,0.2)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><circle cx="12" cy="12" r="3"/></svg>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Today's Logs</div>
              <div className="metric-value cyan">{todayLogs.length}</div>
              <div className="metric-bar" style={{ background: 'rgba(6,182,212,0.1)', borderColor: 'rgba(6,182,212,0.2)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Total Logs</div>
              <div className="metric-value">{logs.length}</div>
              <div className="metric-bar" style={{ background: 'rgba(161,161,170,0.1)', borderColor: 'rgba(161,161,170,0.15)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
            </div>
          </div>

          <div className="grid">
            <div className="card">
              <div className="card-header">
                <span className="card-title">Recent Attendance</span>
                <span className="count-badge">{recentLogs.length}</span>
              </div>
              {recentLogs.length === 0 ? (
                <div className="empty">No logs yet</div>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>User ID</th><th>Date</th><th>Time</th><th>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentLogs.map(log => (
                      <tr key={log.id}>
                        <td><span className="uid">#{log.user_id}</span></td>
                        <td>{formatDate(log.timestamp)}</td>
                        <td>{formatTime(log.timestamp)}</td>
                        <td>
                          <span className={`punch-badge ${log.punch === 0 ? 'check-in' : 'check-out'}`}>
                            {log.punch === 0 ? 'Check in' : 'Check out'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="card">
              <div className="card-header">
                <span className="card-title">Device Status</span>
                <span className="count-badge">{devices.length}</span>
              </div>
              {devices.length === 0 ? (
                <div className="empty">No devices registered</div>
              ) : (
                <table className="table">
                  <thead>
                    <tr><th>IP Address</th><th>Location</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {devices.map(device => (
                      <tr key={device.id}>
                        <td><span className="mono">{device.ip}</span></td>
                        <td>{device.location || '—'}</td>
                        <td>
                          <span className={`status-badge ${device.isActive ? 'online' : 'offline'}`}>
                            <span className="status-dot" />
                            {device.isActive ? 'Online' : 'Offline'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}

      <style>{`
        .page { padding: 32px; font-family: 'DM Sans', system-ui, sans-serif; color: #f4f4f5; }
        .topbar { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 28px; }
        .page-title { font-size: 22px; font-weight: 600; color: #f4f4f5; letter-spacing: -0.4px; }
        .page-sub { font-size: 13px; color: #71717a; margin-top: 3px; }
        .live-badge { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #a1a1aa; background: #18181b; border: 1px solid #27272a; border-radius: 999px; padding: 5px 12px; }
        .live-dot { width: 6px; height: 6px; border-radius: 50%; background: #10b981; box-shadow: 0 0 6px #10b981; animation: pulse 2s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        .loading { text-align: center; padding: 80px; color: #71717a; font-size: 14px; display: flex; flex-direction: column; align-items: center; gap: 16px; }
        .loading-spinner { width: 28px; height: 28px; border: 2px solid #27272a; border-top-color: #10b981; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 20px; }
        .metric-card {
          background: #18181b; border: 1px solid #27272a; border-radius: 12px;
          padding: 18px 20px; position: relative; overflow: hidden;
          transition: border-color 0.2s;
        }
        .metric-card:hover { border-color: #3f3f46; }
        .metric-label { font-size: 11px; color: #71717a; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
        .metric-value { font-size: 30px; font-weight: 600; color: #f4f4f5; letter-spacing: -0.5px; }
        .metric-value.green { color: #10b981; }
        .metric-value.cyan { color: #06b6d4; }
        .metric-value.red { color: #ef4444; }
        .metric-total { font-size: 16px; color: #52525b; font-weight: 400; }
        .metric-bar {
          position: absolute; right: 16px; top: 16px;
          width: 34px; height: 34px; border-radius: 8px;
          border: 1px solid; display: flex; align-items: center; justify-content: center;
        }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .card { background: #18181b; border: 1px solid #27272a; border-radius: 12px; overflow: hidden; }
        .card-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #27272a; }
        .card-title { font-size: 13px; font-weight: 500; color: #e4e4e7; }
        .count-badge { font-size: 11px; background: #27272a; color: #71717a; padding: 2px 8px; border-radius: 999px; border: 1px solid #3f3f46; }
        .table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .table th { text-align: left; padding: 10px 20px; color: #52525b; font-weight: 400; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; background: #141418; border-bottom: 1px solid #27272a; }
        .table td { padding: 12px 20px; color: #a1a1aa; border-bottom: 1px solid #1f1f23; }
        .table tr:last-child td { border-bottom: none; }
        .table tr:hover td { background: #1c1c21; color: #d4d4d8; }
        .uid { font-family: monospace; font-size: 12px; color: #52525b; }
        .mono { font-family: monospace; font-size: 12px; color: #71717a; }
        .punch-badge { display: inline-flex; align-items: center; font-size: 11px; padding: 3px 9px; border-radius: 999px; font-weight: 500; }
        .check-in { background: rgba(16,185,129,0.12); color: #34d399; border: 1px solid rgba(16,185,129,0.2); }
        .check-out { background: rgba(6,182,212,0.1); color: #22d3ee; border: 1px solid rgba(6,182,212,0.2); }
        .status-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; }
        .status-dot { width: 6px; height: 6px; border-radius: 50%; }
        .online .status-dot { background: #10b981; box-shadow: 0 0 6px #10b981; }
        .online { color: #34d399; }
        .offline .status-dot { background: #ef4444; }
        .offline { color: #f87171; }
        .empty { padding: 36px 20px; text-align: center; color: #52525b; font-size: 13px; }
      `}</style>
    </div>
  );
}
