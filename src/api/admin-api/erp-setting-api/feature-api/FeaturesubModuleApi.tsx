import axios, { AxiosResponse } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Define the structure for a FeatureSubModule
export interface FeatureSubModuleData {
  code: string;
  name: string;
  nameAlias?: string;
  _id: string;
  status: boolean;
  isDeleted: boolean;
  createdBy: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  allFeature:boolean;
  isEnabled:boolean;
  moreFeature:boolean;
  featureId: string; // Link to Feature Module
  __v: number;
}

// Define the structure for the create feature submodule response
export interface CreateFeatureSubModuleResponse {
  subModule: any;
  success: boolean;
  message: string;
  features: FeatureSubModuleData[];
}

export interface FetchFeatureSubModulesResponse {
  subModule: any;
  success: boolean;
  message: string;
  features: FeatureSubModuleData[];
  feature : any;
}

// Create Feature SubModule
export const createFeatureSubModule = async (
  addData: Partial<FeatureSubModuleData>
): Promise<CreateFeatureSubModuleResponse> => {
  try {
    const response = await axios.post<CreateFeatureSubModuleResponse>(
      `${API_BASE_URL}/erp-feature/feature-sub-module`,
      addData,
      { withCredentials: true }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error creating feature submodule", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "Failed to create feature submodule"
    );
  }
};

// Fetch All Feature SubModules
export const fetchFeatureSubModules = async (_subModuleId: string): Promise<FetchFeatureSubModulesResponse> => {
  try {
    const response = await axios.get<FetchFeatureSubModulesResponse>(
      `${API_BASE_URL}/erp-feature/feature-sub-module`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching feature submodules", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "Failed to fetch feature submodules"
    );
  }
};

// Fetch Feature SubModule by ID
export const fetchFeatureSubModuleById = async (
  id: string
): Promise<CreateFeatureSubModuleResponse> => {
  try {
    const response = await axios.get<CreateFeatureSubModuleResponse>(
      `${API_BASE_URL}/erp-feature/feature-sub-module/${id}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching feature submodule by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch feature submodule by ID"
    );
  }
};

// Update Feature SubModule Status
export const updateFeatureSubModuleStatus = async (
  id: string,
  status: boolean
): Promise<CreateFeatureSubModuleResponse> => {
  try {
    const response: AxiosResponse<CreateFeatureSubModuleResponse> = await axios.patch(
      `${API_BASE_URL}/erp-feature/feature-sub-module/${id}`,
      { status },
      { withCredentials: true }
    );
    console.log("API Response Data:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Error updating feature submodule status:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update feature submodule status"
    );
  }
};

// Delete Feature SubModule by ID
export const deleteFeatureSubModule = async (id: string): Promise<any> => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/erp-feature/feature-sub-module/${id}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting feature submodule", error);
    throw error;
  }
};

// Update Feature SubModule by ID
export const updateFeatureSubModuleById = async (
  id: string,
  updatedData: Partial<FeatureSubModuleData>
): Promise<FeatureSubModuleData> => {
  try {
    const response = await axios.put<FeatureSubModuleData>(
      `${API_BASE_URL}/erp-feature/feature-sub-module/${id}`,
      updatedData,
      { withCredentials: true }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error updating feature submodule:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "Failed to update feature submodule by ID"
    );
  }
};
