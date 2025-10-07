import axios, { AxiosResponse } from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";
import api from "@/api/axiosInstance";

export interface TaxPreferenceData {
  _id: string;
  code: string;
  name: string;
  status: boolean;
  isDeleted: boolean;
  createdBy: string;
  createdAt: string; // Consider using Date type if parsing is handled elsewhere
  updatedAt: string; // Consider using Date type if parsing is handled elsewhere
  __v: number;
}

export interface TaxPreferenceResponse {
  success: boolean;
  message?: string;
  taxPreferences: TaxPreferenceData[];
}

export interface TaxPreferenceSingleResponse {
  success: boolean;
  message?: string;
  taxPreference: TaxPreferenceData;
}

export const fetchTaxPreferences = async (): Promise<TaxPreferenceResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.get<TaxPreferenceResponse>(
      `/lookups/tax-preference`,
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
      "Error fetching tax preferences",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch tax preferences"
    );
  }
};

// Get Tax Preference by ID
export const fetchTaxPreferenceById = async (id: string): Promise<TaxPreferenceSingleResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.get<TaxPreferenceSingleResponse>(
      `/lookups/tax-preference/${id}`,
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
      "Error fetching tax preference by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch tax preference by ID"
    );
  }
};

// Update Tax Preference status
export const updateTaxPreferenceStatus = async (
  id: string,
  status: boolean
): Promise<TaxPreferenceSingleResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response: AxiosResponse<TaxPreferenceSingleResponse> = await api.patch(
      `/lookups/tax-preference/${id}/status`,
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
      "Error updating tax preference status:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update tax preference status"
    );
  }
};

// Delete Tax Preference by ID
export const deleteTaxPreference = async (id: string): Promise<any> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.delete(
      `/lookups/tax-preference/${id}`,
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
    console.error("Error deleting tax preference", error);
    throw error;
  }
};

// Create Tax Preference
export const createTaxPreference = async (addData: TaxPreferenceSingleResponse): Promise<TaxPreferenceSingleResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.post<TaxPreferenceSingleResponse>(
      `/lookups/tax-preference/`,
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
      "Error creating tax preference",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to create tax preference");
  }
};

// Update Tax Preference by ID
export const updateTaxPreferenceById = async (
  id: string,
  updatedData: Partial<TaxPreferenceSingleResponse>
): Promise<TaxPreferenceSingleResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.put<TaxPreferenceSingleResponse>(
      `/lookups/tax-preference/${id}`,
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
      "Error updating tax preference by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update tax preference by ID"
    );
  }
};
