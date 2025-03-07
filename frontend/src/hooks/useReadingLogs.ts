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

export const useReadingLogsBetweenDate = (
  startDate: string,
  endDate: string
) => {
  const { data, error, isLoading, mutate } = useSWR(
    ["/users/reading_logs/retrieve-by-date", startDate, endDate],
    ([url, startDate, endDate]) =>
      apiV1Get(url, { startDate: startDate, endDate: endDate })
  );

  return {
    readingLogs: data,
    isLoading,
    isError: error,
    mutate,
  };
};

type ReadingStatus = {
  total_pages: number;
  streak_days: number;
  weekly_pages: number;
  monthly_pages: number;
};

export const useReadingStatus = () => {
  const { data, error, isLoading, mutate } = useSWR<ReadingStatus>(
    "/users/reading_logs",
    apiV1Get
  );

  return {
    data,
    isLoading,
    error,
    mutate,
  };
};
