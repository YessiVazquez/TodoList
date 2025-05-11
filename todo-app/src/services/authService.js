// src/services/authService.js
import axios from "axios";

const API_URL = "https://todo-backend-production-f566.up.railway.app/api";

export const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials);
  // Asegúrate de guardar el token y datos del usuario
  localStorage.setItem('user', JSON.stringify({
    token: response.data.token,
    id: response.data.id,
    username: response.data.username
  }));
  return response.data;
};

export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  } catch (err) {
    return {
      error: true,
      message: err.response?.data?.message || "Error en el registro"
    };
  }
};