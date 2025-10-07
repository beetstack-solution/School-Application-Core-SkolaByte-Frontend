import axios, { AxiosResponse } from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";
import api from "@/api/axiosInstance";
// Class Types

export interface ClassData {
  code: string;
  name: string;
  displayName?: string;
  nameAlias?: string;
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

export interface ClassResponse {
  success: boolean;
  message: string;
  data: ClassData;
}

export interface ClassesDetailResponse {
 getData(data: any): unknown;
  success: boolean;
  message: string;
  data?: ClassData[];
}

export const createClass = async (
  classData: ClassData
): Promise<ClassResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.post<ClassResponse>(
      "/lookups/class",
      classData,
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
    throw new Error(error.response?.data?.message || "Failed to create class");
  }
};

export const fetchClasses = async (
  page: number,
  limit: number
): Promise<ClassesDetailResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.get<ClassesDetailResponse>("/lookups/class", {
      params: { page, limit },
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
      "Error fetching classes",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to fetch classes");
  }
};

export const fetchClassById = async (
  Id: string
): Promise<ClassesDetailResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.get<ClassesDetailResponse>(
      `/lookups/class/${Id}`,
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

export const updateClassById = async (
  id: string,
  updatedData: Partial<ClassData>
): Promise<ClassesDetailResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.put<any>(`/lookups/class/${id}`, updatedData, {
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
      error.response?.data?.message || "Failed to update class by ID"
    );
  }
};

export const deleteClass = async (id: string): Promise<any> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.delete(`/lookups/class/${id}`, {
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
export const updateClassStatus = async (
  id: string,
  status: boolean
): Promise<any> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response: AxiosResponse<ClassesDetailResponse> = await api.patch(
      `/lookups/class/${id}/status`,
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
      error.response?.data?.message || "Failed to update class status"
    );
  }
};
