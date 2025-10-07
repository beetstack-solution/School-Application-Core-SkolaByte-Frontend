import api from "@/api/axiosInstance";
import  { AxiosResponse } from "axios";


export interface bankData {
  _id: string;
  ifsc:string;
  accountNumber: string;
  bankName: string;
  branch: string;
  address: string;
  status: boolean;
  isDeleted: boolean;
  createdBy: string;
  isDefault: boolean;
  phoneNumber: string;
  email: string;
  createdAt: string; // Consider using Date type if parsing is handled elsewhere
  updatedAt: string; // Consider using Date type if parsing is handled elsewhere
  __v: number;
}

export interface BankResponse {
  success: boolean;
  message?:string;
  banks: bankData[];
}
export interface BankResponse {
  success: boolean;
  message?:string;
  bank: bankData;
}

// create
export const saveBankDetails = async (addData: BankResponse): Promise<BankResponse> => {
  try {
    const response = await api.post<BankResponse>(
      `/lookups/banks`,
      addData,
      { withCredentials: true }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error creating branch",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to create branch");
  }
};

export const fetchBanks = async (): Promise<BankResponse> => {
  try {
    const response = await api.get<BankResponse>(
      `/lookups/banks`,
      {
        withCredentials: true,
      }
    );
    console.log(response,"response get")
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching branches",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch branches"
    );
  }
};

//get by id
export const fetchBranchById = async (id: string): Promise<BankResponse> => {
  try {
    const response = await api.get<BankResponse>(
      `/lookups/banks/${id}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching branch by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch branch by ID"
    );
  }
};

// status update
export const updateStatus = async (
  id: string,
  status: boolean
): Promise<BankResponse> => {
  try {
    const response: AxiosResponse<BankResponse> = await api.patch(
      `/lookups/branch/${id}/status`,
      { status, id },
      {
        withCredentials: true,
      }
    );
    // Log the full response data for debugging
    console.log("API Response Data:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Error updating branch status:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update branch status"
    );
  }
};

  // dealete by id
export const deleteData = async (id: string): Promise<any> => {
  try {
    const response = await api.delete(
      `/lookups/branch/${id}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting branch", error);
    throw error;
  }
};



// update
export const updateBranchById = async (
  id: string,
  updatedData: Partial<BankResponse>
): Promise<BankResponse> => {
  try {
    const response = await api.put<BankResponse>(
      `/lookups/branch/${id}`,
      updatedData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error updating branch by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update branch by ID"
    );
  }
};