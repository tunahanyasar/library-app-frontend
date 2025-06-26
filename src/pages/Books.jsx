/**
 * KİTAPLAR SAYFASI BİLEŞENİ
 * Kitap yönetimi için CRUD işlemlerini içeren sayfa
 * Kitap ekleme, düzenleme, silme ve listeleme işlemlerini yönetir
 * Yazar, yayımcı ve kategori ilişkilerini içerir
 */

import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { FaBook, FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import Form from '../components/Form';
import Modal from '../components/Modal';

const Books = ({ showNotification }) => {
  // STATE TANIMLAMALARI
  // Tüm kitapların listesi
  const [books, setBooks] = useState([]);
  // Arama sonuçlarına göre filtrelenmiş kitaplar
  const [filteredBooks, setFilteredBooks] = useState([]);
  // Arama kutusundaki metin
  const [searchTerm, setSearchTerm] = useState('');
  // Yayımcılar listesi - kitap ekleme/düzenleme için
  const [publishers, setPublishers] = useState([]);
  // Yazarlar listesi - kitap ekleme/düzenleme için
  const [authors, setAuthors] = useState([]);
  // Kategoriler listesi - kitap ekleme/düzenleme için
  const [categories, setCategories] = useState([]);
  // Kitap ekleme/düzenleme modalının durumu
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Düzenlenen kitabın bilgisi
  const [currentBook, setCurrentBook] = useState(null);
  // Form verileri
  const [formData, setFormData] = useState({
    name: '',
    publicationYear: '',
    stock: '',
    authorId: '',
    publisherId: '',
    categoryIds: []
  });
  // Silme işlemi için eklenen state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  // Yayımcı ismini kısaltma fonksiyonu
  const truncatePublisherName = (name) => {
    if (!name) return '';
    return name.length > 16 ? name.substring(0, 16) + '...' : name;
  };

  // Kitap ismini kısaltma fonksiyonu
  const truncateBookName = (name) => {
    if (!name) return '';
    return name.length > 20 ? name.substring(0, 20) + '...' : name;
  };

  // Kategori listesini kısaltma fonksiyonu
  const truncateCategories = (categories) => {
    if (!categories || categories.length === 0) return '';
    const categoryString = categories.map(cat => cat.name).join(', ');
    return categoryString.length > 17 ? categoryString.substring(0, 17) + '...' : categoryString;
  };

  // VERİ YÖNETİMİ FONKSİYONLARI
  /**
   * Kitapları API'den getirir ve state'e kaydeder
   * useCallback ile memoize edilmiş fonksiyon
   */
  const fetchBooks = useCallback(async () => {
    try {
      const response = await api.bookService.getAll();
      // Backend'den gelen kitapları ters çevir
      setBooks(response.data.slice().reverse());
    } catch (error) {
      if (
        error.code === 'ECONNABORTED' ||
        (error.message && (error.message.includes('timeout') || error.message.includes('Network Error')))
      ) {
        showNotification('HATA: Veriler veritabanından çekiliyor. Lütfen bekleyiniz...', 'error');
      } else if (error.response) {
        showNotification(`Kitaplar yüklenirken bir hata oluştu: ${error.response.data.message || error.message}`, 'error');
      } else {
        showNotification('Kitaplar yüklenirken bir hata oluştu', 'error');
      }
    }
  }, [showNotification]);

  /**
   * Yayımcıları API'den getirir
   * Kitap ekleme/düzenleme formunda kullanılır
   */
  const fetchPublishers = useCallback(async () => {
    try {
      const response = await api.publisherService.getAll();
      setPublishers(response.data);
    } catch (error) {
      if (
        error.code === 'ECONNABORTED' ||
        (error.message && (error.message.includes('timeout') || error.message.includes('Network Error')))
      ) {
        showNotification('HATA: Veriler veritabanından çekiliyor. Lütfen bekleyiniz...', 'error');
      } else if (error.response) {
        showNotification(`Yayımcılar yüklenirken bir hata oluştu: ${error.response.data.message || error.message}`, 'error');
      } else {
        showNotification('Yayımcılar yüklenirken bir hata oluştu', 'error');
      }
    }
  }, [showNotification]);

  /**
   * Yazarları API'den getirir
   * Kitap ekleme/düzenleme formunda kullanılır
   */
  const fetchAuthors = useCallback(async () => {
    try {
      const response = await api.authorService.getAll();
      setAuthors(response.data);
    } catch (error) {
      if (
        error.code === 'ECONNABORTED' ||
        (error.message && (error.message.includes('timeout') || error.message.includes('Network Error')))
      ) {
        showNotification('HATA: Veriler veritabanından çekiliyor. Lütfen bekleyiniz...', 'error');
      } else if (error.response) {
        showNotification(`Yazarlar yüklenirken bir hata oluştu: ${error.response.data.message || error.message}`, 'error');
      } else {
        showNotification('Yazarlar yüklenirken bir hata oluştu', 'error');
      }
    }
  }, [showNotification]);

  /**
   * Kategorileri API'den getirir
   * Kitap ekleme/düzenleme formunda kullanılır
   */
  const fetchCategories = useCallback(async () => {
    try {
      const response = await api.categoryService.getAll();
      setCategories(response.data);
    } catch (error) {
      if (
        error.code === 'ECONNABORTED' ||
        (error.message && (error.message.includes('timeout') || error.message.includes('Network Error')))
      ) {
        showNotification('HATA: Veriler veritabanından çekiliyor. Lütfen bekleyiniz...', 'error');
      } else if (error.response) {
        showNotification(`Kategoriler yüklenirken bir hata oluştu: ${error.response.data.message || error.message}`, 'error');
      } else {
        showNotification('Kategoriler yüklenirken bir hata oluştu', 'error');
      }
    }
  }, [showNotification]);

  /**
   * Arama fonksiyonu
   * Kitapları isme göre filtreler
   */
  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);
    
    const filtered = books.filter(book => 
      book.name.toLowerCase().includes(searchValue)
    );
    setFilteredBooks(filtered);
  };

  // EFFECT HOOKLARI
  // Sayfa yüklendiğinde tüm verileri getir
  useEffect(() => {
    fetchBooks();
    fetchPublishers();
    fetchAuthors();
    fetchCategories();
  }, [fetchBooks, fetchPublishers, fetchAuthors, fetchCategories]);

  // Kitaplar listesi güncellendiğinde filtrelenmiş listeyi de güncelle
  useEffect(() => {
    setFilteredBooks(books);
  }, [books]);

  // FORM YÖNETİMİ FONKSİYONLARI
  /**
   * Form input değişikliklerini yönetir
   * Her input değişikliğinde formdata stateini günceller
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Kategori seçimini yönetir 
   * Seçilen kategorileri formData stateine kaydeder
   */
  const handleCategoryChange = (e) => {
    const options = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({ ...prev, categoryIds: options }));
  };

  /**
   * Kitap ekleme veya güncelleme işlemini gerçekleştirir
   * currentbook varsa güncelleme, yoksa ekleme yapar
   * Kategori seçimi zorunludur
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.categoryIds.length) {
        showNotification('Lütfen en az bir kategori seçin', 'error');
        return;
      }
      const requestData = {
        name: formData.name,
        publicationYear: parseInt(formData.publicationYear),
        stock: parseInt(formData.stock),
        author: { id: parseInt(formData.authorId) },
        publisher: { id: parseInt(formData.publisherId) },
        categories: formData.categoryIds.map(id => ({ id: parseInt(id) }))
      };
      if (currentBook) {
        // Güncelleme işlemi
        const response = await api.bookService.update(currentBook.id, requestData);
        showNotification('Kitap başarıyla güncellendi', 'success');
        setBooks(prev => {
          const updated = prev.map(b => b.id === currentBook.id ? response.data : b);
          return updated.slice().reverse();
        });
      } else {
        // Ekleme işlemi
        const response = await api.bookService.create(requestData);
        showNotification('Kitap başarıyla eklendi', 'success');
        setBooks(prev => {
          const updated = [...prev, response.data];
          return updated.slice().reverse();
        });
      }
      // Form ve modalı sıfırla
      setFormData({ name: '', publicationYear: '', stock: '', authorId: '', publisherId: '', categoryIds: [] });
      setCurrentBook(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error('İşlem hatası:', error);
      if (
        error.code === 'ECONNABORTED' ||
        (error.message && (error.message.includes('timeout') || error.message.includes('Network Error')))
      ) {
        showNotification('HATA: Veriler veritabanından çekiliyor. Lütfen bekleyiniz...', 'error');
      } else if (error.response) {
        showNotification(`İşlem sırasında bir hata oluştu: ${error.response.data.message || error.message}`, 'error');
      } else {
        showNotification('İşlem sırasında bir hata oluştu', 'error');
      }
    }
  };

  // Silme işlemi için eklenen fonksiyon
  const openDeleteModal = (book) => {
    setBookToDelete(book);
    setIsDeleteModalOpen(true);
  };

  // Silme işlemini gerçekleştir
  const handleDelete = async (id) => {
    try {
      await api.bookService.delete(id);
      showNotification('Kitap başarıyla silindi', 'success');
      fetchBooks();
      setIsDeleteModalOpen(false);
      setBookToDelete(null);
    } catch (error) {
      console.error('Silme hatası:', error);
      if (
        error.code === 'ECONNABORTED' ||
        (error.message && (error.message.includes('timeout') || error.message.includes('Network Error')))
      ) {
        showNotification('HATA: Veriler veritabanından çekiliyor. Lütfen bekleyiniz...', 'error');
      } else if (error.response) {
        showNotification(`Silme işlemi sırasında bir hata oluştu: ${error.response.data.message || error.message}`, 'error');
      } else {
        showNotification('Silme işlemi sırasında bir hata oluştu', 'error');
      }
    }
  };

  // DÜZENLEME İŞLEMİ FONKSİYONLARI
  /**
   * Düzenleme modalını açar
   * Seçilen kitabın bilgilerini forma doldurur
   */
  const handleEdit = (book) => {
    setCurrentBook(book);
    setFormData({
      name: book.name,
      publicationYear: book.publicationYear,
      stock: book.stock,
      authorId: book.author?.id || '',
      publisherId: book.publisher?.id || '',
      categoryIds: book.categories ? book.categories.map(cat => String(cat.id)) : []
    });
    setIsModalOpen(true);
  };

  /**
   * Form verilerini sıfırlar
   * Yeni kitap ekleme için kullanılır
   */
  const resetForm = () => {
    setFormData({
      name: '',
      publicationYear: '',
      stock: '',
      authorId: '',
      publisherId: '',
      categoryIds: []
    });
    setCurrentBook(null);
  };

  // RENDER
  return (
    <div className="p-6">
      {/* Başlık ve ekleme butonu */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#8B4513] font-['Playfair_Display']">Kitaplar</h1>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 rounded-md bg-[#8B4513] text-white hover:bg-[#D2691E] transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <FaPlus className="text-sm" />
          <span>Yeni Kitap Ekle</span>
        </button>
      </div>

      {/* Arama ve filtreleme */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Kitap ara..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 pl-10 rounded-md border border-[#DEB887] focus:outline-none focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/10"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8B4513]" />
        </div>
      </div>

      {/* Kitaplar tablosu */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-[#DEB887]">
        <table className="min-w-full divide-y divide-[#DEB887]/30">
          <thead className="bg-[#FDF5E6]">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#8B4513] uppercase tracking-wider">
                Kitap Adı
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#8B4513] uppercase tracking-wider">
                Yayın Yılı
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#8B4513] uppercase tracking-wider">
                Stok
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#8B4513] uppercase tracking-wider">
                Yazar
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#8B4513] uppercase tracking-wider">
                Yayımcı
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#8B4513] uppercase tracking-wider">
                Kategoriler
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-[#8B4513] uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#DEB887]/30">
            {filteredBooks.map((book) => (
              <tr key={book.id} className="hover:bg-[#FDF5E6]/50 transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FaBook className="h-5 w-5 text-[#8B4513] mr-2" />
                    <div className="text-sm font-medium text-[#2C1810]">
                      {truncateBookName(book.name)}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2C1810]">
                  {book.publicationYear}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2C1810]">
                  {book.stock}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2C1810]">
                  {book.author?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2C1810]">
                  {truncatePublisherName(book.publisher?.name)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2C1810]">
                  {truncateCategories(book.categories)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(book)}
                    className="text-blue-600 hover:text-blue-800 mr-3 transition-colors duration-200"
                  >
                    <FaEdit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => openDeleteModal(book)}
                    className="text-red-600 hover:text-red-800 transition-colors duration-200"
                  >
                    <FaTrash className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Kitap Ekleme/Düzenleme Modalı */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={currentBook ? 'Kitap Düzenle' : 'Yeni Kitap Ekle'}
      >
        <Form onSubmit={handleSubmit} onCancel={() => {
          setIsModalOpen(false);
          resetForm();
        }}>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <div>
              <label className="block text-sm font-medium text-[#8B4513] mb-1">
                    Kitap Adı
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                className="form-input"
                    required
                  />
                </div>
            <div>
              <label className="block text-sm font-medium text-[#8B4513] mb-1">
                Yayın Yılı
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  name="publicationYear"
                  value={formData.publicationYear}
                  onChange={handleInputChange}
                  min="1000"
                  max={new Date().getFullYear()}
                  className="form-input w-1/2"
                  placeholder="Yıl giriniz"
                  required
                />
                <select
                  onChange={e => setFormData(prev => ({ ...prev, publicationYear: e.target.value }))}
                  value=""
                  className="form-input w-1/2"
                >
                  <option value="">Yıl Seçiniz</option>
                  {Array.from({ length: 100 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <option key={year} value={year}>{year}</option>
                    );
                  })}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#8B4513] mb-1">
                    Stok
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                className="form-input"
                    required
                  />
                </div>
            <div>
              <label className="block text-sm font-medium text-[#8B4513] mb-1">
                    Yazar
                  </label>
                  <select
                    name="authorId"
                    value={formData.authorId}
                    onChange={handleInputChange}
                className="form-input"
                    required
                  >
                    <option value="">Yazar Seçin</option>
                {authors.map(author => (
                      <option key={author.id} value={author.id}>
                        {author.name}
                      </option>
                    ))}
                  </select>
                </div>
            <div>
              <label className="block text-sm font-medium text-[#8B4513] mb-1">
                    Yayımcı
                  </label>
                  <select
                    name="publisherId"
                    value={formData.publisherId}
                    onChange={handleInputChange}
                className="form-input"
                    required
                  >
                    <option value="">Yayımcı Seçin</option>
                {publishers.map(publisher => (
                      <option key={publisher.id} value={publisher.id}>
                        {publisher.name}
                      </option>
                    ))}
                  </select>
                </div>
            <div>
              <label className="block text-sm font-medium text-[#8B4513] mb-1">
                Kategoriler
                  </label>
                  <select
                multiple
                    name="categoryIds"
                value={formData.categoryIds}
                    onChange={handleCategoryChange}
                className="form-input h-32"
                    required
                  >
                {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
              <p className="text-xs text-gray-500 mt-1">
                Birden fazla kategori seçmek için CTRL tuşuna basılı tutarak seçim yapabilirsiniz
              </p>
            </div>
          </div>
        </Form>
      </Modal>

      {/* Silme Onay Modalı */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setBookToDelete(null);
        }}
        title="Kitap Sil"
      >
        <div className="p-4">
          <p className="text-[#2C1810] mb-4">
            <span className="font-semibold">{bookToDelete?.name}</span> isimli kitabı silmek istediğinizden emin misiniz?
          </p>
          <p className="text-red-600 mb-4 text-sm">
            ⚠️ Dikkat: Bu işlem geri alınamaz ve kitaba ait tüm ödünç kayıtları da silinecektir.
          </p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => {
                setIsDeleteModalOpen(false);
                setBookToDelete(null);
              }}
              className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300"
            >
              İptal
            </button>
            <button
              onClick={() => handleDelete(bookToDelete.id)}
              className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-all duration-300"
            >
              Sil
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Books; 