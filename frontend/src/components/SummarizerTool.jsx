import React, { useState, useEffect, useCallback } from "react";
import {
    Sparkles,
    Trash2,
    Copy,
    Download,
    CheckCircle2,
    Volume2,
    VolumeX,
    RefreshCcw,
    ArrowRight,
    History
} from "lucide-react";
import { cn } from "../lib/utils";

const SummarizerTool = ({ onViewHistory }) => {
    const [inputText, setInputText] = useState("");
    const [summary, setSummary] = useState("");
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);
    const [notification, setNotification] = useState("");
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [activeHistoryId, setActiveHistoryId] = useState(null);

    useEffect(() => {
        const savedHistory = localStorage.getItem("summary_history_grouped");
        if (savedHistory) {
            setHistory(JSON.parse(savedHistory));
        }
    }, []);

    const saveToHistory = useCallback((text, sum) => {
        const existingItemIndex = history.findIndex(item => item.original === text);

        let updatedHistory;
        const newSummary = {
            id: Date.now(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: sum
        };

        if (existingItemIndex !== -1) {
            updatedHistory = [...history];
            // Since we removed tone, we just keep the latest summary for this text
            updatedHistory[existingItemIndex].summaries = [newSummary];

            const item = updatedHistory.splice(existingItemIndex, 1)[0];
            updatedHistory.unshift(item);
        } else {
            const newEntry = {
                id: Date.now(),
                original: text,
                summaries: [newSummary]
            };
            updatedHistory = [newEntry, ...history].slice(0, 10);
        }

        setHistory(updatedHistory);
        localStorage.setItem("summary_history_grouped", JSON.stringify(updatedHistory));

        setActiveHistoryId(updatedHistory[0].id);
    }, [history]);

    const showNotification = (msg) => {
        setNotification(msg);
        setTimeout(() => setNotification(""), 3000);
    };

    const generateSummary = async () => {
        if (!inputText.trim()) return showNotification("Please enter some text!");
        setLoading(true);
        try {
            const response = await fetch("http://127.0.0.1:8000/summarize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text: inputText
                }),
            });
            const data = await response.json();
            if (data.summary) {
                setSummary(data.summary);
                saveToHistory(inputText, data.summary);
            } else {
                showNotification("Error generating summary");
            }
        } catch (err) {
            console.error(err);
            showNotification("Backend server is not responding");
        }
        setLoading(false);
    };

    const clearAll = () => {
        setInputText("");
        setSummary("");
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        showNotification("Copied to clipboard!");
    };

    const speakSummary = () => {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            return;
        }
        if (!summary) return;
        const utterance = new SpeechSynthesisUtterance(summary);
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
    };

    const downloadSummary = () => {
        const blob = new Blob([summary], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `summary_${Date.now()}.txt`;
        link.click();
        showNotification("Downloading...");
    };

    const wordCount = (text) => text.trim() ? text.trim().split(/\s+/).length : 0;
    const calculateReadingTime = (text) => {
        const words = wordCount(text);
        const minutes = Math.ceil(words / 200);
        return minutes === 1 ? "1 min" : `${minutes} mins`;
    };

    return (
        <div className="app-container">
            <aside className="sidebar">
                <div className="header">
                    <History size={20} className="text-emerald-400" />
                    <h2 className="label-text" style={{ margin: 0 }}>Recent Activities</h2>
                </div>
                <div className="history-list custom-scrollbar">
                    {history.length === 0 ? (
                        <div className="history-item" style={{ cursor: 'default', opacity: 0.5 }}>
                            <div className="history-item-preview">No history available</div>
                        </div>
                    ) : (
                        history.map((item) => (
                            <div
                                key={item.id}
                                className={cn("history-item", activeHistoryId === item.id && "active")}
                                onClick={() => {
                                    onViewHistory(item);
                                }}
                            >
                                <div className="history-item-header">
                                    <span>
                                        <History size={10} style={{ display: 'inline', marginRight: 4 }} />
                                        {item.summaries.length} {item.summaries.length === 1 ? 'version' : 'versions'}
                                    </span>
                                    <ArrowRight size={10} />
                                </div>
                                <div className="history-item-preview">{item.original}</div>
                            </div>
                        ))
                    )}
                </div>
                <div style={{ marginTop: 'auto' }}>
                    <button
                        className="btn btn-secondary"
                        style={{ width: '100%' }}
                        onClick={() => {
                            setHistory([]);
                            localStorage.removeItem("summary_history_grouped");
                            setActiveHistoryId(null);
                        }}
                    >
                        <Trash2 size={16} /> Clear History
                    </button>
                </div>
            </aside>

            <main className="main-content">
                <div className="summarizer-card glass-card">
                    <div className="header">
                        <Sparkles className={cn(loading && "loading-spinner", "text-emerald-400")} size={36} />
                        <h1>AI Summarizer Pro</h1>
                    </div>

                    <section className="input-section">
                        <div className="label-row">
                            <span className="label-text">Source Material</span>
                            <div className="stat-group">
                                <span className="stat-badge">{wordCount(inputText)} words</span>
                                <span className="stat-badge">{calculateReadingTime(inputText)} read</span>
                            </div>
                        </div>

                        <div className="textarea-wrapper">
                            <textarea
                                className="input-area custom-scrollbar"
                                value={inputText}
                                onChange={(e) => {
                                    setInputText(e.target.value);
                                    setActiveHistoryId(null); // Deselect if user types
                                }}
                                placeholder="Paste your document, article, or notes here for an instant summary..."
                            />
                        </div>

                        <div className="action-bar">
                            <button
                                className="btn btn-primary"
                                onClick={generateSummary}
                                disabled={loading}
                            >
                                {loading ? <RefreshCcw className="loading-spinner" size={20} /> : <Sparkles size={20} />}
                                {loading ? "Analyzing..." : "Generate AI Summary"}
                            </button>
                            <button className="btn btn-secondary" onClick={clearAll}>
                                <Trash2 size={20} /> Reset
                            </button>
                        </div>
                    </section>

                    <section className="output-section">
                        <div className="label-row">
                            <div className="summary-header-row">
                                <span className="label-text">AI Generation</span>
                            </div>
                            {summary && (
                                <div className="stat-group">
                                    <span className="stat-badge">{wordCount(summary)} words</span>
                                    <span className="stat-badge">{calculateReadingTime(summary)} read</span>
                                </div>
                            )}
                        </div>
                        <div className="textarea-wrapper">
                            <textarea
                                className="output-area custom-scrollbar"
                                value={summary}
                                readOnly
                                placeholder="Your high-fidelity summary will appear here..."
                            />
                        </div>
                        {summary && (
                            <div className="action-bar">
                                <button className="btn btn-secondary" onClick={() => copyToClipboard(summary)}>
                                    <Copy size={18} /> Copy Text
                                </button>
                                <button className="btn btn-secondary" onClick={downloadSummary}>
                                    <Download size={18} /> Export .txt
                                </button>
                                <button className="btn btn-secondary" onClick={speakSummary}>
                                    {isSpeaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
                                    {isSpeaking ? "Stop" : "Listen"}
                                </button>
                            </div>
                        )}
                    </section>
                </div>
            </main>

            {notification && (
                <div className="notification">
                    <CheckCircle2 size={20} className="text-emerald-400" />
                    <span>{notification}</span>
                </div>
            )}
        </div>
    );
};

export default SummarizerTool;
