import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Icon } from './Icon'

const navItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
        opacity: 1, x: 0,
        transition: { delay: 0.1 + i * 0.06, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
    })
}

export function SidebarLeft({ profile }) {
    const sections = [
        { id: 'profile', icon: <Icon.User />, label: 'Profile', path: '/' },
        { id: 'projects', icon: <Icon.Layers />, label: 'Projects', path: '/projects' },
        { id: 'skills', icon: <Icon.Zap />, label: 'Skills', path: '/skills' },
        { id: 'certifications', icon: <Icon.Award />, label: 'Certifications', path: '/certifications' },
        { id: 'education', icon: <Icon.GraduationCap />, label: 'Education', path: '/education' },
        { id: 'blog', icon: <Icon.Edit />, label: 'Blog', path: '/blog' },
        { id: 'contact', icon: <Icon.Mail />, label: 'Contact', path: '/contact' },
    ]

    return (
        <aside className="sidebar-left">
            <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                <Link to="/" className="sidebar-logo">
                    <img src="/assets/images/logo YNA.svg" alt="YNA" />
                </Link>
            </motion.div>

            <nav className="sidebar-nav">
                {sections.map((item, i) => (
                    <motion.div
                        key={item.id}
                        variants={navItemVariants}
                        initial="hidden"
                        animate="visible"
                        custom={i}
                    >
                        <NavLink
                            to={item.path}
                            className={({ isActive }) => `sidebar-nav-item ${isActive || (item.id === 'profile' && window.location.pathname === '/profile') ? 'active' : ''}`}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span>{item.label}</span>
                        </NavLink>
                    </motion.div>
                ))}
            </nav>

            <motion.div
                className="sidebar-status"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
            >
                <span className="status-dot" />
                <span>Available for hire</span>
            </motion.div>

            <motion.a
                href={`https://wa.me/6285168845761`}
                className="sidebar-cta"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.4 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
            >
                Hubungi Saya
            </motion.a>

            <motion.div
                className="sidebar-profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.4 }}
            >
                <div className="sidebar-avatar"><img src={profile.photo} alt="Profile" /></div>
                <div className="sidebar-profile-info">
                    <div className="sidebar-profile-name">{profile.name}</div>
                    <div className="sidebar-profile-handle">{profile.handle}</div>
                </div>
            </motion.div>
        </aside>
    )
}
