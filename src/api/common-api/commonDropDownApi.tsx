import { getAdminBearerToken } from "@/helpers/tokenHelper";
import axios, { AxiosResponse } from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import api from "@/api/axiosInstance";

export interface AccountGroup {
  _id: string;
  code: string;
  groupName: string;
  category: string;
  status: boolean;
  isDeleted: boolean;
  createdBy: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  userUpdatedBy: string;
  userUpdatedDate: string;
}

export interface AccountGroupResponse {
  success: boolean;
  data: AccountGroup[];
}



// Fetch all 
export const fetchAccountGroup = async (): Promise<AccountGroupResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.get<AccountGroupResponse>(
      `/dropdown-list/dd-account-groups`,
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
      "Error fetching account-groups",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch account-groups"
    );
  }
};



export interface Currency {
  _id: string;
  code: string;
  name: string;
  uniqueCode: string;
  symbol: string;
  status: boolean;
  isDeleted: boolean;
  createdBy: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  userUpdatedBy?: string;
  userUpdatedDate?: string;
}

export interface CurrencyApiResponse {
  success: boolean;
  data: Currency[];

}
export const fetchCurrencyDD = async (): Promise<CurrencyApiResponse> => {
  try {
    const token = getAdminBearerToken();
    const response = await api.get<CurrencyApiResponse>(
      `/dropdown-list/dd-currencies`,
      {
        headers: {
          'x-api-key': apikey,
          'x-app-version': appVersion,
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching currencies",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch currencies"
    );
  }
};


export interface CurrencyDecimal {
  _id: string;
  code: string;
  decimalValue: number;
  displayValue: string;
  status: boolean;
  isDeleted: boolean;
  createdBy: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  userUpdatedBy?: string;
  userUpdatedDate?: string;
}

export interface CurrencyDecimalApiResponse {
  success: boolean;
  data: CurrencyDecimal[];
}
export const fetchCurrencyDecimailsDD = async (): Promise<CurrencyDecimalApiResponse> => {
  try {
    const token = await getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.get<CurrencyDecimalApiResponse>(
      `/dropdown-list/dd-currency-decimals`,
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
      "Error fetching currency-decimals",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch currency-decimals"
    );
  }
};

export interface CurrencyFormat {
  _id: string;
  code: string;
  formatPattern: string;
  isDeleted: boolean;
  createdBy: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  userUpdatedBy?: string;
  userUpdatedDate?: string;
  name?: string;
  nameAlias?: string;
}

export interface CurrencyFormatApiResponse {
  success: boolean;
  data: CurrencyFormat[];
}

export const fetchCurrencyFormatDD = async (): Promise<CurrencyFormatApiResponse> => {
  try {
    const token = await getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.get<CurrencyFormatApiResponse>(
      `/dropdown-list/dd-currency-formats`,
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
      "Error fetching currency-formats",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch currency-formats"
    );
  }
};


export interface FinancialYear {
  _id: string;
  startMonth: string;
  endMonth: string;
  code: string;
  status: boolean;
  isDeleted: boolean;
  createdBy: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialYearApiResponse {
  success: boolean;
  data: FinancialYear[];
}

export const fetchFinancialYearDD = async (): Promise<FinancialYearApiResponse> => {
  try {
    const token = await getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.get<FinancialYearApiResponse>(
      `/dropdown-list/dd-financial-years`,
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
      "Error fetching financial-years",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch financial-years"
    );
  }
};





interface SubGroupDataById {
  _id: string;
  subGroupName: string;
  code: string;
  group: string;
  parentCategory: string;
  status: boolean;
  isDeleted: boolean;
  createdBy: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  category: string | null;
  userUpdatedBy?: string;
  userUpdatedDate?: string;
}

interface SubGroupApiByIdResponse {
  success: boolean;
  data: SubGroupDataById;
}

export const fetchSubGroupById = async (id: string): Promise<SubGroupApiByIdResponse> => {
  try {
    const response = await api.get<SubGroupApiByIdResponse>(
      `/dropdown-list/dd-categories/subgroup/${id}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching sub-group by ID",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch sub-group by ID"
    );
  }
};

export interface Branch {
  _id: string;
  code: string;
  name: string;
  address: string;
  phoneNumber: string;
  email: string;
  status: boolean;
  isDeleted: boolean;
  createdBy: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  userUpdatedBy?: string;
  userUpdatedDate?: string;
}

export interface BranchApiResponse {
  success: boolean;
  data: Branch[];
}
export const fetchBranchDD = async (): Promise<BranchApiResponse> => {
  try {
    const token = await getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.get<BranchApiResponse>(
      `/dropdown-list/dd-branches`,
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
      "Error fetching dd-branches",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch dd-branches"
    );
  }
};


export interface DateFormatData {
  _id: string;
  dateFormat: string;
  code: string;
  status: boolean;
  isDeleted: boolean;
  createdBy: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  userUpdatedBy?: string;
  userUpdatedDate?: string;
  name?: string;
  nameAlias?: string;
}

export interface DateFormatResponse {
  success: boolean;
  data: DateFormatData[];
}

export const fetchDateFormatDD = async (): Promise<DateFormatResponse> => {
  try {
    const token = await getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.get<DateFormatResponse>(
      `/dropdown-list/dd-date-formats`,
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
      "Error fetching dd-date-formats",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch dd-date-formats"
    );
  }
};

export interface SubGroup {
  _id: string;
  subGroupName: string;
  code: string;
  group: string;
  parentCategory?: string;
  category: string;
  status: boolean;
  isDeleted: boolean;
  createdBy: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  userUpdatedBy?: string;
  userUpdatedDate?: string;
}

export interface SubGroupResponse {
  success: boolean;
  data: SubGroup[];
}

export const fetchSubGroupDD = async (): Promise<DateFormatResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.get<DateFormatResponse>(
      `/dropdown-list/dd-sub-group`,
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
      "Error fetching dd-subgroups",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch dd-subgroups"
    );
  }
};


export interface VoucherCategoryDD {
  _id: string;
  code: string;
  voucherName: string;
  status: boolean;
  isDeleted: boolean;
  createdBy: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VoucherCategoryDDResponse {
  success: boolean;
  data: VoucherCategoryDD[];
}

// Fetch all 
export const fetchVoucherTypeCategories = async (): Promise<VoucherCategoryDDResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.get<VoucherCategoryDDResponse>(
      `/dropdown-list/dd-vouchers-categories/`,
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
      "Error fetching dd-vouchers-categories",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch dd-vouchers-categories"
    );
  }
};

export interface CategoryDD {
  _id: string;
  code: string;
  categoryName: string;
}

export interface AdminGroupDD {
  _id: string;
  code: string;
  groupName: string;
  category: CategoryDD;
  status: boolean;
  isDeleted: boolean;
  createdBy: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetAllAdminGroupsResponseDD {
  success: boolean;
  data: AdminGroupDD[];
}

export const fetchAdminGroupDD = async (): Promise<AccountGroupResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.get<AccountGroupResponse>(
      `/dropdown-list/dd-group-account-groups`,
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
      "Error fetching admin-group",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch admin-group"
    );
  }
};

//  staes dropdown api

export interface StateData {
  _id: string;
  name: string;
  status: boolean;
}

export interface FetchStatesResponse {
  success: boolean;
  message: string;
  data: StateData[];
}

export const fetchStatesDD = async (): Promise<FetchStatesResponse> => {
  try {
    const token = getAdminBearerToken();
    const response = await api.get<FetchStatesResponse>(
      `/dropdown-list/dd-states`,
      {
        headers: {
          'x-api-key': apikey,
          'x-app-version': appVersion,
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching dd-states",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch dd-states"
    );
  }
};
export interface FeatureData {
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
  feature: []
  __v: number;
}

export interface CreateFeatureResponse {

  success: boolean;
  message: string;
  feature: FeatureData[];
}

export interface FetchFeaturesResponse {
  success: boolean;
  message: string;
  feature: FeatureData[];
}

export const fetchFeatureById = async (
  id: string
): Promise<CreateFeatureResponse> => {
  try {
    const response = await api.get<CreateFeatureResponse>(
      `/erp-feature/feature/${id}`,
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

export const fetchFeatures = async (): Promise<FetchFeaturesResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.get<FetchFeaturesResponse>(
      `/erp-feature/feature`,
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
    console.error("Error fetching features", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "Failed to fetch features"
    );
  }
};



// District Data
export interface DistrictData {
  _id: string;
  name: string;
  en_name: string;
  mr_name: string;
  hi_name: string;
  state_id: string;
}

export interface FetchDistrictsResponse {
  success: boolean;
  message: string;
  result: DistrictData[];
}

// Function to fetch districts
export const fetchDistrictsDD = async (stateId: string): Promise<FetchDistrictsResponse> => {
  try {
    const token = getAdminBearerToken();
    const response = await api.get<FetchDistrictsResponse>(
      `/dropdown-list/dd-states/${stateId}`,
      {
        headers: {
          'x-api-key': apikey,
          'x-app-version': appVersion,
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching dd-districts",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch dd-districts"
    );
  }
};


export interface CountryDD {
  _id: string;
  code: string;
  countryName: string;
  nameAlias: string;
}

export interface CountryResponse {
  success: boolean;
  message: string;
  data: CountryDD[];
}


export const fetchCountryDD = async (): Promise<CountryResponse> => {
  try {
    const token = getAdminBearerToken();
    const response = await api.get<CountryResponse>(
      `/dropdown-list/dd-country`,
      {
        headers: {
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
      "Error fetching dd-country",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch dd-country"
    );
  }
};


// school app

export interface AcademicYear {
  _id: string;
  academicYear?: string;
  code?: string;
  startYear?: string;
  endYear?: string;
  startMonth: string;
  endMonth: string;
  status: boolean;
  isDeleted: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  userUpdatedBy?: string;
  userUpdatedDate?: string;
}

export interface AcademicYearResponse {
  success: boolean;
  message: string;
  data: AcademicYear[];
}

export const fetchAcademicYear = async (): Promise<AcademicYearResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.get<AcademicYearResponse>(
      `/dd/academic-years`,
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
      "Error fetching Academic year",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch Academic year"
    );
  }
};

// classes
export interface Classes {
  _id: string;
  name?: string;
  code?: string;
  nameAlias?: string;
  status: boolean;
  isDeleted: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  userUpdatedBy?: string;
  userUpdatedDate?: string;
}

export interface ClassesResponse {
  success: boolean;
  message: string;
  data: Classes[];
}

export const fetchClasses = async (): Promise<ClassesResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.get<ClassesResponse>(
      `/dd/classes`,
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
      "Error fetching Classes",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch Classes"
    );
  }
};

// subjects

export interface subjects {
  _id: string;
  name?: string;
  code?: string;
  nameAlias?: string;
  status: boolean;
  isDeleted: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  userUpdatedBy?: string;
  userUpdatedDate?: string;
}

export interface SubjectsResponse {
  success: boolean;
  message: string;
  data: AcademicYear[];
}

export const fetchSubjects = async (): Promise<SubjectsResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.get<SubjectsResponse>(
      `/dd/subjects`,
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
      "Error fetching subjects",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch subjects"
    );
  }
};

export interface Teacher {
  code: any;
  _id: string;
  name: string;
  // Add more fields if your backend provides them
}

export interface TeachersResponse {
  success: boolean;
  message: string;
  data: Teacher[];
}

export const fetchTeachers = async (): Promise<TeachersResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.get<TeachersResponse>(
      `/dd/teachers`, // adjust this endpoint if it's just `/teachers`
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
      "Error fetching teachers",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch teachers"
    );
  }
};


//fee Type
export interface FeeType {
  _id: string;
  name: string;
  code: string;
  nameAlias: string;
  status: boolean;
  isDeleted: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  userUpdatedBy?: string;
  userUpdatedDate?: string;
}

export interface FeeTypeResponse {
  success: boolean;
  message: string;
  data: FeeType[];
}

export const fetchFeeTypes = async (): Promise<FeeTypeResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.get<FeeTypeResponse>('/dd/feeType', {
      withCredentials: true,
      headers: {
        "x-api-key": apikey,
        "x-app-version": appVersion,
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching Fee Types",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch Fee Types"
    );
  }
};

// exam type
export interface ExamType {
  _id: string;
  name: string;
  code: string;
  nameAlias: string;
  status: boolean;
  isDeleted: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  userUpdatedBy?: string;
  userUpdatedDate?: string;
}


export interface ExamTypeResponse {
  success: boolean;
  message: string;
  data: ExamType[];
}

export const fetchExamTypeDD = async (): Promise<FeeTypeResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.get<FeeTypeResponse>('/dd/exam-type', {
      withCredentials: true,
      headers: {
        "x-api-key": apikey,
        "x-app-version": appVersion,
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching exam type",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch exam type"
    );
  }
};

export interface Division {
  _id: string;
  name: string;
  code: string;
  nameAlias: string;
  status: boolean;
  isDeleted: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  userUpdatedBy?: string;
  userUpdatedDate?: string;
}


export interface DivisionResponse {
  success: boolean;
  message: string;
  data: Division[];
}

export const fetchDivisionsDD = async (): Promise<DivisionResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.get<DivisionResponse>('/dd/divisions', {
      withCredentials: true,
      headers: {
        "x-api-key": apikey,
        "x-app-version": appVersion,
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching divisions",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch divisions"
    );
  }
};

export interface FeeInstallmentTypeData {
  code: string;
  name: string;
  noOfFeeInstallments: number;
  nameAlias?: string;
  _id: string;
  status: boolean;
  isDeleted: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  userUpdatedBy: {
    _id: string;
    name: string;
    email: string;
  };
  __v: number;
}

export interface FeeInstallmentTypesDetailResponse {
  success: boolean;
  message: string;
  data?: FeeInstallmentTypeData[];
  total: number;
}

export const fetchFeeInstallmentTypes = async (
  page: number,
  limit: number ): Promise<FeeInstallmentTypesDetailResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.get<FeeInstallmentTypesDetailResponse>("/lookups/fee-installment-type", {
      params: { page, limit },
      withCredentials: true,
      headers: {
        "x-api-key": apikey,
        "x-app-version": appVersion,
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching Fee Installment Types",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to fetch Fee Installment Types");
  }
};

export interface Student {
  _id: string;
  code: string;
  firstName: string;
  lastName: string;
  age: string;
  address: string;
  rollNumber: string;
  class: {
    id: string;
    name: string; // Assuming Class has a 'name' property
  };
  division: Division;
  academicYear: AcademicYear;
  dob: Date | string;
  gender: string;
  parentInfo: {
    id: string;
    fatherName: string;
    motherName: string;
    fatherContactNumber: string;
    motherContactNumber: string;
    email: string;
    password: string;
    fatherOccupation: string;
    motherOccupation: string;
  };
  guardian?: {
    id: string;
    guardianName: string;
    email: string;
    password: string;
    contactNumber: string;
    relation: string;
  };
}
export interface StudentsByClassDivisionAcademicYearResponse {
  success: boolean;
  data: Student[];
  message?: string;
}

export const getStudentsByClassDivisionAcademicYear = async (
  classId: string,
  divisionId: string,
  academicYearId: string
): Promise<StudentsByClassDivisionAcademicYearResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.get<StudentsByClassDivisionAcademicYearResponse>(
      `/dd/students/${classId}/${divisionId}/${academicYearId}`, {
      headers: {
        "x-api-key": apikey,
        "x-app-version": appVersion,
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
};

export interface Exam {
  _id: string;
  name: string;
  class: string;
  subject: string;
  academicYear: string;
  examType: string;
  date: string;
  duration: string;
  totalMarks: number;

}

export interface ExamResponse {
  success: boolean;
  message: string;
  data: Exam[];
}

export const fetchExamsDD = async (): Promise<ExamResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.get<ExamResponse>('/dd/exam', {
      withCredentials: true,
      headers: {
        "x-api-key": apikey,
        "x-app-version": appVersion,
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
};

export interface ExamTypeData {
  _id: string;
  name: string;
  code: string;
  nameAlias: string;

}
export interface ExamTypeDataResponse {
  success: boolean;
  message: string;
  data: ExamTypeData[];
}

export const fetchExamTypeDataDD = async (id: string): Promise<ExamTypeDataResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.get<ExamTypeDataResponse>(`/dd/exam/${id}/examType`, {
      withCredentials: true,
      headers: {
        "x-api-key": apikey,
        "x-app-version": appVersion,
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  }
  catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }

}


export interface FeeInstallmentType {
  name: string;
  _id: string;
  nameAlias: string;
  code: string;
}
export interface FeeInstallmentTypeResponse {
  success: boolean;
  message: string;
  data: FeeInstallmentType[];
}
export const fetchFeeInstallmentTypeDD = async (): Promise<FeeInstallmentTypeResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.get<FeeInstallmentTypeResponse>('/dd/feeInstallmentType', {
      withCredentials: true,
      headers: {
        "x-api-key": apikey,
        "x-app-version": appVersion,
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
}

export interface DdFunctionalityData {
  _id: string;
  name: string;
  code: string;
  status: boolean;
  isDeleted: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetDdFuncionalityApiResponse {
  success: boolean;
  message?: string;
  notifications?: DdFunctionalityData[];
}

export const fetchDdAllNotificationFunctionality = async (): Promise<GetDdFuncionalityApiResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.get<FeeInstallmentTypeResponse>('/lookups/notification-functionality/', {
      withCredentials: true,
      headers: {
        "x-api-key": apikey,
        "x-app-version": appVersion,
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
}

export interface DdSmartTagsData {
  _id: string;
  name: string;
  code: string;
  status: boolean;
  isDeleted: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetDdSmartTagsApiResponse {
  success: boolean;
  message?: string;
  notifications?: DdSmartTagsData[];
}

export interface SmartTagResponse {
  success: boolean;
  message?: string;
  notifications: DdSmartTagsData;
}

export const fetchDdAllNotificationSmartTags = async(): Promise<GetDdSmartTagsApiResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.get<GetDdSmartTagsApiResponse>('/lookups/notification-smart-tag/', {
      withCredentials: true,
      headers: {
        "x-api-key": apikey,
        "x-app-version": appVersion,
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }
}

export interface GetByIdNotificationTemplateData {
  _id: string;
  code: string;
  module: {
    _id: string;
    name: string;
  };
  triggerEvent: {
    _id: string;
    name: string;
  };
  smartTags: {
    _id: string;
    name: string;
  };
  nameTemplate:string;
  subjectTemplate:string;
  notificationTemplate: string;
  messageTemplate: string;
  emailTemplate: string;
  type: string;
  status: boolean;
  isDefault: boolean;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
  deletedAt?: string;
  deletedBy?: string;
  userUpdatedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  userUpdatedDate?: string;
}

export interface GetByIdNotificationTemplateApiResponse {
  success: boolean;
  message?: string;
  notificationTemplate?: GetByIdNotificationTemplateData;
}
export interface GetByIdNotificationTemplateApiResponse {
  success: boolean;
  message?: string;
  notificationTemplates?: GetByIdNotificationTemplateData;
}

export const fetchDdAllNotificationTemplate = async(): Promise<GetByIdNotificationTemplateApiResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.get<GetByIdNotificationTemplateApiResponse>('/lookups/notification-template', {
      withCredentials: true,
      headers: {
        "x-api-key": apikey,
        "x-app-version": appVersion,
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }
}

export interface DdModuleData {
  _id: string;
  name: string;
  code: string;
  nameAlias: string;
  status: boolean;
  isDeleted: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  userUpdatedBy?: string;
  userUpdatedDate?: string;
}

export interface GetDdModulesApiResponse {
  success: boolean;
  message?: string;
  modules: DdModuleData[];
}


 export const fetchDdAllNotificationModule = async(): Promise<GetDdModulesApiResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.get<GetDdModulesApiResponse>('/lookups/notification-module/', {
      withCredentials: true,
      headers: {
        "x-api-key": apikey,
        "x-app-version": appVersion,
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }
}
interface StudentData {
  _id: string;
  firstName: string;
  middleName?: string; // Marked optional as middle names aren't always present
  lastName: string;
  address: string;
  age: string; // Note: This is a string in the JSON data
  class: string; // Likely an ID referencing a Class object
  division: string; // Likely an ID referencing a Division object
  dob: string; // ISO 8601 Date string (e.g., "2008-03-14T00:00:00.000Z")
  gender: string; // Could potentially be a union type like 'Male' | 'Female' | 'Other'
  parentInfo: string; // Likely an ID referencing Parent Info
  guardian?: string; // Optional: Likely an ID referencing a Guardian
  status: boolean;
  isDeleted: boolean;
  createdBy: string; // Likely an ID referencing the creator User
  createdAt: string; // ISO 8601 Date string
  updatedAt: string; // ISO 8601 Date string
  __v: number; // Version key, often added by Mongoose
  userUpdatedBy?: string; // Optional: Likely an ID referencing the last updater User
  userUpdatedDate?: string; // Optional: ISO 8601 Date string of last update
  code?: string; // Optional: Student Code (e.g., "STD55")
  academicYear?: string; // Optional: Likely an ID referencing an Academic Year
  rollNumber?: string; // Optional: Student Roll Number
}

// You might also want an interface for the entire API response:
interface StudentApiResponse {
  success: boolean;
  message: string;
  data: StudentData[];
}

export const fetchDdAllStudents = async (): Promise<StudentApiResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.get<StudentApiResponse>('/dd/student', {
      withCredentials: true,
      headers: {
        "x-api-key": apikey,
        "x-app-version": appVersion,
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }
}


export interface  TotalMarkData {
  _id: string;
  totalMarks: number;

}

export interface  TotalMarkApiResponse {
  success: boolean;
  message: string;
  data: TotalMarkData[];
}

export const fetchDdTotalMark = async (examId: string): Promise<TotalMarkApiResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.get<TotalMarkApiResponse>(`/dd/exam/${examId}/totalMarks`, {
      withCredentials: true,
      headers: {
        "x-api-key": apikey,
        "x-app-version": appVersion,
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }
}
export interface AttendanceType {
  _id: string;
  code: string;
  name: string;
  nameAlias: string;
  status: boolean;
  isDeleted: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  userUpdatedBy?: string;
  userUpdatedDate?: string;
}

export interface AttendanceTypeResponse {
  success: boolean;
  message: string;
  data: AttendanceType[];
}

export const fetchAttendanceTypeDd = async (): Promise<AttendanceTypeResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.get<AttendanceTypeResponse>(
      `/dd/attendance-type`,
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
      "Error fetching Attendance Types",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch Attendance Types"
    );
  }
};

export interface AttendanceStatusType {
  _id: string;
  code: string;
  name: string;
  nameAlias: string;
  status: boolean;
  isDeleted: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  userUpdatedBy?: string;
  userUpdatedDate?: string;
}

export interface AttendanceStatusResponse {
  success: boolean;
  message: string;
  data: AttendanceStatusType[];
}

export const fetchAttendanceStatusDd = async (): Promise<AttendanceStatusResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.get<AttendanceStatusResponse>(
      `/dd/attendance-status`,
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
      "Error fetching Attendance status",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch Attendance status"
    );
  }
};

export interface EventTypeData {
  _id: string;
  name: string;
  description?: string;
  status: boolean;
  isDeleted: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  userUpdatedBy: string;
  userUpdatedDate: string;
}

export interface EventTypeDataResponse {
  success: boolean;
  message: string;
  data: EventTypeData[];
}

export const fetchEventTypeDataDD = async (): Promise<EventTypeDataResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const response = await api.get<EventTypeDataResponse>(`/dd/event-type`, {
      withCredentials: true,
      headers: {
        "x-api-key": apikey,
        "x-app-version": appVersion,
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  }
  catch (error) {
    console.error('Error fetching event types:', error);
    throw error;
  }
}

export interface StudentDataByClass {
  _id: string;
  code: string;
  firstName: string;
  lastName: string;
  academicYear: string;
  admissionNumber: string;
  imageUrl: string;
  rollNumber: string;
  address: string;
  age: string;
  class: string;
  division: string;
  dob: string;
  gender: "Male" | "Female" | "Other";
  parentInfo: string;
  status: boolean;
  isDeleted: boolean;
  createdBy: string;
  userUpdatedBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  userUpdatedDate?: string;
}

export interface StudentsResponse {
  success: boolean;
  message: string;
  data: StudentDataByClass[];
}

export const fetchStudentsByClass = async (classId: string, academicYearId: string): Promise<StudentsResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.get<StudentsResponse>(
      `/dd/students/${classId}/${academicYearId}`,
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
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
}

export const fetchAllStudentsByClassDivisionAcademicYear = async (classId: string, divisionId: string, academicYearId: string): Promise<StudentsResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.get<StudentsResponse>(
      `/dd/students/${classId}/${divisionId}/${academicYearId}`,
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
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
}


export interface VehicleType {
  _id: string;
  name: string;
  nameAlias: string;
  status: boolean;
  isDeleted: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  userUpdatedBy?: string;
  userUpdatedDate?: string;
}

export interface VehicleTypeResponse {
  success: boolean;
  message: string;
  data: VehicleType[];
}


export const fetchVehicleTypeDD = async (): Promise<VehicleTypeResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.get<VehicleTypeResponse>(
      `/dd/vehicle-type/`,
      {
        withCredentials: true,
        headers: {
          "x-api-key": apikey ,
          "x-app-version": appVersion,
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching vehicle types:', error);
    throw error;
  }
}


export interface VehicleResponse {
  success: boolean;
  message: string;
  data: VehicleInfo[];
}

export interface VehicleInfo {
  _id: string;
  vehicleType: string;
  vehicleNumber: string;
  vehicleCapacity?: number; // optional because it's missing in some entries
  vehicleName?: string;     // optional because not all have this field
  driver: DriverInfo;
  assistant: AssistantInfo;
  route: RouteInfo;
}

export interface DriverInfo {
  name: string;
  mobileNumber: string;
  address: string;
  licenseNumber: string;
}

export interface AssistantInfo {
  name: string;
  mobileNumber: string;
}

export interface RouteInfo {
  routeName: string;
  startTiming: string;
  exactEndTiming: string;
}


export const fetchVehicledriveDD = async (id: string): Promise<VehicleResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.get<VehicleResponse>(
      `/dd/vehicle/${id}/driver`,
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
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    throw error;
  }
}

export interface PlaceResponse {
  success: boolean;
  message: string;
  data: string;
}


export const fetchPlaceDD = async (id: string): Promise<PlaceResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.get<PlaceResponse>(
      `/dd/place/${id}/student`,
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
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    throw error;
  }
}


export interface TeacherSubjectsResponse {
  success: boolean;
  message: string;
  data: {
    assignments: Assignment[];
  };
}

export interface Assignment {
  teacher: TeacherSubject;
  subjects: Subject[];
}

export interface TeacherSubject {
  _id: string;
  code: string;
  name: string;
  email: string;
}

export interface Subject {
  _id: string;
  name: string;
}

export const fetchTeacherSubjects = async (classId: string, devisionId : string): Promise<TeacherSubjectsResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.get<TeacherSubjectsResponse>(
      `/lookups/assign-teacher-class/teacher-subjects/${classId}/${devisionId}`,
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
  } catch (error) {
    console.error('Error fetching teacher subjects:', error);
    throw error;
  }
}


export interface StateData {
  id: number;
  name: string;
  en_name: string;
  hi_name: string;
  mr_name: string;
  country_id: number;
}

export interface StateApiResponse {
  success: boolean;
  data: StateData[];
}

export const getAllStates = async (
  countryId: number
): Promise<StateApiResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.get<StateApiResponse>(
      `/dd/dd-country-wise-state/${countryId}`,
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
      "Error fetching dd-country",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message ||
        "Failed to fetch dd-country"
    );
  }
}


export interface DistrictData {
  id: number;
  name: string;
  en_name: string;
  mr_name: string;
  hi_name: string;
}

export interface DistrictApiResponse {
  success: boolean;
  message: string;
  data: DistrictData[];
}

export const getAllDistricts = async (
  countryId: number,
  stateId: number
): Promise<DistrictApiResponse> => {
  const token = getAdminBearerToken();

  if (!token) {
    throw new Error("Authentication token is missing");
  }

  try {
    const response = await api.get<DistrictApiResponse>(
      `/dd/dd-state-wise-district/${countryId}/${stateId}`,
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
    console.error("Error fetching dd-districts:", error);
    const errorMessage =
      error?.response?.data?.message || "Failed to fetch dd-districts";
    throw new Error(errorMessage);
  }
};

// get All Country

export interface CountryData {
  countrycode: number;
  countryname: string;
  stdcode: number;
  shortnm: null;
}

export interface CountryApiResponse {
  success: boolean;
  message: string;
  data: CountryData[];
}

export const getAllCountry = async (): Promise<CountryApiResponse> => {
  try {
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    const response = await api.get<CountryApiResponse>(
      `/dd/dd-all-countries`,
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
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    throw error;
  }
}
