import axios, { AxiosResponse } from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";
import api from "@/api/axiosInstance";

export interface PtaRoleResponse {
    success: boolean;
    message: string;
    data: {
        data: PtaRole[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface PtaRole {
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
}


export const getPtaRoles = async (page: number, limit: number): Promise<PtaRoleResponse> => {
    try {
        const response: AxiosResponse<PtaRoleResponse> = await api.get(
            `lookups/pta-role/`,
            {
                params: {
                    page: page,
                    limit: limit,
                },

            }
        );
        return response.data;
    } catch (error: any) {
        console.error("Error fetching Pta Roles", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to fetch Pta Roles");
    }
}

export const createPtaRole = async (ptaRole: PtaRole): Promise<PtaRoleResponse> => {
    try {
        const response: AxiosResponse<PtaRoleResponse> = await api.post(
            `lookups/pta-role/`,
            ptaRole,

        );
        return response.data;
    } catch (error: any) {
        console.error("Error creating Pta Role", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to create Pta Role");
    }
}


export const updatePtaRole = async (id: string, ptaRole: any): Promise<any> => {
    try {
        const response = await api.put<any>(
            `lookups/pta-role/${id}`,
            ptaRole, 

        );
        return response.data;
    } catch (error: any) {
        console.error("Error updating Pta Role", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to update Pta Role");
    }
}
export const deletePtaRole = async (id: string): Promise<PtaRoleResponse> => {
    try {
        const response: AxiosResponse<PtaRoleResponse> = await api.delete(
            `lookups/pta-role/${id}`,
        );
        return response.data;
    } catch (error: any) {
        console.error("Error deleting Pta Role", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to delete Pta Role");
    }
}

export const getPtaRoleById = async (id: string): Promise<PtaRoleResponse> => {
    try {
        const response: AxiosResponse<PtaRoleResponse> = await api.get(
            `lookups/pta-role/${id}`,
        );
        return response.data;
    } catch (error: any) {
        console.error("Error fetching Pta Role by ID", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to fetch Pta Role by ID");
    }
}
export const updatePtaRoleStatusById = async (id: string, status: boolean): Promise<PtaRoleResponse> => {
    try {
        const response: AxiosResponse<PtaRoleResponse> = await api.patch(
            `lookups/pta-role/${id}/status`,
            { status: status },
        );
        return response.data;
    } catch (error: any) {
        console.error("Error updating Pta Role status", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to update Pta Role status");
    }
}