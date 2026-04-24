import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function AdminLogin() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [form, setForm]     = useState({ email: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--clr-bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Grid bg */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)',
        backgroundSize: '56px 56px',
      }} />

      {/* Glow */}
      <div style={{
        position: 'absolute', top: '20%', left: '50%',
        transform: 'translateX(-50%)',
        width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(198,255,0,0.06) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%', maxWidth: 420,
        background: 'var(--clr-card)',
        border: '1px solid var(--clr-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '44px 40px',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Logo */}
        <div className="text-center mb-4">
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 56, height: 56,
            background: 'rgba(198,255,0,0.1)',
            border: '1px solid rgba(198,255,0,0.2)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 16,
          }}>
            <i className="bi bi-shield-lock" style={{ color: 'var(--clr-accent)', fontSize: '1.4rem' }}></i>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', letterSpacing: '0.04em', color: 'var(--clr-text)', marginBottom: 4 }}>
            ADMIN PANEL
          </h2>
          <p style={{ color: 'var(--clr-muted)', fontSize: '0.82rem' }}>Sign in to manage your portfolio</p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(255,60,95,0.1)',
            border: '1px solid rgba(255,60,95,0.25)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 14px',
            marginBottom: 20,
            fontSize: '0.82rem',
            color: '#ff3c5f',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <i className="bi bi-exclamation-circle"></i> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--clr-muted)', marginBottom: 8 }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <i className="bi bi-envelope" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--clr-muted)', fontSize: '0.9rem' }}></i>
              <input
                className="field"
                type="email"
                placeholder="admin@devfolio.com"
                value={form.email}
                onChange={set('email')}
                required
                style={{ paddingLeft: 38 }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--clr-muted)', marginBottom: 8 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <i className="bi bi-lock" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--clr-muted)', fontSize: '0.9rem' }}></i>
              <input
                className="field"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={set('password')}
                required
                style={{ paddingLeft: 38 }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-accent w-100"
            disabled={loading}
            style={{ justifyContent: 'center', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading
              ? <><span className="spinner-border spinner-border-sm me-2"></span>Signing in…</>
              : <><i className="bi bi-box-arrow-in-right"></i> Sign In</>
            }
          </button>
        </form>

        <div className="text-center mt-4">
          <a href="/" style={{ color: 'var(--clr-muted)', fontSize: '0.78rem', textDecoration: 'none', transition: 'color .2s' }}
            onMouseEnter={e => e.target.style.color = 'var(--clr-accent)'}
            onMouseLeave={e => e.target.style.color = 'var(--clr-muted)'}
          >
            <i className="bi bi-arrow-left me-1"></i> Back to Portfolio
          </a>
        </div>
      </div>
    </div>
  )
}
