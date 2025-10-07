import  { AxiosResponse } from "axios";
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";
import api from "@/api/axiosInstance";
interface Category {
  _id: string;
  code: string;
  categoryName: string;
}

export interface GroupData {
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

export interface GroupDataResponse {
  success: boolean;
  message?: string;
  data: GroupData[];
}

// Fetch all
export const fetchGroupByAccountGroup =
  async (): Promise<GroupDataResponse> => {
    try {
      const response = await api.get<GroupDataResponse>(
        `/dropdown-list/dd-group-account-groups/`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error: any) {
      console.error(
        "Error fetching Group By AccountGroup",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Failed to fetch Group By AccountGroup"
      );
    }
  };

  interface Group {
    _id: string;
    code: string;
    groupName: string;
  }
  
  interface Category {
    _id: string;
    code: string;
  }
  
  interface CreatedBy {
    _id: string;
    name: string;
    email: string;
  }
  
  export interface AdminGroupData {
    _id: string;
    subGroupName: string;
    code: string;
    group: Group;
    category: Category;
    status: boolean;
    isDeleted: boolean;
    createdBy: CreatedBy | null;
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
    userUpdatedBy?: string;
    userUpdatedDate?: string;
  }
  
  export interface SubGroupResponse {
    success: boolean;
    message?: string;
    subGroups: AdminGroupData[];
  }
  export interface SubGroupResponse {
    success: boolean;
    message?: string;
    subGroup: AdminGroupData;
  }
  
  export const fetchAdminGroup = async (): Promise<SubGroupResponse> => {
    try {
        const token = getAdminBearerToken();
        if (!token) {
          throw new Error("Authentication token is missing");
        }
      const response = await api.get<SubGroupResponse>(
        `/lookups/admin-group/`,
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
        "Error fetching admin-group",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Failed to fetch admin-group"
      );
    }
  };

  //get by id
export const fetchAdminGroupById =async (
  groupId: string
): Promise<SubGroupResponse>=>{
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.get<SubGroupResponse>(
      `/lookups/admin-group/${groupId}`,
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
      "Error fetching admin-group by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch admin-group by ID"
    );
  }
}
  
export const updateAdminGroupStatus = async (
  id: string,
  status: boolean
): Promise<SubGroupResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response: AxiosResponse<SubGroupResponse> = await api.patch(
      `/lookups/admin-group/${id}/status`,
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
      "Error updating admin-group status:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update admin-group status"
    );
  }
};

  // dealete by id
  export const deleteAdminGroup = async (
    groupId: string
  ): Promise<any> => {
    try {
        const token = getAdminBearerToken();
        if (!token) {
          throw new Error("Authentication token is missing");
        }
      const response = await api.delete(
        `/lookups/admin-group/${groupId}`,
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
      console.error("Error deleting admin-group", error);
      throw error;
    }
  };

    // create
export const createAdmingroup =async (groupData:SubGroupResponse):Promise<SubGroupResponse>=>{
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.post<SubGroupResponse>(
      `/lookups/admin-group/`,
      groupData,
      { withCredentials: true,
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
      "Error creating admin group",
      error.response?.data || error.message
    );
   const errorMessage = error.response?.data?.error || "Failed to create admin group";
    throw new Error(errorMessage);
  }
}

export const updateAdminGroupsById = async (
  grpId: string,
  updatedGroupData: Partial<AdminGroupData>
): Promise<AdminGroupData> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.put<AdminGroupData>(
      `/lookups/admin-group/${grpId}`,
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
      "Error updating admin Group by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update admin Group by ID"
    );
  }
};