const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";
import api from "@/api/axiosInstance";

export interface SubstituteTeacher {
    _id: string;
    academicYear: {
        id: string;
        academicYear: string;
    };
    date: string;
    timeSlot: {
        id: string;
        name: string;
        startTime: string;
        endTime: string;
    };
    class: {
        id: string;
        name: string;
    };
    division: {
        id: string;
        name: string;
    };
    originalTeacher: {
        id: string;
        name: string;
    };
    substituteTeacher: {
        id: string;
        name: string;
    };
    reason?: string;
    status: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface SubstituteTeacherListResponse {
    success: boolean;
    message: string;
    data: {
        data: SubstituteTeacher[];
        total: number;
    };
}

export interface CreateSubstituteTeacherPayload {
    academicYear: string;
    date: string;
    timeSlot: string;
    class: string;
    division: string;
    originalTeacher: string;
    substituteTeacher: string;
    reason?: string;
}


export const createSubstituteTeacher = async (
    data: CreateSubstituteTeacherPayload
): Promise<SubstituteTeacherListResponse> => {
    try {
        const token = await getAdminBearerToken();
        if (!token) {
            throw new Error("Authentication token is missing");
        }
        const response = await api.post<SubstituteTeacherListResponse>(
            `/lookups/substitue-teacher`,
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
    } catch (error: any) {
        console.error(
            "Error creating substitute teacher:",
            error.response?.data || error.message
        );
        throw new Error(
            error.response?.data?.message || "Failed to create substitute teacher"
        );
    }
};


export const updateSubstituteTeacherById = async (
    id: string,
    updatedData: Partial<CreateSubstituteTeacherPayload>
): Promise<SubstituteTeacherListResponse> => {
    try {
        const token = await getAdminBearerToken();
        if (!token) {
            throw new Error("Authentication token is missing");
        }

        const response = await api.put<SubstituteTeacherListResponse>(
            `/substitute-teachers/${id}`,
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
            "Error updating substitute teacher by ID",
            error.response?.data || error.message
        );
        throw new Error(
            error.response?.data?.message || "Failed to update substitute teacher by ID"
        );
    }
};


export const fetchSubstituteTeachers = async (
    page: number,
    limit: number,
    academicYear?: string,
    classId?: string,
    date?: string
): Promise<{ substituteTeachers: SubstituteTeacher[]; total: number }> => {
    try {
        const token = await getAdminBearerToken();
        if (!token) {
            throw new Error("Authentication token is missing");
        }

        const response = await api.get<SubstituteTeacherListResponse>(`/lookups/substitue-teacher`, {
            params: { page, limit, academicYear, class: classId, date },
            headers: {
                "x-api-key": apikey,
                "x-app-version": appVersion,
                Authorization: `Bearer ${token}`,
            },
        });

        return {
            substituteTeachers: response.data.data.data,
            total: response.data.data.total,
        };
    } catch (error: any) {
        console.error(
            "Error fetching substitute teachers",
            error.response?.data || error.message
        );
        throw new Error(
            error.response?.data?.message || "Failed to fetch substitute teachers"
        );
    }
};


export const fetchSubstituteTeacherById = async (id: string): Promise<SubstituteTeacherListResponse> => {
    try {
        const token = await getAdminBearerToken();
        if (!token) {
            throw new Error("Authentication token is missing");
        }
        const response = await api.get<SubstituteTeacherListResponse>(`/lookups/substitue-teacher/${id}`, {
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
            "Error fetching substitute teacher by ID",
            error.response?.data || error.message
        );
        throw new Error(
            error.response?.data?.message || "Failed to fetch substitute teacher by ID"
        );
    }
};


export const updateSubstituteTeacherStatus = async (
    id: string,
    status: boolean
): Promise<SubstituteTeacherListResponse> => {
    try {
        const token = await getAdminBearerToken();
        if (!token) {
            throw new Error("Authentication token is missing");
        }

        const response = await api.patch(
            `/lookups/substitue-teacher/${id}/status`,
            { status, id },
            {
                withCredentials: true,
                headers: {
                    "x-api-key": apikey,
                    "x-app-version": appVersion,
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        console.log("API Response Data:", response.data);

        return response.data;
    } catch (error: any) {
        console.error(
            "Error updating substitute teacher status",
            error.response?.data || error.message
        );
        throw new Error(
            error.response?.data?.message || "Failed to update substitute teacher status"
        );
    }
};

export const deleteSubstituteTeacher = async (
    id: string
): Promise<{ success: boolean; message: string }> => {
    try {
        const token = await getAdminBearerToken();
        if (!token) {
            throw new Error("Authentication token is missing");
        }
        const response = await api.delete<{ success: boolean; message: string }>(
            `/lookups/substitue-teacher/${id}`,
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
            "Error deleting substitute teacher",
            error.response?.data || error.message
        );
        throw new Error(
            error.response?.data?.message || "Failed to delete substitute teacher"
        );
    }
};