"use client";

import { BooksListCard } from "@/components/BookListCard";
import { useParams } from "next/navigation";

export default function Books() {
  const { user_name } = useParams();
  return (
    <div className="mt-5">
      <div className="container text-center mt-5 mb-4">
        <div className="w-50 mx-auto bg-success bg-opacity-10 rounded py-4 px-3">
          <h3 className="fw-bold">{user_name} の本棚</h3>
        </div>
      </div>
      <div className="mx-auto w-100 mb-5 container">
        <BooksListCard />
      </div>
    </div>
  );
}
