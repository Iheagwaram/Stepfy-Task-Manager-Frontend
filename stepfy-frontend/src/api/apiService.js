import API_BASE_URL from "../config/apiConfig";
import axios from "axios";

export const registerUser = async (userData) => {
  return axios.post(`${API_BASE_URL}/auth/register`, userData);
};

export const loginUser = async (credentials) => {
  return axios.post(`${API_BASE_URL}/auth/login`, credentials);
};

export const fetchTasks = async (token) => {
  return axios.get(`${API_BASE_URL}/tasks`, {
    headers: { "x-auth-token": token },
  });
};

export const createTask = async (taskData, token) => {
  return axios.post(`${API_BASE_URL}/tasks`, taskData, {
    headers: { "x-auth-token": token },
  });
};

export const deleteTask = async (taskId, token) => {
  return axios.delete(`${API_BASE_URL}/tasks/${taskId}`, {
    headers: { "x-auth-token": token },
  });
};
