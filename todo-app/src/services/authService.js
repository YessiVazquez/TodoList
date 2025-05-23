import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  return response.data;
};

export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (err) {
    return {
      error: true,
      message: err.response?.data?.message || "Error en el registro"
    };
  }
};