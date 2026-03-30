import React, { useState } from 'react';
import { Columns, Sparkles, RefreshCcw, Split } from 'lucide-react';
import { summarizeText } from '../utils/api';
import { useNotification } from '../context/NotificationContext';

const CompareSummaries = () => {
    const [inputText, setInputText] = useState("");
    const [summary1, setSummary1] = useState("");
    const [summary2, setSummary2] = useState("");
    const [loading, setLoading] = useState(false);
    const { showNotification } = useNotification();

    const handleCompare = async () => {
        if (!inputText.trim()) return showNotification("Please enter text!");
        setLoading(true);
        try {
            const [res1, res2] = await Promise.all([
                summarizeText(inputText, "summarize"),
                summarizeText(inputText, "bullets")
            ]);
            setSummary1(res1.summary);
            setSummary2(res2.summary);
            showNotification("Comparison generated!");
        } catch (err) {
            showNotification("Error during comparison", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-wrapper container py-10">
            <header className="section-header mb-12">
                <h2 className="text-4xl font-extrabold mb-4">Style Comparison</h2>
                <p className="text-muted text-lg">Compare different AI summaries side-by-side to find the best fit.</p>
            </header>

            <div className="glass-card p-12 mb-12 mt-10">
                <div className="label-row mb-6">
                    <span className="label-text">Source Content</span>
                </div>
                <textarea 
                    className="input-area custom-scrollbar"
                    style={{ height: '180px', minHeight: '180px' }}
                    placeholder="Enter the text you want to compare..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                />
                <div className="flex justify-start mt-8">
                    <button className="btn btn-primary px-12 py-4" onClick={handleCompare} disabled={loading}>
                        {loading ? <RefreshCcw size={22} className="loading-spinner" /> : <Split size={22} />}
                        Compare Generation Styles
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="glass-card p-10 border-t-4 border-t-emerald-500/50">
                    <div className="label-row mb-6 flex justify-between items-center">
                        <span className="label-text">Professional Summary</span>
                        <span className="stat-badge">Concise</span>
                    </div>
                    <div className="analysis-content custom-scrollbar" style={{ minHeight: '350px' }}>
                        {summary1 || "Awaiting generation..."}
                    </div>
                </div>
                <div className="glass-card p-10 border-t-4 border-t-blue-500/50">
                    <div className="label-row mb-6 flex justify-between items-center">
                        <span className="label-text">Key Highlights</span>
                        <span className="stat-badge bg-blue-500/10 text-blue-400 border-blue-500/20">Bullets</span>
                    </div>
                    <div className="analysis-content custom-scrollbar" style={{ minHeight: '350px' }}>
                        {summary2 || "Awaiting generation..."}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompareSummaries;
