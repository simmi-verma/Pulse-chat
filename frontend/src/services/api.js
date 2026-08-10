import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

export const fetchChatHistory = async () => {
  try {
    const response = await api.get('/messages');
    return response.data;
  } catch (error) {
    console.error('API Error fetching chat history:', error);
    throw error;
  }
};

export const sendApiMessage = async (messageData) => {
  try {
    const response = await api.post('/messages', messageData);
    return response.data;
  } catch (error) {
    console.error('API Error sending message:', error);
    throw error;
  }
};

export const markMessagesReadApi = async () => {
  try {
    const response = await api.put('/messages/read');
    return response.data;
  } catch (error) {
    console.error('API Error marking read:', error);
    throw error;
  }
};

export default api;
