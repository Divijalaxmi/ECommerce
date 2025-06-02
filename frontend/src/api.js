// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // this pulls from your .env file
  withCredentials: true, // keep if using cookies or sessions
});

export default api;
