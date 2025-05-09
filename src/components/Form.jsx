/**
 * FORM BİLEŞENİ
 * Uygulama genelinde kullanılan yeniden kullanılabilir form bileşeni
 * Form gönderimi ve iptal işlemlerini yönetir
 * 
 * Özellikler:
 * - Form gönderimi için onSubmit prop'u
 * - İptal işlemi için onCancel prop'u
 * - İçerik için children prop'u
 * - Özelleştirilebilir stil ve davranış
 */

import React from 'react';
import { FaTimes, FaSave } from 'react-icons/fa';

const Form = ({ onSubmit, onCancel, submitText, cancelText, children }) => {
  return (
    <form onSubmit={onSubmit} className="bg-white rounded-lg shadow-lg p-6 border border-[#DEB887]">
      <div className="space-y-4">
        {children}
      </div>
      <div className="flex justify-end space-x-4 mt-6 pt-4 border-t border-[#DEB887]/30">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center space-x-2 px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300"
        >
          <FaTimes className="text-sm" />
          <span>{cancelText || 'İptal'}</span>
        </button>
        <button
          type="submit"
          className="flex items-center space-x-2 px-4 py-2 rounded-md bg-[#8B4513] text-white hover:bg-[#D2691E] transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <FaSave className="text-sm" />
          <span>{submitText || 'Kaydet'}</span>
        </button>
      </div>
    </form>
  );
};

export default Form; 