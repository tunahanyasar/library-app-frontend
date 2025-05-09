import axios from 'axios';

// Backend URL'yi environment variable'dan al, yoksa fallback URL'yi kullan
const API_URL = import.meta.env.VITE_API_URL || 'https://library-app-backend-jtd1.onrender.com';

// Axios instance oluştur
const apiInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// API isteklerini logla
apiInstance.interceptors.request.use(request => {
    console.log('Starting Request:', request);
    return request;
});

apiInstance.interceptors.response.use(
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
const bookService = {
    getAll: () => apiInstance.get('/api/v1/books'),
    getById: (id) => apiInstance.get(`/api/v1/books/${id}`),
    create: (book) => apiInstance.post('/api/v1/books', book),
    update: (id, book) => apiInstance.put(`/api/v1/books/${id}`, book),
    delete: (id) => apiInstance.delete(`/api/v1/books/${id}`)
};

const authorService = {
    getAll: () => apiInstance.get('/api/v1/authors'),
    getById: (id) => apiInstance.get(`/api/v1/authors/${id}`),
    create: (author) => apiInstance.post('/api/v1/authors', author),
    update: (id, author) => apiInstance.put(`/api/v1/authors/${id}`, author),
    delete: (id) => apiInstance.delete(`/api/v1/authors/${id}`)
};

const categoryService = {
    getAll: () => apiInstance.get('/api/v1/categories'),
    getById: (id) => apiInstance.get(`/api/v1/categories/${id}`),
    create: (category) => apiInstance.post('/api/v1/categories', category),
    update: (id, category) => apiInstance.put(`/api/v1/categories/${id}`, category),
    delete: (id) => apiInstance.delete(`/api/v1/categories/${id}`)
};

const publisherService = {
    getAll: () => apiInstance.get('/api/v1/publishers'),
    getById: (id) => apiInstance.get(`/api/v1/publishers/${id}`),
    create: (publisher) => apiInstance.post('/api/v1/publishers', publisher),
    update: (id, publisher) => apiInstance.put(`/api/v1/publishers/${id}`, publisher),
    delete: (id) => apiInstance.delete(`/api/v1/publishers/${id}`)
};

const bookBorrowingService = {
    getAll: () => apiInstance.get('/api/v1/borrows'),
    get: (id) => apiInstance.get(`/api/v1/borrows/${id}`),
    getById: (id) => apiInstance.get(`/api/v1/borrows/${id}`),
    create: (borrowing) => apiInstance.post('/api/v1/borrows', borrowing),
    update: (id, borrowing) => apiInstance.put(`/api/v1/borrows/${id}`, borrowing),
    delete: (id) => apiInstance.delete(`/api/v1/borrows/${id}`)
};

// Default export: tüm servisleri ve instance'ı içeren bir obje
export default {
    apiInstance,
    bookService,
    authorService,
    categoryService,
    publisherService,
    bookBorrowingService,
    publishers: publisherService // Eski kullanım için alias
}; 