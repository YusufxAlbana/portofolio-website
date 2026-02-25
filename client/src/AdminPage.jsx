import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api')

/* ─── Admin SVG Icons ──────────────────────────────── */

const ic = { width: 18, height: 18, fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', viewBox: '0 0 24 24' }

const AdminIcon = {
    Lock: () => (
        <svg {...ic}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
    ),
    Settings: () => (
        <svg {...ic}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" /></svg>
    ),
    Plus: () => (
        <svg {...ic}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
    ),
    Pencil: () => (
        <svg {...ic}><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
    ),
    FileText: () => (
        <svg {...ic}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
    ),
    User: () => (
        <svg {...ic}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
    ),
    Check: () => (
        <svg {...ic} style={{ color: 'var(--accent)' }}><polyline points="20 6 9 17 4 12" /></svg>
    ),
    X: () => (
        <svg {...ic} style={{ color: '#f4212e' }}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
    ),
    ArrowLeft: () => (
        <svg {...ic} style={{ width: 14, height: 14 }}><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
    ),
    LogOut: () => (
        <svg {...ic} style={{ width: 14, height: 14 }}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
    ),
}

/* ─── Admin Page ───────────────────────────────────── */

export default function AdminPage() {
    const navigate = useNavigate()
    const [token, setToken] = useState(localStorage.getItem('admin_token') || '')
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    // Check if existing token is valid
    useEffect(() => {
        if (token) {
            fetch(`${API}/data/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((r) => {
                    if (r.ok) setIsLoggedIn(true)
                    else {
                        localStorage.removeItem('admin_token')
                        setToken('')
                    }
                })
                .catch(() => {
                    localStorage.removeItem('admin_token')
                    setToken('')
                })
        }
    }, [])

    const handleLogin = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const res = await fetch(`${API}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error)
            localStorage.setItem('admin_token', data.token)
            setToken(data.token)
            setIsLoggedIn(true)
        } catch (err) {
            setError(err.message)
        }
        setLoading(false)
    }

    const handleLogout = () => {
        localStorage.removeItem('admin_token')
        setToken('')
        setIsLoggedIn(false)
    }

    if (!isLoggedIn) {
        return (
            <main className="main-feed">
                <div className="feed-header">
                    <h1><span className="admin-icon-inline"><AdminIcon.Lock /></span> Admin Login</h1>
                    <p>
                        <button className="admin-back-btn" onClick={() => navigate('/')}>
                            <AdminIcon.ArrowLeft /> Back to site
                        </button>
                    </p>
                </div>
                <div className="admin-login">
                    <form onSubmit={handleLogin}>
                        <h2>Enter Admin Password</h2>
                        {error && <div className="admin-error">{error}</div>}
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="admin-input"
                            autoFocus
                        />
                        <button type="submit" className="admin-btn-primary" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                </div>
            </main>
        )
    }

    return <AdminDashboard token={token} onLogout={handleLogout} />
}

/* ─── Admin Dashboard ──────────────────────────────── */

function AdminDashboard({ token, onLogout }) {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('projects')
    const [data, setData] = useState({ projects: [], blog: [], skills: {}, profile: {}, certifications: [], education: [] })
    const [notification, setNotification] = useState(null) // { message, type }

    const tabs = ['projects', 'blog', 'skills', 'certifications', 'education', 'profile']

    // Notification helper
    const showNotification = (message, type = 'success') => {
        setNotification({ message, type })
        // Auto dismiss after 3s
        setTimeout(() => {
            setNotification((prev) => (prev && prev.message === message ? null : prev))
        }, 3000)
    }

    const fetchAll = async () => {
        try {
            const results = {}
            for (const type of ['projects', 'blog', 'skills', 'profile', 'certifications', 'education']) {
                const res = await fetch(`${API}/data/${type}`)
                results[type] = await res.json()
            }
            setData(results)
        } catch (err) {
            showNotification('Error loading data', 'error')
        }
    }

    useEffect(() => {
        fetchAll()
    }, [])

    const authHeaders = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    }

    const addItem = async (type, item) => {
        try {
            const res = await fetch(`${API}/data/${type}`, {
                method: 'POST',
                headers: authHeaders,
                body: JSON.stringify(item),
            })
            if (!res.ok) throw new Error('Failed to add')
            showNotification('Added successfully!', 'success')
            fetchAll()
        } catch (err) {
            showNotification(err.message, 'error')
        }
    }

    const updateItem = async (type, id, item) => {
        try {
            const url = id ? `${API}/data/${type}/${id}` : `${API}/data/${type}/${type}`
            const res = await fetch(url, {
                method: 'PUT',
                headers: authHeaders,
                body: JSON.stringify(item),
            })
            if (!res.ok) throw new Error('Failed to update')
            showNotification('Updated successfully!', 'success')
            fetchAll()
        } catch (err) {
            showNotification(err.message, 'error')
        }
    }

    const deleteItem = async (type, id) => {
        if (!confirm('Are you sure you want to delete this item?')) return
        try {
            const res = await fetch(`${API}/data/${type}/${id}`, {
                method: 'DELETE',
                headers: authHeaders,
            })
            if (!res.ok) throw new Error('Failed to delete')
            showNotification('Deleted successfully!', 'success')
            fetchAll()
        } catch (err) {
            showNotification(err.message, 'error')
        }
    }

    return (
        <main className="admin-feed relative">
            <div className="feed-header">
                <h1><span className="admin-icon-inline"><AdminIcon.Settings /></span> Admin Dashboard</h1>
                <p>
                    <button className="admin-back-btn" onClick={() => navigate('/')}><AdminIcon.ArrowLeft /> Back</button>
                    {' · '}
                    <button className="admin-back-btn" onClick={onLogout}><AdminIcon.LogOut /> Logout</button>
                </p>
            </div>

            {/* Notification Toast */}
            {notification && (
                <div className={`admin-toast ${notification.type}`}>
                    {notification.type === 'success' ? <AdminIcon.Check /> : <AdminIcon.X />}
                    {notification.message}
                </div>
            )}

            <div className="feed-tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        className={`feed-tab ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => { setActiveTab(tab) }}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {activeTab === 'projects' && (
                <ProjectsEditor
                    projects={data.projects}
                    onAdd={(item) => addItem('projects', item)}
                    onUpdate={(id, item) => updateItem('projects', id, item)}
                    onDelete={(id) => deleteItem('projects', id)}
                />
            )}
            {activeTab === 'blog' && (
                <BlogEditor
                    posts={data.blog}
                    onAdd={(item) => addItem('blog', item)}
                    onUpdate={(id, item) => updateItem('blog', id, item)}
                    onDelete={(id) => deleteItem('blog', id)}
                />
            )}
            {activeTab === 'skills' && (
                <SkillsEditor
                    skills={data.skills}
                    onUpdate={(item) => updateItem('skills', 'skills', item)}
                />
            )}
            {activeTab === 'profile' && (
                <ProfileEditor
                    profile={data.profile}
                    onUpdate={(item) => updateItem('profile', 'profile', item)}
                />
            )}
            {activeTab === 'certifications' && (
                <CertificationEditor
                    certifications={data.certifications}
                    onAdd={(item) => addItem('certifications', item)}
                    onUpdate={(id, item) => updateItem('certifications', id, item)}
                    onDelete={(id) => deleteItem('certifications', id)}
                />
            )}
            {activeTab === 'education' && (
                <EducationEditor
                    education={data.education}
                    onAdd={(item) => addItem('education', item)}
                    onUpdate={(id, item) => updateItem('education', id, item)}
                    onDelete={(id) => deleteItem('education', id)}
                />
            )}
        </main>
    )
}

