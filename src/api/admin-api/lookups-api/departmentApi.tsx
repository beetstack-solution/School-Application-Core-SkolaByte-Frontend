import axios, { AxiosResponse } from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";
import api from "@/api/axiosInstance";

interface DepartmentResponse {
  success: boolean;
  message: string;
  data: {
    data: Designation[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface Designation {
  _id: string;
  name: string;
  code: string;
  status: boolean;
  createdBy: User;
  createdAt: string; // ISO date string
  updatedBy: Partial<User>;
}

interface User {
  name: string;
  email: string;
}


export const getDepartments = async (
  page: number,
  limit: number
): Promise<DepartmentResponse> => {
  try {
    const response: AxiosResponse<DepartmentResponse> = await api.get(
      `lookups/department/`,
      {
        params: {
          page: page,
          limit: limit,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching Designations", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch Designations");
  }
};

export const createDepartment = async (
  designation: Designation
): Promise<DepartmentResponse> => {
  try {
    const response: AxiosResponse<DepartmentResponse> = await api.post(
      `lookups/department/`,
      designation
    );
    return response.data;
  } catch (error: any) {
    console.error("Error creating Designation", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to create Designation");
  }
}

export const updateDepartment = async (
  id: string,
  designation: Designation
): Promise<DepartmentResponse> => {
  try {
    const response: AxiosResponse<DepartmentResponse> = await api.put(
      `lookups/department/${id}`,
      designation
    );
    return response.data;
  } catch (error: any) {
    console.error("Error updating Designation", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to update Designation");
  }
};
export const deleteDepartment = async (id: string): Promise<DepartmentResponse> => {
  try {
    const response: AxiosResponse<DepartmentResponse> = await api.delete(
      `lookups/department/${id}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error deleting Designation", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to delete Designation");
  }
}

export const getDepartmentById = async (id: string): Promise<DepartmentResponse> => {
  try {
    const response: AxiosResponse<DepartmentResponse> = await api.get(
      `lookups/department/${id}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching Designation by ID", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch Designation by ID");
  }
}

export  const updateDepartmentStatus = async (
  id: string,
  status: boolean
): Promise<DepartmentResponse> => {
    try {
        const response: AxiosResponse<DepartmentResponse> = await api.patch(
        `lookups/department/${id}/status`,
        { status: status }
        );
        return response.data;
    } catch (error: any) {
        console.error("Error updating Designation status", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to update Designation status");
    }
}