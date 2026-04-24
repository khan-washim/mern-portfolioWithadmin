import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', background: 'var(--clr-bg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner-border" style={{ color: 'var(--clr-accent)', width: 36, height: 36 }} role="status"></div>
          <div style={{ color: 'var(--clr-muted)', fontSize: '0.8rem', marginTop: 12, letterSpacing: '0.08em' }}>LOADING…</div>
        </div>
      </div>
    )
  }

  return user ? children : <Navigate to="/admin" replace />
}
