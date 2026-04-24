import { useState, useRef } from 'react'
import { useReveal } from '../hooks/useReveal'
import api from '../utils/api'

const SOCIALS = [
  { icon: 'bi-github',    label: 'GitHub',    href: '#' },
  { icon: 'bi-linkedin',  label: 'LinkedIn',  href: '#' },
  { icon: 'bi-twitter-x', label: 'Twitter',   href: '#' },
  { icon: 'bi-facebook',  label: 'Facebook',  href: '#' },
]
const INFO = [
  { icon: 'bi-envelope-at', label: 'Email',    val: 'hello@devfolio.com' },
  { icon: 'bi-telephone',   label: 'Phone',    val: '+880 1700-000000' },
  { icon: 'bi-geo-alt',     label: 'Location', val: 'Dhaka, Bangladesh' },
  { icon: 'bi-clock',       label: 'Response', val: 'Within 24 hours' },
]

export default function Contact() {
  const ref = useRef()
  const [form, setForm] = useState({ name:'', email:'', subject:'', message:'' })
  const [status, setStatus] = useState(null) // null | 'loading' | 'ok' | 'err'
  const [errMsg, setErrMsg] = useState('')
  useReveal(ref)

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setStatus('loading')
    try {
      await api.post('/contact', form)
      setStatus('ok')
      setForm({ name:'', email:'', subject:'', message:'' })
    } catch(err) {
      setStatus('err')
      setErrMsg(err.response?.data?.message || 'Something went wrong. Please try again.')
    }
  }

  return (
    <section id="contact" className="section-py" ref={ref}>
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5 reveal">
          <span className="section-label">— Get In Touch</span>
          <h2 className="display-heading mt-2" style={{ fontSize:'clamp(2.4rem,5vw,4rem)', color:'var(--clr-text)' }}>
            LET'S WORK<br/>
            <span style={{ WebkitTextStroke:'1.5px rgba(255,255,255,.2)', color:'transparent' }}>TOGETHER.</span>
          </h2>
          <p style={{ color:'var(--clr-muted)', maxWidth:440, margin:'16px auto 0', lineHeight:1.8, fontSize:'.95rem' }}>
            Have a project in mind? A question? Or just want to say hi? I'm always open to a conversation.
          </p>
        </div>

        <div className="row g-5 justify-content-center">
          {/* Info */}
          <div className="col-lg-4 reveal d1">
            <div className="d-flex flex-column gap-3 mb-4">
              {INFO.map(x => (
                <div key={x.label} className="glass-card d-flex align-items-center gap-3 p-3">
                  <div style={{
                    width:44, height:44, flexShrink:0,
                    background:'rgba(198,255,0,.07)',
                    border:'1px solid rgba(198,255,0,.12)',
                    borderRadius:'var(--radius-sm)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                  }}>
                    <i className={`bi ${x.icon}`} style={{ color:'var(--clr-accent)', fontSize:'1rem' }}></i>
                  </div>
                  <div>
                    <div style={{ fontSize:'.68rem', fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--clr-muted2)' }}>{x.label}</div>
                    <div style={{ fontSize:'.88rem', color:'var(--clr-text)', marginTop:2 }}>{x.val}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social */}
            <div style={{ fontSize:'.7rem', fontWeight:600, letterSpacing:'.12em', textTransform:'uppercase', color:'var(--clr-muted2)', marginBottom:12 }}>
              Follow Me
            </div>
            <div className="d-flex gap-3">
              {SOCIALS.map(s => (
                <a key={s.label} href={s.href} title={s.label}
                  style={{
                    width:42, height:42,
                    background:'var(--clr-card)',
                    border:'1px solid var(--clr-border)',
                    borderRadius:'var(--radius-sm)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    color:'var(--clr-muted)',
                    textDecoration:'none',
                    transition:'all .2s',
                  }}
                  onMouseEnter={e=>{ e.currentTarget.style.background='var(--clr-accent)'; e.currentTarget.style.color='#000'; e.currentTarget.style.borderColor='var(--clr-accent)'; }}
                  onMouseLeave={e=>{ e.currentTarget.style.background='var(--clr-card)'; e.currentTarget.style.color='var(--clr-muted)'; e.currentTarget.style.borderColor='var(--clr-border)'; }}
                >
                  <i className={`bi ${s.icon}`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="col-lg-7 reveal d2">
            <div className="glass-card p-4 p-lg-5">
              {status === 'ok' ? (
                <div className="text-center py-5">
                  <div style={{ fontSize:'3.5rem', marginBottom:16 }}>🎉</div>
                  <h4 style={{ fontFamily:'var(--font-display)', fontSize:'1.6rem', color:'var(--clr-accent)', letterSpacing:'.04em', marginBottom:8 }}>MESSAGE SENT!</h4>
                  <p style={{ color:'var(--clr-muted)', fontSize:'.9rem' }}>Thanks! I'll get back to you within 24 hours.</p>
                  <button
                    onClick={() => setStatus(null)}
                    style={{ marginTop:20, background:'transparent', border:'1px solid var(--clr-border)', color:'var(--clr-muted)', borderRadius:'100px', padding:'8px 22px', cursor:'pointer', fontSize:'.8rem', fontFamily:'var(--font-body)', fontWeight:600 }}
                  >
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label style={{ display:'block', fontSize:'.7rem', fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--clr-muted2)', marginBottom:8 }}>Name *</label>
                      <input className="field" type="text" placeholder="Your name" value={form.name} onChange={set('name')} required />
                    </div>
                    <div className="col-md-6">
                      <label style={{ display:'block', fontSize:'.7rem', fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--clr-muted2)', marginBottom:8 }}>Email *</label>
                      <input className="field" type="email" placeholder="your@email.com" value={form.email} onChange={set('email')} required />
                    </div>
                    <div className="col-12">
                      <label style={{ display:'block', fontSize:'.7rem', fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--clr-muted2)', marginBottom:8 }}>Subject *</label>
                      <input className="field" type="text" placeholder="Project inquiry…" value={form.subject} onChange={set('subject')} required />
                    </div>
                    <div className="col-12">
                      <label style={{ display:'block', fontSize:'.7rem', fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--clr-muted2)', marginBottom:8 }}>Message *</label>
                      <textarea className="field" rows={5} placeholder="Tell me about your project…" value={form.message} onChange={set('message')} required style={{ resize:'none' }} />
                    </div>

                    {status === 'err' && (
                      <div className="col-12">
                        <div style={{ background:'rgba(255,60,95,.1)', border:'1px solid rgba(255,60,95,.2)', borderRadius:'var(--radius-sm)', padding:'10px 14px', fontSize:'.82rem', color:'#ff3c5f' }}>
                          <i className="bi bi-exclamation-circle me-2"></i>{errMsg}
                        </div>
                      </div>
                    )}

                    <div className="col-12">
                      <button
                        type="submit"
                        className="btn-accent w-100"
                        disabled={status === 'loading'}
                        style={{ justifyContent:'center', opacity: status==='loading' ? .7 : 1, cursor: status==='loading' ? 'not-allowed' : 'pointer' }}
                      >
                        {status === 'loading'
                          ? <><span className="spinner-border spinner-border-sm me-2"></span>Sending…</>
                          : <><i className="bi bi-send"></i> Send Message</>
                        }
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
