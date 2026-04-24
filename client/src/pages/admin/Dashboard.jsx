import { useState, useEffect } from 'react';
import api from '../../utils/api';

function StatCard({ icon, label, value, color, trend }) {
  return (
    <div style={{ background: '#0d0d14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 12, transition: 'all 0.3s', cursor: 'default' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}33`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'none'; }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', color }}>
          <i className={`bi ${icon}`}></i>
        </div>
        {trend && <span style={{ fontSize: '0.72rem', color: '#4ade80', background: 'rgba(74,222,128,0.1)', padding: '3px 8px', borderRadius: 50 }}>{trend}</span>}
      </div>
      <div>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '2rem', fontWeight: 800 }}>{value}</div>
        <div style={{ color: '#6b6880', fontSize: '0.85rem' }}>{label}</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState({ projects: 0, messages: 0, unread: 0 });
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/projects').catch(() => ({ data: [] })),
      api.get('/contact').catch(() => ({ data: [] })),
    ]).then(([projRes, msgRes]) => {
      const projects = projRes.data.data || projRes.data || [];
      const messages = msgRes.data.data || msgRes.data || [];
      setStats({ projects: projects.length, messages: messages.length, unread: messages.filter(m => !m.isRead).length });
      setRecentMessages(messages.slice(0, 5));
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid rgba(124,106,247,0.2)', borderTop: '3px solid #7c6af7', animation: 'spin 1s linear infinite' }}></div><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>;

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.8rem', fontWeight: 700 }}>Dashboard</h1>
        <p style={{ color: '#6b6880', marginTop: 4 }}>Welcome back! Here's your portfolio overview.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 32 }}>
        <StatCard icon="bi-grid-3x3-gap" label="Total Projects" value={stats.projects} color="#7c6af7" trend="+2 this month" />
        <StatCard icon="bi-envelope" label="Total Messages" value={stats.messages} color="#e879f9" />
        <StatCard icon="bi-envelope-open" label="Unread Messages" value={stats.unread} color="#fb923c" trend={stats.unread > 0 ? 'New!' : null} />
        <StatCard icon="bi-eye" label="Portfolio Views" value="—" color="#38bdf8" />
      </div>
      <div style={{ background: '#0d0d14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1rem', fontWeight: 700 }}>Recent Messages</h2>
          <a href="/admin/messages" style={{ color: '#7c6af7', fontSize: '0.8rem' }}>View all →</a>
        </div>
        {recentMessages.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: '#6b6880' }}><i className="bi bi-inbox" style={{ fontSize: '2.5rem', display: 'block', marginBottom: 12 }}></i>No messages yet</div>
        ) : recentMessages.map((m, i) => (
          <div key={m._id} style={{ padding: '16px 24px', borderBottom: i < recentMessages.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, background: !m.isRead ? 'rgba(124,106,247,0.03)' : 'transparent' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(124,106,247,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.85rem', color: '#7c6af7', flexShrink: 0 }}>{m.name?.[0]?.toUpperCase()}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                  {m.name} {!m.isRead && <span style={{ width: 6, height: 6, background: '#7c6af7', borderRadius: '50%', flexShrink: 0 }}></span>}
                </div>
                <div style={{ color: '#6b6880', fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.subject || m.message?.slice(0, 50)}</div>
              </div>
            </div>
            <span style={{ color: '#6b6880', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{new Date(m.createdAt).toLocaleDateString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}