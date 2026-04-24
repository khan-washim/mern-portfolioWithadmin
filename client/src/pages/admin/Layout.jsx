import { useState, useEffect } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import api from '../../utils/api';

const navItems = [
  { to: '/admin/dashboard', icon: 'bi-grid-1x2', label: 'Dashboard' },
  { to: '/admin/projects', icon: 'bi-grid-3x3-gap', label: 'Projects' },
  { to: '/admin/messages', icon: 'bi-envelope', label: 'Messages' },
];

export default function AdminLayout() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/auth/me').then(r => setUser(r.data.data || r.data)).catch(() => navigate('/admin/login'));
  }, [navigate]);

  const logout = () => { localStorage.removeItem('token'); navigate('/admin/login'); };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#050508' }}>
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 199 }} />}

      <aside style={{ width: 260, flexShrink: 0, background: '#0d0d14', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 200, transition: 'transform 0.3s ease' }} className={`admin-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div style={{ padding: '28px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, background: 'linear-gradient(135deg, #7c6af7, #e879f9)', borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1rem', color: '#fff' }}>W</div>
          <div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1rem' }}>DevFolio</div>
            <div style={{ fontSize: '0.72rem', color: '#6b6880' }}>Admin Panel</div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: '20px 12px' }}>
          {navItems.map(n => (
            <NavLink key={n.to} to={n.to} onClick={() => setSidebarOpen(false)}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12, marginBottom: 4, textDecoration: 'none',
                fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.2s',
                color: isActive ? '#fff' : '#6b6880',
                background: isActive ? 'linear-gradient(135deg, rgba(124,106,247,0.2), rgba(232,121,249,0.1))' : 'transparent',
                borderLeft: isActive ? '3px solid #7c6af7' : '3px solid transparent',
              })}>
              <i className={`bi ${n.icon}`}></i> {n.label}
            </NavLink>
          ))}
        </nav>
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', marginBottom: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #7c6af7, #e879f9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#fff', fontSize: '0.9rem', flexShrink: 0 }}>{user.name?.[0]?.toUpperCase()}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', fontFamily: 'Syne, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
                <div style={{ color: '#6b6880', fontSize: '0.72rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
              </div>
            </div>
          )}
          <button onClick={logout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 12, color: '#f87171', fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
            <i className="bi bi-box-arrow-right"></i> Logout
          </button>
        </div>
      </aside>

      <div style={{ flex: 1, marginLeft: 260, minHeight: '100vh', display: 'flex', flexDirection: 'column' }} className="admin-main">
        <header style={{ height: 64, padding: '0 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(5,5,8,0.9)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 100 }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e8e6f0', fontSize: '1.3rem' }} className="hamburger-btn">
            <i className="bi bi-list"></i>
          </button>
          <a href="/" target="_blank" rel="noreferrer" style={{ color: '#6b6880', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: 6 }}>
            <i className="bi bi-box-arrow-up-right"></i> View Site
          </a>
        </header>
        <main style={{ flex: 1, padding: '32px 24px' }}><Outlet /></main>
      </div>

      <style>{`
        .admin-sidebar { transform: translateX(0); }
        .hamburger-btn { display: none !important; }
        @media (max-width: 768px) {
          .admin-sidebar { transform: translateX(-100%) !important; }
          .admin-sidebar.open { transform: translateX(0) !important; }
          .admin-main { margin-left: 0 !important; }
          .hamburger-btn { display: flex !important; }
        }
      `}</style>
    </div>
  );
}