import axios, { AxiosResponse } from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";
export interface moduleActionsData {
  _id: string;
  code: string;
  name: string;
  moduleRef: string;
}
export interface moduleActionsResponse {
  success: boolean;
  message?: string;
  error?: string;
  dataList: moduleActionsData[];
}

export const createData = async (
  addData: moduleActionsData
): Promise<moduleActionsResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await axios.post<moduleActionsResponse>(
      `${API_BASE_URL}/permission/actions/add`,
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
    if (error.response?.data) {
      throw new Error(
        error.response?.data?.error || "An unexpected error occurred"
      );
    } else {
      throw new Error("Failed to create module actions. Please try again.");
    }
  }
};

export const fetchData = async (): Promise<moduleActionsResponse> => {
  try {
     const token = getAdminBearerToken();
       if (!token) {
         throw new Error("Authentication token is missing");
       }
    const response = await axios.get<moduleActionsResponse>(
      `${API_BASE_URL}/permission/actions/`,
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
      "Error fetching actions",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to fetch actions");
  }
};
