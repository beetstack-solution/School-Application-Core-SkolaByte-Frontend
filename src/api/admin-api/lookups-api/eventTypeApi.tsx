import axios, { AxiosResponse } from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";
import api from "@/api/axiosInstance";


export interface EventTypeData {
  name: string;
  description: string;
  _id: string;
  status: boolean;
  isDeleted: boolean;
  createdBy: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  userUpdatedBy: {
    _id: string;
    name: string;
    email: string;
  };
  __v: number;
}

export interface EventTypeResponse {
  success: boolean;
  message: string;
  data: {
        data: EventTypeData[];
        total: number;
      };
}

export interface EventTypeDetailResponse {
 getData(data: any): unknown;
  success: boolean;
  message: string;
  data?: EventTypeData[];
}

export const createEventType = async (
    eventTypeData: EventTypeData
): Promise<EventTypeResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.post<EventTypeResponse>(
      "/lookups/event-type",
      eventTypeData,
      {
        withCredentials: true,
        headers: {
          "x-api-key": apikey,
          "x-app-version": appVersion,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "Error creating class",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to Event type");
  }
};

export const fetchEventTypes = async (
  page: number,
  limit: number
): Promise<{ eventTypeList: EventTypeData[]; total: number }> => {
  try {
    const token = await getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const params: any = { page, limit };

    const response = await api.get<EventTypeResponse>("/lookups/event-type", {
      params,
      headers: {
        "x-api-key": apikey,
        "x-app-version": appVersion,
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      eventTypeList: response.data.data.data,
      total: response.data.data.total,
    };
  } catch (error: any) {
    console.error(
      "Error fetching events",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch events"
    );
  }
};


export const fetchEventTypesById = async (
  Id: string
): Promise<EventTypeDetailResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.get<EventTypeDetailResponse>(
      `/lookups/event-type/${Id}`,
      {
        withCredentials: true,
        headers: {
          "x-api-key": apikey,
          "x-app-version": appVersion,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching class by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch Event type by ID"
    );
  }
};

export const updateEventTypeById = async (
  id: string,
  updatedData: Partial<EventTypeData>
): Promise<EventTypeDetailResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.put<any>(`/lookups/event-type/${id}`, updatedData, {
      withCredentials: true,
      headers: {
        "x-api-key": apikey,
        "x-app-version": appVersion,
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error(
      "Error updating class by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update Event type by ID"
    );
  }
};

export const deleteEventTypes = async (id: string): Promise<any> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.delete(`/lookups/event-type/${id}`, {
      withCredentials: true,
      headers: {
        "x-api-key": apikey,
        "x-app-version": appVersion,
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting class", error);
    throw error;
  }
};

// Update class status
export const updateEventTypeStatus = async (
  id: string,
  status: boolean
): Promise<any> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response: AxiosResponse<EventTypeDetailResponse> = await api.patch(
      `/lookups/event-type/${id}/status`,
      { status },
      {
        withCredentials: true,
        headers: {
          "x-api-key": apikey,
          "x-app-version": appVersion,
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error updating class status:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update Event type status"
    );
  }
};
