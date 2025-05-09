/**
 * ANA SAYFA BİLEŞENİ
 * Kütüphane yönetim sisteminin ana sayfası
 * Sistemdeki kitaplar, yazarlar, kategoriler ve ödünç kayıtları hakkında
 * genel istatistikleri ve özet bilgileri gösterir
 * 
 * Özellikler:
 * - Toplam kitap sayısı
 * - Toplam yazar sayısı
 * - Toplam kategori sayısı
 * - Toplam ödünç kayıt sayısı
 * - Son eklenen kitapların listesi
 * - Son ödünç alınan kitapların listesi
 */

import { Link } from 'react-router-dom';
import { FaBook, FaUsers, FaBuilding, FaTags, FaHandHolding, FaGithub } from 'react-icons/fa';
import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const features = [
  {
    icon: <FaBook className="h-8 w-8 text-[#8B4513]" />,
    title: 'Kitap Yönetimi',
    desc: 'Kitap ekleme, düzenleme, silme ve listeleme işlemleri. Yayın yılı için yıl seçici ve stok yönetimi.'
  },
  {
    icon: <FaUsers className="h-8 w-8 text-[#8B4513]" />,
    title: 'Yazar Yönetimi',
    desc: 'Yazar bilgilerini kolayca ekleyin, düzenleyin ve silin.'
  },
  {
    icon: <FaBuilding className="h-8 w-8 text-[#8B4513]" />,
    title: 'Yayınevi Yönetimi',
    desc: 'Yayınevlerini ekleyin, düzenleyin ve kuruluş yılı için yıl seçici kullanın.'
  },
  {
    icon: <FaTags className="h-8 w-8 text-[#8B4513]" />,
    title: 'Kategori Yönetimi',
    desc: 'Kitap kategorilerini yönetin. Kategori silme işlemlerinde ilişkili kitap kontrolü.'
  },
  {
    icon: <FaHandHolding className="h-8 w-8 text-[#8B4513]" />,
    title: 'Ödünç Takibi',
    desc: 'Kitap ödünç alma ve iade işlemlerini takip edin. Stok otomatik güncellenir.'
  },
  {
    icon: <span className="h-8 w-8 text-[#8B4513] font-bold text-2xl flex items-center justify-center">UI</span>,
    title: 'Modern UI/UX',
    desc: 'Responsive ve kullanıcı dostu arayüz, modal ile ekleme/düzenleme/silme, koyu ve açık renk uyumlu tasarım.'
  },
  {
    icon: <span className="h-8 w-8 text-[#8B4513] font-bold text-2xl flex items-center justify-center">!</span>,
    title: 'Bildirim Sistemi',
    desc: 'Tüm işlemler sonrası başarı/hata uyarıları alert olarak kullanıcıya gösterilir.'
  },
  {
    icon: <span className="h-8 w-8 text-[#8B4513] font-bold text-2xl flex items-center justify-center">★</span>,
    title: 'Ekstra Özellikler',
    desc: 'Toplu silme için onay modalları, çoklu kategori seçimi, hızlı arama ve filtreleme.'
  }
];

