import { ENDPOINTS } from "../api/config";
import { apiService } from "./api.service";

class UsersService {
    async getUsers() {
        try {
            const response = await apiService.get(ENDPOINTS.GET_USERS);
            console.log("Users fetched:", response);
            return response;
        } catch (error) {
            console.log("Error fetching users:", error);
            throw error;
        }
    }
    async createUser(data) {
        try {
            const response = await apiService.post(ENDPOINTS.CREATE_USER, data);
            console.log("User created:", response);
            
            return response;
        } catch (error) {
            console.log("Login error:", error);
            throw error;
        }
    }
    async updateUser(id, data) {
        try {
            const response = await apiService.patch(ENDPOINTS.UPDATE_USER(id), data);
            console.log("User updated:", response);
            return response;
        } catch (error) {
            console.log("Error updating user:", error);
            throw error;
        }
    }
    async deleteUser(userId) {
        try {
            const response = await apiService.delete(`${ENDPOINTS.DELETE_USER(userId)}`);
            console.log("User deleted:", response);
            return response;
        } catch (error) {
            console.log("Error deleting user:", error);
            throw error;
        }
    }
}

export const usersService = new UsersService();