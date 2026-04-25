import { useState, useEffect, useRef } from 'react';
import api from '../utils/api';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  // useReveal বাদ দিয়ে নিজেই IntersectionObserver সেট করা হয়েছে
  // কারণ useReveal hook data load হওয়ার পরে নতুন elements re-observe করে না
  const sectionRef = useRef(null);

  useEffect(() => {
    api.get('/projects')
      .then(r => {
        const fetchedData = r.data.data || r.data;
        setProjects(Array.isArray(fetchedData) ? fetchedData : []);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setProjects([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Data load হওয়ার পরে reveal elements re-observe করা হচ্ছে
  useEffect(() => {
    if (loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const revealEls = sectionRef.current?.querySelectorAll('.reveal');
    revealEls?.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [loading, filter]); // filter বদলালেও re-observe করবে

  const categories = ['All', ...new Set(projects.map(p => p.category || 'Web'))];

  const filtered = filter === 'All'
    ? projects
    : projects.filter(p => (p.category || 'Web').toLowerCase() === filter.toLowerCase());

  return (
    <section id="projects" ref={sectionRef} style={{ padding: '120px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }} className="reveal">
          <span className="section-tag"><i className="bi bi-grid-3x3-gap"></i> Portfolio</span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>Featured <span className="gradient-text">Projects</span></h2>
        </div>

        {/* Category Filter Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 48 }} className="reveal">
          {categories.map(c => (
            <button key={c} onClick={() => setFilter(c)} style={{
              padding: '8px 20px', borderRadius: 50,
              border: `1px solid ${filter === c ? 'transparent' : 'rgba(255,255,255,0.08)'}`,
              background: filter === c ? 'linear-gradient(135deg, #7c6af7, #e879f9)' : 'transparent',
              color: filter === c ? '#fff' : '#6b6880',
              fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
              transition: 'all 0.3s'
            }}>{c}</button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 64 }}>
            <div className="loader-spin"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 64, color: '#6b6880', background: 'rgba(255,255,255,0.02)', borderRadius: 20 }}>
            <i className="bi bi-folder-x" style={{ fontSize: '3rem', display: 'block', marginBottom: 16 }}></i>
            No projects found. Check if they are marked as 'Featured' in Admin.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
            {filtered.map((p, i) => (
              <ProjectCard key={p._id} project={p} delay={i * 0.1} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .loader-spin { width: 48px; height: 48px; border-radius: 50%; border: 3px solid rgba(124,106,247,0.2); border-top: 3px solid #7c6af7; animation: spin 1s linear infinite; margin: 0 auto; }

        /* reveal animation — যদি global CSS এ না থাকে তাহলে এখানে থাকবে */
        .reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .reveal.active {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </section>
  );
}

function ProjectCard({ project: p, delay }) {
  const [hovered, setHovered] = useState(false);
  const techStack = Array.isArray(p.technologies) ? p.technologies : (p.tech || []);

  return (
    <div
      className="glass-card reveal"
      style={{
        overflow: 'hidden',
        transitionDelay: `${delay}s`,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ height: 220, position: 'relative', overflow: 'hidden', background: '#1a1a24' }}>
        {p.image ? (
          <img
            src={p.image}
            alt={p.title}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transition: 'transform 0.5s ease',
              transform: hovered ? 'scale(1.1)' : 'scale(1)'
            }}
          />
        ) : (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="bi bi-code-slash" style={{ fontSize: '3rem', color: 'rgba(124,106,247,0.3)' }}></i>
          </div>
        )}

        {/* Hover Overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(5,5,8,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 15,
          opacity: hovered ? 1 : 0,
          transition: 'all 0.3s ease'
        }}>
          {p.liveUrl && (
            <a href={p.liveUrl} target="_blank" rel="noreferrer" className="btn-primary-custom" style={{ textDecoration: 'none' }}>
              Live Demo
            </a>
          )}
          {p.githubUrl && (
            <a href={p.githubUrl} target="_blank" rel="noreferrer" className="btn-outline-custom" style={{ textDecoration: 'none' }}>
              Source
            </a>
          )}
        </div>

        {p.featured && (
          <span style={{
            position: 'absolute', top: 15, right: 15,
            background: 'linear-gradient(135deg, #7c6af7, #e879f9)',
            color: '#fff', padding: '4px 12px', borderRadius: 50,
            fontSize: '0.7rem', fontWeight: 700
          }}>FEATURED</span>
        )}
      </div>

      <div style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{p.title}</h3>
          <span style={{
            fontSize: '0.7rem', padding: '2px 8px',
            background: 'rgba(124,106,247,0.1)', color: '#7c6af7',
            borderRadius: 4, fontWeight: 600
          }}>{p.category}</span>
        </div>

        <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 20 }}>
          {p.description?.substring(0, 100)}...
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {techStack.slice(0, 4).map(t => (
            <span key={t} style={{ fontSize: '0.75rem', color: '#64748b' }}>#{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}