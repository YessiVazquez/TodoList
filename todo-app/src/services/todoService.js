// src/services/todoService.js
import axios from "axios";

const API_URL = "https://todo-backend-production-f566.up.railway.app/api";

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return { Authorization: `Bearer ${user.token}` };
  }
  return {};
};

// Servicio de TODOS (todoService.js)
export const getTodos = () => axios.get(`${API_URL}/todos`, { headers: getAuthHeader() });
export const toggleTodo = (id) => axios.patch(`${API_URL}/todos/${id}/toggle`, {}, { headers: getAuthHeader() });
export const deleteTodo = (id) => axios.delete(`${API_URL}/todos/${id}`, { headers: getAuthHeader() });
export const clearCompleted = () => axios.delete(`${API_URL}/todos/completed`, { headers: getAuthHeader() });
export const addTodo = (title, categoryId) => 
  axios.post(`${API_URL}/todos`, { title, category_id: categoryId }, { headers: getAuthHeader() });

export const getCategories = () => 
  axios.get(`${API_URL}/todos/categories`, { headers: getAuthHeader() });