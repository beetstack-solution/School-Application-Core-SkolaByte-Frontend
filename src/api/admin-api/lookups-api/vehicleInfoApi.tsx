const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";
import api from "@/api/axiosInstance";

export interface VehicleResponse {
    success: boolean;
    message: string;
    data: {
        data: VehicleData[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface VehicleData {
    _id: string;
    academicYear: AcademicYear;
    status: boolean;
    createdBy: User;
    updatedBy?: Partial<User>; // Since updatedBy is an empty object here
    createdAt: string;
    vehicleInfo: VehicleInfoEntry[];
}

export interface AcademicYear {
    id: string;
    academicYear: string;
    startMonth: number;
    endMonth: number;
}

export interface User {
    id: string;
    name: string;
    email: string;
}

export interface VehicleInfoEntry {
    vehicleType: string;
    vehicleNumber: string;
    vehicleName: string;
    driver: {
        name: string;
        mobileNumber: string;
        address: string;
        licenseNumber: string;
    };
    assistant?: {
        name: string;
        mobileNumber: string;
    };
    route: {
        routeName: string;
        startTiming: string;
        exactEndTiming: string;
    };
}
  

export const fetchVehicles = async (page: number, limit: number): Promise<VehicleResponse> => {
    try {
        const token = getAdminBearerToken();
        if (!token) {
            throw new Error("Authentication token is missing");
        }

        const response = await api.get<VehicleResponse>(`/lookups/vehicle-info/`, {
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
        console.error("Error fetching vehicles", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to fetch vehicles");
    }
};


export const fetchVehicleById = async (id: string): Promise<VehicleResponse> => {
    try {
        const token = getAdminBearerToken();
        if (!token) {
            throw new Error("Authentication token is missing");
        }

        const response = await api.get<VehicleResponse>(`/lookups/vehicle-info/${id}`, {
            withCredentials: true,
            headers: {
                "x-api-key": apikey,
                "x-app-version": appVersion,
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        console.error("Error fetching vehicle by ID", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to fetch vehicle by ID");
    }
};

export const createVehicle = async (vehicleData: VehicleData): Promise<VehicleResponse> => {
    try {
        const token = getAdminBearerToken();
        if (!token) {
            throw new Error("Authentication token is missing");
        }

        const response = await api.post<VehicleResponse>(`/lookups/vehicle-info/`, vehicleData, {
            withCredentials: true,
            headers: {
                "x-api-key": apikey,
                "x-app-version": appVersion,
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        console.error("Error creating vehicle", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to create vehicle");
    }
};  


export const updateVehicle = async (id: string, vehicleData: VehicleData): Promise<VehicleResponse> => {
    try {
        const token = getAdminBearerToken();
        if (!token) {
            throw new Error("Authentication token is missing");
        }

        const response = await api.put<VehicleResponse>(`/lookups/vehicle-info/${id}`, vehicleData, {
            withCredentials: true,
            headers: {
                "x-api-key": apikey,
                "x-app-version": appVersion,
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        console.error("Error updating vehicle", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to update vehicle");
    }
};

export const deleteVehicle = async (id: string): Promise<VehicleResponse> => {
    try {
        const token = getAdminBearerToken();
        if (!token) {
            throw new Error("Authentication token is missing");
        }

        const response = await api.delete<VehicleResponse>(`/lookups/vehicle-info/${id}`, {
            withCredentials: true,
            headers: {
                "x-api-key": apikey,
                "x-app-version": appVersion,
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        console.error("Error deleting vehicle", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to delete vehicle");
    }
};

export const updateVehicleStatus = async (id: string, status: boolean): Promise<VehicleResponse> => {
    try {
        const token = getAdminBearerToken();
        if (!token) {
            throw new Error("Authentication token is missing");
        }

        const response = await api.patch<VehicleResponse>(`lookups/vehicle-info/${id}/status`, { status }, {
            withCredentials: true,
            headers: {
                "x-api-key": apikey,
                "x-app-version": appVersion,
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        console.error("Error updating vehicle status", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to update vehicle status");
    }   
}