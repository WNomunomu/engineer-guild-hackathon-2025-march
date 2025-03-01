import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api/v1";

const setAuthCookie = (headers) => {
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
    Accept: "application/json",
  },
});

interface LoginCredentials {
  email: string;
  password: string;
}

export const login = async ({ email, password }: LoginCredentials) => {
  try {
    // URLSearchParams を使用して application/x-www-form-urlencoded 形式で送信
    const params = new URLSearchParams();
    params.append("email", email);
    params.append("password", password);

    const response = await api.post("/auth/sign_in", params, {
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
    // URLSearchParams を使用して application/x-www-form-urlencoded 形式で送信
    const params = new URLSearchParams();
    params.append("email", credentials.email);
    params.append("password", credentials.password);
    params.append("password_confirmation", credentials.password_confirmation);
    params.append("name", credentials.name);

    const response = await api.post("/auth", params, {
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
