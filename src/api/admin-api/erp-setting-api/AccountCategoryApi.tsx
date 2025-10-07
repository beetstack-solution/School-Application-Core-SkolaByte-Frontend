
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";
import api from "@/api/axiosInstance";
import { AxiosResponse } from "axios";
export interface CategoryData {
  _id: string;
  code: string;
  categoryName: string;
  status: boolean;
  isDeleted: boolean;
  createdBy: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CategoryResponse {
  success: boolean;
  message?: string;
  categories: CategoryData[];
}
export interface CategoryResponse {
  success: boolean;
  message?: string; category: CategoryData;
}

export const fetchAccountCategory = async (): Promise<CategoryResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.get<CategoryResponse>(
      `/lookups/category/`,
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
      "Error fetching category",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch category"
    );
  }
};

//get by id
export const fetchAccountCategoryById = async (
  id: string
): Promise<CategoryResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.get<CategoryResponse>(
      `/lookups/category/${id}`,
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
      "Error fetching category by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch category by ID"
    );
  }
};

// status update
export const updateStatus = async (
  id: string,
  status: boolean
): Promise<CategoryResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response: AxiosResponse<CategoryResponse> = await api.patch(
      `/lookups/category/${id}/status`,
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
      "Error updating category status:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update category status"
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
      `/lookups/category/${id}`,
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
    console.error("Error deleting category", error);
    throw error;
  }
};

// create
export const createData = async (
  addData: CategoryResponse
): Promise<CategoryResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.post<CategoryResponse>(
      `/lookups/category/`,
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
      "Error creating category",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to create category"
    );
  }
};
// update
export const updateTaxSlabById = async (
  id: string,
  updatedData: Partial<CategoryData>
): Promise<CategoryData> => {
  try {
    const response = await api.put<CategoryData>(
      `/lookups/category/${id}`,
      updatedData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error updating category by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update category by ID"
    );
  }
};