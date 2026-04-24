import { useReveal } from '../hooks/useReveal';

const timeline = [
  { year: '2022', title: 'Started MERN Journey', desc: 'Dived into full-stack development with React & Node.js' },
  { year: '2023', title: 'First Freelance Project', desc: 'Built e-commerce platform for local business' },
  { year: '2024', title: 'Open Source Contributions', desc: 'Active contributor to React & MongoDB communities' },
  { year: '2025', title: 'Senior Dev Role', desc: 'Leading full-stack projects end-to-end' },
];

export default function About() {
  const { ref } = useReveal();
  return (
    <section id="about" ref={ref} style={{ padding: '120px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 64, alignItems: 'start' }}>
          <div className="reveal">
            <span className="section-tag"><i className="bi bi-person"></i> About Me</span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: 8 }}>
              Crafting Digital <span className="gradient-text">Experiences</span>
            </h2>
            <div className="section-divider"></div>
            <p style={{ color: '#6b6880', lineHeight: 1.9, marginBottom: 20 }}>
              I'm a passionate Full Stack Developer specializing in the MERN stack. I love turning complex problems into simple, beautiful, and intuitive solutions that make an impact.
            </p>
            <p style={{ color: '#6b6880', lineHeight: 1.9, marginBottom: 32 }}>
              When I'm not coding, you'll find me exploring new technologies, contributing to open source, or writing technical articles to share knowledge with the community.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { icon: 'bi-geo-alt', label: 'Location', val: 'Khulna, Bangladesh' },
                { icon: 'bi-envelope', label: 'Email', val: 'washim@devfolio.com' },
                { icon: 'bi-briefcase', label: 'Status', val: 'Available for Hire' },
                { icon: 'bi-translate', label: 'Languages', val: 'Bengali, English' },
              ].map(i => (
                <div key={i.label} style={{ background: '#0d0d14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 16 }}>
                  <div style={{ color: '#7c6af7', fontSize: '1.1rem', marginBottom: 4 }}><i className={`bi ${i.icon}`}></i></div>
                  <div style={{ fontSize: '0.72rem', color: '#6b6880', marginBottom: 2 }}>{i.label}</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{i.val}</div>
                </div>
              ))}
            </div>
            <a href="#contact" className="btn-primary-custom" style={{ marginTop: 32 }}>
              <i className="bi bi-download"></i> Download CV
            </a>
          </div>

          <div className="reveal" style={{ transitionDelay: '0.2s' }}>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.3rem', marginBottom: 32, color: '#6b6880', fontWeight: 500 }}>My Journey</h3>
            <div style={{ position: 'relative', paddingLeft: 32 }}>
              <div style={{ position: 'absolute', left: 9, top: 0, bottom: 0, width: 2, background: 'linear-gradient(to bottom, #7c6af7, #e879f9, transparent)' }}></div>
              {timeline.map((t, i) => (
                <div key={i} style={{ position: 'relative', marginBottom: 40 }}>
                  <div style={{ position: 'absolute', left: -27, top: 4, width: 16, height: 16, background: 'linear-gradient(135deg, #7c6af7, #e879f9)', borderRadius: '50%', border: '3px solid #050508' }}></div>
                  <div style={{ background: '#0d0d14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '20px 24px', transition: 'border-color 0.3s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(124,106,247,0.3)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}>
                    <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '0.75rem', fontWeight: 700, color: '#7c6af7', letterSpacing: '1px' }}>{t.year}</span>
                    <h4 style={{ fontSize: '1rem', marginTop: 4, marginBottom: 6 }}>{t.title}</h4>
                    <p style={{ fontSize: '0.875rem', color: '#6b6880', lineHeight: 1.6 }}>{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}