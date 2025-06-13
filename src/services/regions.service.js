import { ENDPOINTS } from "../api/config";
import { apiService } from "./api.service";

class RegionsService {
    async getRegions() {
        try {
            const token = localStorage.getItem('access');

            console.log("Token:", token);
      
            const headers = {
                'Authorization': `Bearer ${token}`
            };
            const response = await apiService.get(ENDPOINTS.REGIONS, headers);
            console.log("Bölge listesi alındı:", response);
            return response;
        } catch (error) {
            console.error("Bölge listesi alınamadı:", error);
            throw error;
        }
    }
    async createRegion(data) {
        try {
            const response = await apiService.post(ENDPOINTS.CREATE_REGION, data);
            console.log("Bölge oluşturuldu:", response);
            
            return response;
        } catch (error) {
            console.log("Bölge oluşturma hatası:", error);
            throw error;
        }
    }
}

export const regionsService = new RegionsService();
