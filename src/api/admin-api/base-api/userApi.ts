const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";
import api from "@/api/axiosInstance";

export interface Address {
  street: string;
  city: string;
  state: string;
  district: string;
  zipCode: string;
}
export interface PaymentAddress {
  street: string;
  city: string;
  state: string;
  district: string;
  zipCode: string;
}
export interface UserData {
  name: string;
  email: string;
  password: string;
  id: string;
  phone: string;
  GSTNumber: string;
  address: Address;
  paymentAddress: PaymentAddress;
  role: string;
  status: boolean;
  isDeleted: boolean;
  userUpdatedDate: string;
  userUpdatedBy: string;
  deletedBy: string;
  deletedAt: string;
  isDefault: boolean;
}

export interface UserResponse {
  success: boolean;
  message?: string;
  data: UserData[];
}
export interface UserResponse {
  success: boolean;
  message?: string;
  userData: UserData;
}

export interface SingleUserDataResponse {
  success: boolean;
  message: string;
  data: {
    name: string;
    email: string;
    password: string;
    id: string;
    phone: string;
    paymentAddress: PaymentAddress;
    contactNumber: string;
    address: Address;
    role: string;
    user: UserData;
  };
}

// Fetch
export const fetchusers = async (): Promise<UserResponse> => {
  try {
    const token = await getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.get<UserResponse>(`/user/`, {
      withCredentials: true,
      headers: {
        "x-api-key": apikey,
        "x-app-version": appVersion,
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching user", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch user");
  }
};

// Fetch a single tax by ID
export const fetchuserById = async (id: string): Promise<SingleUserDataResponse> => {
  try {
    const token = await getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.get<SingleUserDataResponse>(
      `/user/${id}`,
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
      "Error fetching user by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch user by ID"
    );
  }
};

// Update tax by ID
export const updateuserById = async (
  taxId: string,
  updatedTaxData: Partial<UserData>
): Promise<UserData> => {
  try {
    const token = await getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.put<UserData>(
      `/user/${taxId}`,
      updatedTaxData,
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
      "Error updating user by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update user by ID"
    );
  }
};

export const updateStatusById = async (
  id: string,
  status: boolean
): Promise<UserResponse> => {
  try {
    const token = await getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.patch(
      `/user/${id}/status`,
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
      "Error updating user status",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update user status"
    );
  }
};

// Delete tax
export const deleteData = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const token = await getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.delete<{ success: boolean; message: string }>(
      `/user/${id}`,
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
    console.error("Error deleting user", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to delete user");
  }
};

// Create a new tax entry
export const createData = async (
  userData: UserResponse
): Promise<UserResponse> => {
  try {
    const token = await getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.post<UserResponse>(
      `/user/`,
      userData, // Directly pass taxData
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
      "Error creating user:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to create user");
  }
};
