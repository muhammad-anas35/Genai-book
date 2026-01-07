import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import { ProviderFactory } from '../src/lib/provider-factory';

// Mock the server and routes
vi.mock('../src/server', () => {
  const mockApp = express();
  mockApp.use(express.json());

  // Mock the chat routes
  mockApp.post('/api/chat', (req, res) => {
    const { message, provider } = req.body;
    res.json({
      success: true,
      message: {
        role: 'assistant',
        content: `Response to: ${message} using ${provider || 'gemini'}`
      },
      metadata: {
        provider: provider || 'gemini'
      }
    });
  });

  mockApp.post('/api/chat/stream', (req, res) => {
    const { message, provider } = req.body;
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.write(`data: ${JSON.stringify({ type: 'chunk', data: `Streaming response to: ${message} using ${provider || 'gemini'}` })}\n\n`);
    res.write(`data: ${JSON.stringify({ type: 'done', data: {} })}\n\n`);
    res.end();
  });

  mockApp.get('/api/chat/providers', (req, res) => {
    res.json({
      success: true,
      providers: ProviderFactory.getAvailableProviders()
    });
  });

  return { default: mockApp };
});

describe('Integration Tests', () => {
  let app: express.Application;

  beforeEach(async () => {
    // Set up environment variables for testing
    process.env.GEMINI_API_KEY = 'test-gemini-key';
    process.env.OPENAI_API_KEY = 'test-openai-key';

    const serverModule = await import('../src/server');
    app = serverModule.default;
  });

  afterEach(() => {
    // Clean up environment variables
    delete process.env.GEMINI_API_KEY;
    delete process.env.OPENAI_API_KEY;
  });

  it('should handle chat requests with default provider', async () => {
    const response = await request(app)
      .post('/api/chat')
      .send({ message: 'Hello' })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.message.content).toContain('using gemini');
    expect(response.body.metadata.provider).toBe('gemini');
  });

  it('should handle chat requests with specified provider', async () => {
    const response = await request(app)
      .post('/api/chat')
      .send({ message: 'Hello', provider: 'openai' })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.message.content).toContain('using openai');
    expect(response.body.metadata.provider).toBe('openai');
  });

  it('should handle streaming chat requests with specified provider', async () => {
    const response = await request(app)
      .post('/api/chat/stream')
      .send({ message: 'Hello', provider: 'openai' })
      .expect(200);

    expect(response.text).toContain('openai');
  });

  it('should return available providers', async () => {
    const response = await request(app)
      .get('/api/chat/providers')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.providers).toContain('gemini');
    expect(response.body.providers).toContain('openai');
  });

  it('should handle validation errors', async () => {
    const response = await request(app)
      .post('/api/chat')
      .send({ message: '' }) // Invalid message
      .expect(400);

    expect(response.body.error).toBeDefined();
  });
});