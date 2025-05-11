// src/services/todoService.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

// Configuración global de Axios (opcional pero recomendado)
axios.defaults.timeout = 10000; // 10 segundos
axios.defaults.withCredentials = true; // Para cookies/tokens

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return { Authorization: `Bearer ${user.token}` };
  }
  return {};
};

// Configuración común para todas las peticiones
const axiosConfig = {
  headers: getAuthHeader(),
  timeout: 10000 // Redundante si usas defaults, pero buena práctica
};

// Versión optimizada con manejo de errores
export const getTodos = async () => {
  try {
    const response = await axios.get(`${API_URL}/todos`, axiosConfig);
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Error al obtener todos");
  }
};

export const toggleTodo = async (id) => {
  try {
    const response = await axios.patch(
      `${API_URL}/todos/${id}/toggle`, 
      {}, 
      axiosConfig
    );
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Error al cambiar estado");
  }
};

export const deleteTodo = async (id) => {
  try {
    const response = await axios.delete(
      `${API_URL}/todos/${id}`, 
      axiosConfig
    );
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Error al eliminar");
  }
};

export const clearCompleted = async () => {
  try {
    const response = await axios.delete(
      `${API_URL}/todos/completed`, 
      axiosConfig
    );
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Error al limpiar completados");
  }
};

export const addTodo = async (title, categoryId) => {
  try {
    const response = await axios.post(
      `${API_URL}/todos`, 
      { title, category_id: categoryId }, 
      axiosConfig
    );
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Error al agregar todo");
  }
};

export const getCategories = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/categories`, 
      axiosConfig
    );
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Error al obtener categorías");
  }
};