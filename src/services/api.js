/**
 * API SERVİS MODÜLÜ
 * kütüphane yönetim sistemi için API isteklerini yönetir
 * axios kullanarak backend ile iletişim kurar
 */

import axios from 'axios';

/**
 * API YAPILANDIRMASI
 * backend API URL'si ve axios instance'ı tanımlanır
 * tüm istekler için ortak header'lar ayarlanır
 */
const API_URL = 'http://localhost:8080/api/v1';

const api = {
  // Kategori işlemleri
  categories: {
    getAll: () => axios.get(`${API_URL}/categories`),
    getById: (id) => axios.get(`${API_URL}/categories/${id}`),
    create: (data) => axios.post(`${API_URL}/categories`, data),
    update: (id, data) => axios.put(`${API_URL}/categories/${id}`, data),
    delete: (id) => axios.delete(`${API_URL}/categories/${id}`),
  },
  
  // Yazar işlemleri
  authors: {
    getAll: () => axios.get(`${API_URL}/authors`),
    getById: (id) => axios.get(`${API_URL}/authors/${id}`),
    create: (data) => axios.post(`${API_URL}/authors`, data),
    update: (id, data) => axios.put(`${API_URL}/authors/${id}`, data),
    delete: (id) => axios.delete(`${API_URL}/authors/${id}`),
  },
  
  // Yayımcı işlemleri
  publishers: {
    getAll: () => axios.get(`${API_URL}/publishers`),
    getById: (id) => axios.get(`${API_URL}/publishers/${id}`),
    create: (data) => axios.post(`${API_URL}/publishers`, data),
    update: (id, data) => axios.put(`${API_URL}/publishers/${id}`, data),
    delete: (id) => axios.delete(`${API_URL}/publishers/${id}`),
  },
  
  // Kitap işlemleri
  books: {
    getAll: () => axios.get(`${API_URL}/books`),
    getById: (id) => axios.get(`${API_URL}/books/${id}`),
    create: (data) => axios.post(`${API_URL}/books`, data),
    update: (id, data) => axios.put(`${API_URL}/books/${id}`, data),
    delete: (id) => axios.delete(`${API_URL}/books/${id}`),
  },

  // Ödünç alma işlemleri
  borrows: {
    getAll: () => axios.get(`${API_URL}/borrows`),
    get: (id) => axios.get(`${API_URL}/borrows/${id}`),
    create: (data) => axios.post(`${API_URL}/borrows`, data),
    update: (id, data) => axios.put(`${API_URL}/borrows/${id}`, data),
    delete: (id) => axios.delete(`${API_URL}/borrows/${id}`),
  },
};

export default api;

// Kitap işlemleri
export const bookService = {
  getAll: async () => {
    const response = await api.books.getAll();
    return { data: response.data.bookList || response.data };
  },
  create: (book) => api.books.create(book),
  delete: (id) => api.books.delete(id),
};

// Yazar işlemleri
export const authorService = {
  getAll: () => api.authors.getAll(),
  create: (author) => api.authors.create(author),
};

// Yayımcı işlemleri
export const publisherService = {
  getAll: () => api.publishers.getAll(),
}; 