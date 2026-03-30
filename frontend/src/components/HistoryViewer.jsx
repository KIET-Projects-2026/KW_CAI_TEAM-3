import React, { useState } from 'react';
import { ArrowLeft, History, Copy, Download, Volume2, VolumeX } from 'lucide-react';
import { cn } from '../lib/utils'; // Assuming this utility exists based on previous edits

const HistoryViewer = ({ item, onBack, onCopy, onDownload, onSpeak, isSpeaking }) => {
    const [selectedIdx, setSelectedIdx] = useState(0);
    const activeSummary = item.summaries[selectedIdx];

    return (
        <div className="main-content">
            <div className="summarizer-card glass-card">
                <div className="header flex-between">
                    <button className="btn btn-secondary px-4 py-2" onClick={onBack}>
                        <ArrowLeft size={18} /> Back
                    </button>
                    <div className="items-center gap-3">
                        <History className="text-emerald-400" size={24} />
                        <h1 style={{ fontSize: '24px' }}>Archive Viewer</h1>
                    </div>
                </div>

                <section className="input-section">
                    <div className="label-row">
                        <span className="label-text">Original Source</span>
                        <span className="stat-badge">{item.original.split(/\s+/).length} words</span>
                    </div>
                    <div className="textarea-wrapper">
                        <textarea
                            className="input-area custom-scrollbar"
                            value={item.original}
                            readOnly
                            style={{ height: '180px', opacity: 0.8 }}
                        />
                    </div>
                </section>

                <section className="output-section">
                    <div className="label-row" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span className="label-text">Generated Summary</span>
                    </div>

                    <div className="textarea-wrapper" style={{ marginTop: '12px' }}>
                        <textarea
                            className="output-area custom-scrollbar"
                            value={item.summaries[0].text}
                            readOnly
                            style={{ minHeight: '250px' }}
                        />
                    </div>

                    <div className="action-bar">
                        <button className="btn btn-secondary" onClick={() => onCopy(activeSummary.text)}>
                            <Copy size={18} /> Copy
                        </button>
                        <button className="btn btn-secondary" onClick={() => onDownload(activeSummary.text)}>
                            <Download size={18} /> Export
                        </button>
                        <button className="btn btn-secondary" onClick={() => onSpeak(activeSummary.text)}>
                            {isSpeaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
                            {isSpeaking ? "Stop" : "Listen"}
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default HistoryViewer;
