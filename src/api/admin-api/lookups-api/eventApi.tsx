import axios, { AxiosResponse } from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";
import api from "@/api/axiosInstance";
// Class Types

interface EventType {
  id: string;
  name: string;
}


export interface EventData {
  title: string;
  description: string;
  date: string;
  startTime?: string;
  endTime?: string;
  venue?: string;
  eventType: EventType | string;
  _id: string;
  status: boolean;
  isDeleted: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  userUpdatedBy: {
    _id: string;
    name: string;
    email: string;
  };
  __v: number;
}

export interface EventResponse {
  success: boolean;
  message: string;
  data: {
      data: EventData[];
      total: number;
    };
}

export interface EventDetailResponse {
 getData(data: any): unknown;
  success: boolean;
  message: string;
  data?: EventData[];
}
export interface SingleEventResponse {
    getData(data: any): unknown;
  success: boolean;
  message: string;
  data: {

    title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  eventType:{
    id:string;
    name:string;
  };
  };
}

export const createEvent = async (
  eventData: EventData
): Promise<EventResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.post<EventResponse>(
      "/lookups/event",
      eventData,
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
      "Error creating event",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to create event");
  }
};

export const fetchEvents = async (
    page = 0, 
    limit = 10, 
    search?: string
  ): Promise<{ eventList: EventData[]; total: number }> => {
    try {
      const token = await getAdminBearerToken();
      if (!token) {
        throw new Error("Authentication token is missing");
      }
  
      const params: any = { page: page + 1, limit };
      if (search) {
        params.search = search;
      }
  
      const response = await api.get<EventResponse>("/lookups/event", {
        params,
        headers: {
          "x-api-key": apikey,
          "x-app-version": appVersion,
          Authorization: `Bearer ${token}`,
        },
      });
  
      return {
        eventList: response.data.data.data,
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

export const fetchEventById = async (
  Id: string
): Promise<SingleEventResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.get<SingleEventResponse>(
      `/lookups/event/${Id}`,
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
      error.response?.data?.message || "Failed to fetch class by ID"
    );
  }
};

export const updateEventById = async (
  id: string,
  updatedData: Partial<EventData>
): Promise<EventDetailResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.put<any>(`/lookups/event/${id}`, updatedData, {
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
      error.response?.data?.message || "Failed to Event class by ID"
    );
  }
};

export const deleteEvent = async (id: string): Promise<any> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.delete(`/lookups/event/${id}`, {
      withCredentials: true,
      headers: {
        "x-api-key": apikey,
        "x-app-version": appVersion,
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting event", error);
    throw error;
  }
};


export const updateEventStatusById = async (
    id: string,
    status: boolean
  ): Promise<EventDetailResponse> => {
    try {
      const token = await getAdminBearerToken();
      if (!token) {
        throw new Error("Authentication token is missing");
      }
  
      const response = await api.patch(
        `/lookups/event/${id}/status`,
        { status, id },
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
        "Error updating event status",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Failed to update event status"
      );
    }
  };
