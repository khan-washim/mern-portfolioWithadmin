import { useEffect } from 'react'
import { Routes, Route, useLocation, Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Contact from './components/Contact'
import { Marquee, Footer } from './components/MarqueeFooter'

// Admin Pages Import
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import Layout from './pages/admin/Layout'
import Messages from './pages/admin/Messages'
import AdminProjects from './pages/admin/Projects'
import Settings from './pages/admin/Settings'

// কাস্টম কার্সার কম্পোনেন্ট
function Cursor() {
  useEffect(() => {
    const dot = document.createElement('div')
    const ring = document.createElement('div')
    dot.className = 'cur'
    ring.className = 'cur-ring'
    document.body.appendChild(dot)
    document.body.appendChild(ring)

    let mx = 0, my = 0, rx = 0, ry = 0
    const onMove = e => { 
      mx = e.clientX; 
      my = e.clientY; 
      dot.style.left = mx + 'px'; 
      dot.style.top = my + 'px' 
    }
    
    const lerp = () => {
      rx += (mx - rx) * 0.12
      ry += (my - ry) * 0.12
      ring.style.left = rx + 'px'
      ring.style.top = ry + 'px'
      requestAnimationFrame(lerp)
    }
    
    lerp()
    window.addEventListener('mousemove', onMove)
    return () => { 
      window.removeEventListener('mousemove', onMove); 
      dot.remove(); 
      ring.remove() 
    }
  }, [])
  return null
}

// হোম পেজ কম্পোনেন্ট
function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <About />
      <Skills />
      <Projects />
      <Contact />
    </>
  )
}

export default function App() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <>
      <Cursor />
      
      {/* ইউজার ইন্টারফেসের জন্য নেভিবার */}
      {!isAdminPath && <Navbar />}
      
      <main>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<Home />} />
          
          {/* Admin Login - লেআউট ছাড়া */}
          <Route path="/admin" element={<Login />} />

          {/* Admin Protected Routes - Nested Structure */}
          <Route path="/admin" element={<Layout />}>
            <Route index element={<Dashboard />} /> {/* /admin এ গেলে ড্যাশবোর্ড দেখাবে */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="messages" element={<Messages />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </main>

      {/* ইউজার ইন্টারফেসের জন্য ফুটার */}
      {!isAdminPath && <Footer />}

      {!isAdminPath && (
        <a href="#home" className="back-top" title="Back to top">
          <i className="bi bi-arrow-up"></i>
        </a>
      )}
    </>
  )
}