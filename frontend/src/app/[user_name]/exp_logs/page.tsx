"use client";

import { LevelCard } from "@/components/LevelCard";
import { useExpLogs } from "@/hooks/useExpLogs";
import { useParams } from "next/navigation";

export default function ExpLogs() {
  const { data: levelData } = useExpLogs();
  const { user_name } = useParams();

  return (
    <div className="mx-auto mt-5 w-75">
      <div className="container text-center mt-5 mb-4">
        <div className="w-50 mx-auto bg-success bg-opacity-10 rounded py-4 px-3">
          <h3 className="fw-bold">{user_name} の分野別レベル</h3>
        </div>
      </div>
      <LevelCard LevelInfoArray={levelData || []} />
    </div>
  );
}
