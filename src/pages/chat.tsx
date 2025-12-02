// src/pages/chat.tsx
import React, { useState } from 'react';
import Layout from '@theme/Layout';

interface Message {
  id: number;
  sender: 'user' | 'bot';
  text: string;
}

function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage: Message = { id: messages.length + 1, sender: 'user', text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: input }),
      });
      const data = await response.json();
      
      const botMessage: Message = { id: messages.length + 2, sender: 'bot', text: data.response };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = { id: messages.length + 2, sender: 'bot', text: 'Error: Could not get a response.' };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Chat" description="Chat with the Physical AI & Humanoid Robotics book">
      <main className="container margin-vert--lg">
        <h1 className="hero__title">Chat with the Book</h1>
        <div className="card">
          <div className="card__body" style={{ height: '500px', overflowY: 'scroll', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messages.map((msg) => (
              <div key={msg.id} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', padding: '8px 12px', borderRadius: '15px', backgroundColor: msg.sender === 'user' ? '#007bff' : '#f0f0f0', color: msg.sender === 'user' ? 'white' : 'black', maxWidth: '70%' }}>
                {msg.text}
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: 'flex-start', padding: '8px 12px', borderRadius: '15px', backgroundColor: '#f0f0f0', color: 'black', maxWidth: '70%' }}>
                Thinking...
              </div>
            )}
          </div>
          <div className="card__footer" style={{ display: 'flex', gap: '10px', paddingTop: '10px' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              placeholder="Ask a question about the book..."
              style={{ flexGrow: 1, padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
              disabled={loading}
            />
            <button
              onClick={handleSendMessage}
              style={{ padding: '8px 15px', borderRadius: '5px', border: 'none', backgroundColor: '#007bff', color: 'white', cursor: 'pointer' }}
              disabled={loading}
            >
              Send
            </button>
          </div>
        </div>
      </main>
    </Layout>
  );
}

export default ChatPage;
