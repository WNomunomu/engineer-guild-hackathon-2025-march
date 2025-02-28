"use client";

import { ContributionCalenderCard } from "@/components/ContributionCalenderCard";

export default function ReadingLogs() {
  return (
    <div className="mt-5">
      <h1 className="text-center mb-4 mt-4">読書ログ</h1>
      <div className="mx-auto w-75">
        <ContributionCalenderCard />
      </div>
    </div>
  );
}
