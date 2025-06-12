import { API_BASE_URL, DEFAULT_HEADERS } from '../api/config';

class ApiService {
  getHeaders() {
    const headers = { ...DEFAULT_HEADERS };
    const token = localStorage.getItem('access');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async get(endpoint, headers = null) {
    try {
      console.log(`Requesting: ${API_BASE_URL}${endpoint}`);
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: headers || this.getHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        console.error(`API request failed: ${response.status}`);
        throw new Error(`API isteği başarısız: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  async post(endpoint, data, headers = null) {
    try {
      console.log(`Requesting: ${API_BASE_URL}${endpoint}`);
      
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
        credentials: 'include',
      });

      if (!response.ok) {
        console.error(`API request failed: ${response.status}`);
        throw new Error(`API isteği başarısız: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  async put(endpoint, data, headers = null) {
    try {
      console.log(`Requesting PUT: ${API_BASE_URL}${endpoint}`);
      
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
        credentials: 'include',
      });

      if (!response.ok) {
        console.error(`API request failed: ${response.status}`);
        throw new Error(`API isteği başarısız: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  async delete(endpoint, headers = null) {
    try {
      console.log(`Requesting DELETE: ${API_BASE_URL}${endpoint}`);
      
      const requestHeaders = headers || this.getHeaders();
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: requestHeaders,
        credentials: 'include',
      });

      if (!response.ok) {
        console.error(`API request failed: ${response.status}`);
        throw new Error(`API isteği başarısız: ${response.status}`);
      }

      // Response boş ise veya content-length 0 ise boş obje dön
      const contentLength = response.headers.get('content-length');
      if (contentLength === '0' || contentLength === null) {
        return {};
      }

      // Content varsa JSON olarak parse et
      const text = await response.text();
      return text ? JSON.parse(text) : {};
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  } 

  async patch(endpoint, data, headers = null) {
    try {
      console.log(`Requesting PATCH: ${API_BASE_URL}${endpoint}`);
      
      const requestHeaders = headers || this.getHeaders();
      
      // Eğer data FormData ise, Content-Type header'ını siliyoruz
      if (data instanceof FormData) {
        delete requestHeaders['Content-Type'];
      }
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PATCH',
        headers: requestHeaders,
        body: data instanceof FormData ? data : JSON.stringify(data),
        credentials: 'include',
      });

      if (!response.ok) {
        console.error(`API request failed: ${response.status}`);
        throw new Error(`API isteği başarısız: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();