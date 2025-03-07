/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { LevelCard } from "@/components/LevelCard";
import { useState, useEffect } from "react";
import { apiV1Get } from "@/api/api";
import { useExpLogs } from "@/hooks/useExpLogs";
import { useParams } from "next/navigation";

export default function ExpLogs() {
  const { data: levelData } = useExpLogs();
  const { user_name } = useParams();

  return (
    <div className="mx-auto mt-5 w-75">
      <h1 className="text-center mb-4 mt-4">{user_name} の分野別レベル</h1>
      <LevelCard LevelInfoArray={levelData || []} />
    </div>
  );
}
