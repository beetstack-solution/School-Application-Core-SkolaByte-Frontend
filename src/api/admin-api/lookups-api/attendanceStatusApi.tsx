const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";
import api from "@/api/axiosInstance";

interface CreatedBy {
  name: string;
  email: string;
}

interface UpdatedBy {
  name: string;
  email: string;
}

export interface AttendanceStatusData {
  updatedAt(updatedAt: any): import("react").ReactNode;
  _id: string;
  name: string;
  code: string;
  description: string;
  status: boolean; 
  createdBy: CreatedBy;
  createdAt: string;
  updatedBy?: UpdatedBy;
  isDeleted: boolean;
  __v: number;
  userUpdatedBy: {
    _id: string;
    name: string;
    email: string;
  };
  userUpdatedDate:string
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    data: AttendanceStatusData[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AttendanceStatusResponse {
  success: boolean;
  message?: string;
  data: AttendanceStatusData[];
}

export interface SingleAttendanceStatusResponse {
  success: boolean;
  message?: string;
  data: AttendanceStatusData;
}

// Create Attendance Status
export const createAttendanceStatus = async (
  data: AttendanceStatusResponse
): Promise<AttendanceStatusResponse> => {
  try {
    const token = await getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.post<AttendanceStatusResponse>(
      `/lookups/attendance-status/`,
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
      "Error creating attendance status:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to create attendance status"
    );
  }
};

// Edit Attendance Status
export const updateAttendanceStatusById = async (
  id: string,
  updatedAttendanceStatusData: Partial<AttendanceStatusResponse>
): Promise<AttendanceStatusResponse> => {
  try {
    const token = await getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.put<AttendanceStatusResponse>(
      `/lookups/attendance-status/${id}`,
      updatedAttendanceStatusData,
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
      "Error updating attendance status by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update attendance status by ID"
    );
  }
};

// Fetch Attendance Statuses
export const fetchAttendanceStatuses = async (
  page = 0,
  limit = 10
): Promise<{ attendanceStatuses: AttendanceStatusData[]; total: number }> => {
  try {
    const token = await getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.get<ApiResponse>(`/lookups/attendance-status`, {
      params: { page, limit },
      headers: {
        "x-api-key": apikey,
        "x-app-version": appVersion,
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      attendanceStatuses: response.data.data.data,
      total: response.data.data.total,
    };
  } catch (error: any) {
    console.error(
      "Error fetching attendance statuses",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch attendance statuses"
    );
  }
};

// Get Attendance Status by ID
export const fetchAttendanceStatusById = async (
  id: string
): Promise<SingleAttendanceStatusResponse> => {
  try {
    const token = await getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.get<SingleAttendanceStatusResponse>(
      `/lookups/attendance-status/${id}`,
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
      "Error fetching attendance status by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch attendance status by ID"
    );
  }
};

// Update Attendance Status Status (Activate/Deactivate)
export const updateAttendanceStatusStatus = async (
  id: string,
  status: boolean
): Promise<ApiResponse> => {
  try {
    const token = await getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.patch(
      `/lookups/attendance-status/${id}/status`,
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
    console.error(
      "Error updating attendance status status",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update attendance status status"
    );
  }
};

// Delete Attendance Status
export const deleteAttendanceStatus = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const token = await getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.delete<{ success: boolean; message: string }>(
      `/lookups/attendance-status/${id}`,
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
      "Error deleting attendance status",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to delete attendance status"
    );
  }
};