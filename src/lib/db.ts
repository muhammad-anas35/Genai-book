// src/lib/db.ts
import * as dotenv from 'dotenv'; // Import dotenv

dotenv.config(); // Load environment variables

// The connection string for your Neon DB.
const connectionString = process.env.NEON_DATABASE_URL;

let _sqlInstance: any | null = null; // Private variable to hold the SQL client instance

export async function getDbClient() {
  if (_sqlInstance) {
    return _sqlInstance; // Return existing instance if already initialized
  }

  // Only attempt to initialize postgres-js if in a Node.js environment
  if (typeof window === 'undefined' && connectionString) {
    try {
      const postgres = require('postgres-js').default; // Dynamically import postgres-js
      _sqlInstance = postgres(connectionString);
      return _sqlInstance;
    } catch (e) {
      console.error('Failed to load or initialize postgres-js in Node.js environment:', e.message);
      // Fallback to mock and log error if real DB client fails
    }
  }

  console.warn('NEON_DATABASE_URL environment variable is not set, or running in browser context. Using mock database client.');
  // Create and return a mock database client
  _sqlInstance = {
    async query(...args: any[]) {
      console.warn('Mock database: query attempted without real DB connection.');
      return [];
    },
    async tag(strings: TemplateStringsArray, ...values: any[]) {
      console.warn('Mock database: tagged query attempted without real DB connection.');
      return [];
    },
    // Mock for template literal usage
    [Symbol.toPrimitive]() {
      return (strings: TemplateStringsArray, ...values: any[]) => {
        console.warn('Mock database: template literal query attempted without real DB connection.');
        return [];
      };
    },
    end: async () => { console.warn('Mock database: end() called.'); }
  };
  return _sqlInstance;
}

export default getDbClient; // Export the function

