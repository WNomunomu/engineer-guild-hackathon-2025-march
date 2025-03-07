import useSWR from "swr";
import { apiV1Get } from "@/api/api";

export type Book = {
  id: number;
  isbn: string;
  completed: boolean;
  title: string;
  author: string;
  total_pages: number;
  image_url: string | null;
  categories: { id: number; category: string }[];
};

export const useBooks = () => {
  const { data, error, isLoading, mutate } = useSWR<Book[]>(
    "/users/books",
    apiV1Get
  );

  return {
    books: data,
    isLoading,
    isError: error,
    mutate,
  };
};

export const useReadingProgress = (bookId: number) => {
  const { data, error, isLoading, mutate } = useSWR(
    ["/users/books/reading_progress", bookId],
    ([url, bookId]) => apiV1Get(url, { id: bookId })
  );

  return {
    data,
    isLoading,
    error,
    mutate,
  };
};
