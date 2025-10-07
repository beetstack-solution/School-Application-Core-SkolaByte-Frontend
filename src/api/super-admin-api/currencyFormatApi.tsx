import axios, { AxiosResponse } from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";

export interface CurrencyFormatData {
  message: string;
  _id: string;
  code: string;
  formatPattern: string;
  name: string;
  status: boolean;
  isDeleted: boolean;
  createdBy: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CurrencyFormatsResponse {
  data: any;
  success: boolean;
  error?: string;
  message?: string;
  currencyFormats: CurrencyFormatData[];
}
export interface CurrencyFormatsResponse {
  success: boolean;
  error?: string;
  message?: string;
  currencyFormat: CurrencyFormatData;
}

// get all
export const fetchCurrencyFormat =
  async (): Promise<CurrencyFormatsResponse> => {
    try {
       const token = getAdminBearerToken();
       if (!token) {
         throw new Error("Authentication token is missing");
       }
      const response = await axios.get<CurrencyFormatsResponse>(
        `${API_BASE_URL}/lookups/currency-format/`,
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
        "Error fetching currency-decimal",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Failed to fetch currency-decimal"
      );
    }
  };

//  get by id
export const fetchCurrencyFormatById = async (
  currencyId: string
): Promise<CurrencyFormatsResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await axios.get<CurrencyFormatsResponse>(
      `${API_BASE_URL}/lookups/currency-format/${currencyId}`,
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
      "Error fetching currency format by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch currency format by ID"
    );
  }
};

// dealete by id
export const deleteCurrencyFormat = async (
  currencyId: string
): Promise<any> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await axios.delete(
      `${API_BASE_URL}/lookups/currency-format/${currencyId}`,
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
    console.error("Error deleting currency-format", error);
    throw error;
  }
};

// create
export const createCurrencyFormat = async (
  currencyFormatData: CurrencyFormatsResponse
): Promise<CurrencyFormatsResponse> => {
  try {
      const token = getAdminBearerToken();
      if (!token) {
        throw new Error("Authentication token is missing");
      }
    const response = await axios.post<CurrencyFormatsResponse>(
      `${API_BASE_URL}/lookups/currency-format/`,
      currencyFormatData,
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
      throw new Error("Failed to create Currency Format. Please try again.");
    }
  }
};

// status update
export const updateCurrencyFormatStatus = async (
  id: string,
  status: boolean
): Promise<CurrencyFormatsResponse> => {
  try {
      const token = getAdminBearerToken();
      if (!token) {
        throw new Error("Authentication token is missing");
      }
    const response: AxiosResponse<CurrencyFormatsResponse> = await axios.patch(
      `${API_BASE_URL}/lookups/currency-format/${id}/status`,
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
      "Error updating currency-format status:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update currency-format status"
    );
  }
};

//   update
export const updateDataById = async (
  id: string,
  updatedGroupData: Partial<CurrencyFormatData>
): Promise<CurrencyFormatData> => {
  try {
     const token = getAdminBearerToken();
     if (!token) {
       throw new Error("Authentication token is missing");
     }
    const response = await axios.put<CurrencyFormatData>(
      `${API_BASE_URL}/lookups/currency-format/${id}`,
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
      "Error updating currency-format by ID",
      error.response?.data || error.message
    );
   const errorMessage = error.response?.data?.error || "Failed to update currency-format by ID";
    throw new Error(errorMessage);
  }
};
