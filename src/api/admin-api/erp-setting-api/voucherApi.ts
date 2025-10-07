import axios, { AxiosResponse } from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";

// Define the structure for a Voucher
export interface VoucherData {
  code: string;
  voucherName: string;
  _id: string;
  status: boolean;
  isDeleted: boolean;
  createdBy: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Define the structure for the create voucher response
export interface CreateVoucherResponse {
  success: boolean;
  message: string;
  vouchers: VoucherData[];
}
export interface CreateVoucherResponse {
  success: boolean;
  message: string;
  voucher: VoucherData;
}

// create
export const createData = async (
  addData: CreateVoucherResponse
): Promise<CreateVoucherResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await axios.post<CreateVoucherResponse>(
      `${API_BASE_URL}/lookups/voucher-category/`,
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
      "Error creating voucher-category",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to create voucher-category"
    );
  }
};

export const fetchData = async (): Promise<CreateVoucherResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await axios.get<CreateVoucherResponse>(
      `${API_BASE_URL}/lookups/voucher-category/`,
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
      "Error fetching voucher-category",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch voucher-category"
    );
  }
};

//get by id
export const fetchDataById = async (
  id: string
): Promise<CreateVoucherResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await axios.get<CreateVoucherResponse>(
      `${API_BASE_URL}/lookups/voucher-category/${id}`,
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
      "Error fetching voucher-category by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch voucher-category by ID"
    );
  }
};

// status update
export const updateStatus = async (
  id: string,
  status: boolean
): Promise<CreateVoucherResponse> => {
  try {
     const token = getAdminBearerToken();
     if (!token) {
       throw new Error("Authentication token is missing");
     }
    const response: AxiosResponse<CreateVoucherResponse> = await axios.patch(
      `${API_BASE_URL}/lookups/voucher-category/${id}/status`,
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
      "Error updating voucher-category status:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message ||
        "Failed to update voucher-category status"
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
    const response = await axios.delete(
      `${API_BASE_URL}/lookups/voucher-category/${id}`,
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
    console.error("Error deleting voucher-category", error);
    throw error;
  }
};

export const updateVoucherById = async (
  id: string,
  updatedData: Partial<VoucherData>
): Promise<VoucherData> => {
  try {
      const token = getAdminBearerToken();
      if (!token) {
        throw new Error("Authentication token is missing");
      }
    const response = await axios.put<VoucherData>(
      `${API_BASE_URL}/lookups/voucher-category/${id}`,
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
      "Error updating voucher-category by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update voucher-category by ID"
    );
  }
};
