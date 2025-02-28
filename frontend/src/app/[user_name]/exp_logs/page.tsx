"use client";

import { useState } from "react";
import { LevelCard } from "@/components/LevelCard";

const mockUnreadBooks = [
  {
    title: "入門 コンピュータ科学 ITを支える技術と理論の基礎知識",
    category: "computer science",
    totalPage: 300,
  },
  {
    title: "Kubernetes CI/CDパイプラインの実装",
    category: "infrastructure",
    totalPage: 350,
  },
  { title: "Go言語による並行処理", category: "backend", totalPage: 400 },
  { title: "nginx実践入門", category: "infrastructure", totalPage: 280 },
  { title: "マスタリングTCP/IP―入門編", category: "network", totalPage: 350 },
  {
    title: "本気で学ぶ Linux実践入門",
    category: "infrastructure",
    totalPage: 500,
  },
  { title: "GCPの教科書", category: "cloud", totalPage: 450 },
  { title: "入門kubernetes", category: "infrastructure", totalPage: 320 },
  {
    title: "達人が教えるWebパフォーマンスチューニング",
    category: "web",
    totalPage: 370,
  },
];

const initialLevelData = [
  { category: "computer science", level: 7 },
  { category: "backend", level: 5 },
  { category: "infrastructure", level: 8 },
  { category: "CI/CD", level: 6 },
  { category: "network", level: 6 },
  { category: "cloud", level: 5 },
  { category: "web", level: 6 },
];

// テストでーた
/*
- title: '入門 コンピュータ科学 ITを支える技術と理論の基礎知識'
- category: 'コンピュータサイエンス'
- isbn: 9784048930543

- title: 'Kubernetes CI/CDパイプラインの実装'
- category: 'インフラ', 'CI/CD'
- isbn: '9784295012757'

- title: 'Go言語による並行処理'
- category: 'バックエンド', 'Go'
- isbn: '9784873118468'

- title: 'nginx実践入門'
- category: 'サーバー'
- isbn: '9784774178660'

- title: 'マスタリングTCP/IP―入門編'
- category: 'ネットワーク'
- isbn: '9784274224478'

- title: '本気で学ぶ Linux実践入門'
- category: 'Linux', 'インフラ', 'サーバー'
- isbn: '9784797397642'

- title: 'GCPの教科書'
- category: 'クラウド'
- isbn: '9784865941951'

- title: '入門kubernetes'
- category: 'インフラ','CI/CD'
- isbn: '9784873118406'

- title: '達人が教えるWebパフォーマンスチューニング'
- category: 'web'
- isbn: '9784297128463'

*/

export default function ExpLogs() {
  const [levelData, setLevelData] = useState(initialLevelData);
  // const [alreadyReadBooks, setAlreadyReadBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState("");
  const [readPages, setReadPages] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [alreadyReadBooks, setAlreadyReadBooks] = useState<
    { title: string; category: string; totalPage: number; readPages: number }[]
  >([]);

  const handleRegisterProgress = () => {
    if (!selectedBook || !readPages) return;
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
  };

  return (
    <>
      <div className="text-center my-4">
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          進捗を登録
        </button>
      </div>
      {showForm && (
        <div className="text-center">
          <select
            value={selectedBook}
            onChange={(e) => setSelectedBook(e.target.value)}
          >
            <option value="">本を選択</option>
            {mockUnreadBooks.map((book) => (
              <option key={book.title} value={book.title}>
                {book.title}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={readPages}
            onChange={(e) => setReadPages(e.target.value)}
            placeholder="読んだページ数"
          />
          <button className="btn btn-success" onClick={handleRegisterProgress}>
            登録
          </button>
        </div>
      )}
      <div className="mx-4">
        <LevelCard LevelInfoArray={levelData} />
      </div>
    </>
  );
}
