import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <div className="root-layout">
            <Navbar />
            <main className="view-container">
                {children}
            </main>
            <footer className="global-footer">
                <p>© 2026 AI Summarizer Pro. Powered by T5 Transformer Architecture.</p>
            </footer>
        </div>
    );
};

export default Layout;
