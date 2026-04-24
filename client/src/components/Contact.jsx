import { useState } from 'react';
import api from '../utils/api';
import { useReveal } from '../hooks/useReveal';

export default function Contact() {
  const { ref } = useReveal();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('loading');
    try {
      await api.post('/contact', form);
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch { setStatus('error'); }
    setTimeout(() => setStatus(null), 5000);
  };

  const contactInfo = [
    { icon: 'bi-envelope-open', label: 'Email', val: 'washim@devfolio.com', href: 'mailto:washim@devfolio.com' },
    { icon: 'bi-telephone', label: 'Phone', val: '+880 1234 567890', href: 'tel:+8801234567890' },
    { icon: 'bi-geo-alt', label: 'Location', val: 'Khulna, Bangladesh', href: '#' },
  ];

  const socials = [
    { icon: 'bi-github', href: 'https://github.com/khan-washim', label: 'GitHub' },
    { icon: 'bi-linkedin', href: '#', label: 'LinkedIn' },
    { icon: 'bi-twitter-x', href: '#', label: 'Twitter' },
  ];

  return (
    <section id="contact" ref={ref} style={{ padding: '120px 24px', background: 'rgba(13,13,20,0.5)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }} className="reveal">
          <span className="section-tag"><i className="bi bi-chat-dots"></i> Contact</span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>Let's <span className="gradient-text">Collaborate</span></h2>
          <p style={{ color: '#6b6880', maxWidth: 480, margin: '16px auto 0' }}>Have a project in mind? I'd love to hear about it. Send me a message and let's build something great.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40 }}>
          <div className="reveal">
            <div className="glass-card" style={{ padding: 36, marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.2rem', marginBottom: 24 }}>Contact Info</h3>
              {contactInfo.map(c => (
                <a key={c.label} href={c.href} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'inherit', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#7c6af7'}
                  onMouseLeave={e => e.currentTarget.style.color = 'inherit'}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(124,106,247,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', color: '#7c6af7', flexShrink: 0 }}>
                    <i className={`bi ${c.icon}`}></i>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#6b6880', marginBottom: 2 }}>{c.label}</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{c.val}</div>
                  </div>
                </a>
              ))}
            </div>
            <div className="glass-card" style={{ padding: '24px 36px', display: 'flex', gap: 12, alignItems: 'center' }}>
              <span style={{ color: '#6b6880', fontSize: '0.85rem', marginRight: 4 }}>Find me:</span>
              {socials.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" title={s.label} style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b6880', fontSize: '1.1rem', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#7c6af7'; e.currentTarget.style.color = '#7c6af7'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#6b6880'; }}>
                  <i className={`bi ${s.icon}`}></i>
                </a>
              ))}
            </div>
          </div>
          <div className="reveal" style={{ transitionDelay: '0.2s' }}>
            <div className="glass-card" style={{ padding: 36 }}>
              {status === 'success' && <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 12, padding: '16px 20px', marginBottom: 24, color: '#4ade80', display: 'flex', alignItems: 'center', gap: 10 }}><i className="bi bi-check-circle"></i> Message sent! I'll get back to you soon.</div>}
              {status === 'error' && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: '16px 20px', marginBottom: 24, color: '#f87171', display: 'flex', alignItems: 'center', gap: 10 }}><i className="bi bi-x-circle"></i> Something went wrong. Please try again.</div>}
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div><label className="form-label">Name *</label><input className="form-input" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="John Doe" /></div>
                  <div><label className="form-label">Email *</label><input className="form-input" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="john@email.com" /></div>
                </div>
                <div style={{ marginBottom: 16 }}><label className="form-label">Subject</label><input className="form-input" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="Project collaboration..." /></div>
                <div style={{ marginBottom: 24 }}><label className="form-label">Message *</label><textarea className="form-input" required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Tell me about your project..." /></div>
                <button type="submit" className="btn-primary-custom" style={{ width: '100%', justifyContent: 'center' }} disabled={status === 'loading'}>
                  {status === 'loading' ? 'Sending...' : <><i className="bi bi-send"></i> Send Message</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}