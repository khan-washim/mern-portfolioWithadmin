import { useState, useEffect, useMemo } from 'react'
import api from '../../utils/api'

const STATUS_COLOR = { unread: '#c6ff00', read: 'var(--clr-muted)', replied: '#4dffb4' }
const STATUS_BG    = { unread: 'rgba(198,255,0,0.08)', read: 'rgba(255,255,255,0.04)', replied: 'rgba(77,255,180,0.08)' }

export default function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading]   = useState(true)
  const [selected, setSelected] = useState(null)
  const [filter, setFilter]     = useState('all')
  const [delId, setDelId]       = useState(null)
  const [toast, setToast]       = useState('')

  const showToast = msg => { 
    setToast(msg); 
    setTimeout(() => setToast(''), 3000) 
  }

  const loadMessages = async () => {
    try {
      setLoading(true)
      const response = await api.get('/contact')
      setMessages(response.data.data || [])
    } catch (err) {
      showToast('❌ Failed to load messages')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMessages()
  }, [])

  const markRead = async id => {
    try {
      await api.patch(`/contact/${id}/read`)
      setMessages(ms => ms.map(m => m._id === id ? { ...m, status: 'read' } : m))
      if (selected?._id === id) setSelected(prev => ({ ...prev, status: 'read' }))
      // showToast('✅ Marked as read') // Optional: UI তে বেশি ডিস্টার্ব না করার জন্য অফ রাখতে পারেন
    } catch { 
      showToast('❌ Update failed') 
    }
  }

  const handleDelete = async id => {
    try {
      await api.delete(`/contact/${id}`)
      setMessages(ms => ms.filter(m => m._id !== id))
      if (selected?._id === id) setSelected(null)
      showToast('🗑️ Message deleted')
    } catch { 
      showToast('❌ Delete failed') 
    }
    setDelId(null)
  }

  // Filter logic memoized for performance
  const filteredMessages = useMemo(() => {
    return filter === 'all' ? messages : messages.filter(m => m.status === filter)
  }, [messages, filter])

  const unreadCount = messages.filter(m => m.status === 'unread').length

  return (
    <div className="animate-fade-in">
      {/* Toast Notification */}
      {toast && (
        <div className="toast-custom" style={{
          position: 'fixed', bottom: 30, right: 30, zIndex: 1100,
          background: 'var(--clr-card)', border: '1px solid var(--clr-border)',
          padding: '12px 24px', borderRadius: 'var(--radius-md)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)', animation: 'slideIn 0.3s ease'
        }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--clr-text)' }}>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', letterSpacing: '0.04em', color: 'var(--clr-text)', marginBottom: 4 }}>MESSAGES</h1>
        <p style={{ color: 'var(--clr-muted)', fontSize: '0.88rem', margin: 0 }}>
          {messages.length} total messages · <span style={{ color: '#c6ff00' }}>{unreadCount} unread</span>
        </p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {[['all','All'],['unread','Unread'],['read','Read'],['replied','Replied']].map(([val, lbl]) => (
          <button key={val} onClick={() => setFilter(val)} style={{
            padding: '8px 20px', borderRadius: '100px',
            background: filter === val ? 'var(--clr-accent)' : 'rgba(255,255,255,0.05)',
            color: filter === val ? '#000' : 'var(--clr-muted)',
            border: filter === val ? 'none' : '1px solid var(--clr-border)',
            cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700,
            transition: 'all .2s ease',
          }}>
            {lbl}
            {val === 'unread' && unreadCount > 0 && (
              <span style={{ 
                marginLeft: 8, 
                background: filter === 'unread' ? '#000' : '#c6ff00', 
                color: filter === 'unread' ? '#c6ff00' : '#000', 
                borderRadius: '100px', padding: '0 8px', fontSize: '0.65rem' 
              }}>
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: 20, transition: 'all 0.3s ease' }}>
        
        {/* List Section */}
        <div style={{ 
          background: 'var(--clr-card)', 
          border: '1px solid var(--clr-border)', 
          borderRadius: 'var(--radius-md)', 
          overflow: 'hidden',
          maxHeight: selected ? 'calc(100vh - 250px)' : 'auto',
          overflowY: 'auto'
        }}>
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} style={{ padding: '20px', borderBottom: '1px solid var(--clr-border)', opacity: 0.5 }}>
                <div className="skeleton-line" style={{ height: 16, width: '40%', marginBottom: 10 }} />
                <div className="skeleton-line" style={{ height: 12, width: '80%' }} />
              </div>
            ))
          ) : filteredMessages.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: 'var(--clr-muted)' }}>
              <i className="bi bi-chat-dots" style={{ fontSize: '2rem', display: 'block', marginBottom: 15, opacity: 0.3 }}></i>
              <p style={{ fontSize: '0.9rem' }}>No messages found in this category.</p>
            </div>
          ) : (
            filteredMessages.map(m => (
              <div
                key={m._id}
                onClick={() => { setSelected(m); if (m.status === 'unread') markRead(m._id) }}
                style={{
                  padding: '18px 20px',
                  borderBottom: '1px solid var(--clr-border)',
                  cursor: 'pointer',
                  background: selected?._id === m._id ? 'rgba(198,255,0,0.05)' : m.status === 'unread' ? 'rgba(198,255,0,0.02)' : 'transparent',
                  borderLeft: selected?._id === m._id ? '4px solid var(--clr-accent)' : '4px solid transparent',
                  transition: 'all .2s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ 
                        fontWeight: m.status === 'unread' ? 700 : 600, 
                        fontSize: '0.9rem', 
                        color: m.status === 'unread' ? 'var(--clr-text)' : 'rgba(255,255,255,0.7)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' 
                      }}>
                        {m.name}
                      </span>
                    </div>
                    <div style={{ 
                      fontSize: '0.82rem', 
                      color: m.status === 'unread' ? 'var(--clr-accent)' : 'var(--clr-muted)', 
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 4 
                    }}>
                      {m.subject}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {m.message}
                    </div>
                  </div>
                  <div style={{ flexShrink: 0, textAlign: 'right' }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--clr-muted)', marginBottom: 6 }}>
                      {new Date(m.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                    </div>
                    <span style={{
                      fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase',
                      color: STATUS_COLOR[m.status], background: STATUS_BG[m.status],
                      padding: '3px 10px', borderRadius: '100px',
                    }}>
                      {m.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Detail Pane */}
        {selected && (
          <div style={{ 
            background: 'var(--clr-card)', 
            border: '1px solid var(--clr-border)', 
            borderRadius: 'var(--radius-md)', 
            padding: '30px', 
            display: 'flex', flexDirection: 'column', gap: 24,
            animation: 'fadeInRight 0.3s ease',
            position: 'sticky', top: 20, height: 'fit-content'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', letterSpacing: '0.02em', color: 'var(--clr-text)', marginBottom: 8, lineHeight: 1.4 }}>
                  {selected.subject}
                </h4>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span style={{
                    fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: STATUS_COLOR[selected.status], background: STATUS_BG[selected.status],
                    padding: '4px 12px', borderRadius: '100px',
                    }}>
                    {selected.status}
                    </span>
                </div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--clr-text)', cursor: 'pointer', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            {/* Sender Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { lbl: 'Sender', val: selected.name, icon: 'bi-person' },
                { lbl: 'Email', val: selected.email, icon: 'bi-envelope' },
                { lbl: 'Received', val: new Date(selected.createdAt).toLocaleString(), icon: 'bi-calendar3' },
                { lbl: 'IP Address', val: selected.ip || 'Unknown', icon: 'bi-hdd-network' },
              ].map(x => (
                <div key={x.lbl} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--clr-border)', borderRadius: 12, padding: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <i className={`bi ${x.icon}`} style={{ color: 'var(--clr-accent)', fontSize: '0.8rem' }}></i>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--clr-muted)' }}>{x.lbl}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--clr-text)', wordBreak: 'break-all', fontWeight: 500 }}>{x.val}</div>
                </div>
              ))}
            </div>

            {/* Message Body */}
            <div style={{ 
                background: 'rgba(255,255,255,0.02)', 
                border: '1px solid var(--clr-border)', 
                borderRadius: 12, padding: '20px' 
            }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--clr-muted)', marginBottom: 12 }}>Content</div>
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>
                {selected.message}
              </p>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 'auto' }}>
              <a
                href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                className="btn-accent"
                style={{ padding: '12px 24px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}
                onClick={() => {
                   // Optional: আপনি চাইলে এখানে রিপ্লাই স্ট্যাটাস আপডেট করার এপিআই কল করতে পারেন
                }}
              >
                <i className="bi bi-reply-fill"></i> Reply Now
              </a>
              
              <button
                onClick={() => setDelId(selected._id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '12px 24px', fontSize: '0.85rem',
                  background: 'rgba(255,60,95,0.08)', border: '1px solid rgba(255,60,95,0.2)',
                  borderRadius: '100px', color: '#ff3c5f', cursor: 'pointer', fontWeight: 700,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,60,95,0.15)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,60,95,0.08)'}
              >
                <i className="bi bi-trash3"></i> Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {delId && (
        <>
          <div onClick={() => setDelId(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, backdropFilter: 'blur(8px)' }} />
          <div style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            zIndex: 1001, width: '90%', maxWidth: 400,
            background: '#111', border: '1px solid var(--clr-border)',
            borderRadius: 'var(--radius-lg)', padding: '40px 30px', textAlign: 'center',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
          }}>
            <div style={{ 
                width: 70, height: 70, background: 'rgba(255,60,95,0.1)', 
                borderRadius: '50%', display: 'flex', alignItems: 'center', 
                justifyContent: 'center', margin: '0 auto 20px' 
            }}>
                <i className="bi bi-exclamation-triangle" style={{ fontSize: '2rem', color: '#ff3c5f' }}></i>
            </div>
            <h5 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--clr-text)', marginBottom: 10 }}>CONFIRM DELETE?</h5>
            <p style={{ color: 'var(--clr-muted)', fontSize: '0.9rem', marginBottom: 30 }}>
                This message from <b>{messages.find(m => m._id === delId)?.name}</b> will be permanently removed.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button 
                className="btn-outline" 
                onClick={() => setDelId(null)} 
                style={{ flex: 1, padding: '12px' }}
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDelete(delId)} 
                style={{
                    flex: 1, padding: '12px', background: '#ff3c5f', color: '#fff',
                    border: 'none', borderRadius: '100px', cursor: 'pointer', 
                    fontWeight: 700, fontSize: '0.9rem'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}