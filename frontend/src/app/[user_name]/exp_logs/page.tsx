"use client";

import { useState } from "react";
import { LevelCard } from "@/components/LevelCard";

const mockUnreadBooks = [
  {
    title: "入門 コンピュータ科学 ITを支える技術と理論の基礎知識",
    category: "Computer Science",
    totalPage: 300,
  },
  {
    title: "Kubernetes CI/CDパイプラインの実装",
    category: "Infrastructure",
    totalPage: 350,
  },
  { title: "Go言語による並行処理", category: "Backend", totalPage: 400 },
  { title: "nginx実践入門", category: "Infrastructure", totalPage: 280 },
  { title: "マスタリングTCP/IP―入門編", category: "Network", totalPage: 350 },
  {
    title: "本気で学ぶ Linux実践入門",
    category: "Infrastructure",
    totalPage: 500,
  },
  { title: "GCPの教科書", category: "Cloud", totalPage: 450 },
  { title: "入門kubernetes", category: "Infrastructure", totalPage: 320 },
  {
    title: "達人が教えるWebパフォーマンスチューニング",
    category: "Web",
    totalPage: 370,
  },
];

const initialLevelData = [
  { category: "Computer Science", level: 7 },
  { category: "Backend", level: 5 },
  { category: "Infrastructure", level: 8 },
  { category: "CI/CD", level: 6 },
  { category: "Network", level: 6 },
  { category: "Cloud", level: 5 },
  { category: "Web", level: 6 },
  { category: "Go", level: 3 },
  { category: "Python", level: 2 },
];

export default function ExpLogs() {
  const [levelData, setLevelData] = useState(initialLevelData);
  const [selectedBook, setSelectedBook] = useState("");
  const [readPages, setReadPages] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const [alreadyReadBooks, setAlreadyReadBooks] = useState<
    { title: string; category: string; totalPage: number; readPages: number }[]
  >([]);

  const handleRegisterProgress = () => {
    if (!selectedBook || !readPages || isNaN(Number(readPages))) {
      setError("本を選択し、読んだページ数を正しく入力してください。");
      return;
    }
    const book = mockUnreadBooks.find((b) => b.title === selectedBook);
    if (!book) return;

    const pagesRead = Number(readPages) || 0;
    const updatedBooks = [
      ...alreadyReadBooks,
      { ...book, readPages: Number(readPages) },
    ];
    setAlreadyReadBooks(updatedBooks);

    const updatedLevelData = levelData.map((data) =>
      data.category === book.category
        ? {
            ...data,
            level:
              data.level + Math.floor((pagesRead / book.totalPage) * 3 + 1),
          }
        : data
    );
    setLevelData(updatedLevelData);

    setSelectedBook("");
    setReadPages("");
    setShowForm(false);
    setError("");
  };

  return (
    <>
      <div className="text-center my-4">
        <button
          className="btn btn-original"
          onClick={() => setShowForm(!showForm)}
        >
          進捗を登録
        </button>
      </div>
      {showForm && (
        <div className="card p-4 shadow-lg rounded w-50 mx-auto">
          <h4 className="mx-5">進捗登録</h4>
          <div className="mb-3 mx-5">
            <label htmlFor="bookSelect" className="form-label">
              本を選択
            </label>
            <select
              id="bookSelect"
              value={selectedBook}
              onChange={(e) => setSelectedBook(e.target.value)}
              className="form-select form-select-original"
            >
              <option value="">本を選択</option>
              {mockUnreadBooks.map((book) => (
                <option key={book.title} value={book.title}>
                  {book.title}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3 mx-5">
            <label htmlFor="pagesRead" className="form-label">
              読んだページ数
            </label>
            <input
              id="pagesRead"
              type="number"
              value={readPages}
              onChange={(e) => setReadPages(e.target.value)}
              placeholder="読んだページ数"
              className="form-control form-control-original"
            />
          </div>
          {error && <p className="text-danger">{error}</p>}
          <div className="text-center">
            <button
              className="btn btn-success"
              onClick={handleRegisterProgress}
            >
              登録
            </button>
          </div>
        </div>
      )}
      <div className="mx-auto mt-4 w-75">
        <LevelCard LevelInfoArray={levelData} />
      </div>
    </>
  );
}
