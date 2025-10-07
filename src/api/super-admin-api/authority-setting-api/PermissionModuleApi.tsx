import axios, { AxiosResponse } from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";

export interface PermissionModuleData {
  _id: string;
  name: string;
  code: string;
  type: string;
  moduleType: string;
  moduleAlias: string;
}

export interface PermissionModuleResponse {
  success: boolean;
  message?: string;
  error?: string;
  dataList: PermissionModuleData[];
}

// create
export const createData = async (
  addData: PermissionModuleData
): Promise<PermissionModuleResponse> => {
  try {
     const token = getAdminBearerToken();
       if (!token) {
         throw new Error("Authentication token is missing");
       }
    const response = await axios.post<PermissionModuleResponse>(
      `${API_BASE_URL}/permission/module/add`,
      addData,
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
    if (error.response?.data) {
      throw new Error(
        error.response?.data?.message || "An unexpected error occurred"
      );
    } else {
      throw new Error("Failed to create module permission. Please try again.");
    }
  }
};

export const fetchData = async (): Promise<PermissionModuleResponse> => {
  try {
      const token = getAdminBearerToken();
      if (!token) {
        throw new Error("Authentication token is missing");
      }
    const response = await axios.get<PermissionModuleResponse>(
      `${API_BASE_URL}/permission/module/`,
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
      "Error fetching module",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to fetch module");
  }
};

export const updateDataById = async (
  id: string,
  updatedData: Partial<PermissionModuleResponse>
): Promise<PermissionModuleResponse> => {
  try {
      const token = getAdminBearerToken();
      if (!token) {
        throw new Error("Authentication token is missing");
      }
    const response = await axios.put<PermissionModuleResponse>(
      `${API_BASE_URL}/permission/module/update/${id}`,
      updatedData,
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
    if (error.response?.data) {
      throw new Error(
        error.response?.data?.message || "An unexpected error occurred"
      );
    } else {
      throw new Error("Failed to create module. Please try again.");
    }
  }
};
