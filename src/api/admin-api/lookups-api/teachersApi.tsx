const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";
import api from "@/api/axiosInstance";
import { Gender } from "@/constants/enum";
export interface Teacher {
  imageUrl: any;
  id: string;
  academicYear: string;
  code: string;
  name: string;
  email: string;
  password: string;
  contactNumber: string;
  address: string;
  gender: Gender;
  isClassTeacher: boolean;
  class?: string;
  division?: string;
  status: boolean;
  isDeleted: boolean;
  createdBy: CreatedBy;
  createdAt: string;
  updatedAt: string;
  __v: number;
  deletedAt?: string;
  deletedBy?: string;
}

interface CreatedBy {
  name: string;
  email: string;
}

export interface TeacherData {
  teacher: Teacher;
}

export interface TeacherListResponse {
  success: boolean;
  message: string;
  data: {
    data: Teacher[];
    total: number;
  };
}

export interface SingleTeacherResponse {
  success: boolean;
  message: string;
  data: {
    password: string;
    email: string;
    gender: Gender;
    address: string;
    contactNumber: string;
    name: string;
    academicYear: any;
    teacher: Teacher;
  };
}


export const createTeacher = async (
  data: Partial<Teacher>,
  file?: File
): Promise<SingleTeacherResponse> => {
  try {
    const token = await getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const formData = new FormData();

    Object.keys(data).forEach(key => {
      if (data[key as keyof Teacher] !== undefined) {
        formData.append(key, data[key as keyof Teacher] as string | Blob);
      }
    });

    if (file) {
      formData.append('file', file);
    }

    const response = await api.post<SingleTeacherResponse>(
      `/teacher/`,
      formData,
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
      "Error creating teacher:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to create teacher"
    );
  }
};

// Edit teacher
export const updateTeacherById = async (
  id: string,
  updatedTeacherData: Partial<any>
): Promise<SingleTeacherResponse> => {
  try {
    const token = await getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.put<SingleTeacherResponse>(
      `/teacher/${id}`,
      updatedTeacherData,
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
      "Error updating teacher by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update teacher by ID"
    );
  }
};

// Fetch teachers
export const fetchTeachers = async (
  page = 1,
  limit = 10,
  search: string,
  academicYear?: string,
  classId?: string,
  division?: string
): Promise<{ teachersList: Teacher[]; total: number }> => {
  try {
    const token = await getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.get<TeacherListResponse>("/teacher", {
      params: {
        page: page,
        limit,
        search,
        academicYear,
        class: classId,
        division,

      },
      headers: {
        "x-api-key": apikey,
        "x-app-version": appVersion,
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      teachersList: response.data.data.data,
      total: response.data.data.total,
    };
  } catch (error: any) {
    console.error(
      "Error fetching teachers",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch teachers"
    );
  }
};

// Fetch teacher by id
export const fetchTeacherById = async (id: string): Promise<SingleTeacherResponse> => {
  try {
    const token = await getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.get<SingleTeacherResponse>(`/teacher/${id}`, {
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
      "Error fetching teacher by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch teacher by ID"
    );
  }
};

// Update teacher status
export const updateTeacherStatusById = async (
  id: string,
  status: boolean
): Promise<SingleTeacherResponse> => {
  try {
    const token = await getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.patch(
      `/teacher/${id}/status`,
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

    return response.data;
  } catch (error: any) {
    console.error(
      "Error updating teacher status",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update teacher status"
    );
  }
};

// Delete teacher
export const deleteTeacher = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const token = await getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.delete<{ success: boolean; message: string }>(
      `/teacher/${id}`,
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
      "Error deleting teacher",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to delete teacher"
    );
  }
};

// bulkImportTeachers
export const bulkImportTeachers = async (file: File): Promise<any> => {
  try {
    const token = await getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/teacher/import-teacher", formData, {
      headers: {
        "x-api-key": apikey,
        "x-app-version": appVersion,
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error importing teachers:", error);
    throw new Error(error.message || "Import failed.");
  }
};