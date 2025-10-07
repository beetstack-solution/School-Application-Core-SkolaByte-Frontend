import axios, { AxiosResponse } from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";



// Interface for permission module type
export interface PermissionModType {
  code: any;
  _id: string;
  name: string;
  typeAlias: string;
}

// Interface for the API response
interface ModuleTypeResponse {
  success: boolean;
  dataList: PermissionModType[];
}

// Fetch permission module types from the API
export const fetchModelType = async (): Promise<PermissionModType[]> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response: AxiosResponse<ModuleTypeResponse> =
      await axios.get<ModuleTypeResponse>(
        `${API_BASE_URL}/lookups/permission-moduletype`,
        {
          withCredentials: true,
          headers: {
            "x-api-key": apikey,
            "x-app-version": appVersion,
            Authorization: `Bearer ${token}`,
          },
        }
      );

    // Return the dataList containing the module types
    return response.data.dataList;
  } catch (error: any) {
    console.error(
      "Error fetching modules type",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch modules type"
    );
  }
};
