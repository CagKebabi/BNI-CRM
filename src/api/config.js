// API temel URL'si
// Development ortamında proxy kullanıyoruz, production'da doğrudan API URL'sini kullanacağız
export const API_BASE_URL = import.meta.env.PROD ? 'http://92.205.61.102' : '/api';

// API endpoint'leri
export const ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/users/login/',
  // Users endpoints
  GET_USERS: '/users/users/',
  CREATE_USER: '/users/users/',
  DELETE_USER: (id) => `/users/users/${id}/`,
  // Organization endpoints
  COUNTRIES: '/organization/countries/',
  UPDATE_COUNTRY: (id) => `/organization/countries/${id}/`,
  DELETE_COUNTRY: (id) => `/organization/countries/${id}/`,
  // Regions endpoints
  REGIONS: '/organization/regions/',
  CREATE_REGION: '/organization/regions/',
  UPDATE_REGION: (id) => `/organization/regions/${id}/`,
  DELETE_REGION: (id) => `/organization/regions/${id}/`,
  // Groups endpoints
  GROUPS: '/organization/groups/',
  CREATE_GROUP: '/organization/groups/',
  UPDATE_GROUP: (id) => `/organization/groups/${id}/`,
  DELETE_GROUP: (id) => `/organization/groups/${id}/`,
};

// API istekleri için varsayılan ayarlar
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};