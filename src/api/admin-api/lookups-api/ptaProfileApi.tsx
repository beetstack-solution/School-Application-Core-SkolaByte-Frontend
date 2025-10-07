import axios, { AxiosResponse } from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";
import api from "@/api/axiosInstance";

interface PTAProfileResponse {
  success: boolean;
  message: string;
  data: {
    data: PTAProfile[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface PTAProfile {
  _id: string;
  fullName: string;
  ptaRole: {
    _id: string;
    name: string;
  };
  email: string;
  imageUrl: string;
  status: boolean;
  createdBy: UserInfo;
  createdAt: string; // ISO date string
  userUpdatedDate?: string; // optional ISO date string
  updatedBy: Partial<UserInfo>; // might be empty
}

interface UserInfo {
  name: string;
  email: string;
}

export const getPTAProfile = async (
  page: number,
  limit: number
): Promise<PTAProfileResponse> => {
    try {
        const response: AxiosResponse<PTAProfileResponse> = await api.get(
        `lookups/pta-profile/`,
        {
            params: {
            page,
            limit,
            },
            // headers: {
            // "Content-Type": "application/json",
            // "x-api-key": apikey,
            // "x-app-version": appVersion,
            // Authorization: getAdminBearerToken(),
            // },
        }
        );
        return response.data;
    } catch (error) {
        throw new Error("Error fetching PTA profiles");
    }
}
export const getPTAProfileById = async (id: string): Promise<PTAProfile> => {
  try {
    const response: AxiosResponse<PTAProfile> = await api.get(
      `lookups/pta-profile/${id}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Error fetching PTA profile");
  }
};

export const createPTAProfile = async (
  ptaProfileData: FormData
): Promise<PTAProfile> => {
  try {
    const response: AxiosResponse<PTAProfile> = await api.post(
      `lookups/pta-profile/`,
      ptaProfileData,
  
    );
    return response.data;
  } catch (error) {
    throw new Error("Error creating PTA profile");
  }
};

export const updatePTAProfile = async (
  id: string,
  ptaProfileData: FormData
): Promise<PTAProfile> => {
  try {
    const response: AxiosResponse<PTAProfile> = await api.put(
      `lookups/pta-profile/${id}`,
      ptaProfileData
    );
    return response.data;
  } catch (error) {
    throw new Error("Error updating PTA profile");
  }
};

export const deletePTAProfile = async (id: string): Promise<void> => {
  try {
    await api.delete(`lookups/pta-profile/${id}`);
  } catch (error) {
    throw new Error("Error deleting PTA profile");
  }
};

export const UpdatePTAProfileStatus = async (
  id: string,
  status: boolean
): Promise<PTAProfile> => {
    try {
        const response: AxiosResponse<PTAProfile> = await api.patch(
        `lookups/pta-profile/${id}/status`,
        { status }
        );
        return response.data;
    } catch (error) {
        throw new Error("Error updating PTA profile status");
    }
}