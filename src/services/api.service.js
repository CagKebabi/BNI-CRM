import axiosInstance from '../api/axios';

class ApiService {
  async get(endpoint, headers = null) {
    try {
      console.log(`Requesting: ${endpoint}`);
      const response = await axiosInstance.get(endpoint, { headers });
      return response.data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  async post(endpoint, data, headers = null) {
    try {
      console.log(`Requesting: ${endpoint}`);
      const config = { headers };
      const response = await axiosInstance.post(endpoint, data, config);
      return response.data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  async put(endpoint, data, headers = null) {
    try {
      console.log(`Requesting: ${endpoint}`);
      const config = { headers };
      const response = await axiosInstance.put(endpoint, data, config);
      return response.data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  async delete(endpoint, headers = null) {
    try {
      console.log(`Requesting: ${endpoint}`);
      const response = await axiosInstance.delete(endpoint, { headers });
      return response.data;
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