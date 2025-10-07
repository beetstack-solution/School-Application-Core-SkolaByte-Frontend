const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";
import api from "@/api/axiosInstance";

interface AcademicYear {
  academicYear: string;
  startMonth: string;
  endMonth: string;
}

interface User {
  name: string;
  email: string;
}

export interface SubjectData {
  _id: string;
  academicYear: AcademicYear;
  name: string;
  code: string;
  status: boolean;
  createdBy: User;
  createdAt: string;
  updatedBy?: Partial<User>; 
  userUpdatedDate:string

}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    name: string;
    academicYear: any;
    data: SubjectData[]; 
    total: number; 
  };
}

interface CreateSubjectPayload {
    name: string;
    academicYear: string;
  }

// create subjects
export const createSubject = async (
    data: CreateSubjectPayload
  ): Promise<ApiResponse> => {
    try {
      const token = await getAdminBearerToken();
      if (!token) {
        throw new Error("Authentication token is missing");
      }
      const response = await api.post<ApiResponse>(
        `/lookups/subject/`,
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
        "Error creating subject:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Failed to create subject"
      );
    }
  };

//   update by subject
export const updateSubjectById = async (
    id: string,
    updatedsubjectsData: Partial<CreateSubjectPayload>
  ): Promise<ApiResponse> => {
    try {
      const token = await getAdminBearerToken();
      if (!token) {
        throw new Error("Authentication token is missing");
      }
  
      const response = await api.put<ApiResponse>(
        `/lookups/subject/${id}`,
        updatedsubjectsData,
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
        "Error updating subjects by ID",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Failed to update subjects by ID"
      );
    }
  };

//   fetch by id
export const fetchSubjectById = async (id: string): Promise<ApiResponse> => {
    try {
      const token = await getAdminBearerToken();
      if (!token) {
        throw new Error("Authentication token is missing");
      }
      const response = await api.get<ApiResponse>(`/lookups/subject/${id}`, {
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
        "Error fetching subject by ID",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Failed to fetch subject by ID"
      );
    }
  };
  

// fetch subjects

export const fetchSubjects = async (
    page : number,
    limit : number,
  ): Promise<{ subjects: SubjectData[]; total: number }> => {
    try {
      const token = await getAdminBearerToken();
      if (!token) {
        throw new Error("Authentication token is missing");
      }
  
      const response = await api.get<ApiResponse>(`/lookups/subject`, {
        params: { page, limit },
        headers: {
          "x-api-key": apikey,
          "x-app-version": appVersion,
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Fix: Extract data correctly from nested response
      const { data } = response.data; // First level `data`
      
      return {
        subjects: data.data, // Extract the array from second-level `data`
        total: data.total, // Extract total count
      };
    } catch (error: any) {
      console.error(
        "Error fetching subjects",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Failed to fetch subjects"
      );
    }
  };
    
//   udate Sataus

export const updateStatusById = async (
    id: string,
    status: boolean
  ): Promise<ApiResponse> => {
    try {
      const token = await getAdminBearerToken();
      if (!token) {
        throw new Error("Authentication token is missing");
      }
  
      const response = await api.patch(
        `lookups/subject/${id}/status`,
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
      console.log("API Response Data:", response.data);
  
      return response.data;
    } catch (error: any) {
      console.error(
        "Error updating subject status",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Failed to update subject status"
      );
    }
  };
  
// delete subject

export const deleteData = async (
    id: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const token = await getAdminBearerToken();
      if (!token) {
        throw new Error("Authentication token is missing");
      }
      const response = await api.delete<{ success: boolean; message: string }>(
        `lookups/subject/${id}`,
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
        "Error deleting subject",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Failed to delete subject"
      );
    }
  };
  