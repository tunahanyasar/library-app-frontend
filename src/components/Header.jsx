/**
 * HEADER BİLEŞENİ
 * Uygulamanın üst navigasyon çubuğunu oluşturan bileşen
 * Responsive tasarıma sahip, mobil ve masaüstü görünümleri destekler
 * Scroll edildiğinde blur efekti ile üstte sabit kalır
 */

import { Link, useLocation } from 'react-router-dom';
import { FaBook, FaHome, FaBuilding, FaTags, FaBookOpen, FaUserEdit, FaHandHolding } from 'react-icons/fa';
import { useState, useEffect } from 'react';

const Header = () => {
  // Aktif sayfa yolunu takip etmek için useLocation hook'u
  const location = useLocation();
  // Mobil menünün açık/kapalı durumunu yönetmek için state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Scroll durumunu takip etmek için state
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll olayını dinle
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigasyon menü öğelerinin tanımlanması
  // Her öğe için yol, isim ve ikon bilgisi içerir
  const navItems = [
    { path: '/', name: 'Ana Sayfa', icon: FaHome },
    { path: '/publishers', name: 'Yayımcılar', icon: FaBuilding },
    { path: '/categories', name: 'Kategoriler', icon: FaTags },
    { path: '/books', name: 'Kitaplar', icon: FaBook },
    { path: '/authors', name: 'Yazarlar', icon: FaUserEdit },
    { path: '/borrow', name: 'Kitap Alma', icon: FaHandHolding },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-[#8B4513]/90 backdrop-blur-md shadow-lg' 
        : 'bg-[#8B4513]'
    }`}>
      {/* Header içeriği için maksimum genişlik ve padding ayarları */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo ve menü öğelerini içeren flex container */}
        <div className="flex justify-between items-center h-20">
          {/* Logo ve başlık bölümü */}
          <div className="flex items-center h-full space-x-4">
            {/* Logo container - ölçeklendirme ve gölge efektleri */}
            <div style={{ transform: 'scale(0.9)', transformOrigin: 'left center' }}>
              <img 
                src="/logo2.png" 
                alt="Logo" 
                className="h-full w-auto object-contain" 
                style={{ 
                  maxHeight: '70px',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                }}
              />
            </div>
            {/* Uygulama başlığı - hover efektleri ve tipografi ayarları */}
            <h1 className="text-3xl font-bold text-[#DEB887] tracking-wide transition-all duration-300 hover:text-white hover:scale-105 cursor-default" style={{ 
              fontFamily: 'Playfair Display, serif',
              letterSpacing: '0.05em',
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
            }}>
              LIBRARY APP
            </h1>
          </div>

          {/* Masaüstü navigasyon menüsü - md breakpoint'inden sonra görünür */}
          <nav className="hidden md:flex space-x-2">
            {navItems.map((item) => {
              // Aktif sayfa kontrolü
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-base font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-[#D2691E] text-white shadow-md'
                      : 'text-[#DEB887] hover:bg-[#D2691E]/20 hover:text-white'
                  }`}
                >
                  <Icon className="text-xl" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mobil menü butonu - md breakpoint'inden önce görünür */}
          <button 
            className="md:hidden text-white p-2 hover:bg-[#D2691E]/20 rounded-md"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobil menü - koşullu render edilir */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#8B4513] shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-[#D2691E] text-white'
                      : 'text-[#DEB887] hover:bg-[#D2691E]/20 hover:text-white'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="text-xl" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 