"use client";

import { useEffect, useState } from "react";
import styles from "./LevelCard.module.scss";

export type LevelInfo = {
  category: string;
  level: number;
};

type LevelCardProps = {
  LevelInfoArray: LevelInfo[];
};

const LevelBar = (props: { level: number }) => {
  const { level } = props;
  const [progress, setProgress] = useState(0);

  // TODO: 今後レベルの上限を議論
  // アニメーション的には、1levelの中で経験値によってプログレスバーを動かしたい
  const maxLevel = 30;
  const progressPercentage = (level / maxLevel) * 100;

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(progressPercentage);
    }, 200);

    return () => clearTimeout(timer);
  }, [progressPercentage]);

  return (
    <div className={`flex-grow-1 ${styles.levelBarContainer}`}>
      <div className={`progress ${styles.levelBar}`} style={{ height: "15px" }}>
        <div
          className={`progress-bar ${styles.bar}`}
          role="progressbar"
          style={{
            width: `${progress}%`,
            transition: "width 1500ms ease-in-out",
            backgroundColor: "#249474",
          }}
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
};

export const LevelCard = (props: LevelCardProps) => {
  const { LevelInfoArray } = props;

  return (
    <div className="card shadow-sm">
      <div className="card-body p-3">
        {LevelInfoArray.map((levelInfo, index) => (
          <div
            key={index}
            className={`d-flex align-items-center ${
              index !== LevelInfoArray.length - 1 ? "mb-3" : ""
            }`}
          >
            <div className="col-3 px-2">{levelInfo.category}</div>
            <div className="col-2 px-2 text-center">
              <span className="badge bg-secondary">Lv.{levelInfo.level}</span>
            </div>
            <div className="col-7 px-2">
              <LevelBar level={levelInfo.level} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
