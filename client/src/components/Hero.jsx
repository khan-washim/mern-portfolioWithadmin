import { useEffect, useRef } from 'react';
// সঠিক পাথ: '../' দিয়ে components ফোল্ডার থেকে বের হয়ে assets এ ঢুকবে
// আপনার ইমেজের নাম 'my-image.jpg' না হলে এখানে সেই নাম দিয়ে দিন
import myPhoto from '../assets/my-image.jpg'; 

const ROLES = ['Full Stack Developer', 'MERN Expert', 'UI/UX Engineer', 'React Developer'];

export default function Hero() {
  const roleRef = useRef();
  const idx = useRef(0);

  useEffect(() => {
    let charIdx = 0;
    let deleting = false;
    let timeout;

    const type = () => {
      const word = ROLES[idx.current];
      if (!roleRef.current) return;

      if (!deleting) {
        roleRef.current.textContent = word.slice(0, ++charIdx);
        if (charIdx === word.length) {
          deleting = true;
          timeout = setTimeout(type, 1800);
          return;
        }
      } else {
        roleRef.current.textContent = word.slice(0, --charIdx);
        if (charIdx === 0) {
          deleting = false;
          idx.current = (idx.current + 1) % ROLES.length;
        }
      }
      timeout = setTimeout(type, deleting ? 50 : 90);
    };

    timeout = setTimeout(type, 600);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <section
      id="home"
      className="grid-bg"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '100px',
        paddingBottom: '60px',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Background Glows */}
      <div style={{
        position: 'absolute', top: '10%', right: '-5%',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(198,255,0,0.06) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'scaleBreath 10s ease-in-out infinite',
        zIndex: 0,
      }} />
      <div style={{
        position: 'absolute', bottom: '5%', left: '-10%',
        width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(255,60,95,0.05) 0%, transparent 70%)',
        borderRadius: '50%',
        zIndex: 0,
      }} />

      <div className="container position-relative" style={{ zIndex: 1 }}>
        <div className="row align-items-center g-5">

          {/* ── LEFT SIDE ── */}
          <div className="col-lg-7">
            <div className="d-flex align-items-center gap-2 mb-4"
              style={{ opacity: 0, transform: 'translateY(30px)', animation: 'toastIn .7s .1s forwards' }}>
              <span className="live-dot"></span>
              <span style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--clr-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Available for work
              </span>
            </div>

            <h1
              className="display-heading"
              style={{
                fontSize: 'clamp(3.8rem, 9vw, 8rem)',
                color: 'var(--clr-text)',
                opacity: 0,
                animation: 'toastIn .9s .2s forwards',
              }}
            >
              FULL<br />
              <span style={{ WebkitTextStroke: '2px rgba(255,255,255,0.25)', color: 'transparent' }}>STACK</span>
              <span style={{ color: 'var(--clr-accent)' }}>.</span>
            </h1>

            {/* Typewriter */}
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                fontWeight: 300,
                color: 'var(--clr-muted)',
                marginTop: '18px',
                marginBottom: '28px',
                minHeight: '2em',
                opacity: 0,
                animation: 'toastIn .9s .4s forwards',
              }}
            >
              <span ref={roleRef} style={{ color: 'var(--clr-accent)', fontWeight: 500 }}></span>
              <span style={{ animation: 'livePulse 1s infinite' }}>|</span>
            </div>

            <p style={{
              color: 'var(--clr-muted)',
              fontSize: '1rem',
              maxWidth: '520px',
              lineHeight: 1.8,
              marginBottom: '36px',
              opacity: 0,
              animation: 'toastIn .9s .5s forwards',
            }}>
              I build blazing-fast, scalable web apps using the MERN stack.
              From pixel-perfect frontends to rock-solid APIs — I ship products that matter.
            </p>

            <div className="d-flex flex-wrap gap-3"
              style={{ opacity: 0, animation: 'toastIn .9s .6s forwards' }}>
              <a href="/#projects" className="btn-accent">
                View Projects <i className="bi bi-arrow-right"></i>
              </a>
              <a href="/#contact" className="btn-outline">
                Let's Talk
              </a>
            </div>

            {/* Experience Stats */}
            <div className="d-flex gap-5 mt-5"
              style={{ opacity: 0, animation: 'toastIn .9s .8s forwards' }}>
              {[['3+','Years Exp.'],['50+','Projects'],['100%','Satisfaction']].map(([n,l]) => (
                <div key={l}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', color: 'var(--clr-accent)', lineHeight: 1 }}>{n}</div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 500, color: 'var(--clr-muted)', letterSpacing: '0.06em', marginTop: '4px', textTransform: 'uppercase' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT SIDE ── */}
          <div className="col-lg-5 text-center" style={{ opacity: 0, animation: 'toastIn .9s .3s forwards' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              {/* Orbit Ring */}
              <div style={{
                position: 'absolute', inset: '-36px',
                border: '1px dashed rgba(198,255,0,0.2)',
                borderRadius: '50%',
                animation: 'rotateSlow 25s linear infinite',
              }} />
              
              {/* Image */}
              <img
                src={myPhoto}
                alt="Khan Washim Uddin"
                style={{
                  width: '300px',
                  height: '300px',
                  objectFit: 'cover',
                  borderRadius: '28px',
                  border: '2px solid rgba(198,255,0,0.15)',
                  animation: 'floatY 5s ease-in-out infinite',
                  position: 'relative',
                  zIndex: 1,
                }}
              />

              {/* Badges */}
              <div style={{
                position: 'absolute', bottom: '28px', left: '-54px',
                background: 'var(--clr-card)',
                border: '1px solid var(--clr-border)',
                borderRadius: '14px',
                padding: '12px 18px',
                zIndex: 2, textAlign: 'left',
                backdropFilter: 'blur(10px)',
              }}>
                <div style={{ fontSize: '0.62rem', color: 'var(--clr-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Stack</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--clr-text)', letterSpacing: '0.05em' }}>MERN + Vite</div>
              </div>

              <div style={{
                position: 'absolute', top: '20px', right: '-52px',
                background: 'var(--clr-accent)',
                borderRadius: '14px',
                padding: '12px 18px',
                zIndex: 2,
              }}>
                <div style={{ fontSize: '1.3rem' }}>🚀</div>
                <div style={{ fontSize: '0.6rem', fontWeight: 700, color: '#000', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Open<br/>to work</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}