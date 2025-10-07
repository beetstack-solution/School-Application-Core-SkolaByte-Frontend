const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";
import api from "@/api/axiosInstance";
import { AxiosResponse } from "axios";

export interface AcademicYearData {
  updatedBy: any;
  createdBy: any;
  userUpdatedDate: string | number | Date;
  _id: string;
  code: string;
  academicYear: string;
//   endYear: string;
  startMonth: string;
  endMonth: string;
  name:string
  email:string;
  status: boolean;
  isDeleted: boolean;
  createdAt: string;

}

export interface AcademicYearResponse {
  success: boolean;
  message?: string;
  data: AcademicYearData [];
}

export interface SingleAcademicYearResponse {
  success: boolean;
  message?: string;
  data: AcademicYearData ;
}

// Fetch all academic years
export const fetchAcademicYears = async (
  page: number ,
  limit: number,
): Promise<AcademicYearResponse> => {
  try {
    const token = await getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.get<AcademicYearResponse>("/lookups/academic-year/", {
      withCredentials: true,
      params: { page, limit },
      headers: {
        "x-api-key": apikey,
        "x-app-version": appVersion,
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching academic years", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch academic years");
  }
};

// Fetch a single academic year by ID
export const fetchAcademicYearById = async (id: string): Promise<SingleAcademicYearResponse> => {
  try {
    const token = await getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.get<SingleAcademicYearResponse>(`/lookups/academic-year/${id}`, {
      withCredentials: true,
      headers: {
        "x-api-key": apikey,
        "x-app-version": appVersion,
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching academic year by ID", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch academic year by ID");
  }
};

// Create a new academic year
export const createAcademicYear = async (academicYearData: AcademicYearData ): Promise<SingleAcademicYearResponse> => {
  try {
    const token = await getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.post<SingleAcademicYearResponse>("/lookups/academic-year/", academicYearData, {
      withCredentials: true,
      headers: {
        "x-api-key": apikey,
        "x-app-version": appVersion,
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error creating academic year", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to create academic year");
  }
};

// Update an academic year by ID
export const updateAcademicYearById = async (id: string, updatedData: Partial<AcademicYearData >): Promise<SingleAcademicYearResponse> => {
  try {
    const token = await getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.put<SingleAcademicYearResponse>(`/lookups/academic-year/${id}`, updatedData, {
      withCredentials: true,
      headers: {
        "x-api-key": apikey,
        "x-app-version": appVersion,
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error updating academic year by ID", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to update academic year by ID");
  }
};

// Delete an academic year
export const deleteAcademicYear = async (id: string): Promise<{ success: boolean; message: string }> => {
  try {
    const token = await getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.delete<{ success: boolean; message: string }>(`/lookups/academic-year/${id}`, {
      withCredentials: true,
      headers: {
        "x-api-key": apikey,
        "x-app-version": appVersion,
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error deleting academic year", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to delete academic year");
  }
};

export const updateAcademicYearStatus = async (id: string, status: boolean): Promise<SingleAcademicYearResponse> => {
    try {
      const token = await getAdminBearerToken();
      if (!token) {
        throw new Error("Authentication token is missing");
      }
      const response = await api.patch<SingleAcademicYearResponse>(`/lookups/academic-year/${id}/status`,
         { status,id }, {
        withCredentials: true,
        headers: {
          "x-api-key": apikey,
          "x-app-version": appVersion,
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("Error updating academic year status", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to update academic year status");
    }
  };
  