import React from 'react'
import { motion } from 'framer-motion'
import { Icon } from './Icon'

const boxVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: (i) => ({
        opacity: 1, x: 0,
        transition: { delay: 0.2 + i * 0.15, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
    })
}

const chipVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i) => ({
        opacity: 1, scale: 1,
        transition: { delay: 0.4 + i * 0.03, duration: 0.3 }
    })
}

const linkVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: (i) => ({
        opacity: 1, x: 0,
        transition: { delay: 0.5 + i * 0.06, duration: 0.35, ease: 'easeOut' }
    })
}

export function SidebarRight({ techStack, profile }) {
    const techs = techStack || []

    const CONNECT_LINKS = [
        { icon: <Icon.GitHub />, name: 'GitHub', url: 'https://github.com/YusufxAlbana' },
        { icon: <Icon.LinkedIn />, name: 'LinkedIn', url: 'https://www.linkedin.com/in/yusuf-nawaf-albana-1b493931b/' },
        { icon: <Icon.MailIcon />, name: 'Email', url: `mailto:${profile?.email}` },
        { icon: <Icon.Phone />, name: 'WhatsApp', url: 'https://wa.me/6285168845761' },
        { icon: <Icon.Facebook />, name: 'Facebook', url: 'https://www.facebook.com/profile.php?id=100090587091557' },
        { icon: <Icon.Instagram />, name: 'Instagram', url: 'https://www.instagram.com/yusuf_nawaf_albana' },
    ]

    return (
        <aside className="sidebar-right">
            <div className="sidebar-right-doodle"></div>
            {/* Tech Stack */}
            <motion.div
                className="info-box tech-stack-box"
                variants={boxVariants}
                initial="hidden"
                animate="visible"
                custom={0}
            >
                <div className="info-box-header">Tech Stack</div>
                <div className="tech-scroll">
                    {techs.length > 0 ? (
                        techs.map((tech, i) => {
                            const name = typeof tech === 'string' ? tech : tech.name
                            const logo = typeof tech === 'string' ? '' : tech.logo
                            return (
                                <motion.span
                                    className="tech-chip"
                                    key={i}
                                    variants={chipVariants}
                                    initial="hidden"
                                    animate="visible"
                                    custom={i}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    {logo && <img src={logo} alt="" className="tech-chip-logo" />}
                                    {name}
                                </motion.span>
                            )
                        })
                    ) : (
                        <span className="empty-tech">Loading...</span>
                    )}
                </div>
            </motion.div>

            {/* Connect with me */}
            <motion.div
                className="info-box"
                variants={boxVariants}
                initial="hidden"
                animate="visible"
                custom={1}
            >
                <div className="info-box-header">Connect with me</div>
                {CONNECT_LINKS.map((link, i) => (
                    <motion.a
                        href={link.url}
                        className="connect-item"
                        key={i}
                        target="_blank"
                        rel="noopener noreferrer"
                        variants={linkVariants}
                        initial="hidden"
                        animate="visible"
                        custom={i}
                        whileHover={{ x: 4, transition: { duration: 0.15 } }}
                    >
                        <div className="connect-icon">{link.icon}</div>
                        <div className="follow-name">{link.name}</div>
                    </motion.a>
                ))}
            </motion.div>

            {/* Footer */}
            <motion.div
                className="sidebar-footer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.5 }}
            >
                <a href={`https://${profile?.website}`} target="_blank" rel="noopener noreferrer">© 2026 {profile?.website}</a>
            </motion.div>
        </aside>
    )
}
