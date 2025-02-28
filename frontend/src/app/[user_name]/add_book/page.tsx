"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { BookStack } from "@/components/BookStackCard";

// Google Books API のレスポンスの型を定義
interface VolumeInfo {
  title: string;
  authors?: string[];
  publisher?: string;
  publishedDate?: string;
  pageCount?: number;
  imageLinks?: {
    thumbnail?: string;
  };
}

interface GoogleBooksItem {
  volumeInfo: VolumeInfo;
}

interface BookData {
  summary: {
    title: string;
    author: string;
    publisher: string;
    pubdate: string;
    pages: string | null;
  };
  cover: string;
  isbn: string;
}

interface BookDataForStack {
  title: string;
  category: string;
  totalPage: number;
}

export default function AddBook() {
  const [isbn, setIsbn] = useState<string>("");
  const [bookData, setBookData] = useState<BookData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [isAnimationComplete, setIsAnimationComplete] = useState<boolean>(false);

  // 📌 2つの異なる `BookStack` のデータを用意
  const [bookDataArrayNew, setBookDataArrayNew] = useState<BookDataForStack[]>([]);
  const [bookDataArrayUnread, setBookDataArrayUnread] = useState<BookDataForStack[]>([]);

  // 📌 それぞれのオフセットを管理
  const [offsetsNew, setOffsetsNew] = useState<number[]>([]);
  const [offsetsUnread, setOffsetsUnread] = useState<number[]>([]);

  const totalPagesNew = bookDataArrayNew.reduce((sum, book) => sum + book.totalPage, 0);
  const totalPagesUnread = bookDataArrayUnread.reduce((sum, book) => sum + book.totalPage, 0);
  const totalPagesSum = Math.floor((totalPagesNew + totalPagesUnread)*0.1);


  const handleIsbnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsbn(event.target.value);
  };

  const validateIsbn = (isbn: string): string | null => {
    const sanitizedIsbn = isbn.replace(/-/g, "");
    if (!/^\d{13}$/.test(sanitizedIsbn)) {
      return "ISBN番号が無効です";
    }
    return null;
  };

  const handleSearchBook = async () => {
    const isbnError = validateIsbn(isbn);
    if (isbnError) {
      setError(isbnError);
      setBookData([]);
      return;
    }
    const sanitizedIsbn = isbn.replace(/-/g, "");

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${sanitizedIsbn}+isbn`
      );
      const data = await res.json();

      if (data.items && data.items.length > 0) {
        const books: BookData[] = data.items.map((item: GoogleBooksItem) => {
          const googleCover = item.volumeInfo.imageLinks?.thumbnail || "";
          return {
            summary: {
              title: item.volumeInfo.title,
              author: item.volumeInfo.authors?.join(", ") || "不明",
              publisher: item.volumeInfo.publisher || "不明",
              pubdate: item.volumeInfo.publishedDate || "不明",
              pages: item.volumeInfo.pageCount?.toString() || null,
            },
            cover:
              googleCover ||
              `https://ndlsearch.ndl.go.jp/thumbnail/${sanitizedIsbn}.jpg`,
            isbn: sanitizedIsbn,
          };
        });
        setBookData(books);
      } else {
        setError("書籍が見つかりませんでした。");
        setBookData([]);
      }
    } catch (err) {
      console.log(err);
      setError("APIのリクエストに失敗しました。");
      setBookData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = (book: BookData) => {
    console.log("本を追加する処理:", book);
  
    // `BookStack` に渡す形式に変換
    const formattedBook: BookDataForStack = {
      title: book.summary.title,
      category: book.summary.publisher,
      totalPage: book.summary.pages ? parseInt(book.summary.pages, 10) : 200, // デフォルト200ページ
    };

    console.log(formattedBook.totalPage)

    const mockUnreadBooks: BookDataForStack[] = [
      { title: "Kubernetes CI/CDパイプラインの実装", category: "CI/CD", totalPage: 350 },
      { title: "Go言語による並行処理", category: "backend", totalPage: 400 },
      { title: "nginx実践入門", category: "infrastructure", totalPage: 280 },
      { title: "マスタリングTCP/IP―入門編", category: "infrastructure", totalPage: 350 },
      { title: "本気で学ぶ Linux実践入門", category: "infrastructure", totalPage: 500 },
      { title: "GCPの教科書", category: "infrastructure", totalPage: 450 },
      { title: "入門kubernetes", category: "CI/CD", totalPage: 320 },
      { title: "達人が教えるWebパフォーマンスチューニング", category: "frontend", totalPage: 370 },
    ]

    setBookDataArrayNew((prevBooks) => {
      const updatedBooks = [formattedBook, ...prevBooks];
      setOffsetsNew(updatedBooks.map(() => Math.floor(Math.random() * 50) - 20));
      return updatedBooks;
    });
  
    // 未読本のリスト（固定データ）
    setBookDataArrayUnread((prevBooks) => {
      const updatedBooks = [...prevBooks, ...mockUnreadBooks];
      setOffsetsUnread(updatedBooks.map(() => Math.floor(Math.random() * 50) - 20));
      return updatedBooks;
    });
  };
  

  return (
    <div className="container-fluid px-5 mt-5">
      {bookDataArrayNew.length > 0 ? (
        <div className="d-flex flex-column justify-content-center position-relative" style={{ minHeight: "80vh" }}>
          {/* 📌 タイトルを後から表示するが、位置を固定して BookStack が下がらないようにする */}
          {isAnimationComplete && (
            <motion.h2
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              style={{
                color: "#000", // 📌 タイトルの色を黒に変更
                fontWeight: "bold",
                fontSize: "2rem",
                position: "absolute", // 📌 位置を固定
                top: "0px", // 📌 BookStack に影響を与えないよう上に配置
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              積読
              <div className="text-center mt-3">
                <strong>標高: {totalPagesSum} mm</strong>
              </div>

            </motion.h2>
          )}

          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            onAnimationComplete={() => setIsAnimationComplete(true)}
            style={{ marginBottom: "-16px" }}
          >
            <BookStack bookDataArray={bookDataArrayNew} offsets={offsetsNew} />
          </motion.div>

          <BookStack bookDataArray={bookDataArrayUnread} offsets={offsetsUnread} />
      </div>
      
      ) : (
        <>
          <h1 className="mb-4">本を追加</h1>
          <div className="mb-3">
            <label htmlFor="isbn" className="form-label">ISBN番号:</label>
            <input
              type="text"
              id="isbn"
              className="form-control form-original"
              value={isbn}
              onChange={handleIsbnChange}
              placeholder="ISBN番号を入力"
            />
          </div>
          <button
            className="btn btn-primary mb-3"
            onClick={handleSearchBook}
            disabled={loading}
          >
            {loading ? "検索中..." : "検索"}
          </button>
  
          {error && (
            <div className="alert alert-danger mt-3" role="alert">
              {error}
            </div>
          )}
  
          {bookData.length > 0 && (
            <div className="mt-4">
              {bookData.map((book, index) => (
                <div className="card mt-3" key={index}>
                  <div className="card-body">
                    <h2 className="card-title">{book.summary.title}</h2>
                    <p><strong>著者:</strong> {book.summary.author}</p>
                    <p><strong>出版社:</strong> {book.summary.publisher}</p>
                    <p><strong>発行年:</strong> {book.summary.pubdate}</p>
                    <p><strong>ページ数:</strong> {book.summary.pages || "不明"}</p>
  
                    <div className="text-center">
                      <Image
                        src={book.cover}
                        alt={`Cover of ${book.summary.title}`}
                        width={150}
                        height={225}
                        className="img-fluid"
                      />
                    </div>
  
                    <button
                      className="btn btn-original mt-3"
                      onClick={() => {
                        console.log("ボタンがクリックされました", book);
                        handleAddBook(book);
                      }}
                    >
                      この本を追加する
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );  
}
