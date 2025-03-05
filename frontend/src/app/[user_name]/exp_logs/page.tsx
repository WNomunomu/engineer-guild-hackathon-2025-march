/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { LevelCard } from "@/components/LevelCard";
import { useState, useEffect } from "react";
import { apiV1Get } from "@/api/api";
import { useExpLogs } from "@/hooks/useExpLogs";

export default function ExpLogs() {
  const { data: levelData, isLoading, isError } = useExpLogs();

  return (
    <div className="mx-auto mt-4 w-75">
      <LevelCard LevelInfoArray={levelData || []} />
    </div>
  );
}
