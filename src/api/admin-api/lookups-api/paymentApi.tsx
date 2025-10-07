import axios, { AxiosResponse } from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";
import api from "@/api/axiosInstance";

// FeePaymentResponse.ts
export interface FeePaymentResponse {
    success: boolean;
    message: string;
    data: FeePaymentDataContainer;
}

export interface FeePaymentDataContainer {
    data: FeePayment[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface FeePayment {
    _id: string;
    code: string;
    feeName: string;
    feeAmount: number;
    academicYear: string | null;
    class: FeeClass[];
    installments: FeeInstallment[];
    createdBy: User;
    updatedBy: Partial<User>;
    createdAt: string;
    updatedAt: string;
}

export interface FeeClass {
    _id: string;
    name: string;
    code: string;
    nameAlias: string;
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
}

export interface FeeInstallment {
    feeInstallmentType: string;
    installmentName: string;
    noOfInstallments: number;
    name: string;
    feeAmount: number;
    discountAmount: number;
    payableAmount: number;
    _id: string;
    feeInstallmentTypeDetails?: FeeInstallmentTypeDetails;
}

export interface FeeInstallmentTypeDetails {
    _id: string;
    name: string;
    code: string;
    nameAlias: string;
    status: boolean;
    isDeleted: boolean;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface User {
    name: string;
    email: string;
}

export const geAllPayments = async (
    page: number,
    limit: number
): Promise<FeePaymentResponse> => {
    try {
        const token = getAdminBearerToken();
        if (!token) {
            throw new Error("Authentication token is missing");
        }

        const response = await api.get<FeePaymentResponse>("/fee-payment", {
            params: { page, limit },
            withCredentials: true,
            headers: {
                "x-api-key": apikey,
                "x-app-version": appVersion,
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error: any) {
        console.error(
            "Error fetching Payments",
            error.response?.data || error.message
        );
        throw new Error(error.response?.data?.message || "Failed to fetch Payments");
    }
};

export const deletePayment = async (id: string): Promise<any> => {
    try {
        const token = getAdminBearerToken();
        if (!token) {
            throw new Error("Authentication token is missing");
        }

        const response = await api.delete(`/fee-payment/${id}`, {
            withCredentials: true,
            headers: {
                "x-api-key": apikey,
                "x-app-version": appVersion,
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error deleting payment", error);
        throw error;
    }
};

export const updatePaymentStatus = async (id: string, status: any): Promise<any> => {
    try {
        const token = getAdminBearerToken();
        if (!token) {
            throw new Error("Authentication token is missing");
        }

        const response = await api.patch(`/fee-payment/${id}/status`, { status }, {
            withCredentials: true,
            headers: {
                "x-api-key": apikey,
                "x-app-version": appVersion,
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error: any) {
        console.error(
            "Error updating payment by ID",
            error.response?.data || error.message
        );
        throw new Error(error.response?.data?.message || "Failed to update payment by ID");
    }
}

export const createPayment = async (paymentData: any): Promise<any> => {
    try {
        const token = getAdminBearerToken();
        if (!token) {
            throw new Error("Authentication token is missing");
        }

        const response = await api.post("/fee-payment", paymentData, {
            withCredentials: true,
            headers: {
                "x-api-key": apikey,
                "x-app-version": appVersion,
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error: any) {
        console.error("Error creating payment", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to create payment");
    }
};

export const getPaymentById = async (id: string): Promise<any> => {
    try {
        const token = getAdminBearerToken();
        if (!token) {
            throw new Error("Authentication token is missing");
        }

        const response = await api.get(`/lookups/payment-history/${id}`, {
            withCredentials: true,
            headers: {
                "x-api-key": apikey,
                "x-app-version": appVersion,
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error: any) {
        console.error(
            "Error fetching payment by ID",
            error.response?.data || error.message
        );
        throw new Error(error.response?.data?.message || "Failed to fetch payment by ID");
    }
}

export const updatePaymentById = async (id: string, paymentData: any): Promise<any> => {
    try {
        const token = getAdminBearerToken();
        if (!token) {
            throw new Error("Authentication token is missing");
        }

        const response = await api.put(`/fee-payment/${id}`, paymentData, {
            withCredentials: true,
            headers: {
                "x-api-key": apikey,
                "x-app-version": appVersion,
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error: any) {
        console.error(
            "Error updating payment by ID",
            error.response?.data || error.message
        );
        throw new Error(error.response?.data?.message || "Failed to update payment by ID");
    }
}
