// src/services/todoService.js
import axios from "axios";

const API_URL = "http://localhost:3001/api/todos";

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return { Authorization: `Bearer ${user.token}` };
  }
  return {};
};

export const getTodos = () => axios.get(API_URL, { headers: getAuthHeader() });
export const toggleTodo = (id) => axios.patch(`${API_URL}/${id}/toggle`, {}, { headers: getAuthHeader() });
export const deleteTodo = (id) => axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
export const clearCompleted = () => axios.delete(`${API_URL}/completed`, { headers: getAuthHeader() });
export const addTodo = (title, categoryId) => 
  axios.post(API_URL, { title, category_id: categoryId }, { headers: getAuthHeader() });

export const getCategories = () => 
  axios.get(`${API_URL}/categories`, { headers: getAuthHeader() });