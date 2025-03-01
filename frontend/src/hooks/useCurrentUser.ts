import useSWR from "swr";

import { apiV1Get } from "@/api/api";

interface User {
  allow_password_change: boolean;
  created_at: string;
  email: string;
  id: number;
  image: string | null;
  name: string;
  nickname: string | null;
  provider: string;
  uid: string;
  updated_at: string;
}

export const useCurrentUser = (options = {}) => {
  const { data, error, isLoading, mutate } = useSWR<User>(
    "/current_user",
    apiV1Get,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 60000,
      ...options,
    }
  );

  return {
    user: data,
    isLoading,
    isError: error,
    mutate,
  };
};
