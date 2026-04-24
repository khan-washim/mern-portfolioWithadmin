import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'

export default function AdminSettings() {
  const { user } = useAuth()
  const [pwd, setPwd] = useState({ current: '', newPass: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')
  const [toastType, setToastType] = useState('ok')

  const showToast = (msg, type = 'ok') => { 
    setToast(msg)
    setToastType(type)
    setTimeout(() => setToast(''), 3500) 
  }

  const handlePwd = async e => {
    e.preventDefault()
    
    // Validation
    if (pwd.newPass !== pwd.confirm) return showToast('❌ Passwords do not match', 'err')
    if (pwd.newPass.length < 6) return showToast('❌ Password must be at least 6 characters', 'err')
    if (pwd.current === pwd.newPass) return showToast('❌ New password cannot be same as current', 'err')

    setLoading(true)
    try {
      // Backend Endpoint: /api/auth/change-password
      const response = await api.put('/auth/change-password', {
        currentPassword: pwd.current,
        newPassword: pwd.newPass
      })

      showToast('✅ ' + (response.data?.message || 'Password updated successfully!'))
      setPwd({ current: '', newPass: '', confirm: '' })
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to update password'
      showToast('❌ ' + errMsg, 'err')
    } finally {
      setLoading(false)
    }
  }

  const Section = ({ title, children }) => (
    <div style={{
      background: 'var(--clr-card)', border: '1px solid var(--clr-border)',
      borderRadius: 'var(--radius-md)', padding: '30px', marginBottom: 24,
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    }}>
      <h4 style={{ 
        fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 700,
        letterSpacing: '0.08em', color: 'var(--clr-text)', marginBottom: 24,
        display: 'flex', alignItems: 'center', gap: 10
      }}>
        <span style={{ width: 4, height: 18, background: 'var(--clr-accent)', borderRadius: 2 }}></span>
        {title}
      </h4>
      {children}
    </div>
  )

  const lbl = { display: 'block', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--clr-muted)', marginBottom: 10 }

  const API_LIST = [
    { method: 'GET',    path: '/api/projects',      desc: 'Get all projects (public)' },
    { method: 'POST',   path: '/api/projects',      desc: 'Create project (admin)' },
    { method: 'PUT',    path: '/api/projects/:id',  desc: 'Update project (admin)' },
    { method: 'DELETE', path: '/api/projects/:id',  desc: 'Delete project (admin)' },
    { method: 'GET',    path: '/api/contact',       desc: 'Get all messages (admin)' },
    { method: 'DELETE', path: '/api/contact/:id',   desc: 'Delete message (admin)' },
    { method: 'PUT',    path: '/api/auth/change-password', desc: 'Change admin password' },
    { method: 'GET',    path: '/api/health',        desc: 'Server health check' },
  ]

  return (
    <div className="animate-fade-in" style={{ maxWidth: 720 }}>
      {/* Dynamic Toast */}
      {toast && (
        <div className="toast-custom" style={{ 
          borderColor: toastType === 'err' ? 'rgba(255,60,95,0.4)' : 'rgba(198,255,0,0.4)',
          background: 'var(--clr-card)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.4)'
        }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--clr-text)', fontWeight: 500 }}>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: 35 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', letterSpacing: '0.04em', color: 'var(--clr-text)', marginBottom: 8 }}>SETTINGS</h1>
        <p style={{ color: 'var(--clr-muted)', fontSize: '0.9rem', margin: 0 }}>Configure your personal preferences and account security</p>
      </div>

      {/* Account Profile Card */}
      <Section title="ACCOUNT PROFILE">
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 28 }}>
          <div style={{
            width: 70, height: 70,
            background: 'var(--clr-accent)',
            borderRadius: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: '#000', fontWeight: 800,
            boxShadow: `0 0 20px var(--clr-accent)30`
          }}>
            {user?.name?.[0]?.toUpperCase() || 'A'}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--clr-text)', marginBottom: 4 }}>{user?.name}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--clr-muted)', marginBottom: 6 }}>{user?.email}</div>
            <span style={{ 
              fontSize: '0.65rem', color: '#000', background: 'var(--clr-accent)', 
              padding: '3px 10px', borderRadius: 100, fontWeight: 800, letterSpacing: '0.05em' 
            }}>ADMINISTRATOR</span>
          </div>
        </div>
        <div style={{ 
          background: 'rgba(255,255,255,0.03)', border: '1px solid var(--clr-border)', 
          borderRadius: 12, padding: '16px 20px', fontSize: '0.8rem', color: 'var(--clr-muted)',
          display: 'flex', gap: 12, alignItems: 'flex-start'
        }}>
          <i className="bi bi-info-circle-fill" style={{ color: 'var(--clr-accent)', fontSize: '1rem' }}></i>
          <span>
            Profile information is read-only. To modify account details, please contact the system developer or update the User schema.
          </span>
        </div>
      </Section>

      {/* Security Section */}
      <Section title="SECURITY & PASSWORD">
        <form onSubmit={handlePwd}>
          <div className="row g-4">
            <div className="col-12">
              <label style={lbl}>Current Password</label>
              <input className="field" type="password" placeholder="Enter current password" 
                value={pwd.current} onChange={e => setPwd(p => ({ ...p, current: e.target.value }))} required />
            </div>
            <div className="col-md-6">
              <label style={lbl}>New Password</label>
              <input className="field" type="password" placeholder="Min. 6 characters" 
                value={pwd.newPass} onChange={e => setPwd(p => ({ ...p, newPass: e.target.value }))} required />
            </div>
            <div className="col-md-6">
              <label style={lbl}>Confirm New Password</label>
              <input className="field" type="password" placeholder="Repeat new password" 
                value={pwd.confirm} onChange={e => setPwd(p => ({ ...p, confirm: e.target.value }))} required />
            </div>
            <div className="col-12 pt-2">
              <button type="submit" className="btn-accent" disabled={loading} style={{ padding: '12px 32px' }}>
                {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Processing...</> : <><i className="bi bi-shield-lock-fill me-2"></i> Update Security</>}
              </button>
            </div>
          </div>
        </form>
      </Section>

      {/* API Reference */}
      <Section title="DEVELOPER API REFERENCE">
        <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--clr-border)' }}>
          {API_LIST.map((ep, idx) => (
            <div key={idx} style={{
              display: 'flex', alignItems: 'center', gap: 15, padding: '14px 18px',
              borderBottom: idx !== API_LIST.length - 1 ? '1px solid var(--clr-border)' : 'none',
              background: 'rgba(255,255,255,0.01)',
              fontSize: '0.8rem',
            }}>
              <span style={{
                minWidth: 60, padding: '4px 0', borderRadius: 6, textAlign: 'center',
                fontSize: '0.6rem', fontWeight: 900,
                background: ep.method === 'GET' ? 'rgba(96,165,250,0.15)' : ep.method === 'POST' ? 'rgba(77,255,180,0.15)' : ep.method === 'PUT' ? 'rgba(251,146,60,0.15)' : 'rgba(255,60,95,0.15)',
                color: ep.method === 'GET' ? '#60a5fa' : ep.method === 'POST' ? '#4dffb4' : ep.method === 'PUT' ? '#fb923c' : '#ff3c5f',
              }}>
                {ep.method}
              </span>
              <code style={{ color: 'var(--clr-accent)', flex: 1, fontSize: '0.8rem', fontFamily: "'Fira Code', monospace" }}>{ep.path}</code>
              <span style={{ color: 'var(--clr-muted)', fontSize: '0.75rem', textAlign: 'right' }}>{ep.desc}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}