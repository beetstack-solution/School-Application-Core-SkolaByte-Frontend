const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";
import api from "@/api/axiosInstance";


export interface MappingsResponse {
    success: boolean;
    message: string;
    data: {
      data: TransportMappingEntry[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }
  
  export interface TransportMappingEntry {
    _id: string;
    class: string;
    division: string;
    createdAt: string;
    studentTransportMapping: StudentTransportEntry[];
  }
  
  export interface StudentTransportEntry {
    studentId: string;
    firstName: string;
    lastName: string;
    rollNumber: string;
    place: string;
    dropLocation: string;
    vehicle: Vehicle | {}; // could be empty object or a populated vehicle
  }
  
  export interface Vehicle {
    _id: string;
    name: string;
  }
export const getAllStudentTransportInfo = async (page: number, limit: number) => {
    try {
        const token =  getAdminBearerToken();
        const response = await api.get<MappingsResponse>(
            `${API_BASE_URL}/student-transport-mapping`,
            {
                params: {
                    page,
                    limit
                },
                withCredentials: true,
                headers: {
                    "x-api-key": apikey,
                    "x-app-version": appVersion,
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
}  

export const createStudentTransportInfo = async (data: any) => {
    try {
        const token = getAdminBearerToken();
        const response = await api.post<MappingsResponse>(
            `${API_BASE_URL}/student-transport-mapping`,
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
    } catch (error) {
        throw error;
    }
}

export const updateStudentTransportInfo = async (id: string, data: any) => {
    try {
        const token = getAdminBearerToken();
        const response = await api.put<MappingsResponse>(
            `${API_BASE_URL}/student-transport-mapping/${id}`,
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
    } catch (error) {
        throw error;
    }
}

export const deleteStudentTransportInfo = async (id: string) => {
    try {
        const token = getAdminBearerToken();
        const response = await api.delete<MappingsResponse>(
            `${API_BASE_URL}/student-transport-mapping/${id}`,
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
    } catch (error) {
        throw error;
    }
}


export const getStudentTransportInfoById = async (id: string) => {
    try {
        const token = getAdminBearerToken();
        const response = await api.get<MappingsResponse>(
            `${API_BASE_URL}/student-transport-mapping/${id}`,
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
    } catch (error) {
        throw error;
    }
}

export const getStudentTransportInfoStatus = async (id: string,status: boolean ) => {
    try {
        const token = getAdminBearerToken();
        const response = await api.patch<MappingsResponse>(
            `${API_BASE_URL}/student-transport-mapping/${id}/status`,
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
    } catch (error) {
        throw error;
    }
}
