/**
 * KİTAP ÖDÜNÇ ALMA SAYFASI BİLEŞENİ
 * Kitap ödünç alma işlemlerini yöneten sayfa
 * Ödünç alma, iade etme, düzenleme ve silme işlemlerini içerir
 * Kitap ve ödünç alan kişi bazında arama yapabilme özelliği sunar
 */

import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { FaBook, FaCalendarAlt, FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import Form from '../components/Form';
import Modal from '../components/Modal';

const BorrowBook = ({ showNotification }) => {
  // STATE TANIMLAMALARI
  // Tüm ödünç kayıtlarının listesi
  const [borrows, setBorrows] = useState([]);
  // Arama sonuçlarına göre filtrelenmiş ödünç kayıtları
  const [filteredBorrows, setFilteredBorrows] = useState([]);
  // Kitap arama kutusundaki metin
  const [bookSearchTerm, setBookSearchTerm] = useState('');
  // Ödünç alan kişi arama kutusundaki metin
  const [borrowerSearchTerm, setBorrowerSearchTerm] = useState('');
  // Mevcut kitapların listesi - ödünç verme için
  const [books, setBooks] = useState([]);
  // Ödünç alma/düzenleme modalının durumu
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Düzenlenen ödünç kaydının bilgisi
  const [currentBorrow, setCurrentBorrow] = useState(null);
  // Yükleme durumunu yönetir
  const [isLoading, setIsLoading] = useState(false);
  // Form verileri
  const [formData, setFormData] = useState({
    bookId: '',
    borrowerName: '',
    borrowerMail: '',
    borrowingDate: '',
    returnDate: ''
  });
  // Silme işlemini yönetir
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // Silinecek kayıtın bilgisi
  const [recordToDelete, setRecordToDelete] = useState(null);

  // VERİ YÖNETİMİ FONKSİYONLARI
  /**
   * Ödünç kayıtlarını API'den getirir ve state'e kaydeder
   * useCallback ile memoize edilmiş fonksiyon
   * Yükleme durumunu yönetir
   */
  const fetchBorrows = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.bookBorrowingService.getAll();
      // En son eklenen kayıtlar üstte görünsün diye reverse edilir
      setBorrows(response.data.slice().reverse());
      setFilteredBorrows(response.data.slice().reverse());
    } catch (error) {
      console.error('Ödünç kayıtları yüklenirken hata:', error);
      showNotification('Ödünç kayıtları yüklenirken bir hata oluştu', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  /**
   * Kitapları API'den getirir
   * Ödünç verme formunda kullanılır
   */
  const fetchBooks = useCallback(async () => {
    try {
      const response = await api.bookService.getAll();
      setBooks(response.data);
    } catch (error) {
      console.error('Kitaplar yüklenirken hata:', error);
      showNotification('Kitaplar yüklenirken bir hata oluştu', 'error');
    }
  }, [showNotification]);

  // ARAMA FONKSİYONLARI
  /**
   * Kitap adına göre arama yapar
   * Ödünç alan kişi aramasını sıfırlar
   * Sonuçları filteredBorrows state'ine kaydeder
   */
  const handleBookSearch = (value) => {
    setBookSearchTerm(value);
    setBorrowerSearchTerm('');
    
    const searchValue = value.toLowerCase();
    const filtered = borrows.filter(borrow => 
      borrow.book?.name.toLowerCase().includes(searchValue)
    );
    setFilteredBorrows(filtered);
  };

  /**
   * Ödünç alan kişi adına göre arama yapar
   * Kitap aramasını sıfırlar
   * Sonuçları filteredBorrows state'ine kaydeder
   */
  const handleBorrowerSearch = (value) => {
    setBorrowerSearchTerm(value);
    setBookSearchTerm('');
    
    const searchValue = value.toLowerCase();
    const filtered = borrows.filter(borrow => 
      borrow.borrowerName.toLowerCase().includes(searchValue)
    );
    setFilteredBorrows(filtered);
  };

  // FORM YÖNETİMİ FONKSİYONLARI
  /**
   * Form input değişikliklerini yönetir
   * Her input değişikliğinde formData state'ini günceller
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Form verilerini sıfırlar
   * Yeni ödünç kaydı ekleme için kullanılır
   */
  const resetForm = () => {
    setFormData({
      bookId: '',
      borrowerName: '',
      borrowerMail: '',
      borrowingDate: '',
      returnDate: ''
    });
    setCurrentBorrow(null);
  };

  // CRUD İŞLEM FONKSİYONLARI
  /**
   * Ödünç kaydı ekleme veya güncelleme işlemini gerçekleştirir
   * Validasyonlar:
   * - Kitap seçimi zorunlu
   * - Ödünç alma tarihi zorunlu
   * - Geçerli e-posta adresi zorunlu
   * - Geçerli isim zorunlu (en az 2 karakter)
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (currentBorrow) {
        // Güncelleme işlemi
        // Seçilen kitabı bul
        const selectedBook = books.find(book => book.id === parseInt(formData.bookId));
        if (!selectedBook) {
          showNotification('Lütfen bir kitap seçin', 'error');
          return;
        }

        // Form validasyonları
        // 1. Ödünç alma tarihi kontrolü
        if (!formData.borrowingDate) {
          showNotification('Lütfen ödünç alma tarihini seçin', 'error');
          return;
        }

        // 2. E-posta formatı kontrolü
        if (!formData.borrowerMail || !formData.borrowerMail.includes('@')) {
          showNotification('Lütfen geçerli bir e-posta adresi girin', 'error');
          return;
        }

        // 3. İsim uzunluğu kontrolü
        if (!formData.borrowerName || formData.borrowerName.trim().length < 2) {
          showNotification('Lütfen geçerli bir isim girin', 'error');
          return;
        }

        // Tarih formatını ISO 8601'e çevir
        const borrowingDate = new Date(formData.borrowingDate).toISOString().split('T')[0];
        const returnDate = formData.returnDate ? new Date(formData.returnDate).toISOString().split('T')[0] : null;

        // Güncelleme verisi
        const updateData = {
          borrowerName: formData.borrowerName.trim(),
          borrowerMail: formData.borrowerMail.trim(),
          borrowingDate: borrowingDate,
          returnDate: returnDate,
          bookForBorrowingRequest: {
            id: selectedBook.id
          }
        };

        // API'ye güncelleme isteği gönder
        const response = await api.bookBorrowingService.update(currentBorrow.id, updateData);
        
        if (response.status === 200) {
          showNotification('Ödünç kaydı başarıyla güncellendi', 'success');
          setBorrows(prev => prev.map(b => b.id === currentBorrow.id ? response.data : b));
          setFilteredBorrows(prev => prev.map(b => b.id === currentBorrow.id ? response.data : b));
          resetForm();
          setIsModalOpen(false);
        }
      } else {
        // Yeni kayıt işlemi
        // Seçilen kitabı bul
        const selectedBook = books.find(book => book.id === parseInt(formData.bookId));
        if (!selectedBook) {
          showNotification('Lütfen bir kitap seçin', 'error');
          return;
        }

        // Form validasyonları
        // 1. Ödünç alma tarihi kontrolü
        if (!formData.borrowingDate) {
          showNotification('Lütfen ödünç alma tarihini seçin', 'error');
          return;
        }

        // 2. E-posta formatı kontrolü
        if (!formData.borrowerMail || !formData.borrowerMail.includes('@')) {
          showNotification('Lütfen geçerli bir e-posta adresi girin', 'error');
          return;
        }

        // 3. İsim uzunluğu kontrolü
        if (!formData.borrowerName || formData.borrowerName.trim().length < 2) {
          showNotification('Lütfen geçerli bir isim girin', 'error');
          return;
        }

        // Tarih formatını ISO 8601'e çevir
        // API'nin beklediği formata uygun hale getir
        const borrowingDate = new Date(formData.borrowingDate).toISOString().split('T')[0];
        const returnDate = formData.returnDate ? new Date(formData.returnDate).toISOString().split('T')[0] : null;

        // API'ye gönderilecek veriyi hazırla
        const requestData = {
          borrowerName: formData.borrowerName.trim(),    // Boşlukları temizle
          borrowerMail: formData.borrowerMail.trim(),    // Boşlukları temizle
          borrowingDate: borrowingDate,                  // Formatlanmış tarih
          returnDate: returnDate,                        // Formatlanmış tarih veya null
          bookForBorrowingRequest: {
            id: selectedBook.id                          // Seçilen kitabın ID'si
          }
        };

        // API'ye yeni kayıt isteği gönder
        const response = await api.bookBorrowingService.create(requestData);
        
        if (response.status === 201) {
          // Başarılı kayıt bildirimi
          showNotification('Kitap başarıyla ödünç alındı', 'success');
          // State'leri güncelle: Yeni kaydı listenin başına ekle
          setBorrows(prev => [response.data, ...prev]);
          setFilteredBorrows(prev => [response.data, ...prev]);
          // Form ve modalı sıfırla
          resetForm();
          setIsModalOpen(false);
        }
      }
    } catch (error) {
      // Hata durumunda konsola detaylı hata bilgisi yazdır
      console.error('Genel işlem hatası:', error);
      // Kullanıcıya genel hata bildirimi göster
      showNotification('Beklenmeyen bir hata oluştu', 'error');
    }
  };

  /**
   * Ödünç kaydı silme işlemini gerçekleştirir
   * Kullanıcıdan onay alır
   * API'ye silme isteği gönderir ve başarılı olursa listeyi günceller
   */
  const handleDelete = async (id) => {
    try {
      await api.bookBorrowingService.delete(id);
      showNotification('Ödünç kayıt başarıyla silindi', 'success');
      fetchBorrows();
      setIsDeleteModalOpen(false);
      setRecordToDelete(null);
    } catch (error) {
      console.error('Silme hatası:', error);
      if (error.response) {
        showNotification(`Silme işlemi sırasında bir hata oluştu: ${error.response.data.message || error.message}`, 'error');
      } else {
        showNotification('Silme işlemi sırasında bir hata oluştu', 'error');
      }
    }
  };

  /**
   * Düzenleme modalını açar
   * Seçilen ödünç kaydının detaylarını API'den getirir
   * Form verilerini doldurur
   */
  const handleEdit = async (borrow) => {
    try {
      const response = await api.bookBorrowingService.get(borrow.id);
      const borrowDetails = response.data;

      setCurrentBorrow(borrowDetails);
      setFormData({
        bookId: borrowDetails.book.id,
        borrowerName: borrowDetails.borrowerName,
        borrowerMail: borrowDetails.borrowerMail,
        borrowingDate: borrowDetails.borrowingDate,
        returnDate: borrowDetails.returnDate || ''
      });
      setIsModalOpen(true);
    } catch (error) {
      console.error('Düzenleme hatası:', error);
      showNotification('Ödünç kaydı detayları yüklenirken bir hata oluştu', 'error');
    }
  };

  // Silme modalını aç
  const openDeleteModal = (record) => {
    setRecordToDelete(record);
    setIsDeleteModalOpen(true);
  };

  // EFFECT HOOKLARI
  // Sayfa yüklendiğinde tüm verileri getir
  useEffect(() => {
    fetchBorrows();
    fetchBooks();
  }, [fetchBorrows, fetchBooks]);

  // RENDER
  return (
    <div className="p-6">
      {/* Başlık ve ekleme butonu */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#8B4513] font-['Playfair_Display']">Kitap Ödünç İşlemleri</h1>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 rounded-md bg-[#8B4513] text-white hover:bg-[#D2691E] transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <FaPlus className="text-sm" />
          <span>Yeni Ödünç Kaydı</span>
        </button>
      </div>

      {/* Arama barları */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Kitap ara..."
            value={bookSearchTerm}
            onChange={(e) => handleBookSearch(e.target.value)}
            className={`w-full px-4 py-2 pl-10 rounded-md border border-[#DEB887] focus:outline-none focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/10 ${borrowerSearchTerm ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            disabled={!!borrowerSearchTerm}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8B4513]" />
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Ödünç alan kişi ara..."
            value={borrowerSearchTerm}
            onChange={(e) => handleBorrowerSearch(e.target.value)}
            className={`w-full px-4 py-2 pl-10 rounded-md border border-[#DEB887] focus:outline-none focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/10 ${bookSearchTerm ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            disabled={!!bookSearchTerm}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8B4513]" />
        </div>
      </div>

      {/* Ödünç kayıtları tablosu */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-[#DEB887]">
        <table className="min-w-full divide-y divide-[#DEB887]/30">
          <thead className="bg-[#FDF5E6]">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#8B4513] uppercase tracking-wider">Kitap</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#8B4513] uppercase tracking-wider">Ödünç Alan</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#8B4513] uppercase tracking-wider">Ödünç Tarihi</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#8B4513] uppercase tracking-wider">İade Tarihi</th>
              <th className="px-6 py-4 text-right text-xs font-medium text-[#8B4513] uppercase tracking-wider">İşlemler</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#DEB887]/30">
            {isLoading ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-[#8B4513]">Yükleniyor...</td>
              </tr>
            ) : filteredBorrows.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-[#8B4513]">Kayıt bulunamadı</td>
              </tr>
            ) : (
              filteredBorrows.map((borrow) => (
                <tr key={borrow.id} className="hover:bg-[#FDF5E6]/50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaBook className="h-5 w-5 text-[#8B4513] mr-2" />
                      <div className="text-sm font-medium text-[#2C1810]">{borrow.book?.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2C1810]">{borrow.borrowerName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaCalendarAlt className="h-5 w-5 text-[#8B4513] mr-2" />
                      <div className="text-sm text-[#2C1810]">
                        {new Date(borrow.borrowingDate).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaCalendarAlt className="h-5 w-5 text-[#8B4513] mr-2" />
                      <div className="text-sm text-[#2C1810]">
                        {borrow.returnDate ? new Date(borrow.returnDate).toLocaleDateString() : '-'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(borrow)}
                      className="text-blue-600 hover:text-blue-800 mr-3 transition-colors duration-200"
                    >
                      <FaEdit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(borrow)}
                      className="text-red-600 hover:text-red-800 transition-colors duration-200"
                    >
                      <FaTrash className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Ödünç Alma/Düzenleme Modalı */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={currentBorrow ? 'Ödünç Alma Kaydını Düzenle' : 'Yeni Ödünç Alma'}
      >
        <Form onSubmit={handleSubmit} onCancel={() => {
          setIsModalOpen(false);
          resetForm();
        }}>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Kitap
              </label>
              <select
                value={formData.bookId}
                onChange={handleInputChange}
                name="bookId"
                className={`form-input ${currentBorrow ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                disabled={!!currentBorrow}
              >
                <option value="">Kitap Seçin</option>
                {currentBorrow && !books.some(book => String(book.id) === String(formData.bookId)) && (
                  <option value={formData.bookId}>
                    {currentBorrow.book?.title || currentBorrow.book?.name || 'Seçili Kitap'}
                  </option>
                )}
                {books.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ödünç Alan Kişi
              </label>
              <input
                type="text"
                name="borrowerName"
                value={formData.borrowerName}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Ad Soyad"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="borrowerMail"
                value={formData.borrowerMail}
                onChange={handleInputChange}
                className={`form-input ${currentBorrow ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                placeholder="ornek@email.com"
                disabled={!!currentBorrow}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#8B4513] mb-1">Ödünç Alma Tarihi</label>
              <input
                type="date"
                name="borrowingDate"
                value={formData.borrowingDate}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
            {!currentBorrow && (
              <div>
                <label className="block text-sm font-medium text-[#8B4513] mb-1">İade Tarihi</label>
                <input
                  type="date"
                  name="returnDate"
                  value={formData.returnDate}
                  onChange={handleInputChange}
                  className="form-input bg-gray-100 cursor-not-allowed"
                  disabled
                  onClick={() => showNotification('İade tarihi, kitap iade edildiğinde güncelleme ekranından eklenebilir.', 'info')}
                />
                <p className="text-xs text-gray-500 mt-1">
                  İade tarihi, kitap iade edildiğinde güncelleme ekranından eklenebilir.
                </p>
              </div>
            )}
            {currentBorrow && (
              <div>
                <label className="block text-sm font-medium text-[#8B4513] mb-1">İade Tarihi</label>
                <input
                  type="date"
                  name="returnDate"
                  value={formData.returnDate}
                  onChange={handleInputChange}
                  className="form-input"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Kitap iade edildiğinde iade tarihini buradan ekleyebilirsiniz
                </p>
              </div>
            )}
          </div>
        </Form>
      </Modal>

      {/* Silme Onay Modalı */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setRecordToDelete(null);
        }}
        title="Ödünç Kayıt Sil"
      >
        <div className="p-4">
          <p className="text-[#2C1810] mb-4">
            <span className="font-semibold">{recordToDelete?.book?.name}</span> kitabının ödünç kaydını silmek istediğinizden emin misiniz?
          </p>
          <p className="text-red-600 mb-4 text-sm">
            ⚠️ Dikkat: Bu işlem geri alınamaz.
          </p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => {
                setIsDeleteModalOpen(false);
                setRecordToDelete(null);
              }}
              className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300"
            >
              İptal
            </button>
            <button
              onClick={() => handleDelete(recordToDelete.id)}
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

export default BorrowBook; 