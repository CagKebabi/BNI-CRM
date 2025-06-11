import { ENDPOINTS } from "../api/config";
import { apiService } from "./api.service";

class AuthService {
    async login(email, password) {
        try {
            const response = await apiService.post(ENDPOINTS.LOGIN, { email, password });

            if (response.access) {
                localStorage.setItem('access', response.access);
                localStorage.setItem('refresh', response.refresh);
                localStorage.setItem('user', response.email);
                localStorage.setItem('is_superuser', response.is_superuser);
                localStorage.setItem('user_id', response.user_id);
              }

            return response;
        } catch (error) {
            console.log("Login error:", error);
            throw error;
        }
    }

    async logout() {
        try {
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            localStorage.removeItem('user');
            localStorage.removeItem('is_superuser');
            localStorage.removeItem('user_id');
        } catch (error) {
            console.log("Logout error:", error);
            throw error;
        }
    }
}

export const authService = new AuthService();
