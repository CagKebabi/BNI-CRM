import { ENDPOINTS } from "../api/config";
import { apiService } from "./api.service";

class UsersService {
    async createNewUser(email, password, role) {
        try {
            const response = await apiService.post(ENDPOINTS.CREATE_USER, { email, password });
            return response;
        } catch (error) {
            console.log("Login error:", error);
            throw error;
        }
    }
}