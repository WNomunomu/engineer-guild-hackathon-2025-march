"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { AchievementCard } from "@/components/AchievementCard";
import { LevelCard } from "@/components/LevelCard";
import { BookStackCard } from "@/components/BookStackCard";
import { BooksListCard } from "@/components/BookListCard";

import { ContributionCalenderCard } from "@/components/ContributionCalenderCard";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useParams } from "next/navigation";
import { useBooks } from "@/hooks/useBooks";


export default function UserHome() {
  const { user_name } = useParams();

  const { user, isLoading } = useCurrentUser();
  const response = useBooks();
  console.log(response.books)
  const mockAlreadyReadBooks = (response.books || [])
    .filter((book) => book.completed)
    .map((book) => ({
      title: book.title,
      category: "infrastructure", // You might want to map this to a real category if available
      totalPage: book.total_pages,
    }));
  const mockUnreadBooks = (response.books || []).filter((book) => book.completed != true).map((book) => ({
    title: book.title,
    category: "infrastructure", // You might want to map this to a real category if available
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

  console.log(mockAlreadyReadBooks);
  console.log(user_name);

  if (user == null) return <></>;

  const levelData = [
    { category: "Computer Science", level: 7 },
    { category: "Backend", level: 5 },
    { category: "Infrastructure", level: 8 },
    { category: "CI/CD", level: 6 },
    { category: "Network", level: 6 },
    { category: "Cloud", level: 5 },
    { category: "Web", level: 6 },
    { category: "Go", level: 3 },
    { category: "Python", level: 2 },
  ];

  // const mockAlreadyReadBooks = [
  //   { title: "入門kubernetes", category: "infrastructure", totalPage: 320 },
  //   {
  //     title: "達人が教えるWebパフォーマンスチューニング",
  //     category: "web",
  //     totalPage: 370,
  //   },
  //   { title: "GCPの教科書", category: "cloud", totalPage: 450 },
  //   { title: "nginx実践入門", category: "infrastructure", totalPage: 280 },
  // ];

  // const mockUnreadBooks = [
  //   {
  //     title: "入門 コンピュータ科学 ITを支える技術と理論の基礎知識",
  //     category: "Computer Science",
  //     totalPage: 300,
  //   },
  //   {
  //     title: "Kubernetes CI/CDパイプラインの実装",
  //     category: "Infrastructure",
  //     totalPage: 350,
  //   },
  //   { title: "Go言語による並行処理", category: "Backend", totalPage: 400 },
  //   { title: "nginx実践入門", category: "Infrastructure", totalPage: 280 },
  //   { title: "マスタリングTCP/IP―入門編", category: "Network", totalPage: 350 },
  //   {
  //     title: "本気で学ぶ Linux実践入門",
  //     category: "Infrastructure",
  //     totalPage: 500,
  //   },
  //   { title: "GCPの教科書", category: "Cloud", totalPage: 450 },
  //   { title: "入門kubernetes", category: "Infrastructure", totalPage: 320 },
  //   {
  //     title: "達人が教えるWebパフォーマンスチューニング",
  //     category: "Web",
  //     totalPage: 370,
  //   },
  // ];



  return (
    <div className="container mt-5">
      <h2>{user.name} のホーム</h2>
      <p>積読を減らして、経験値を貯めよう！！📚✨</p>
      <div className="d-flex row mb-3">
        <div className="pe-3 col-2">
          <AchievementCard
            icon="menu_book"
            achievement="12"
            category="累計読破数"
          />
        </div>
        <div className="px-3 col-2">
          <AchievementCard
            icon="description"
            achievement="2,532"
            category="累計ページ数"
          />
        </div>
        <div className="px-3 col-2">
          <AchievementCard
            icon="today"
            achievement="78"
            category="連続読書日数"
          />
        </div>
        <div className="px-3 col-2">
          <AchievementCard
            icon="exposure_plus_1"
            achievement="13,298"
            category="累計獲得経験値"
          />
        </div>
        <div className="px-3 col-2">
          <AchievementCard
            icon="counter_7"
            achievement="66"
            category="今週のページ数"
          />
        </div>
        <div className="px-s col-2">
          <AchievementCard
            icon="dark_mode"
            achievement="66"
            category="今月のページ数"
          />
        </div>
      </div>
      <div className="d-flex row mb-3">
        <div
          className="col-8"
          onClick={() => router.push(`/${user_name}/exp_logs`)}
        >
          <LevelCard LevelInfoArray={levelData} />
        </div>
        <div className="col-4">
          <BookStackCard
            alreadyReadBooks={mockAlreadyReadBooks}
            unreadBooks={mockUnreadBooks}
          />
        </div>
      </div>
      <div onClick={() => router.push(`/${user_name}/reading_logs`)}>
        <ContributionCalenderCard />
      </div>
      <BooksListCard />
    </div>
  );
}
