import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';

// Sayfa bileşenleri
import Home from './pages/Home';
import Publishers from './pages/Publishers';
import Categories from './pages/Categories';
import Books from './pages/Books';
import Authors from './pages/Authors';
import BorrowBook from './pages/BorrowBook';

// Layout bileşeni
import Layout from './components/Layout';

function App() {
  // Bildirim state'i
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Bildirim gösterme fonksiyonu
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  return (
    <Router>
      <Layout>
        {/* Bildirim bileşeni */}
        {notification.show && (
          <div className={`fixed top-15 left-1/2 -translate-x-1/2 w-[500px] px-4 py-[2px] rounded-lg shadow-lg ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white z-[9999] mx-auto text-center`}>
            {notification.message}
          </div>
        )}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/publishers" element={<Publishers showNotification={showNotification} />} />
          <Route path="/categories" element={<Categories showNotification={showNotification} />} />
          <Route path="/books" element={<Books showNotification={showNotification} />} />
          <Route path="/authors" element={<Authors showNotification={showNotification} />} />
          <Route path="/borrow" element={<BorrowBook showNotification={showNotification} />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
