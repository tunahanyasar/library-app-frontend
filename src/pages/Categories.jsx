/**
 * KATEGORİLER SAYFASI BİLEŞENİ
 * Kitap kategorilerinin yönetimi için CRUD işlemlerini içeren sayfa
 * Kategori ekleme, düzenleme, silme ve listeleme işlemlerini yönetir
 * Kategori bazında arama yapabilme özelliği sunar
 */

import { useState, useEffect, useCallback } from 'react';
import { FaBookmark, FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import Modal from '../components/Modal';
import Form from '../components/Form';
import api from '../services/api';

const Categories = ({ showNotification }) => {
  // STATE TANIMLAMALARI
  // Tüm kategorilerin listesi
  const [categories, setCategories] = useState([]);
  // Arama sonuçlarına göre filtrelenmiş kategoriler
  const [filteredCategories, setFilteredCategories] = useState([]);
  // Arama kutusundaki metin
  const [searchTerm, setSearchTerm] = useState('');
  // Kategori ekleme/düzenleme modalının durumu
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Düzenlenen kategorinin bilgisi
  const [currentCategory, setCurrentCategory] = useState(null);
  // Form verileri
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  // Silme modalının durumu
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // Silinecek kategorinin bilgisi
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // VERİ YÖNETİMİ FONKSİYONLARI
  /**
   * Kategorileri API'den getirir ve state'e kaydeder
   * useCallback ile memoize edilmiş fonksiyon
   */
  const fetchCategories = useCallback(async () => {
    try {
      const response = await api.categories.getAll();
      // En son eklenen kategoriler üstte görünsün diye reverse edilir
      setCategories(response.data.slice().reverse());
    } catch (error) {
      showNotification(`Kategoriler yüklenirken bir hata oluştu: ${error.message}`, 'error');
    }
  }, [showNotification]);

  // ARAMA FONKSİYONLARI
  /**
   * Kategori adına göre arama yapar
   * Sonuçları filteredCategories state'ine kaydeder
   */
  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);
    
    const filtered = categories.filter(category => 
      category.name.toLowerCase().includes(searchValue)
    );
    setFilteredCategories(filtered);
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

  // CRUD İŞLEM FONKSİYONLARI
  /**
   * Kategori ekleme veya güncelleme işlemini gerçekleştirir
   * currentCategory varsa güncelleme, yoksa ekleme yapar
   * 
   * İşlem Adımları:
   * 1. Form verilerini alır
   * 2. currentCategory kontrolü yapar:
   *    - Varsa: Mevcut kategoriyi günceller
   *    - Yoksa: Yeni kategori oluşturur
   * 3. Başarılı işlem sonrası:
   *    - Bildirim gösterir
   *    - State'i günceller
   *    - Formu sıfırlar
   *    - Modalı kapatır
   * 4. Hata durumunda:
   *    - Hata mesajını gösterir
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentCategory) {
        // Güncelleme işlemi
        await api.categories.update(currentCategory.id, formData);
        showNotification('Kategori başarıyla güncellendi', 'success');
        // State güncelleme: Güncellenen kategoriyi listenin başına taşır
        setCategories(prev => {
          const updated = prev.map(c => c.id === currentCategory.id ? { ...c, ...formData } : c);
          const updatedCategory = updated.find(c => c.id === currentCategory.id);
          const others = updated.filter(c => c.id !== currentCategory.id);
          return [updatedCategory, ...others];
        });
      } else {
        // Yeni kategori ekleme işlemi
        const response = await api.categories.create(formData);
        showNotification('Kategori başarıyla eklendi', 'success');
        // Yeni kategoriyi listenin başına ekler
        setCategories(prev => [response.data, ...prev]);
      }
      // İşlem sonrası temizlik
      setFormData({ name: '', description: '' });
      setCurrentCategory(null);
      setIsModalOpen(false);
    } catch (error) {
      // Hata durumunda bildirim göster
      showNotification(`İşlem sırasında bir hata oluştu: ${error.message}`, 'error');
    }
  };

  /**
   * Kategori silme işlemini gerçekleştirir
   * Kategoriye ait kitaplar varsa silme işlemi engellenir
   * 
   * İşlem Adımları:
   * 1. API'ye silme isteği gönderir
   * 2. Backend'den gelen yanıtı kontrol eder:
   *    - Kitaplar varsa: Silme engellenir ve uyarı gösterilir
   *    - Başarılı silme: Bildirim gösterilir ve liste güncellenir
   *    - Hata durumu: Hata mesajı gösterilir
   */
  const handleDelete = async (id) => {
    try {
      const response = await api.categories.delete(id);
      // Backend'den gelen yanıtı kontrol et
      if (response.data && response.data.includes('kayıtlı kitap mevcut')) {
        showNotification('Bu kategori silinemez! Veri tabanında bu kategoriyi kullanan kitaplar bulunmaktadır.', 'error');
      } else if (response.data && response.data.includes('silme işlemi başarılı')) {
        showNotification('Kategori başarıyla silindi', 'success');
        fetchCategories();
      } else {
        showNotification('Kategori silinirken bir hata oluştu', 'error');
      }
    } catch (error) {
      console.error('Silme hatası:', error);
      showNotification('Kategori silinirken bir hata oluştu', 'error');
    }
  };

  /**
   * Düzenleme modalını açar
   * Seçilen kategorinin bilgilerini forma doldurur
   */
  const handleEdit = (category) => {
    setCurrentCategory(category);
    setFormData({
      name: category.name,
      description: category.description
    });
    setIsModalOpen(true);
  };

  /**
   * Form verilerini sıfırlar
   * Yeni kategori ekleme için kullanılır
   */
  const resetForm = () => {
    setFormData({
      name: '',
      description: ''
    });
    setCurrentCategory(null);
  };

  // EFFECT HOOKLARI
  // Sayfa yüklendiğinde kategorileri getir
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Categories state'i güncellendiğinde filteredCategories'u da güncelle
  useEffect(() => {
    setFilteredCategories(categories);
  }, [categories]);

  // RENDER
  return (
    <div className="p-6">
      {/* Başlık ve ekleme butonu */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#8B4513] font-['Playfair_Display']">Kategoriler</h1>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 rounded-md bg-[#8B4513] text-white hover:bg-[#D2691E] transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <FaPlus className="text-sm" />
          <span>Yeni Kategori Ekle</span>
        </button>
      </div>

      {/* Arama ve filtreleme */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Kategori ara..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 pl-10 rounded-md border border-[#DEB887] focus:outline-none focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/10"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8B4513]" />
        </div>
      </div>

      {/* Kategoriler tablosu */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-[#DEB887]">
        <table className="min-w-full divide-y divide-[#DEB887]/30">
          <thead className="bg-[#FDF5E6]">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#8B4513] uppercase tracking-wider">
                Kategori Adı
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#8B4513] uppercase tracking-wider">
                Açıklama
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-[#8B4513] uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#DEB887]/30">
            {filteredCategories.map((category) => (
              <tr key={category.id} className="hover:bg-[#FDF5E6]/50 transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FaBookmark className="h-5 w-5 text-[#8B4513] mr-2" />
                    <div className="text-sm font-medium text-[#2C1810]">
                      {category.name}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2C1810]">
                  {category.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(category)}
                    className="text-blue-600 hover:text-blue-800 mr-3 transition-colors duration-200"
                  >
                    <FaEdit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => {
                      setIsDeleteModalOpen(true);
                      setCategoryToDelete(category);
                    }}
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

      {/* Kategori Ekleme/Düzenleme Modalı */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={currentCategory ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
      >
        <Form onSubmit={handleSubmit} onCancel={() => {
            setIsModalOpen(false);
            resetForm();
        }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#8B4513] mb-1">
              Kategori Adı
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
              Açıklama
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
                className="form-input h-24"
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
          setCategoryToDelete(null);
        }}
        title="Kategori Sil"
      >
        <div className="p-4">
          <p className="text-[#2C1810] mb-4">
            <span className="font-semibold">{categoryToDelete?.name}</span> isimli kategoriyi silmek istediğinizden emin misiniz?
          </p>
          <p className="text-red-600 mb-4 text-sm">
            ⚠️ Dikkat: Bu işlem geri alınamaz ve kategoriye ait tüm kitaplar da silinecektir.
          </p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => {
                setIsDeleteModalOpen(false);
                setCategoryToDelete(null);
              }}
              className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300"
            >
              İptal
            </button>
            <button
              onClick={() => handleDelete(categoryToDelete.id)}
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

export default Categories; 