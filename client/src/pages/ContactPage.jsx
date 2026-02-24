import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Icon } from '../components/Icon'

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
}

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } }
}

const floatingVariants = {
    animate: {
        y: [0, -15, 0],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
}

const contactStyles = `
  .contact-page-container {
      position: relative;
      width: 100%;
      height: 100%; /* Changed from min-height: 80vh to occupy full available center space without scroll */
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px; /* Reduced padding */
      overflow: hidden;
  }

  .contact-doodle-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url('/assets/images/doodle_pattern.png');
      background-size: 350px;
      opacity: 0.12;
      z-index: 0;
      pointer-events: none;
      filter: invert(1);
  }

  .contact-bg-glow {
      position: absolute;
      width: 300px;
      height: 300px;
      background: radial-gradient(circle, var(--accent) 0%, transparent 70%);
      opacity: 0.15;
      filter: blur(50px);
      top: 10%;
      right: 15%;
      z-index: 0;
      animation: pulse-glow 6s infinite alternate;
  }

  .contact-bg-glow-2 {
      position: absolute;
      width: 250px;
      height: 250px;
      background: radial-gradient(circle, #8a2be2 0%, transparent 70%);
      opacity: 0.1;
      filter: blur(50px);
      bottom: 10%;
      left: 10%;
      z-index: 0;
      animation: pulse-glow 8s infinite alternate-reverse;
  }

  @keyframes pulse-glow {
      0% { transform: scale(1); opacity: 0.1; }
      100% { transform: scale(1.3); opacity: 0.2; }
  }

  .contact-glass-card {
      position: relative;
      z-index: 1;
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 24px;
      padding: 40px;
      width: 100%;
      max-width: 600px;
      box-shadow: 0 30px 60px rgba(0,0,0,0.1);
  }

  .contact-header {
      text-align: center;
      margin-bottom: 40px;
  }

  .contact-title {
      font-size: 2.5rem;
      font-weight: 800;
      background: linear-gradient(135deg, #fff 0%, var(--text-secondary) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 10px;
      letter-spacing: -0.5px;
  }

  .contact-subtitle {
      color: var(--text-secondary);
      font-size: 1.1rem;
      max-width: 400px;
      margin: 0 auto;
      line-height: 1.5;
  }

  .contact-input-wrapper {
      position: relative;
      margin-bottom: 24px;
  }

  .contact-icon {
      position: absolute;
      left: 16px;
      top: 16px;
      color: var(--text-secondary);
      pointer-events: none;
      transition: 0.3s;
  }

  .contact-input:focus + .contact-icon,
  .contact-textarea:focus + .contact-icon {
      color: var(--accent);
  }

  .contact-input, .contact-textarea {
      width: 100%;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 16px 16px 16px 48px;
      color: var(--text-primary);
      font-size: 1rem;
      transition: all 0.3s ease;
      font-family: inherit;
  }

  .contact-input:focus, .contact-textarea:focus {
      outline: none;
      border-color: var(--accent);
      background: rgba(255, 255, 255, 0.05);
      box-shadow: 0 0 0 4px rgba(29, 155, 240, 0.1);
  }

  .contact-textarea {
      min-height: 150px;
      resize: none;
  }

  /* Custom Scrollbar for Textarea */
  .contact-textarea::-webkit-scrollbar {
      width: 8px;
  }
  .contact-textarea::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.02);
      border-radius: 8px;
  }
  .contact-textarea::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.15);
      border-radius: 8px;
  }
  .contact-textarea::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.25);
  }

  .contact-submit-btn {
      width: 100%;
      padding: 16px;
      border: none;
      border-radius: 12px;
      background: var(--accent);
      color: white;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
  }

  .btn-glare {
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%);
      transform: rotate(30deg);
      transition: all 0.5s;
      opacity: 0;
  }

  .contact-submit-btn:hover .btn-glare {
      opacity: 1;
      left: 100%;
  }

  .contact-submit-btn:hover {
      background: #1a8cd8;
      box-shadow: 0 10px 20px rgba(29, 155, 240, 0.3);
  }

  .social-links {
      display: flex;
      gap: 16px;
      justify-content: center;
      margin-top: 30px;
  }

  .social-icon {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.05);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-secondary);
      transition: all 0.3s;
      cursor: pointer;
      text-decoration: none;
  }

  .social-icon:hover {
      background: var(--accent);
      color: white;
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(29, 155, 240, 0.2);
  }

  @media (max-width: 768px) {
      .contact-glass-card {
           padding: 30px 20px;
           border-radius: 16px;
      }
      .contact-title { font-size: 2rem; }
  }
`

export function ContactPage({ profile }) {
    const [form, setForm] = useState({ name: '', email: '', message: '' })

    const handleSubmit = (e) => {
        e.preventDefault()
        const text = `Halo, saya ${form.name} (${form.email}).\n\n${form.message}`
        const encodedText = encodeURIComponent(text)
        const waUrl = `https://wa.me/6285168845761?text=${encodedText}`

        window.open(waUrl, '_blank')
        setForm({ name: '', email: '', message: '' })
    }

    return (
        <main className="main-feed" style={{ border: 'none', background: 'transparent', overflow: 'hidden', height: '100vh', paddingBottom: 0 }}>
            <style>{contactStyles}</style>

            <div className="contact-page-container">
                <div className="contact-doodle-bg"></div>
                <div className="contact-bg-glow"></div>
                <div className="contact-bg-glow-2"></div>

                <motion.div
                    className="contact-glass-card"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="contact-header">
                        <motion.h1 variants={itemVariants} className="contact-title">Let's connect</motion.h1>
                        <motion.p variants={itemVariants} className="contact-subtitle">
                            Punya ide proyek, tawaran kerja, atau sekadar ingin menyapa? Jangan ragu untuk mengirim pesan!
                        </motion.p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <motion.div variants={itemVariants} className="contact-input-wrapper">
                            <input
                                type="text"
                                className="contact-input"
                                placeholder="Nama Lengkap"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                required
                            />
                            <div className="contact-icon"><Icon.User size={20} /></div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="contact-input-wrapper">
                            <input
                                type="email"
                                className="contact-input"
                                placeholder="Alamat Email"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                required
                            />
                            <div className="contact-icon"><Icon.Mail size={20} /></div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="contact-input-wrapper">
                            <textarea
                                className="contact-textarea"
                                placeholder="Tuliskan pesan atau ide luar biasamu di sini..."
                                value={form.message}
                                onChange={e => setForm({ ...form, message: e.target.value })}
                                required
                            />
                            <div className="contact-icon" style={{ top: 20 }}><Icon.Edit size={20} /></div>
                        </motion.div>

                        <motion.button
                            variants={itemVariants}
                            type="submit"
                            className="contact-submit-btn"
                            whileTap={{ scale: 0.98 }}
                        >
                            <span className="btn-glare"></span>
                            <span>Kirim Pesan via WhatsApp</span>
                            <Icon.ExternalLink size={18} />
                        </motion.button>
                    </form>

                    <motion.div variants={itemVariants} className="social-links">
                        <a href={`https://${profile.website}`} target="_blank" rel="noopener noreferrer" className="social-icon">
                            <Icon.Link size={20} />
                        </a>
                        <a href="https://wa.me/6285168845761" target="_blank" rel="noopener noreferrer" className="social-icon">
                            <Icon.Phone size={20} />
                        </a>
                        {/* Tambahkan link lain seperti Github / LinkedIn jika ada */}
                        <a href="mailto:yusufnawafalbana2009@gmail.com" className="social-icon">
                            <Icon.Mail size={20} />
                        </a>
                    </motion.div>
                </motion.div>
            </div>
        </main>
    )
}
