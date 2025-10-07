import axios, { AxiosResponse } from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";
import api from "@/api/axiosInstance";

export interface DdModuleData {
  _id: string;
  name: string;
  code: string;
  nameAlias: string;
  status: boolean;
  isDeleted: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  userUpdatedBy?: string;
  userUpdatedDate?: string;
}

export interface GetDdModulesApiResponse {
  success: boolean;
  message?: string;
  modules: DdModuleData[];
}

export interface GetByIdTriggerModuleData {
  _id: string;
  name: string;
  code: string;
}

export interface GetByIdTriggerModuleApiResponse {
  success: boolean;
  message?: string;
  triggerEvents?: GetByIdTriggerModuleData[];
}
export interface SmartTag {
  _id: string;
  name: string;
  code: string;
}
export interface GetByIdSmartTagModuleData {
  smartTags: SmartTag;
  messageTemplate: string;
}
export interface GetByIdSmartTagModuleApiResponse {
  success: boolean;
  message?: string;
  smartTags?: GetByIdSmartTagModuleData[];
}
export interface AddNotificationInput {
  module: string;
  triggerEvent: string;
  notificationTemplateContent: string;
  notificationtype: string;
  days: string;
  messageType: string;
  laterNotificationTimeInHour: string;
  notificationTemplate: string;
  emailTemplate: string;
  messageTemplate: string;
  sendTo: string;
}
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
export interface NotificationData {
  _id: string;
  code: string;
  module: Module;
  triggerEvent: TriggerEvent;
  notificationTemplateContent: string;
  notificationtype: string;
  notificationtPeriod: string;
  days: string;
  messageType: string;
  laterNotificationTimeInHour: string;
  status: boolean;
  isDeleted: boolean;
  createdBy: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface NotificationResponse {
  success: boolean;
  message?: string;
  error?: string;
  notifications: NotificationData[];
}
export const fetchTriggerEventsByModule = async (id: string): Promise<GetByIdTriggerModuleApiResponse> => {
  const token = getAdminBearerToken();
  if (!token) {
    throw new Error("Authorization token not found");
  }

  try {
    const response: AxiosResponse<GetByIdTriggerModuleApiResponse> = await api.get<GetByIdTriggerModuleApiResponse>(
      `${API_BASE_URL}/lookups/notification-template/trigger-events/module/${id}`,
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
      "Error fetching trigger events by module",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message ||
      "Failed to fetch trigger events by module"
    );
  }
};

export const fetchSmartTagsByModuleAndTriggerEvent = async (
  moduleId: string,
  triggerEventId: string
): Promise<GetByIdSmartTagModuleApiResponse> => {
  const token = getAdminBearerToken();
  console.log("token", token);
  if (!token) {
    throw new Error("Authentication token is missing");
  } try {
    const response = await api.get<GetByIdSmartTagModuleApiResponse>(
      `${API_BASE_URL}/lookups/notification-template/smart-tags/${moduleId}/${triggerEventId}`,
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
      "Error fetching smart tags by module and trigger event",
    )
    throw new Error(
      error.response?.data?.message ||
      "Failed to fetch smart tags by module and trigger event"
    );
  }
};


export const createNotificationTemplateData = async (addData: AddNotificationInput): Promise<NotificationResponse> => {
  const token = getAdminBearerToken();
  console.log("token", token);
  if (!token) {
    throw new Error("Authentication token is missing");
  }
  try {
    const response: AxiosResponse<NotificationResponse> = await api.post(
      `${API_BASE_URL}/lookups/notification/`,
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
      "Error creating notification-notification",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to create notification-notification"
    );
  }
}

export const fetchNotificationData = async (): Promise<NotificationResponse> => {
  const token = getAdminBearerToken();
  console.log("token", token);
  if (!token) {
    throw new Error("Authentication token is missing");
  }
  try {
    const response: AxiosResponse<any> = await api.get(
      `${API_BASE_URL}/lookups/notification/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-api-key": apikey,
          "x-app-version": appVersion,
        },
        withCredentials: true,
      }
    );
    return response.data.notifications;
  } catch (error: any) {
    console.error(
      "Error fetching notification-notification",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch notification-notification"
    )
  }
}

export const deleteNotificationTemplate = async (_id: string): Promise<NotificationResponse> => {
  const token = getAdminBearerToken();
  console.log("token", token);
  if (!token) {
    throw new Error("Authentication token is missing");
  }
  try {
    const response: AxiosResponse<NotificationResponse> = await api.delete(
      `${API_BASE_URL}/lookups/notification/${_id}`,
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
      "Error deleting notification-notification by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message ||
      "Failed to delete notification-notification by ID"
    );
  }
}

export const updateNotificationStatus = async (_id: string, status: boolean): Promise<NotificationResponse> => {
  const token = getAdminBearerToken();
  console.log("token", token);
  if (!token) {
    throw new Error("Authentication token is missing");
  }
  try {
    const response: AxiosResponse<NotificationResponse> = await api.patch(
      `${API_BASE_URL}/lookups/notification/${_id}/status`,
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
      "Error updating notification-notification status",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message ||
      "Failed to update notification-notification status"
    );
  }
}

export const fetchNotificationById = async (id: string): Promise<any> => {
  const token = getAdminBearerToken();
  console.log("token", token);
  if (!token) {
    throw new Error("Authentication token is missing");
  }
  try {
    const response = await api.get<any>(
      `${API_BASE_URL}/lookups/notification/${id}`,
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
      "Error fetching notification-notification by ID",
      error.response?.data || error.message
    );                            
    throw new Error(
      error.response?.data?.message ||
      "Failed to fetch notification-notification by ID"
    );
  }
}

export const updateNotificationById = async (id: string, data: any): Promise<any> => {
  const token = getAdminBearerToken();
  console.log("token", token);
  if (!token) {
    throw new Error("Authentication token is missing");
  }
  try {
    const response = await api.put<any>(
      `${API_BASE_URL}/lookups/notification/${id}`,
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
      "Error updating notification-notification by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message ||
      "Failed to update notification-notification by ID"
    );
  }
}