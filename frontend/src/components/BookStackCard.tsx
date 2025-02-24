import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

type BookData = {
  title: string;
  category: string;
  totalPage: number;
};

type BookStackCardProps = {
  alreadyReadBooks: BookData[];
  unreadBooks: BookData[];
};

const BookStack = ({ bookDataArray, offsets }: { bookDataArray: BookData[]; offsets: number[] }) => {
  const colorVariants = ["#1e7a63", "#2da882", "#39b894"];

  return (
    <div className="d-flex flex-column align-items-center overflow-auto p-2" style={{ maxHeight: "350px" }}>
      {bookDataArray.map((bookData, index) => (
        <div
          key={index}
          className="w-75 py-2 px-3 text-white text-center rounded-3 shadow-sm fs-6 overflow-hidden text-truncate"
          style={{
            backgroundColor: colorVariants[index % colorVariants.length],
            transform: `translateX(${offsets[index] || 0}px)`,
            height: `${Math.min(80, Math.max(20, bookData.totalPage / 7))}px`, // ページ数で高さ調整
            lineHeight: "1.2",
          }}
        > 
          {bookData.title}
        </div>
      ))}
    </div>
  );
};

export const BookStackCard = ({ alreadyReadBooks, unreadBooks }: BookStackCardProps) => {
  const [showReadBooks, setShowReadBooks] = useState<boolean>(true);

  // 既読本と未読本のオフセットを独立に管理
  const [readOffsets, setReadOffsets] = useState<number[]>([]);
  const [unreadOffsets, setUnreadOffsets] = useState<number[]>([]);

  useEffect(() => {
    setReadOffsets(alreadyReadBooks.map(() => Math.floor(Math.random() * 50) - 20));
  }, [alreadyReadBooks, alreadyReadBooks.length]);

  useEffect(() => {
    setUnreadOffsets(unreadBooks.map(() => Math.floor(Math.random() * 50) - 20));
  }, [unreadBooks, unreadBooks.length]);

  const bookDataArray = showReadBooks ? alreadyReadBooks : unreadBooks;
  const offsets = showReadBooks ? readOffsets : unreadOffsets;

  return (
    <div className="mt-3 card shadow-sm mx-auto" style={{ maxWidth: "360px" }}>
      <div className="card-body p-3 text-center">
        <div className="btn-group w-100 mb-3">
          <button
            type="button"
            className={`btn ${showReadBooks ? "btn-success" : "btn-outline-success"}`}
            onClick={() => setShowReadBooks(true)}
          >
            既読本
          </button>
          <button
            type="button"
            className={`btn ${!showReadBooks ? "btn-warning" : "btn-outline-warning"}`}
            onClick={() => setShowReadBooks(false)}
          >
            未読本
          </button>
        </div>
        <BookStack bookDataArray={bookDataArray} offsets={offsets} />
      </div>
    </div>
  );
};
