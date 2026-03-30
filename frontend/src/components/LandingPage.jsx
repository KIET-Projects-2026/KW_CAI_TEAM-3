import React from "react";
import { Link } from "react-router-dom";
import {
    Sparkles,
    Zap,
    FileText,
    Volume2,
    Search,
    ArrowRight,
    ShieldCheck,
    Cpu,
    Columns,
    PenTool
} from "lucide-react";

const LandingPage = () => {
    return (
        <div className="landing-container page-wrapper">
            {/* Hero Section */}
            <section className="hero-section mb-20">
                <div className="hero-content">
                    <div className="badge-promo mb-6">
                        <Zap size={14} /> Next-Gen AI Processing
                    </div>
                    <h1 className="text-7xl font-extrabold leading-tight mb-8">
                        Distill Complexity into <span className="gradient-text">Pure Clarity</span>
                    </h1>
                    <p className="hero-subtitle text-xl mb-10 leading-relaxed max-w-2xl">
                        The ultimate AI productivity suite. Summarize, paraphrase, and analyze documents 
                        with professional-grade precision. Built for researchers, students, and thinkers.
                    </p>
                    <div className="hero-actions flex gap-6 mt-4">
                        <Link to="/summarize" className="btn btn-primary px-12 py-5 text-lg">
                            Start Summarizing <ArrowRight size={22} />
                        </Link>
                        <Link to="/analyze" className="btn btn-secondary px-12 py-5 text-lg">
                            Analyze Document
                        </Link>
                    </div>

                    <div className="hero-stats flex gap-12 mt-16 pt-12 border-t border-border">
                        <div className="stat-item">
                            <span className="stat-value text-3xl font-black">99.8%</span>
                            <span className="stat-label text-xs tracking-widest opacity-60">Accuracy</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value text-3xl font-black">Real-time</span>
                            <span className="stat-label text-xs tracking-widest opacity-60">Generation</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value text-3xl font-black">Zero</span>
                            <span className="stat-label text-xs tracking-widest opacity-60">Hidden Costs</span>
                        </div>
                    </div>
                </div>

                <div className="hero-visual hidden lg:block">
                    <div className="visual-card glass-card relative overflow-hidden h-[500px] border-emerald-500/20 shadow-2xl">
                        <div className="visual-header flex gap-2 p-4 bg-white/5 border-b border-white/10">
                            <div className="w-3 h-3 rounded-full bg-red-500/50" />
                            <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                            <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                        </div>
                        <div className="visual-body p-10 space-y-6">
                            <div className="h-4 bg-white/5 rounded-full w-full animate-pulse" />
                            <div className="h-4 bg-white/5 rounded-full w-[90%] animate-pulse" style={{ animationDelay: '0.2s' }} />
                            <div className="h-20 bg-emerald-500/5 rounded-2xl border border-emerald-500/20 w-full flex items-center justify-center">
                                <Sparkles className="text-emerald-400 opacity-20" size={48} />
                            </div>
                            <div className="h-4 bg-white/5 rounded-full w-[80%] animate-pulse" style={{ animationDelay: '0.4s' }} />
                            <div className="h-4 bg-white/5 rounded-full w-[95%] animate-pulse" style={{ animationDelay: '0.6s' }} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section py-24 bg-transparent">
                <div className="section-header text-center mb-20">
                    <span className="stat-badge mb-4">Core Ecosystem</span>
                    <h2 className="text-5xl font-black mt-4">Advanced AI Capabilities</h2>
                    <p className="text-muted text-lg mt-4 max-w-2xl mx-auto">One suite, limitless possibilities. Everything you need to process information at scale.</p>
                </div>
                <div className="features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="feature-card glass-card hover:border-emerald-500/30">
                        <div className="icon-box bg-emerald-500/10 text-emerald-400 mb-8 p-4 w-16 h-16 rounded-2xl">
                            <FileText size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-4">Multi-Mode AI</h3>
                        <p className="text-muted leading-relaxed">Summarize, paraphrase, simplify, or convert to list formats with advanced semantic control.</p>
                    </div>

                    <div className="feature-card glass-card hover:border-blue-500/30">
                        <div className="icon-box bg-blue-500/10 text-blue-400 mb-8 p-4 w-16 h-16 rounded-2xl">
                            <Search size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-4">Doc Analysis</h3>
                        <p className="text-muted leading-relaxed">Intelligent text extraction from PDF and Word docs with automatic keyword and insight detection.</p>
                    </div>

                    <div className="feature-card glass-card hover:border-purple-500/30">
                        <div className="icon-box bg-purple-500/10 text-purple-400 mb-8 p-4 w-16 h-16 rounded-2xl">
                            <PenTool size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-4">Study Aids</h3>
                        <p className="text-muted leading-relaxed">Transform any source material into structured study notes or question-and-answer exam formats.</p>
                    </div>

                    <div className="feature-card glass-card hover:border-amber-500/30">
                        <div className="icon-box bg-amber-500/10 text-amber-400 mb-8 p-4 w-16 h-16 rounded-2xl">
                            <Columns size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-4">Dual View</h3>
                        <p className="text-muted leading-relaxed">Side-by-side comparison of different AI styles to help you find the most accurate representation.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
