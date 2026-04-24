import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/auth/login', form);
      localStorage.setItem('token', data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050508', padding: 24, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(124,106,247,0.08) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(232,121,249,0.06) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ width: '100%', maxWidth: 440, background: '#0d0d14', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, padding: '48px 40px', boxShadow: '0 24px 64px rgba(0,0,0,0.5)', animation: 'fadeUp 0.5s ease forwards' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ width: 56, height: 56, background: 'linear-gradient(135deg, #7c6af7, #e879f9)', borderRadius: 16, margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: '#fff' }}>
            <i className="bi bi-shield-lock"></i>
          </div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.6rem', fontWeight: 700, marginBottom: 8 }}>Admin Portal</h1>
          <p style={{ color: '#6b6880', fontSize: '0.9rem' }}>Sign in to manage your portfolio</p>
        </div>
        {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: '12px 16px', marginBottom: 24, color: '#f87171', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 8 }}><i className="bi bi-exclamation-circle"></i> {error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 18 }}>
            <label className="form-label">Email Address</label>
            <input className="form-input" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="admin@devfolio.com" />
          </div>
          <div style={{ marginBottom: 28 }}>
            <label className="form-label">Password</label>
            <input className="form-input" type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
          </div>
          <button type="submit" className="btn-primary-custom" style={{ width: '100%', justifyContent: 'center', padding: 14 }} disabled={loading}>
            {loading ? 'Signing in...' : <><i className="bi bi-box-arrow-in-right"></i> Sign In</>}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 24, color: '#6b6880', fontSize: '0.8rem' }}>
          <a href="/" style={{ color: '#7c6af7' }}>← Back to Portfolio</a>
        </p>
      </div>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}