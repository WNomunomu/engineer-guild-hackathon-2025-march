/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from "axios";
import { getAuthHeaders } from "@/utils/auth-utils";

const API_BASE_URL = process.env.API_BASE_URL;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const apiV1Get = async (url: string, params?: Record<string, any>) => {
  const config = getAuthHeaders();
  try {
    const response = await apiClient.get(url, {
      headers: config,
      params: params,
    });
    return response.data;
  } catch (error) {
    // AxiosError 型を指定
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.errors);
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export const apiV1Post = async (url: string, data = {}) => {
  const config = getAuthHeaders();
  try {
    const response = await apiClient.post(url, data, { headers: config });
    return response.data;
  } catch (error) {
    // AxiosError 型を指定
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.errors);
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export const apiV1Put = async (url: string, data = {}) => {
  const config = getAuthHeaders();
  try {
    const response = await apiClient.put(url, data, { headers: config });
    return response.data;
  } catch (error) {
    // AxiosError 型を指定
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.errors);
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export const apiV1Delete = async (url: string) => {
  const config = getAuthHeaders();
  try {
    const response = await apiClient.delete(url, { headers: config });
    return response.data;
  } catch (error) {
    // AxiosError 型を指定
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.errors);
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
