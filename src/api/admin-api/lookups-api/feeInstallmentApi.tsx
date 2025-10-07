import axios, { AxiosResponse } from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";
import api from "@/api/axiosInstance";



export interface Installment {
    name: string;
    dueDate?: string; // Optional because in one object it's missing
    amount?: number; // Optional because in one object it's missing
    _id: string;
}

export interface FeeInstallmentType {
    _id: string;
    name: string;
    code: string;
    nameAlias: string;
}

export interface FeeType {
    _id: string;
    name: string;
    code: string;
    nameAlias: string;
}



export interface FeeInstallment {
    _id: string;
    code: string;
    noOfInstallment: number;
    installments: Installment[];
    feeInstallmentType: FeeInstallmentType;
    feeType?: FeeType; // Optional because it's not present in all objects
    status: boolean;
}

export interface FeeInstallmentsResponse {
    success: boolean;
    message: string;
    data: {
        data: FeeInstallment[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export const getFeeInstallments = async (
    page: number,
    limit: number
): Promise<FeeInstallmentsResponse> => {
    try {
        const token = getAdminBearerToken();
        const response: AxiosResponse<FeeInstallmentsResponse> = await api.get(
            `/lookups/fee-installment/`,
            {
                params: {
                    page: page,
                    limit: limit,
                },
                withCredentials: true,
                headers: {
                    "x-api-key": apikey,
                    "x-app-version": appVersion,
                    Authorization: `Bearer ${token}`,
                },
            });
        return response.data;
    } catch (error) {
        console.error("Error fetching fee installments", error);
        throw new Error("Failed to fetch fee installments");
    }
}

export const getFeeInstallmentById = async (id: string): Promise<FeeInstallment> => {
    try {
        const token = getAdminBearerToken();
        const response: AxiosResponse<FeeInstallment> = await api.get(
            `/lookups/fee-installment/${id}`,
            {
                withCredentials: true,
                headers: {
                    "x-api-key": apikey,
                    "x-app-version": appVersion,
                    Authorization: `Bearer ${token}`,
                },
            });
        return response.data;
    } catch (error) {
        console.error("Error fetching fee installment by ID", error);
        throw new Error("Failed to fetch fee installment by ID");
    }
}

export const updateFeeInstallmentById = async (
    id: string,
    data: FeeInstallment
): Promise<FeeInstallment> => {
    try {
        const token = getAdminBearerToken();
        const response: AxiosResponse<FeeInstallment> = await api.put(
            `/lookups/fee-installment/${id}`,
            data,
            {
                withCredentials: true,
                headers: {
                    "x-api-key": apikey,
                    "x-app-version": appVersion,
                    Authorization: `Bearer ${token}`,
                },
            });
        return response.data;
    } catch (error) {
        console.error("Error updating fee installment", error);
        throw new Error("Failed to update fee installment");
    }
}

export const deleteFeeInstallmentById = async (id: string): Promise<any> => {
    try {
        const token = getAdminBearerToken();
        const response = await api.delete(`/lookups/fee-installment/${id}`, {
            withCredentials: true,
            headers: {
                "x-api-key": apikey,
                "x-app-version": appVersion,
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting fee installment", error);
        throw new Error("Failed to delete fee installment");
    }
}
export const createFeeInstallment = async (data: FeeInstallment): Promise<FeeInstallment> => {
    try {
        const token = getAdminBearerToken();
        const response: AxiosResponse<FeeInstallment> = await api.post(
            `/lookups/fee-installment/`,
            data,
            {
                withCredentials: true,
                headers: {
                    "x-api-key": apikey,
                    "x-app-version": appVersion,
                    Authorization: `Bearer ${token}`,
                },
            });
        return response.data;
    } catch (error) {
        console.error("Error creating fee installment", error);
        throw new Error("Failed to create fee installment");
    }
}

export const UpdateFeeInstallmentStatus = async (
    id: string,
    status: boolean
): Promise<any> => {
    try {
        const token = getAdminBearerToken();
        if (!token) {
            throw new Error("Authentication token is missing");
        }
        const response: AxiosResponse<FeeInstallmentsResponse> = await api.patch(
            `/lookups/fee-installment/${id}/status`,
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
        console.error("Error updating fee installment status:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to update fee installment status");
    }
}