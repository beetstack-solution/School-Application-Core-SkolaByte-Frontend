import axios, { AxiosResponse } from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";
import api from "@/api/axiosInstance";

// Interface Types for Grade API
export interface GradeData {
  grades: any;
  code: string;
  academicYear: {
    academicYear: string
  }; 
  student: {
   firstName: string;
  lastName: string;
  }
  exam: {
    name: string;
  }; 
  totalMarks: number;
  marksObtained: number;
  percentage?: number;
  grade?: string;
  remarks?: string;
  status: boolean;
  _id?: string; // Optional in some cases (e.g., for fetch/update)
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt?: string;
  userUpdatedBy: {
    _id: string;
    name: string;
    email: string;
  };
  __v?: number;
}

export interface GradeResponse {
  success: boolean;
  message: string;
  data: GradeData;
}

export interface GradesDetailResponse {
  success: boolean;
  message: string;
  data?: GradeData[];
}

// Create Grade
export const createGrade = async (
  gradeData: GradeData
): Promise<GradeResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.post<GradeResponse>("/lookups/grade/", gradeData, {
      withCredentials: true,
      headers: {
        "x-api-key": apikey,
        "x-app-version": appVersion,
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error creating grade", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to create grade");
  }
};

// Fetch all Grades (with pagination)
export const fetchGrades = async (
   page = 1,
  limit = 10,
  search?: string,
  academicYear?:string,
   classId?: string,
  division?: string,
): Promise<GradesDetailResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.get<GradesDetailResponse>("/lookups/grade/", {
      params: { page, limit,academicYear,class: classId, division,
        ...(search && { search }), },
      withCredentials: true,
      headers: {
        "x-api-key": apikey,
        "x-app-version": appVersion,
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error fetching grades", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch grades");
  }
};

// Fetch Grade by ID
export const fetchGradeById = async (
  id: string
): Promise<GradeResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.get<GradeResponse>(`/lookups/grade/${id}`, {
      withCredentials: true,
      headers: {
        "x-api-key": apikey,
        "x-app-version": appVersion,
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error fetching grade by ID", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch grade by ID");
  }
};

// Update Grade by ID
export const updateGradeById = async (
  id: string,
  updatedData: Partial<GradeData>
): Promise<GradeResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.put<GradeResponse>(`/lookups/grade/${id}`, updatedData, {
      withCredentials: true,
      headers: {
        "x-api-key": apikey,
        "x-app-version": appVersion,
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error updating grade by ID", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to update grade by ID");
  }
};

// Delete Grade by ID
export const deleteGrade = async (id: string): Promise<any> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.delete(`lookups/grade/${id}`, {
      withCredentials: true,
      headers: {
        "x-api-key": apikey,
        "x-app-version": appVersion,
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error deleting grade", error);
    throw error;
  }
};

// Update Grade Status
export const updateGradeStatus = async (
  id: string,
  status: boolean
): Promise<any> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response: AxiosResponse<GradeResponse> = await api.patch(
      `lookups/grade/${id}/status`,
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

    console.log("API Response Data:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error updating grade status:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to update grade status");
  }
};
