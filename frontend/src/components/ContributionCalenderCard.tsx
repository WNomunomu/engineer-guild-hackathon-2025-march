/* eslint-disable @typescript-eslint/no-unused-vars */
import { ContributionCalendar } from "react-contribution-calendar";
import { useState, useEffect, useRef } from "react";
import { apiV1Get } from "@/api/api";
import { useReadingLogsBetweenDate } from "@/hooks/useReadingLogsBetweenDate";

const contributionData = [
  {
    "2023-04-20": { level: 2 },
  },
  {
    "2023-07-08": { level: 1 },
  },
  {
    "2023-07-09": { level: 4 },
  },
  {
    "2024-03-31": { level: 3 },
  },
];

export const ContributionCalenderCard = () => {
  const [startDate, setStartDate] = useState("2024-04-04");
  const [endDate, setEndDate] = useState("2025-04-04");
  const [conData, setConData] = useState<
    Record<string, { level: number }>[] | undefined
  >([]);
  const { readingLogs, isLoading, isError } = useReadingLogsBetweenDate(
    startDate,
    endDate
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState({ cx: 10, cy: 10 });

  useEffect(() => {
    setConData(readingLogs);
  }, [readingLogs]);

  useEffect(() => {
    const calculateCellSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const calculatedSize = Math.max(containerWidth / 60, 6);
        setCellSize({
          cx: calculatedSize,
          cy: calculatedSize,
        });
      }
    };

    calculateCellSize();

    const handleResize = () => {
      calculateCellSize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex row w-100">
          <div className="col-10 d-flex" ref={containerRef}>
            <ContributionCalendar
              data={conData}
              dateOptions={{
                start: startDate,
                end: endDate,
                startsOnSunday: true,
                includeBoundary: true,
              }}
              styleOptions={{
                theme: "grass",
                cr: 2,
                cx: cellSize.cx,
                cy: cellSize.cy,
                style: {
                  width: "100%",
                  height: "100%",
                  display: "block",
                  maxWidth: "100%",
                },
              }}
              scroll={false}
            />
          </div>
          <div className="col-2 d-flex flex-column">
            <button type="button" className="btn btn-original mb-1">
              2025
            </button>
            <button type="button" className="btn btn-original mb-1">
              2024
            </button>
            <button type="button" className="btn btn-original mb-1">
              2023
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
