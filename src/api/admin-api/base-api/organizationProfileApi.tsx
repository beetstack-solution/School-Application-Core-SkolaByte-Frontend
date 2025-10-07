
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";
import api from "@/api/axiosInstance";
import { AxiosResponse } from "axios";

interface OrganizationAddress {
  street: string;
  city: string;
  state: string;
  district: string;
  zipCode: string;
}

interface PaymentAddress {
  GSTINNumber: string;
  streetName: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
}

export interface Organization {
  id: string;
  code: string;
  name: string;
  logo: string;
  phoneNumber: string;
  email: string;
  websiteUrl: string;
  address: OrganizationAddress;
  paymentAddress: PaymentAddress;
  headOffice: string;
  defaultCurrency: string;
  defaultDecimal: string;
  defaultFormat: string;
  defaultFinancialYear: string;
  status: boolean;
  isDeleted: boolean;
  userUpdatedDate?: string;
  userUpdatedBy?: string;
  createdBy: string;
  updatedBy?: string;
  deletedBy?: string;
  deletedAt?: string;
  isDefault: boolean;
}

interface OrganizationApiResponse {
  success: boolean;
  message?: string;
  organizations: Organization[];
}
interface OrganizationApiResponse {
  success: boolean;
  message?: string;
  organization: Organization;
}

// Fetch all taxes
export const fetchOrganizations =
  async (): Promise<OrganizationApiResponse> => {
    try {
       const token = await getAdminBearerToken();
       if (!token) {
         throw new Error("Authentication token is missing");
       }
      const response = await api.get<OrganizationApiResponse>(
        `/lookups/organisation-profile/`,
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
        "Error fetching organisation-profile",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Failed to fetch organisation-profile"
      );
    }
  };

// Fetch a single tax by ID
export const fetchOrganizationById = async (
  Id: string
): Promise<OrganizationApiResponse> => {
  try {
    const token = await getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.get<OrganizationApiResponse>(
      `/lookups/organisation-profile/${Id}`,
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
      "Error fetching organisation-profile by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message ||
        "Failed to fetch organisation-profile by ID"
    );
  }
};

// Update tax by ID
export const updateOrganizationById = async (
  Id: string,
  updatedData: Partial<Organization>
): Promise<Organization> => {
  try {
    const token = await getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.put<Organization>(
      `/lookups/organisation-profile/${Id}`,
      updatedData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-api-key": apikey,
          "x-app-version": appVersion,
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error updating organisation-profile by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message ||
        "Failed to update organisation-profile by ID"
    );
  }
};

// Update tax status by ID
export const updateStatus = async (
  id: string,
  status: boolean
): Promise<OrganizationApiResponse> => {
  try {
     const token = await getAdminBearerToken();
     if (!token) {
       throw new Error("Authentication token is missing");
     }
    const response: AxiosResponse<OrganizationApiResponse> = await api.patch(
      `/lookups/organisation-profile/${id}/status`,
      { status },
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
      "Error updating organisation-profile status",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message ||
        "Failed to update organisation-profile status"
    );
  }
};

// Delete tax
export const deleteData = async (
  Id: string
): Promise<{ success: boolean; message: string }> => {
  try {
     const token = await getAdminBearerToken();
     if (!token) {
       throw new Error("Authentication token is missing");
     }
    const response = await api.delete<{ success: boolean; message: string }>(
      `/lookups/organisation-profile/${Id}`,
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
      "Error deleting organisation-profile",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to delete organisation-profile"
    );
  }
};

// Create a new tax entry
export const createOrganisation = async (
  OrganisationData: OrganizationApiResponse
): Promise<OrganizationApiResponse> => {
  try {
     const token = await getAdminBearerToken();
     if (!token) {
       throw new Error("Authentication token is missing");
     }
    const response = await api.post<OrganizationApiResponse>(
      `/lookups/organisation-profile/`,
      OrganisationData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-api-key": apikey,
          "x-app-version": appVersion,
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "Error creating organisation-profile:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to create organisation-profile"
    );
  }
};
