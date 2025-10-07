import api from "@/api/axiosInstance";
import { getAdminBearerToken } from "@/helpers/tokenHelper";


const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;




export interface AttendanceDTO {
  data: any;
  academicYear: string;
//   class: string;
//   division: string;
  attendanceType: string;
  date: string;
  fullDayTime?: string;
  halfDayTimes?: {
    firstHalf?: string;
    secondHalf?: string;
  };
  periodwise?: PeriodwiseAttendanceDTO[];
  teachers: AttendanceEntryDTO[];
  createdBy?: string;
}

export interface PeriodwiseAttendanceDTO {
  period: number;
  time: string;
  subject: string;
}

export interface AttendanceEntryDTO {
  teacher: string;
  code: string;
  fullDayStatus?: string;
  firstHalfStatus?: string;
  secondHalfStatus?: string;
  periodStatuses?: Array<{
    period: number;
    status: string;
    remarks?: string;
  }>;
  attendanceRemarks?: string;
  time?: string;
}

export interface Attendance {
  id: string;
  academicYear: string;
  class: string;
  division: string;
  attendanceType: string;
  date: string;
  fullDayTime?: string;
  halfDayTimes?: {
    firstHalf: string;
    secondHalf: string;
  };
  periodwise?: PeriodwiseAttendance[];
  teachers: AttendanceEntry[];
  status: boolean;
  isDeleted: boolean;
  createdBy: CreatedBy;
  createdAt: string;
  updatedAt: string;
  __v: number;
  deletedAt?: string;
  deletedBy?: string;
}

export interface PeriodwiseAttendance {
  period: number;
  time: string;
  subject: string;
}

export interface AttendanceEntry {
  teacher: string;
  code: string;
  fullDayStatus?: string;
  firstHalfStatus?: string;
  secondHalfStatus?: string;
  periodStatuses?: Array<{
    period: number;
    status: string;
    remarks?: string;
  }>;
  attendanceRemarks?: string;
  time?: string;
}

interface CreatedBy {
  name: string;
  email: string;
}




  export const fetchAttendance = async (
    startDate?: string,
  endDate?: string,
   firstHalfStatus?: string,
  secondHalfStatus?: string,
  search?: string,
  ): Promise<any> => {
    try {
      const token = await getAdminBearerToken();
      if (!token) {
        throw new Error("Authentication token is missing");
      }
  
      const params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (search) params.search = search;
    if (firstHalfStatus) params.firstHalfStatus = firstHalfStatus;
    if (secondHalfStatus) params.secondHalfStatus = secondHalfStatus;

    const response = await api.get("/teacher-attendance", {
      params,
      headers: {
        "x-api-key": apikey,
        "x-app-version": appVersion,
        Authorization: `Bearer ${token}`,
      },
    });
  
      return response.data;
    } catch (error: any) {
      console.error(
        "Error fetching attendance",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Failed to fetch attendance "
      );
    }
  };

  export const createAttendance = async (
    attendanceData: AttendanceDTO
  ): Promise<any> => {
    try {
      const token = await getAdminBearerToken();
      if (!token) {
        throw new Error("Authentication token is missing");
      }
  
      const response = await api.post("/teacher-attendance", attendanceData, {
        headers: {
          "x-api-key": apikey,
          "x-app-version": appVersion,
          Authorization: `Bearer ${token}`,
        },
      });
  
      return response.data;
    } catch (error: any) {
      console.error("Error creating attendance:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to create attendance");
    }
  };


  export const updateAttendance = async (
    attendanceId: string,
    attendanceData: AttendanceDTO
  ): Promise<any> => {
    try {
      const token = await getAdminBearerToken();
      if (!token) {
        throw new Error("Authentication token is missing");
      }
  
      const response = await api.put(`/teacher-attendance/${attendanceId}`, attendanceData, {
        headers: {
          "x-api-key": apikey,
          "x-app-version": appVersion,
          Authorization: `Bearer ${token}`,
        },
      });
  
      return response.data;
    } catch (error: any) {
      console.error("Error updating attendance:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to update attendance");
    }
  }

  export const fetchAttendanceById = async (id: string): Promise<AttendanceDTO> => {
    try {
        const token = getAdminBearerToken();
        if (!token) {
            throw new Error("Authentication token is missing");
        }

        const response = await api.get<AttendanceDTO>(`/teacher-attendance/${id}`, {
            withCredentials: true,
            headers: {
                "x-api-key": apikey,
                "x-app-version": appVersion,
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        console.error("Error fetching attendance by ID", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to fetch attendance by ID");
    }
};