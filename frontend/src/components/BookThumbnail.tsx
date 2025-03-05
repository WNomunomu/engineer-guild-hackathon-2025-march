"use client";

import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useBooks } from "@/hooks/useBooks";
import type { Book } from "@/hooks/useBooks";

interface BookThumbnailProps {
  bookId: number;
}

export const BookThumbnail = ({ bookId }: BookThumbnailProps) => {
  const router = useRouter();
  const { user_name } = useParams();

  const { books, isLoading } = useBooks();
  const book = books?.find((book: Book) => book.id === bookId);

  return (
    <div
      className="cursor-pointer hover-element"
      onClick={() => router.push(`/${user_name}/books/${bookId}`)}
    >
      {isLoading && (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">読み込み中...</span>
          </div>
        </div>
      )}
      {book && (
        <Image
          src={
            book?.image_url ||
            `https://ndlsearch.ndl.go.jp/thumbnail/${book?.isbn}.jpg` ||
            "/noimageimage.jpeg"
          }
          alt={`Book cover of ${book?.title}`}
          width={128}
          height={192}
          className="rounded-lg shadow-md"
          unoptimized
        />
      )}
    </div>
  );
};
