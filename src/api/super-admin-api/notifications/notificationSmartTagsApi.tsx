import axios, { AxiosResponse } from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";
import api from "@/api/axiosInstance";


export interface Notification {
  _id: string;
  name: string;
  code: string;
  status: boolean;
  isDeleted: boolean;
  createdBy: {
    _id: string;
    name: string;
  };
    createdAt: string;  // You can change this to Date if you parse it
  updatedAt: string;  // Same here
  __v: number;
}

export interface NotificationResponse {
  success: boolean;
  notifications: Notification[];
}
export interface NotificationResponse {
  success: boolean;
  notification: Notification;
}

export const fetchAllNotificationSmartTags = async (): Promise<NotificationResponse> => {
  const token = getAdminBearerToken();
  console.log("token", token);
  if (!token) {
    throw new Error("Authentication token is missing");
  } try {
    const response: AxiosResponse<NotificationResponse> = await api.get(
      `${API_BASE_URL}/lookups/notification-smart-tag/`,
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
      "Error fetching notification-smart-tags",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch notification-smart-tags"
    );
  }
};

export const createSmartTag = async (data: any): Promise<any> => {
  const token = getAdminBearerToken();
  console.log("token", token);
  if (!token) {
    throw new Error("Authentication token is missing");
  } try {
    const response: AxiosResponse<any> = await api.post(
      `${API_BASE_URL}/lookups/notification-smart-tag/`,
      data,
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
      "Error creating notification-smart-tags",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to create notification-smart-tags"
    );
  }
};

export const fetchSmartById = async (id: string): Promise<any> => {
  const token = getAdminBearerToken();
  console.log("token", token);
  if (!token) {
    throw new Error("Authentication token is missing");
  } try {
    const response: AxiosResponse<any> = await api.get(
      `${API_BASE_URL}/lookups/notification-smart-tag/${id}`,
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
      "Error fetching notification-smart-tag by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message ||
        "Failed to fetch notification-smart-tag by ID"
    );
  }
};

export const updateSmartTagById = async (id: string, data: any): Promise<any> => {
  const token = getAdminBearerToken();
  console.log("token", token);
  if (!token) {
    throw new Error("Authentication token is missing");
  } try {
    const response: AxiosResponse<any> = await api.put(
      `${API_BASE_URL}/lookups/notification-smart-tag/${id}`,
      data,
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
      "Error updating notification-smart-tag by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message ||
        "Failed to update notification-smart-tag by ID"
    );
  }
};

export const updateSmartTagStatusById = async (id: string, status: boolean): Promise<any> => {
  const token = getAdminBearerToken();
  console.log("token", token);
  if (!token) {
    throw new Error("Authentication token is missing");
  } try {
    const response: AxiosResponse<any> = await api.patch(
      `${API_BASE_URL}/lookups/notification-smart-tag/${id}/status`,
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
      "Error updating notification-smart-tag status by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message ||
        "Failed to update notification-smart-tag status by ID"
    );
  }
};

export const deleteNotificationSmartTag = async (id: string): Promise<any> => {
  const token = getAdminBearerToken();
  console.log("token", token);
  if (!token) {
    throw new Error("Authentication token is missing");
  } try {
    const response: AxiosResponse<any> = await api.delete(
      `${API_BASE_URL}/lookups/notification-smart-tag/${id}`,
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
      "Error deleting notification-smart-tag by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message ||
        "Failed to delete notification-smart-tag by ID"
    );
  }
};
