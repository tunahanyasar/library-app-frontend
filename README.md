# 📚 Library Management App | React + Vite + Tailwind

Kütüphane yönetimi için modern, kullanıcı dostu bir web uygulamasıdır. React, Vite ve Tailwind CSS ile geliştirilmiş olup, Spring Boot tabanlı bir backend API ile tam entegredir.

* Bu proje, kitap, yazar, yayınevi, kategori ve ödünç alma işlemlerini yönetmek için geliştirilmiştir.
* **React**, **Vite**, **Tailwind CSS**, **Spring Boot** ve **PostgreSQL** kullanılmıştır. Hazır olarak verilen backend projesine **React** ile frontend hazırlandı.
* Modern ve responsive bir arayüze sahiptir.

* Projenin Canlı Linki : [ https://library-app-frontend-omega.vercel.app/ ]

---

## :computer: Kurulum ve Kullanım

1. Projeyi klonlayın
```bash
git clone https://github.com/tunahanyasar/library-app-frontend.git
```

2. Frontend klasörüne gidin
```bash
cd react-frontend
```

3. Bağımlılıkları yükleyin
```bash
npm install
```

4. Geliştirme sunucusunu başlatın
```bash
npm run dev
```

> **Not:** Backend (Spring Boot) servisini de başlatmalısınız. Varsayılan olarak backend `http://localhost:8080` adresinde çalışmalıdır.

---

## 📜 Proje Yapısı

:open_file_folder: **Klasörler;**
* *src/*
  * *components/*
    * *Modal.jsx*
    * *Form.jsx*
    * *Header.jsx*
    * *Layout.jsx*
  * *pages/*
    * *Books.jsx*
    * *Authors.jsx*
    * *Publishers.jsx*
    * *Categories.jsx*
    * *BorrowBook.jsx*
    * *Home.jsx*
  * *services/*
    * *api.js*
  * *App.jsx*
  * *index.css*
  * *main.jsx*
* *index.html*
* *package.json*
* *tailwind.config.js*
* *vite.config.js*

1. ***src/components/***: Ortak kullanılan arayüz bileşenleri (modal, form, header, layout).
2. ***src/pages/***: Her bir ana sayfa için React bileşenleri (kitaplar, yazarlar, yayınevleri, kategoriler, ödünç alma, ana sayfa).
3. ***src/services/api.js***: Backend API ile iletişim fonksiyonları.
4. ***index.css*** ve ***tailwind.config.js***: Tüm stil ve tema ayarları.

---

## :star2: Mevcut Özellikler

1. **CRUD İşlemleri**
   - Kitap ekleme, düzenleme, silme, listeleme. Görsel: [Add Book](#kitap-ekleme)
   - Yazar ekleme, düzenleme, silme, listeleme. Görsel: [Add Author](#yazar-ekleme)
   - Yayınevi ekleme, düzenleme, silme, listeleme. Görsel: [Add Publisher](#yayımcı-ekleme)
   - Kategori ekleme, düzenleme, silme, listeleme. Görsel: [Add Category](#kategori-ekleme)
   - Kitap ödünç alma ve iade işlemleri
   Görsel: [Add Borrow](#ödünç-alma-ekleme)
   **NOT :** 
        * Veri tabanında kullanılan kategoriler silinemez.
        * Yazar veya Yayımcı silinirse bağlı olduğu veriler *(Kitaplar, Ödnüç Alma)* de silinir.
        * Silinen veriler geri getirilemez. Tamamen silinir. 

2. **Arama ve Filtreleme**
   - Kitap, yazar, yayınevi ve kategoriye göre arama
   - Çoklu kategori seçimi
   - Anlık filtreleme
   Görsel : [Searchbar Publishers](#yayımcı-aratma)
   - Ödünç alma sayfasında hem kitap ismi ile hem de kişi ismi ile ayrı ayrı aratma yapılabilir.
   Görsel : [Searchbar Borrow](#kitap-i̇smi-ile-aratma)

3. **Modern UI/UX**
   - Responsive ve kullanıcı dostu arayüz.
   Görsel: [Pages](#paperclip-sayfa-çıktıları--fullpages)
   - Temiz ve düzenli kod yapısı
   - Bildirim sistemi (başarı/hata uyarıları, yapılan işlemler alert ile kullanıcıya gösterilir)
   Görsel: [Alerts](#paperclip-sayfa-çıktıları--alerts)
   - Modal ile ekleme/düzenleme/silme işlemleri
   - Koyu ve açık renk uyumlu tasarım


4. **Ekstra Özellikler**
   - Kitap ödünç alma ve iade işlemlerinde stok yönetimi
   - Kategori silme işlemlerinde ilişkili kitap kontrolü
   - Tüm verileri topluca silme için onay modalları
   - Verilerin otomatik sıralanması (en son güncellenen/en son eklenen en üstte)
   - Uzun metinlerin otomatik kısaltılması ve "..." ile gösterilmesi

---

## 💡 Kullanılan Yapılar | Kazanımlar

**React:**
* Component Mimarisi
* Props Sistemi
* React Hooks (useState, useEffect, useCallback)
* Event Handling
* Conditional Rendering
* React Router

**Tailwind CSS:**
* Utility-first CSS
* Responsive Design
* Custom Theme
* Modern ve hızlı stil yönetimi

**JavaScript:**
* ES6+ Özellikleri
* Array Metodları
* API Entegrasyonu (Axios)
* State Management
* Asenkron Programlama

**Backend (Spring Boot):**
* RESTful API
* PostgreSQL ile veri yönetimi
* CORS ve güvenlik ayarları

---

# :paperclip: Sayfa Çıktıları : Fullpages

### Ana Sayfa
![HomePage](./src/assets/screenshots/fullpages/homepage.png)

### Yayımcılar Sayfası
![Publishers Page](./src/assets/screenshots/fullpages/publishers.png)

### Kategoriler Sayfası
![Categories Page](./src/assets/screenshots/fullpages/categories.png)

### Kitaplar Sayfası
![Books Page](./src/assets/screenshots/fullpages/books.png)

### Yazarlar Sayfası
![Authors Page](./src/assets/screenshots/fullpages/authors.png)

### Ödünç Alma Sayfası
![Borrow Page](./src/assets/screenshots/fullpages/borrows.png)

# :paperclip: Sayfa Çıktıları : CRUD

### Kitap Ekleme
![Add Book](./src/assets/screenshots/addings/add_books.png)

### Yazar Ekleme
![Add Author](./src/assets/screenshots/addings/add_author.png)

### Kategori Ekleme
![Add Category](./src/assets/screenshots/addings/add_category.png)

### Yayımcı Ekleme
![Add Publisher](./src/assets/screenshots/addings/add_publisher.png)

### Ödünç Alma Ekleme
![Add Borrow](./src/assets/screenshots/addings/add_borrow.png)

# :paperclip: Sayfa Çıktıları : Alerts

### Kategori Silme Alert
![Category Alert](./src/assets/screenshots/alerts/alert1.png)

### Kategori Ekleme Alert 
![Category Alert1](./src/assets/screenshots/alerts/alert2.png)

### Silme İşlemi Yazar Modal
![Author Delete Modal](./src/assets/screenshots/alerts/alert3.png)

### Silme İşlemi Yayımcı Modal
![Publisher Delete Modal](./src/assets/screenshots/alerts/alert4.png)

# :paperclip: Sayfa Çıktıları : Searchbar
### Yayımcı Aratma
![Search Publisher](./src/assets/screenshots/searchbar/searchbar1.png)

### Kitap İsmi ile Aratma
![Search Borrow1](./src/assets/screenshots/searchbar/searchbar2.png)

### Kişi İsmi ile Aratma
![Search Borrow2](./src/assets/screenshots/searchbar/searchbar3.png)

---

## 🎮 Nasıl Kullanılır?

1. **Ana Sayfa:**
   - Kütüphanedeki tüm kitapları, yazarları, yayınevlerini ve kategorileri görüntüleyin.
   - Arama kutularını kullanarak filtreleme yapın.
   - Herhangi bir kaydı düzenleyin veya silin.

2. **Kitap Ekleme/Düzenleme:**
   - "Yeni Kitap Ekle" butonuna tıklayın.
   - Açılan modalda kitap bilgilerini girin ve kaydedin.
   - Kitapları düzenlemek için ilgili satırdaki düzenle ikonuna tıklayın.

3. **Ödünç Alma:**
   - "Kitap Alma" sayfasında ödünç alınacak kitabı ve kullanıcıyı seçin.
   - Ödünç alma ve iade işlemlerini yönetin.

---

## 🔍 Detaylı Açıklama

### Proje Amacı ve Kapsamı

Bu proje, küçük ve orta ölçekli kütüphanelerin kitap, yazar, yayınevi, kategori ve ödünç alma işlemlerini kolayca yönetebilmesi için geliştirilmiştir. Modern arayüzü ve güçlü backend entegrasyonu ile hızlı ve güvenli bir deneyim sunar.

### Teknik Detaylar

#### Books.jsx - Kitaplar Sayfası Bileşeni

- Kitapların listelenmesi, eklenmesi, düzenlenmesi ve silinmesi
- Çoklu kategori seçimi ve filtreleme
- Yazar ve yayınevi ile ilişkilendirme
- Stok yönetimi ve ödünç alma entegrasyonu

#### BorrowBook.jsx - Ödünç Alma Bileşeni

- Kitap ödünç alma ve iade işlemleri
- Stok güncelleme
- Kullanıcıya özel bildirimler

#### Bildirim Sistemi
- Başarı ve hata durumlarında headerin altında uyarı gösterimi
- Modal ile silme ve toplu silme işlemlerinde onay

---

## 📝 Kod Standartları ve Açıklamalar
- Tüm ana bileşenlerde (Form, Modal, Header, Layout, sayfa bileşenleri) detaylı açıklama ve yorum satırları eklenmiştir.
- Kodun okunabilirliği ve sürdürülebilirliği için fonksiyonlar, state'ler ve önemli JSX blokları açıklanmıştır.
- index.css dosyasında ana bölümler ve özel stiller için açıklayıcı yorumlar bulunmaktadır.

## ⚠️ Kullanıcı Uyarıları ve Modal Kullanımı
- Silme işlemlerinde, ilişkili veriler hakkında uyarı ve onay isteyen modallar açılır.
- Yazar, yayınevi veya kategori silindiğinde, ilişkili tüm kitaplar da silinir.
- Silinen veriler geri getirilemez.
- Kategori, yazar ve yayınevi eklemeden kitap eklenemez.
- Bildirimler sticky ve fixed olarak ekranın üstünde ve ortasında gösterilir.

## 🎨 UI/UX ve Erişilebilirlik
- Header sabit ve scroll ile blur efekti alır.
- Modal başlıkları vurgulu, büyük ve bold olarak görünür.
- Form inputları ve butonlar erişilebilir ve modern tasarıma sahiptir.
- Tüm formlar ve modallar, kullanıcıya açıklayıcı uyarılar ve yönlendirmeler sunar.

## 🔄 Son Güncellemeler
- Kodun tamamında açıklayıcı yorumlar ve başlıklar eklendi.
- Modal ve bildirim sistemleri geliştirildi.
- Tüm silme işlemlerinde ilişkili veriler ve geri dönüşsüzlük hakkında uyarı veriliyor.
- Ödünç alma kaydı güncellerken kitap ve email alanları sadece güncelleme modunda disabled ve mevcut veri gösteriliyor.
- index.css dosyasında bölümler ve önemli alanlar için açıklayıcı yorumlar eklendi.

---

## 👤 İletişim

[Tunahan Yaşar](https://github.com/tunahanyasar)

---

## 📚 Kaynaklar ve Referanslar

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Spring Boot](https://spring.io/projects/spring-boot)
- [PostgreSQL](https://www.postgresql.org/)
