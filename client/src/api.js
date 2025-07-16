// src/api.js

import axios from "axios"; // assuming you're using axios

const API_BASE_URL = "http://localhost:5000/api"; // Update with your actual backend URL

const api = {
  fetchProducts: () => axios.get(`${API_BASE_URL}/products`),
  addProduct: (data) => axios.post(`${API_BASE_URL}/products`, data),
  deleteProduct: (id) => axios.delete(`${API_BASE_URL}/products/${id}`),
  updateProduct: (id, data) =>
    axios.put(`${API_BASE_URL}/products/${id}`, data),
  // add more as needed
};

export default api;
