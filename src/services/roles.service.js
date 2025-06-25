import { ENDPOINTS } from "../api/config";
import { apiService } from "./api.service";

class RolesService {
    async getRoles() {
        try {
            const response = await apiService.get(ENDPOINTS.GET_ROLES);
            console.log("Rol Listesi Alındı:", response);
            return response;
        } catch (error) {
            console.log("Rol Listesi Alınamadı:", error);
            throw error;
        }
    }
    async createRole(data) {
        try {
            const response = await apiService.post(ENDPOINTS.CREATE_ROLE, data);
            console.log("Rol oluşturuldu:", response);
            
            return response;
        } catch (error) {
            console.log("Rol oluşturma hatası:", error);
            throw error;
        }
    }
    async updateRole(id, data) {
        try {
            const response = await apiService.patch(ENDPOINTS.UPDATE_ROLE(id), data);
            console.log("Rol güncellendi:", response);
            
            return response;
        } catch (error) {
            console.log("Rol güncelleme hatası:", error);
            throw error;
        }
    }
    async deleteRole(id) {
        try {
            const response = await apiService.delete(ENDPOINTS.DELETE_ROLE(id));
            console.log("Rol silindi:", response);
            return response;
        } catch (error) {
            console.log("Rol silme hatası:", error);
            throw error;
        }
    }
}

export const rolesService = new RolesService();
