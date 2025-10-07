import axios, { AxiosResponse } from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";
import api from "@/api/axiosInstance";

export interface TimeSlotResponse {
  success: boolean;
  message: string;
  data: {
    data: TimeSlot[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface TimeSlot {
  _id: string;
  startTime: string; // Format: "HH:mm"
  endTime: string;   // Format: "HH:mm"
  isBreak: Boolean;   // Format: "HH:mm"
  createdBy: User;
  createdAt: string; // ISO timestamp
  updatedBy: Partial<User>;
}

export interface User {
  name: string;
  email: string;
}


export const getTimeSlots = async (page: number, limit: number): Promise<TimeSlotResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response: AxiosResponse<TimeSlotResponse> = await api.get(`/lookups/time-slot`, {
      params: { page, limit },
      withCredentials: true,
      headers: {
        "x-api-key": apikey,
        "x-app-version": appVersion,
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getTimeSlotById = async (id: string): Promise<TimeSlot> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response: AxiosResponse<TimeSlot> = await api.get(`/lookups/time-slot/${id}`, {
      withCredentials: true,
      headers: {
        "x-api-key": apikey,
        "x-app-version": appVersion,
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const createTimeSlot = async (timeSlot: TimeSlot): Promise<TimeSlot> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response: AxiosResponse<TimeSlot> = await api.post(`/lookups/time-slot`, timeSlot, {
      withCredentials: true,
      headers: {
        "x-api-key": apikey,
        "x-app-version": appVersion,
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateTimeSlot = async (id: string, timeSlot: TimeSlot): Promise<TimeSlot> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response: AxiosResponse<TimeSlot> = await api.put(`/lookups/time-slot/${id}`, timeSlot, {
      withCredentials: true,
      headers: {
        "x-api-key": apikey,
        "x-app-version": appVersion,
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTimeSlot = async (id: string): Promise<void> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
 const response =   await api.delete(`/lookups/time-slot/${id}`, {
      withCredentials: true,
      headers: {
        "x-api-key": apikey,
        "x-app-version": appVersion,
        Authorization: `Bearer ${token}`,
      },
    });
     return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateTimeSlotStatus = async (id: string, status: boolean): Promise<TimeSlot> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response: AxiosResponse<TimeSlot> = await api.patch(`/lookups/time-slot/${id}/status`, { status }, {
      withCredentials: true,
      headers: {
        "x-api-key": apikey,
        "x-app-version": appVersion,
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};


