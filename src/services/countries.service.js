import { ENDPOINTS } from "../api/config";
import { apiService } from "./api.service";

class CountriesService {
    async getCountries() {
        try {
            // const token = localStorage.getItem('access');

            // console.log("Token:", token);
      
            // const headers = {
            //     'Authorization': `Bearer ${token}`
            // };
            const response = await apiService.get(ENDPOINTS.COUNTRIES);
            console.log("Ülke listesi alındı:", response);
            return response;
        } catch (error) {
            console.error("Ülke listesi alınamadı:", error);
            throw error;
        }
    }
    async createCountry(data) {
        try {
            const response = await apiService.post(ENDPOINTS.COUNTRIES, data);
            console.log("Ülke başarıyla eklendi:", response);
            return response;
        } catch (error) {
            console.error("Ülke ekleme hatası:", error);
            throw error;
        }
    }
    async updateCountry(id, data) {
        try {
            const response = await apiService.put(ENDPOINTS.UPDATE_COUNTRY(id), data);
            console.log("Ülke başarıyla güncellendi:", response);
            return response;
        } catch (error) {
            console.error("Ülke güncelleme hatası:", error);
            throw error;
        }
    }
    async deleteCountry(id) {
        try {
            const response = await apiService.delete(ENDPOINTS.DELETE_COUNTRY(id));
            console.log("Ülke başarıyla silindi:", response);
            return response;
        } catch (error) {
            console.error("Ülke silme hatası:", error);
            throw error;
        }
    }
}

export const countriesService = new CountriesService();
