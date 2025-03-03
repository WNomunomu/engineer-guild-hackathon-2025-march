// import useSWR from "swr";
// import { fetcher } from "@/api/api";

// export type Book = {
//   id: number;
//   title: string;
//   author: string;
//   total_pages: number;
//   image_url: string | null;
//   categories: { id: number; category: string }[];
// };

// export const useBooks = () => {
//   const { data, error, isLoading } = useSWR<Book[]>("/books", fetcher);

//   return {
//     books: data,
//     isLoading,
//     isError: error,
//   };
// };
