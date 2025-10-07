import axios, { AxiosResponse } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export interface ModuleItems {
  _id: string;
  name: string;
  code: string;
  status: boolean;
  createdAt: string;
}

export interface ModulesResponse {
  success: boolean;
  error?: string;
  message?: string;
  modules: ModuleItems[];
}

export interface ModuleResponse {
  data: any;
  success: boolean;
  error?: string;
  message?: string;
  module: ModuleItems; 
}

// Fetch all modules (multiple)
export const fetchModules = async (): Promise<ModulesResponse> => {
  try {
    const response = await axios.get<ModulesResponse>(
      `${API_BASE_URL}/lookups/module/`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching modules",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to fetch modules");
  }
};

// Fetch a single module by ID
export const fetchModelById = async (
  userId: string
): Promise<ModuleResponse> => {
  try {
    const response = await axios.get<ModuleResponse>(
      `${API_BASE_URL}/lookups/module/${userId}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching module by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch module by ID"
    );
  }
};

// Update module status by ID (no need to send `id` in the body since it's in the URL)
export const updateModulesStatusById = async (
  id: string,
  status: boolean
): Promise<ModuleResponse> => {
  try {
    const response: AxiosResponse<ModuleResponse> = await axios.patch(
      `${API_BASE_URL}/lookups/module/${id}/status`,
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
      "Error updating module status:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update module status"
    );
  }
};

export const deleteModule = async (moduleId: string): Promise<any> => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/lookups/module/${moduleId}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting module", error);
    throw error;
  }
};

    // create
    export const createData = async (
      groupData: ModulesResponse
    ): Promise<ModulesResponse> => {
      try {
        const response = await axios.post<ModulesResponse>(
          `${API_BASE_URL}/lookups/module/`,
          groupData,
          { withCredentials: true }
        );
        return response.data;
      } catch (error: any) {
        // console.error(
        //   "Error creating module",
        //   error.response?.data || error.message
        // );
        // throw new Error(
        //   error.response?.data?.message || "Failed to create module"
        // );
        if(error.response?.data){
          throw new Error(error.response?.data?.error || "An unexpected error occurred");
        }else{
          throw new Error("Failed to create Module. Please try again.");
        }
      }
    };

    //   update
  export const updateModuleById = async (
    id: string,
    updatedGroupData: Partial<ModuleItems>
  ): Promise<ModuleItems> => {
    try {
      const response = await axios.put<ModuleItems>(
        `${API_BASE_URL}/lookups/module/${id}`,
        updatedGroupData,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error: any) {
      console.error(
        "Error updating module by ID",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Failed to update module by ID"
      );
    }
  };