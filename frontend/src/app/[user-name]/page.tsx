"use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";

import { AchievementCard } from "@/components/AchievementCard";
import { LevelCard } from "@/components/LevelCard";

import { ContributionCalendar } from "react-contribution-calendar";

export default function UserHome({ params }: { params: { user_name: string } }) {
  // const router = useRouter();
  const user_name = params.user_name;

  const levelData = [
    { category: "frontend", level: 7 },
    { category: "backend", level: 5 },
    { category: "infrastructure", level: 8 },
    { category: "CI/CD", level: 6 }
  ];

  const contributionData = [
    {
      '2023-04-20': { level: 2 }
    },
    {
      '2023-07-08': { level: 1 },
    },
    {
      '2023-07-09': { level: 4 },
    },
    {
      '2024-03-31': { level: 3 }
    },
  ]

  // useEffect(() => {
  //   const storedUser = localStorage.getItem("user");
  //   if (!storedUser || storedUser !== user_name) {
  //     router.push("/login");
  //   }
  // }, [user_name, router]);

  return (
    <div className="container mt-5">
      <h2>{user_name} のホーム</h2>
      <p>積読を減らして、経験値を貯めよう！！📚✨</p>
      <AchievementCard
        icon='menu_book'
        achievement="66"
        category="book"
      />
      <LevelCard LevelInfoArray={levelData} />
      <ContributionCalendar
        data={contributionData}
        dateOptions={{
          start: '2023-04-04',
          end: '2024-04-04',
          // daysOfTheWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          startsOnSunday: true,
          includeBoundary: true,
        }}
        styleOptions={{
          theme: 'grass',
          cx: 10,
          cy: 10,
          cr: 2,
        }}
        // visibilityOptions={{
        //   hideDescription: false,
        //   hideMonthLabels: false,
        //   hideDayLabels: false,
        // }}
        scroll={false}
      />
    </div>
  );
}
