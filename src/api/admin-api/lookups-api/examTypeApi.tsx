import axios, { AxiosResponse } from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";
import api from "@/api/axiosInstance";

// Exam Type Interface
export interface ExamTypeData {
  code: string;
  name: string;
  nameAlias: string;
  _id: string;
  status: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  userUpdatedBy: {
    _id: string;
    name: string;
    email: string;
  };
  __v: number;
}

export interface ExamTypeResponse {
  success: boolean;
  message: string;
  data: ExamTypeData;
}

export interface ExamTypesDetailResponse {
  success: boolean;
  message: string;
  data?: ExamTypeData[];
}

// Create Exam Type
export const createExamType = async (
  examTypeData: ExamTypeData
): Promise<ExamTypeResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.post<ExamTypeResponse>(
      "/lookups/exam-type",
      examTypeData,
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
      "Error creating exam type",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to create exam type");
  }
};

// Fetch Exam Types
export const fetchExamTypes = async (
  page: number,
  limit: number
): Promise<ExamTypesDetailResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.get<ExamTypesDetailResponse>("/lookups/exam-type", {
      params: { page, limit },
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
      "Error fetching exam types",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to fetch exam types");
  }
};

// Fetch Exam Type by ID
export const fetchExamTypeById = async (
  id: string
): Promise<ExamTypesDetailResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.get<ExamTypesDetailResponse>(`/lookups/exam-type/${id}`, {
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
      "Error fetching exam type by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch exam type by ID"
    );
  }
};

// Update Exam Type by ID
export const updateExamTypeById = async (
  id: string,
  updatedData: Partial<ExamTypeData>
): Promise<ExamTypesDetailResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.put<any>(`/lookups/exam-type/${id}`, updatedData, {
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
      "Error updating exam type by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update exam type by ID"
    );
  }
};

// Delete Exam Type
export const deleteExamType = async (id: string): Promise<any> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.delete(`/lookups/exam-type/${id}`, {
      withCredentials: true,
      headers: {
        "x-api-key": apikey,
        "x-app-version": appVersion,
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting exam type", error);
    throw error;
  }
};

// Update Exam Type status
export const updateExamTypeStatus = async (
  id: string,
  status: boolean
): Promise<any> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response: AxiosResponse<ExamTypesDetailResponse> = await api.patch(
      `/lookups/exam-type/${id}/status`,
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

    return response.data;
  } catch (error: any) {
    console.error(
      "Error updating exam type status:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update exam type status"
    );
  }
};