const Home = ({ showNotification }) => {
  // STATE TANIMLAMALARI
  // İstatistik verileri
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalAuthors: 0,
    totalCategories: 0,
    totalBorrows: 0
  });
  // Son eklenen kitapların listesi
  const [recentBooks, setRecentBooks] = useState([]);
  // Son ödünç alınan kitapların listesi
  const [recentBorrows, setRecentBorrows] = useState([]);
  // Yükleme durumu
  const [isLoading, setIsLoading] = useState(true);

  // VERİ YÖNETİMİ FONKSİYONLARI
  /**
   * Tüm istatistik verilerini API'den getirir
   * useCallback ile memoize edilmiş fonksiyon
   * 
   * İşlem Adımları:
   * 1. Yükleme durumunu aktif eder
   * 2. Tüm API isteklerini paralel olarak yapar
   * 3. Gelen verileri state'e kaydeder
   * 4. Hata durumunda bildirim gösterir
   * 5. İşlem sonunda yükleme durumunu kapatır
   */
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      // Tüm API isteklerini paralel olarak yap
      const [booksRes, authorsRes, categoriesRes, borrowsRes, recentBooksRes, recentBorrowsRes] = await Promise.all([
        api.books.getAll(),
        api.authors.getAll(),
        api.categories.getAll(),
        api.borrows.getAll(),
        api.books.getAll(),
        api.borrows.getAll()
      ]);

      // İstatistikleri güncelle
      setStats({
        totalBooks: booksRes.data.length,
        totalAuthors: authorsRes.data.length,
        totalCategories: categoriesRes.data.length,
        totalBorrows: borrowsRes.data.length
      });

      // Son eklenen 5 kitabı al
      setRecentBooks(recentBooksRes.data.slice(-5).reverse());
      // Son 5 ödünç kaydını al
      setRecentBorrows(recentBorrowsRes.data.slice(-5).reverse());
    } catch (error) {
      console.error('Veri yükleme hatası:', error);
      showNotification('Veriler yüklenirken bir hata oluştu', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  // EFFECT HOOKLARI
  // Sayfa yüklendiğinde verileri getir
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-[#8B4513] mb-4 font-['Playfair_Display']">LIBRARY APP</h1>
        <p className="text-lg text-[#2C1810] mb-2">
          Kütüphane kaynaklarınızı kolayca yönetin, kitap ödünç alma ve iade işlemlerini dijital ortamda takip edin.
        </p>
      </div>

      <div className="mb-10 bg-white rounded-lg shadow-lg p-6 border border-[#DEB887] transform transition-all duration-300 hover:shadow-xl">
        <h2 className="text-2xl font-semibold text-[#8B4513] mb-3 font-['Playfair_Display']">Proje Amacı</h2>
        <p className="text-[#2C1810] mb-2">
          Bu sistem, kütüphane yönetimini kolaylaştırmak, kitap, yazar, yayınevi ve kategori işlemlerini merkezi bir panelden yönetmek için geliştirilmiştir. Kitap ödünç alma ve iade süreçlerini dijitalleştirerek zaman ve iş gücünden tasarruf sağlar.
        </p>
      </div>

      <div className="mb-10 bg-white rounded-lg shadow-lg p-6 border border-[#DEB887] transform transition-all duration-300 hover:shadow-xl">
        <h2 className="text-2xl font-semibold text-[#8B4513] mb-3 font-['Playfair_Display']">Nasıl Kullanılır?</h2>
        <ol className="list-decimal list-inside text-[#2C1810] space-y-2">
          <li className="hover:text-[#8B4513] transition-colors duration-200">Üst menüden ilgili bölüme geçiş yapın.</li>
          <li className="hover:text-[#8B4513] transition-colors duration-200">Kitap, yazar, yayınevi ve kategori ekleyin veya düzenleyin.</li>
          <li className="hover:text-[#8B4513] transition-colors duration-200">Kitap ödünç alma ve iade işlemlerini kolayca yönetin.</li>
          <li className="hover:text-[#8B4513] transition-colors duration-200">Tüm işlemler için bildirimlerden ve modern arayüzden faydalanın.</li>
        </ol>
      </div>

      <div className="mb-10 bg-white rounded-lg shadow-lg p-6 border border-[#DEB887] transform transition-all duration-300 hover:shadow-xl">
        <h2 className="text-2xl font-semibold text-[#8B4513] mb-3 font-['Playfair_Display']">Dikkat Edilmesi Gerekenler</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-[#8B4513] mb-2">Silme İşlemleri</h3>
            <ul className="list-disc list-inside text-[#2C1810] space-y-2">
              <li>Kategori silme işlemlerinde, o kategoriye ait kitaplar varsa silme işlemi gerçekleştirilemez.</li>
              <li>Yazar ve yayınevi silme işlemlerinde, yazara veya yayınevine ait kitaplar varsa bağlı oldukları kitaplar ve ödünç alma işlemleri de silinir.</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#8B4513] mb-2">Ödünç İşlemleri</h3>
            <ul className="list-disc list-inside text-[#2C1810] space-y-2">
              <li>Ödünç verilen kitapların stok sayısı otomatik olarak azaltılır.</li>
              <li>İade edilen kitapların stok sayısı otomatik olarak artırılır.</li>
              <li>Ödünç alma sayfasında hem kitap ismi ile hem de kişi ismi ile ayrı ayrı aratma yapılabilir.</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#8B4513] mb-2">Genel Uyarılar</h3>
            <ul className="list-disc list-inside text-[#2C1810] space-y-2">
              <li>Tüm silme işlemleri için onay alınır ve geri alınamaz.</li>
              <li>Kitap eklerken zorunlu alanların doldurulması gerekir.</li>
              <li>Yayın yılı ve kuruluş yılı gibi tarih alanları için geçerli yıllar seçilmelidir.</li>
              <li>Kitap eklemeden önce, veritabanında kitap kategorisi, yazarı ve yayınevi eklenmiş olmalıdır.</li>
              <li>Güncelleme işlemlerinde ve ekleme işlemlerinden sonra veriler listenin en başına eklenir.</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-[#8B4513] mb-6 text-center font-['Playfair_Display']">
          Başlıca Özellikler
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div 
              key={i} 
              className="flex flex-col items-center bg-white rounded-lg shadow-lg p-6 border border-[#DEB887] transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="p-3 rounded-full bg-[#FDF5E6] mb-4">
                {f.icon}
              </div>
              <h3 className="text-xl font-semibold text-[#8B4513] font-['Playfair_Display']">{f.title}</h3>
              <p className="text-[#2C1810] text-center mt-2">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
      

      {/* İstatistik Kartları */}
      <h2 className="text-2xl font-semibold text-[#8B4513] mb-6 text-center font-['Playfair_Display']">
          İstatistikler
        </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Toplam Kitap Sayısı */}
        <div className="bg-white rounded-lg shadow-lg p-6 border border-[#DEB887]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#8B4513] font-medium">Toplam Kitap</p>
              <p className="text-2xl font-bold text-[#2C1810]">{stats.totalBooks}</p>
            </div>
            <FaBook className="h-8 w-8 text-[#8B4513]" />
          </div>
        </div>

        {/* Toplam Yazar Sayısı */}
        <div className="bg-white rounded-lg shadow-lg p-6 border border-[#DEB887]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#8B4513] font-medium">Toplam Yazar</p>
              <p className="text-2xl font-bold text-[#2C1810]">{stats.totalAuthors}</p>
            </div>
            <FaUsers className="h-8 w-8 text-[#8B4513]" />
          </div>
        </div>

        {/* Toplam Kategori Sayısı */}
        <div className="bg-white rounded-lg shadow-lg p-6 border border-[#DEB887]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#8B4513] font-medium">Toplam Kategori</p>
              <p className="text-2xl font-bold text-[#2C1810]">{stats.totalCategories}</p>
            </div>
            <FaTags className="h-8 w-8 text-[#8B4513]" />
          </div>
        </div>

        {/* Toplam Ödünç Kayıt Sayısı */}
        <div className="bg-white rounded-lg shadow-lg p-6 border border-[#DEB887]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#8B4513] font-medium">Toplam Ödünç</p>
              <p className="text-2xl font-bold text-[#2C1810]">{stats.totalBorrows}</p>
            </div>
            <FaHandHolding className="h-8 w-8 text-[#8B4513]" />
          </div>
        </div>
      </div>

      {/* Son Eklenen Kitaplar ve Son Ödünç Kayıtları */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Son Eklenen Kitaplar */}
        <div className="bg-white rounded-lg shadow-lg border border-[#DEB887]">
          <div className="p-4 border-b border-[#DEB887]">
            <h2 className="text-lg font-semibold text-[#8B4513]">Son Eklenen Kitaplar</h2>
          </div>
          <div className="p-4">
            {isLoading ? (
              <p className="text-[#8B4513]">Yükleniyor...</p>
            ) : recentBooks.length === 0 ? (
              <p className="text-[#8B4513]">Henüz kitap eklenmemiş</p>
            ) : (
              <ul className="space-y-2">
                {recentBooks.map((book) => (
                  <li key={book.id} className="flex items-center space-x-2">
                    <FaBook className="h-4 w-4 text-[#8B4513]" />
                    <span className="text-[#2C1810]">{book.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Son Ödünç Kayıtları */}
        <div className="bg-white rounded-lg shadow-lg border border-[#DEB887]">
          <div className="p-4 border-b border-[#DEB887]">
            <h2 className="text-lg font-semibold text-[#8B4513]">Son Ödünç Kayıtları</h2>
          </div>
          <div className="p-4">
            {isLoading ? (
              <p className="text-[#8B4513]">Yükleniyor...</p>
            ) : recentBorrows.length === 0 ? (
              <p className="text-[#8B4513]">Henüz ödünç kaydı yok</p>
            ) : (
              <ul className="space-y-2">
                {recentBorrows.map((borrow) => (
                  <li key={borrow.id} className="flex items-center space-x-2">
                    <FaHandHolding className="h-4 w-4 text-[#8B4513]" />
                    <span className="text-[#2C1810]">
                      {borrow.book?.name} - {borrow.borrowerName}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      <div className="text-center text-[#8B4513]/60 text-sm mt-12 font-['Playfair_Display']">
        <div className="flex items-center justify-center space-x-2">
          <span>© {new Date().getFullYear()} Library App</span>
          <span>•</span>
          <a 
            href="https://github.com/tunahanyasar" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-1 hover:text-[#8B4513] transition-colors duration-300"
          >
            <FaGithub className="text-lg" />
            <span>İletişim</span>
          </a>
        </div>
      </div>
    </div>
    
  );
};

export default Home; 