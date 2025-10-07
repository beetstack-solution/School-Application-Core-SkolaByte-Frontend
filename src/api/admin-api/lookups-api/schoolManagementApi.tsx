import axios, { AxiosResponse } from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";
import api from "@/api/axiosInstance";




interface SchoolManagementResponse {
  success: boolean;
  message: string;
  data: {
    data: SchoolStaff[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface SchoolStaff {
  _id: string;
  fullName: string;
  designation: {
    name: string;
    code: string;
  };
  email: string;
  phone?: string;
  imageUrl?: string; // Optional because some entries use profilePhoto instead
  profilePhoto?: string;
  joiningDate: string; // ISO date string
  department: {
    name: string;
    code: string;
  };
  qualification: string;
  status: boolean;
  createdBy: User;
  createdAt: string;
  updatedBy?: Partial<User>;
  userUpdatedDate?: string;
}

interface User {
  name: string;
  email: string;
}

export const getSchoolManagement = async (
  page: number,
  limit: number
): Promise<SchoolManagementResponse> => {
    try {
        const response: AxiosResponse<SchoolManagementResponse> = await api.get(
        `lookups/school-management/`,
        {
            params: {
            page: page,
            limit: limit,
            },
        }
        );
        return response.data;
    } catch (error: any) {
        console.error("Error fetching School Management", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to fetch School Management");
    }
}


export const createSchoolManagement = async (
  schoolManagement: SchoolStaff
): Promise<SchoolManagementResponse> => {
    try {
        const response: AxiosResponse<SchoolManagementResponse> = await api.post(
        `lookups/school-management/`,
        schoolManagement,
        );
        return response.data;
    } catch (error: any) {
        console.error("Error creating School Management", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to create School Management");
    }           
}

export const getSchoolManagementById = async (
  id: string
): Promise<SchoolManagementResponse> => {
    try {
        const response: AxiosResponse<SchoolManagementResponse> = await api.get(
        `lookups/school-management/${id}`,
        );
        return response.data;
    } catch (error: any) {
        console.error("Error fetching School Management by ID", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to fetch School Management by ID");
    }
}

export const updateSchoolManagement = async (
  id: string,
  schoolManagement: SchoolStaff
): Promise<SchoolManagementResponse> => {
    try {
        const response: AxiosResponse<SchoolManagementResponse> = await api.put(
        `lookups/school-management/${id}`,
        schoolManagement,
        );
        return response.data;
    } catch (error: any) {
        console.error("Error updating School Management", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to update School Management");
    }
}

export const deleteSchoolManagement = async (
  id: string
): Promise<SchoolManagementResponse> => {
    try {
        const response: AxiosResponse<SchoolManagementResponse> = await api.delete(
        `lookups/school-management/${id}`,
        );
        return response.data;
    } catch (error: any) {
        console.error("Error deleting School Management", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to delete School Management");
    }
}
export const updateSchoolManagementStatus = async (
  id: string,
  status: boolean
): Promise<SchoolManagementResponse> => {
    try {
        const response: AxiosResponse<SchoolManagementResponse> = await api.put(
        `lookups/school-management/${id}`,
        { status },
        );
        return response.data;
    } catch (error: any) {
        console.error("Error updating School Management status", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to update School Management status");
    }   
}