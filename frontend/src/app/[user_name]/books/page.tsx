"use client";

import { BooksListCard } from "@/components/BookListCard";
import { useParams } from "next/navigation";

export default function Books() {
  const { user_name } = useParams();
  return (
    <>
      <h1 className="mb-4 ms-4 mt-4">{user_name}さんの本棚</h1>
      <BooksListCard />
    </>
  );
}
