import { useState, useEffect } from 'react';
import api from '../../utils/api';

function StatCard({ icon, label, value, color, trend }) {
  return (
    <div 
      style={{ 
        background: 'linear-gradient(145deg, #0d0d14 0%, #161620 100%)', 
        border: '1px solid rgba(255,255,255,0.06)', 
        borderRadius: 20, 
        padding: 24, 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 12, 
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
        cursor: 'default',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}66`; e.currentTarget.style.transform = 'translateY(-5px)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'none'; }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 2 }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', color, border: `1px solid ${color}22` }}>
          <i className={`bi ${icon}`}></i>
        </div>
        {trend && (
          <span style={{ fontSize: '0.7rem', fontWeight: 600, color, background: `${color}11`, padding: '4px 10px', borderRadius: 50, border: `1px solid ${color}22`, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {trend}
          </span>
        )}
      </div>
      <div style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '2.2rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{value}</div>
        <div style={{ color: '#6b6880', fontSize: '0.85rem', marginTop: 8, fontWeight: 500 }}>{label}</div>
      </div>
      {/* Background Glow */}
      <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '60%', height: '60%', background: `radial-gradient(circle, ${color}10 0%, transparent 70%)`, zIndex: 1 }}></div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState({ projects: 0, messages: 0, unread: 0 });
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [pRes, mRes] = await Promise.all([
        api.get('/projects'),
        api.get('/contact')
      ]);

      const projects = pRes.data.data || [];
      const messages = mRes.data.data || [];

      setStats({
        projects: projects.length,
        messages: messages.length,
        unread: messages.filter(m => !m.isRead).length
      });
      
      // Sort and take last 5
      setRecentMessages([...messages].reverse().slice(0, 5));
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  if (loading) return (
    <div style={{ height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="loader"></div>
      <style>{`.loader{width:40px;height:40px;border:3px solid #161620;border-top-color:#7c6af7;border-radius:50%;animation:s 1s infinite linear}@keyframes s{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '2rem', fontWeight: 800, color: '#fff' }}>Portfolio Overview</h1>
        <p style={{ color: '#6b6880', marginTop: 6, fontSize: '0.95rem' }}>Hi Khan, welcome back to your command center.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, marginBottom: 40 }}>
        <StatCard icon="bi-grid-1x2" label="Projects Created" value={stats.projects} color="#7c6af7" trend="Live" />
        <StatCard icon="bi-chat-left-text" label="Messages Received" value={stats.messages} color="#e879f9" />
        <StatCard icon="bi-lightning-charge" label="Pending Actions" value={stats.unread} color="#fb923c" trend={stats.unread > 0 ? "Priority" : "Clear"} />
        <StatCard icon="bi-globe" label="Server Status" value="Active" color="#22d3ee" trend="99.9%" />
      </div>

      <div style={{ background: '#0d0d14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 24, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
        <div style={{ padding: '24px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.1rem', fontWeight: 700 }}>Recent Activity</h2>
          <button 
            onClick={() => window.location.href = '/admin/messages'}
            style={{ background: 'transparent', border: 'none', color: '#7c6af7', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            Manage Messages <i className="bi bi-arrow-right"></i>
          </button>
        </div>

        <div style={{ padding: '8px 0' }}>
          {recentMessages.length === 0 ? (
            <div style={{ padding: 80, textAlign: 'center', color: '#6b6880' }}>
              <i className="bi bi-cloud-slash" style={{ fontSize: '3rem', opacity: 0.2, display: 'block', marginBottom: 16 }}></i>
              <p style={{ fontSize: '0.9rem' }}>No recent activity to show.</p>
            </div>
          ) : (
            recentMessages.map((msg, i) => (
              <div key={msg._id} style={{ 
                padding: '20px 32px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                borderBottom: i === recentMessages.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.03)',
                transition: 'background 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg, #7c6af7 0%, #e879f9 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem' }}>
                    {msg.name?.[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#fff' }}>{msg.name}</div>
                    <div style={{ color: '#6b6880', fontSize: '0.8rem', marginTop: 2 }}>{msg.subject || 'Inquiry regarding services'}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', color: '#6b6880' }}>{new Date(msg.createdAt).toLocaleDateString()}</div>
                  {!msg.isRead && <div style={{ fontSize: '0.65rem', color: '#fb923c', fontWeight: 700, textTransform: 'uppercase', marginTop: 4 }}>New Message</div>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}