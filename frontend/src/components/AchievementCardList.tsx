/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useBooks } from "@/hooks/useBooks";
import { useExpLogs } from "@/hooks/useExpLogs";
import { useReadingStatus } from "@/hooks/useReadingLogs";

type AchievementCardProps = {
  icon: string;
  achievement: string;
  category: string;
};

export const AchievementCard = (props: AchievementCardProps) => {
  const { icon, achievement, category } = props;

  return (
    <div className="card shadow-sm p-3 bg-white rounded text-center h-100">
      <div className="card-body">
        <span className="material-symbols-outlined">{icon}</span>
        <h5 className="card-title mb-2">{achievement}</h5>
        <p className="card-text text-muted mb-0">{category}</p>
      </div>
    </div>
  );
};

export const AchievementCardList = () => {
  const { books } = useBooks();

  const { data: readingStatus } = useReadingStatus();

  return (
    <div className="row g-3">
      <div className="col-12 col-sm-6 col-md-4 col-lg-2">
        <AchievementCard
          icon="menu_book"
          achievement={
            books
              ?.filter((book) => book.completed === true)
              ?.length.toString() || "0"
          }
          category="累計読破数"
        />
      </div>
      <div className="col-12 col-sm-6 col-md-4 col-lg-2">
        <AchievementCard
          icon="description"
          achievement={`${readingStatus?.total_pages}`}
          category="累計ページ数"
        />
      </div>
      <div className="col-12 col-sm-6 col-md-4 col-lg-2">
        <AchievementCard
          icon="today"
          achievement={`${readingStatus?.streak_days}`}
          category="連続読書日数"
        />
      </div>
      <div className="col-12 col-sm-6 col-md-4 col-lg-2">
        <AchievementCard
          icon="exposure_plus_1"
          achievement={`${(readingStatus?.total_pages ?? 0) * 10}`}
          category="累計獲得経験値"
        />
      </div>
      <div className="col-12 col-sm-6 col-md-4 col-lg-2">
        <AchievementCard
          icon="counter_7"
          achievement={`${readingStatus?.weekly_pages}`}
          category="今週のページ数"
        />
      </div>
      <div className="col-12 col-sm-6 col-md-4 col-lg-2">
        <AchievementCard
          icon="dark_mode"
          achievement={`${readingStatus?.monthly_pages}`}
          category="今月のページ数"
        />
      </div>
    </div>
  );
};
