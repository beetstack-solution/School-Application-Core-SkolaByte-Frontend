import axios, { AxiosResponse } from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";
import api from "@/api/axiosInstance";

// FeeInstallmentType Types

export interface FeeInstallmentTypeData {
  code: string;
  name: string;
  noOfFeeInstallments: number;
  nameAlias?: string;
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

export interface FeeInstallmentTypeResponse {
  success: boolean;
  message: string;
  data: FeeInstallmentTypeData;
}

export interface FeeInstallmentTypesDetailResponse {
  success: boolean;
  message: string;
  data?: FeeInstallmentTypeData[];
  total: number;
}

export const createFeeInstallmentType = async (
  feeInstallmentData: FeeInstallmentTypeData
): Promise<FeeInstallmentTypeResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.post<FeeInstallmentTypeResponse>(
      "/lookups/fee-installment-type",
      feeInstallmentData,
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
      "Error creating Fee Installment Type",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to create Fee Installment Type");
  }
};

export const fetchFeeInstallmentTypes = async (
  page: number,
  limit: number
): Promise<FeeInstallmentTypesDetailResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.get<FeeInstallmentTypesDetailResponse>("/lookups/fee-installment-type", {
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
      "Error fetching Fee Installment Types",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to fetch Fee Installment Types");
  }
};

export const fetchFeeInstallmentTypeById = async (
  Id: string
): Promise<FeeInstallmentTypesDetailResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.get<FeeInstallmentTypesDetailResponse>(
      `/lookups/fee-installment-type/${Id}`,
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
      "Error fetching Fee Installment Type by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch Fee Installment Type by ID"
    );
  }
};

export const updateFeeInstallmentType = async (
  id: string,
  updatedData: Partial<FeeInstallmentTypeData>
): Promise<FeeInstallmentTypesDetailResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.put<any>(`/lookups/fee-installment-type/${id}`, updatedData, {
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
      "Error updating Fee Installment Type by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update Fee Installment Type by ID"
    );
  }
};

export const deleteFeeInstallmentType = async (id: string): Promise<any> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.delete(`/lookups/fee-installment-type/${id}`, {
      withCredentials: true,
      headers: {
        "x-api-key": apikey,
        "x-app-version": appVersion,
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting Fee Installment Type", error);
    throw error;
  }
};

// Update FeeInstallmentType status
export const updateFeeInstallmentTypeStatus = async (
  id: string,
  status: boolean
): Promise<any> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response: AxiosResponse<FeeInstallmentTypesDetailResponse> = await api.patch(
      `/lookups/fee-installment-type/${id}/status`,
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
      "Error updating Fee Installment Type status:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update Fee Installment Type status"
    );
  }
};
