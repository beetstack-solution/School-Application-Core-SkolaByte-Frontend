import axios, { AxiosResponse } from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";
import api from "@/api/axiosInstance";



export interface ExamData {
  subjects: any;
  division: any;
  status: any;
  createdBy: any;
  updatedAt: any;
  createdAt: any;
  _id: string;
  name: string;
  class: {
    id: string;
    name: string;
  }
  subject: {
    id: string;
    name: string;
  }
  examType: {
    id: string;
    name: string;
  }
  academicYear: {
    id: string;
    academicYear: string;
  };
  date: string;
  duration: number;
  totalMarks: number;
  id: string;
  userUpdatedBy: {
    _id: string;
    name: string;
    email: string;
  };
  userUpdatedDate: string
}

export interface ExamResponse {
  success: boolean;
  message: string;
  data: ExamData;
}

export interface ExamsDetailResponse {
  success: boolean;
  message: string;
  data?: ExamData[];
}

// Create an Exam
export const createExam = async (examData: ExamData): Promise<ExamResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.post<ExamResponse>("/lookups/exam", examData, {
      withCredentials: true,
      headers: {
        "x-api-key": apikey,
        "x-app-version": appVersion,
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error creating exam", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to create exam");
  }
};

// Fetch all Exams
export const fetchExams = async (
  page: number,
  limit: number,
  academicYear?: string,
  classId?: string,
  division?: string,
  examType?: string,
  startDate?: string,
  endDate?: string
): Promise<any> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.get<any>("/lookups/exam", {
      params: {
        page,
        limit,
        academicYear,
        class: classId,
        division,
        examType,
        startDate,
        endDate
      },
      withCredentials: true,
      headers: {
        "x-api-key": apikey,
        "x-app-version": appVersion,
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error fetching exams", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch exams");
  }
};

// Fetch Exam by ID
export const fetchExamById = async (Id: string): Promise<ExamResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.get<ExamResponse>(`/lookups/exam/${Id}`, {
      withCredentials: true,
      headers: {
        "x-api-key": apikey,
        "x-app-version": appVersion,
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error fetching exam by ID", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch exam by ID");
  }
};

// Update Exam by ID
export const updateExamById = async (
  id: string,
  updatedData: Partial<ExamData>
): Promise<ExamResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.put<ExamResponse>(`/lookups/exam/${id}`, updatedData, {
      withCredentials: true,
      headers: {
        "x-api-key": apikey,
        "x-app-version": appVersion,
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error updating exam by ID", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to update exam by ID");
  }
};

// Delete Exam by ID
export const deleteExam = async (id: string): Promise<any> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.delete(`/lookups/exam/${id}`, {
      withCredentials: true,
      headers: {
        "x-api-key": apikey,
        "x-app-version": appVersion,
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting exam", error);
    throw error;
  }
};

// Update Exam status
export const updateExamStatus = async (
  id: string,
  status: boolean
): Promise<any> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response: AxiosResponse<ExamResponse> = await api.patch(
      `/lookups/exam/${id}/status`,
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
    console.error("Error updating exam status:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to update exam status");
  }
};
