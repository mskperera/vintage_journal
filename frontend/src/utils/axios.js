import axios from 'axios';

const customAxios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:5000',
});

customAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
       console.log('token ',token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    else{
      console.log('token noooo')
    }
    return config;
  },
  (error) => Promise.reject(error)
);

customAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // handle logout
    }
    return Promise.reject(error);
  }
);

export default customAxios;
