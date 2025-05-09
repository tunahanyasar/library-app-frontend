/**
 * MODAL BİLEŞENİ
 * Uygulamada kullanılan özelleştirilebilir modal penceresi
 * Form, onay ve bilgi gösterme amaçlı kullanılabilir
 * 
 * Özellikler:
 * - Responsive tasarım
 * - Animasyonlu açılış/kapanış
 * - Özelleştirilebilir başlık ve içerik
 * - Dışarı tıklama ile kapanma
 * - Klavye ile kapatma (ESC tuşu)
 * 
 * Props:
 * - isOpen: Modalın açık/kapalı durumu
 * - onClose: Modalı kapatma fonksiyonu
 * - title: Modal başlığı
 * - children: Modal içeriği
 */

import React, { useRef, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const Modal = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef(null);

  // KLAVYE YÖNETİMİ
  // ESC tuşuna basıldığında modalı kapatır
  useEffect(() => {
    // ESC tuşuna basıldığında modalı kapatacak fonksiyon
    const handleEsc = (event) => {
      // Eğer basılan tuş ESC ise
      if (event.key === 'Escape') {
        // Modalı kapat
        onClose();
      }
    };

    // Modal açıksa ESC dinleyicisini ekle
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }

    // Temizlik: ESC dinleyicisini kaldır
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    // Modal dışında bir yere tıklanınca modalı kapatacak fonksiyon
    const handleClickOutside = (event) => {
      // Eğer tıklanan alan modalın dışı ise
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        // Modalı kapat
        onClose();
      }
    };

    // Modal açıksa dış tıklama dinleyicisini ekle
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Temizlik: dış tıklama dinleyicisini kaldır
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Modal kapalıysa null döndür
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Arka plan overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal içeriği */}
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          {/* Modal başlığı */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold leading-6 text-[#8B4513]">
                {title}
              </h3>
              <button
                type="button"
                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={onClose}
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Modal içeriği */}
          <div className="bg-white px-4 pb-5 sm:p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal; 