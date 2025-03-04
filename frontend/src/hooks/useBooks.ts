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
  const { data, error, isLoading } = useSWR<Book[]>("/users/books", apiV1Get);

  return {
    books: data,
    isLoading,
    isError: error,
  };
};
