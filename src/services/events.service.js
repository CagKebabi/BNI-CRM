import { ENDPOINTS } from "../api/config";
import { apiService } from "./api.service";

class EventsService {
    async getEvents(groupId) {
        try {
            const response = await apiService.get(ENDPOINTS.GET_EVENTS(groupId));
            console.log("Events fetched:", response);
            return response;
        } catch (error) {
            console.log("Events fetch error:", error);
            throw error;
        }
    }
    async createEvent(data) {
        try {
            const response = await apiService.post(ENDPOINTS.CREATE_EVENT, data);
            console.log("Event created:", response);
            return response;
        }
        catch (error) {
            console.log("Event creation error:", error);
            throw error;
        }
    }
    async updateEvent(id, data) {
        try {
            const response = await apiService.put(ENDPOINTS.UPDATE_EVENT(id), data);
            console.log("Event updated:", response);
            return response;
        }
        catch (error) {
            console.log("Event update error:", error);
            throw error;
        }
    }
    async deleteEvent(id) {
        try {
            const response = await apiService.delete(ENDPOINTS.DELETE_EVENT(id));
            console.log("Event deleted:", response);
            return response;
        }
        catch (error) {
            console.log("Event deletion error:", error);
            throw error;
        }
    }
}

export const eventsService = new EventsService();