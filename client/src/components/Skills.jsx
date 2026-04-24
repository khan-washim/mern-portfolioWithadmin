import { useReveal } from '../hooks/useReveal';

const skills = [
  { name: 'React.js', level: 90, color: '#61DAFB', icon: 'bi-code-slash', cat: 'Frontend' },
  { name: 'Node.js', level: 85, color: '#8CC84B', icon: 'bi-server', cat: 'Backend' },
  { name: 'MongoDB', level: 80, color: '#47A248', icon: 'bi-database', cat: 'Database' },
  { name: 'Express.js', level: 85, color: '#7c6af7', icon: 'bi-lightning', cat: 'Backend' },
  { name: 'JavaScript', level: 92, color: '#F7DF1E', icon: 'bi-braces', cat: 'Language' },
  { name: 'TypeScript', level: 70, color: '#3178C6', icon: 'bi-filetype-tsx', cat: 'Language' },
  { name: 'Tailwind CSS', level: 88, color: '#38BDF8', icon: 'bi-palette', cat: 'Frontend' },
  { name: 'REST APIs', level: 90, color: '#e879f9', icon: 'bi-diagram-3', cat: 'Backend' },
  { name: 'Git & GitHub', level: 85, color: '#F05032', icon: 'bi-git', cat: 'Tools' },
  { name: 'Docker', level: 60, color: '#2496ED', icon: 'bi-box', cat: 'Tools' },
  { name: 'JWT Auth', level: 82, color: '#fb923c', icon: 'bi-shield-check', cat: 'Security' },
  { name: 'Redux', level: 75, color: '#764ABC', icon: 'bi-layers', cat: 'Frontend' },
];

const tools = ['VS Code', 'Postman', 'MongoDB Atlas', 'Vercel', 'Netlify', 'Figma', 'Linux', 'AWS S3'];

export default function Skills() {
  const { ref } = useReveal();
  return (
    <section id="skills" ref={ref} style={{ padding: '120px 24px', background: 'rgba(13,13,20,0.5)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }} className="reveal">
          <span className="section-tag"><i className="bi bi-stars"></i> My Skills</span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>Tech <span className="gradient-text">Arsenal</span></h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20, marginBottom: 48 }}>
          {skills.map((s, i) => (
            <div key={s.name} className="glass-card reveal" style={{ padding: '20px 24px', transitionDelay: `${i * 0.04}s` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', color: s.color }}>
                    <i className={`bi ${s.icon}`}></i>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '0.95rem' }}>{s.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#6b6880' }}>{s.cat}</div>
                  </div>
                </div>
                <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: s.color }}>{s.level}%</span>
              </div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${s.level}%`, background: `linear-gradient(90deg, ${s.color}88, ${s.color})`, borderRadius: 2 }}></div>
              </div>
            </div>
          ))}
        </div>
        <div className="reveal" style={{ textAlign: 'center', transitionDelay: '0.3s' }}>
          <p style={{ color: '#6b6880', fontSize: '0.85rem', marginBottom: 16, letterSpacing: '1px', textTransform: 'uppercase' }}>Tools & Platforms</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {tools.map(t => <span key={t} className="badge-tech" style={{ fontSize: '0.8rem', padding: '6px 16px' }}>{t}</span>)}
          </div>
        </div>
      </div>
    </section>
  );
}