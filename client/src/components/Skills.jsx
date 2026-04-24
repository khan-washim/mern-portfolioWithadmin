import { useRef } from 'react'
import { useReveal, useSkillBars } from '../hooks/useReveal'

const SKILLS = [
  { name: 'React.js',        pct: 93, icon: 'bi-code-slash' },
  { name: 'Node.js + Express', pct: 89, icon: 'bi-server' },
  { name: 'MongoDB',          pct: 86, icon: 'bi-database' },
  { name: 'HTML / CSS',       pct: 97, icon: 'bi-filetype-html' },
  { name: 'Bootstrap 5',      pct: 94, icon: 'bi-bootstrap' },
  { name: 'JavaScript ES6+',  pct: 91, icon: 'bi-braces' },
  { name: 'REST API Design',  pct: 88, icon: 'bi-cloud-arrow-up' },
  { name: 'Git & GitHub',     pct: 86, icon: 'bi-git' },
]

const SERVICES = [
  { icon: 'bi-window-stack',   title: 'Frontend Dev',    desc: 'Pixel-perfect, animated UIs with React & Bootstrap.' },
  { icon: 'bi-hdd-network',    title: 'Backend / API',   desc: 'Scalable REST APIs with Node.js, Express & MongoDB.' },
  { icon: 'bi-shield-lock',    title: 'Auth Systems',    desc: 'JWT, bcrypt, role-based access & secure sessions.' },
  { icon: 'bi-phone',          title: 'Mobile-First',    desc: 'Fully responsive across all screen sizes.' },
  { icon: 'bi-speedometer2',   title: 'Performance',     desc: 'Optimized builds, lazy loading, CDN integration.' },
  { icon: 'bi-cloud-upload',   title: 'Deployment',      desc: 'Vercel, Railway, Render, VPS server setup.' },
]

export default function Skills() {
  const ref = useRef()
  const barRef = useRef()
  useReveal(ref)
  useSkillBars(barRef)

  return (
    <section id="skills" className="section-py" ref={ref}>
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5 reveal">
          <span className="section-label">— My Expertise</span>
          <h2 className="display-heading mt-2" style={{ fontSize: 'clamp(2.4rem,5vw,4rem)', color: 'var(--clr-text)' }}>
            SKILLS & SERVICES
          </h2>
        </div>

        <div className="row g-5" ref={barRef}>
          {/* Skill bars */}
          <div className="col-lg-6 reveal d1">
            <div className="glass-card p-4 p-lg-5">
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', letterSpacing: '0.04em', color: 'var(--clr-text)', marginBottom: '28px' }}>
                PROFICIENCY
              </h4>
              {SKILLS.map(s => (
                <div key={s.name} style={{ marginBottom: '20px' }}>
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <div className="d-flex align-items-center gap-2">
                      <i className={`bi ${s.icon}`} style={{ color: 'var(--clr-accent)', fontSize: '0.85rem' }}></i>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--clr-text)' }}>{s.name}</span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', color: 'var(--clr-accent)' }}>{s.pct}%</span>
                  </div>
                  <div className="skill-track">
                    <div className="skill-fill" data-w={`${s.pct}%`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="col-lg-6 reveal d2">
            <div className="row g-3">
              {SERVICES.map((sv, i) => (
                <div className="col-6" key={sv.title}>
                  <div
                    className="glass-card p-3 h-100"
                    style={{ cursor: 'default' }}
                  >
                    <div style={{
                      width: 44, height: 44,
                      background: 'rgba(198,255,0,0.07)',
                      border: '1px solid rgba(198,255,0,0.12)',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: 14,
                    }}>
                      <i className={`bi ${sv.icon}`} style={{ color: 'var(--clr-accent)', fontSize: '1.1rem' }}></i>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--clr-text)', marginBottom: 6 }}>{sv.title}</div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--clr-muted)', lineHeight: 1.6 }}>{sv.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
