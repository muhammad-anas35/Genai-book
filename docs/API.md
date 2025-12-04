# API Documentation

## Base URL

- **Development**: `http://localhost:4000`
- **Production**: `https://your-domain.com`

## Authentication

All protected endpoints require authentication via session cookies. Include credentials in requests:

```javascript
fetch('/api/chat', {
  credentials: 'include',
  // ...
})
```

---

## Public Endpoints

### Health Check

**GET** `/api/health`

Check server status.

**Response**:
```json
{
  "status": "ok",
  "timestamp": "2024-12-04T20:00:00.000Z",
  "authenticated": false
}
```

### Sign Up

**POST** `/api/auth/signup/email`

Create a new user account.

**Request**:
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe"
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "Account created successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "redirect": "/"
}
```

### Sign In

**POST** `/api/auth/signin/email`

Authenticate user.

**Request**:
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Logged in successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "redirect": "/"
}
```

---

## Protected Endpoints

### Send Chat Message

**POST** `/api/chat`

Send a message and get AI response with RAG.

**Request**:
```json
{
  "message": "What is ROS 2?",
  "chapter": "chapter2",
  "conversationId": "uuid"
}
```

**Response** (200):
```json
{
  "success": true,
  "conversationId": "uuid",
  "message": {
    "role": "assistant",
    "content": "ROS 2 is...",
    "sources": [
      {
        "chunkId": "uuid",
        "documentPath": "chapter2/ros2.md",
        "content": "ROS 2 (Robot Operating System 2)...",
        "score": 0.92,
        "chapter": "chapter2",
        "section": "ros2"
      }
    ]
  },
  "metadata": {
    "retrievalTime": 150,
    "generationTime": 2300,
    "totalTime": 2450,
    "chunksRetrieved": 5
  }
}
```

### Get Chat History

**GET** `/api/chat/history`

Get user's conversation history.

**Query Parameters**:
- `limit` (optional): Number of conversations (default: 20)
- `offset` (optional): Pagination offset (default: 0)

**Response** (200):
```json
{
  "success": true,
  "conversations": [
    {
      "id": "uuid",
      "userId": "uuid",
      "title": "ROS 2 Discussion",
      "createdAt": "2024-12-04T20:00:00.000Z",
      "updatedAt": "2024-12-04T20:15:00.000Z",
      "messageCount": 8
    }
  ],
  "total": 1,
  "limit": 20,
  "offset": 0
}
```

### Get Conversation Messages

**GET** `/api/chat/conversation/:id`

Get all messages in a conversation.

**Response** (200):
```json
{
  "success": true,
  "conversationId": "uuid",
  "messages": [
    {
      "id": "uuid",
      "conversationId": "uuid",
      "role": "user",
      "content": "What is ROS 2?",
      "sources": null,
      "createdAt": "2024-12-04T20:00:00.000Z"
    },
    {
      "id": "uuid",
      "conversationId": "uuid",
      "role": "assistant",
      "content": "ROS 2 is...",
      "sources": [...],
      "createdAt": "2024-12-04T20:00:05.000Z"
    }
  ]
}
```

### Get User Preferences

**GET** `/api/preferences`

Get user preferences.

**Response** (200):
```json
{
  "success": true,
  "preferences": {
    "id": "uuid",
    "userId": "uuid",
    "theme": "dark",
    "language": "en",
    "chatSettings": {
      "temperature": 0.7,
      "maxTokens": 1000,
      "showSources": true,
      "autoSave": true
    },
    "createdAt": "2024-12-04T20:00:00.000Z",
    "updatedAt": "2024-12-04T20:00:00.000Z"
  }
}
```

### Update User Preferences

**PUT** `/api/preferences`

Update user preferences.

**Request**:
```json
{
  "theme": "dark",
  "language": "en",
  "chatSettings": {
    "showSources": false
  }
}
```

**Response** (200):
```json
{
  "success": true,
  "preferences": {
    "id": "uuid",
    "userId": "uuid",
    "theme": "dark",
    "language": "en",
    "chatSettings": {
      "temperature": 0.7,
      "maxTokens": 1000,
      "showSources": false,
      "autoSave": true
    },
    "updatedAt": "2024-12-04T20:05:00.000Z"
  }
}
```

---

## Error Responses

All endpoints may return error responses:

**400 Bad Request**:
```json
{
  "success": false,
  "error": "Message is required"
}
```

**401 Unauthorized**:
```json
{
  "error": "Unauthorized",
  "message": "Please login to access this resource"
}
```

**500 Internal Server Error**:
```json
{
  "success": false,
  "error": "Failed to generate response. Please try again."
}
```

---

## Rate Limiting

- **Chat endpoints**: 20 requests per minute
- **Auth endpoints**: 5 requests per minute
- **Other endpoints**: 60 requests per minute

---

## Streaming (SSE)

### Stream Chat Response

**POST** `/api/chat/stream`

Stream AI response in real-time using Server-Sent Events.

**Request**:
```json
{
  "message": "Explain NVIDIA Isaac",
  "chapter": "chapter3"
}
```

**Response** (SSE):
```
data: {"type":"sources","data":[...]}

data: {"type":"chunk","data":"NVIDIA Isaac is"}

data: {"type":"chunk","data":" a robotics"}

data: {"type":"done","data":{}}
```

**Event Types**:
- `sources`: Source citations
- `chunk`: Text chunk
- `done`: Stream complete
- `error`: Error occurred
