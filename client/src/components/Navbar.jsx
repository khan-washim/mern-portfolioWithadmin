import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#skills', label: 'Skills' },
    { href: '#projects', label: 'Projects' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        padding: '0 24px', transition: 'all 0.4s ease',
        background: scrolled ? 'rgba(5,5,8,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72,
        }}>
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36,
              background: 'linear-gradient(135deg, #7c6af7, #e879f9)',
              borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem', fontWeight: 800, fontFamily: 'Syne, sans-serif', color: '#fff',
            }}>W</div>
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.1rem' }}>
              Washim<span style={{ color: '#7c6af7' }}>.</span>
            </span>
          </a>

          <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {navLinks.map(l => (
              <a key={l.href} href={l.href} style={{
                color: '#6b6880', fontFamily: 'DM Sans, sans-serif', fontWeight: 500,
                fontSize: '0.9rem', padding: '8px 16px', borderRadius: 50,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.target.style.color = '#e8e6f0'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
              onMouseLeave={e => { e.target.style.color = '#6b6880'; e.target.style.background = 'transparent'; }}>
                {l.label}
              </a>
            ))}
            <Link to="/admin/login" style={{
              background: 'linear-gradient(135deg, #7c6af7, #e879f9)',
              color: '#fff', border: 'none', padding: '9px 20px',
              borderRadius: 50, fontFamily: 'Syne, sans-serif', fontWeight: 600,
              fontSize: '0.85rem', marginLeft: 8,
            }}>Admin</Link>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="hamburger-btn" style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#e8e6f0', fontSize: '1.5rem', padding: 4, display: 'none',
          }}>
            <i className={`bi ${menuOpen ? 'bi-x-lg' : 'bi-list'}`}></i>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999,
          background: 'rgba(5,5,8,0.98)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32,
        }}>
          {navLinks.map(l => (
            <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '2rem', color: '#e8e6f0',
            }}
            onMouseEnter={e => e.target.style.color = '#7c6af7'}
            onMouseLeave={e => e.target.style.color = '#e8e6f0'}>{l.label}</a>
          ))}
          <Link to="/admin/login" onClick={() => setMenuOpen(false)} style={{
            background: 'linear-gradient(135deg, #7c6af7, #e879f9)',
            color: '#fff', padding: '12px 32px', borderRadius: 50,
            fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '1rem',
          }}>Admin Panel</Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: block !important; }
        }
      `}</style>
    </>
  );
}