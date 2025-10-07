import axios, { AxiosResponse } from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";
import api from "@/api/axiosInstance";
import exp from "constants";



interface Meta {
  _id: string;
  metaTitle: string;
  metaDescription: string;
  metaAuthor: string;
  metaKeywords: string[];
}

interface Page {
  _id: string;
  pageUrl: string;
  pageTitle: string;
  pageCode: string;
  name: string;
  shortDescription: string;
  description: string;
  content: string;
  meta: Meta[];
  pageBannerImage?: string;
  brochure?: string;
  headerText: string;
  headerSubText: string;
  metaTags: string[];
  isDeleted: boolean;
  createdBy: string;
  deletedBy: string | null;
  deletedAt: string | null;
  status: boolean;
  parentPage: string | null;
  subPageFlag: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface PagesResponse {
  success: boolean;
  pages: Page[];
}

export const fetchAllPages = async (): Promise<PagesResponse> => {
  const token = getAdminBearerToken();
  if (!token) {
    throw new Error("Authentication token is missing");
  }
  try {
    const response: AxiosResponse<PagesResponse> = await api.get(
      `${API_BASE_URL}/page/`,
    
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching CMS pages",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch CMS pages"
    );
  }
}

export const fetchPageById = async (id: string): Promise<Page> => {
  const token = getAdminBearerToken();
  if (!token) {
    throw new Error("Authentication token is missing");
  }
  try {
    const response: AxiosResponse<Page> = await api.get(
      `${API_BASE_URL}/page/${id}`,
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching CMS page by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch CMS page by ID"
    );
  }
}


export const createPage = async (data: Page): Promise<Page> => {
  const token = getAdminBearerToken();
  if (!token) {
    throw new Error("Authentication token is missing");
  }
  try {
    const response: AxiosResponse<Page> = await api.post(
      `${API_BASE_URL}/page/`,
      data,
    
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error creating CMS page",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to create CMS page"
    );
  }
}

export const updatePage = async (id: string, data: Page): Promise<Page> => {
  const token = getAdminBearerToken();
  if (!token) {
    throw new Error("Authentication token is missing");
  }
  try {
    const response: AxiosResponse<Page> = await api.put(
      `${API_BASE_URL}/page/${id}`,
      data,
    
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error updating CMS page",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update CMS page"
    );
  }
}

export const deletePage = async (id: string): Promise<void> => {
  const token = getAdminBearerToken();
  if (!token) {
    throw new Error("Authentication token is missing");
  }
  try {
   const response = await api.delete<any>(`${API_BASE_URL}/page/${id}`);
   return response.data;
  } catch (error: any) {
    console.error(
      "Error deleting CMS page",
      error.response?.data || error.message
    )
    throw new Error(
      error.response?.data?.message || "Failed to delete CMS page"
    );
  }
}

export const updatePageStatus = async (id: string, status: boolean): Promise<Page> => {
  const token = getAdminBearerToken();
  if (!token) {
    throw new Error("Authentication token is missing");
  }
  try {
    const response: AxiosResponse<Page> = await api.patch(
      `${API_BASE_URL}/page/${id}/status`,
      { status },
    
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error updating CMS page status",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update CMS page status"
    );
  }
}