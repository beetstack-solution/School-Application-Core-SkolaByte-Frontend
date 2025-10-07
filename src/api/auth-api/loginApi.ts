import axios from "axios";
import api from "@/api/axiosInstance";
 
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
const schoolKey = localStorage.getItem('x-school-apikey');

interface Address {
  street: string;
  city: string;
  state: string;
  district: string;
  zipCode: string;
  _id: string;
}
 
interface PaymentAddress {
  GSTNumber: string;
  city: string;
  state: string;
  district: string;
  zipCode: string;
  _id: string;    
}
 
interface User {
  _id: string;
  name: string;
  identifier: string;
  phone: string;
  role: string;
  address: Address;
  paymentAddress: PaymentAddress;
  status: boolean;
  isDeleted: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  userUpdatedBy: string;
  userUpdatedDate: string;
  deletedAt: string;
  deletedBy: string;
  [key: string]: any;
}
 
interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}
 
export const loginApi = async (
  identifier: string,
  password: string
): Promise<LoginResponse> => {
  try {
    // Read fresh from localStorage every time
    const schoolKey = localStorage.getItem('x-school-apikey');
    
    if (!schoolKey) {
      console.warn('x-school-apikey not found in localStorage');
    }

    const headers: Record<string, string> = {
      'x-api-key': apikey,
      'x-app-version': appVersion
    };

    // Only add if exists
    if (schoolKey) {
      headers['x-school-apikey'] = schoolKey;
    }

    const response = await axios.post<LoginResponse>(
      `${API_BASE_URL}/auth/login`,
      { identifier, password },
      {
        withCredentials: true,
        headers
      }
    );
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};