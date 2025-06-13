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
  UPDATE_COUNTRY: (id) => `/organization/countries/${id}/`,
  DELETE_COUNTRY: (id) => `/organization/countries/${id}/`,
  // Regions endpoints
  REGIONS: '/organization/regions/',
  CREATE_REGION: '/organization/regions/',
};

// API istekleri için varsayılan ayarlar
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};