// API temel URL'si
// Development ortamında proxy kullanıyoruz, production'da doğrudan API URL'sini kullanacağız
export const API_BASE_URL = import.meta.env.PROD ? 'http://92.205.61.102' : '/api';

// API endpoint'leri
export const ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/users/login/',
  // Users endpoints
  CREATE_USER: '/users/users/',
  // Organization endpoints
  COUNTRIES: '/organization/countries/',
};

// API istekleri için varsayılan ayarlar
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};