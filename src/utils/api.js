import { API_BASE_URL } from '../config';

// Auth tokens
export const setToken = (token) => localStorage.setItem('adminToken', token);
export const getToken = () => localStorage.getItem('adminToken');
export const removeToken = () => localStorage.removeItem('adminToken');
export const isAuthenticated = () => !!getToken();

// Login call
export const loginAdmin = async (email, password) => {
  const res = await fetch(`${API_BASE_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  return data;
};

// Create Product
export const createProduct = async (formData) => {
  const res = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getToken()}`
      // Omit Content-Type to let browser set multipart/form-data boundary automatically
    },
    body: formData
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create product');
  return data;
};

// Get All Products (Admin)
export const getAllProducts = async (page = 1, limit = 50, category = '') => {
  let url = `${API_BASE_URL}/products?page=${page}&limit=${limit}&admin=true`;
  if (category) url += `&category=${category}`;
  
  const res = await fetch(url, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch products');
  return data.data;
};

// Get Single Product
export const getProductById = async (id) => {
  const url = isAuthenticated() 
    ? `${API_BASE_URL}/products/${id}?admin=true` 
    : `${API_BASE_URL}/products/${id}`;
  const res = await fetch(url, { cache: 'no-store' });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Product not found');
  return data.data.product;
};

// Update Product
export const updateProduct = async (id, formData) => {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${getToken()}`
    },
    body: formData
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update product');
  return data;
};

// Delete Product (Soft)
export const deleteProduct = async (id) => {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  const data = await res.json();
  return data;
};

// Admin traffic summary
export const getTrafficSummary = async () => {
  const res = await fetch(`${API_BASE_URL}/web-invitations/traffic`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch traffic summary');
  return data.data;
};

// Delete web invitation as admin
export const deleteWebInvitation = async (slug) => {
  const res = await fetch(`${API_BASE_URL}/web-invitations/${slug}/admin`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete invitation');
  return data;
};

// Admin list
export const getAdminList = async () => {
  const res = await fetch(`${API_BASE_URL}/admin/list`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch admin list');
  return data.data;
};

// Create new admin
export const createAdmin = async (payload) => {
  const res = await fetch(`${API_BASE_URL}/admin/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create admin');
  return data;
};

// Change admin password
export const changeAdminPassword = async (id, password) => {
  const res = await fetch(`${API_BASE_URL}/admin/${id}/password`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify({ password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update admin password');
  return data;
};

// Helper to strip price from description if not admin
export const formatDescription = (description = '') => {
  if (typeof description !== 'string') return description;
  if (isAuthenticated()) return description;
  
  // Remove "Price: XXX" or "Price: PKR XXX" patterns
  return description
    .replace(/Price:\s*PKR\s*\d+/gi, '')
    .replace(/Price:\s*\d+/gi, '')
    .trim();
};


