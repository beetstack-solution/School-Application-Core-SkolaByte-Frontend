import axios from "axios";
 
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
const schoolKey = import.meta.env.VITE_API_SCHOOL_KEY;




export interface SchoolVerificationResponse {
  success: boolean;
  message: string;
  data: {
    key: string;
    schoolName: string;
    schoolCode: string;
    dbName: string;
    mongoUri: string;
    schoolApiKey: string;
    schoolProfile: SchoolProfile;
  };
}

export interface SchoolProfile {
  _id: string;
  name: string;
  code: string;
  establishmentYear: number;
  type: string;
  educationLevel: string;
  imageUrl: string[];
  boardAffiliation: string;
  onBoarded: boolean;
  address: Address;
  contact: Contact;
  principalName: string;
  isPaymentEnabled: boolean;
  facilities: Facilities;
  branchDetails: BranchDetail[];
  status: boolean;
  isDeleted: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  _id: string;
}

export interface Contact {
  phone: string;
  email: string;
  website: string;
  _id: string;
}

export interface Facilities {
  library: boolean;
  lab: boolean;
  sports: boolean;
  transport: boolean;
  hostel: boolean;
  _id: string;
}

export interface BranchDetail {
  name: string;
  code: string;
  address: Address[];
  _id: string;
}

export const schoolCodeLoginApi = async (
  schoolCode: string,
  schoolKey: string
): Promise<SchoolVerificationResponse> => {
  try {
    const response = await axios.post<SchoolVerificationResponse>(
      `${API_BASE_URL}/school-initial/verify-school`,
      { schoolCode },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apikey,
          "x-app-version": appVersion,
        },
      }
    );
    return response.data;
  } catch (error:any) {
    throw new Error(
      error.response?.data?.message || "Failed to verify school code"
    );
  }
};