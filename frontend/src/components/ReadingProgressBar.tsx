"use client";

interface ReadingProgressBarProps {
  readingProgress: boolean[];
  total_pages: number;
}

export const ReadingProgressBar = (props: ReadingProgressBarProps) => {
  const { readingProgress, total_pages } = props;

  return (
    <div style={{ height: "20px" }}>
      <div
        className="d-flex w-100 h-100 overflow-hidden rounded-pill border"
        style={{ width: "100%" }}
      >
        {Array.isArray(readingProgress) ? (
          readingProgress.map((isRead, index) => {
            const className = isRead ? "bg-original" : "bg-light";

            // 最後の要素は残りのスペースをすべて埋める
            const isLastElement = index === readingProgress.length - 1;
            const style = isLastElement
              ? { flexGrow: 1, height: "100%" }
              : { width: `${100 / total_pages}%`, height: "100%" };

            return <div key={index} className={className} style={style} />;
          })
        ) : (
          <div>Invalid reading progress data</div>
        )}
      </div>
    </div>
  );
};
