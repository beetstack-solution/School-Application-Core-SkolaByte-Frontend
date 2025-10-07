const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";
import api from "@/api/axiosInstance";



export interface AssignRollNoData {
    classId: string; // MongoDB ObjectId as string
    divisionId: string;
    academicYearId: string;
    students: {
        studentId: string;
        rollNumber: number;
    }[];
}

export interface AssignRollNoResponse {
    success: boolean;
    message: string;
    data: AssignRollNoData;
}


export const createRollNo = async (data: AssignRollNoData): Promise<AssignRollNoResponse> => {
    try {
        const token = getAdminBearerToken();
        if (!token) {
            throw new Error("Authentication token is missing");
        }
        const response = await api.post<AssignRollNoResponse>(
            `/lookups/assign-roll-number/`,
            data,
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
    } catch (error) {
        console.error("Error creating roll no", error);
        throw error;
    }   
}