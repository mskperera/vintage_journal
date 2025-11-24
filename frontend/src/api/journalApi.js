import customAxios from '../utils/axios';

export const getAllEntryDates = async () => {
  const res = await customAxios.get('/api/entries/dates');
  return res.data;
};

export const getEntryByDate = async (date) => {
  const res = await customAxios.get(`/api/entries/${date}`);
  return res.data;
};

export const saveEntry = async (data) => {
  const res = await customAxios.post('/api/entries', data);
  return res.data;
};

export const exportAllEntries = async () => {
  const res = await customAxios.get('/api/export');
  return res.data;
};