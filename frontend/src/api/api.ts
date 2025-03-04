import axios from "axios";
import { getAuthHeaders } from "@/utils/auth-utils";

const API_BASE_URL = "http://localhost:3001/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const apiV1Get = async (url: string, params?: any) => {
  const config = getAuthHeaders();
  try {
    const response = await apiClient.get(url, {
      headers: config,
      params: params,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.errors);
  }
};

export const apiV1Post = async (url: string, data = {}) => {
  const config = getAuthHeaders();
  try {
    const response = await apiClient.post(url, data, { headers: config });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.errors);
  }
};

export const apiV1Put = async (url: string, data = {}) => {
  const config = getAuthHeaders();
  try {
    const response = await apiClient.put(url, data, { headers: config });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.errors);
  }
};

export const apiV1Delete = async (url: string) => {
  const config = getAuthHeaders();
  try {
    const response = await apiClient.delete(url, { headers: config });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.errors);
  }
};
