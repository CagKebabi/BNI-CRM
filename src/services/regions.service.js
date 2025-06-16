import { ENDPOINTS } from "../api/config";
import { apiService } from "./api.service";

class RegionsService {
    async getRegions() {
        try {
            const response = await apiService.get(ENDPOINTS.REGIONS);
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
    async deleteRegion(id) {
        try {
            const response = await apiService.delete(ENDPOINTS.DELETE_REGION(id));
            console.log("Bölge silindi:", response);
            return response;
        } catch (error) {
            console.error("Bölge silinemedi:", error);
            throw error;
        }
    }
    async updateRegion(id, data) {
        try {
            const response = await apiService.put(ENDPOINTS.UPDATE_REGION(id), data);
            console.log("Bölge güncellendi:", response);
            return response;
        } catch (error) {
            console.error("Bölge güncellenemedi:", error);
            throw error;
        }
    }
}

export const regionsService = new RegionsService();
