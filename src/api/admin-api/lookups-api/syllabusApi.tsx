const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";
import api from "@/api/axiosInstance";

export interface AcademicYear {
    code: string;
    updatedBy: any;
    userUpdatedDate: any;
    createdBy: any;
    createdAt: any;
    id: string;
    academicYear: string;
    startMonth: string;
    endMonth: string;
}

export interface ClassInfo {
    id: string;
    name: string;
}

export interface User {
    name: string;
    email: string;
}

export interface Topic {
    topicName: string;
    description: string;
    _id: string;
}

export interface Subject {
    id: string;
    name: string;
    code: string;
    nameAlias: string;
    status: boolean;
    isDeleted: boolean;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    deletedAt?: string;
    deletedBy?: string;
}

export interface SubjectData {
    subject: {
        id: string;
        name?: Subject; // Made optional based on API response
    };
    topics: Topic[];
}

export interface SyllabusEntry {
    subjects: any;
    _id: string;
    code:string;
    status:boolean;
    academicYear: AcademicYear;
    class: ClassInfo;
    createdBy: User;
    createdAt: string;
    syllabus: SubjectData[];
    updatedBy: User;
}

export interface SyllabusListResponse {
    success: boolean;
    message: string;
    data: {
        subjects: { subject: string; topics: { topicName: string; description: string; }[]; }[];
        class: string;
        academicYear: string;
        data: SyllabusEntry[];
        total: number;
    };
}


// Create Syllabouse
export const createSyllabus = async (
    data: SyllabusListResponse
  ): Promise<SyllabusListResponse> => {
    try {
      const token = await getAdminBearerToken();
      if (!token) {
        throw new Error("Authentication token is missing");
      }
      const response = await api.post<SyllabusListResponse>(
        `/lookups/syllabus/`,
        data, // Directly pass taxData
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
        "Error creating syllabus:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Failed to create syllabus"
      );
    }
  };

//   edit syllabus
export const updateSyllabusById = async (
    id: string,
    updatedsubjectsData: Partial<SyllabusListResponse>
  ): Promise<SyllabusListResponse> => {
    try {
      const token = await getAdminBearerToken();
      if (!token) {
        throw new Error("Authentication token is missing");
      }
  
      const response = await api.put<SyllabusListResponse>(
        `/lookups/syllabus/${id}`,
        updatedsubjectsData,
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
        "Error updating syllabus by ID",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Failed to update syllabus by ID"
      );
    }
  };

  
// fetch data

export const fetchSyllabus = async (
    page : number ,
    limit : number,
    academicYear?: string,
    classId?: string,
): Promise<{ syllabusList: SyllabusEntry[]; total: number }> => {
    try {
        const token = await getAdminBearerToken();
        if (!token) {
            throw new Error("Authentication token is missing");
        }

        const response = await api.get<SyllabusListResponse>("/lookups/syllabus", {
            params: { page, limit, academicYear, class: classId },
            headers: {
                "x-api-key": apikey,
                "x-app-version": appVersion,
                Authorization: `Bearer ${token}`,
            },
        });

        return {
            syllabusList: response.data.data.data,
            total: response.data.data.total,
        };
    } catch (error: any) {
        console.error(
            "Error fetching Syllabus",
            error.response?.data || error.message
        );
        throw new Error(
            error.response?.data?.message || "Failed to fetch Syllabus"
        );
    }
};
// fetch syllabous by id
export const fetchSyllabousById = async (id: string): Promise<SyllabusListResponse> => {
    try {
      const token = await getAdminBearerToken();
      if (!token) {
        throw new Error("Authentication token is missing");
      }
      const response = await api.get<SyllabusListResponse>(`/lookups/syllabus/${id}`, {
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
        "Error fetching syllabus by ID",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Failed to fetch syllabus by ID"
      );
    }
  };



// status update
export const updateStatusById = async (
    id: string,
    status: boolean
  ): Promise<SyllabusListResponse> => {
    try {
      const token = await getAdminBearerToken();
      if (!token) {
        throw new Error("Authentication token is missing");
      }
  
      const response = await api.patch(
        `/lookups/syllabus/${id}/status`,
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
        "Error updating syllabus status",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Failed to update Syllabus status"
      );
    }
  };
  
//   delete syllabus
export const deleteData = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const token = await getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.delete<{ success: boolean; message: string }>(
      `lookups/syllabus/${id}`,
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
      "Error deleting syllabus",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to delete syllabus"
    );
  }
};

