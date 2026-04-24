import { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const fetchMessages = () => {
    setLoading(true);
    api.get('/contact').then(r => setMessages(r.data.data || r.data)).catch(() => setMessages([])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchMessages(); }, []);

  const markRead = async id => {
    try {
      await api.patch(`/contact/${id}/read`);
      setMessages(prev => prev.map(m => m._id === id ? { ...m, isRead: true } : m));
      if (selected?._id === id) setSelected(m => ({ ...m, isRead: true }));
    } catch { showToast('Failed to mark as read', 'error'); }
  };

  const deleteMsg = async id => {
    try {
      await api.delete(`/contact/${id}`);
      setMessages(prev => prev.filter(m => m._id !== id));
      if (selected?._id === id) setSelected(null);
      showToast('Message deleted!');
    } catch { showToast('Delete failed', 'error'); }
  };

  const openMessage = msg => { setSelected(msg); if (!msg.isRead) markRead(msg._id); };

  const filtered = messages.filter(m => filter === 'all' ? true : filter === 'unread' ? !m.isRead : m.isRead);
  const unreadCount = messages.filter(m => !m.isRead).length;

  return (
    <div>
      {toast && <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 9999, background: toast.type === 'error' ? 'rgba(239,68,68,0.9)' : 'rgba(74,222,128,0.9)', color: '#fff', padding: '12px 20px', borderRadius: 12, fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 8 }}><i className={`bi ${toast.type === 'error' ? 'bi-x-circle' : 'bi-check-circle'}`}></i> {toast.msg}</div>}

      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.8rem', fontWeight: 700 }}>Messages</h1>
        <p style={{ color: '#6b6880', marginTop: 4 }}>{messages.length} total · <span style={{ color: '#7c6af7' }}>{unreadCount} unread</span></p>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {[{ k: 'all', label: `All (${messages.length})` }, { k: 'unread', label: `Unread (${unreadCount})` }, { k: 'read', label: 'Read' }].map(f => (
          <button key={f.k} onClick={() => setFilter(f.k)} style={{ padding: '8px 18px', borderRadius: 50, border: `1px solid ${filter === f.k ? 'transparent' : 'rgba(255,255,255,0.08)'}`, background: filter === f.k ? 'linear-gradient(135deg, #7c6af7, #e879f9)' : 'transparent', color: filter === f.k ? '#fff' : '#6b6880', fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}>{f.label}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: 20 }} className="messages-grid">
        <div style={{ background: '#0d0d14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 48, textAlign: 'center' }}><div style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid rgba(124,106,247,0.2)', borderTop: '3px solid #7c6af7', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div></div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 64, textAlign: 'center', color: '#6b6880' }}><i className="bi bi-inbox" style={{ fontSize: '2.5rem', display: 'block', marginBottom: 12 }}></i>No messages in this category</div>
          ) : filtered.map((m, i) => (
            <div key={m._id} onClick={() => openMessage(m)} style={{ padding: '16px 20px', borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', cursor: 'pointer', background: selected?._id === m._id ? 'rgba(124,106,247,0.08)' : !m.isRead ? 'rgba(124,106,247,0.03)' : 'transparent', borderLeft: selected?._id === m._id ? '3px solid #7c6af7' : '3px solid transparent', transition: 'all 0.15s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: m.isRead ? 500 : 700, fontSize: '0.9rem' }}>{m.name}</span>
                  {!m.isRead && <span style={{ width: 6, height: 6, background: '#7c6af7', borderRadius: '50%' }}></span>}
                </div>
                <span style={{ color: '#6b6880', fontSize: '0.72rem' }}>{new Date(m.createdAt).toLocaleDateString()}</span>
              </div>
              <div style={{ color: '#6b6880', fontSize: '0.8rem', marginBottom: 4 }}>{m.email}</div>
              {m.subject && <div style={{ fontSize: '0.82rem', fontWeight: 500, marginBottom: 4 }}>{m.subject}</div>}
              <div style={{ color: '#6b6880', fontSize: '0.78rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.message}</div>
            </div>
          ))}
        </div>

        {selected && (
          <div style={{ background: '#0d0d14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 28, position: 'relative' }}>
            <button onClick={() => setSelected(null)} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: '#6b6880', cursor: 'pointer', fontSize: '1.1rem' }}><i className="bi bi-x-lg"></i></button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(124,106,247,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#7c6af7' }}>{selected.name?.[0]?.toUpperCase()}</div>
              <div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1rem' }}>{selected.name}</div>
                <a href={`mailto:${selected.email}`} style={{ color: '#7c6af7', fontSize: '0.85rem' }}>{selected.email}</a>
              </div>
            </div>
            {selected.subject && <div style={{ marginBottom: 16 }}><div style={{ fontSize: '0.72rem', color: '#6b6880', marginBottom: 4 }}>SUBJECT</div><div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600 }}>{selected.subject}</div></div>}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: '0.72rem', color: '#6b6880', marginBottom: 8 }}>MESSAGE</div>
              <div style={{ background: '#13131e', borderRadius: 12, padding: 18, color: '#c8c5d8', lineHeight: 1.8, fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>{selected.message}</div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <a href={`mailto:${selected.email}`} className="btn-primary-custom" style={{ flex: 1, justifyContent: 'center', fontSize: '0.85rem' }}><i className="bi bi-reply"></i> Reply</a>
              <button onClick={() => deleteMsg(selected._id)} style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 50, color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontFamily: 'Syne, sans-serif', fontWeight: 600 }}><i className="bi bi-trash"></i></button>
            </div>
            <div style={{ marginTop: 20, padding: '12px 16px', background: '#13131e', borderRadius: 10 }}>
              <span style={{ fontSize: '0.75rem', color: '#6b6880' }}>Received: {new Date(selected.createdAt).toLocaleString()} · Status: <span style={{ color: selected.isRead ? '#4ade80' : '#7c6af7' }}>{selected.isRead ? 'Read' : 'Unread'}</span></span>
            </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) { .messages-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}