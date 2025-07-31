import { ENDPOINTS } from "../api/config";
import { apiService } from "./api.service";

class GroupMembersService {
    async getGroupMembers(id) {
        try {
            const response = await apiService.get(ENDPOINTS.GET_GROUP_MEMBERS(id));
            console.log("Grup üyeleri alındı:", response);
            return response;
        } catch (error) {
            console.error("Grup üyeleri alınamadı:", error);
            throw error;
        }
    }
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
    async deleteGroupMemberRole(id, data) {
        console.log("endpoint: ", ENDPOINTS.DELETE_MEMBER_ROLE(id));
        console.log("data: ", data);
        
        try {
            const response = await apiService.deleteWithData(ENDPOINTS.DELETE_MEMBER_ROLE(id), data);
            console.log("Grup üyesi rolü silindi:", response);
            return response;
        } catch (error) {
            console.error("Grup üyesi rolü silinemedi:", error);
            throw error;
        }
    }
}

export const groupMembersService = new GroupMembersService();

