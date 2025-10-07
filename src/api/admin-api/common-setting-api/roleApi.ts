
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";
import api from "@/api/axiosInstance";
import { AxiosResponse } from "axios";

export interface Roles {
  message: string;
  success?: boolean; // Mark as optional
  _id: string;
  name: string;
  status: boolean;
  permittedModuleTypes: ModuleType[];
  roleAlias: string;
  code: string;
  createdAt: string;
  createdBy: {
    _id:string;
    name:string;
  };
  updatedAt: string;
  
}
export interface ModuleType {
  _id: string;
  code: string;
  name: string;
  typeAlias: string;
  success?: boolean;
  message?: string;
}
export interface RolesResponse {
  name: string;
  _id: string;
  success: boolean;
  message?: string;

  roles: Roles[];
}
export interface RolesResponse {
  success: boolean;
  message?: string;

  role: Roles;
}
// get all
export const fetchRoles = async (): Promise<RolesResponse> => {
  try {
    const params = {};
      const token = getAdminBearerToken();
      if (!token) {
        throw new Error("Authentication token is missing");
      }
    const response = await api.get<any>(`/lookups/roles/`, {
      params, // Passing params here
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
      "Error fetching roles",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to fetch roles");
  }
};

//   get by id
export const fetchRoleById = async (userId: string): Promise<any> => {
  try {
      const token = getAdminBearerToken();
       if (!token) {
         throw new Error("Authentication token is missing");
       }
    const response = await api.get<any>(
      `/lookups/roles/${userId}`,
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
      "Error fetching roles by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch roles by ID"
    );
  }
};

export const updateRoleById = async (
  userId: string,
  updatedRoleData: Partial<Roles> // Allow partial data
): Promise<Roles> => {
  try {
 const token = getAdminBearerToken();
 if (!token) {
   throw new Error("Authentication token is missing");
 }
    const response = await api.put<Roles>(
      `/lookups/roles/${userId}`,
      updatedRoleData,
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
      "Error updating roles by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update roles by ID"
    );
  }
};

//   create roles
export const createRole = async (roleData: Roles): Promise<Roles> => {
  try {
    const userPayload = {
      ...roleData,
    };
 const token = getAdminBearerToken();
       if (!token) {
         throw new Error("Authentication token is missing");
       }
    const response = await api.post<Roles>(
      `/lookups/roles/`,
      userPayload,
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
    console.error("Error creating roles", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to create roles");
  }
};

//   delete

export const deleteRole = async (
  userId: string
): Promise<{ success: boolean; message: string }> => {
  try {
      const token = getAdminBearerToken();
       if (!token) {
         throw new Error("Authentication token is missing");
       }
    const response = await api.delete<{ success: boolean; message: string }>(
      `/lookups/roles/${userId}`,
      {
        withCredentials: true, 
        headers: {
            "x-api-key": apikey,
            "x-app-version": appVersion,
            Authorization: `Bearer ${token}`,
          },
      }
    );
    return response.data; // Return the response
  } catch (error) {
    console.error("Error deleting roles:", error);
    throw error; // Rethrow the error to handle it in the component if needed
  }
};

// status update
export const updateRoleStatus = async (
  id: string,
  status: boolean
): Promise<RolesResponse> => {
  try {
      const token = getAdminBearerToken();
       if (!token) {
         throw new Error("Authentication token is missing");
       }
    const response: AxiosResponse<RolesResponse> = await api.patch(
      `/lookups/roles/${id}/status`,
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
      "Error updating roles status:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update roles status"
    );
  }
};
