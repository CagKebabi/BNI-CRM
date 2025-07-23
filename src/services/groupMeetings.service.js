import { ENDPOINTS } from "../api/config";
import { apiService } from "./api.service";

class GroupMeetingsService {
    async getGroupMeetings(groupId) {
        try {
            const response = await apiService.get(ENDPOINTS.GET_GROUP_MEETINGS(groupId));
            console.log("Grup toplantıları alındı:", response);
            return response;
        } catch (error) {
            console.error("Grup toplantıları alınırken hata oluştu:", error);
            throw error;
        }
    }
}

export const groupMeetingsService = new GroupMeetingsService();
