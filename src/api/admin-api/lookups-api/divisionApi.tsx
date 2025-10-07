const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";
import api from "@/api/axiosInstance";

interface CreatedBy {
  name: string;
  email: string;
}

interface UpdatedBy {
  name: string;
  email: string;
}

export interface DivisionData {
  _id: string;
  name: string;
  code: string;
  status: boolean;
  createdBy: CreatedBy;
  createdAt: string;
  updatedBy?: UpdatedBy;
  isDeleted: boolean;
  isDefault?: boolean;
  userUpdatedDate?: string;
  __v: number;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    data: DivisionData[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface DivisionResponse {
  success: boolean;
  message?: string;
  data: DivisionData[];
}

export interface UserResponse {
  success: boolean;
  message?: string;
  DivisionData: DivisionData;
}

// create division
export const createDivision = async (
  data: DivisionResponse
): Promise<DivisionResponse> => {
  try {
    const token = await getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.post<DivisionResponse>(
      `/lookups/division/`,
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
      "Error creating division:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to create division"
    );
  }
};

// Edit division
export const updateDivisionById = async (
    id: string,
    updatedDivisionData: Partial<DivisionResponse>
  ): Promise<DivisionResponse> => {
    try {
      const token = await getAdminBearerToken();
      if (!token) {
        throw new Error("Authentication token is missing");
      }
  
      const response = await api.put<DivisionResponse>(
        `/lookups/division/${id}`,
        updatedDivisionData,
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
        "Error updating division by ID",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Failed to update division by ID"
      );
    }
  };
  

// fetch divisions
export const fetchDivisions = async (
  page = 1,
  limit = 10
): Promise<{ divisions: DivisionData[]; total: number }> => {
  try {
    const token = await getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.get<ApiResponse>(`/lookups/division`, {
      params: { page, limit },
      headers: {
        "x-api-key": apikey,
        "x-app-version": appVersion,
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      divisions: response.data.data.data,
      total: response.data.data.total, // Adjust according to API response
    };
  } catch (error: any) {
    console.error(
      "Error fetching divisions",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch divisions"
    );
  }
};
// get divsison by id
export const fetchDivisionById = async (id: string): Promise<ApiResponse> => {
  try {
    const token = await getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.get<ApiResponse>(`/lookups/division/${id}`, {
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
      "Error fetching division by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch division by ID"
    );
  }
};

// status change of division

export const updateStatusById = async (
  id: string,
  status: boolean
): Promise<ApiResponse> => {
  try {
    const token = await getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.patch(
      `lookups/division/${id}/status`,
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
      "Error updating division status",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update Disvision status"
    );
  }
};

//   delete divsion
export const deleteData = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const token = await getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.delete<{ success: boolean; message: string }>(
      `lookups/division/${id}`,
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
      "Error deleting division",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to delete division"
    );
  }
};
