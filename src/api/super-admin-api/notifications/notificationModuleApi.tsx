import axios, { AxiosResponse } from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";
import api from "@/api/axiosInstance";

export interface Module {
    _id: string;
    name: string;
    code: string;
    nameAlias: string;
    status: boolean;
    isDeleted: boolean;
    createdBy: {
      _id: string;
      name: string;
    };
    createdAt: string; // or `Date` if you plan to parse it
    updatedAt: string; // or `Date` if you plan to parse it
    __v: number;
  }
  
  export interface ModulesResponse {
    success: boolean;
    message?: string;
    modules: Module[];
  }
  
  export interface ModulesResponse {
    success: boolean;
    message?: string;
    module: Module;
  }
  

export const fetchAllNotificationModule = async (): Promise<ModulesResponse> => {
    try {
        const response: AxiosResponse = await api.get(`${API_BASE_URL}/lookups/notification-module/`, {
            headers: {
                apikey: apikey,
                appVersion: appVersion,
                Authorization: getAdminBearerToken(),
            },
        });
        return response.data;
    } catch (error: any) {
        console.error("Error fetching notification-module", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to fetch notification-module");
    }
}

export const createModule = async (data: ModulesResponse): Promise<ModulesResponse> => {
    try {
        const response: AxiosResponse = await api.post(`${API_BASE_URL}/lookups/notification-module/`, data, {
            headers: {
                apikey: apikey,
                appVersion: appVersion,
                Authorization: getAdminBearerToken(),
            },
        });
        return response.data;
    } catch (error: any) {
        console.error("Error creating notification-module", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to create notification-module");
    }
}

export const fetchModuleById = async (id: string): Promise<ModulesResponse> => {
    try {
        const response: AxiosResponse = await api.get(`${API_BASE_URL}/lookups/notification-module/${id}`, {
            headers: {
                apikey: apikey,
                appVersion: appVersion,
                Authorization: getAdminBearerToken(),
            },
        });
        return response.data;
    } catch (error: any) {
        console.error("Error fetching notification-module by ID", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to fetch notification-module by ID");
    }   
}


export const updateModuleById = async (id: string, data: ModulesResponse): Promise<ModulesResponse> => {
    try {
        const response: AxiosResponse = await api.put(`${API_BASE_URL}/lookups/notification-module/${id}`, data, {
            headers: {
                apikey: apikey,
                appVersion: appVersion,
                Authorization: getAdminBearerToken(),
            },
        });
        return response.data;
    } catch (error: any) {
        console.error("Error updating notification-module by ID", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to update notification-module by ID");
    }
}

export const updateModuleStatusById = async (id: string, status: boolean): Promise<ModulesResponse> => {
    try {
        const response: AxiosResponse = await api.patch(`${API_BASE_URL}/lookups/notification-module/${id}/status`, { status }, {
            headers: {
                apikey: apikey,
                appVersion: appVersion,
                Authorization: getAdminBearerToken(),
            },
        });
        return response.data;
    } catch (error: any) {
        console.error("Error updating notification-module status by ID", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to update notification-module status by ID");
    }
}

export const deleteNotificationModuleTemplate = async (id: string): Promise<ModulesResponse> => {
    try {
        const response: AxiosResponse = await api.delete(`${API_BASE_URL}/lookups/notification-module/${id}`, {
            headers: {
                apikey: apikey,
                appVersion: appVersion,
                Authorization: getAdminBearerToken(),
            },
        });
        return response.data;
    } catch (error: any) {
        console.error("Error deleting notification-module by ID", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to delete notification-module by ID");
    }
}