"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { AchievementCardList } from "@/components/AchievementCardList";
import { LevelCard } from "@/components/LevelCard";
import { BookStackCard } from "@/components/BookStackCard";
import { BooksListCard } from "@/components/BookListCard";

import { ContributionCalenderCard } from "@/components/ContributionCalenderCard";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useParams } from "next/navigation";
import { useBooks } from "@/hooks/useBooks";
import { useSubmitReadingLogsModal } from "@/utils/modal";
import { useExpLogs } from "@/hooks/useExpLogs";

export default function UserHome() {
  const { user_name } = useParams();

  const { user, isLoading } = useCurrentUser();

  const { open } = useSubmitReadingLogsModal();

  const { data: levelData } = useExpLogs();

  const response = useBooks();
  console.log(response.books);

  const alreadyReadBooks = (response.books || [])
    .filter((book) => book.completed)
    .map((book) => ({
      title: book.title,
      totalPage: book.total_pages,
    }));
  const unreadBooks = (response.books || [])
    .filter((book) => book.completed != true)
    .map((book) => ({
      title: book.title,
      totalPage: book.total_pages,
    }));

  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.name !== user_name)) {
      router.push("/login");
    }
  }, [user_name, router, user, isLoading]);

  // ローディング中はローディング表示を返す
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // console.log(mockAlreadyReadBooks);
  // console.log(user_name);

  if (user == null) return <></>;

  return (
    <div className="container mt-5">
      <div className="d-flex">
        <div>
          <h2>{user.name} のホーム</h2>
          <p>積読を減らして、経験値を貯めよう！！📚✨</p>
        </div>
        <div className="p-4 d-flex justify-content-center">
          <button type="button" className="btn btn-original" onClick={open}>
            記録をつける
          </button>
        </div>
      </div>
      <div className="mt-4">
        <AchievementCardList />
      </div>
      <div className="d-flex row mt-4">
        <div
          className="col-8"
          onClick={() => router.push(`/${user_name}/exp_logs`)}
        >
          <LevelCard LevelInfoArray={levelData} />
        </div>
        <div className="col-4">
          <BookStackCard
            alreadyReadBooks={alreadyReadBooks}
            unreadBooks={unreadBooks}
          />
        </div>
      </div>
      <div className="mt-4">
        <ContributionCalenderCard />
      </div>
      <div className="mt-4 mb-4">
        <BooksListCard />
      </div>
    </div>
  );
}
