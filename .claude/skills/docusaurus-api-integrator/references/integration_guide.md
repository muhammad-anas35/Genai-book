# RAGAI Book Backend - Docusaurus Integration Guide

This guide explains how to connect your **Docusaurus** frontend to the RAGAI Book Backend. Since Docusaurus is a React-based SSR (Server-Side Rendering) framework, we need to handle browser-specific APIs (like `localStorage` and `fetch`) correctly.

## 🔗 Base Configuration

- **Backend URL:** `http://localhost:8000`
- **Auth Strategy:** Bearer JWT stored in `localStorage`.

---

## 👤 User Profile & Personalization

The backend now supports personalized AI responses based on the user's profile provided during signup.

### 📝 Signup Payload
When creating a user, you should send the following fields to enable personalization:

- **Endpoint:** `POST /api/v1/auth/signup`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "Anas Asif",
    "experience": "Senior AI Engineer",
    "goal": "Optimize RAG retrieval",
    "plan": "Premium"
  }
  ```

### 🧠 Personalized AI Behavior
The Chat Agent is aware of the user's **Name**, **Experience**, and **Goal**.
- If a user with "Beginner" experience asks a question, the agent explains concepts simply.
- If a user with "Senior" experience asks, the agent provides technical, in-depth details.
- The agent will address the user by name when appropriate.

---

## 🛠️ Docusaurus Integration (React Hooks)

In Docusaurus, code inside components runs on both the server (during build) and the client. Always use `useEffect` or check for the `window` object before using `localStorage`.

### 1. Create an API Service
Create a file at `src/services/api.js`:

```javascript
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

const API_URL = "http://localhost:8000/api/v1";

const getAuthToken = () => {
  if (ExecutionEnvironment.canUseDOM) {
    return localStorage.getItem("token");
  }
  return null;
};

export const chatWithAgent = async (message, threadId = null) => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/chat/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ message, thread_id: threadId })
  });
  return response.json();
};

export const login = async (email, password) => {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  const res = await fetch(`${API_URL}/auth/login/access-token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData,
  });
  
  const data = await res.json();
  if (data.access_token && ExecutionEnvironment.canUseDOM) {
    localStorage.setItem("token", data.access_token);
  }
  return data;
};

export const signup = async (userData) => {
  // userData should contain: { email, password, name, experience, goal, plan }
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return res.json();
};
```

### 2. Create a Chat Component
Create a component at `src/components/ChatWidget/index.js`:

```jsx
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
```

### 3. Usage in Markdown (MDX)
Docusaurus allows you to use React components directly in your docs. In any `.md` or `.mdx` file:

```mdx
---
title: Try our AI Assistant
---

import ChatWidget from '@site/src/components/ChatWidget';

Welcome to the documentation! You can ask our AI assistant questions about this project directly below:

<ChatWidget />
```

---

## 🔒 Security & CORS

1.  **CORS:** I have already enabled CORS for all origins in the backend. If you deploy your Docusaurus site to a specific domain (e.g., `https://docs.myapp.com`), update `app/main.py` to restrict `allow_origins` to that domain.
2.  **Environment Variables:** Do not hardcode the `API_URL`. In Docusaurus, you can use `customFields` in `docusaurus.config.js`:

```javascript
// docusaurus.config.js
module.exports = {
  customFields: {
    apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:8000/api/v1',
  },
};
```

Then access it via:
```javascript
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
const { siteConfig } = useDocusaurusContext();
const API_URL = siteConfig.customFields.apiBaseUrl;
```

---

## 🚀 Deployment Tip
When deploying Docusaurus to Vercel/Netlify and the Backend to Render/Neon:
- Ensure the backend is running and the URL is updated in your Docusaurus environment variables.
- Use `https` for both to avoid "Mixed Content" security errors in the browser.
