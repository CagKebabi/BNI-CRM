import { ENDPOINTS } from "../api/config";
import { apiService } from "./api.service";

class OpenCategoriesService {
    async getOpenCategories(groupId) {
        try {
            const response = await apiService.get(ENDPOINTS.GET_OPEN_CATEGORIES(groupId));
            console.log("Açık kategoriler alındı:", response);
            return response;
        } catch (error) {
            console.error("Açık kategoriler alınırken hata oluştu:", error);
            throw error;
        }
    }
    
    async createOpenCategory(id, data) {
        try {
            const response = await apiService.post(ENDPOINTS.CREATE_OPEN_CATEGORY(id), data);
            console.log("Açık kategori oluşturuldu:", response);
            return response;
        } catch (error) {
            console.error("Açık kategori oluşturulamadı:", error);
            throw error;
        }
    }

    async deleteOpenCategory(groupId, categoryId) {
        try {
            const response = await apiService.delete(ENDPOINTS.DELETE_OPEN_CATEGORY(groupId, categoryId));
            console.log("Açık kategori silindi:", response);
            return response;
        } catch (error) {
            console.error("Açık kategori silinemedi:", error);
            throw error;
        }
    }
}

export const openCategoriesService = new OpenCategoriesService();