import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const links = [
  { label: 'Home',     href: '/#home' },
  { label: 'About',    href: '/#about' },
  { label: 'Skills',   href: '/#skills' },
  { label: 'Projects', href: '/#projects' },
  { label: 'Contact',  href: '/#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav
      className="navbar navbar-expand-lg fixed-top"
      style={{
        background: scrolled ? 'rgba(8,8,8,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        transition: 'all .4s ease',
        padding: '18px 0',
      }}
    >
      <div className="container">
        <a href="/#home" className="navbar-brand navbar-brand-logo text-decoration-none">
          Washim<span style={{ color: 'var(--clr-accent)' }}>Dev</span>
        </a>

        <button
          className="navbar-toggler border-0 p-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          style={{ boxShadow: 'none' }}
        >
          <i className="bi bi-list" style={{ color: 'var(--clr-text)', fontSize: '1.6rem' }}></i>
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-1">
            {links.map(l => (
              <li className="nav-item" key={l.label}>
                <a className="nav-link nav-pill-link" href={l.href}
                  onClick={() => {
                    const c = document.getElementById('mainNav')
                    if (c?.classList.contains('show')) {
                      c.classList.remove('show')
                    }
                  }}
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="nav-item ms-lg-3">
              <a href="/#contact" className="btn-accent" style={{ padding: '10px 24px', fontSize: '0.78rem' }}>
                Hire Me <i className="bi bi-arrow-up-right"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
