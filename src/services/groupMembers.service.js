import { ENDPOINTS } from "../api/config";
import { apiService } from "./api.service";

class GroupMembersService {
    async addMemberToGroup(id, data) {
        try {
            const response = await apiService.post(ENDPOINTS.ADD_MEMBER_TO_GROUP(id), data);
            console.log("Grup üyesi eklendi:", response);
            return response;
        } catch (error) {
            console.error("Grup üyesi ekleneemedi:", error);
            throw error;
        }
    }
}

export const groupMembersService = new GroupMembersService();

