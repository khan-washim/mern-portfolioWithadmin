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
      // Backend response structure check kore data set kora
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
      showToast('Project deleted forever!'); 
    } catch { 
      showToast('Delete failed', 'error'); 
    }
  };

  return (
    <div>
      {/* Toast Notification */}
      {toast && (
        <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 9999, background: toast.type === 'error' ? 'rgba(239,68,68,0.95)' : 'rgba(74,222,128,0.95)', color: '#fff', padding: '12px 20px', borderRadius: 12, fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
          <i className={`bi ${toast.type === 'error' ? 'bi-x-circle' : 'bi-check-circle'}`}></i> {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.8rem', fontWeight: 700 }}>Projects Management</h1>
          <p style={{ color: '#6b6880', marginTop: 4 }}>Manage your portfolio works ({projects.length})</p>
        </div>
        <button className="btn-primary-custom" onClick={openAdd}><i className="bi bi-plus-lg"></i> Add New Project</button>
      </div>

      {/* Content Area */}
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
            <div key={p._id} className="admin-project-card">
               <div style={{ height: 160, background: p.image ? `url(${p.image}) center/cover` : '#1a1a24', position: 'relative', borderRadius: '12px 12px 0 0' }}>
                {p.featured && <span className="featured-badge">★ Featured</span>}
              </div>
              <div style={{ padding: 20 }}>
                <h3 style={{ fontSize: '1rem', marginBottom: 8 }}>{p.title}</h3>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button onClick={() => openEdit(p)} className="btn-outline-custom" style={{ flex: 1 }}><i className="bi bi-pencil"></i> Edit</button>
                  <button onClick={() => setDeleteId(p._id)} className="btn-delete-icon"><i className="bi bi-trash"></i></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal & Styles Logic Remains same as your UI... */}
      {/* (Modal UI code goes here - same as provided in your prompt) */}

      <style>{`
        .spinner { width: 40px; height: 40px; border: 3px solid rgba(124,106,247,0.2); border-top: 3px solid #7c6af7; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .admin-project-card { background: #0d0d14; border: 1px solid rgba(255,255,255,0.06); borderRadius: 16px; overflow: hidden; }
        .featured-badge { position: absolute; top: 12; right: 12; background: linear-gradient(135deg, #7c6af7, #e879f9); color: #fff; padding: 2px 10px; borderRadius: 50px; fontSize: 0.7rem; fontWeight: 600; }
        .btn-delete-icon { padding: 9px 14px; background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); border-radius: 50px; color: #f87171; cursor: pointer; }
      `}</style>
    </div>
  );
}