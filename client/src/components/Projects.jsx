import { useState, useRef, useEffect } from 'react'
import { useReveal } from '../hooks/useReveal'
import api from '../utils/api'

const FALLBACK = [
  { _id:'1', title:'Business Dashboard', description:'Admin panel with analytics, auth & role management built on MERN.', tags:['React','Node.js','MongoDB','Chart.js'], image:'https://picsum.photos/600/380?random=10', liveUrl:'#', githubUrl:'#', accent:'#c6ff00' },
  { _id:'2', title:'Hotel Booking App',  description:'Full-featured booking platform with Stripe payment & real-time availability.', tags:['MERN','Stripe','JWT','Bootstrap'], image:'https://picsum.photos/600/380?random=20', liveUrl:'#', githubUrl:'#', accent:'#ff3c5f' },
  { _id:'3', title:'POS System',         description:'Pharmacy point-of-sale with dark mode, invoices & sales analytics.', tags:['React','Express','MongoDB','PWA'], image:'https://picsum.photos/600/380?random=30', liveUrl:'#', githubUrl:'#', accent:'#4dffb4' },
  { _id:'4', title:'E-Commerce Platform',description:'Multi-vendor marketplace with cart, wishlist & admin dashboard.', tags:['MERN','Redux','Cloudinary'], image:'https://picsum.photos/600/380?random=40', liveUrl:'#', githubUrl:'#', accent:'#c084fc' },
  { _id:'5', title:'Task Manager',       description:'Real-time collaborative project tool with drag-and-drop & Socket.io.', tags:['React','Socket.io','Node.js'], image:'https://picsum.photos/600/380?random=50', liveUrl:'#', githubUrl:'#', accent:'#60a5fa' },
  { _id:'6', title:'Blog CMS',           description:'Content management with rich editor, SEO tools & reader analytics.', tags:['React','Node.js','Quill'], image:'https://picsum.photos/600/380?random=60', liveUrl:'#', githubUrl:'#', accent:'#fb923c' },
]

function Card({ p }) {
  const [hov, setHov] = useState(false)
  return (
    <div className="col-md-6 col-lg-4">
      <div
        style={{
          background: 'var(--clr-card)',
          border: `1px solid ${hov ? p.accent + '50' : 'var(--clr-border)'}`,
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          height: '100%',
          transition: 'border-color .3s, transform .3s, box-shadow .3s',
          transform: hov ? 'translateY(-8px)' : 'translateY(0)',
          boxShadow: hov ? `0 20px 50px rgba(0,0,0,.5)` : 'none',
        }}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
      >
        {/* Image */}
        <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden' }}>
          <img
            src={p.image}
            alt={p.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .5s', transform: hov ? 'scale(1.08)' : 'scale(1)' }}
          />
          {/* Overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
            opacity: hov ? 1 : 0,
            transition: 'opacity .3s',
          }}>
            <a href={p.githubUrl} target="_blank" rel="noreferrer"
              style={{ width:44,height:44, background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.15)', borderRadius:'50%', display:'flex',alignItems:'center',justifyContent:'center', color:'#fff', textDecoration:'none', backdropFilter:'blur(8px)' }}>
              <i className="bi bi-github"></i>
            </a>
            <a href={p.liveUrl} target="_blank" rel="noreferrer"
              style={{ width:44,height:44, background:p.accent, borderRadius:'50%', display:'flex',alignItems:'center',justifyContent:'center', color:'#000', textDecoration:'none' }}>
              <i className="bi bi-arrow-up-right"></i>
            </a>
          </div>
          {/* Accent number */}
          <div style={{
            position:'absolute', top:14, left:14,
            background: p.accent, color:'#000',
            fontFamily:'var(--font-display)', fontSize:'.72rem', letterSpacing:'.05em',
            padding:'3px 12px', borderRadius:'100px',
          }}>
            {String(FALLBACK.findIndex(x => x._id === p._id)+1).padStart(2,'0')}
          </div>
        </div>
        {/* Body */}
        <div style={{ padding: '22px 24px 26px' }}>
          <h5 style={{ fontFamily:'var(--font-display)', fontSize:'1.15rem', letterSpacing:'.03em', color:'var(--clr-text)', marginBottom:8 }}>{p.title}</h5>
          <p style={{ fontSize:'.81rem', color:'var(--clr-muted)', lineHeight:1.65, marginBottom:14 }}>{p.description}</p>
          <div className="d-flex flex-wrap gap-2">
            {p.tags.map(t => (
              <span key={t} style={{
                padding:'3px 10px', borderRadius:'100px', fontSize:'.66rem', fontWeight:600, letterSpacing:'.04em',
                background: p.accent+'18', color: p.accent, border:`1px solid ${p.accent}30`,
              }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Projects() {
  const ref = useRef()
  const [projects, setProjects] = useState(FALLBACK)
  useReveal(ref)

  useEffect(() => {
    api.get('/projects').then(r => { if (r.data?.length) setProjects(r.data) }).catch(() => {})
  }, [])

  return (
    <section id="projects" className="section-py" style={{ background: 'var(--clr-surface)' }} ref={ref}>
      <div className="container">
        <div className="d-flex flex-wrap justify-content-between align-items-end mb-5 reveal">
          <div>
            <span className="section-label">— Recent Work</span>
            <h2 className="display-heading mt-2" style={{ fontSize:'clamp(2.4rem,5vw,4rem)', color:'var(--clr-text)' }}>
              FEATURED<br/>PROJECTS
            </h2>
          </div>
          <a href="#" style={{ color:'var(--clr-accent)', fontWeight:600, fontSize:'.82rem', letterSpacing:'.08em', textTransform:'uppercase', textDecoration:'none', borderBottom:'1px solid rgba(198,255,0,.3)', paddingBottom:2 }}>
            View All <i className="bi bi-arrow-right"></i>
          </a>
        </div>
        <div className="row g-4 reveal d1">
          {projects.map(p => <Card key={p._id} p={p} />)}
        </div>
      </div>
    </section>
  )
}
