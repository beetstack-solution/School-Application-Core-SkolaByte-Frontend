import axios, { AxiosResponse } from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";
import api from "@/api/axiosInstance";



export interface NotificationFunctionalityData {
    _id: string;
    name: string;
    code: string;
    status: boolean;
    isDeleted: boolean;
    createdBy: string;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    __v: number;
}

export interface NotificationsResponse {
    success: boolean;
    message: string;
  notifications: NotificationFunctionalityData[];
}
export interface NotificationsResponse {
    success: boolean;
    message: string;
  notification: NotificationFunctionalityData;
}

export const fetchAllNotificationFunctionality = async (): Promise<NotificationsResponse> => {
const token = getAdminBearerToken();
if (!token) {
  throw new Error("Authentication token is missing");
}
try {
  const response: AxiosResponse<NotificationsResponse> = await api.get(
    `${API_BASE_URL}/lookups/notification-functionality/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-api-key": apikey,
        "x-app-version": appVersion,
      },
      withCredentials: true,
    }
  );    
   
  return response.data;

}
catch (error: any) {
  console.error(
    "Error fetching notification-functionality",
    error.response?.data || error.message
  );
  throw new Error(
    error.response?.data?.message || "Failed to fetch notification-functionality"
  );
}
};

export const createFunctionality =async (
    functionality: NotificationFunctionalityData
):Promise<NotificationsResponse> => {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    try {
      const response: AxiosResponse<NotificationsResponse> = await api.post(
        `${API_BASE_URL}/lookups/notification-functionality/`,
        functionality,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-api-key": apikey,
            "x-app-version": appVersion,
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error: any) {
      console.error(
        "Error creating notification-functionality",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Failed to create notification-functionality"
      );
    }
}

export const fetchFunctionalityById =async (id: string):Promise<NotificationsResponse> => {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    try {
      const response: AxiosResponse<NotificationsResponse> = await api.get(
        `${API_BASE_URL}/lookups/notification-functionality/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-api-key": apikey,
            "x-app-version": appVersion,
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error: any) {
      console.error(
        "Error fetching notification-functionality by ID",
          error.response?.data || error.message
      ); 
      throw new Error(
        error.response?.data?.message || "Failed to fetch notification-functionality by ID"
      );
    }
}

export const updateFunctionalityById =async (id: string, functionality: NotificationFunctionalityData):Promise<NotificationsResponse> => {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    try {
      const response: AxiosResponse<NotificationsResponse> = await api.put(
        `${API_BASE_URL}/lookups/notification-functionality/${id}`,
        functionality,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-api-key": apikey,
            "x-app-version": appVersion,
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error: any) {
      console.error(
        "Error updating notification-functionality by ID",
        error.response?.data || error.message
      );
      throw new Error(  
        error.response?.data?.message || "Failed to update notification-functionality by ID"
      );
    }
}

export const updateFunctionalityStatusById =async (id: string, status: boolean):Promise<NotificationsResponse> => {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    try {
      const response: AxiosResponse<NotificationsResponse> = await api.patch(
        `${API_BASE_URL}/lookups/notification-functionality/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-api-key": apikey,
            "x-app-version": appVersion,
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error: any) {
      console.error(    
        "Error updating notification-functionality status by ID",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Failed to update notification-functionality status by ID"
      );
    }
}

export const deleteNotificationFunctionality =async (id: string):Promise<NotificationsResponse> => {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    try {
      const response: AxiosResponse<NotificationsResponse> = await api.delete(
        `${API_BASE_URL}/lookups/notification-functionality/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-api-key": apikey,
            "x-app-version": appVersion,
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error: any) {
      console.error(
        "Error deleting notification-functionality",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Failed to delete notification-functionality"
      );
    }
}