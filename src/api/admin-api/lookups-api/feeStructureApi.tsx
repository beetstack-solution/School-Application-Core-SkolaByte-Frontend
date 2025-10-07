import axios, { AxiosResponse } from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";
import api from "@/api/axiosInstance";

// Fee Structure Types

export interface FeeAmountSplitup {
  feeType: {
    name: string
  }; 
  amount: number;
}

export interface FeeStructureData {
    _id: string;
    code: string;
    academicYear: {
      _id: string;
      name: string;
    };
    class: {
      _id: string;
      name: string;
    };
    feeAmountSplitup: FeeAmountSplitup[];
    feeName: string;
    totalFee: number;
    status: boolean;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    userUpdatedBy: {
      _id: string;
      name: string;
      email: string;
    };
    userUpdatedDate:string
    __v: number;
  }

export interface FeeStructureResponse {
  success: boolean;
  message: string;
  data: FeeStructureData;
}

export interface FeeStructuresDetailResponse {
  success: boolean;
  message: string;
  data?: FeeStructureData[];
}

export const createFeeStructure = async (
  feeStructureData: FeeStructureData
): Promise<FeeStructureResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.post<FeeStructureResponse>(
      "/lookups/fee-structure",
      feeStructureData,
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
    console.error("Error creating fee structure", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to create fee structure");
  }
};

export const fetchFeeStructures = async (
  page: number,
  limit: number
): Promise<FeeStructuresDetailResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.get<FeeStructuresDetailResponse>("/lookups/fee-structure", {
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
    console.error("Error fetching fee structures", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch fee structures");
  }
};

export const fetchFeeStructureById = async (
  Id: string
): Promise<FeeStructuresDetailResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.get<FeeStructuresDetailResponse>(`/lookups/fee-structure/${Id}`, {
      withCredentials: true,
      headers: {
        "x-api-key": apikey,
        "x-app-version": appVersion,
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error fetching fee structure by ID", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch fee structure by ID");
  }
};

export const updateFeeStructureById = async (
  id: string,
  updatedData: Partial<FeeStructureData>
): Promise<FeeStructuresDetailResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.put<any>(`/lookups/fee-structure/${id}`, updatedData, {
      withCredentials: true,
      headers: {
        "x-api-key": apikey,
        "x-app-version": appVersion,
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error updating fee structure by ID", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to update fee structure by ID");
  }
};

export const deleteFeeStructure = async (id: string): Promise<any> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
 const response = await api.delete(`/lookups/fee-structure/${id}`, {
      withCredentials: true,
      headers: {
        "x-api-key": apikey,
        "x-app-version": appVersion,
        Authorization: `Bearer ${token}`,
      },
    });
   return response.data;
  } catch (error) {
    console.error("Error deleting fee structure", error);
    throw error;
  }
};

// Update fee structure status
export const updateFeeStructureStatus = async (
  id: string,
  status: boolean
): Promise<any> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response: AxiosResponse<FeeStructuresDetailResponse> = await api.patch(
      `/lookups/fee-structure/${id}/status`,
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
    console.error("Error updating fee structure status:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to update fee structure status");
  }
};
