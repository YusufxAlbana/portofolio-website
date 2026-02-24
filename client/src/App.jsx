import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom'
import AdminPage from './AdminPage'
import './index.css'
import { SidebarLeft } from './components/SidebarLeft'
import { SidebarRight } from './components/SidebarRight'
import { MobileNav } from './components/MobileNav'
import { ProfilePage } from './pages/ProfilePage'
import { ProjectsPage } from './pages/ProjectsPage'
import { SkillsPage } from './pages/SkillsPage'
import { BlogPage } from './pages/BlogPage'
import { CertificationPage } from './pages/CertificationPage'
import { EducationPage } from './pages/EducationPage'
import { ContactPage } from './pages/ContactPage'

const API = 'http://localhost:5000/api'

/* ─── Layout ───────────────────────────────────────── */

function Layout({ apiData }) {
  const profile = apiData.profile || {}

  // Ctrl+Shift+A to toggle admin page
  const navigate = useNavigate()
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault()
        navigate('/admin')
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [navigate])

  return (
    <div className="app-layout">
      <SidebarLeft profile={profile} />
      <Outlet />
      <SidebarRight techStack={apiData.skills?.techStack} profile={profile} />
      <MobileNav />
    </div>
  )
}

/* ─── App ──────────────────────────────────────────── */

function App() {
  const [apiData, setApiData] = useState({
    profile: null,
    projects: [],
    blog: [],
    skills: { categories: [], techStack: [] },
    certifications: [],
    education: []
  })
  const [loading, setLoading] = useState(true)

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, projectsRes, blogRes, skillsRes, certRes, eduRes] = await Promise.all([
          fetch(`${API}/data/profile`),
          fetch(`${API}/data/projects`),
          fetch(`${API}/data/blog`),
          fetch(`${API}/data/skills`),
          fetch(`${API}/data/certifications`),
          fetch(`${API}/data/education`),
        ])

        if (!profileRes.ok || !projectsRes.ok || !blogRes.ok || !skillsRes.ok || !certRes.ok || !eduRes.ok) throw new Error('API Error')

        const [profile, projects, blog, skills, certifications, education] = await Promise.all([
          profileRes.json(),
          projectsRes.json(),
          blogRes.json(),
          skillsRes.json(),
          certRes.json(),
          eduRes.json(),
        ])
        setApiData({ profile, projects, blog, skills, certifications, education })
      } catch (err) {
        console.error('Failed to fetch data, make sure server is running.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading && !apiData.profile) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading Portfolio...</p>
      </div>
    )
  }

  // Safe Fallback
  const profile = apiData.profile || {}
  const projects = apiData.projects || []
  const blog = apiData.blog || []
  const skills = apiData.skills || { categories: [], techStack: [] }
  const certifications = apiData.certifications || []
  const education = apiData.education || []

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout apiData={{ profile, projects, blog, skills }} />}>
          <Route path="/" element={<ProfilePage profile={profile} education={education} projects={projects} skills={skills} certifications={certifications} blog={blog} />} />
          <Route path="/profile" element={<Navigate to="/" replace />} />
          <Route path="/projects" element={<ProjectsPage profile={profile} projects={projects} />} />
          <Route path="/skills" element={<SkillsPage skills={skills} />} />
          <Route path="/certifications" element={<CertificationPage profile={profile} certifications={certifications} />} />
          <Route path="/education" element={<EducationPage education={education} />} />
          <Route path="/blog" element={<BlogPage profile={profile} blog={blog} />} />
          <Route path="/contact" element={<ContactPage profile={profile} />} />
        </Route>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
