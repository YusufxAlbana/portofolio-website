import React from 'react'
import { motion } from 'framer-motion'
import { Icon } from '../components/Icon'
import { TimeAgo } from '../components/TimeAgo'
import { ImageCarousel } from '../components/ImageCarousel'

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
    })
}

export function BlogPage({ profile, blog }) {
    if (!blog) return <div className="loading">Loading blog...</div>

    return (
        <main className="main-feed">
            {blog.length === 0 ? (
                <div className="empty-state">No blog posts yet.</div>
            ) : (
                blog.map((post, i) => (
                    <motion.article
                        className="post-card"
                        key={post.id}
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
                                <span className="post-time"><TimeAgo timestamp={post.time} /></span>
                            </div>
                            <div className="post-blog-title">{post.title}</div>
                            <div className="post-text" style={{ whiteSpace: 'pre-line' }}>{post.text}</div>
                            {post.images && post.images.length > 0 && (
                                <div style={{ marginTop: '12px' }}>
                                    <ImageCarousel images={post.images} altPrefix={`Blog image`} />
                                </div>
                            )}
                        </div>
                    </motion.article>
                ))
            )}
        </main>
    )
}
