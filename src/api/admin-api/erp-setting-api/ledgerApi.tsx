
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";
import api from "@/api/axiosInstance";
import { AxiosResponse } from "axios";
export interface BankDetails {
  accountNumber: string;
  ifsccode: string;
  bankName: string;
}
export interface balanceTypeData {
  name: string;
  code: string;
}
export interface groupData {
  _id: string;
  groupName: string;
}
export interface subGroupData {
  _id: string;
  subGroupName: string;
}
export interface categoryData {
  _id: string;
  categoryName: string;
}
export interface currenciesData {
  name: string;
}
export interface LedgerData {
  bankDetails: BankDetails;
  _id: string;
  ledgerName: string;
  code: string;
  group: groupData;
  subGroup?: subGroupData;
  category: categoryData;
  balanceType: balanceTypeData;
  currencies: currenciesData;
  openingBalance: number;
  fileDocument: string;
  status: boolean;
  isDeleted: boolean;
  createdBy: string;
  isDefault: boolean;
  error: string;
  createdAt: string; // Use Date if converting ISO strings to Date objects
  updatedAt: string; // Use Date if converting ISO strings to Date objects
}
export interface LedgerDataResponse {
  total_records: number;
  rows: LedgerData[];
}
export interface LedgerResponse {
  success: boolean;
  message?: string;
  // ledgers: LedgerData[];
  ledgers: LedgerDataResponse;
  // rows: LedgerDataResponse;
  error: string;
}
export interface LedgerResponse {
  success: boolean;
  message?: string;
  ledger: LedgerData;
  error: string;
}

// Fetch all
export const fetchAllLedger = async (
  skip: Number,
  limit: Number,
  category: string,
  group: string,
  subgroup: string,
  status: boolean,
  searchTerm: string,
): Promise<LedgerResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.get<LedgerResponse>(
      `/lookups/ledger/${skip}/${limit}`,
      {
        params: { category, group, subgroup, searchTerm, status },
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
      "Error fetching ledger",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to fetch ledger");
  }
};

// Fetch a single subgroup by ID
export const fetchLedgerById = async (id: string): Promise<LedgerResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.get<LedgerResponse>(
      `/lookups/ledger/${id}`,
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
      "Error fetching ledger by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch ledger by ID"
    );
  }
};

// Update  by ID
export const updateLedgerById = async (
  id: string,
  updatedLedgerData: Partial<LedgerResponse>
): Promise<LedgerResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.put<LedgerResponse>(
      `/lookups/ledger/${id}`,
      updatedLedgerData,
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
      "Error updating ledger by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update ledger by ID"
    );
  }
};

// Delete
export const deleteLedger = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.delete<{ success: boolean; message: string }>(
      `/lookups/ledger/${id}`,
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
      "Error deleting ledger",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to delete ledger");
  }
};

// Create a new
export const createLedger = async (
  ledgerData: LedgerResponse
): Promise<LedgerResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.post<LedgerResponse>(
      `/lookups/ledger/`,
      ledgerData, // Directly pass
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
      "Error creating ledger:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to create ledger");
  }
};

// Update tax status by ID
export const updateStatusById = async (
  id: string,
  status: boolean
): Promise<LedgerResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response: AxiosResponse<LedgerResponse> = await api.patch(
      `/lookups/ledger/${id}`,
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
      "Error updating ledger status",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update ledger status"
    );
  }
};
