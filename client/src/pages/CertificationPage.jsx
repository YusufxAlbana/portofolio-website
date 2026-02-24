import React from 'react'
import { motion } from 'framer-motion'
import { Icon } from '../components/Icon'
import { TimeAgo } from '../components/TimeAgo'
import { ImageCarousel } from '../components/ImageCarousel'

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.12, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
    })
}

export function CertificationPage({ profile, certifications }) {
    if (!certifications) return <div className="loading">Loading certifications...</div>

    return (
        <main className="main-feed">
            <motion.div
                className="feed-header"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <h1>Certifications</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Achievements and certificates</p>
            </motion.div>

            {certifications.length === 0 ? (
                <motion.div
                    className="empty-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    No certifications yet.
                </motion.div>
            ) : (
                certifications.map((cert, i) => (
                    <motion.article
                        className="post-card"
                        key={cert.id}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        custom={i}
                    >
                        <div className="post-avatar"><img src={profile.photo} alt="Profile" /></div>
                        <div className="post-content">
                            <div className="post-header">
                                <span className="post-name">{profile.name}</span>
                                <span className="post-handle">{profile.handle}</span>
                                <span className="post-dot">·</span>
                                <span className="post-time"><TimeAgo timestamp={cert.time} /></span>
                            </div>
                            <div className="post-blog-title">{cert.title}</div>

                            {/* Certificate Images */}
                            {cert.images && cert.images.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.96 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.12 + 0.2, duration: 0.4 }}
                                >
                                    <ImageCarousel images={cert.images} altPrefix={cert.title} />
                                </motion.div>
                            )}
                        </div>
                    </motion.article>
                ))
            )}
        </main>
    )
}
