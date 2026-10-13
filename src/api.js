// Address of the backend API.
// - On your computer it defaults to the local server.
// - On Vercel, set the VITE_API_URL environment variable to the hosted backend,
//   for example: https://your-backend.onrender.com/api
const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const API_URL = rawUrl.replace(/\/+$/, '');
