
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";
import api from "@/api/axiosInstance";
import { AxiosResponse } from "axios";

export interface ModuleItems {
  _id: string;
  name: string;
  code: string;
  status: boolean;
  createdAt: string;
}

export interface ModulesResponse {
  success: boolean;
  error?: string;
  message?: string;
  modules: ModuleItems[];
}

export interface ModuleResponse {
  data: any;
  success: boolean;
  error?: string;
  message?: string;
  module: ModuleItems;
}

// Fetch all modules (multiple)
export const fetchModules = async (): Promise<ModulesResponse> => {
  try {
    const token = await getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.get<ModulesResponse>(
      `/lookups/permission-module/`,
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
      "Error fetching modules",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to fetch modules");
  }
};

// Fetch a single module by ID
export const fetchModelById = async (
  userId: string
): Promise<ModuleResponse> => {
  try {
    const token = await getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.get<ModuleResponse>(
      `/lookups/permission-module/${userId}`,
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
      "Error fetching module by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch module by ID"
    );
  }
};

// Update module status by ID
export const updateModulesStatusById = async (
  id: string,
  status: boolean
): Promise<ModuleResponse> => {
  try {
    const token = await getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response: AxiosResponse<ModuleResponse> = await api.patch(
      `/lookups/permission-module/${id}/status`,
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

    console.log("API Response Data:", response.data);

    return response.data;
  } catch (error: any) {
    console.error(
      "Error updating module status:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update module status"
    );
  }
};

export const deleteModule = async (moduleId: string): Promise<any> => {
  try {
    const token = await getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.delete(
      `/lookups/permission-module/${moduleId}`,
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
  } catch (error) {
    console.error("Error deleting module", error);
    throw error;
  }
};

// Create module
export const createData = async (
  groupData: ModulesResponse
): Promise<ModulesResponse> => {
  try {
    const token = await getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.post<ModulesResponse>(
      `/lookups/permission-module/`,
      groupData,
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
        error.response?.data?.error || "An unexpected error occurred"
      );
    } else {
      throw new Error("Failed to create Module. Please try again.");
    }
  }
};

// Update module by ID
export const updateModuleById = async (
  id: string,
  updatedGroupData: Partial<ModuleItems>
): Promise<ModuleItems> => {
  try {
    const token = await getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.put<ModuleItems>(
      `/lookups/permission-module/${id}`,
      updatedGroupData,
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
      "Error updating module by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update module by ID"
    );
  }
};
