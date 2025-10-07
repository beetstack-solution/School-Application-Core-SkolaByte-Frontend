import { getAdminBearerToken } from "@/helpers/tokenHelper";
import axios, { AxiosResponse } from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import api from "@/api/axiosInstance";

export interface FeeStructureResponse {
    success: boolean;
    message: string;
    data: FeeStructureData;
}

export interface FeeStructureData {
    _id: string;
    code: string;
    class: ClassInfo;
    academicYear: AcademicYearInfo;
    student: StudentInfo;
    feeName: string;
    totalFee: number;
    feeStructureId: string;
    feeAmountSplitup: FeeSplit[];
}

export interface ClassInfo {
    _id: string;
    name: string;
}

export interface AcademicYearInfo {
    _id: string;
    name: string;
}

export interface StudentInfo {
    _id: string;
    isDiscountApplicable: boolean;
    discount: number;
}

export interface FeeSplit {
    feeType: FeeType;
    amount: number;
}

export interface FeeType {
    _id: string;
    name: string;
}


export const getStudentsByClassAndDivision = async (studentId: string, academicYearId: string) => {
    try {
         const token = getAdminBearerToken();
            if (!token) {
              throw new Error("Authentication token is missing");
            }
            const response = await api.get<FeeStructureResponse>(
                `/lookups/fee-structure/student-fee/${studentId}/${academicYearId}`,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "x-api-key": apikey,
                        "x-app-version": appVersion,
                    },
                }
            );
            return response.data;
    } catch (error) {
        console.error("Error fetching students by class and division:", error);
        throw error; // Rethrow the error to handle it in the calling function
        
    }
}

export const UpdateFeeStructureDiscountById = async (studentId: string , updateData: any) => {
    try {
        const token = getAdminBearerToken();
        if (!token) {
            throw new Error("Authentication token is missing");
        }
        const response = await api.put<FeeStructureResponse>(
            `/lookups/fee-structure/student-fee-discount/${studentId}`,
            updateData,
            {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "x-api-key": apikey,
                    "x-app-version": appVersion,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching students by class and division:", error);
        throw error; // Rethrow the error to handle it in the calling function
    }
}