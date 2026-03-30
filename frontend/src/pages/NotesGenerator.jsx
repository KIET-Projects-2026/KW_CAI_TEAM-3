import React, { useState } from 'react';
import { PenTool, CheckCircle2, Copy, Download, RefreshCcw, BookOpen, HelpCircle } from 'lucide-react';
import { summarizeText } from '../utils/api';
import { useNotification } from '../context/NotificationContext';
import { cn } from '../lib/utils';

const NotesGenerator = () => {
    const [inputText, setInputText] = useState("");
    const [output, setOutput] = useState("");
    const [noteType, setNoteType] = useState("notes"); // notes, qa
    const [loading, setLoading] = useState(false);
    const { showNotification } = useNotification();

    const handleGenerate = async () => {
        if (!inputText.trim()) return showNotification("Please enter some text!");
        setLoading(true);
        try {
            const data = await summarizeText(inputText, noteType);
            if (data.summary) {
                setOutput(data.summary);
                showNotification("Notes generated!", "success");
            }
        } catch (err) {
            showNotification("Backend server error", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-wrapper container py-10">
            <header className="section-header mb-12">
                <h2 className="text-4xl font-extrabold mb-4">Notes & Q&A Generator</h2>
                <p className="text-muted text-lg">Transform complex material into organized study aids and test questions.</p>
            </header>

            <div className="main-grid mt-10">
                <div className="tool-section">
                    <div className="glass-card summarizer-card h-full">
                        <div className="mode-tabs">
                            <button 
                                className={cn("mode-tab", noteType === "notes" && "active")}
                                onClick={() => setNoteType("notes")}
                            >
                                <BookOpen size={18} /> Study Notes
                            </button>
                            <button 
                                className={cn("mode-tab", noteType === "qa" && "active")}
                                onClick={() => setNoteType("qa")}
                            >
                                <HelpCircle size={18} /> Q&A Format
                            </button>
                        </div>

                        <textarea 
                            className="input-area mt-6 custom-scrollbar"
                            placeholder="Paste your source material (articles, lecture notes, transcripts) here..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            style={{ minHeight: '350px' }}
                        />
                        
                        <div className="action-bar mt-8">
                            <button className="btn btn-primary px-12" onClick={handleGenerate} disabled={loading}>
                                {loading ? <RefreshCcw size={20} className="loading-spinner" /> : <PenTool size={20} />}
                                Generate {noteType === 'qa' ? 'Q&A' : 'Notes'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="side-section">
                    <div className="glass-card p-10 h-full flex flex-col">
                        <div className="label-row mb-6">
                            <span className="label-text">Generated result</span>
                        </div>
                        <div className="analysis-content flex-1 custom-scrollbar overflow-y-auto" style={{ minHeight: '400px', whiteSpace: 'pre-wrap' }}>
                            {output || "Your structured content will appear here after generation..."}
                        </div>
                        {output && (
                            <div className="action-bar mt-8">
                                <button className="btn btn-secondary w-full py-4 text-emerald-400 border-emerald-500/20" onClick={() => {
                                    navigator.clipboard.writeText(output);
                                    showNotification("Copied to clipboard!", "success");
                                }}>
                                    <Copy size={18} /> Copy to Clipboard
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotesGenerator;
