import { ENDPOINTS } from "../api/config";
import { apiService } from "./api.service";

class GroupsStaticDatasService {
    async getGroupsStaticDatas(groupId) {
        try {
            const response = await apiService.get(ENDPOINTS.GET_GROUPS_STATIC_DATAS(groupId));
            console.log("Grup statik verileri alındı:", response);
            return response;
        } catch (error) {
            console.error("Grup statik verileri alınamadı:", error);
            throw error;
        }
    }
    async updateGroupsStaticDatas(id, groupId, data) {
        try {
            const response = await apiService.put(ENDPOINTS.UPDATE_GROUPS_STATIC_DATA(id), data);
            console.log("Grup statik verileri güncellendi:", response);
            return response;
        } catch (error) {
            console.error("Grup statik verileri güncellenemedi:", error);
            throw error;
        }
    }
}

export const groupsStaticDatasService = new GroupsStaticDatasService();