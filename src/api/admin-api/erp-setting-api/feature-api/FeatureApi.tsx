import axios, { AxiosResponse } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface FeatureData {
  code: string;
  name: string;
  nameAlias?: string;
  _id: string;
  status: boolean;
  isDeleted: boolean;
  createdBy: any;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  allFeature:boolean;
  isEnabled:boolean;
  moreFeature:boolean;

  __v: number;
}

export interface CreateFeatureResponse {
 
  success: boolean;
  message: string;
  feature: FeatureData[];
}

export interface FetchFeaturesResponse {
  feature : any;
  success: boolean;
  message: string;
  features: FeatureData[];
}

// Create Feature
export const createFeature = async (
  addData: Partial<FeatureData>
): Promise<CreateFeatureResponse> => {
  try {
    const response = await axios.post<CreateFeatureResponse>(
      `${API_BASE_URL}/erp-feature/feature`,
      addData,
      { withCredentials: true }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error creating feature", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "Failed to create feature"
    );
  }
};

// Fetch All Features
export const fetchFeatures = async (): Promise<FetchFeaturesResponse> => {
  try {
    const response = await axios.get<FetchFeaturesResponse>(
      `${API_BASE_URL}/erp-feature/feature`,
      { withCredentials: true }
    );
    
    return response.data;
  } catch (error: any) {
    console.error("Error fetching features", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "Failed to fetch features"
    );
  }
};

// Fetch Feature by ID
export const fetchFeatureById = async (
  id: string
): Promise<CreateFeatureResponse> => {
  try {
    const response = await axios.get<CreateFeatureResponse>(
      `${API_BASE_URL}/erp-feature/feature/${id}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching feature by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch feature by ID"
    );
  }
};

// Update Feature Status
export const updateFeatureStatus = async (
  id: string,
  status: boolean
): Promise<CreateFeatureResponse> => {
  try {
    const response: AxiosResponse<CreateFeatureResponse> = await axios.patch(
      `${API_BASE_URL}/erp-feature/feature/${id}`,
      { status },
      { withCredentials: true }
    );
    console.log("API Response Data:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Error updating feature status:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update feature status"
    );
  }
};

// Delete Feature by ID
export const deleteFeature = async (id: string): Promise<any> => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/erp-feature/feature/${id}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting feature", error);
    throw error;
  }
};

// Update Feature by ID
export const updateFeatureById = async (
  id: string,
  updatedData: Partial<FeatureData>
): Promise<FeatureData> => {
  try {
    const response = await axios.put<FeatureData>(
      `${API_BASE_URL}/erp-feature/feature/${id}`,
      updatedData,
      { withCredentials: true }
    );
    console.log(response,'response')
    return response.data;
  } catch (error: any) {
    console.error("Error updating feature:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "Failed to update feature by ID"
    );
  }
};
