import React from 'react'
import { NavLink } from 'react-router-dom'
import { Icon } from './Icon'

export function MobileNav() {
    return (
        <nav className="mobile-nav">
            <NavLink to="/" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`} end>
                <Icon.User />
                <span>Profile</span>
            </NavLink>
            <NavLink to="/projects" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
                <Icon.Layers />
                <span>Projects</span>
            </NavLink>
            <NavLink to="/skills" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
                <Icon.Zap />
                <span>Skills</span>
            </NavLink>
            <NavLink to="/education" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
                <Icon.GraduationCap />
                <span>Education</span>
            </NavLink>
            <NavLink to="/certifications" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
                <Icon.Award />
                <span>Certs</span>
            </NavLink>
            <NavLink to="/blog" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
                <Icon.Edit />
                <span>Blog</span>
            </NavLink>
        </nav>
    )
}
