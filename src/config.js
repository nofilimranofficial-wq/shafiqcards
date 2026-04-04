// Centralized API configuration

const defaultBackend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const API_BASE_URL = `${defaultBackend}/api`;
//
// Helper to fetch products by category
export const fetchProductsByCategory = async (category, page = 1, limit = 100) => {
  try {
    const res = await fetch(`${API_BASE_URL}/products/category/${category}?page=${page}&limit=${limit}`, {
      cache: 'no-store' // Ensure immediate updates from admin actions
    });
    if (!res.ok) throw new Error('Failed to fetch products');
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error(`Error fetching ${category}:`, error);
    return { products: [], pagination: { total: 0 } };
  }
};
