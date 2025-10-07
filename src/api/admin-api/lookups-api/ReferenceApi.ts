import axios, { AxiosResponse } from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";
import api from "@/api/axiosInstance";

// Define the structure for a Reference
export interface ReferenceData {
  code: string;
  name: string;
  nameAlias?: string;
  _id: string;
  status: boolean;
  isDeleted: boolean;
  createdBy: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;

  __v: number;
}

// Define the structure for the create reference response
export interface CreateReferenceResponse {
  success: boolean;
  message: string;
  references: ReferenceData[];
}
export interface CreateReferenceResponse {
  success: boolean;
  message: string;
  reference: ReferenceData[];
}

// create
export const createReference = async (
  addData: CreateReferenceResponse
): Promise<CreateReferenceResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.post<CreateReferenceResponse>(
      `/lookups/reference/`,
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
      "Error creating reference",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to create reference"
    );
  }
};

export const fetchData = async (): Promise<CreateReferenceResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.get<CreateReferenceResponse>(
      `/lookups/reference`,
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
      "Error fetching reference",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch reference"
    );
  }
};

//get by id
export const fetchDataById = async (
  typeId: string
): Promise<CreateReferenceResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    console.log("start");
    const response = await api.get<CreateReferenceResponse>(
      `/lookups/reference/${typeId}`,
      {
        withCredentials: true,
        headers: {
          "x-api-key": apikey,
          "x-app-version": appVersion,
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response, "response Dataa");
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching reference by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch reference by ID"
    );
  }
};

// status update
export const updateStatus = async (
  id: string,
  status: boolean
): Promise<CreateReferenceResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response: AxiosResponse<CreateReferenceResponse> = await api.put(
      `/lookups/reference/${id}`,
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
      "Error updating reference status:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update reference status"
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
    const response = await api.delete(
      `/lookups/reference/${id}`,
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
    console.error("Error deleting reference", error);
    throw error;
  }
};

export const updateReferenceById = async (
  id: string,
  updatedData: Partial<ReferenceData>
): Promise<ReferenceData> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.put<ReferenceData>(
      `/lookups/reference/${id}`,
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
      "Error updating reference by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update reference by ID"
    );
  }
};
