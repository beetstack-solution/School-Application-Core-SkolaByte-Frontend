import axios, { AxiosResponse } from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
const schoolApiKey = import.meta.env.VITE_SCHOOL_API_KEY;
import api from "@/api/axiosInstance";
import { getAdminBearerToken } from "@/helpers/tokenHelper";

export interface ExamRecord {
    _id: string;
    academicYear: {
        academicYear: string;
        startMonth: string;
        endMonth: string;
    };
    class: {
        name: string;
    };
    division: {
        name: string;
    };
    createdAt: string;
    student: {
        firstName: string;
        lastName: string;
        rollNumber: string;
    };
    exam: {
        name: string;
    };
    examType: {
        name: string;
    };
    marksPerEachExam: number[][];
    marksObtainedPerEachExam: number[][];
    percentage: number[];
    grade: string[];
    totalMarksObtained: number[];
    totalMarks: number[];
}

export const fetchProgressReport = async (studentId: string ,academicYearId?: string): Promise<AxiosResponse<ExamRecord[]>> => {

    try {
        const token = getAdminBearerToken() || ""; // Replace with your actual token function 
        if (!token) {
            throw new Error("Authentication token is missing");
        }
        const response = await api.get<ExamRecord[]>(`${API_BASE_URL}/progress-report/${studentId}/${academicYearId}`, {
            withCredentials: true,
            headers: {
                "x-api-key": apikey,
                "x-app-version": appVersion,
                "x-school-api-key": schoolApiKey,
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        console.error('Error fetching progress report:', error);
        throw error;
    }
};