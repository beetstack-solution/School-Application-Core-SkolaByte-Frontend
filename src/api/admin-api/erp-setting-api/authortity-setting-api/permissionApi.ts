
import api from "@/api/axiosInstance";
import { getAdminBearerToken } from "@/helpers/tokenHelper";
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;

//===================================================================================

// Types for getAllModulePermissionsDataList
interface PermissionReturnDataModuleType {
  _id: string;
  name: string;
  code: string;
}

export interface GetAllModulePermissionData {
  _id: string;
  code: string;
  module: PermissionReturnDataModuleType;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetAllModulePermissionReturnData {
  success: boolean;
  dataList?: GetAllModulePermissionData[];
  message?: string;
}

export interface GetAllModulePermissionsApiResponseType {
  data: GetAllModulePermissionReturnData;
  status: number;
}

// Types for getPermissionById
export interface ModulePermissionByIdData {
  _id: string;
  code: string;
  module: PermissionReturnDataModuleType;
  accessList: PermissionAccessList[];
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetModulePermissionByIdResponse {
  success: boolean;
  permissionData?: ModulePermissionByIdData;
  message?: string;
}

export interface GetModulePermissionByIdApiResponse {
  data: GetModulePermissionByIdResponse;
  status: number;
}

// AddModulePermission types
export interface PermissionAccessList {
  moduleRef: string;
  actionList: string[];
}

export interface AddModulePermissionParams {
  module: string;
  accessList: PermissionAccessList[];
}

export interface AddModulePermissionResponseData {
  success: boolean;
  message?: string;
}

export interface AddModulePermissionApiResponse {
  data: AddModulePermissionResponseData;
  status: number;
}

// Types for changeModulePermissionStatus
export interface ChangeStatusModulePermissionsRes {
  success: boolean;
  message: string;
}

export interface ChangeStatusModulePermissionsApiResponseType {
  data: ChangeStatusModulePermissionsRes;
  status: number;
}

// Types for update permission
export interface UpdateModulePermissionRequestBody {
  accessList: string[];
}

export interface UpdateModulePermissionResponseData {
  success: boolean;
  message: string;
}

export interface UpdateModulePermissionApiResponseType {
  data: UpdateModulePermissionResponseData;
  status: number;
}

//===================================================================================

export const getAllModulePermissionsDataList = async (
  moduleType: string
): Promise<GetAllModulePermissionsApiResponseType> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.get(
      `/lookups/rolePermission/all/${moduleType}`,
      {
        withCredentials: true,
        headers: {
          "x-api-key": apikey,
          "x-app-version": appVersion,
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response, "data");

    return {
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    console.error("Error fetching module permissions data:", error);
    throw error;
  }
};

export const getModulePermissionById = async (
  id: string
): Promise<GetModulePermissionByIdApiResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.get(
      `/permissions/module/${id}`,
      {
        withCredentials: true,
        headers: {
          "x-api-key": apikey,
          "x-app-version": appVersion,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      data: response.data,
      status: response.status,
    };
  } catch (error: any) {
    console.error("Error fetching module permission by ID:", error);
    throw error;
  }
};

export const addModulePermission = async (
  params: AddModulePermissionParams
): Promise<AddModulePermissionApiResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.post(
      `/permissions/module/add`,
      params,
      {
        withCredentials: true,
        headers: {
          "x-api-key": apikey,
          "x-app-version": appVersion,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    console.error("Error adding module permission:", error);
    throw error;
  }
};

export const changeModulePermissionStatus = async (
  id: string
): Promise<ChangeStatusModulePermissionsApiResponseType> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.put(
      `/permissions/module/status/${id}`,
      {},
      {
        withCredentials: true,
        headers: {
          "x-api-key": apikey,
          "x-app-version": appVersion,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    console.error("Error changing module permission status:", error);
    throw error;
  }
};

export const deleteModulePermissionById = async (
  id: string
): Promise<{
  data: any;
  success: boolean;
  message: string;
}> => {
  try {
    const token = await getAdminBearerToken();
    const response = await api.delete(
      `/lookups/rolePermission/${id}`,
      {
        headers: {
          "x-api-key": apikey,
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to delete module permission"
    );
  }
};

export const updateModulePermission = async (
  id: string,
  accessList: PermissionAccessList[]
): Promise<UpdateModulePermissionApiResponseType> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.put(
      `/lookups/permission/edit/${id}`,
      { accessList },
      {
        withCredentials: true,
        headers: {
          "x-api-key": apikey,
          "x-app-version": appVersion,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    console.error("Error updating module permission:", error);
    throw error;
  }
};
