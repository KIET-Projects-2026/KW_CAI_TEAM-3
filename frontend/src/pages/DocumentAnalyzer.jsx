import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, RefreshCcw, Search, Key, ListOrdered } from 'lucide-react';
import { analyzeDocument } from '../utils/api';
import { useNotification } from '../context/NotificationContext';
import { cn } from '../lib/utils';

const DocumentAnalyzer = () => {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const { showNotification } = useNotification();

    const handleUpload = async (e) => {
        const uploadedFile = e.target.files[0];
        if (!uploadedFile) return;
        
        setFile(uploadedFile);
        setLoading(true);
        try {
            const data = await analyzeDocument(uploadedFile);
            if (data.summary) {
                setResult(data);
                showNotification("Document analyzed successfully!", "success");
            }
        } catch (err) {
            showNotification("Failed to analyze document", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-wrapper container py-10">
            <header className="section-header mb-12">
                <h2 className="text-4xl font-extrabold mb-4">Document Analyzer</h2>
                <p className="text-muted text-lg">Upload PDF, DOCX, or TXT for deep AI-powered insights.</p>
            </header>

            {!result ? (
                <div className="upload-container glass-card mt-10 p-20 h-80 flex items-center justify-center border-2 border-dashed border-emerald-500/20 hover:border-emerald-500/50 transition-all cursor-pointer">
                    <label className="upload-label w-full h-full flex items-center justify-center cursor-pointer">
                        <input type="file" onChange={handleUpload} style={{ display: 'none' }} accept=".pdf,.docx,.txt" />
                        <div className="upload-content text-center">
                            <Upload size={64} className="text-emerald-400 mb-6 mx-auto opacity-80" />
                            {loading ? (
                                <RefreshCcw className="loading-spinner text-emerald-400 mx-auto" size={32} />
                            ) : (
                                <>
                                    <p className="text-xl font-semibold mb-2">Click to upload or drag files</p>
                                    <span className="text-sm opacity-50 block">PDF, Word, or Text documents (Up to 10MB)</span>
                                </>
                            )}
                        </div>
                    </label>
                </div>
            ) : (
                <div className="analysis-grid glass-card p-12 mt-10">
                    <div className="file-info mb-12 flex items-center justify-between pb-8 border-b border-border">
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                                <FileText size={48} className="text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">{file.name}</h3>
                                <div className="flex gap-3 mt-2">
                                    <span className="stat-badge">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                    <span className="stat-badge bg-blue-500/10 text-blue-400 border-blue-500/20 uppercase tracking-wider">{file.name.split('.').pop()}</span>
                                </div>
                            </div>
                        </div>
                        <button className="btn btn-secondary px-8 hover:bg-emerald-500/5" onClick={() => {setResult(null); setFile(null);}}>
                            <Upload size={20} /> New Analysis
                        </button>
                    </div>

                    <div className="analysis-sections space-y-10">
                        <section className="analysis-block">
                            <div className="label-row mb-4">
                                <Search size={20} className="text-emerald-400" />
                                <span className="label-text">Executive Summary</span>
                            </div>
                            <div className="analysis-content bg-input/50 p-8 rounded-2xl border border-border leading-relaxed shadow-inner">
                                {result.summary}
                            </div>
                        </section>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            <section className="analysis-block">
                                <div className="label-row mb-4">
                                    <ListOrdered size={20} className="text-emerald-400" />
                                    <span className="label-text">Key Findings & Insights</span>
                                </div>
                                <div className="analysis-content bg-input/50 p-8 rounded-2xl border border-border min-h-[250px] shadow-inner">
                                    {result.key_points}
                                </div>
                            </section>

                            <section className="analysis-block">
                                <div className="label-row mb-4">
                                    <Key size={20} className="text-emerald-400" />
                                    <span className="label-text">extracted Keywords</span>
                                </div>
                                <div className="keyword-cloud flex flex-wrap gap-3 bg-input/30 p-8 rounded-2xl border border-border min-h-[250px] shadow-inner">
                                    {result.keywords.map((k, i) => (
                                        <span key={i} className="px-5 py-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-sm font-bold shadow-sm hover:scale-105 transition-transform cursor-default">
                                            {k}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocumentAnalyzer;
