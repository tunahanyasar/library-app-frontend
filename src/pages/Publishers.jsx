/**
 * YAYIMCILAR SAYFASI BİLEŞENİ
 * Kitap yayımcılarının yönetimi için CRUD işlemlerini içeren sayfa
 * Yayımcı ekleme, düzenleme, silme ve listeleme işlemlerini yönetir
 * Yayımcı bazında arama yapabilme özelliği sunar
 * 
 * Özellikler:
 * - Yayımcı ekleme ve düzenleme
 * - Yayımcı silme (ilişkili kitaplarla birlikte)
 * - Yayımcı listeleme ve arama
 * - Kuruluş yılı seçimi için özel tarih seçici
 */

import { useState, useEffect, useCallback } from 'react';
import { FaBuilding, FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import Modal from '../components/Modal';
import Form from '../components/Form';
import api from '../services/api';

const Publishers = ({ showNotification }) => {
  // STATE TANIMLAMALARI
  // Tüm yayımcıların listesi
  const [publishers, setPublishers] = useState([]);
  // Arama sonuçlarına göre filtrelenmiş yayımcılar
  const [filteredPublishers, setFilteredPublishers] = useState([]);
  // Arama kutusundaki metin
  const [searchTerm, setSearchTerm] = useState('');
  // Yayımcı ekleme/düzenleme modalının durumu
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Düzenlenen yayımcının bilgisi
  const [currentPublisher, setCurrentPublisher] = useState(null);
  // Form verileri
  const [formData, setFormData] = useState({
    name: '',
    establishmentYear: '',
    address: ''
  });
  // Silme modalının durumu
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // Silinecek yayımcının bilgisi
  const [publisherToDelete, setPublisherToDelete] = useState(null);

  // VERİ YÖNETİMİ FONKSİYONLARI
  /**
   * Yayımcıları API'den getirir ve state'e kaydeder
   * useCallback ile memoize edilmiş fonksiyon
   */
  const fetchPublishers = useCallback(async () => {
    try {
      const response = await api.publishers.getAll();
      // En son eklenen yayımcılar üstte görünsün diye reverse edilir
      setPublishers(response.data.slice().reverse());
    } catch (error) {
      showNotification(`Yayımcılar yüklenirken bir hata oluştu: ${error.message}`, 'error');
    }
  }, [showNotification]);

  // ARAMA FONKSİYONLARI
  /**
   * Yayımcı adına göre arama yapar
   * Sonuçları filteredPublishers state'ine kaydeder
   */
  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);
    
    const filtered = publishers.filter(publisher => 
      publisher.name.toLowerCase().includes(searchValue)
    );
    setFilteredPublishers(filtered);
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
   * Yayımcı ekleme veya güncelleme işlemini gerçekleştirir
   * currentPublisher varsa güncelleme, yoksa ekleme yapar
   * 
   * İşlem Adımları:
   * 1. Form verilerini alır
   * 2. currentPublisher kontrolü yapar:
   *    - Varsa: Mevcut yayımcıyı günceller
   *    - Yoksa: Yeni yayımcı oluşturur
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
      if (currentPublisher) {
        // Güncelleme işlemi
        await api.publishers.update(currentPublisher.id, formData);
        showNotification('Yayımcı başarıyla güncellendi', 'success');
        // State güncelleme: Güncellenen yayımcıyı listenin başına taşır
        setPublishers(prev => {
          const updated = prev.map(p => p.id === currentPublisher.id ? { ...p, ...formData } : p);
          const updatedPublisher = updated.find(p => p.id === currentPublisher.id);
          const others = updated.filter(p => p.id !== currentPublisher.id);
          return [updatedPublisher, ...others];
        });
      } else {
        // Yeni yayımcı ekleme işlemi
        const response = await api.publishers.create(formData);
        showNotification('Yayımcı başarıyla eklendi', 'success');
        // Yeni yayımcıyı listenin başına ekler
        setPublishers(prev => [response.data, ...prev]);
      }
      // İşlem sonrası temizlik
      setFormData({
        name: '',
        establishmentYear: '',
        address: ''
      });
      setCurrentPublisher(null);
      setIsModalOpen(false);
    } catch (error) {
      showNotification(`İşlem sırasında bir hata oluştu: ${error.message}`, 'error');
    }
  };

  /**
   * Yayımcı silme işlemini gerçekleştirir
   * Yayımcıya ait kitaplar varsa onlar da silinir
   * 
   * İşlem Adımları:
   * 1. API'ye silme isteği gönderir
   * 2. Başarılı silme durumunda:
   *    - Bildirim gösterir
   *    - Listeyi günceller
   * 3. Hata durumunda:
   *    - Hata mesajını gösterir
   */
  const handleDelete = async (id) => {
    try {
      await api.publishers.delete(id);
      showNotification('Yayımcı başarıyla silindi', 'success');
      fetchPublishers();
    } catch (error) {
      console.error('Silme hatası:', error);
      showNotification('Yayımcı silinirken bir hata oluştu', 'error');
    }
  };

  /**
   * Düzenleme modalını açar
   * Seçilen yayımcının bilgilerini forma doldurur
   */
  const handleEdit = (publisher) => {
    setCurrentPublisher(publisher);
    setFormData({
      name: publisher.name,
      establishmentYear: publisher.establishmentYear,
      address: publisher.address
    });
    setIsModalOpen(true);
  };

  /**
   * Form verilerini sıfırlar
   * Yeni yayımcı ekleme için kullanılır
   */
  const resetForm = () => {
    setFormData({
      name: '',
      establishmentYear: '',
      address: ''
    });
    setCurrentPublisher(null);
  };

  // EFFECT HOOKLARI
  // Sayfa yüklendiğinde yayımcıları getir
  useEffect(() => {
    fetchPublishers();
  }, [fetchPublishers]);

  // Publishers state'i güncellendiğinde filteredPublishers'ı da güncelle
  useEffect(() => {
    setFilteredPublishers(publishers);
  }, [publishers]);

  // RENDER
  return (
    <div className="p-6">
      {/* Başlık ve ekleme butonu */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#8B4513] font-['Playfair_Display']">Yayımcılar</h1>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 rounded-md bg-[#8B4513] text-white hover:bg-[#D2691E] transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <FaPlus className="text-sm" />
          <span>Yeni Yayımcı Ekle</span>
        </button>
      </div>

      {/* Arama ve filtreleme */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Yayımcı ara..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 pl-10 rounded-md border border-[#DEB887] focus:outline-none focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/10"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8B4513]" />
        </div>
      </div>

      {/* Yayımcılar tablosu */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-[#DEB887]">
        <table className="min-w-full divide-y divide-[#DEB887]/30">
          <thead className="bg-[#FDF5E6]">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#8B4513] uppercase tracking-wider">
                Yayımcı Adı
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#8B4513] uppercase tracking-wider">
                Kuruluş Yılı
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#8B4513] uppercase tracking-wider">
                Adres
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-[#8B4513] uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#DEB887]/30">
            {filteredPublishers.map((publisher) => (
              <tr key={publisher.id} className="hover:bg-[#FDF5E6]/50 transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FaBuilding className="h-5 w-5 text-[#8B4513] mr-2" />
                    <div className="text-sm font-medium text-[#2C1810]">
                      {publisher.name}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2C1810]">
                  {publisher.establishmentYear}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2C1810]">
                  {publisher.address}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(publisher)}
                    className="text-blue-600 hover:text-blue-800 mr-3 transition-colors duration-200"
                  >
                    <FaEdit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => {
                      setIsDeleteModalOpen(true);
                      setPublisherToDelete(publisher);
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

      {/* Yayımcı Ekleme/Düzenleme Modalı */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={currentPublisher ? 'Yayımcı Düzenle' : 'Yeni Yayımcı Ekle'}
      >
        <Form onSubmit={handleSubmit} onCancel={() => {
            setIsModalOpen(false);
            resetForm();
        }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#8B4513] mb-1">
                Yayımcı Adı
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
                Kuruluş Yılı
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  name="establishmentYear"
                  value={formData.establishmentYear}
                  onChange={handleInputChange}
                  min="1000"
                  max={new Date().getFullYear()}
                  className="form-input w-1/2"
                  placeholder="Yıl giriniz"
                  required
                />
                <select
                  onChange={e => setFormData(prev => ({ ...prev, establishmentYear: e.target.value }))}
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
                Adres
              </label>
              <textarea
                name="address"
                value={formData.address}
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
          setPublisherToDelete(null);
        }}
        title="Yayımcı Sil"
      >
        <div className="p-4">
          <p className="text-[#2C1810] mb-4">
            <span className="font-semibold">{publisherToDelete?.name}</span> isimli yayımcıyı silmek istediğinizden emin misiniz?
          </p>
          <p className="text-red-600 mb-4 text-sm">
            ⚠️ Dikkat: Bu işlem geri alınamaz ve yayımcıya ait tüm kitaplar da silinecektir.
          </p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => {
                setIsDeleteModalOpen(false);
                setPublisherToDelete(null);
              }}
              className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300"
            >
              İptal
            </button>
            <button
              onClick={() => handleDelete(publisherToDelete.id)}
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

export default Publishers; 