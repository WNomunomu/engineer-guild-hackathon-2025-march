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

export default function UserHome() {
  const { user_name } = useParams();

  const { user, isLoading } = useCurrentUser();

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

  console.log(user);
  console.log(user_name);

  if (user == null) return <></>;

  const levelData = [
    { category: "frontend", level: 7 },
    { category: "backend", level: 5 },
    { category: "infrastructure", level: 8 },
    { category: "CI/CD", level: 6 },
    { category: "frontend", level: 7 },
    { category: "backend", level: 5 },
    { category: "infrastructure", level: 8 },
    { category: "CI/CD", level: 6 },
  ];

  const mockAlreadyReadBooks = [
    { title: "JavaScriptの本", category: "Frontend", totalPage: 250 },
    { title: "Reactの本", category: "Frontend", totalPage: 400 },
    { title: "Node.jsの本", category: "Backend", totalPage: 350 },
    { title: "データベースの本", category: "Database", totalPage: 500 },
  ];

  const mockUnreadBooks = [
    { title: "TypeScriptの本", category: "Frontend", totalPage: 230 },
    { title: "Go言語の本", category: "Backend", totalPage: 532 },
    { title: "Pythonの本", category: "Machine Learning", totalPage: 420 },
    { title: "Dockerの本", category: "DevOps", totalPage: 193 },
  ];

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
        <div className="col-8">
          <LevelCard LevelInfoArray={levelData} />
        </div>
        <div className="col-4">
          <BookStackCard
            alreadyReadBooks={mockAlreadyReadBooks}
            unreadBooks={mockUnreadBooks}
          />
        </div>
      </div>
      <div>
        <ContributionCalenderCard />
      </div>
      <BooksListCard />
    </div>
  );
}
