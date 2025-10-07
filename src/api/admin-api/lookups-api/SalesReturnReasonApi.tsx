import axios, { AxiosResponse } from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";
import api from "@/api/axiosInstance";
// Define the structure for a SalesReturnReason
export interface SalesReturnReasonData {
  message: string;
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

// Define the structure for the create SalesReturnReason response
export interface CreateSalesReturnReasonResponse {
  success: boolean;
  message: string;
  
  salesReturnReason: SalesReturnReasonData[];
}

export interface FetchSalesReturnReasonsResponse {
  success: boolean;
  message: string;
  salesReturnReasons: SalesReturnReasonData[];
}

// Create a new SalesReturnReason
export const createSalesReturnReason = async (
  addData: SalesReturnReasonData
): Promise<CreateSalesReturnReasonResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.post<CreateSalesReturnReasonResponse>(
      `/lookups/sales-return-reason`,
      addData,
      { withCredentials: true,
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
      "Error creating SalesReturnReason",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to create SalesReturnReason"
    );
  }
};

// Fetch all SalesReturnReasons
export const fetchSalesReturnReasons = async (): Promise<FetchSalesReturnReasonsResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.get<FetchSalesReturnReasonsResponse>(
      `/lookups/sales-return-reason`,
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
      "Error fetching SalesReturnReasons",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch SalesReturnReasons"
    );
  }
};

// Fetch SalesReturnReason by ID
export const fetchSalesReturnReasonById = async (
  id: string
): Promise<CreateSalesReturnReasonResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.get<CreateSalesReturnReasonResponse>(
      `/lookups/sales-return-reason/${id}`,
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
      "Error fetching SalesReturnReason by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch SalesReturnReason by ID"
    );
  }
};

// Update SalesReturnReason status
export const updateSalesReturnReasonStatus = async (
  id: string,
  status: boolean
): Promise<CreateSalesReturnReasonResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response: AxiosResponse<CreateSalesReturnReasonResponse> = await api.patch(
      `/lookups/sales-return-reason/${id}`,
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
      "Error updating SalesReturnReason status:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update SalesReturnReason status"
    );
  }
};

// Delete SalesReturnReason by ID
export const deleteSalesReturnReason = async (id: string): Promise<any> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.delete(
      `/lookups/sales-return-reason/${id}`,
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
    console.error("Error deleting SalesReturnReason", error);
    throw error;
  }
};

// Update SalesReturnReason by ID
export const updateSalesReturnReasonById = async (
  id: string,
  updatedData: Partial<SalesReturnReasonData>
): Promise<SalesReturnReasonData> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.put<SalesReturnReasonData>(
      `/lookups/sales-return-reason/${id}`,
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
      "Error updating SalesReturnReason by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update SalesReturnReason by ID"
    );
  }
};
