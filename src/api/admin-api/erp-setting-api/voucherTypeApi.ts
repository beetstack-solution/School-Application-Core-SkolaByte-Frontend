import axios, { AxiosResponse } from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";

interface VoucherCategory {
  _id: string;
  code: string;
  voucherName: string;
}

export interface VoucherTypeData {
  message: string;
  _id: string;
  code: string;
  voucherName: string;
  voucher: VoucherCategory;
  status: boolean;
  isDeleted: boolean;
  createdBy: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VoucherTypeResponse {
  success: boolean;
  message?: string;
  voucherTypes: VoucherTypeData[];
}
export interface VoucherTypeResponse {
  success: boolean;
  message?: string;
  voucherType: VoucherTypeData;
}

export const fetchVoucherType = async (): Promise<VoucherTypeResponse> => {
  try {
     const token = getAdminBearerToken();
     if (!token) {
       throw new Error("Authentication token is missing");
     }
    const response = await axios.get<VoucherTypeResponse>(
      `${API_BASE_URL}/lookups/voucher-type/`,
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
      "Error fetching voucher-type",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch voucher-type"
    );
  }
};

//get by id
export const fetchVoucherTypeById = async (
  typeId: string
): Promise<VoucherTypeResponse> => {
  try {
     const token = getAdminBearerToken();
     if (!token) {
       throw new Error("Authentication token is missing");
     }
    const response = await axios.get<VoucherTypeResponse>(
      `${API_BASE_URL}/lookups/voucher-type/${typeId}`,
      {
        withCredentials: true,
        headers: {
          "x-api-key": apikey,
          "x-app-version": appVersion,
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; // This should return the CurrencyResponse type
  } catch (error: any) {
    console.error(
      "Error fetching voucher-type by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch voucher-type by ID"
    );
  }
};

// status update
export const updateVoucherTypeStatus = async (
  id: string,
  status: boolean
): Promise<VoucherTypeResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response: AxiosResponse<VoucherTypeResponse> = await axios.patch(
      `${API_BASE_URL}/lookups/voucher-type/${id}/status`,
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
      "Error updating account-group status:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update account-group status"
    );
  }
};

// dealete by id
export const deleteVoucherType = async (voucherId: string): Promise<any> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await axios.delete(
      `${API_BASE_URL}/lookups/voucher-type/${voucherId}`,
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
    console.error("Error deleting voucher-type", error);
    throw error;
  }
};

// create
export const createVoucherData = async (
  groupData: VoucherTypeResponse
): Promise<VoucherTypeResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await axios.post<VoucherTypeResponse>(
      `${API_BASE_URL}/lookups/voucher-type/`,
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
    console.error(
      "Error creating voucher-type",
      error.response?.data || error.message
    );
  const errorMessage = error.response?.data?.error || "Failed to create voucher-type";
    throw new Error(errorMessage);
  }
};

export const updateVoucherTypeById = async (
  grpId: string,
  voucherTypeData: Partial<VoucherTypeData>
): Promise<VoucherTypeData> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await axios.put<VoucherTypeData>(
      `${API_BASE_URL}/lookups/voucher-type/${grpId}`,
      voucherTypeData,
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
      "Error updating voucher-type by ID",
      error.response?.data || error.message
    );
  const errorMessage = error.response?.data?.error || "Failed to update voucher-type by ID";
    throw new Error(errorMessage);
  }
};
