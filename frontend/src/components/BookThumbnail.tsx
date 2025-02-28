"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";

interface BookThumbnailProps {
  isbn: string; // isbn を一つだけ受け取る
}

export const BookThumbnail = ({ isbn }: BookThumbnailProps) => {
  const router = useRouter();
  const { user_name } = useParams();
  const [cover, setCover] = useState<string | null>(null);

  useEffect(() => {
    const fetchCover = async () => {
      try {
        const res = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${isbn}+isbn`
        );
        const data = await res.json();
        const googleCover = data.items?.[0]?.volumeInfo?.imageLinks?.thumbnail;

        // 画像URLを設定（Google Booksの優先）
        setCover(
          googleCover || `https://ndlsearch.ndl.go.jp/thumbnail/${isbn}.jpg`
        );
      } catch (error) {
        console.error(`Failed to fetch cover for ISBN: ${isbn}`, error);
        setCover("/placeholder.jpg"); // 画像が取得できない場合、プレースホルダー画像を表示
      }
    };

    fetchCover();
  }, [isbn]);

  return (
    <div
      className="cursor-pointer"
      onClick={() => router.push(`${user_name}/books/${isbn}`)}
    >
      <Image
        src={cover || "/placeholder.jpg"}
        alt={`Book cover of ${isbn}`}
        width={128}
        height={192}
        className="rounded-lg shadow-md"
        unoptimized
      />
    </div>
  );
};
