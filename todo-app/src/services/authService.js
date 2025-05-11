import axios from "axios";

// Configuración óptima para authService.js
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";
const API_URL = `${API_BASE_URL}/api/auth`; // Mantiene el endpoint específico

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials, {
      timeout: 10000, // Timeout agregado
      withCredentials: true // Si usas cookies/tokens
    });
    return response.data;
  } catch (err) {
    return {
      error: true,
      message: err.response?.data?.message || "Error en el login"
    };
  }
};

export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData, {
      timeout: 10000,
      withCredentials: true
    });
    return response.data;
  } catch (err) {
    return {
      error: true,
      message: err.response?.data?.message || "Error en el registro"
    };
  }
};