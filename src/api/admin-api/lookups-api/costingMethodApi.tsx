import axios, { AxiosResponse } from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";
import api from "@/api/axiosInstance";

// Define the structure for a Costing Method
export interface CostingMethodData {
  code: string;
  name: string;
  nameAlias?: string;
  _id: string;
  status: boolean;
  isDeleted: boolean;
  createdBy: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Define the structure for the create costing method response
export interface CreateCostingMethodResponse {
  success: boolean;
  message: string;
  costingMethod: CostingMethodData[];
}

export interface FetchCostingMethodsResponse {
  success: boolean;
  message: string;
  costingMethods: CostingMethodData[];
}

// Create a new costing method
export const createCostingMethod = async (
  addData: CostingMethodData
): Promise<CreateCostingMethodResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.post<CreateCostingMethodResponse>(
      `/lookups/costing-method/`,
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
      "Error creating costing method",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to create costing method"
    );
  }
};

// Fetch all costing methods
export const fetchCostingMethods =
  async (): Promise<FetchCostingMethodsResponse> => {
    try {
      const token = getAdminBearerToken();
      if (!token) {
        throw new Error("Authentication token is missing");
      }
      const response = await api.get<FetchCostingMethodsResponse>(
        `/lookups/costing-method`,
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
        "Error fetching costing methods",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Failed to fetch costing methods"
      );
    }
  };

// Fetch costing method by ID
export const fetchCostingMethodById = async (
  costingMethodId: string
): Promise<CreateCostingMethodResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.get<CreateCostingMethodResponse>(
      `/lookups/costing-method/${costingMethodId}`,
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
      "Error fetching costing method by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch costing method by ID"
    );
  }
};

// Update costing method status
export const updateCostingMethodStatus = async (
  id: string,
  status: boolean
): Promise<CreateCostingMethodResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response: AxiosResponse<CreateCostingMethodResponse> =
      await api.patch(
        `/lookups/costing-method/${id}`,
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
    console.log("API Response Data:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Error updating costing method status:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update costing method status"
    );
  }
};

// Delete costing method by ID
export const deleteCostingMethod = async (id: string): Promise<any> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.delete(
      `/lookups/costing-method/${id}`,
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
    console.error("Error deleting costing method", error);
    throw error;
  }
};

// Update costing method by ID
export const updateCostingMethodById = async (
  id: string,
  updatedData: Partial<CostingMethodData>
): Promise<CostingMethodData> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.put<CostingMethodData>(
      `/lookups/costing-method/${id}`,
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
      "Error updating costing method by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update costing method by ID"
    );
  }
};
