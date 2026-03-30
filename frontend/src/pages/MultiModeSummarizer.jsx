import React, { useState, useEffect } from 'react';
import { Sparkles, Trash2, Copy, Download, Volume2, VolumeX, RefreshCcw, History, Type, Zap, FileText, List } from 'lucide-react';
import { summarizeText } from '../utils/api';
import { useNotification } from '../context/NotificationContext';
import AIChat from '../components/AIChat';
import { cn } from '../lib/utils';

const MultiModeSummarizer = () => {
    const [inputText, setInputText] = useState("");
    const [output, setOutput] = useState("");
    const [mode, setMode] = useState("summarize");
    const [loading, setLoading] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const { showNotification } = useNotification();

    const modes = [
        { id: 'summarize', label: 'Summarize', icon: FileText, desc: 'Shorten text while keeping key info' },
        { id: 'paraphrase', label: 'Paraphrase', icon: Type, desc: 'Rewrite text in different words' },
        { id: 'simplify', label: 'Simplify', icon: Zap, desc: 'Make text easier to understand' },
        { id: 'bullets', label: 'Bullets', icon: List, desc: 'Convert to clear bullet points' }
    ];

    const handleGenerate = async () => {
        if (!inputText.trim()) return showNotification("Please enter some text!");
        setLoading(true);
        try {
            const data = await summarizeText(inputText, mode);
            if (data.summary) {
                setOutput(data.summary);
                showNotification(`${mode.charAt(0).toUpperCase() + mode.slice(1)} generated!`, "success");
            }
        } catch (err) {
            showNotification("Backend server is not responding", "error");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(output);
        showNotification("Copied to clipboard!");
    };

    const speak = () => {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            return;
        }
        const utterance = new SpeechSynthesisUtterance(output);
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
    };

    return (
        <div className="page-wrapper">
            <div className="main-grid">
                <div className="tool-section">
                    <div className="glass-card summarizer-card">
                        <div className="header mb-10 flex items-center gap-4">
                            <Sparkles className="text-emerald-400" size={40} />
                            <h1>Multi-Mode AI</h1>
                        </div>

                        <div className="mode-tabs">
                            {modes.map(m => (
                                <button 
                                    key={m.id}
                                    className={cn("mode-tab", mode === m.id && "active")}
                                    onClick={() => setMode(m.id)}
                                >
                                    <m.icon size={18} />
                                    <span>{m.label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="input-group">
                            <textarea 
                                className="input-area custom-scrollbar"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Paste your text here to begin summarizing, paraphrasing, or simplifying..."
                            />
                            <div className="action-bar flex gap-4">
                                <button className="btn btn-primary px-10" onClick={handleGenerate} disabled={loading}>
                                    {loading ? <RefreshCcw className="loading-spinner" size={20} /> : <Sparkles size={20} />}
                                    Generate Content
                                </button>
                                <button className="btn btn-secondary" onClick={() => {setInputText(""); setOutput("");}}>
                                    <Trash2 size={20} /> Reset
                                </button>
                            </div>
                        </div>

                        {output && (
                            <div className="output-group mt-12 pt-12 border-t border-border">
                                <div className="label-row mb-6">
                                    <span className="label-text">AI Generated {mode}</span>
                                </div>
                                <div className="analysis-content custom-scrollbar" style={{ minHeight: '200px', whiteSpace: 'pre-wrap' }}>
                                    {output}
                                </div>
                                <div className="action-bar mt-6 flex gap-3">
                                    <button className="btn btn-secondary py-3" onClick={copyToClipboard}>
                                        <Copy size={18} /> Copy to Clipboard
                                    </button>
                                    <button className="btn btn-secondary py-3" onClick={speak}>
                                        {isSpeaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
                                        Listen
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="side-section">
                    <AIChat context={inputText} />
                </div>
            </div>
        </div>
    );
};

export default MultiModeSummarizer;
