const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";
import api from "@/api/axiosInstance";
import { Gender } from "@/constants/enum";
import { ReactNode } from "react";
import config from "../../../../config";
const { API_BASE_URL } = config;

export interface Class {
  _id: string;
  name: string;
}
export interface attendanceType {
  code: any;
  _id: string;
  name: string;
}
export interface Division {
  _id: string;  // Simplified to just string
  id?: any;     // Optional if needed
  name: string;
}

export interface AcademicYear {
  _id: string;  // Simplified to just string
  id?: any;     // Optional if needed
  academicYear: string;
  startMonth: string;
  endMonth: string;
}

export interface Guardian {
  guardianName: string;
  contactNumber: string;
  relation: string;
  email: string;
  password: string;
}

export interface Parent {
  fatherName: string;
  motherName: string;
  fatherContactNumber: string;
  motherContactNumber: string;
  fatherOccupation: string;
  motherOccupation: string;
  email: string;
  password: string;
}

export interface CreatedBy {
  name: string;
  email: string;
}

export interface Student {
  imageUrl: any;
  _id: string;
  code: string;
  firstName: string;
  lastName: string;
  age: string;
  houseName: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  rollNumber: string;
  class: Class | string;  // Allow both Class object and string ID
  division: Division | string;
  academicYear: AcademicYear | string;
  dob: string;
  gender: Gender;
  sibling: boolean;
  parentInfo: Parent;
  guardian?: Guardian;
  status: boolean;
  createdBy: CreatedBy;
  createdAt: string;
  updatedAt?: string;
  updatedBy?: CreatedBy;
}



export interface StudentListResponse {
  success: boolean;
  message: string;
  data: {
    data: Student[];
    total: number;
  };
}

export interface SingleStudentResponse {
  success: boolean;
  message: string;
  data: {
    firstName: string;
    dob: string | number | Date;
    student: Student;
  };
}

// Create Student
export const createStudent = async (
  data: Partial<Student>
): Promise<SingleStudentResponse> => {
  try {
    const token = await getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.post<SingleStudentResponse>(
      `${API_BASE_URL}/student/`,

      data,
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
      "Error creating student:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to create student"
    );
  }
};

// Edit student
export const updateStudentById = async (
  id: string,
  updatedStudentData: Partial<any>
): Promise<SingleStudentResponse> => {
  try {
    const token = await getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.put<SingleStudentResponse>(
      `/student/${id}`,
      updatedStudentData,
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
      "Error updating student by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update student by ID"
    );
  }
};

// Fetch students
export const fetchStudents = async (
  page = 1,
  limit = 10,
  search?: string,
  filters?: {
    academicYear?: string;
    class?: string;
    division?: string;
    startDate?: string; // For createdAt range
    endDate?: string;  // For createdAt range
    sortByAlpha: boolean
  }
): Promise<{ studentsList: Student[]; total: number }> => {
  try {
    const token = await getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const params: Record<string, any> = { page, limit };

    if (search) {
      params.search = search;
    }

    if (filters) {
      // Apply individual filters if they exist
      if (filters.academicYear) params.academicYear = filters.academicYear;
      if (filters.class) params.class = filters.class;
      if (filters.division) params.division = filters.division;

      if (filters.startDate) {
        params.startDate = new Date(filters.startDate).toISOString();
      }
      if (filters.endDate) {
        params.endDate = new Date(filters.endDate).toISOString();
      }
      if (filters.sortByAlpha) {
        params.sortByAlpha = filters.sortByAlpha;
      }

    }

    const response = await api.get<StudentListResponse>("/student/", {
      params,
      headers: {
        "x-api-key": apikey,
        "x-app-version": appVersion,
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      studentsList: response.data.data.data,
      total: response.data.data.total,
    };
  } catch (error: any) {
    console.error("Error fetching students", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch students");
  }
};

// Fetch student by id
export const fetchStudentById = async (id: string): Promise<SingleStudentResponse> => {
  try {
    const token = await getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.get<SingleStudentResponse>(
      `${API_BASE_URL}/student/${id}`,  // Fixed double slash
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
      "Error fetching student by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch student by ID"
    );
  }
};

// Update student status
export const updateStudentStatusById = async (
  id: string,
  status: boolean
): Promise<SingleStudentResponse> => {
  try {
    const token = await getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.patch(
      `/student/${id}/status`,
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

    return response.data;
  } catch (error: any) {
    console.error(
      "Error updating student status",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update student status"
    );
  }
};

// Delete student
export const deleteStudent = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const token = await getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.delete<{ success: boolean; message: string }>(
      `/student/${id}`,
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
      "Error deleting student",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to delete student"
    );
  }
};

// Download Student Admission Slip PDF
export const downloadStudentAdmissionSlip = async (studentId: string): Promise<Blob> => {
  try {
    const token = await getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const schoolKey = localStorage.getItem('x-school-apikey');
    if (!schoolKey) {
      console.warn('x-school-apikey not found in localStorage');
    }
    const response = await fetch(`${API_BASE_URL}/student/${studentId}/download-slip`, {
      method: 'GET',
      headers: {
        "x-api-key": apikey,
        "x-app-version": appVersion,
        "x-school-apikey": schoolKey || '', // Only add if exists
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to download admission slip.');
    }

    const blob = await response.blob();
    return blob;
  } catch (error: any) {
    throw new Error(error.message || "Failed to download admission slip.");
  }
};


export const bulkImportStudents = async (file: File) => {
  try {
    const token = await getAdminBearerToken();
    if (!token) throw new Error("Authentication token is missing");

    const formData = new FormData();
    formData.append("file", file);
    const schoolKey = localStorage.getItem('x-school-apikey');

    if (!schoolKey) {
      console.warn('x-school-apikey not found in localStorage');
    }

    const response = await fetch(`${API_BASE_URL}/student/import-student-profile`, {
      method: "POST",
      headers: {
        "x-api-key": apikey,
        "x-app-version": appVersion,
        "x-school-apikey": schoolKey || '', // Only add if exists

        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    return await response.json();
  } catch (error: any) {
    console.error("Error importing students:", error);
    throw new Error(error.message || "Import failed.");
  }
};


