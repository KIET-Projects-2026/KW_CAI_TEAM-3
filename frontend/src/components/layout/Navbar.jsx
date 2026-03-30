import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Sparkles, Sun, Moon, Layout as LayoutIcon, FileText, PenTool, Columns, Home } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <nav className="navbar">
            <Link to="/" className="nav-logo" style={{ textDecoration: 'none' }}>
                <Sparkles className="text-emerald-400" size={24} />
                <span className="logo-text">AI Summarizer <span className="pro-tag">PRO</span></span>
            </Link>
            
            <div className="nav-links">
                <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <Home size={18} /> Home
                </NavLink>
                <NavLink to="/summarize" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <LayoutIcon size={18} /> Summarizer
                </NavLink>
                <NavLink to="/analyze" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <FileText size={18} /> Analyzer
                </NavLink>
                <NavLink to="/notes" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <PenTool size={18} /> Notes
                </NavLink>
                <NavLink to="/compare" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <Columns size={18} /> Compare
                </NavLink>
            </div>

            <button className="btn btn-secondary" onClick={toggleTheme} style={{ padding: '8px' }}>
                {isDarkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} />}
            </button>
        </nav>
    );
};

export default Navbar;
