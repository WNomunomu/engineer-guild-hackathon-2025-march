"use client";

import { BooksListCard } from "@/components/BookListCard";
import { useParams } from "next/navigation";

export default function Books() {
  const { user_name } = useParams();
  return (
    <div className="mt-5">
      <h1 className="text-center mb-4 mt-4">{user_name}さんの本棚</h1>
      <div className="mx-auto w-100 container">
        <BooksListCard />
      </div>
    </div>
  );
}
