import { apiClient, apiV1Delete } from "@/api/api";
import axios from "axios";

const setAuthCookie = (headers) => {
  const authToken = headers["access-token"];
  const client = headers["client"];
  const uid = headers["uid"];

  document.cookie = `access-token=${authToken}; path=/; SameSite=Strict`;
  document.cookie = `client=${client}; path=/; SameSite=Strict`;
  document.cookie = `uid=${uid}; path=/; SameSite=Strict`;
};

const getAuthCookie = (name: string) => {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split("=");
    if (cookieName === name) return cookieValue;
  }
  return "";
};

const clearCookieValue = (name: string) => {
  // Cookieの有効期限を過去の日付に設定することで削除
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict`;
};

const clearAuthCookies = () => {
  clearCookieValue("access-token");
  clearCookieValue("client");
  clearCookieValue("uid");
};

export const getAuthHeaders = () => {
  return {
    "access-token": getAuthCookie("access-token"),
    client: getAuthCookie("client"),
    uid: getAuthCookie("uid"),
  };
};

interface LoginCredentials {
  email: string;
  password: string;
}

export const login = async ({ email, password }: LoginCredentials) => {
  try {
    const params = new URLSearchParams();
    params.append("email", email);
    params.append("password", password);

    // response.headers が必要なので、apiV1Post は使わない
    const response = await apiClient.post("/auth/sign_in", params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    setAuthCookie(response.headers);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.errors || "Login failed");
    }
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await apiV1Delete("/auth/sign_out");

    clearAuthCookies();
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.errors || "Logout failed");
    }
    throw error;
  }
};

interface SignUpCredentials {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export const signUp = async (credentials: SignUpCredentials) => {
  try {
    const params = new URLSearchParams();
    params.append("email", credentials.email);
    params.append("password", credentials.password);
    params.append("password_confirmation", credentials.password_confirmation);
    params.append("name", credentials.name);

    // response.headers が必要なので、apiV1Post は使わない
    const response = await apiClient.post("/auth", params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    setAuthCookie(response.headers);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.errors?.full_messages?.[0] || "Sign up failed";
      throw new Error(errorMessage);
    }
    throw error;
  }
};
