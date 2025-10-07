import api from "@/api/axiosInstance";
import { getAdminBearerToken } from "@/helpers/tokenHelper";


const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;




export interface AttendanceDTO {
  data: any;
  academicYear: string;
  class: string;
  division: string;
  attendanceType: string;
  date: string;
  fullDayTime?: string;
  halfDayTimes?: {
    firstHalf?: string;
    secondHalf?: string;
  };
  periodwise?: PeriodwiseAttendanceDTO[];
  students: AttendanceEntryDTO[];
  createdBy?: string;
}

export interface PeriodwiseAttendanceDTO {
  period: number;
  time: string;
  subject: string;
  teacher: string;
}

export interface AttendanceEntryDTO {
  student: string;
  rollNumber: string;
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
  students: AttendanceEntry[];
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
  teacher: string;
}

export interface AttendanceEntry {
  student: string;
  rollNumber: string;
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
    classId: string,
    divisionId: string,
    startDate?: string,
  endDate?: string,
  search?: string
  ): Promise<any> => {
    try {
      const token = await getAdminBearerToken();
      if (!token) {
        throw new Error("Authentication token is missing");
      }
  
      const response = await api.get("/attendance", {
        params: { class: classId, division: divisionId,
          ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        ...(search && { search }),
         },
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
  
      const response = await api.post("/attendance", attendanceData, {
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
  
      const response = await api.put(`/attendance/${attendanceId}`, attendanceData, {
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

        const response = await api.get<AttendanceDTO>(`/attendance/${id}`, {
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