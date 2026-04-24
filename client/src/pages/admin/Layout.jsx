import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const NAV = [
  { to: '/admin/dashboard', icon: 'bi-grid-1x2',      label: 'Dashboard' },
  { to: '/admin/projects',  icon: 'bi-collection',     label: 'Projects' },
  { to: '/admin/messages',  icon: 'bi-chat-text',      label: 'Messages' },
  { to: '/admin/settings',  icon: 'bi-gear',           label: 'Settings' },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/admin') }

  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <div style={{
        padding: collapsed ? '24px 16px' : '24px 24px',
        borderBottom: '1px solid var(--clr-border)',
        display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between',
      }}>
        {!collapsed && (
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', letterSpacing: '0.04em', color: 'var(--clr-text)' }}>
            DEV<span style={{ color: 'var(--clr-accent)' }}>FOLIO</span>
          </span>
        )}
        <button
          onClick={() => setCollapsed(c => !c)}
          style={{ background: 'none', border: 'none', color: 'var(--clr-muted)', cursor: 'pointer', fontSize: '1rem', padding: 4 }}
        >
          <i className={`bi bi-${collapsed ? 'layout-sidebar' : 'layout-sidebar-reverse'}`}></i>
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
        {NAV.map(n => (
          <NavLink
            key={n.to}
            to={n.to}
            onClick={() => setMobileOpen(false)}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: collapsed ? '12px' : '11px 14px',
              borderRadius: 'var(--radius-sm)',
              marginBottom: 4,
              textDecoration: 'none',
              justifyContent: collapsed ? 'center' : 'flex-start',
              background: isActive ? 'rgba(198,255,0,0.1)' : 'transparent',
              color: isActive ? 'var(--clr-accent)' : 'var(--clr-muted)',
              border: isActive ? '1px solid rgba(198,255,0,0.15)' : '1px solid transparent',
              fontSize: '0.88rem',
              fontWeight: 500,
              transition: 'all .2s',
            })}
            title={collapsed ? n.label : ''}
          >
            <i className={`bi ${n.icon}`} style={{ fontSize: '1rem', flexShrink: 0 }}></i>
            {!collapsed && <span>{n.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div style={{
        padding: collapsed ? '16px 12px' : '16px 20px',
        borderTop: '1px solid var(--clr-border)',
      }}>
        {!collapsed && (
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--clr-text)' }}>{user?.name}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--clr-muted)' }}>{user?.email}</div>
          </div>
        )}
        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            justifyContent: collapsed ? 'center' : 'flex-start',
            width: '100%',
            background: 'rgba(255,60,95,0.08)',
            border: '1px solid rgba(255,60,95,0.15)',
            borderRadius: 'var(--radius-sm)',
            color: '#ff3c5f',
            cursor: 'pointer',
            padding: '9px 14px',
            fontSize: '0.82rem',
            fontWeight: 600,
            transition: 'background .2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,60,95,0.15)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,60,95,0.08)'}
        >
          <i className="bi bi-box-arrow-left"></i>
          {!collapsed && 'Logout'}
        </button>
      </div>
    </div>
  )

  const sidebarW = collapsed ? 68 : 240

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--clr-bg)' }}>
      {/* Desktop Sidebar */}
      <aside style={{
        width: sidebarW,
        background: 'var(--clr-surface)',
        borderRight: '1px solid var(--clr-border)',
        position: 'fixed', top: 0, left: 0, bottom: 0,
        zIndex: 200,
        transition: 'width .3s cubic-bezier(.16,1,.3,1)',
        overflow: 'hidden',
        display: 'none',
      }} className="d-lg-block">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 299, backdropFilter: 'blur(4px)' }}
        />
      )}
      {/* Mobile Sidebar */}
      <aside style={{
        width: 240,
        background: 'var(--clr-surface)',
        borderRight: '1px solid var(--clr-border)',
        position: 'fixed', top: 0, left: mobileOpen ? 0 : -240, bottom: 0,
        zIndex: 300,
        transition: 'left .3s cubic-bezier(.16,1,.3,1)',
      }} className="d-lg-none">
        <SidebarContent />
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, marginLeft: 0, transition: 'margin .3s' }} className="admin-main">
        <style>{`.admin-main { margin-left: 0 } @media(min-width:992px){.admin-main{margin-left:${sidebarW}px}}`}</style>

        {/* Topbar */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 100,
          background: 'rgba(8,8,8,0.9)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--clr-border)',
          padding: '0 24px',
          height: 60,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              className="d-lg-none"
              onClick={() => setMobileOpen(o => !o)}
              style={{ background: 'none', border: 'none', color: 'var(--clr-text)', cursor: 'pointer', fontSize: '1.3rem', padding: 0 }}
            >
              <i className="bi bi-list"></i>
            </button>
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--clr-muted)', letterSpacing: '0.06em' }}>ADMIN</span>
              <span style={{ color: 'var(--clr-border)', margin: '0 8px' }}>•</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--clr-muted)' }}>DevFolio Dashboard</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <a href="/" target="_blank" style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 14px',
              background: 'rgba(198,255,0,0.08)',
              border: '1px solid rgba(198,255,0,0.15)',
              borderRadius: '100px',
              color: 'var(--clr-accent)',
              textDecoration: 'none',
              fontSize: '0.76rem', fontWeight: 600,
            }}>
              <i className="bi bi-box-arrow-up-right"></i>
              <span className="d-none d-sm-inline">View Site</span>
            </a>
            <div style={{
              width: 34, height: 34,
              background: 'var(--clr-accent)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)',
              fontSize: '0.9rem', color: '#000', fontWeight: 700,
            }}>
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ padding: '28px 24px', minHeight: 'calc(100vh - 60px)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
