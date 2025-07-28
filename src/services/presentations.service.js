import { ENDPOINTS } from "../api/config";
import { apiService } from "./api.service";

class PresentationsService {
    async getPresentations(groupId) {
        try {
            const response = await apiService.get(ENDPOINTS.GET_PRESENTATIONS(groupId));
            console.log("Sunum listesi alındı:", response);
            return response;
        } catch (error) {
            console.error("Sunum listesi alınamadı:", error);
            throw error;
        }
    }

    async createPresentation(data) {
        try {
            const response = await apiService.post(ENDPOINTS.CREATE_PRESENTATION, data);
            console.log("Sunum oluşturuldu:", response);
            return response;
        } catch (error) {
            console.error("Sunum oluşturulurken hata oluştu:", error);
            throw error;
        }
    }

    async updatePresentation(id, data) {
        try {
            const response = await apiService.put(ENDPOINTS.UPDATE_PRESENTATION(id), data);
            console.log("Sunum güncellendi:", response);
            return response;
        } catch (error) {
            console.error("Sunum güncellenemedi:", error);
            throw error;
        }
    }

    async deletePresentation(id) {
        try {
            const response = await apiService.delete(ENDPOINTS.DELETE_PRESENTATION(id));
            console.log("Sunum silindi:", response);
            return response;
        } catch (error) {
            console.error("Sunum silinemedi:", error);
            throw error;
        }
    }
}

export const presentationsService = new PresentationsService();
