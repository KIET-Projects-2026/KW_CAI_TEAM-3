import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, MessageSquare } from 'lucide-react';
import { chatWithAI } from '../utils/api';
import { useNotification } from '../context/NotificationContext';

const AIChat = ({ context }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);
    const { showNotification } = useNotification();

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || !context) return;
        
        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const data = await chatWithAI(input, context);
            if (data.reply) {
                setMessages(prev => [...prev, { role: 'bot', text: data.reply }]);
            }
        } catch (err) {
            showNotification("Failed to get response from AI", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ai-chat-container glass-card">
            <div className="chat-header">
                <MessageSquare size={18} className="text-emerald-400" />
                <h3>Chat with your Text</h3>
            </div>
            
            <div className="chat-messages custom-scrollbar" ref={scrollRef}>
                {messages.length === 0 && (
                    <div className="empty-chat">
                        <Bot size={32} opacity={0.3} />
                        <p>Ask me anything about the text above!</p>
                    </div>
                )}
                {messages.map((m, i) => (
                    <div key={i} className={`message-wrapper ${m.role}`}>
                        <div className="message-icon">
                            {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                        </div>
                        <div className="message-text">{m.text}</div>
                    </div>
                ))}
                {loading && (
                    <div className="message-wrapper bot">
                        <div className="message-icon loading-spinner"><Bot size={14} /></div>
                        <div className="message-text">Thinking...</div>
                    </div>
                )}
            </div>

            <div className="chat-input-row">
                <input 
                    type="text" 
                    placeholder="Type your question..." 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <button className="btn btn-primary" onClick={handleSend} disabled={loading || !context}>
                    <Send size={18} />
                </button>
            </div>
        </div>
    );
};

export default AIChat;