/* ─── Projects Editor ──────────────────────────────── */

function ProjectsEditor({ projects, onAdd, onUpdate, onDelete }) {
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState({ title: '', desc: '', tags: '', images: [] })
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef(null)

    const resetForm = () => {
        setForm({ title: '', desc: '', tags: '', images: [] })
        setEditing(null)
    }

    const startEdit = (proj) => {
        setForm({
            title: proj.title,
            desc: proj.desc || '',
            tags: (proj.tags || []).join(', '),
            images: proj.images || [],
        })
        setEditing(proj.id)
    }

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files)
        if (files.length === 0) return
        setUploading(true)
        try {
            const formData = new FormData()
            files.forEach(f => formData.append('images', f))
            const token = localStorage.getItem('admin_token')
            const res = await fetch(`${API}/upload-cert-images`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            })
            const data = await res.json()
            if (res.ok && data.urls) {
                setForm(prev => ({ ...prev, images: [...prev.images, ...data.urls] }))
            } else {
                alert('Upload failed')
            }
        } catch (err) {
            alert('Upload failed')
        }
        setUploading(false)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const removeImage = (idx) => {
        setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const item = {
            ...form,
            tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        }
        if (editing) {
            onUpdate(editing, item)
        } else {
            onAdd(item)
        }
        resetForm()
    }

    return (
        <div className="admin-section">
            <form className="admin-form" onSubmit={handleSubmit}>
                <h3>{editing ? <><span className="admin-icon-inline"><AdminIcon.Pencil /></span> Edit Project</> : <><span className="admin-icon-inline"><AdminIcon.Plus /></span> Add Project</>}</h3>
                <input className="admin-input" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
                <textarea className="admin-textarea no-resize" placeholder="Description" value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} required />
                <input className="admin-input" placeholder="Tags (comma separated)" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />

                {/* Image Upload */}
                <div className="admin-field">
                    <label>Project Images</label>
                    <input type="file" accept="image/*" multiple ref={fileInputRef} style={{ display: 'none' }} onChange={handleImageUpload} />
                    <button type="button" className="admin-btn-secondary" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                        {uploading ? 'Uploading...' : '📷 Upload Images'}
                    </button>
                    {form.images.length > 0 && (
                        <div className="admin-image-preview-grid">
                            {form.images.map((url, j) => (
                                <div key={j} className="admin-image-preview-item">
                                    <img src={url} alt="" />
                                    <button type="button" onClick={() => removeImage(j)} className="admin-image-remove">✕</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="admin-form-actions">
                    <button type="submit" className="admin-btn-primary">{editing ? 'Update' : 'Add'}</button>
                    {editing && <button type="button" className="admin-btn-secondary" onClick={resetForm}>Cancel</button>}
                </div>
            </form>

            <div className="admin-list">
                {projects.map((proj) => (
                    <div className="admin-list-item" key={proj.id}>
                        <div className="admin-list-info">
                            <strong>{proj.title}</strong>
                            <p>{proj.desc}</p>
                            <div className="admin-tags">
                                {(proj.tags || []).map(t => <span key={t} className="admin-tag">{t}</span>)}
                            </div>
                            {proj.images && proj.images.length > 0 && (
                                <div style={{ display: 'flex', gap: 4, marginTop: 6, flexWrap: 'wrap' }}>
                                    {proj.images.map((url, j) => <img key={j} src={url} alt="" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border-color)' }} />)}
                                </div>
                            )}
                            <span className="admin-time" style={{ fontSize: '12px', color: '#666', marginTop: '4px', display: 'block' }}>
                                {new Date(proj.time).toLocaleString()}
                            </span>
                        </div>
                        <div className="admin-list-actions">
                            <button className="admin-btn-edit" onClick={() => startEdit(proj)}>Edit</button>
                            <button className="admin-btn-delete" onClick={() => onDelete(proj.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

/* ─── Blog Editor ──────────────────────────────────── */

function BlogEditor({ posts, onAdd, onUpdate, onDelete }) {
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState({ title: '', text: '', images: [] })
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef(null)

    const resetForm = () => {
        setForm({ title: '', text: '', images: [] })
        setEditing(null)
    }

    const startEdit = (post) => {
        setForm({ title: post.title, text: post.text, images: post.images || [] })
        setEditing(post.id)
    }

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files)
        if (files.length === 0) return
        setUploading(true)
        try {
            const formData = new FormData()
            files.forEach(f => formData.append('images', f))
            const token = localStorage.getItem('admin_token')
            const res = await fetch(`${API}/upload-blog-images`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            })
            const data = await res.json()
            if (res.ok && data.urls) {
                setForm(prev => ({ ...prev, images: [...prev.images, ...data.urls] }))
            } else {
                alert('Upload failed')
            }
        } catch (err) {
            alert('Upload failed')
        }
        setUploading(false)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const removeImage = (idx) => {
        setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const item = { ...form }
        if (editing) {
            onUpdate(editing, item)
        } else {
            onAdd(item)
        }
        resetForm()
    }

    return (
        <div className="admin-section">
            <form className="admin-form" onSubmit={handleSubmit}>
                <h3>{editing ? <><span className="admin-icon-inline"><AdminIcon.Pencil /></span> Edit Post</> : <><span className="admin-icon-inline"><AdminIcon.Plus /></span> Add Post</>}</h3>
                <input className="admin-input" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
                <textarea className="admin-textarea no-resize" placeholder="Content" value={form.text} onChange={e => setForm({ ...form, text: e.target.value })} required rows={6} />

                {/* Image Upload */}
                <div className="admin-field">
                    <label>Blog Images</label>
                    <input type="file" accept="image/*" multiple ref={fileInputRef} style={{ display: 'none' }} onChange={handleImageUpload} />
                    <button type="button" className="admin-btn-secondary" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                        {uploading ? 'Uploading...' : '📷 Upload Images'}
                    </button>
                    {form.images.length > 0 && (
                        <div className="admin-image-preview-grid">
                            {form.images.map((url, j) => (
                                <div key={j} className="admin-image-preview-item">
                                    <img src={url} alt="" />
                                    <button type="button" onClick={() => removeImage(j)} className="admin-image-remove">✕</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="admin-form-actions">
                    <button type="submit" className="admin-btn-primary">{editing ? 'Update' : 'Add'}</button>
                    {editing && <button type="button" className="admin-btn-secondary" onClick={resetForm}>Cancel</button>}
                </div>
            </form>

            <div className="admin-list">
                {posts.map((post) => (
                    <div className="admin-list-item" key={post.id}>
                        <div className="admin-list-info">
                            <strong>{post.title}</strong>
                            <p>{post.text.slice(0, 100)}...</p>
                            {post.images && post.images.length > 0 && (
                                <div style={{ display: 'flex', gap: 4, marginTop: 6, flexWrap: 'wrap' }}>
                                    {post.images.map((url, j) => <img key={j} src={url} alt="" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border-color)' }} />)}
                                </div>
                            )}
                            <span className="admin-time" style={{ fontSize: '12px', color: '#666', marginTop: '4px', display: 'block' }}>
                                {new Date(post.time).toLocaleString()}
                            </span>
                        </div>
                        <div className="admin-list-actions">
                            <button className="admin-btn-edit" onClick={() => startEdit(post)}>Edit</button>
                            <button className="admin-btn-delete" onClick={() => onDelete(post.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

/* ─── Skills Editor ────────────────────────────────── */

function SkillsEditor({ skills, onUpdate }) {
    const [techStack, setTechStack] = useState([])
    const [newSkillName, setNewSkillName] = useState('')
    const [uploading, setUploading] = useState(null) // index of uploading skill
    const fileRefs = useRef({})

    useEffect(() => {
        if (skills?.techStack) {
            // Handle both old format (string[]) and new format ({name, logo}[])
            const normalized = skills.techStack.map(t =>
                typeof t === 'string' ? { name: t, logo: '' } : t
            )
            setTechStack(normalized)
        }
    }, [skills])

    const handleSubmit = (e) => {
        e.preventDefault()
        onUpdate({
            categories: [],
            techStack,
        })
    }

    const addSkill = () => {
        if (!newSkillName.trim()) return
        setTechStack([...techStack, { name: newSkillName.trim(), logo: '' }])
        setNewSkillName('')
    }

    const removeSkill = (i) => {
        setTechStack(techStack.filter((_, idx) => idx !== i))
    }

    const updateSkillName = (i, name) => {
        const updated = [...techStack]
        updated[i] = { ...updated[i], name }
        setTechStack(updated)
    }

    const handleLogoUpload = async (i, e) => {
        const file = e.target.files[0]
        if (!file) return
        setUploading(i)
        try {
            const formData = new FormData()
            formData.append('logo', file)
            const token = localStorage.getItem('admin_token')
            const res = await fetch(`${API}/upload-skill-logo`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            })
            const data = await res.json()
            if (res.ok && data.url) {
                const updated = [...techStack]
                updated[i] = { ...updated[i], logo: data.url }
                setTechStack(updated)
            } else {
                alert(`Upload failed: ${data.error || 'Unknown error'}`)
            }
        } catch (err) {
            console.error('Upload failed', err)
            alert('Upload failed.')
        }
        setUploading(null)
    }

    const removeLogo = (i) => {
        const updated = [...techStack]
        updated[i] = { ...updated[i], logo: '' }
        setTechStack(updated)
    }

    return (
        <div className="admin-section">
            <form className="admin-form" onSubmit={handleSubmit}>
                <h3><span className="admin-icon-inline"><AdminIcon.FileText /></span> Edit Skills</h3>

                {/* Add new skill */}
                <div className="admin-skill-row" style={{ marginBottom: 16 }}>
                    <input
                        className="admin-input"
                        placeholder="New skill name (e.g. React)"
                        value={newSkillName}
                        onChange={e => setNewSkillName(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill() } }}
                    />
                    <button type="button" className="admin-btn-secondary" onClick={addSkill}>
                        <AdminIcon.Plus /> Add
                    </button>
                </div>

                {/* Skills list */}
                <div className="admin-list">
                    {techStack.map((skill, i) => (
                        <div className="admin-list-item" key={i} style={{ alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
                                {/* Logo preview */}
                                <div className="admin-logo-preview" style={{ minWidth: 40, width: 40, height: 40, borderRadius: 8, flexShrink: 0 }}>
                                    {skill.logo ? <img src={skill.logo} alt="" /> : <AdminIcon.FileText />}
                                </div>
                                {/* Name input */}
                                <input
                                    className="admin-input"
                                    value={skill.name}
                                    onChange={e => updateSkillName(i, e.target.value)}
                                    style={{ flex: 1 }}
                                />
                            </div>
                            <div className="admin-list-actions" style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
                                <input
                                    type="file"
                                    accept="image/*,.svg"
                                    ref={el => fileRefs.current[i] = el}
                                    style={{ display: 'none' }}
                                    onChange={e => handleLogoUpload(i, e)}
                                />
                                <button
                                    type="button"
                                    className="admin-upload-btn"
                                    onClick={() => fileRefs.current[i]?.click()}
                                    disabled={uploading === i}
                                    style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                                >
                                    {uploading === i ? '...' : skill.logo ? '🔄' : '📷'}
                                </button>
                                {skill.logo && (
                                    <button type="button" className="admin-btn-delete" onClick={() => removeLogo(i)} style={{ fontSize: '0.7rem', padding: '4px 8px' }}>✕</button>
                                )}
                                <button type="button" className="admin-btn-delete" onClick={() => removeSkill(i)} style={{ fontSize: '0.75rem', padding: '4px 10px' }}>Delete</button>
                            </div>
                        </div>
                    ))}
                    {techStack.length === 0 && <div className="admin-empty-state">No skills added yet.</div>}
                </div>

                <div className="admin-form-actions" style={{ marginTop: 16 }}>
                    <button type="submit" className="admin-btn-primary">Save Skills</button>
                </div>
            </form>
        </div>
    )
}

/* ─── Profile Editor ───────────────────────────────── */

function ProfileEditor({ profile, onUpdate }) {
    const [form, setForm] = useState({})

    useEffect(() => {
        if (profile) setForm(profile)
    }, [profile])

    const handleSubmit = (e) => {
        e.preventDefault()
        onUpdate(form)
    }

    const fields = [
        { key: 'name', label: 'Name' },
        { key: 'handle', label: 'Handle' },
        { key: 'location', label: 'Location' },
        { key: 'education', label: 'Education' },
        { key: 'email', label: 'Email' },
        { key: 'website', label: 'Website' },
        { key: 'birthday', label: 'Birthday' },
        { key: 'following', label: 'Following', type: 'number' },
        { key: 'followers', label: 'Followers' }, // Changed to text to handle both "1,247" string and numbers if needed, but keeping simple
    ]

    return (
        <div className="admin-section">
            <form className="admin-form" onSubmit={handleSubmit}>
                <h3><span className="admin-icon-inline"><AdminIcon.User /></span> Edit Profile</h3>

                {fields.map(({ key, label, type }) => (
                    <div className="admin-field" key={key}>
                        <label>{label}</label>
                        <input
                            className={`admin-input ${type === 'number' ? 'no-spinner' : ''}`}
                            type={type || 'text'}
                            value={form[key] ?? ''} // nullish coalescing allows 0 to be shown
                            onChange={e => setForm({ ...form, [key]: type === 'number' ? Number(e.target.value) : e.target.value })}
                        />
                    </div>
                ))}

                <div className="admin-field">
                    <label>Bio</label>
                    <textarea className="admin-textarea no-resize" value={form.bio || ''} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3} />
                </div>

                <div className="admin-form-actions">
                    <button type="submit" className="admin-btn-primary">Save Profile</button>
                </div>
            </form>
        </div>
    )
}
/* ─── Certification Editor ─────────────────────────── */

function CertificationEditor({ certifications, onAdd, onUpdate, onDelete }) {
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState({ title: '', images: [] })
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef(null)

    const resetForm = () => {
        setForm({ title: '', images: [] })
        setEditing(null)
    }

    const startEdit = (item) => {
        setForm({ title: item.title, images: item.images || [] })
        setEditing(item.id)
    }

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files)
        if (files.length === 0) return
        setUploading(true)
        try {
            const formData = new FormData()
            files.forEach(f => formData.append('images', f))
            const token = localStorage.getItem('admin_token')
            const res = await fetch(`${API}/upload-cert-images`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            })
            const data = await res.json()
            if (res.ok && data.urls) {
                setForm(prev => ({ ...prev, images: [...prev.images, ...data.urls] }))
            } else {
                alert('Upload failed')
            }
        } catch (err) {
            alert('Upload failed')
        }
        setUploading(false)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const removeImage = (idx) => {
        setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const item = { ...form }
        if (editing) {
            onUpdate(editing, item)
        } else {
            onAdd(item)
        }
        resetForm()
    }

    return (
        <div className="admin-section">
            <form className="admin-form" onSubmit={handleSubmit}>
                <h3>{editing ? <><span className="admin-icon-inline"><AdminIcon.Pencil /></span> Edit Certification</> : <><span className="admin-icon-inline"><AdminIcon.Plus /></span> Add Certification</>}</h3>

                <input className="admin-input" placeholder="Certification title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />

                {/* Image Upload */}
                <div className="admin-field">
                    <label>Certificate Images</label>
                    <input type="file" accept="image/*" multiple ref={fileInputRef} style={{ display: 'none' }} onChange={handleImageUpload} />
                    <button type="button" className="admin-btn-secondary" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                        {uploading ? 'Uploading...' : '📷 Upload Images'}
                    </button>
                    {form.images.length > 0 && (
                        <div className="admin-image-preview-grid">
                            {form.images.map((url, j) => (
                                <div key={j} className="admin-image-preview-item">
                                    <img src={url} alt="" />
                                    <button type="button" onClick={() => removeImage(j)} className="admin-image-remove">✕</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="admin-form-actions">
                    <button type="submit" className="admin-btn-primary">{editing ? 'Update' : 'Add'}</button>
                    {editing && <button type="button" className="admin-btn-secondary" onClick={resetForm}>Cancel</button>}
                </div>
            </form>

            <div className="admin-list">
                {(certifications || []).map((item) => (
                    <div className="admin-list-item" key={item.id}>
                        <div className="admin-list-info">
                            <strong>{item.title}</strong>
                            {item.images && item.images.length > 0 && (
                                <div style={{ display: 'flex', gap: 4, marginTop: 6, flexWrap: 'wrap' }}>
                                    {item.images.map((url, j) => <img key={j} src={url} alt="" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border-color)' }} />)}
                                </div>
                            )}
                            <span className="admin-time" style={{ fontSize: '12px', color: '#666', marginTop: '4px', display: 'block' }}>
                                {new Date(item.time).toLocaleString()}
                            </span>
                        </div>
                        <div className="admin-list-actions">
                            <button className="admin-btn-edit" onClick={() => startEdit(item)}>Edit</button>
                            <button className="admin-btn-delete" onClick={() => onDelete(item.id)}>Delete</button>
                        </div>
                    </div>
                ))}
                {(!certifications || certifications.length === 0) && <div className="admin-empty-state">No certifications added yet.</div>}
            </div>
        </div>
    )
}

/* ─── Education Editor ─────────────────────────────── */

function EducationEditor({ education, onAdd, onUpdate, onDelete }) {
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState({ school: '', degree: '', major: '', location: '', duration: '', desc: '', logo: '', currentlyEnrolled: false })
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef(null)

    const resetForm = () => {
        setForm({ school: '', degree: '', major: '', location: '', duration: '', desc: '', logo: '', currentlyEnrolled: false })
        setEditing(null)
    }

    const startEdit = (item) => {
        setForm({
            school: item.school || '',
            degree: item.degree || '',
            major: item.major || '',
            location: item.location || '',
            duration: item.duration || '',
            desc: item.desc || '',
            logo: item.logo || '',
            currentlyEnrolled: item.currentlyEnrolled || false,
        })
        setEditing(item.id)
    }

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        setUploading(true)
        try {
            const formData = new FormData()
            formData.append('logo', file)
            const token = localStorage.getItem('admin_token')
            const res = await fetch(`${API}/upload`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            })
            const data = await res.json()
            if (res.ok && data.url) {
                setForm(prev => ({ ...prev, logo: data.url }))
                alert('Logo uploaded successfully!')
            } else {
                alert(`Upload failed: ${data.error || 'Unknown error'}`)
            }
        } catch (err) {
            console.error('Upload failed', err)
            alert('Upload failed. Check console for details.')
        }
        setUploading(false)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const item = { ...form }
        if (editing) {
            onUpdate(editing, item)
        } else {
            onAdd(item)
        }
        resetForm()
    }

    return (
        <div className="admin-section">
            <form className="admin-form" onSubmit={handleSubmit}>
                <h3>{editing ? <><span className="admin-icon-inline"><AdminIcon.Pencil /></span> Edit Education</> : <><span className="admin-icon-inline"><AdminIcon.Plus /></span> Add Education</>}</h3>

                {/* Logo Upload */}
                <div className="admin-field">
                    <label>School Logo</label>
                    <div className="admin-logo-upload">
                        <div className="admin-logo-preview">
                            {form.logo ? <img src={form.logo} alt="Logo" /> : <AdminIcon.FileText />}
                        </div>
                        <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleLogoUpload} />
                        <button type="button" className="admin-upload-btn" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                            {uploading ? 'Uploading...' : form.logo ? 'Change Logo' : 'Upload Logo'}
                        </button>
                        {form.logo && <button type="button" className="admin-btn-delete" style={{ fontSize: '0.8rem', padding: '4px 10px' }} onClick={() => setForm({ ...form, logo: '' })}>Remove</button>}
                    </div>
                </div>

                <div className="admin-grid">
                    <div className="admin-field">
                        <label>School / University</label>
                        <input className="admin-input" placeholder="e.g. MIT" value={form.school} onChange={e => setForm({ ...form, school: e.target.value })} required />
                    </div>
                    <div className="admin-field">
                        <label>Degree (Optional)</label>
                        <input className="admin-input" placeholder="e.g. Bachelor of Science" value={form.degree} onChange={e => setForm({ ...form, degree: e.target.value })} />
                    </div>
                </div>

                <div className="admin-grid">
                    <div className="admin-field">
                        <label>Major / Specialization (Optional)</label>
                        <input className="admin-input" placeholder="e.g. Software Engineering" value={form.major} onChange={e => setForm({ ...form, major: e.target.value })} />
                    </div>
                    <div className="admin-field">
                        <label>Location (Optional)</label>
                        <input className="admin-input" placeholder="e.g. Banda Aceh, Indonesia" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
                    </div>
                </div>

                <div className="admin-field">
                    <label>Duration</label>
                    <input className="admin-input" placeholder="e.g. 2014 - 2020" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} required />
                </div>

                <div className="admin-field">
                    <label>Description (Optional)</label>
                    <textarea className="admin-textarea no-resize" placeholder="Additional details about your studies..." value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} rows={3} />
                </div>

                <div className="admin-checkbox-row">
                    <input type="checkbox" id="currentlyEnrolled" checked={form.currentlyEnrolled} onChange={e => setForm({ ...form, currentlyEnrolled: e.target.checked })} />
                    <label htmlFor="currentlyEnrolled">Currently Enrolled</label>
                </div>

                <div className="admin-form-actions">
                    <button type="submit" className="admin-btn-primary">{editing ? 'Update Education' : 'Add Education'}</button>
                    {editing && <button type="button" className="admin-btn-secondary" onClick={resetForm}>Cancel</button>}
                </div>
            </form>

            <div className="admin-list">
                {education.map((item) => (
                    <div className="admin-list-item" key={item.id}>
                        <div className="admin-list-info" style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                            <div className="admin-logo-preview" style={{ minWidth: 40, width: 40, height: 40, borderRadius: 8 }}>
                                {item.logo ? <img src={item.logo} alt="" /> : <AdminIcon.FileText />}
                            </div>
                            <div>
                                <strong style={{ fontSize: '1.05rem' }}>{item.school}</strong>
                                {item.degree && <div style={{ color: 'var(--accent)', fontSize: '0.9rem' }}>{item.degree}</div>}
                                {item.major && <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontFamily: 'monospace' }}>{item.major}</div>}
                                {item.desc && <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 4 }}>{item.desc}</p>}
                                <span className="admin-time" style={{ fontSize: '12px', color: '#666', marginTop: '8px', display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <AdminIcon.Check /> {item.duration}
                                    {item.location && <> · {item.location}</>}
                                    {item.currentlyEnrolled && <span style={{ color: '#00ba7c', fontWeight: 600 }}> · Enrolled</span>}
                                </span>
                            </div>
                        </div>
                        <div className="admin-list-actions">
                            <button className="admin-btn-edit" onClick={() => startEdit(item)}>Edit</button>
                            <button className="admin-btn-delete" onClick={() => onDelete(item.id)}>Delete</button>
                        </div>
                    </div>
                ))}
                {education.length === 0 && <div className="admin-empty-state">No education added yet.</div>}
            </div>
        </div>
    )
}
