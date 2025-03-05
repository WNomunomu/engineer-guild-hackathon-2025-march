import useSWR from "swr";
import { apiV1Get } from "@/api/api";

// export type Book = {
//   id: number;
//   isbn: string;
//   completed: boolean;
//   title: string;
//   author: string;
//   total_pages: number;
//   image_url: string | null;
//   categories: { id: number; category: string }[];
// };

export const useExpLogs = () => {
  const { data, error, isLoading } = useSWR("/users/exp_logs", apiV1Get);

  return {
    data,
    isLoading,
    isError: error,
  };
};
