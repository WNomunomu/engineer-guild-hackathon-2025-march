import axios, { AxiosResponse } from "axios";
import { kMaxLength } from "buffer";

const API_BASE_URL = "http://localhost:3001/api/v1";

const setAuthCookie = (headers: any) => {
  const authToken = headers["access-token"];
  const client = headers["client"];
  const uid = headers["uid"];

  document.cookie = `access-token=${authToken}; path=/; SameSite=Strict`;
  document.cookie = `client=${client}; path=/; SameSite=Strict`;
  document.cookie = `uid=${uid}; path=/; SameSite=Strict`;
};

export const getAuthCookie = (name: string) => {
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

// 認証ヘッダーを取得する関数
const getAuthHeaders = () => {
  return {
    "access-token": getAuthCookie("access-token"),
    client: getAuthCookie("client"),
    uid: getAuthCookie("uid"),
  };
};

// axios インスタンスの設定
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

interface LoginCredentials {
  email: string;
  password: string;
}

export const login = async ({ email, password }: LoginCredentials) => {
  try {
    const response = await api.post("/auth/sign_in", {
      email,
      password,
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
    const response = await api.delete("/auth/sign_out", {
      headers: getAuthHeaders(),
    });

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
    const response = await api.post("/auth", {
      email: credentials.email,
      password: credentials.password,
      password_confirmation: credentials.password_confirmation,
      name: credentials.name,
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
