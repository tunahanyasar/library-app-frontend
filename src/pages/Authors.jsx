/**
 * YAZARLAR SAYFASI BİLEŞENİ
 * Yazar yönetimi için CRUD işlemlerini içeren sayfa
 * Yazar ekleme, düzenleme, silme ve listeleme işlemlerini yönetir
 */

import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { FaUser, FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import Form from '../components/Form';
import Modal from '../components/Modal';

const Authors = ({ showNotification }) => {
  // STATE TANIMLAMALARI
  // Tüm yazarların listesi
  const [authors, setAuthors] = useState([]);
  // Arama sonuçlarına göre filtrelenmiş yazarlar
  const [filteredAuthors, setFilteredAuthors] = useState([]);
  // Arama kutusundaki metin
  const [searchTerm, setSearchTerm] = useState('');
  // Yazar ekleme/düzenleme modalının durumu
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Silme onay modalının durumu
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // Silinecek yazarın bilgisi
  const [authorToDelete, setAuthorToDelete] = useState(null);
  // Düzenlenen yazarın bilgisi
  const [currentAuthor, setCurrentAuthor] = useState(null);
  // Form verileri
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    country: ''
  });

  // VERİ YÖNETİMİ FONKSİYONLARI
  /**
   * Yazarları API'den getirir ve state'e kaydeder
   * useCallback ile memoize edilmiş fonksiyon
   */
  const fetchAuthors = useCallback(async () => {
    try {
      const response = await api.authorService.getAll();
      // En son eklenen yazarlar üstte görünsün diye reverse edilir
      setAuthors(response.data.slice().reverse());
    } catch (error) {
      console.error('Yazarlar yüklenirken hata:', error);
      if (error.response) {
        showNotification(`Yazarlar yüklenirken bir hata oluştu: ${error.response.data.message || error.message}`, 'error');
      } else {
        showNotification('Yazarlar yüklenirken bir hata oluştu', 'error');
      }
    }
  }, [showNotification]);

  /**
   * Arama fonksiyonu
   * Yazarları isme göre filtreler
   */
  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);
    
    const filtered = authors.filter(author => 
      author.name.toLowerCase().includes(searchValue)
    );
    setFilteredAuthors(filtered);
  };

  // EFFECT HOOKLARI
  // Sayfa yüklendiğinde yazarları getir
  useEffect(() => {
    fetchAuthors();
  }, [fetchAuthors]);

  // Yazarlar listesi güncellendiğinde filtrelenmiş listeyi de güncelle
  useEffect(() => {
    setFilteredAuthors(authors);
  }, [authors]);

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
   * Yazar ekleme veya güncelleme işlemini gerçekleştirir
   * currentAuthor varsa güncelleme, yoksa ekleme yapar
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const requestData = {
        name: formData.name,
        birthDate: formData.birthDate,
        country: formData.country
      };

      if (currentAuthor) {
        // Güncelleme işlemi
        await api.authorService.update(currentAuthor.id, requestData);
        showNotification('Yazar başarıyla güncellendi', 'success');
        setAuthors(prev => {
          const updated = prev.map(a => a.id === currentAuthor.id ? { ...a, ...requestData } : a);
          const updatedAuthor = updated.find(a => a.id === currentAuthor.id);
          const others = updated.filter(a => a.id !== currentAuthor.id);
          return [updatedAuthor, ...others];
        });
      } else {
        // Ekleme işlemi
        const response = await api.authorService.create(requestData);
        showNotification('Yazar başarıyla eklendi', 'success');
        setAuthors(prev => [response.data, ...prev]);
      }
      // Form ve modalı sıfırla
      setFormData({ name: '', birthDate: '', country: '' });
      setCurrentAuthor(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error('İşlem hatası:', error);
      if (error.response) {
        showNotification(`İşlem sırasında bir hata oluştu: ${error.response.data.message || error.message}`, 'error');
      } else {
        showNotification('İşlem sırasında bir hata oluştu', 'error');
      }
    }
  };

  // SİLME İŞLEMİ FONKSİYONLARI
  /**
   * Yazar silme işlemini gerçekleştirir
   * API'ye silme isteği gönderir ve başarılı olursa listeyi günceller
   */
  const handleDelete = async (id) => {
    try {
      await api.authorService.delete(id);
      showNotification('Yazar başarıyla silindi', 'success');
      fetchAuthors();
      setIsDeleteModalOpen(false);
      setAuthorToDelete(null);
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
   * Silme onay modalını açar
   * Silinecek yazarın bilgisini state'e kaydeder
   */
  const openDeleteModal = (author) => {
    setAuthorToDelete(author);
    setIsDeleteModalOpen(true);
  };

  // DÜZENLEME İŞLEMİ FONKSİYONLARI
  /**
   * Düzenleme modalını açar
   * Seçilen yazarın bilgilerini forma doldurur
   */
  const handleEdit = (author) => {
    setCurrentAuthor(author);
    setFormData({
      name: author.name,
      birthDate: author.birthDate,
      country: author.country
    });
    setIsModalOpen(true);
  };

  /**
   * Form verilerini sıfırlar
   * Yeni yazar ekleme için kullanılır
   */
  const resetForm = () => {
    setFormData({
      name: '',
      birthDate: '',
      country: ''
    });
    setCurrentAuthor(null);
  };

  // RENDER
  return (
    <div className="p-6">
      {/* Başlık ve ekleme butonu */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#8B4513] font-['Playfair_Display']">Yazarlar</h1>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 rounded-md bg-[#8B4513] text-white hover:bg-[#D2691E] transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <FaPlus className="text-sm" />
          <span>Yeni Yazar Ekle</span>
        </button>
      </div>

      {/* Arama ve filtreleme */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Yazar ara..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 pl-10 rounded-md border border-[#DEB887] focus:outline-none focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/10"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8B4513]" />
        </div>
      </div>

      {/* Yazarlar tablosu */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-[#DEB887]">
        <table className="min-w-full divide-y divide-[#DEB887]/30">
          <thead className="bg-[#FDF5E6]">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#8B4513] uppercase tracking-wider">
                Yazar Adı
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#8B4513] uppercase tracking-wider">
                Doğum Tarihi
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#8B4513] uppercase tracking-wider">
                Ülke
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-[#8B4513] uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#DEB887]/30">
            {filteredAuthors.map((author) => (
              <tr key={author.id} className="hover:bg-[#FDF5E6]/50 transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FaUser className="h-5 w-5 text-[#8B4513] mr-2" />
                    <div className="text-sm font-medium text-[#2C1810]">
                      {author.name}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2C1810]">
                  {new Date(author.birthDate).toLocaleDateString('tr-TR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2C1810]">
                  {author.country}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(author)}
                    className="text-blue-600 hover:text-blue-800 mr-3 transition-colors duration-200"
                  >
                    <FaEdit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => openDeleteModal(author)}
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

      {/* Yazar Ekleme/Düzenleme Modalı */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={currentAuthor ? 'Yazar Düzenle' : 'Yeni Yazar Ekle'}
      >
        <Form onSubmit={handleSubmit} onCancel={() => {
          setIsModalOpen(false);
          resetForm();
        }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#8B4513] mb-1">
                Yazar Adı
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
                Doğum Tarihi
              </label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#8B4513] mb-1">
                Ülke
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
          </div>
        </Form>
      </Modal>

      {/* Silme Onay Modalı */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setAuthorToDelete(null);
        }}
        title="Yazar Sil"
      >
        <div className="p-4">
          <p className="text-[#2C1810] mb-4">
            <span className="font-semibold">{authorToDelete?.name}</span> isimli yazarı silmek istediğinizden emin misiniz?
          </p>
          <p className="text-red-600 mb-4 text-sm">
            ⚠️ Dikkat: Bu işlem geri alınamaz ve yazara ait tüm kitaplar da silinecektir.
          </p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => {
                setIsDeleteModalOpen(false);
                setAuthorToDelete(null);
              }}
              className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300"
            >
              İptal
            </button>
            <button
              onClick={() => handleDelete(authorToDelete.id)}
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

export default Authors; 