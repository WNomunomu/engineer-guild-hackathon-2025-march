"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */
import { ContributionCalendar } from "react-contribution-calendar";
import { useState, useEffect, useRef } from "react";
import { apiV1Get } from "@/api/api";
import { useReadingLogsBetweenDate } from "@/hooks/useReadingLogsBetweenDate";

export const ContributionCalenderCard = () => {
  const [startDate, setStartDate] = useState("2024-04-04");
  const [endDate, setEndDate] = useState("2025-04-04");
  const [normalizedData, setNormalizedData] = useState([]);

  const { readingLogs, isLoading, isError } = useReadingLogsBetweenDate(
    startDate,
    endDate
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState({ cx: 10, cy: 10 });

  // Normalize level values to be within 0-4 range
  useEffect(() => {
    if (readingLogs && readingLogs.length > 0) {
      // Create a deep copy of readingLogs to avoid mutation
      const normalizedLogs = JSON.parse(JSON.stringify(readingLogs));

      // Normalize the levels to be exactly between 1-4
      for (const dayData of normalizedLogs) {
        for (const date in dayData) {
          if (dayData[date] && typeof dayData[date].level === "number") {
            // If level is 0, make it 1
            if (dayData[date].level === 0) {
              dayData[date].level = 1;
            }
            // If level is greater than 4, cap it at 4
            else if (dayData[date].level > 4) {
              dayData[date].level = 4;
            }
            // Otherwise, make sure it's an integer between 1-4
            else {
              dayData[date].level = Math.max(
                1,
                Math.min(4, Math.round(dayData[date].level))
              );
            }
          }
        }
      }

      setNormalizedData(normalizedLogs);
    }
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

  // Handle year button clicks
  const handleYearClick = (year: string) => {
    const newStartDate = `${year}-01-01`;
    const newEndDate = `${year}-12-31`;
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex row w-100">
            <div>
              <h5 className="mb-3">{(new Date(startDate)).getFullYear()} Reading Logs</h5>
            </div>
          <div className="col-10 d-flex" ref={containerRef}>
            {isLoading ? (
              <div>Loading...</div>
            ) : isError ? (
              <div>Error loading data</div>
            ) : (
              <>
                <ContributionCalendar
                  data={normalizedData}
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
              </>
            )}
          </div>
          <div className="col-2 d-flex flex-column">
            <button
              type="button"
              className="btn btn-original mb-1"
              onClick={() => handleYearClick("2025")}
            >
              2025
            </button>
            <button
              type="button"
              className="btn btn-original mb-1"
              onClick={() => handleYearClick("2024")}
            >
              2024
            </button>
            <button
              type="button"
              className="btn btn-original mb-1"
              onClick={() => handleYearClick("2023")}
            >
              2023
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
