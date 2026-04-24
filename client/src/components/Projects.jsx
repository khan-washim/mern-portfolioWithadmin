import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useReveal } from '../hooks/useReveal';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const { ref } = useReveal();

  useEffect(() => {
    api.get('/projects')
      .then(r => setProjects(r.data.data || r.data))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...new Set(projects.map(p => p.category || 'Web'))];
  const filtered = filter === 'All' ? projects : projects.filter(p => (p.category || 'Web') === filter);

  return (
    <section id="projects" ref={ref} style={{ padding: '120px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }} className="reveal">
          <span className="section-tag"><i className="bi bi-grid-3x3-gap"></i> Portfolio</span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>Featured <span className="gradient-text">Projects</span></h2>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 48 }} className="reveal">
          {categories.map(c => (
            <button key={c} onClick={() => setFilter(c)} style={{
              padding: '8px 20px', borderRadius: 50,
              border: `1px solid ${filter === c ? 'transparent' : 'rgba(255,255,255,0.08)'}`,
              background: filter === c ? 'linear-gradient(135deg, #7c6af7, #e879f9)' : 'transparent',
              color: filter === c ? '#fff' : '#6b6880',
              fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
            }}>{c}</button>
          ))}
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 64 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid rgba(124,106,247,0.2)', borderTop: '3px solid #7c6af7', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 64, color: '#6b6880' }}>
            <i className="bi bi-folder-x" style={{ fontSize: '3rem', display: 'block', marginBottom: 16 }}></i>
            No projects yet. Add some from the admin panel.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
            {filtered.map((p, i) => <ProjectCard key={p._id} project={p} delay={i * 0.06} />)}
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </section>
  );
}

function ProjectCard({ project: p, delay }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="glass-card reveal" style={{ overflow: 'hidden', transitionDelay: `${delay}s` }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div style={{ height: 200, position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, rgba(124,106,247,0.15), rgba(232,121,249,0.08))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {p.image ? (
          <img src={p.image} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease', transform: hovered ? 'scale(1.05)' : 'scale(1)' }} />
        ) : (
          <i className="bi bi-window-stack" style={{ fontSize: '3.5rem', color: 'rgba(124,106,247,0.4)' }}></i>
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(5,5,8,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, opacity: hovered ? 1 : 0, transition: 'opacity 0.3s' }}>
          {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" className="btn-primary-custom" style={{ padding: '10px 18px', fontSize: '0.8rem' }}><i className="bi bi-box-arrow-up-right"></i> Live</a>}
          {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noreferrer" className="btn-outline-custom" style={{ padding: '10px 18px', fontSize: '0.8rem' }}><i className="bi bi-github"></i> Code</a>}
        </div>
        {p.featured && <span style={{ position: 'absolute', top: 14, right: 14, background: 'linear-gradient(135deg, #7c6af7, #e879f9)', color: '#fff', padding: '3px 10px', borderRadius: 50, fontSize: '0.7rem', fontWeight: 600, fontFamily: 'Syne, sans-serif' }}>Featured</span>}
      </div>
      <div style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.05rem', fontWeight: 700 }}>{p.title}</h3>
          {p.category && <span className="badge-tech" style={{ fontSize: '0.7rem' }}>{p.category}</span>}
        </div>
        <p style={{ color: '#6b6880', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: 18 }}>
          {p.description?.slice(0, 120)}{p.description?.length > 120 ? '...' : ''}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {(p.technologies || p.tech || []).slice(0, 5).map(t => (
            <span key={t} style={{ fontSize: '0.72rem', padding: '3px 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 50, color: '#6b6880' }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}