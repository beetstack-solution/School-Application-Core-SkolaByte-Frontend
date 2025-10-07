// import api, { AxiosResponse } from "api";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";
import api from "@/api/axiosInstance";

export interface AttendanceSummaryResponse {
    success: boolean;
    message: string;
    data: AttendanceSummary[];
}

export interface AttendanceSummary {
    className: string;
    divisionName: string;
    totalStudents: number;
    presentCount: number;
    absentCount: number;
}

export interface AttendanceSummary {
    className: string;
    divisionName: string;
    studentName: string;
    totalStudents: number;
    presentCount: number;
    absentCount: number;
}




export const fetchAttendanceReports = async (startDate: string, endDate: string): Promise<AttendanceSummaryResponse> => {
    try {
        const token = getAdminBearerToken();
        if (!token) {
            throw new Error("Authentication token is missing");
        }

        const response = await api.get<AttendanceSummaryResponse>(
            `${API_BASE_URL}/attendance-report/summary`,
            {
                withCredentials: true,
                headers: {
                    "x-api-key": apikey,
                    "x-app-version": appVersion,
                    Authorization: `Bearer ${token}`,
                },
               params: {
                    startDate,
                    endDate,
                    },
            }
        );

        return response.data;
    } catch (error: any) {
        console.error(
            "Error fetching attendance reports",
            error.response?.data || error.message
        );
        throw new Error(
            error.response?.data?.message || "Failed to fetch attendance reports"
        );
    }
};


export const fetchStudentsAttendanceReports = async (startDate: string, endDate: string,student?:string): Promise<AttendanceSummaryResponse> => {
    try {
        const token = getAdminBearerToken();
        if (!token) {
            throw new Error("Authentication token is missing");
        }

         const params: Record<string, string> = {
      startDate,
      endDate
    };

    // Only add student to params if it has a value
    if (student) {
      params.student = student;
    }

        const response = await api.get<AttendanceSummaryResponse>(
            `${API_BASE_URL}/attendance-report/summary`,
            {
                withCredentials: true,
                headers: {
                    "x-api-key": apikey,
                    "x-app-version": appVersion,
                    Authorization: `Bearer ${token}`,
                },
               params,
                    
            }
        );

        return response.data;
    } catch (error: any) {
        console.error(
            "Error fetching attendance reports",
            error.response?.data || error.message
        );
        throw new Error(
            error.response?.data?.message || "Failed to fetch attendance reports"
        );
    }
};
