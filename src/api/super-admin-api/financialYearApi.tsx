import axios, { AxiosResponse } from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";

export interface FinancialYearData {
  message: string;
  isDefault: boolean;
  _id: string;
  startMonth: string;
  endMonth: string;
  code: string;
  isDeleted: boolean;
  createdBy: string;
  deletedBy: string | null;
  deletedAt: string | null;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialYearsResponse {
  some(arg0: (year: any) => boolean): unknown;
  success: boolean;
  message?: string;
  financialYears: FinancialYearData[];
}
export interface FinancialYearsResponse {
  success: boolean;
  message?: string;
  financialYear: FinancialYearData;
}

// get
export const fetchFinancialYears =
  async (): Promise<FinancialYearsResponse> => {
    try {
      const token = getAdminBearerToken();
      if (!token) {
        throw new Error("Authentication token is missing");
      }
      const response = await axios.get<FinancialYearsResponse>(
        `${API_BASE_URL}/lookups/financial-year/`,
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
        "Error fetching financial Years",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Failed to fetch financial Years"
      );
    }
  };

//get by id
export const fetchfinancialYearById = async (
  id: string
): Promise<FinancialYearsResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await axios.get<FinancialYearsResponse>(
      `${API_BASE_URL}/lookups/financial-year/${id}`,
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
      "Error fetching financial Year by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch financial Year by ID"
    );
  }
};

// status update
export const updateStatus = async (
  id: string,
  status: boolean
): Promise<FinancialYearsResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response: AxiosResponse<FinancialYearsResponse> = await axios.patch(
      `${API_BASE_URL}/lookups/financial-year/${id}/status`,
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
      "Error updating financial-year status:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update financial-year status"
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
      `${API_BASE_URL}/lookups/financial-year/${id}`,
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
    console.error("Error deleting financial-year", error);
    throw error;
  }
};

// create
export const createData = async (
  groupData: FinancialYearsResponse
): Promise<FinancialYearsResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await axios.post<FinancialYearsResponse>(
      `${API_BASE_URL}/lookups/financial-year/`,
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
      "Error creating financial-year",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to create financial-year"
    );
  }
};

//   update
export const updateDataById = async (
  id: string,
  updatedGroupData: Partial<FinancialYearsResponse>
): Promise<FinancialYearsResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await axios.put<FinancialYearsResponse>(
      `${API_BASE_URL}/lookups/financial-year/${id}`,
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
      "Error updating financial-year",
      error.response?.data || error.message
    );
    const errorMessage = error.response?.data?.error || "Failed to update financial-year";
    throw new Error(errorMessage);
  }
};
