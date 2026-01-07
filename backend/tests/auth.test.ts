import { describe, it, expect, beforeEach, afterEach, vi, MockedFunction } from 'vitest';
import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../src/db';
import * as schema from '../src/db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

// Mock the database
vi.mock('../src/db', () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
  },
}));

// Create a simple express app for testing
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import and set up routes
import { requireAuth } from '../src/server'; // Assuming this is exported or available

describe('Authentication API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/auth/signup/email', () => {
    it('should create a new user with valid credentials', async () => {
      // Mock database responses
      (db.select as MockedFunction<any>).mockReturnValue({
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([]), // No existing user
      });

      (db.insert as MockedFunction<any>).mockReturnValue({
        values: vi.fn().mockResolvedValue(undefined),
      });

      const response = await request(app)
        .post('/api/auth/signup/email')
        .send({
          email: 'test@example.com',
          password: 'securepassword123',
          name: 'Test User'
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should return 400 if email or password is missing', async () => {
      const response = await request(app)
        .post('/api/auth/signup/email')
        .send({
          email: '',
          password: 'password123'
        })
        .expect(400);

      expect(response.body.error).toBe('Email and password required');
    });

    it('should return 400 if password is too short', async () => {
      const response = await request(app)
        .post('/api/auth/signup/email')
        .send({
          email: 'test@example.com',
          password: 'short'
        })
        .expect(400);

      expect(response.body.error).toBe('Password must be at least 8 characters');
    });

    it('should return 409 if user already exists', async () => {
      // Mock database to return existing user
      (db.select as MockedFunction<any>).mockReturnValue({
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([{ id: 'existing-user-id' }]),
      });

      const response = await request(app)
        .post('/api/auth/signup/email')
        .send({
          email: 'existing@example.com',
          password: 'password123'
        })
        .expect(409);

      expect(response.body.error).toBe('User already exists');
    });
  });

  describe('POST /api/auth/signin/email', () => {
    it('should login user with valid credentials', async () => {
      // Mock database responses
      (db.select as MockedFunction<any>).mockReturnValue({
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([{
          id: 'user-id',
          email: 'test@example.com',
          name: 'Test User',
          passwordHash: await bcrypt.hash('password123', 12)
        }]),
      });

      const response = await request(app)
        .post('/api/auth/signin/email')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should return 401 for invalid credentials', async () => {
      // Mock database to return user with different password
      (db.select as MockedFunction<any>).mockReturnValue({
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([{
          id: 'user-id',
          email: 'test@example.com',
          name: 'Test User',
          passwordHash: await bcrypt.hash('differentpassword', 12)
        }]),
      });

      const response = await request(app)
        .post('/api/auth/signin/email')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.error).toBe('Invalid email or password');
    });

    it('should return 401 if user does not exist', async () => {
      // Mock database to return no users
      (db.select as MockedFunction<any>).mockReturnValue({
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([]),
      });

      const response = await request(app)
        .post('/api/auth/signin/email')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        })
        .expect(401);

      expect(response.body.error).toBe('Invalid email or password');
    });
  });
});

describe('Password Security', () => {
  it('should properly hash passwords with bcrypt', async () => {
    const plainPassword = 'mySecurePassword123';
    const hashedPassword = await bcrypt.hash(plainPassword, 12);

    // Verify the password can be compared correctly
    const isValid = await bcrypt.compare(plainPassword, hashedPassword);
    expect(isValid).toBe(true);

    // Verify a wrong password fails
    const isWrongValid = await bcrypt.compare('wrongpassword', hashedPassword);
    expect(isWrongValid).toBe(false);
  });

  it('should use appropriate salt rounds', async () => {
    const plainPassword = 'testpassword';
    const hashedPassword = await bcrypt.hash(plainPassword, 12);

    // Check that the hash includes the salt rounds (should be 12)
    const parts = hashedPassword.split('$');
    expect(parts[1]).toBe('2b'); // bcrypt version
    expect(parts[2]).toBe('12'); // salt rounds
  });
});