import React, { useState } from 'react';
import { chatWithAgent } from '@site/src/services/api';

export default function ChatWidget() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [threadId, setThreadId] = useState(null);

  const handleSend = async () => {
    const userMsg = { role: 'user', content: input };
    setMessages([...messages, userMsg]);
    setInput('');

    try {
      const data = await chatWithAgent(input, threadId);
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      if (data.thread_id) setThreadId(data.thread_id);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'error', content: "Failed to connect to backend." }]);
    }
  };

  return (
    <div className="chat-container" style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
      <div className="messages" style={{ height: '300px', overflowY: 'scroll' }}>
        {messages.map((m, i) => (
          <p key={i}><strong>{m.role}:</strong> {m.content}</p>
        ))}
      </div>
      <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask anything..." />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}
