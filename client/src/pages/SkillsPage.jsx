import React, { useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

const DefaultSkillIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
        <line x1="14" y1="4" x2="10" y2="20" />
    </svg>
)

const styles = `
  .skills-page-custom-css .marquee-wrapper {
      position: relative;
      display: flex;
      overflow: hidden;
      white-space: nowrap;
      width: 100%;
      mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
      -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
      padding: 30px 0;
      margin-bottom: 10px;
  }
  .skills-page-custom-css .marquee-track {
      display: flex;
      gap: 40px;
      padding-right: 40px;
      animation: marquee 50s linear infinite;
  }
  .skills-page-custom-css .marquee-track:hover {
      animation-play-state: paused;
  }
  @keyframes marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(-100%); }
  }
  .skills-page-custom-css .marquee-item {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--text-secondary);
      transition: color 0.3s;
      cursor: default;
  }
  .skills-page-custom-css .marquee-item:hover {
      color: var(--text-primary);
  }
  .skills-page-custom-css .marquee-item img {
      width: 32px;
      height: 32px;
      object-fit: contain;
      filter: grayscale(100%) opacity(0.7);
      transition: filter 0.3s, transform 0.3s;
  }
  .skills-page-custom-css .marquee-item:hover img {
      filter: grayscale(0%) opacity(1);
      transform: scale(1.15);
  }
  
  .skills-page-custom-css .tilt-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
      gap: 20px;
      padding: 20px;
      border-top: 1px solid var(--border-color);
  }
  
  .skills-page-custom-css .skill-tilt-wrapper {
      display: flex;
      justify-content: center;
  }
  .skills-page-custom-css .skill-tilt-card {
      position: relative;
      width: 100%;
      aspect-ratio: 1 / 1.15;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      background: linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 100%);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      cursor: crosshair;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  }
  .skills-page-custom-css .skill-tilt-inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      pointer-events: none;
  }
  .skills-page-custom-css .skill-tilt-logo {
      width: 64px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 16px;
      background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.02) 100%);
      border: 1px solid rgba(255,255,255,0.15);
      color: var(--accent);
      box-shadow: 0 6px 20px rgba(0,0,0,0.3);
  }
  .skills-page-custom-css .skill-tilt-logo img {
      width: 36px;
      height: 36px;
      object-fit: contain;
      filter: drop-shadow(0 4px 8px rgba(0,0,0,0.4));
  }
  .skills-page-custom-css .skill-tilt-logo svg {
      width: 32px;
      height: 32px;
      opacity: 0.8;
  }
  .skills-page-custom-css .skill-tilt-name {
      font-size: 0.9rem;
      font-weight: 800;
      color: var(--text-primary);
      text-align: center;
      letter-spacing: 0.03em;
  }
  .skills-page-custom-css .skill-tilt-glare {
      position: absolute;
      top: -100%; left: -100%; right: -100%; bottom: -100%;
      background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 0%, transparent 40%);
      pointer-events: none;
      z-index: 2;
  }

  /* Responsive fixes */
  @media (max-width: 500px) {
      .skills-page-custom-css .tilt-grid {
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          padding: 16px;
      }
      .skills-page-custom-css .marquee-wrapper {
          padding: 16px 0;
      }
  }
`

const TiltCard = ({ skill, index }) => {
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const [isHovered, setIsHovered] = useState(false)

    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 })
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 })

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["20deg", "-20deg"])
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-20deg", "20deg"])
    const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["50%", "-50%"])
    const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["50%", "-50%"])

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const width = rect.width
        const height = rect.height
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top
        const xPct = mouseX / width - 0.5
        const yPct = mouseY / height - 0.5
        x.set(xPct)
        y.set(yPct)
    }

    const handleMouseEnter = () => setIsHovered(true)

    const handleMouseLeave = () => {
        setIsHovered(false)
        x.set(0)
        y.set(0)
    }

    return (
        <motion.div
            style={{ perspective: 1200 }}
            className="skill-tilt-wrapper"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "50px" }}
            transition={{ duration: 0.5, delay: index * 0.05, ease: "easeOut" }}
        >
            <motion.div
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                className="skill-tilt-card"
            >
                <div style={{ transform: "translateZ(50px)" }} className="skill-tilt-inner">
                    <div className="skill-tilt-logo">
                        {skill.logo ? (
                            <img src={skill.logo} alt={skill.name} />
                        ) : (
                            <DefaultSkillIcon />
                        )}
                    </div>
                    <span className="skill-tilt-name">{skill.name}</span>
                </div>

                {/* Glare effect */}
                <motion.div
                    className="skill-tilt-glare"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? window.innerWidth > 768 ? 1 : 0 : 0 }}
                    transition={{ duration: 0.3 }}
                    style={{
                        translateX: glareX,
                        translateY: glareY,
                    }}
                />
            </motion.div>
        </motion.div>
    )
}

export function SkillsPage({ skills }) {
    if (!skills) return <div className="loading">Loading skills...</div>

    const techStack = (skills.techStack || []).map(t =>
        typeof t === 'string' ? { name: t, logo: '' } : t
    )

    // Ensure we have enough items for marquee to flow seamlessly
    const marqueeItems = techStack.length > 0 ? [...techStack, ...techStack, ...techStack, ...techStack] : []

    return (
        <main className="main-feed skills-page-custom-css">
            <style>{styles}</style>

            <motion.div
                className="feed-header"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <h1>Skills & Technologies</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Tools and technologies I work with</p>
            </motion.div>

            {/* Marquee Section */}
            {techStack.length > 0 && (
                <div className="marquee-wrapper">
                    <div className="marquee-track">
                        {marqueeItems.map((skill, i) => (
                            <div className="marquee-item" key={i}>
                                {skill.logo ? (
                                    <img src={skill.logo} alt={skill.name} />
                                ) : (
                                    <DefaultSkillIcon />
                                )}
                                <span>{skill.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tilt Cards Section */}
            {techStack.length > 0 && (
                <div className="tilt-grid">
                    {techStack.map((skill, i) => (
                        <TiltCard key={`tilt-${i}`} index={i} skill={skill} />
                    ))}
                </div>
            )}

            {techStack.length === 0 && (
                <div style={{ padding: '60px 16px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No skills added yet.
                </div>
            )}
        </main>
    )
}
