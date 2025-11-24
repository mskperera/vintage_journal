import customAxios from '../utils/axios';

export const loginUser = async (data) => {
  const res = await customAxios.post('/api/auth/login', data);
  return res.data;
};

export const signupUser = async (data) => {
  const res = await customAxios.post('/api/auth/signup', data);
  return res.data;
};