import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import { useAuth } from '../../context/AuthContext'

// --- Sub-Components ---

function StatCard({ icon, label, value, sub, accent, loading }) {
  return (
    <div 
      className="h-100"
      style={{
        background: 'var(--clr-card)',
        border: '1px solid var(--clr-border)',
        borderRadius: 'var(--radius-md)',
        padding: '24px',
        transition: 'all .3s ease',
      }}
      onMouseEnter={e => { 
        e.currentTarget.style.borderColor = accent + '80'; 
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = `0 10px 30px ${accent}15`;
      }}
      onMouseLeave={e => { 
        e.currentTarget.style.borderColor = 'var(--clr-border)'; 
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--clr-muted)', marginBottom: 10 }}>
            {label}
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.6rem', letterSpacing: '0.02em', color: 'var(--clr-text)', lineHeight: 1 }}>
            {loading ? '—' : value}
          </div>
          {sub && <div style={{ fontSize: '0.75rem', color: 'var(--clr-muted)', marginTop: 6 }}>{sub}</div>}
        </div>
        <div style={{
          width: 46, height: 46,
          background: accent + '15',
          border: `1px solid ${accent}25`,
          borderRadius: 'var(--radius-sm)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <i className={`bi ${icon}`} style={{ color: accent, fontSize: '1.2rem' }}></i>
        </div>
      </div>
    </div>
  )
}

function MsgRow({ msg, onRead }) {
  const badge = { unread: '#c6ff00', read: 'var(--clr-muted)', replied: '#4dffb4' }
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '14px 0',
      borderBottom: '1px solid var(--clr-border)',
    }}>
      <div style={{
        width: 38, height: 38,
        background: 'rgba(198,255,0,0.08)',
        borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-display)', color: 'var(--clr-accent)', fontSize: '1rem',
        flexShrink: 0,
      }}>
        {msg.name[0].toUpperCase()}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--clr-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {msg.name}
          </span>
          <span style={{
            fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
            color: badge[msg.status] || 'var(--clr-muted)', flexShrink: 0,
          }}>
            {msg.status}
          </span>
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--clr-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {msg.subject}
        </div>
      </div>
      {msg.status === 'unread' && (
        <button 
          onClick={() => onRead(msg._id)} 
          className="btn-read-hover"
          style={{
            background: 'none', border: '1px solid var(--clr-border)',
            borderRadius: 'var(--radius-sm)', color: 'var(--clr-muted)',
            cursor: 'pointer', padding: '4px 10px', fontSize: '0.72rem', flexShrink: 0,
            transition: 'all 0.2s'
          }}
        >
          Mark read
        </button>
      )}
    </div>
  )
}

