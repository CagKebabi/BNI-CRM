import { ENDPOINTS } from "../api/config";
import { apiService } from "./api.service";

class GroupsService {
    async getGroups() {
        try {
            const response = await apiService.get(ENDPOINTS.GROUPS);
            console.log("Grup listesi alındı:", response);
            return response;
        } catch (error) {
            console.error("Grup listesi alınamadı:", error);
            throw error;
        }
    }
    async createGroup(data) {
        try {
            const response = await apiService.post(ENDPOINTS.CREATE_GROUP, data);
            console.log("Grup oluşturuldu:", response);
            return response;
        } catch (error) {
            console.error("Grup oluşturulamadı:", error);
            throw error;
        }
    }
    async updateGroup(id, data) {
        try {
            const response = await apiService.put(ENDPOINTS.UPDATE_GROUP(id), data);
            console.log("Grup güncellendi:", response);
            return response;
        } catch (error) {
            console.error("Grup güncellenemedi:", error);
            throw error;
        }
    }
    async deleteGroup(id) {
        try {
            const response = await apiService.delete(ENDPOINTS.DELETE_GROUP(id));
            console.log("Grup silindi:", response);
            return response;
        } catch (error) {
            console.error("Grup silinemedi:", error);
            throw error;
        }
    }
}

export const groupsService = new GroupsService();