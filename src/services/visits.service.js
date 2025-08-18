import { ENDPOINTS } from "../api/config";
import { apiService } from "./api.service";

class VisitsService {
  async getVisits(id) {
    try {
      const response = await apiService.get(ENDPOINTS.GET_VISITS(id));
      console.log("Ziyaret Listesi Alındı:", response);
      return response;
    } catch (error) {
      console.log("Ziyaret Listesi Alınamadı:", error);
      throw error;
    }
  }

  async createVisit(data) {
    try {
      const response = await apiService.post(ENDPOINTS.CREATE_VISIT, data);
      console.log("Ziyaret oluşturuldu:", response);
      return response;
    } catch (error) {
      console.log("Ziyaret oluşturma hatası:", error);
      throw error;
    }
  }

  async createVisitorNote(data) {
    try {
      const response = await apiService.post(
        ENDPOINTS.CREATE_VISITOR_NOTE,
        data
      );
      console.log("Ziyaret notu oluşturuldu:", response);
      return response;
    } catch (error) {
      console.log("Ziyaret notu oluşturma hatası:", error);
      throw error;
    }
  }

  async updateVisit(id, data) {
    try {
      const response = await apiService.patch(ENDPOINTS.UPDATE_VISIT(id), data);
      console.log("Ziyaret güncellendi:", response);
      return response;
    } catch (error) {
      console.log("Ziyaret güncelleme hatası:", error);
      throw error;
    }
  }

  async deleteVisit(id) {
    try {
      const response = await apiService.delete(ENDPOINTS.DELETE_VISIT(id));
      console.log("Ziyaret silindi:", response);
      return response;
    } catch (error) {
      console.log("Ziyaret silme hatası:", error);
      throw error;
    }
  }
}

export const visitsService = new VisitsService();
