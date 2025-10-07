import axios, { AxiosResponse } from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";
import api from "@/api/axiosInstance";


interface DesignationResponse {
  success: boolean;
  message: string;
  data: {
    data: Designation[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface Designation {
  _id: string;
  name: string;
  code: string;
  status: boolean;
  createdBy: User;
  createdAt: string; // ISO date string
  updatedBy: Partial<User>;
}

interface User {
  name: string;
  email: string;
}


export const getDesignations = async (
  page: number,
  limit: number
): Promise<DesignationResponse> => {
  try {
    const response: AxiosResponse<DesignationResponse> = await api.get(
      `lookups/designation/`,
      {
        params: {
          page: page,
          limit: limit,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching Designations", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch Designations");
  }
};

export const createDesignation = async (
  designation: Designation
): Promise<DesignationResponse> => {
  try {
    const response: AxiosResponse<DesignationResponse> = await api.post(
      `lookups/designation/`,
      designation,
      {
        headers: {
          "x-api-key": apikey,
          "x-app-version": appVersion,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error creating Designation", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to create Designation");
  }
};

export const updateDesignation = async (
  id: string,
  designation: Designation
): Promise<DesignationResponse> => {
  try {
    const response: AxiosResponse<DesignationResponse> = await api.put(
      `lookups/designation/${id}`,
      designation,
      {
        headers: {
          "x-api-key": apikey,
          "x-app-version": appVersion,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error updating Designation", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to update Designation");
  }
};

export const deleteDesignation = async (id: string): Promise<DesignationResponse> => {
  try {
    const response: AxiosResponse<DesignationResponse> = await api.delete(
      `lookups/designation/${id}`,
      {
        headers: {
          "x-api-key": apikey,
          "x-app-version": appVersion,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error deleting Designation", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to delete Designation");
  }
};


export const getDesignationById = async (id: string): Promise<DesignationResponse> => {
  try {
    const response: AxiosResponse<DesignationResponse> = await api.get(
      `lookups/designation/${id}`,
      {
        headers: {
          "x-api-key": apikey,
          "x-app-version": appVersion,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching Designation by ID", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch Designation by ID");
  }
};

export const updateDesignationStatus = async (
  id: string,
  status: boolean
): Promise<DesignationResponse> => {
    try {
        const response: AxiosResponse<DesignationResponse> = await api.patch(
        `lookups/designation/${id}/status`,
        { status: status },
        {
            headers: {
            "x-api-key": apikey,
            "x-app-version": appVersion,
            },
        }
        );
        return response.data;
    } catch (error: any) {
        console.error("Error updating Designation status", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to update Designation status");
    }
}