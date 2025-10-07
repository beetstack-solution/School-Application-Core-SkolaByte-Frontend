import axios, { AxiosResponse } from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";
import api from "@/api/axiosInstance";


export interface PaymentHistoryResponse {
    success: boolean;
    message: string;
    data: {
        data: PaymentEntry[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface PaymentEntry {
    _id: string;
    student: {
        id: string;
        name: string;
        rollNumber: string;
    };
    feeStructure: {
        id: string;
        name: string;
    };
    paymentStatus: "successful" | "pending" | "failed"; // assuming limited set
    paymentDate: string; // ISO string format
}
  

export const getPaymentHistory = async (
    page: number,
    limit: number): Promise<PaymentHistoryResponse> => {
    const token = getAdminBearerToken();    
    if (!token) {
        throw new Error("No token found");
    }
    const response = await api.get<PaymentHistoryResponse>(`/lookups/payment-history`, {
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
    }