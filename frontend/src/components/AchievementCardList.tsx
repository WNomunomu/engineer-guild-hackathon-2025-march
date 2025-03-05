"use client";

type AchievementCardProps = {
  icon: string;
  achievement: string;
  category: string;
};

export const AchievementCard = (props: AchievementCardProps) => {
  const { icon, achievement, category } = props;

  return (
    <div className="card shadow-sm p-3 bg-white rounded text-center">
      <div className="card-body">
        <span className="material-symbols-outlined">{icon}</span>
        <h5 className="card-title mb-2">{achievement}</h5>
        <p className="card-text text-muted mb-0">{category}</p>
      </div>
    </div>
  );
};

export const AchievementCardList = () => {
  return (
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
  );
};
