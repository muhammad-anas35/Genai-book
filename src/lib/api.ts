// Shared API base URL for frontend
export const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? ''
    : 'http://localhost:4000';
