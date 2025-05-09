import axios from 'axios';

// Backend URL'yi environment variable'dan al, yoksa fallback URL'yi kullan
const API_URL = import.meta.env.VITE_API_URL || 'https://library-app-backend-jtd1.onrender.com';

// Axios instance oluştur
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// API isteklerini logla
api.interceptors.request.use(request => {
    console.log('Starting Request:', request);
    return request;
});

api.interceptors.response.use(
    response => {
        console.log('Response:', response);
        return response;
    },
    error => {
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

// API fonksiyonları
export const bookService = {
    getAll: () => api.get('/api/v1/books'),
    getById: (id) => api.get(`/api/v1/books/${id}`),
    create: (book) => api.post('/api/v1/books', book),
    update: (id, book) => api.put(`/api/v1/books/${id}`, book),
    delete: (id) => api.delete(`/api/v1/books/${id}`)
};

export const authorService = {
    getAll: () => api.get('/api/v1/authors'),
    getById: (id) => api.get(`/api/v1/authors/${id}`),
    create: (author) => api.post('/api/v1/authors', author),
    update: (id, author) => api.put(`/api/v1/authors/${id}`, author),
    delete: (id) => api.delete(`/api/v1/authors/${id}`)
};

export const categoryService = {
    getAll: () => api.get('/api/v1/categories'),
    getById: (id) => api.get(`/api/v1/categories/${id}`),
    create: (category) => api.post('/api/v1/categories', category),
    update: (id, category) => api.put(`/api/v1/categories/${id}`, category),
    delete: (id) => api.delete(`/api/v1/categories/${id}`)
};

export const publisherService = {
    getAll: () => api.get('/api/v1/publishers'),
    getById: (id) => api.get(`/api/v1/publishers/${id}`),
    create: (publisher) => api.post('/api/v1/publishers', publisher),
    update: (id, publisher) => api.put(`/api/v1/publishers/${id}`, publisher),
    delete: (id) => api.delete(`/api/v1/publishers/${id}`)
};

export const bookBorrowingService = {
    getAll: () => api.get('/api/v1/borrows'),
    getById: (id) => api.get(`/api/v1/borrows/${id}`),
    create: (borrowing) => api.post('/api/v1/borrows', borrowing),
    update: (id, borrowing) => api.put(`/api/v1/borrows/${id}`, borrowing),
    delete: (id) => api.delete(`/api/v1/borrows/${id}`)
};

export default api; 