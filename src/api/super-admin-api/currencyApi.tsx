import axios, { AxiosResponse } from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";

export interface CurrencyItems {
  _id: string;
  code: string;
  name: string;
  uniqueCode: string;
  symbol: string;
  status: boolean;
  isDeleted: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CurrencyResponse {
  success: boolean;
  message?: string;
  error?: string;
  currencies: CurrencyItems[]; // Change this from currencies to currency
}
export interface CurrencyResponse {
  success: boolean;
  message?: string;
  error?: string;
  currency: CurrencyItems; // Change this from currencies to currency
}

export const fetchCurrency = async (): Promise<any> => {
  try {
      const token = getAdminBearerToken();
      if (!token) {
        throw new Error("Authentication token is missing");
      }
    const response = await axios.get<any>(`${API_BASE_URL}/lookups/currency`, {
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
      "Error fetching currencies",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch currencies"
    );
  }
};

export const fetchCurrencyById = async (
  userId: string
): Promise<CurrencyResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await axios.get<CurrencyResponse>(
      `${API_BASE_URL}/lookups/currency/${userId}`,
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
      "Error fetching currency by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch currency by ID"
    );
  }
};

export const createCurrency = async (
  currencyData: CurrencyResponse
): Promise<CurrencyResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await axios.post<CurrencyResponse>(
      `${API_BASE_URL}/lookups/currency/`,
      currencyData, // Pass the currency data directly
      {
        withCredentials: true,
        headers: {
          "x-api-key": apikey,
          "x-app-version": appVersion,
          Authorization: `Bearer ${token}`,
        },
      } // Add credentials if necessary
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error creating currency",
      error.response?.data || error.message
    );
    if (error.response?.data?.error) {
      throw new Error(error.response?.data?.error);
    } else if (error.response?.data?.message) {
      throw new Error(error.response?.data?.message);
    } else {
     const errorMessage = error.response?.data?.error || "Failed to create currency"; // Default error message  
      throw new Error(errorMessage);
    }
  }
};

export const deleteCurrency = async (
  userId: string
): Promise<{ success: boolean; message: string }> => {
  try {
     const token = getAdminBearerToken();
     if (!token) {
       throw new Error("Authentication token is missing");
     }
    const response = await axios.delete<{ success: boolean; message: string }>(
      `${API_BASE_URL}/lookups/currency/${userId}`,
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
    console.error("Error deleting currency", error);
    throw error;
  }
};

export const updateCurrencyById = async (
  userId: string,
  updatedCurrencyData: Partial<CurrencyResponse>
): Promise<CurrencyResponse | null> => {
  try {
      const token = getAdminBearerToken();
      if (!token) {
        throw new Error("Authentication token is missing");
      }
    const response = await axios.put<CurrencyResponse>(
      `${API_BASE_URL}/lookups/currency/${userId}`,
      updatedCurrencyData,
      {
        withCredentials: true,
         headers: {
            "x-api-key": apikey,
            "x-app-version": appVersion,
            Authorization: `Bearer ${token}`,
          },
      }
    );
    return response.data; // Return the updated currency data
  } catch (error: any) {
    console.error(
      "Error updating currency by ID",
      error.response?.data || error.message
    );
  const errorMessage = error.response?.data?.error || "Failed to update currency"; // Default error message  
    throw new Error(errorMessage);
  }
};

// export const  updateCurrencyStatusById =async(userId: string, status: boolean):Promise<CurrencyItems>=await axios.patch(
//   `${API_BASE_URL}/lookups/currency/${userId}/status`,
//   {status},
//   {
//     withCredentials: true, // Include credentials in the request
//   }
// );
// return response.data;
// }

export const updateCurrencyStatusById = async (
  userId: string,
  status: boolean
): Promise<CurrencyResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response: AxiosResponse<CurrencyResponse> = await axios.patch(
      `${API_BASE_URL}/lookups/currency/${userId}/status`,
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
    console.error("Error updating user status:", error);
    throw new Error(
      error.response?.data?.message || "Failed to update user status"
    );
  }
};
