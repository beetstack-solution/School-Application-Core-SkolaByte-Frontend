import api from "@/api/axiosInstance";
import { getAdminBearerToken } from "@/helpers/tokenHelper";

const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;

export interface TimetableSubject {
    subject: string;
    teacher: string;
    startTime: string;
    endTime: string;
}

export interface TimetableDTO {
    class: string;
    division: string;
    subjects: TimetableSubject[];
    day: string;
    academicYear: string;
    code: string;
    createdBy: string;
}

export interface Timetable {
    timeTableSchedule: any;
    _id: string;
    class: string;
    division: string;
    subjects: TimetableSubject[];
    day: string;
    academicYear: string;
    code: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    status: boolean;
}

export interface CreateTimetableResponse {
    [x: string]: any;
    division: any;
    academicYear: any;
    success: boolean;
    message: string;
    data: Timetable;
}

export const createTimetable = async (
    data: Partial<Timetable>
): Promise<CreateTimetableResponse> => {
    try {
        const token = await getAdminBearerToken();
        if (!token) {
            throw new Error("Authentication token is missing");
        }

        const response = await api.post<CreateTimetableResponse>(
            `/lookups/time-table/`,
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
            "Error creating timetable:",
            error.response?.data || error.message
        );
        throw new Error(
            error.response?.data?.message || "Failed to create timetable"
        );
    }
};

export const fetchTimeTableById = async (id: string): Promise<CreateTimetableResponse> => {
    try {
      const token = await getAdminBearerToken();
      if (!token) {
        throw new Error("Authentication token is missing");
      }
      const response = await api.get<CreateTimetableResponse>(`/lookups/time-table/${id}`, {
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
        "Error fetching timetable by ID",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Failed to fetch timetable by ID"
      );
    }
  };


export const fetchTimeTablePdfById = async (id: string): Promise<Blob> => {
    try {
      const token = await getAdminBearerToken();
      if (!token) {
        throw new Error("Authentication token is missing");
      }
  
      const response = await api.get(`/lookups/time-table/${id}/pdf`, {
        responseType: "blob",
        headers: {
          "x-api-key": apikey,
          "x-app-version": appVersion,
          Authorization: `Bearer ${token}`,
        },
      });
  
      return response.data;
    } catch (error: any) {
      console.error(
        "Error fetching timetable PDF by ID",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Failed to fetch timetable PDF by ID"
      );
    }
  }

  export const fetchTimeTable = async (
    classId: string,
    divisionId: string,
    academicYearId:string,
    teacherId:string,
    days:string,
  ): Promise<any> => {
    try {
      const token = await getAdminBearerToken();
      if (!token) {
        throw new Error("Authentication token is missing");
      }
  
      const response = await api.get("/lookups/time-table", {
        params: { class: classId, division: divisionId,academicYear:academicYearId,teacher:teacherId,day:days },
        headers: {
          "x-api-key": apikey,
          "x-app-version": appVersion,
          Authorization: `Bearer ${token}`,
        },
      });
  
      return response.data;
    } catch (error: any) {
      console.error(
        "Error fetching timetable",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Failed to fetch yimetable "
      );
    }
  };

  export const UpdateTimeTable = async (
    id: string,
    UpdatedTimeTableData: Partial<Timetable>
  ): Promise<CreateTimetableResponse> => {
    try {
      const token = await getAdminBearerToken();
      if (!token) {
        throw new Error("Authentication token is missing");
      }
  
      const response = await api.put<CreateTimetableResponse>(
        `/lookups/time-table/${id}`,
        UpdatedTimeTableData,
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
        "Error updating Timetable by ID",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Failed to update teacher by ID"
      );
    }
  };

  export const updateTimeTableStatusById = async (
    id: string,
    status: boolean
  ): Promise<CreateTimetableResponse> => {
    try {
      const token = await getAdminBearerToken();
      if (!token) {
        throw new Error("Authentication token is missing");
      }
  
      const response = await api.patch(
        `/lookups/time-table/${id}/status`,
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
        "Error updating timetable status",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Failed to update timetable status"
      );
    }
  };

  export const deleteTimeTable = async (
    id: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const token = await getAdminBearerToken();
      if (!token) {
        throw new Error("Authentication token is missing");
      }
      const response = await api.delete<{ success: boolean; message: string }>(
        `/lookups/time-table/${id}`,
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
        "Error deleting timetable",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Failed to delete timetable"
      );
    }
  };