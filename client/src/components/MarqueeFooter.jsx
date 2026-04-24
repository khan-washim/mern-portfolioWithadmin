const ITEMS = ['React','✦','Node.js','✦','MongoDB','✦','Express','✦','Vite','✦','Bootstrap 5','✦','REST API','✦','JWT','✦','Mongoose','✦','Full Stack','✦']

export function Marquee() {
  const all = [...ITEMS,...ITEMS]
  return (
    <div className="marquee-outer">
      <div className="marquee-inner">
        {all.map((item, i) => <span key={i}>{item}</span>)}
      </div>
    </div>
  )
}

export function Footer() {
  const SOCIALS = [
    { icon:'bi-github', href:'#' },
    { icon:'bi-linkedin', href:'#' },
    { icon:'bi-twitter-x', href:'#' },
    { icon:'bi-facebook', href:'#' },
  ]
  return (
    <footer style={{ background:'var(--clr-surface)', borderTop:'1px solid var(--clr-border)', padding:'36px 0 28px' }}>
      <div className="container">
        <div className="row align-items-center g-3">
          <div className="col-md-4">
            <a href="/#home" style={{ fontFamily:'var(--font-display)', fontSize:'1.5rem', letterSpacing:'.04em', color:'var(--clr-text)', textDecoration:'none' }}>
              DEV<span style={{ color:'var(--clr-accent)' }}>FOLIO</span>
            </a>
          </div>
          <div className="col-md-4 text-md-center">
            <p style={{ color:'var(--clr-muted)', fontSize:'.78rem', margin:0, letterSpacing:'.03em' }}>
              © 2026 DevFolio — Built with MERN + Vite + Bootstrap
            </p>
          </div>
          <div className="col-md-4">
            <div className="d-flex gap-3 justify-content-md-end">
              {SOCIALS.map(s => (
                <a key={s.icon} href={s.href}
                  style={{ color:'var(--clr-muted)', textDecoration:'none', fontSize:'1.05rem', transition:'color .2s' }}
                  onMouseEnter={e => e.currentTarget.style.color='var(--clr-accent)'}
                  onMouseLeave={e => e.currentTarget.style.color='var(--clr-muted)'}
                >
                  <i className={`bi ${s.icon}`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
