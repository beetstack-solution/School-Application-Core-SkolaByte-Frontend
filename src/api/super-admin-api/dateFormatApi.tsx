import axios, { AxiosResponse } from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";

export interface DateFormatData {
  _id: string;
  code: string;
  dateFormat: string; // Optional as some entries might not have this field
  name: string; // Optional as some entries might not have this field
  nameAlias?: string; // Optional as some entries might not have this field
  status: boolean;
  isDeleted: boolean;
  createdBy: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DateFormatsResponse {
  success: boolean;
  message?: string;
  dateFormats: DateFormatData[];
}
export interface DateFormatsResponse {
  success: boolean;
  message?: string;
  dateFormat: DateFormatData;
}

// get
export const fetchDateFormats = async (): Promise<DateFormatsResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await axios.get<DateFormatsResponse>(
      `${API_BASE_URL}/lookups/date-format/`,
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
      "Error fetching Date Formats",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch Date Formats"
    );
  }
};

//get by id
export const fetchDateFormatById = async (
  id: string
): Promise<DateFormatsResponse> => {
  try {
      const token = getAdminBearerToken();
       if (!token) {
         throw new Error("Authentication token is missing");
       }
    const response = await axios.get<DateFormatsResponse>(
      `${API_BASE_URL}/lookups/date-format/${id}`,
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
      "Error fetching date-format by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch date-format by ID"
    );
  }
};

// status update
export const updateStatus = async (
  id: string,
  status: boolean
): Promise<DateFormatsResponse> => {
  try {
      const token = getAdminBearerToken();
      if (!token) {
        throw new Error("Authentication token is missing");
      }
    const response: AxiosResponse<DateFormatsResponse> = await axios.patch(
      `${API_BASE_URL}/lookups/date-format/${id}/status`,
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
      "Error updating date-format status:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update date-format status"
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
      `${API_BASE_URL}/lookups/date-format/${id}`,
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
  groupData: DateFormatsResponse
): Promise<DateFormatsResponse> => {
  try {
     const token = getAdminBearerToken();
     if (!token) {
       throw new Error("Authentication token is missing");
     }
    const response = await axios.post<DateFormatsResponse>(
      `${API_BASE_URL}/lookups/date-format/`,
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
      "Error creating date-format",
      error.response?.data || error.message
    );
   const errorMessage = error.response?.data?.error || "Failed to create date-format";
    throw new Error(errorMessage);
  }
};

//   update
export const updateDataById = async (
  id: string,
  updatedGroupData: Partial<DateFormatsResponse>
): Promise<DateFormatsResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await axios.put<DateFormatsResponse>(
      `${API_BASE_URL}/lookups/date-format/${id}`,
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
      "Error updating date-format by ID",
      error.response?.data || error.message
    );
   const errorMessage = error.response?.data?.error || "Failed to update date-format by ID";
    throw new Error(errorMessage);
  }
};
