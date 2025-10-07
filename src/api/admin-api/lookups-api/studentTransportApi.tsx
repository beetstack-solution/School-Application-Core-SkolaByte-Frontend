const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";
import api from "@/api/axiosInstance";

export interface TransportResponse {
    success: boolean;
    message: string;
    data: TransportPaginatedData;
}

export interface TransportPaginatedData {
    data: Transport[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface Transport {
    _id: string;
    academicYear: AcademicYear;
    busInfo: BusInfo;
    createdBy: Record<string, any>; // Adjust if structure known
    createdAt: string;
    userUpdatedDate: string;
    updatedBy: Record<string, any>; // Adjust if structure known
    studentMappings: StudentMapping[];
}

export interface AcademicYear {
    id: string;
    academicYear: string;
    startMonth: string;
    endMonth: string;
}

export interface BusInfo {
    busNumber: string;
    driver: Driver;
    assistant?: Assistant;
    busCapacity: number;
    route: Route;
}

export interface Driver {
    name: string;
    mobileNumber: string;
    address: string;
    licenseNumber: string;
}

export interface Assistant {
    name: string;
    mobileNumber: string;
}

export interface Route {
    routeName: string;
    startTiming: string;
    exactEndTiming: string;
}

export interface StudentMapping {
    studentId: string;
    destinationStop: string;
    studentDetails: StudentDetails;
}

export interface StudentDetails {
    _id: string;
    firstName: string;
    middleName: string;
    lastName: string;
    address: string;
    age: string;
    class: string;
    division: string;
    dob: string;
    gender: string;
    parentInfo: string;
    guardian?: string;
    status: boolean;
    isDeleted: boolean;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    userUpdatedBy?: string;
    userUpdatedDate?: string;
    deletedAt?: string;
    deletedBy?: string;
    imageUrl?: string;
}

export const getAllStudentTransport = async (
    page: number,
    limit: number
): Promise<TransportResponse> => {
    try {
        const token = getAdminBearerToken();
        if (!token) {
            throw new Error("Authentication token is missing");
        }
        const response = await api.get<TransportResponse>(
            `/lookups/student-transport`, {
            params: {
                page,
                limit,
            },

            withCredentials: true,
            headers: {
                Authorization: `Bearer ${token}`,
                "x-api-key": apikey,
                "x-app-version": appVersion,
            },
        }
        );
        return response.data;

    } catch (error: any) {
        console.error("Error fetching student transport data:", error);
        throw error; 

    }
}

export const createStudentTransport = async (
    transportData: Transport
): Promise<TransportResponse> => {
    try {
        const token = getAdminBearerToken();
        if (!token) {
            throw new Error("Authentication token is missing");
        }
        const response = await api.post<TransportResponse>(
            `/lookups/student-transport`, transportData, {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${token}`,
                "x-api-key": apikey,
                "x-app-version": appVersion,                
            },
        }
        );
        return response.data;

    } catch (error: any) {
        console.error("Error creating student transport data:", error);
        throw error; 

    }
}

export const updateStudentTransport = async (
    id: string,
    transportData: Transport
): Promise<TransportResponse> => {
    try {
        const token = getAdminBearerToken();
        if (!token) {
            throw new Error("Authentication token is missing");
        }
        const response = await api.put<TransportResponse>(
            `/lookups/student-transport/${id}`, transportData, {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${token}`,
                "x-api-key": apikey,
                "x-app-version": appVersion,                
            },
        }
        );
        return response.data;

    } catch (error: any) {
        console.error("Error updating student transport data:", error);
        throw error; 

    }
}

export const deleteStudentTransport = async (
    id: string
): Promise<TransportResponse> => {
    try {
        const token = getAdminBearerToken();
        if (!token) {
            throw new Error("Authentication token is missing");
        }
        const response = await api.delete<TransportResponse>(
            `/lookups/student-transport/${id}`, {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${token}`,
                "x-api-key": apikey,
                "x-app-version": appVersion,                
            },
        }
        );
        return response.data;

    } catch (error: any) {
        console.error("Error deleting student transport data:", error);
        throw error; 

    }
}

export const getStudentTransportById = async (
    id: string
): Promise<TransportResponse> => {
    try {
        const token = getAdminBearerToken();
        if (!token) {
            throw new Error("Authentication token is missing");
        }
        const response = await api.get<TransportResponse>(
            `/lookups/student-transport/${id}`, {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${token}`,
                "x-api-key": apikey,
                "x-app-version": appVersion,                
            },
        }
        );
        return response.data;

    } catch (error: any) {
        console.error("Error fetching student transport data:", error);
        throw error; 

    }
}

export const getStudentTransportByStudentStatus = async (
    studentId: string,
    status: boolean
): Promise<TransportResponse> => {
    try {
        const token = getAdminBearerToken();
        if (!token) {
            throw new Error("Authentication token is missing");
        }
        const response = await api.put<TransportResponse>(
            `/lookups/student-transport/update-status/${studentId}`, {
            status
        }, {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${token}`,
                "x-api-key": apikey,
                "x-app-version": appVersion,                
            },
        }
        );
        return response.data;

    } catch (error: any) {
        console.error("Error fetching student transport data:", error);
        throw error; 

    }
}

