export default function Footer() {
  return (
    <footer style={{ padding: '40px 24px', borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.1rem' }}>
          Washim<span style={{ color: '#7c6af7' }}>.</span>
        </div>
        <p style={{ color: '#6b6880', fontSize: '0.85rem' }}>© {new Date().getFullYear()} Washim Khan — Built with MERN Stack</p>
        <p style={{ color: '#6b6880', fontSize: '0.85rem' }}>Crafted with <span style={{ color: '#e879f9' }}>♥</span> in Khulna</p>
      </div>
    </footer>
  );
}