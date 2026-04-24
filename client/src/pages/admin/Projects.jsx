import { useState, useEffect, useCallback } from 'react'
import api from '../../utils/api'

const EMPTY = { title: '', description: '', image: '', tags: '', liveUrl: '', githubUrl: '', accent: '#c6ff00', featured: false, order: 0 }
const ACCENTS = ['#c6ff00','#ff3c5f','#4dffb4','#60a5fa','#c084fc','#fb923c','#fbbf24','#f472b6']

export default function AdminProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading]   = useState(true)
  const [form, setForm]         = useState(EMPTY)
  const [editing, setEditing]   = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving]     = useState(false)
  const [delId, setDelId]       = useState(null)
  const [toast, setToast]       = useState('')

  const showToast = useCallback(msg => { 
    setToast(msg); 
    setTimeout(() => setToast(''), 3000) 
  }, [])

  const loadProjects = async () => {
    try {
      setLoading(true)
      const r = await api.get('/projects')
      const sorted = (r.data.data || []).sort((a, b) => a.order - b.order)
      setProjects(sorted)
    } catch (err) {
      showToast('❌ Failed to fetch projects')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadProjects() }, [])

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setShowModal(true) }
  const openEdit = p  => { 
    setEditing(p._id); 
    setForm({ ...p, tags: Array.isArray(p.tags) ? p.tags.join(', ') : p.tags }); 
    setShowModal(true) 
  }
  
  const closeModal = () => { 
    setShowModal(false); 
    setEditing(null); 
    setForm(EMPTY) 
  }

  const handleChange = k => e => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(f => ({ ...f, [k]: val }))
  }

  const handleSave = async e => {
    e.preventDefault()
    if (!form.title || !form.description) return showToast('⚠️ Title and Description are required')
    
    setSaving(true)
    try {
      const payload = { 
        ...form, 
        tags: typeof form.tags === 'string' ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : form.tags 
      }
      
      if (editing) {
        await api.put(`/projects/${editing}`, payload)
        showToast('✅ Project updated!')
      } else {
        await api.post('/projects', payload)
        showToast('✅ Project created!')
      }
      closeModal()
      loadProjects()
    } catch (err) {
      showToast('❌ ' + (err.response?.data?.message || 'Save failed'))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async id => {
    try {
      await api.delete(`/projects/${id}`)
      showToast('🗑️ Project deleted')
      loadProjects()
    } catch { showToast('❌ Delete failed') }
    setDelId(null)
  }

  const handleSeed = async () => {
    if (!window.confirm('Seed sample projects?')) return
    try {
      await api.post('/projects/seed')
      showToast('🌱 Samples seeded!')
      loadProjects()
    } catch { showToast('❌ Seed failed') }
  }

  return (
    <div className="animate-fade-in">
      {/* Toast Notification */}
      {toast && (
        <div className="toast-custom" style={{ 
          position: 'fixed', bottom: 30, right: 30, zIndex: 1100,
          background: 'var(--clr-card)', border: '1px solid var(--clr-border)',
          padding: '12px 24px', borderRadius: 'var(--radius-md)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)', animation: 'slideUp 0.3s ease'
        }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--clr-text)' }}>{toast}</span>
        </div>
      )}

      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', letterSpacing: '0.04em', color: 'var(--clr-text)', marginBottom: 6 }}>PROJECTS</h1>
          <p style={{ color: 'var(--clr-muted)', fontSize: '0.9rem', margin: 0 }}>
            Manage portfolio items · <b>{projects.length}</b> total
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={handleSeed} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 20px', borderRadius: '100px',
            background: 'rgba(255,255,255,0.03)', border: '1px solid var(--clr-border)',
            color: 'var(--clr-muted)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
          }}>
            <i className="bi bi-layers"></i> Seed
          </button>
          <button className="btn-accent" onClick={openAdd} style={{ padding: '10px 24px' }}>
            <i className="bi bi-plus-lg"></i> Add New
          </button>
        </div>
      </div>

      {/* Projects Table */}
      <div style={{ background: 'var(--clr-card)', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--clr-border)' }}>
                {['#','Project','Stack','Featured','Actions'].map(h => (
                  <th key={h} style={{
                    padding: '16px 20px', textAlign: 'left',
                    fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: 'var(--clr-muted)',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(4).fill(0).map((_, i) => (
                  <tr key={i}><td colSpan={5} style={{ padding: '20px' }}>
                    <div className="skeleton-line" style={{ height: 20, borderRadius: 4, background: 'rgba(255,255,255,0.03)' }} />
                  </td></tr>
                ))
              ) : projects.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '60px', textAlign: 'center', color: 'var(--clr-muted)' }}>No projects found.</td></tr>
              ) : (
                projects.map((p, idx) => (
                  <tr key={p._id} style={{ borderBottom: '1px solid var(--clr-border)', transition: '0.2s' }}>
                    <td style={{ padding: '14px 20px', color: 'var(--clr-muted)', fontSize: '0.8rem' }}>{p.order || idx + 1}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{
                          width: 45, height: 35, borderRadius: 6, overflow: 'hidden', flexShrink: 0,
                          background: p.accent + '20', border: `1px solid ${p.accent}40`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          {p.image ? <img src={p.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <i className="bi bi-code-slash" style={{ color: p.accent }}></i>}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--clr-text)' }}>{p.title}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--clr-muted)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.description}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {p.tags.slice(0, 2).map(t => (
                          <span key={t} style={{ fontSize: '0.65rem', padding: '2px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: 4 }}>{t}</span>
                        ))}
                        {p.tags.length > 2 && <span style={{ fontSize: '0.65rem', color: 'var(--clr-muted)' }}>+{p.tags.length - 2}</span>}
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      {p.featured && <span style={{ color: '#c6ff00', fontSize: '0.65rem', fontWeight: 800 }}>★ FEATURED</span>}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => openEdit(p)} className="action-btn-blue"><i className="bi bi-pencil"></i></button>
                        <button onClick={() => setDelId(p._id)} className="action-btn-red"><i className="bi bi-trash3"></i></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add/Edit */}
      {showModal && (
        <>
          <div onClick={closeModal} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, backdropFilter: 'blur(8px)' }} />
          <div className="modal-container" style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            zIndex: 1001, width: '95%', maxWidth: 600,
            background: 'var(--clr-card)', border: '1px solid var(--clr-border)',
            borderRadius: 'var(--radius-lg)', padding: '30px',
            maxHeight: '90vh', overflowY: 'auto',
          }}>
            <h4 style={{ fontFamily: 'var(--font-display)', marginBottom: 25 }}>{editing ? 'EDIT PROJECT' : 'ADD PROJECT'}</h4>
            <form onSubmit={handleSave} className="row g-3">
              <div className="col-md-9">
                <label style={lbl}>Title</label>
                <input className="field" value={form.title} onChange={handleChange('title')} required />
              </div>
              <div className="col-md-3">
                <label style={lbl}>Order</label>
                <input className="field" type="number" value={form.order} onChange={handleChange('order')} />
              </div>
              <div className="col-12">
                <label style={lbl}>Description</label>
                <textarea className="field" value={form.description} onChange={handleChange('description')} rows={3} required />
              </div>
              <div className="col-12">
                <label style={lbl}>Tags (Comma Separated)</label>
                <input className="field" value={form.tags} onChange={handleChange('tags')} />
              </div>
              <div className="col-12">
                <label style={lbl}>Image URL</label>
                <input className="field" value={form.image} onChange={handleChange('image')} />
              </div>
              <div className="col-md-6">
                <label style={lbl}>Live URL</label>
                <input className="field" value={form.liveUrl} onChange={handleChange('liveUrl')} />
              </div>
              <div className="col-md-6">
                <label style={lbl}>GitHub URL</label>
                <input className="field" value={form.githubUrl} onChange={handleChange('githubUrl')} />
              </div>
              <div className="col-12">
                <label style={lbl}>Accent Color</label>
                <div style={{ display: 'flex', gap: 10, marginTop: 5 }}>
                  {ACCENTS.map(c => (
                    <button key={c} type="button" onClick={() => setForm(f => ({ ...f, accent: c }))}
                      style={{
                        width: 30, height: 30, borderRadius: '50%', background: c, cursor: 'pointer',
                        transition: '0.2s',
                        border: form.accent === c ? '3px solid #fff' : '2px solid transparent',
                        boxShadow: form.accent === c ? `0 0 10px ${c}` : 'none'
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="col-12">
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.featured} onChange={handleChange('featured')} />
                  <span style={{ fontSize: '0.85rem' }}>Featured Project</span>
                </label>
              </div>
              <div className="col-12 d-flex gap-2 justify-content-end mt-3">
                <button type="button" onClick={closeModal} className="btn-outline">Cancel</button>
                <button type="submit" className="btn-accent" disabled={saving}>{saving ? 'Saving...' : 'Save Project'}</button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* Delete Confirm */}
      {delId && (
        <>
          <div onClick={() => setDelId(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 2000 }} />
          <div style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            zIndex: 2001, width: 350, background: 'var(--clr-card)', borderRadius: 20, padding: 30, textAlign: 'center', border: '1px solid var(--clr-border)'
          }}>
            <p>Delete this project permanently?</p>
            <div className="d-flex gap-2 mt-4">
              <button className="btn-outline w-100" onClick={() => setDelId(null)}>No</button>
              <button className="w-100" style={{ background: '#ff3c5f', border: 'none', borderRadius: 100, color: '#fff' }} onClick={() => handleDelete(delId)}>Delete</button>
            </div>
          </div>
        </>
      )}

      <style>{`
        .action-btn-blue, .action-btn-red {
          width: 34px; height: 34px; border-radius: 8px; border: 1px solid transparent;
          display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s;
        }
        .action-btn-blue { background: rgba(96,165,250,0.1); color: #60a5fa; border-color: rgba(96,165,250,0.1); }
        .action-btn-blue:hover { background: #60a5fa; color: #000; }
        .action-btn-red { background: rgba(255,60,95,0.1); color: #ff3c5f; border-color: rgba(255,60,95,0.1); }
        .action-btn-red:hover { background: #ff3c5f; color: #fff; }
      `}</style>
    </div>
  )
}

const lbl = {
  display: 'block', fontSize: '0.65rem', fontWeight: 800,
  letterSpacing: '0.1em', textTransform: 'uppercase',
  color: 'var(--clr-muted)', marginBottom: 5,
}