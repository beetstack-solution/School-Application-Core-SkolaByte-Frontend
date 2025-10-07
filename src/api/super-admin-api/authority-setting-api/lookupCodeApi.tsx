import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";
export interface LookupCode {
  message: string;
  success?: boolean;
  _id: string;
  type: string;
  name: string;
  code: string;
  firstNumber: number;
  lastNumber: number;
  createdAt: string;
  updatedAt: string;
  status: string;
}

export interface LookupCodeResponse {
  name: string;
  _id: string;
  success: boolean;
  message?: string;
  lookupCodes: LookupCode[];
}

export interface SingleLookupCodeResponse {
  success: boolean;
  message?: string;
  lookupCode: LookupCode;
}

// Get all lookup codes
export const fetchLookupCodes = async (): Promise<LookupCodeResponse> => {
  try {
    const token = await getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await axios.get<LookupCodeResponse>(
      `${API_BASE_URL}/lookups/code`,
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
      "Error fetching lookup codes",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch lookup codes"
    );
  }
};

// Get lookup code by ID
export const fetchLookupCodeById = async (
  lookupCodeId: string
): Promise<SingleLookupCodeResponse> => {
  try {
    const token = await getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await axios.get<SingleLookupCodeResponse>(
      `${API_BASE_URL}/lookups/code/${lookupCodeId}`,
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
      "Error fetching lookup code by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch lookup code by ID"
    );
  }
};

// Create lookup code
export const createLookupCode = async (
  lookupCodeData: Omit<LookupCode, "_id" | "createdAt" | "updatedAt">
): Promise<LookupCode> => {
  try {
    const token = await getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await axios.post<LookupCode>(
      `${API_BASE_URL}/lookups/code/`,
      lookupCodeData,
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
      "Error creating lookup code",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to create lookup code"
    );
  }
};

// Update lookup code by ID
export const updateLookupCodeById = async (
  lookupCodeId: string,
  updatedLookupCodeData: Partial<LookupCode>
): Promise<LookupCode> => {
  try {
    const token = await getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await axios.put<LookupCode>(
      `${API_BASE_URL}/lookups/code/${lookupCodeId}`,
      updatedLookupCodeData,
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
      "Error updating lookup code by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update lookup code by ID"
    );
  }
};

// Delete lookup code
export const deleteLookupCode = async (
  lookupCodeId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const token = await getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await axios.delete<{ success: boolean; message: string }>(
      `${API_BASE_URL}/lookups/code/${lookupCodeId}`,
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
      "Error deleting lookup code",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to delete lookup code"
    );
  }
};

// Update lookup code status
export const updateLookupCodeStatus = async (
  lookupCodeId: string,
  status: string
): Promise<LookupCode> => {
  try {
    const token = await getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await axios.patch<LookupCode>(
      `${API_BASE_URL}/lookups/code/${lookupCodeId}/status`,
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
      "Error updating lookup code status",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update lookup code status"
    );
  }
};
