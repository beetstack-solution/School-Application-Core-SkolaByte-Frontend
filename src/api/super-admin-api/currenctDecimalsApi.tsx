import axios, { AxiosResponse } from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";

export interface CurrencyDecimal {
  _id: string;
  code: string;
  decimalValue: number;
  displayValue: string;
  status: boolean;
  isDeleted: boolean;
  createdBy: string;
  isDefault: boolean;
  createdAt: string; // or Date if you prefer to use Date type
  updatedAt: string; // or Date if you prefer to use Date type
}

export interface CurrencyDecimalResponse {
  data: any;
  success: boolean;
  error?: string;
  message?: string;
  currencyDecimals: CurrencyDecimal;
}

export interface CurrencyDecimalResponse {
  success: boolean;
  error?: string;
  message?: string;
  currencyDecimal: CurrencyDecimal;
}

export const fetchCurrencyDecimal =
  async (): Promise<CurrencyDecimalResponse> => {
    try {
       const token = getAdminBearerToken();
       if (!token) {
         throw new Error("Authentication token is missing");
       }
      const response = await axios.get<CurrencyDecimalResponse>(
        `${API_BASE_URL}/lookups/currency-decimal/`,
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
): Promise<CurrencyDecimalResponse> => {
  try {
     const token = getAdminBearerToken();
     if (!token) {
       throw new Error("Authentication token is missing");
     }
    const response = await axios.get<CurrencyDecimalResponse>(
      `${API_BASE_URL}/lookups/currency-decimal/${currencyId}`,
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
      "Error fetching currency decimal by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch currency decimal by ID"
    );
  }
};

// status update
export const updateCurrencyFormatStatus = async (
  id: string,
  status: boolean
): Promise<CurrencyDecimalResponse> => {
  try {
     const token = getAdminBearerToken();
     if (!token) {
       throw new Error("Authentication token is missing");
     }
    const response: AxiosResponse<CurrencyDecimalResponse> = await axios.patch(
      `${API_BASE_URL}/lookups/currency-decimal/${id}/status`,
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
      "Error updating currency-decimal status:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message ||
        "Failed to update currency-decimal status"
    );
  }
};
// dealete by id
export const deleteCurrencyDecimal = async (
  currencyId: string
): Promise<any> => {
  try {
     const token = getAdminBearerToken();
     if (!token) {
       throw new Error("Authentication token is missing");
     }
    const response = await axios.delete(
      `${API_BASE_URL}/lookups/currency-decimal/${currencyId}`,
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
    console.error("Error deleting currency-decimal", error);
    throw error;
  }
};
// create
export const createData = async (
  groupData: CurrencyDecimalResponse
): Promise<CurrencyDecimalResponse> => {
  try {
     const token = getAdminBearerToken();
     if (!token) {
       throw new Error("Authentication token is missing");
     }
    const response = await axios.post<CurrencyDecimalResponse>(
      `${API_BASE_URL}/lookups/currency-decimal/`,
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
      "Error creating currency decimal",
      error.response?.data || error.message
    );

    if (error.response?.data?.error) {
      throw new Error(error.response?.data?.error);
    } else if (error.response?.data?.message) {
      throw new Error(error.response?.data?.message);
    } else {
      throw new Error(
        "An unexpected error occurred while creating the currency decimal."
      );
    }
  }
};

export const updateDataById = async (
  grpId: string,
  updatedGroupData: Partial<CurrencyDecimal>
): Promise<CurrencyDecimal> => {
  try {
     const token = getAdminBearerToken();
     if (!token) {
       throw new Error("Authentication token is missing");
     }
    const response = await axios.put<CurrencyDecimal>(
      `${API_BASE_URL}/lookups/currency-decimal/${grpId}`,
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
      "Error updating currency decimal by ID",
      error.response?.data || error.message
    );
 const errorMessage = error.response?.data?.error || "Failed to update currency decimal. Please try again.";
    throw new Error(errorMessage);
  }
};
