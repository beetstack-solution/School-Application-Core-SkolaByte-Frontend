import { getAdminBearerToken } from "@/helpers/tokenHelper";
import api from "@/api/axiosInstance";


export interface AssignTeacherClassResponse {
  success: boolean;
  message: string;
  data: {
    filter(arg0: (teacher: any) => boolean): unknown;
    data: AssignTeacherClassItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AssignTeacherClassItem {
  _id: string;
  teacher: any; // null in this case, or you can define a Teacher interface
  academicYear: AcademicYear;
  isClassTeacher: boolean;
  classTeacherOf?: ClassTeacherAssignmentDetails;
  assignments: AssignmentWithDetails[];
  createdAt: string;
  updatedAt: string;
}

export interface AcademicYear {
  _id: string;
  code: string;
  academicYear: string;
  startMonth: number;
  endMonth: number;
  academicYearAlias: string;
  status: boolean;
  isDeleted: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ClassTeacherAssignmentDetails {
  _id: string;
  class: ClassDetails;
  division: DivisionDetails;
}

export interface AssignmentWithDetails {
  _id: string;
  class: string;
  division: string;
  subjects: string[];
  classDetails: ClassDetails[];
  divisionDetails: DivisionDetails[];
  subjectDetails: SubjectDetails[];
}

export interface ClassDetails {
  _id: string;
  nameAlias: string;
  __v: number;
  code: string;
  createdAt: string;
  createdBy: string;
  isDeleted: boolean;
  name: string;
  status: boolean;
  updatedAt: string;
}

export interface DivisionDetails {
  _id: string;
  nameAlias: string;
  __v: number;
  code: string;
  createdAt: string;
  createdBy: string;
  isDeleted: boolean;
  name: string;
  status: boolean;
  updatedAt: string;
}

export interface SubjectDetails {
  _id: string;
  nameAlias: string;
  __v: number;
  code: string;
  createdAt: string;
  createdBy: string;
  isDeleted: boolean;
  name: string;
  status: boolean;
  updatedAt: string;
}


export const CreateAssignTeachersClass = async (
  data: AssignTeacherClassItem[]
): Promise<AssignTeacherClassResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.post<AssignTeacherClassResponse>(
      `/lookups/assign-teacher-class/`,
      data,
      {
        withCredentials: true,
        // headers: {
        //   "x-api-key": import.meta.env.VITE_API_KEY,
        //   "x-app-version": import.meta.env.VITE_APP_VERSION,
        //   Authorization: `Bearer ${token}`,
        // },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error assigning teachers to class", error);
    throw error;
  }
};

export const getAssignedTeachersClass = async (
  page: number,
  limit: number,
  academicYear?: string,
  classId?: string,
  division?: string
): Promise<AssignTeacherClassResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.get<AssignTeacherClassResponse>(
      `/lookups/assign-teacher-class/`,
      {
        params: {
          page: page,
          limit: limit,
           academicYear,
        class: classId,
        division,
        },
 
      }

    );
    return response.data;
  } catch (error) {
    console.error("Error getting assigned teachers", error);
    throw error;
  }
};

export const deleteAssignedTeacherClass = async (
  id: string
): Promise<AssignTeacherClassResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.delete<AssignTeacherClassResponse>(
      `/lookups/assign-teacher-class/${id}`,
      {
        withCredentials: true,
        // headers: {
        //   "x-api-key": import.meta.env.VITE_API_KEY,
        //   "x-app-version": import.meta.env.VITE_APP_VERSION,
        //   Authorization: `Bearer ${token}`,
        // },
        }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting assigned teacher", error);
    throw error;
  }
};

export const updateAssignedTeacherClass = async (
  id: string,
  data: AssignTeacherClassItem
): Promise<AssignTeacherClassResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.put<AssignTeacherClassResponse>(
      `/lookups/assign-teacher-class/${id}`,
      data,
      {
        withCredentials: true,
        // headers: {
        //   "x-api-key": import.meta.env.VITE_API_KEY,
        //   "x-app-version": import.meta.env.VITE_APP_VERSION,
        //   Authorization: `Bearer ${token}`,
        // },
        }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating assigned teacher", error);
    throw error;
  }
};

export const getAssignedTeacherById = async (
  id: string
): Promise<AssignTeacherClassResponse> => {
    try {
      const token = getAdminBearerToken();
      if (!token) {
        throw new Error("Authentication token is missing");
      }
      const response = await api.get<AssignTeacherClassResponse>(
        `/lookups/assign-teacher-class/${id}`,
        {
          withCredentials: true,
          // headers: {
          //   "x-api-key": import.meta.env.VITE_API_KEY,
          //   "x-app-version": import.meta.env.VITE_APP_VERSION,
          //   Authorization: `Bearer ${token}`,
          // },
          }
      );
      return response.data;
    } catch (error) {
      console.error("Error getting assigned teacher", error);
      throw error;
    }
  };
  

export const updateAssignedTeachersClassByTeacherStatus = async (
 id: string,
 status: boolean
): Promise<AssignTeacherClassResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.patch<AssignTeacherClassResponse>(
      `/lookups/assign-teacher-class/${id}/status`,
        { status: status },
      
        
    );
    return response.data;
  } catch (error) {
    console.error("Error getting assigned teachers", error);
    throw error;
  }
};