// --- Main Dashboard Component ---

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ projects: 0, messages: 0, unread: 0 })
  const [msgs, setMsgs] = useState([])
  const [projs, setProjs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [pr, co] = await Promise.all([
          api.get('/projects'),
          api.get('/contact'),
        ])
        
        const projects = pr.data.data || []
        const messages = co.data.data || []
        const unreadCount = messages.filter(m => m.status === 'unread').length
        
        setStats({ projects: projects.length, messages: messages.length, unread: unreadCount })
        setMsgs(messages.slice(0, 5))
        setProjs(projects.slice(0, 4))
      } catch (error) {
        console.error("Dashboard Fetch Error:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const markRead = async (id) => {
    try {
      await api.patch(`/contact/${id}/read`)
      setMsgs(ms => ms.map(m => m._id === id ? { ...m, status: 'read' } : m))
      setStats(s => ({ ...s, unread: Math.max(0, s.unread - 1) }))
    } catch (err) {
      console.error("Error marking as read:", err)
    }
  }

  // Memoize STATS to prevent unnecessary re-renders
  const STATS_DATA = useMemo(() => [
    { icon: 'bi-collection',    label: 'Total Projects', value: stats.projects, sub: 'Active portfolio items',   accent: '#c6ff00' },
    { icon: 'bi-chat-text',     label: 'Total Messages', value: stats.messages, sub: 'Contact form submissions', accent: '#60a5fa' },
    { icon: 'bi-envelope-open', label: 'Unread',         value: stats.unread,   sub: 'Awaiting your response',  accent: '#ff3c5f' },
    { icon: 'bi-eye',           label: 'Page Views',     value: '2.4k',         sub: 'This month (demo)',        accent: '#4dffb4' },
  ], [stats])

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', letterSpacing: '0.04em', color: 'var(--clr-text)', marginBottom: 4 }}>
          DASHBOARD
        </h1>
        <p style={{ color: 'var(--clr-muted)', fontSize: '0.88rem' }}>
          Welcome back, <span style={{ color: 'var(--clr-accent)', fontWeight: 600 }}>{user?.name || 'Admin'}</span>! Here's what's happening.
        </p>
      </div>

      {/* Stat cards */}
      <div className="row g-3 mb-4">
        {STATS_DATA.map(s => (
          <div className="col-6 col-lg-3" key={s.label}>
            <StatCard {...s} loading={loading} />
          </div>
        ))}
      </div>

      <div className="row g-4">
        {/* Recent Messages */}
        <div className="col-lg-6">
          <div style={{
            background: 'var(--clr-card)',
            border: '1px solid var(--clr-border)',
            borderRadius: 'var(--radius-md)',
            padding: '24px',
            height: '100%'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h5 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.04em', color: 'var(--clr-text)', margin: 0 }}>
                RECENT MESSAGES
              </h5>
              <Link to="/admin/messages" style={{ fontSize: '0.75rem', color: 'var(--clr-accent)', textDecoration: 'none', fontWeight: 600 }}>
                View all →
              </Link>
            </div>
            {loading
              ? Array(4).fill(0).map((_, i) => (
                  <div key={i} className="skeleton-line" style={{ height: 48, background: 'rgba(255,255,255,0.03)', borderRadius: 8, marginBottom: 8 }} />
                ))
              : msgs.length === 0
                ? <p style={{ color: 'var(--clr-muted)', fontSize: '0.85rem', padding: '20px 0' }}>No messages yet.</p>
                : msgs.map(m => <MsgRow key={m._id} msg={m} onRead={markRead} />)
            }
          </div>
        </div>

        {/* Recent Projects */}
        <div className="col-lg-6">
          <div style={{
            background: 'var(--clr-card)',
            border: '1px solid var(--clr-border)',
            borderRadius: 'var(--radius-md)',
            padding: '24px',
            height: '100%'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h5 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.04em', color: 'var(--clr-text)', margin: 0 }}>
                RECENT PROJECTS
              </h5>
              <Link to="/admin/projects" style={{ fontSize: '0.75rem', color: 'var(--clr-accent)', textDecoration: 'none', fontWeight: 600 }}>
                Manage →
              </Link>
            </div>
            {loading
              ? Array(4).fill(0).map((_, i) => (
                  <div key={i} className="skeleton-line" style={{ height: 56, background: 'rgba(255,255,255,0.03)', borderRadius: 8, marginBottom: 8 }} />
                ))
              : projs.length === 0
                ? <p style={{ color: 'var(--clr-muted)', fontSize: '0.85rem', padding: '20px 0' }}>No projects yet.</p>
                : projs.map(p => (
                    <div key={p._id} style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '12px 0',
                      borderBottom: '1px solid var(--clr-border)',
                    }}>
                      <div style={{
                        width: 40, height: 40,
                        background: (p.accent || '#c6ff00') + '18',
                        border: `1px solid ${(p.accent || '#c6ff00')}30`,
                        borderRadius: 'var(--radius-sm)',
                        flexShrink: 0,
                        overflow: 'hidden',
                      }}>
                        {p.image
                          ? <img src={p.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                              <i className="bi bi-collection" style={{ color: p.accent || '#c6ff00', fontSize: '1rem' }}></i>
                            </div>
                        }
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--clr-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {p.title}
                        </div>
                        <div style={{ display: 'flex', gap: 6, marginTop: 3, flexWrap: 'wrap' }}>
                          {p.tags?.slice(0, 2).map(t => (
                            <span key={t} style={{ fontSize: '0.62rem', padding: '1px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', color: 'var(--clr-muted)' }}>{t}</span>
                          ))}
                        </div>
                      </div>
                      {p.featured && (
                        <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#c6ff00', letterSpacing: '0.06em' }}>★ FEATURED</span>
                      )}
                    </div>
                  ))
            }
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-12">
          <div style={{
            background: 'var(--clr-card)',
            border: '1px solid var(--clr-border)',
            borderRadius: 'var(--radius-md)',
            padding: '24px',
          }}>
            <h5 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.04em', color: 'var(--clr-text)', marginBottom: 16 }}>
              QUICK ACTIONS
            </h5>
            <div className="d-flex flex-wrap gap-3">
              {[
                { to: '/admin/projects', icon: 'bi-plus-circle', label: 'Add Project',    accent: '#c6ff00' },
                { to: '/admin/messages', icon: 'bi-envelope',    label: 'View Messages',  accent: '#60a5fa' },
                { href: '/',             icon: 'bi-eye',          label: 'Preview Site',   accent: '#4dffb4' },
                { to: '/admin/settings', icon: 'bi-gear',         label: 'Settings',       accent: '#fb923c' },
              ].map(a => (
                a.to
                  ? <Link key={a.label} to={a.to} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '12px 20px',
                      background: a.accent + '10',
                      border: `1px solid ${a.accent}25`,
                      borderRadius: 'var(--radius-sm)',
                      color: a.accent,
                      textDecoration: 'none',
                      fontSize: '0.82rem', fontWeight: 600,
                      transition: 'all .2s',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.background = a.accent + '20'; e.currentTarget.style.borderColor = a.accent + '50' }}
                      onMouseLeave={e => { e.currentTarget.style.background = a.accent + '10'; e.currentTarget.style.borderColor = a.accent + '25' }}
                    >
                      <i className={`bi ${a.icon}`}></i> {a.label}
                    </Link>
                  : <a key={a.label} href={a.href} target="_blank" rel="noreferrer" style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '12px 20px',
                      background: a.accent + '10',
                      border: `1px solid ${a.accent}25`,
                      borderRadius: 'var(--radius-sm)',
                      color: a.accent,
                      textDecoration: 'none',
                      fontSize: '0.82rem', fontWeight: 600,
                      transition: 'all .2s',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.background = a.accent + '20'; e.currentTarget.style.borderColor = a.accent + '50' }}
                      onMouseLeave={e => { e.currentTarget.style.background = a.accent + '10'; e.currentTarget.style.borderColor = a.accent + '25' }}
                    >
                      <i className={`bi ${a.icon}`}></i> {a.label}
                    </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}