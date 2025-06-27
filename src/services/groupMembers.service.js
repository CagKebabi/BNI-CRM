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

    async updateGroupMember(id, data) {
        try {
            const response = await apiService.put(ENDPOINTS.UPDATE_GROUP_MEMBER(id), data);
            console.log("Grup üyesi güncellendi:", response);
            return response;
        } catch (error) {
            console.error("Grup üyesi güncellenemedi:", error);
            throw error;
        }
    }
}

export const groupMembersService = new GroupMembersService();

