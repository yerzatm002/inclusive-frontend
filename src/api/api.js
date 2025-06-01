// const BASE_URL = 'https://inclusive-backend.onrender.com/api';
const BASE_URL = 'http://localhost:3000/api';

const getToken = () => localStorage.getItem('token');

const authHeader = () => ({
  Authorization: `Bearer ${getToken()}`
});

// 📌 Auth
export const api = {
  register: (data) =>
    fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()),

  login: (data) =>
    fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()),

  getProfile: () =>
    fetch(`${BASE_URL}/auth/me`, {
      headers: authHeader()
    }).then(res => res.json()),

  // 👤 Users (admin only)
  getAllUsers: () =>
    fetch(`${BASE_URL}/users`, {
      headers: authHeader()
    }).then(res => res.json()),

  // 📚 Tasks
  getTasks: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${BASE_URL}/tasks?${query}`).then(res => res.json());
  },

  getTaskById: (id) =>
    fetch(`${BASE_URL}/tasks/${id}`).then(res => res.json()),

  createTask: (data) =>
    fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        ...authHeader(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(res => res.json()),

  updateTask: (id, data) =>
    fetch(`${BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        ...authHeader(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(res => res.json()),

  deleteTask: (id) =>
    fetch(`${BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: authHeader()
    }).then(res => res.json()),

  // 🧠 Results
  createResult: (data) =>
    fetch(`${BASE_URL}/results`, {
      method: 'POST',
      body: JSON.stringify(data)
    }).then(res => res.json()),

  getResultsByUser: (userId) =>
    fetch(`${BASE_URL}/results/${userId}`, {
      headers: authHeader()
    }).then(res => res.json()),

  getAllResults: () =>
    fetch(`${BASE_URL}/results`, {
      headers: authHeader()
    }).then(res => res.json())
};
