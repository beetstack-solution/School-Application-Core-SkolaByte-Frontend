import axios, { AxiosResponse } from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";
import api from "@/api/axiosInstance";


export interface Module {
    _id: string;
    name: string;
  }
  
  export interface TriggerEvent {
    _id: string;
    name: string;
  }
  
  export interface SmartTags {
    _id: string;
    name: string;
  }
  
  export interface NotificationTemplateData {
    _id: string;
    code: string;
    module: Module;
    triggerEvent: TriggerEvent;
    smartTags: SmartTags;
    messageTemplate: string;
    emailTemplate: string;
    type: string;
    status: boolean;
    isDeleted: boolean;
    createdBy: string;
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
  
  export interface NotificationTemplateResponse {
    success: boolean;
    message?: string;
    notificationTemplates: NotificationTemplateData[];
  }
  export interface NotificationTemplateResponse {
    success: boolean;
    message?: string;
    notificationTemplate: NotificationTemplateData;
  }
  export interface AddNotificationTemplateInput {
    module: string;
    triggerEvent: string;
    nameTemplate: string;
    subjectTemplate: string;
    // smartTags: string;
    messageTemplate: string;
    emailTemplate: string;
    notificationTemplate: string;
    type: string;
  }

  export const createNotificationTemplateData = async (addData: AddNotificationTemplateInput): Promise<NotificationTemplateResponse> => {
    const token = getAdminBearerToken();
    console.log("token", token);
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    try {
      const response: AxiosResponse<NotificationTemplateResponse> = await api.post(
        `${API_BASE_URL}/lookups/notification-template/`,
        addData,
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
        "Error creating notification-template",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Failed to create notification-template"
      );
      }
  }

  export const fetchNotificationTemplateData = async (): Promise<NotificationTemplateResponse> => {
    const token = getAdminBearerToken();
    console.log("token", token);
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    try {
      const response: AxiosResponse<NotificationTemplateResponse> = await api.get(
        `${API_BASE_URL}/lookups/notification-template/`,
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
        "Error fetching notification-template",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Failed to fetch notification-template"
      );
    }
  }

  export const updateNotificationTemplateStatus = async (_id: string, status: boolean): Promise<NotificationTemplateResponse> => {
    const token = getAdminBearerToken();
    console.log("token", token);
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    try {
      const response: AxiosResponse<NotificationTemplateResponse> = await api.patch(
        `${API_BASE_URL}/lookups/notification-template/${_id}/status`,
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
        "Error updating notification-template status",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message ||
          "Failed to update notification-template status"
      );
    }
  }

  export const deleteNotificationTemplate = async (_id: string): Promise<NotificationTemplateResponse> => {
    const token = getAdminBearerToken();
    console.log("token", token);
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    try {                                                    
      const response: AxiosResponse<NotificationTemplateResponse> = await api.delete(
        `${API_BASE_URL}/lookups/notification-template/${_id}`,
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
        "Error deleting notification-template by ID",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message ||
          "Failed to delete notification-template by ID"
      );
      }
  }

  export const fetchTemplateById = async (_id: string): Promise<NotificationTemplateResponse> => {
    const token = getAdminBearerToken();
    console.log("token", token);
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    try {
      const response: AxiosResponse<NotificationTemplateResponse> = await api.get(
        `${API_BASE_URL}/lookups/notification-template/${_id}`,
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
            "Error fetching notification-template:",
            error.response?.data || error.message
          );
          throw new Error(
            error.response?.data?.message || "Failed to fetch notification-template!"
          );
    }
  }

  export const updateTemplateById = async (_id: string, updateData: any): Promise<NotificationTemplateResponse> => {
    const token = getAdminBearerToken();
    console.log("token", token);
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    try {
      const response: AxiosResponse<NotificationTemplateResponse> = await api.put(
        `${API_BASE_URL}/lookups/notification-template/${_id}`,
        updateData,
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
        "Error updating notification-template by ID",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message ||
          "Failed to update notification-template by ID"
      );
    }
  }