import { API_BASE_URL, DEFAULT_HEADERS } from '../api/config';

class ApiService {
  getHeaders() {
    const headers = { ...DEFAULT_HEADERS };
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async get(endpoint, headers = null) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: headers || this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`API isteği başarısız: ${response.status}`);
    }

    return response.json();
  }

  async post(endpoint, data, headers = null) {
    const requestHeaders = headers || this.getHeaders();
    
    // Eğer data FormData ise, Content-Type header'ını siliyoruz
    // Çünkü browser otomatik olarak boundary ile birlikte ekleyecek
    if (data instanceof FormData) {
      delete requestHeaders['Content-Type'];
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: requestHeaders,
      body: data instanceof FormData ? data : JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API isteği başarısız: ${response.status}`);
    }

    return response.json();
  }

  async put(endpoint, data, headers = null) {
    const requestHeaders = headers || this.getHeaders();
    
    // Eğer data FormData ise, Content-Type header'ını siliyoruz
    // Çünkü browser otomatik olarak boundary ile birlikte ekleyecek
    if (data instanceof FormData) {
      delete requestHeaders['Content-Type'];
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: requestHeaders,
      body: data instanceof FormData ? data : JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API isteği başarısız: ${response.status}`);
    }

    return response.json();
  }

  async delete(endpoint, headers = null) {
    const requestHeaders = headers || this.getHeaders();
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: requestHeaders,
    });

    if (!response.ok) {
      throw new Error(`API isteği başarısız: ${response.status}`);
    }

    //return response.json();
    // Response boş ise veya content-length 0 ise boş obje dön
    const contentLength = response.headers.get('content-length');
    if (contentLength === '0' || contentLength === null) {
      return {};
    }

    // Content varsa JSON olarak parse et
    const text = await response.text();
    return text ? JSON.parse(text) : {};
  } 

  async patch(endpoint, data, headers = null) {
    const requestHeaders = headers || this.getHeaders();
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: requestHeaders,
      body: data instanceof FormData ? data : JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API isteği başarısız: ${response.status}`);
    }

    return response.json();
  }
}

export const apiService = new ApiService();