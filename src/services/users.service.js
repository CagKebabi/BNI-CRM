import { ENDPOINTS } from "../api/config";
import { apiService } from "./api.service";

class UsersService {
    async createNewUser(email, password, password2, first_name, last_name, gsm, group_id) {
        try {
            const data = {
                email: email, 
                password: password,
                password2: password2,
                first_name: first_name,
                last_name: last_name,
                gsm: gsm,
                group_id: group_id
            }
            const response = await apiService.post(ENDPOINTS.CREATE_USER, data);
            console.log("User created:", response);
            
            return response;
        } catch (error) {
            console.log("Login error:", error);
            throw error;
        }
    }
}

export const usersService = new UsersService();