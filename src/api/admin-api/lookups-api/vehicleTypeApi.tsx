const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";
import api from "@/api/axiosInstance";

export interface TransportVehicle {
    _id: string;
    name: string;
    nameAlias: string;
    createdBy: {
        name: string;
        email: string;
    };
    createdAt: string; // ISO 8601 date string
}

export interface TransportVehicleResponseData {
    data: TransportVehicle[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface TransportVehicleResponse {
    success: boolean;
    message: string;
    data: TransportVehicleResponseData;
}
 export const fetchTransportVehicles = async (page: number, limit: number): Promise<TransportVehicleResponse> => {
    try {
        const token =  getAdminBearerToken();
        if (!token) {
            throw new Error("Authentication token is missing");
        }

        const response = await api.get<TransportVehicleResponse>(`/lookups/transportation-vehicle/`, {
            params: {
                page,
                limit,
            },
            withCredentials: true,
            headers: {
                "x-api-key": apikey,
                "x-app-version": appVersion,
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        console.error("Error fetching transport vehicles", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to fetch transport vehicles");
    }
  }

export const fetchTransportVehiclesById = async (id: string): Promise<TransportVehicleResponse> => {
    try {
        const token =  getAdminBearerToken();
        if (!token) {
            throw new Error("Authentication token is missing");
        }

        const response = await api.get<TransportVehicleResponse>(`/lookups/transportation-vehicle/${id}`, {
            withCredentials: true,
            headers: {
                "x-api-key": apikey,
                "x-app-version": appVersion,
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        console.error("Error fetching transport vehicle by ID", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to fetch transport vehicle by ID");
    }
}

export const createTransportVehicle = async (vehicleData: TransportVehicle): Promise<TransportVehicleResponse> => {
    try {
        const token =  getAdminBearerToken();
        if (!token) {
            throw new Error("Authentication token is missing");
        }

        const response = await api.post<TransportVehicleResponse>(`/lookups/transportation-vehicle/`, vehicleData, {
            withCredentials: true,
            headers: {
                "x-api-key": apikey,
                "x-app-version": appVersion,
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        console.error("Error creating transport vehicle", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to create transport vehicle");
    }
}

export const updateTransportVehicle = async (id: string, vehicleData: TransportVehicle): Promise<TransportVehicleResponse> => {
    try {
        const token =  getAdminBearerToken();
        if (!token) {
            throw new Error("Authentication token is missing");
        }

        const response = await api.put<TransportVehicleResponse>(`/lookups/transportation-vehicle/${id}`, vehicleData, {
            withCredentials: true,
            headers: {
                "x-api-key": apikey,
                "x-app-version": appVersion,
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        console.error("Error updating transport vehicle", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to update transport vehicle");
    }
}

export const deleteTransportVehicle = async (id: string): Promise<TransportVehicleResponse> => {
    try {
        const token =  getAdminBearerToken();
        if (!token) {
            throw new Error("Authentication token is missing");
        }

        const response = await api.delete<TransportVehicleResponse>(`/lookups/transportation-vehicle/${id}`, {
            withCredentials: true,
            headers: {
                "x-api-key": apikey,
                "x-app-version": appVersion,
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        console.error("Error deleting transport vehicle", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to delete transport vehicle");
    }
}   

export const updateTransportVehicleStatus = async (id: string, status: boolean): Promise<TransportVehicleResponse> => {
    try {
        const token =  getAdminBearerToken();
        if (!token) {
            throw new Error("Authentication token is missing");
        }

        const response = await api.patch<TransportVehicleResponse>(`lookups/transportation-vehicle/${id}/status`, { status }, {
            withCredentials: true,
            headers: {
                "x-api-key": apikey,
                "x-app-version": appVersion,
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {  
        console.error("Error updating transport vehicle status", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to update transport vehicle status");
    }
}