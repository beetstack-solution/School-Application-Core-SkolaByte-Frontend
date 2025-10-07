import axios, { AxiosResponse } from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apikey = import.meta.env.VITE_API_KEY;
const appVersion = import.meta.env.VITE_APP_VERSION;
import { getAdminBearerToken } from "@/helpers/tokenHelper";
import { toast } from "react-toastify";


export const fetchProfitAndLoss = async (
  startDate: string,
  endDate: string
): Promise<any> => {
  try {
    console.log("Starting");
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    console.log(startDate, endDate, "datesss");

    const response = await axios.get<any>(
      `${API_BASE_URL}/profit-loss/${startDate}/${endDate}`,
      {
        withCredentials: true,
        headers: {
          "x-api-key": apikey,
          "x-app-version": appVersion,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(response.data, "responseDataaa");
    return response.data;
  } catch (error: any) {
    console.error("Error fetching profit loss records", error);

   
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch profit and Loss";
 toast.error(errorMessage); 
    throw new Error(errorMessage);
  }
};

export const fetchBalanceSheet = async (
  startDate: string,
  endDate: string
): Promise<any> => {
  try {
    console.log("Starting");
    const token = getAdminBearerToken();
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    console.log(startDate, endDate, "datesss");

    const response = await axios.get<any>(
      `${API_BASE_URL}/balance-sheet/${startDate}/${endDate}`,
      {
        withCredentials: true,
        headers: {
          "x-api-key": apikey,
          "x-app-version": appVersion,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(response.data, "responseDataaa");
    return response.data;
  } catch (error: any) {
    console.error("Error fetching profit loss records", error);

    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch profit and Loss";
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};
