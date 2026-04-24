import { useRef } from 'react'
import { useReveal } from '../hooks/useReveal'
// ইমেজ ইম্পোর্ট
import myPhoto from '../assets/my-image.jpg' 

const TOOLS = ['React.js','Node.js','Express.js','MongoDB','Vite','Bootstrap 5','JWT','Mongoose','REST API','Git','Cloudinary','Socket.io']

const TIMELINE = [
  { year: '2022', role: 'Junior Dev', co: 'StartupXYZ' },
  { year: '2023', role: 'Frontend Dev', co: 'TechCorp Ltd.' },
  { year: '2024', role: 'Full Stack Dev', co: 'AgencyPro' },
  { year: '2025', role: 'Senior MERN Dev', co: 'Freelance' },
]

export default function About() {
  const ref = useRef()
  useReveal(ref)

  return (
    <section id="about" className="section-py" style={{ background: 'var(--clr-surface)' }} ref={ref}>
      <div className="container">
        <div className="row g-5 align-items-center">

          {/* ── IMAGE COLUMN ── */}
          <div className="col-lg-5 reveal">
            <div style={{
              position: 'relative',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              aspectRatio: '3/4',
              background: 'var(--clr-card)',
              border: '1px solid var(--clr-border)',
            }}>
              <img
                src={myPhoto} // আপনার কাস্টম ইমেজ এখানে সেট করা হয়েছে
                alt="Khan Washim Uddin"
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: .85 }}
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(8,8,8,.95) 0%, transparent 55%)',
              }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '28px', zIndex: 2 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', letterSpacing: '0.03em', color: 'var(--clr-text)' }}>
                  Khan Washim Uddin
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--clr-accent)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '4px' }}>
                  Full Stack Developer · MERN
                </div>
              </div>
              {/* Accent corner icon */}
              <div style={{
                position: 'absolute', top: 20, right: 20,
                width: 48, height: 48,
                border: '2px solid var(--clr-accent)',
                borderRadius: 'var(--radius-sm)',
                opacity: .35,
                zIndex: 2
              }} />
            </div>
          </div>

          {/* ── TEXT COLUMN ── */}
          <div className="col-lg-7">
            <div className="reveal d1">
              <span className="section-label">— About Me</span>
              <h2 className="display-heading mt-2 mb-4" style={{ fontSize: 'clamp(2.4rem,5vw,4rem)', color: 'var(--clr-text)' }}>
                I BUILD THINGS<br/>
                <span style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.2)', color: 'transparent' }}>FOR THE WEB.</span>
              </h2>
            </div>

            <div className="reveal d2">
              <p style={{ color: 'var(--clr-muted)', lineHeight: 1.85, fontSize: '1rem', marginBottom: 14 }}>
                I'm a passionate Full Stack Developer based in Khulna, Bangladesh with 3+ years of hands-on experience crafting modern web applications. I specialize in the MERN stack and love solving complex problems with clean, maintainable code.
              </p>
              <p style={{ color: 'var(--clr-muted)', lineHeight: 1.85, fontSize: '1rem', marginBottom: 28 }}>
                When I'm not coding, I'm exploring new technologies, contributing to open source, and building user-centric products. Every project is an opportunity to push the boundary of what's possible in the digital world.
              </p>
            </div>

            {/* Technologies Grid */}
            <div className="reveal d3 mb-4">
              <div style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--clr-muted2)', marginBottom: 12 }}>
                Technologies
              </div>
              <div className="d-flex flex-wrap gap-2">
                {TOOLS.map(t => <span className="tag" key={t}>{t}</span>)}
              </div>
            </div>

            {/* Experience Timeline */}
            <div className="reveal d4">
              <div style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--clr-muted2)', marginBottom: 14 }}>
                Experience
              </div>
              <div className="d-flex flex-column gap-3">
                {TIMELINE.map((t, i) => (
                  <div key={i} className="d-flex align-items-center gap-3">
                    <div style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1rem',
                      color: 'var(--clr-accent)',
                      minWidth: '52px',
                      letterSpacing: '0.04em',
                    }}>{t.year}</div>
                    <div style={{ width: 1, height: 28, background: 'var(--clr-border)', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--clr-text)' }}>{t.role}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--clr-muted)' }}>{t.co}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Download Action */}
            <div className="reveal d5 mt-4">
              <a href="#" className="btn-accent" style={{ fontSize: '0.8rem', padding: '12px 28px' }}>
                <i className="bi bi-download"></i> Download CV
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}