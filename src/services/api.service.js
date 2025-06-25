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
      console.log(`Requesting: ${endpoint}`);
      const config = { headers };
      const response = await axiosInstance.patch(endpoint, data, config);
      return response.data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();