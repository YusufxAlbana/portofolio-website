import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '../components/Icon'
import { TimeAgo } from '../components/TimeAgo'
import { ImageCarousel } from '../components/ImageCarousel'

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 0) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
    })
}

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.05, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
    })
}

// Icon for default skills
const DefaultSkillIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
        <line x1="14" y1="4" x2="10" y2="20" />
    </svg>
)

const profileStyles = `
  .profile-marquee-wrapper {
      position: relative;
      display: flex;
      overflow: hidden;
      white-space: nowrap;
      width: 100%;
      mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
      -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
      padding: 10px 0;
  }
  .profile-marquee-track {
      display: flex;
      gap: 12px;
      padding-right: 12px;
      animation: marquee-profile 90s linear infinite;
  }
  .profile-marquee-track:hover {
      animation-play-state: paused;
  }
  @keyframes marquee-profile {
      0% { transform: translateX(0); }
      100% { transform: translateX(-100%); }
  }
`

export function ProfilePage({ profile, skills, education, projects, certifications, blog }) {
    const [visibleCount, setVisibleCount] = useState(5)

    if (!profile) return <div className="loading">Loading profile...</div>

    const techStack = (skills?.techStack || []).map(t =>
        typeof t === 'string' ? { name: t, logo: '' } : t
    )

    const marqueeItems = techStack.length > 0 ? [...techStack, ...techStack, ...techStack, ...techStack, ...techStack, ...techStack, ...techStack, ...techStack] : []

    // Aggregate feed items
    const feedItems = []

    if (projects) {
        projects.forEach(p => feedItems.push({ ...p, feedType: 'project', timeSort: p.time }))
    }
    if (blog) {
        blog.forEach(b => feedItems.push({ ...b, feedType: 'blog', timeSort: b.time }))
    }
    if (certifications) {
        certifications.forEach(c => feedItems.push({ ...c, feedType: 'cert', timeSort: c.time }))
    }
    if (education) {
        // use time for sorting if needed, else fake time for edu to stagger it nicely or keep it slightly older
        education.forEach(e => feedItems.push({ ...e, feedType: 'edu', timeSort: e.time || (Date.now() - 1000000000) }))
    }

    // Sort newest first
    feedItems.sort((a, b) => b.timeSort - a.timeSort)

    const visibleFeed = feedItems.slice(0, visibleCount)
    const hasMore = visibleCount < feedItems.length

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 5)
    }

    // Render logic per type
    const renderFeedItem = (item, i) => {
        if (item.feedType === 'blog' || item.feedType === 'project' || item.feedType === 'cert') {
            const isCert = item.feedType === 'cert';
            const isProject = item.feedType === 'project';
            const isBlog = item.feedType === 'blog';

            return (
                <motion.article
                    className="post-card"
                    key={`${item.feedType}-${item.id || i}`}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    custom={i % 5} // Keep delays reasonable when loading more
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
                >
                    <div className="post-avatar"><img src={profile.photo} alt="Profile" /></div>
                    <div className="post-content" style={{ width: '100%', minWidth: 0 }}>
                        <div className="post-header">
                            <span className="post-name">{profile.name}</span>
                            <span className="post-handle">{profile.handle}</span>
                            <span className="post-dot">·</span>
                            <span className="post-time"><TimeAgo timestamp={item.timeSort} /></span>
                            <span className="post-dot">·</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase' }}>{item.feedType === 'cert' ? 'CERTIFICATION' : item.feedType}</span>
                        </div>

                        {(isBlog || isCert) && <div className="post-blog-title">{item.title}</div>}

                        {isBlog && <div className="post-text" style={{ whiteSpace: 'pre-line' }}>{item.text}</div>}

                        {/* Project Specific Attachment UI */}
                        {isProject && (
                            <motion.div className="post-attachment" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ marginBottom: item.images && item.images.length > 0 ? '12px' : 0 }}>
                                <div className="post-attachment-preview">
                                    <div className="post-attachment-title">{item.title}</div>
                                    <div className="post-attachment-desc">{item.desc}</div>
                                    <div className="post-attachment-tags">
                                        {(item.tags || []).map((tag) => (
                                            <span className="post-attachment-tag" key={tag}>{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Images Grid */}
                        {item.images && item.images.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1, duration: 0.4 }}
                            >
                                <ImageCarousel images={item.images} altPrefix={item.title || 'Attachment'} />
                            </motion.div>
                        )}
                    </div>
                </motion.article>
            )
        }

        if (item.feedType === 'edu') {
            return (
                <motion.article
                    className="post-card"
                    key={`edu-${item.id}`}
                    variants={cardVariants}
                    initial="hidden" animate="visible" custom={i % 5}
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
                >
                    <div className="post-avatar">
                        {item.logo ? <img src={item.logo} alt="Edu" style={{ borderRadius: '8px', objectFit: 'contain' }} /> : <div style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-secondary)', color: 'var(--text-secondary)', borderRadius: '8px' }}><Icon.GraduationCap /></div>}
                    </div>
                    <div className="post-content" style={{ width: '100%', minWidth: 0 }}>
                        <div className="post-header">
                            <span className="post-name">{item.school}</span>
                            <span className="post-dot">·</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase' }}>EDUCATION</span>
                        </div>
                        <div className="post-text">{item.degree} — {item.major}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                            {item.duration} {item.location && `· ${item.location}`}
                        </div>
                        {item.desc && <div className="post-text" style={{ marginTop: 8, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{item.desc}</div>}
                    </div>
                </motion.article>
            )
        }
        return null;
    }

    return (
        <main className="main-feed" style={{ paddingBottom: '40px' }}>
            <style>{profileStyles}</style>
            <motion.div className="profile-banner" initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, ease: 'easeOut' }}>
                <img src={profile.banner} alt="Banner" />
            </motion.div>

            <motion.div className="profile-info" initial="hidden" animate="visible">
                <motion.div className="profile-avatar-large" variants={fadeUp} custom={0}>
                    <img src={profile.photo} alt={profile.name} />
                </motion.div>

                <motion.div className="profile-name-block" variants={fadeUp} custom={1}>
                    <h2 className="profile-display-name">{profile.name}</h2>
                    <p className="profile-handle">{profile.handle}</p>
                </motion.div>

                <motion.p className="profile-bio" variants={fadeUp} custom={2}>
                    {profile.bio}
                </motion.p>

                <motion.div className="profile-meta" variants={fadeUp} custom={3}>
                    <span className="profile-meta-item">
                        <span className="meta-icon"><Icon.MapPin /></span> {profile.location}
                    </span>
                    <span className="profile-meta-item">
                        <span className="meta-icon"><Icon.Link /></span>
                        <a href={`https://${profile.website}`} target="_blank" rel="noopener noreferrer">{profile.website}</a>
                    </span>
                    <span className="profile-meta-item">
                        <span className="meta-icon"><Icon.GraduationCap /></span> {profile.education}
                    </span>
                    <span className="profile-meta-item">
                        <span className="meta-icon"><Icon.Calendar /></span> Born {profile.birthday}
                    </span>
                </motion.div>

                <motion.div className="profile-stats" variants={fadeUp} custom={4}>
                    <span><strong>{profile.following}</strong> Following</span>
                    <span><strong>{profile.followers}</strong> Followers</span>
                </motion.div>
            </motion.div>

            {/* Skills Section Condensed */}
            {techStack.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }} /* animate manually on initial load */ animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                    style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', overflow: 'hidden' }}
                >
                    <div className="pinned-label" style={{ marginBottom: '4px' }}>
                        <span className="pin-icon"><Icon.Briefcase /></span> Top Skills
                    </div>
                    <div className="profile-marquee-wrapper">
                        <div className="profile-marquee-track">
                            {marqueeItems.map((skill, i) => (
                                <div key={i} className="tech-chip" style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'default', flexShrink: 0 }}>
                                    {skill.logo ? <img src={skill.logo} alt="" className="tech-chip-logo" /> : <span style={{ display: 'flex', width: 14, height: 14, alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}><DefaultSkillIcon /></span>}
                                    {skill.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}

            <div className="feed-tabs" style={{ marginTop: '10px' }}>
                <button className="feed-tab active">Recent Activity</button>
            </div>

            {/* Unified Feed */}
            <div className="unified-feed">
                <AnimatePresence mode="popLayout">
                    {visibleFeed.map((item, i) => renderFeedItem(item, i))}
                </AnimatePresence>

                {feedItems.length === 0 && (
                    <div className="empty-state">No activity yet.</div>
                )}

                {hasMore && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        style={{ display: 'flex', justifyContent: 'center', padding: '24px' }}
                    >
                        <button
                            onClick={handleLoadMore}
                            style={{
                                padding: '10px 24px', borderRadius: '50px', background: 'transparent',
                                border: '1px solid var(--border-color)', color: 'var(--accent)',
                                fontWeight: 600, cursor: 'pointer', transition: '0.2s'
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(29, 155, 240, 0.1)'; e.currentTarget.style.borderColor = 'var(--accent)' }}
                            onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border-color)' }}
                        >
                            Load More
                        </button>
                    </motion.div>
                )}
            </div>

        </main>
    )
}
