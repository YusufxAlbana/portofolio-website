import React from 'react'
import { motion } from 'framer-motion'
import { Icon } from '../components/Icon'
import { TimeAgo } from '../components/TimeAgo'
import { ImageCarousel } from '../components/ImageCarousel'

const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.12, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
    })
}

export function ProjectsPage({ profile, projects }) {
    if (!projects) return <div className="loading">Loading projects...</div>

    return (
        <main className="main-feed">
            {projects.length === 0 ? (
                <div className="empty-state">No projects yet.</div>
            ) : (
                projects.map((proj, i) => (
                    <motion.article
                        className="post-card"
                        key={proj.id || i}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        custom={i}
                        whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
                    >
                        <div className="post-avatar"><img src={profile.photo} alt="Profile" /></div>
                        <div className="post-content">
                            <div className="post-header">
                                <span className="post-name">{profile.name}</span>
                                <span className="post-handle">{profile.handle}</span>
                                <span className="post-dot">·</span>
                                <span className="post-time"><TimeAgo timestamp={proj.time} /></span>
                            </div>
                            <motion.div
                                className="post-attachment"
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.12 + 0.2, duration: 0.4 }}
                                style={{ marginBottom: proj.images && proj.images.length > 0 ? '12px' : 0 }}
                            >
                                <div className="post-attachment-preview">
                                    <div className="post-attachment-title">{proj.title}</div>
                                    <div className="post-attachment-desc">{proj.desc}</div>
                                    <div className="post-attachment-tags">
                                        {(proj.tags || []).map((tag) => (
                                            <span className="post-attachment-tag" key={tag}>{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Project Images */}
                            {proj.images && proj.images.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.96 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.12 + 0.3, duration: 0.4 }}
                                >
                                    <ImageCarousel images={proj.images} altPrefix={proj.title} />
                                </motion.div>
                            )}
                        </div>
                    </motion.article>
                ))
            )}
        </main>
    )
}
