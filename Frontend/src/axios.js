import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true,
});

// If you need to attach tokens in the future, you can add an interceptor here
// api.interceptors.request.use((config) => { ... });

export default api;
