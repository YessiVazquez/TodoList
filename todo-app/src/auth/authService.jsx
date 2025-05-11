import axios from "axios";

const API_URL = "https://todo-backend-production-f566.up.railway.app/api";

export const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials);
  return response.data;
};

export const register = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/register`, {
    username: userData.username,
    email: userData.email,
    password: userData.password
  });
  return response.data;
};