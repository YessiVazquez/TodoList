import axios from "axios";

const API_URL = "http://localhost:3001/api/auth";

export const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  return response.data;
};

export const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, {
    username: userData.username,
    email: userData.email,
    password: userData.password
  });
  return response.data;
};