import axios, { AxiosResponse } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";

export interface CreatedBy {
  _id: string;
  name: string;
  email: string;
}

export interface Group {
  _id: string;
  code: string;
  groupName: string;
}
export interface Category {
  _id: string;
  code: string;
  categoryName: string;
}
export interface AddSubGroupData {
  _id: string;
  subGroupName: string;
  group: Group; // Use Group interface
  category: Category; // Use Category interface
}
export interface SubGroupData {
  message: string;
  _id: string;
  subGroupName: string;
  code: string;
  group: Group; // Use Group interface
  category: Category; // Use Category interface
  status: boolean;
  isDeleted: boolean;
  createdBy: CreatedBy; // User ID
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SubGroupsResponse {
  success: boolean;
  message?: string;
  subGroups: SubGroupData[];
}
export interface SubGroupsResponse {
  success: boolean;
  message?: string;
  subGroup: SubGroupData;
}

// Fetch all
export const fetchSubGroups = async (): Promise<SubGroupsResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await axios.get<SubGroupsResponse>(
      `${API_BASE_URL}/lookups/sub-group/`,
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
      "Error fetching sub-group",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch sub-group"
    );
  }
};

// Fetch a single subgroup by ID
export const fetchSubGroupById = async (
  subId: string
): Promise<SubGroupsResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await axios.get<SubGroupsResponse>(
      `${API_BASE_URL}/lookups/sub-group/${subId}`,
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
      "Error fetching sub-group by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch sub-group by ID"
    );
  }
};
// Fetch a single tax by ID
// // Fetch a single subgroup by ID
// export const fetchSubGroupById = async (
//   subId: string
// ): Promise<SubGroupResponse> => { // Change return type to SubGroupResponse
//   try {
//     const response = await axios.get<SubGroupResponse>(
//       `${API_BASE_URL}/lookups/sub-group/${subId}`,
//       {
//         withCredentials: true,
//       }
//     );
//     return response.data;
//   } catch (error: any) {
//     console.error(
//       "Error fetching sub-group by ID",
//       error.response?.data || error.message
//     );
//     throw new Error(
//       error.response?.data?.message || "Failed to fetch sub-group by ID"
//     );
//   }
// };

// Update  by ID
export const updateSubGroupsById = async (
  subId: string,
  updatedSubGroupData: Partial<SubGroupData>
): Promise<SubGroupData> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await axios.put<SubGroupData>(
      `${API_BASE_URL}/lookups/sub-group/${subId}`,
      updatedSubGroupData,
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
      "Error updating Sub Group by ID",
      error.response?.data || error.message
    );
 const errorMessage = error.response?.data?.error || "Failed to update Sub Group by ID";
    throw new Error(errorMessage);
  }
};

// Delete
export const deleteSubGroups = async (
  subId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await axios.delete<{ success: boolean; message: string }>(
      `${API_BASE_URL}/lookups/sub-group/${subId}`,
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
      "Error deleting sub-group",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to delete sub-group"
    );
  }
};

// Create a new
export const createSubGroup = async (
  subGroupData: SubGroupData
): Promise<SubGroupData> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await axios.post<SubGroupData>(
      `${API_BASE_URL}/lookups/sub-group/`,
      subGroupData, // Directly pass
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
      "Error creating sub-group:",
      error.response?.data || error.message
    );
   const errorMessage = error.response?.data?.error || "Failed to create sub-group";
    throw new Error(errorMessage);
  }
};

// Update tax status by ID
export const updateTaxStatusById = async (
  id: string,
  status: boolean
): Promise<SubGroupData> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response: AxiosResponse<{
      success: boolean;
      message: string;
      data: SubGroupData;
    }> = await axios.patch(
      `${API_BASE_URL}/lookups/sub-group/${id}/status`,
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
    return response.data.data;
  } catch (error: any) {
    console.error(
      "Error updating sub-group status",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update sub-group status"
    );
  }
};
