import axios, { AxiosResponse } from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";

export interface ModuleTypeItem {
  _id: string;
  name: string;
  code: string;
  typeAlias: string;
}

export interface ModuleTypeResponse {
  success: boolean;
  message?: string;
  error?: string;
  dataList: ModuleTypeItem[];
}

export interface ModuleTypeResponse {
  success: boolean;
  message?: string;
  error?: string;
  data: ModuleTypeItem;
}

// create
export const createData = async (
  addData: ModuleTypeResponse
): Promise<ModuleTypeResponse> => {
  try {
     const token = getAdminBearerToken();
     if (!token) {
       throw new Error("Authentication token is missing");
     }
    const response = await axios.post<ModuleTypeResponse>(
      `${API_BASE_URL}/permission/module-type/`,
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
        error.response?.data?.message || "An unexpected error occurred"
      );
    } else {
      throw new Error("Failed to create module-type. Please try again.");
    }
  }
};

export const fetchData = async (): Promise<ModuleTypeResponse> => {
  try {
    const token = getAdminBearerToken();
       if (!token) {
         throw new Error("Authentication token is missing");
       }
    const response = await axios.get<ModuleTypeResponse>(
      `${API_BASE_URL}/lookups/permission-moduletype/`,
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
      "Error fetching module-type",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch module-type"
    );
  }
};

export const fetchDataById = async (
  id: string
): Promise<ModuleTypeResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await axios.get<ModuleTypeResponse>(
      `${API_BASE_URL}/permission/module-type/${id}`,
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
      "Error fetching module-type by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch module-type by ID"
    );
  }
};

export const updateDataById = async (
  id: string,
  updatedData: Partial<ModuleTypeResponse>
): Promise<ModuleTypeResponse> => {
  try {
     const token = getAdminBearerToken();
     if (!token) {
       throw new Error("Authentication token is missing");
     }
    const response = await axios.put<ModuleTypeResponse>(
      `${API_BASE_URL}/permission/module-type/${id}`,
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
    const errorMessage = error.response?.data?.message || "Failed to update module-type by ID";
    throw new Error(errorMessage);
  }
};

// export const deleteData = async (
//   id: string
// ): Promise<any> => {
//   try {
//     const response = await axios.delete(
//       `${API_BASE_URL}/permission/module-type/${id}`,
//       {
//         withCredentials: true,
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error deleting module-type", error);
//     throw error;
//   }
// };
