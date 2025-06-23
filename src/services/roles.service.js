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
}

export const rolesService = new RolesService();
