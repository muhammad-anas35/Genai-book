import React, { useState, useRef, useEffect } from 'react';
import { sendMessage, ChatMessage, getAvailableProviders } from '../../lib/chat-api';
import './ChatWidget.css';

/**
 * Chat widget component for RAG-powered Q&A
 */

export default function ChatWidget() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [provider, setProvider] = useState<'gemini' | 'openai'>('gemini');
    const [availableProviders, setAvailableProviders] = useState<string[]>(['gemini']);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Load available providers on component mount
    useEffect(() => {
        const loadProviders = async () => {
            try {
                const response = await getAvailableProviders();
                if (response.success) {
                    setAvailableProviders(response.providers);
                    // Set default provider to the first available one
                    if (response.providers.length > 0) {
                        setProvider(response.providers[0] as 'gemini' | 'openai');
                    }
                }
            } catch (err) {
                console.error('Failed to load providers:', err);
                // Keep default provider as gemini if loading fails
            }
        };

        loadProviders();
    }, []);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = {
            role: 'user',
            content: input.trim(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setError(null);

        try {
            const response = await sendMessage(input.trim(), undefined, provider);

            if (response.success && response.message) {
                setMessages(prev => [...prev, response.message]);
            } else {
                setError(response.error || 'Failed to get response');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to send message');
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleToggle = () => {
        // Toggle chat window open/close
        setIsOpen(!isOpen);
    };

    return (
        <div className={`chat-widget ${isOpen ? 'open' : 'closed'}`}>
            {/* Toggle Button */}
            <button
                className="chat-toggle"
                onClick={handleToggle}
                aria-label={isOpen ? 'Close chat' : 'Open chat'}
            >
                {isOpen ? '✕' : '💬'}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="chat-window">
                    {/* Header */}
                    <div className="chat-header">
                        <h3>📚 Ask about the Book</h3>
                        <p>Powered by AI & RAG</p>
                        <div className="provider-selector">
                            <label htmlFor="provider-select">AI Provider:</label>
                            <select
                                id="provider-select"
                                value={provider}
                                onChange={(e) => setProvider(e.target.value as 'gemini' | 'openai')}
                                className="provider-dropdown"
                                disabled={availableProviders.length <= 1}
                            >
                                {availableProviders.map((prov) => (
                                    <option key={prov} value={prov}>
                                        {prov.charAt(0).toUpperCase() + prov.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="chat-messages">
                        {messages.length === 0 && (
                            <div className="chat-welcome">
                                <p>👋 Hi! Ask me anything about Physical AI and Humanoid Robotics.</p>
                                <div className="chat-suggestions">
                                    <button onClick={() => setInput('What is ROS 2?')}>
                                        What is ROS 2?
                                    </button>
                                    <button onClick={() => setInput('Explain NVIDIA Isaac')}>
                                        Explain NVIDIA Isaac
                                    </button>
                                    <button onClick={() => setInput('How do humanoid robots work?')}>
                                        How do humanoid robots work?
                                    </button>
                                </div>
                            </div>
                        )}

                        {messages.map((msg, idx) => (
                            <div key={idx} className={`chat-message ${msg.role}`}>
                                <div className="message-avatar">
                                    {msg.role === 'user' ? '👤' : '🤖'}
                                </div>
                                <div className="message-content">
                                    <p>{msg.content}</p>
                                    {msg.sources && msg.sources.length > 0 && (
                                        <div className="message-sources">
                                            <p className="sources-title">📖 Sources:</p>
                                            {msg.sources.map((source, sidx) => (
                                                <div key={sidx} className="source-item">
                                                    <a href={`/docs/${source.documentPath}`}>
                                                        {source.chapter || source.documentPath}
                                                    </a>
                                                    <span className="source-score">
                                                        {(source.score * 100).toFixed(0)}% relevant
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="chat-message assistant">
                                <div className="message-avatar">🤖</div>
                                <div className="message-content">
                                    <div className="typing-indicator">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="chat-error">
                                ⚠️ {error}
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="chat-input">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask a question..."
                            rows={1}
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            aria-label="Send message"
                        >
                            {isLoading ? '⏳' : '➤'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
