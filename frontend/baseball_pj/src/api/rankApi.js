import axios from 'axios';

export const fetchTodayRanks = async () => {
  const response = await axios.get('/api/ranks/today');
  return response.data;
};
