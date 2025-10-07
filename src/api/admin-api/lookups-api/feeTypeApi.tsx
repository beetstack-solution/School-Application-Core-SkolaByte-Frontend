import axios, { AxiosResponse } from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";
import api from "@/api/axiosInstance";



export interface FeeTypeData {
    _id: string;
    name: string;
    code: string;
    status: boolean;
    createdBy: {
        name: string;
        email: string;
    };
    createdAt: string;
    updatedBy: {
        name?: string;
        email?: string;
    };
    userUpdatedDate?: string;
}

export interface FeeTypesData {
    data: FeeTypeData[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface FeeTypesResponse {
    success: boolean;
    message: string;
    data: FeeTypesData;
}

export const getFeeTypes = async (page: number, limit: number): Promise<FeeTypesResponse> => {
    try {
        const token = getAdminBearerToken();
        if (!token) {
            throw new Error("Authentication token is missing");
        }
        const response = await api.get<FeeTypesResponse>(`/lookups/fee-type`, {
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
        });
        return response.data;
    }
    catch (error: any) {
        console.error("Error fetching fee types", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to fetch fee types");
    }

}

export const getFeeTypeById = async (id: string): Promise<FeeTypesResponse> => {
    try {
        const token = getAdminBearerToken();
        if (!token) {
            throw new Error("Authentication token is missing");
        }
        const response = await api.get<FeeTypesResponse>(`/lookups/fee-type/${id}`, {
            withCredentials: true,
            headers: {
                "x-api-key": apikey,
                "x-app-version": appVersion,
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
    catch (error: any) {
        console.error("Error fetching fee type by ID", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to fetch fee type by ID");
    }
}

export const createFeeType = async (addData: FeeTypeData): Promise<FeeTypeData> => {
    try {
        const token = getAdminBearerToken();
        if (!token) {
            throw new Error("Authentication token is missing");
        }
        const response = await api.post<FeeTypeData>(
            `/lookups/fee-type`,
            addData,
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
            "Error creating fee type",
            error.response?.data || error.message
        );
        throw new Error(error.response?.data?.message || "Failed to create fee type");
    }
};

export const updateFeeTypeById = async (id: string, updatedData: FeeTypeData): Promise<FeeTypeData> => {
    try {
        const token = getAdminBearerToken();
        if (!token) {
            throw new Error("Authentication token is missing");
        }
        const response = await api.put<FeeTypeData>(
            `/lookups/fee-type/${id}`,
            updatedData,
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
            "Error updating fee type by ID",
            error.response?.data || error.message
        );
        throw new Error(error.response?.data?.message || "Failed to update fee type by ID");
    }
};

export const deleteFeeTypeById = async (id: string): Promise<FeeTypeData> => {
    try {
        const token = getAdminBearerToken();
        if (!token) {
            throw new Error("Authentication token is missing");
        }
        const response = await api.delete<FeeTypeData>(
            `/lookups/fee-type/${id}`,
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
            "Error deleting fee type by ID",
            error.response?.data || error.message
        );
        throw new Error(error.response?.data?.message || "Failed to delete fee type by ID");
    }
};

export const updateFeeTypeStatusById = async (id: string, status: FeeTypeData): Promise<FeeTypeData> => {
    try {
        const token = getAdminBearerToken();
        if (!token) {
            throw new Error("Authentication token is missing");
        }
        const response = await api.patch<FeeTypeData>(
            `/lookups/fee-type/${id}/status`,
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
        return response.data;
    } catch (error: any) {
        console.error(
            "Error updating fee type status by ID",
            error.response?.data || error.message
        );
        throw new Error(error.response?.data?.message || "Failed to update fee type status by ID");
    }
};