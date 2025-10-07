import axios, { AxiosResponse } from "axios";
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "../../tokenHelper";
import api from "../../axiosInstance";
interface Category {
  _id: string;
  code: string;
  categoryName: string;
}
export interface AccountGroup {
  message: string;
  _id: string;
  code: string;
  groupName: string;
  category: Category;
  status: boolean;
  isDeleted: boolean;
  createdBy: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AccountGroupResponse {
  data: AccountGroup;
  success: boolean;
  message?: string;
  error?: string;
  accountGroups: AccountGroup[];
}
export interface AccountGroupResponse {
  success: boolean;
  message?: string;
  error?: string;
  accountGroup: AccountGroup;
}

export const fetchAccountGroup = async (): Promise<AccountGroupResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.get<AccountGroupResponse>(
      `/lookups/account-group/`,
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

//get by id
export const fetchGrouptById = async (
  groupId: string
): Promise<AccountGroupResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.get<AccountGroupResponse>(
      `/lookups/account-group/${groupId}`,
      {
        withCredentials: true,
        headers: {
          "x-api-key": apikey,
          "x-app-version": appVersion,
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return response.data; // This should return the CurrencyResponse type
  } catch (error: any) {
    console.error(
      "Error fetching account-group by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch account-group by ID"
    );
  }
}

// status update
export const updateCurrencyFormatStatus = async (
  id: string,
  status: boolean
): Promise<AccountGroupResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response: AxiosResponse<AccountGroupResponse> = await api.patch(
      `/lookups/account-group/${id}/status`,
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
      "Error updating account-group status:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update account-group status"
    );
  }
};

// dealete by id
export const deleteGroup = async (
  groupId: string
): Promise<any> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.delete(
      `/lookups/account-group/${groupId}`,
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
    console.error("Error deleting account-group", error);
    throw error;
  }
};

// create
export const creategroup = async (groupData: AccountGroupResponse): Promise<AccountGroupResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.post<AccountGroupResponse>(
      `/lookups/account-group/`,
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
      "Error creating group",
      error.response?.data || error.message
    );

    if (error.response?.data?.error) {
      throw new Error(error.response?.data?.error);
    } else if (error.response?.data?.message) {
      // If the API returns a 'message' field, throw that message
      throw new Error(error.response?.data?.message);
    } else {
      // If the error doesn't contain a specific message, provide a fallback message
      throw new Error("An unexpected error occurred while creating the Account Group.");
    }
  }
};


export const updateGroupsById = async (
  grpId: string,
  updatedGroupData: Partial<AccountGroup>
): Promise<AccountGroup> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.put<AccountGroup>(
      `/lookups/account-group/${grpId}`,
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
      "Error updating Sub Group by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update Sub Group by ID"
    );
  }
};