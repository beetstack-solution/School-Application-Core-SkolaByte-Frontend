import { AxiosResponse } from "axios";
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";
import api from "@/api/axiosInstance";

export interface BranchData {
  _id: string;
  code: string;
  name: string;
  address: string;
  phoneNumber: string;
  email: string;
  status: boolean;
  isDeleted: boolean;
  createdBy: string;
  isDefault: boolean;
  createdAt: string; // Consider using Date type if parsing is handled elsewhere
  updatedAt: string; // Consider using Date type if parsing is handled elsewhere
  __v: number;
}

export interface BranchResponse {
  success: boolean;
  message?: string;
  branches: BranchData[];
}
export interface BranchResponse {
  success: boolean;
  message?: string;
  branch: BranchData;
}

export const fetchBranches = async (): Promise<BranchResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.get<BranchResponse>(
      `/lookups/branch`,
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
      "Error fetching branches",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch branches"
    );
  }
};

//get by id
export const fetchBranchById = async (id: string): Promise<BranchResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.get<BranchResponse>(
      `/lookups/branch/${id}`,
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
      "Error fetching branch by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch branch by ID"
    );
  }
};

// status update
export const updateStatus = async (
  id: string,
  status: boolean
): Promise<BranchResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response: AxiosResponse<BranchResponse> = await api.patch(
      `/lookups/branch/${id}/status`,
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
    // Log the full response data for debugging
    console.log("API Response Data:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Error updating branch status:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update branch status"
    );
  }
};

// dealete by id
export const deleteData = async (id: string): Promise<any> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.delete(
      `/lookups/branch/${id}`,
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
    console.error("Error deleting branch", error);
    throw error;
  }
};

// create
export const createData = async (
  addData: BranchResponse
): Promise<BranchResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.post<BranchResponse>(
      `/lookups/branch/`,
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
    console.error(
      "Error creating branch",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to create branch");
  }
};

// update
export const updateBranchById = async (
  id: string,
  updatedData: Partial<BranchResponse>
): Promise<BranchResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.put<BranchResponse>(
      `/lookups/branch/${id}`,
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
    console.error(
      "Error updating branch by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update branch by ID"
    );
  }
};
