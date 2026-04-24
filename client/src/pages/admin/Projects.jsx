import { useState, useEffect } from 'react';
import api from '../../utils/api';

const emptyForm = { title: '', description: '', technologies: '', liveUrl: '', githubUrl: '', image: '', category: 'Web', featured: false };

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const fetchProjects = () => {
    setLoading(true);
    api.get('/projects').then(r => setProjects(r.data.data || r.data)).catch(() => setProjects([])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchProjects(); }, []);

  const openAdd = () => { setForm(emptyForm); setEditId(null); setModal('add'); };
  const openEdit = p => {
    setForm({ title: p.title || '', description: p.description || '', technologies: (p.technologies || []).join(', '), liveUrl: p.liveUrl || '', githubUrl: p.githubUrl || '', image: p.image || '', category: p.category || 'Web', featured: p.featured || false });
    setEditId(p._id); setModal('edit');
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = { ...form, technologies: form.technologies.split(',').map(t => t.trim()).filter(Boolean) };
    try {
      if (modal === 'add') await api.post('/projects', payload);
      else await api.put(`/projects/${editId}`, payload);
      setModal(null); fetchProjects(); showToast(modal === 'add' ? 'Project added!' : 'Project updated!');
    } catch { showToast('Something went wrong', 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try { await api.delete(`/projects/${deleteId}`); setDeleteId(null); fetchProjects(); showToast('Project deleted!'); }
    catch { showToast('Delete failed', 'error'); }
  };

  return (
    <div>
      {toast && (
        <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 9999, background: toast.type === 'error' ? 'rgba(239,68,68,0.9)' : 'rgba(74,222,128,0.9)', color: '#fff', padding: '12px 20px', borderRadius: 12, fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 8 }}>
          <i className={`bi ${toast.type === 'error' ? 'bi-x-circle' : 'bi-check-circle'}`}></i> {toast.msg}
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.8rem', fontWeight: 700 }}>Projects</h1>
          <p style={{ color: '#6b6880', marginTop: 4 }}>{projects.length} total projects</p>
        </div>
        <button className="btn-primary-custom" onClick={openAdd}><i className="bi bi-plus-lg"></i> Add Project</button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 64 }}><div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid rgba(124,106,247,0.2)', borderTop: '3px solid #7c6af7', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div></div>
      ) : projects.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 80, background: '#0d0d14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, color: '#6b6880' }}>
          <i className="bi bi-collection" style={{ fontSize: '3rem', display: 'block', marginBottom: 16 }}></i>
          No projects yet.<br /><br /><button className="btn-primary-custom" onClick={openAdd}><i className="bi bi-plus-lg"></i> Add Project</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {projects.map(p => (
            <div key={p._id} style={{ background: '#0d0d14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, overflow: 'hidden', transition: 'border-color 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(124,106,247,0.25)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}>
              <div style={{ height: 160, background: p.image ? `url(${p.image}) center/cover` : 'linear-gradient(135deg, rgba(124,106,247,0.15), rgba(232,121,249,0.08))', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                {!p.image && <i className="bi bi-window-stack" style={{ fontSize: '2.5rem', color: 'rgba(124,106,247,0.4)' }}></i>}
                {p.featured && <span style={{ position: 'absolute', top: 12, right: 12, background: 'linear-gradient(135deg, #7c6af7, #e879f9)', color: '#fff', padding: '2px 10px', borderRadius: 50, fontSize: '0.7rem', fontWeight: 600, fontFamily: 'Syne, sans-serif' }}>★ Featured</span>}
              </div>
              <div style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1rem', fontWeight: 700 }}>{p.title}</h3>
                  <span className="badge-tech" style={{ fontSize: '0.7rem' }}>{p.category || 'Web'}</span>
                </div>
                <p style={{ color: '#6b6880', fontSize: '0.82rem', lineHeight: 1.6, marginBottom: 14 }}>{p.description?.slice(0, 100)}{p.description?.length > 100 ? '...' : ''}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 16 }}>
                  {(p.technologies || []).slice(0, 4).map(t => <span key={t} style={{ fontSize: '0.68rem', padding: '2px 8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 50, color: '#6b6880' }}>{t}</span>)}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => openEdit(p)} className="btn-outline-custom" style={{ flex: 1, justifyContent: 'center', padding: '9px 14px', fontSize: '0.82rem' }}><i className="bi bi-pencil"></i> Edit</button>
                  <button onClick={() => setDeleteId(p._id)} style={{ padding: '9px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 50, color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', fontFamily: 'Syne, sans-serif', fontWeight: 600 }}>
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div style={{ background: '#0d0d14', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 32, width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.3rem', fontWeight: 700 }}>{modal === 'add' ? 'Add New Project' : 'Edit Project'}</h2>
              <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', color: '#6b6880', cursor: 'pointer', fontSize: '1.2rem' }}><i className="bi bi-x-lg"></i></button>
            </div>
            <div style={{ display: 'grid', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div><label className="form-label">Title *</label><input className="form-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="My Project" /></div>
                <div><label className="form-label">Category</label>
                  <select className="form-input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    {['Web', 'Mobile', 'API', 'Tool', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div><label className="form-label">Description *</label><textarea className="form-input" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Project description..." rows={4} /></div>
              <div><label className="form-label">Technologies (comma separated)</label><input className="form-input" value={form.technologies} onChange={e => setForm(f => ({ ...f, technologies: e.target.value }))} placeholder="React, Node.js, MongoDB" /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div><label className="form-label">Live URL</label><input className="form-input" value={form.liveUrl} onChange={e => setForm(f => ({ ...f, liveUrl: e.target.value }))} placeholder="https://..." /></div>
                <div><label className="form-label">GitHub URL</label><input className="form-input" value={form.githubUrl} onChange={e => setForm(f => ({ ...f, githubUrl: e.target.value }))} placeholder="https://github.com/..." /></div>
              </div>
              <div><label className="form-label">Image URL</label><input className="form-input" value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} placeholder="https://image.url/..." /></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} style={{ width: 18, height: 18, accentColor: '#7c6af7', cursor: 'pointer' }} />
                <label htmlFor="featured" style={{ cursor: 'pointer', fontSize: '0.9rem' }}>Mark as Featured</label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
              <button onClick={() => setModal(null)} className="btn-outline-custom" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
              <button onClick={handleSave} className="btn-primary-custom" style={{ flex: 1, justifyContent: 'center' }} disabled={saving}>{saving ? 'Saving...' : modal === 'add' ? 'Add Project' : 'Save Changes'}</button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: '#0d0d14', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 20, padding: 36, width: '100%', maxWidth: 400, textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', color: '#f87171', marginBottom: 16 }}><i className="bi bi-trash3"></i></div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.2rem', marginBottom: 10 }}>Delete Project?</h2>
            <p style={{ color: '#6b6880', fontSize: '0.875rem', marginBottom: 28 }}>This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setDeleteId(null)} className="btn-outline-custom" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
              <button onClick={handleDelete} style={{ flex: 1, padding: 12, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 50, color: '#f87171', cursor: 'pointer', fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '0.9rem' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}