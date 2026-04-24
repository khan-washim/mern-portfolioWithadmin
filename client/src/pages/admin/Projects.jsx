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

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const r = await api.get('/projects');
      setProjects(r.data.data || r.data);
    } catch (err) {
      setProjects([]);
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const openAdd = () => { setForm(emptyForm); setEditId(null); setModal('add'); };
  const openEdit = p => {
    setForm({
      title: p.title || '',
      description: p.description || '',
      technologies: Array.isArray(p.technologies) ? p.technologies.join(', ') : '',
      liveUrl: p.liveUrl || '',
      githubUrl: p.githubUrl || '',
      image: p.image || '',
      category: p.category || 'Web',
      featured: p.featured || false
    });
    setEditId(p._id);
    setModal('edit');
  };

  const handleSave = async () => {
    if (!form.title || !form.description) return showToast('Title and Description are required', 'error');
    setSaving(true);
    const payload = {
      ...form,
      technologies: typeof form.technologies === 'string'
        ? form.technologies.split(',').map(t => t.trim()).filter(Boolean)
        : form.technologies
    };
    try {
      if (modal === 'add') {
        await api.post('/projects', payload);
      } else {
        await api.put(`/projects/${editId}`, payload);
      }
      setModal(null);
      fetchProjects();
      showToast(modal === 'add' ? 'Project added successfully!' : 'Project updated successfully!');
    } catch (err) {
      showToast(err.response?.data?.message || 'Something went wrong', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/projects/${deleteId}`);
      setDeleteId(null);
      fetchProjects();
      showToast('Project deleted!');
    } catch {
      showToast('Delete failed', 'error');
    }
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10, color: '#fff',
    fontSize: '0.9rem', boxSizing: 'border-box',
    outline: 'none', fontFamily: 'inherit'
  };

  const labelStyle = {
    display: 'block', color: '#94a3b8',
    fontSize: '0.82rem', marginBottom: 6, fontWeight: 500
  };

  return (
    <div>
      {/* ── Toast ── */}
      {toast && (
        <div style={{
          position: 'fixed', top: 24, right: 24, zIndex: 9999,
          background: toast.type === 'error' ? 'rgba(239,68,68,0.95)' : 'rgba(74,222,128,0.95)',
          color: '#fff', padding: '12px 20px', borderRadius: 12,
          fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '0.85rem',
          display: 'flex', alignItems: 'center', gap: 8,
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)', animation: 'slideIn 0.3s ease'
        }}>
          <i className={`bi ${toast.type === 'error' ? 'bi-x-circle' : 'bi-check-circle'}`}></i>
          {toast.msg}
        </div>
      )}

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.8rem', fontWeight: 700, margin: 0 }}>Projects Management</h1>
          <p style={{ color: '#6b6880', marginTop: 4, margin: 0 }}>Manage your portfolio works ({projects.length})</p>
        </div>
        <button className="btn-primary-custom" onClick={openAdd}>
          <i className="bi bi-plus-lg"></i> Add New Project
        </button>
      </div>

      {/* ── Project Grid ── */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 64 }}><div className="spinner"></div></div>
      ) : projects.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 80, background: '#0d0d14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, color: '#6b6880' }}>
          <i className="bi bi-collection" style={{ fontSize: '3rem', display: 'block', marginBottom: 16 }}></i>
          No projects found in database.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {projects.map(p => (
            <div key={p._id} style={{ background: '#0d0d14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{
                height: 160,
                background: p.image ? `url(${p.image}) center/cover no-repeat` : '#1a1a24',
                position: 'relative', borderRadius: '12px 12px 0 0'
              }}>
                {!p.image && (
                  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="bi bi-code-slash" style={{ fontSize: '2.5rem', color: 'rgba(124,106,247,0.3)' }}></i>
                  </div>
                )}
                {p.featured && (
                  <span style={{
                    position: 'absolute', top: 12, right: 12,
                    background: 'linear-gradient(135deg, #7c6af7, #e879f9)',
                    color: '#fff', padding: '3px 10px', borderRadius: 50,
                    fontSize: '0.7rem', fontWeight: 700
                  }}>★ Featured</span>
                )}
              </div>
              <div style={{ padding: 20 }}>
                <h3 style={{ fontSize: '1rem', fontFamily: 'Syne, sans-serif', fontWeight: 700, marginBottom: 4 }}>{p.title}</h3>
                <p style={{ color: '#6b6880', fontSize: '0.8rem', marginBottom: 12 }}>{p.category}</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => openEdit(p)} className="btn-outline-custom" style={{ flex: 1 }}>
                    <i className="bi bi-pencil"></i> Edit
                  </button>
                  <button onClick={() => setDeleteId(p._id)} style={{
                    padding: '9px 14px', background: 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.2)', borderRadius: 50,
                    color: '#f87171', cursor: 'pointer'
                  }}>
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Add / Edit Modal ── */}
      {(modal === 'add' || modal === 'edit') && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: 20
        }}
          onClick={e => { if (e.target === e.currentTarget) setModal(null); }}
        >
          <div style={{
            background: '#0d0d14', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 20, padding: 32, width: '100%', maxWidth: 560,
            maxHeight: '90vh', overflowY: 'auto'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>
                {modal === 'add' ? '+ Add New Project' : '✏️ Edit Project'}
              </h2>
              <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', color: '#6b6880', fontSize: '1.2rem', cursor: 'pointer' }}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            {/* Title */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Title *</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="My Awesome Project" style={inputStyle} />
            </div>

            {/* Description */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Description *</label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Brief project description..."
                rows={3}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>

            {/* Technologies */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Technologies (comma separated)</label>
              <input value={form.technologies} onChange={e => setForm(f => ({ ...f, technologies: e.target.value }))} placeholder="React, Node.js, MongoDB" style={inputStyle} />
            </div>

            {/* Category */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={{ ...inputStyle, background: '#1a1a24' }}>
                {['Web', 'Mobile', 'Backend', 'AI/ML', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Live URL */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Live URL</label>
              <input value={form.liveUrl} onChange={e => setForm(f => ({ ...f, liveUrl: e.target.value }))} placeholder="https://myproject.com" style={inputStyle} />
            </div>

            {/* GitHub URL */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>GitHub URL</label>
              <input value={form.githubUrl} onChange={e => setForm(f => ({ ...f, githubUrl: e.target.value }))} placeholder="https://github.com/user/repo" style={inputStyle} />
            </div>

            {/* Image URL */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Image URL</label>
              <input value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} placeholder="https://example.com/image.jpg" style={inputStyle} />
              {form.image && (
                <img src={form.image} alt="preview" style={{ marginTop: 8, width: '100%', height: 120, objectFit: 'cover', borderRadius: 8 }}
                  onError={e => e.target.style.display = 'none'} />
              )}
            </div>

            {/* Featured */}
            <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
              <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#7c6af7' }} />
              <label htmlFor="featured" style={{ color: '#94a3b8', cursor: 'pointer', fontSize: '0.9rem' }}>
                Mark as Featured ⭐
              </label>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setModal(null)} style={{
                flex: 1, padding: '11px', background: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10,
                color: '#6b6880', cursor: 'pointer', fontFamily: 'Syne, sans-serif', fontWeight: 600
              }}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving} className="btn-primary-custom" style={{ flex: 1, opacity: saving ? 0.7 : 1 }}>
                {saving ? <><i className="bi bi-hourglass-split"></i> Saving...</> : modal === 'add' ? <><i className="bi bi-plus-lg"></i> Add Project</> : <><i className="bi bi-check-lg"></i> Save Changes</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteId && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20
        }}>
          <div style={{
            background: '#0d0d14', border: '1px solid rgba(239,68,68,0.25)',
            borderRadius: 20, padding: 32, maxWidth: 400, width: '100%', textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>🗑️</div>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.2rem', fontWeight: 700, marginBottom: 8 }}>Delete Project?</h3>
            <p style={{ color: '#6b6880', marginBottom: 28, fontSize: '0.9rem' }}>This action is permanent and cannot be undone!</p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setDeleteId(null)} style={{
                flex: 1, padding: '11px', background: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10,
                color: '#6b6880', cursor: 'pointer', fontFamily: 'Syne, sans-serif', fontWeight: 600
              }}>
                Cancel
              </button>
              <button onClick={handleDelete} style={{
                flex: 1, padding: '11px',
                background: 'rgba(239,68,68,0.15)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 10, color: '#f87171',
                cursor: 'pointer', fontFamily: 'Syne, sans-serif', fontWeight: 700
              }}>
                <i className="bi bi-trash"></i> Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .spinner { width: 40px; height: 40px; border: 3px solid rgba(124,106,247,0.2); border-top: 3px solid #7c6af7; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}