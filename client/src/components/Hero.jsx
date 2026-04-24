import { useEffect, useRef } from 'react';

const roles = ['Full Stack Developer', 'MERN Specialist', 'UI/UX Enthusiast', 'Open Source Lover'];

export default function Hero() {
  const roleRef = useRef(null);
  const idxRef = useRef(0);
  const charRef = useRef(0);
  const deletingRef = useRef(false);

  useEffect(() => {
    let timer;
    const type = () => {
      const current = roles[idxRef.current];
      if (!deletingRef.current) {
        charRef.current++;
        if (roleRef.current) roleRef.current.textContent = current.slice(0, charRef.current);
        if (charRef.current === current.length) { deletingRef.current = true; timer = setTimeout(type, 1800); return; }
      } else {
        charRef.current--;
        if (roleRef.current) roleRef.current.textContent = current.slice(0, charRef.current);
        if (charRef.current === 0) { deletingRef.current = false; idxRef.current = (idxRef.current + 1) % roles.length; }
      }
      timer = setTimeout(type, deletingRef.current ? 50 : 90);
    };
    timer = setTimeout(type, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      position: 'relative', overflow: 'hidden', padding: '120px 24px 80px',
    }}>
      <div style={{ position: 'absolute', top: '10%', right: '5%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(124,106,247,0.12) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '5%', left: '-5%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(232,121,249,0.08) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 64, alignItems: 'center' }}>
          <div style={{ animation: 'fadeUp 0.8s ease forwards' }}>
            <div className="section-tag" style={{ marginBottom: 24 }}>
              <span style={{ width: 6, height: 6, background: '#7c6af7', borderRadius: '50%', display: 'inline-block' }}></span>
              Available for Work
            </div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', marginBottom: 12, lineHeight: 1.05 }}>
              Hi, I'm <span className="gradient-text">Washim Khan</span>
            </h1>
            <h2 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', color: '#6b6880', fontWeight: 400, marginBottom: 24, height: 44, fontFamily: 'DM Sans, sans-serif' }}>
              <span ref={roleRef} style={{ color: '#e8e6f0' }}></span>
              <span style={{ display: 'inline-block', width: 2, height: '1em', background: '#7c6af7', marginLeft: 2, verticalAlign: 'middle', animation: 'blink 1s infinite' }}></span>
            </h2>
            <p style={{ color: '#6b6880', fontSize: '1.05rem', maxWidth: 480, marginBottom: 40, lineHeight: 1.8 }}>
              I build full-stack web applications with clean code, beautiful UI, and scalable architecture. Let's create something remarkable together.
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <a href="#projects" className="btn-primary-custom"><i className="bi bi-grid-3x3-gap"></i> View Projects</a>
              <a href="#contact" className="btn-outline-custom"><i className="bi bi-envelope"></i> Get in Touch</a>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginTop: 56, paddingTop: 40, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              {[{ n: '15+', label: 'Projects' }, { n: '2+', label: 'Years Exp.' }, { n: '100%', label: 'Dedication' }].map(s => (
                <div key={s.label}>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.8rem', fontWeight: 800, color: '#7c6af7' }}>{s.n}</div>
                  <div style={{ fontSize: '0.8rem', color: '#6b6880', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: 340, height: 380 }}>
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(135deg, rgba(124,106,247,0.2), rgba(232,121,249,0.1))',
                borderRadius: 32, border: '1px solid rgba(124,106,247,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '8rem', color: 'rgba(124,106,247,0.3)',
              }}><i className="bi bi-person-circle"></i></div>
              {[
                { icon: 'bi-code-slash', label: 'React', top: -20, right: -20, color: '#61DAFB' },
                { icon: 'bi-database', label: 'MongoDB', bottom: 40, left: -30, color: '#47A248' },
                { icon: 'bi-server', label: 'Node.js', bottom: -20, right: 20, color: '#8CC84B' },
              ].map(b => (
                <div key={b.label} style={{
                  position: 'absolute', top: b.top, right: b.right, bottom: b.bottom, left: b.left,
                  background: '#0d0d14', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 12, padding: '10px 14px',
                  display: 'flex', alignItems: 'center', gap: 8,
                  fontSize: '0.8rem', fontWeight: 600, fontFamily: 'Syne, sans-serif',
                  whiteSpace: 'nowrap', boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                }}>
                  <i className={`bi ${b.icon}`} style={{ color: b.color, fontSize: '1rem' }}></i>
                  {b.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </section>
  );
}