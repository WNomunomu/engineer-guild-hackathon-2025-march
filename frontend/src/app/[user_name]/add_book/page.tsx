"use client";

import { useState } from "react";
import Image from "next/image";

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

export default function AddBook() {
  const [isbn, setIsbn] = useState<string>("");
  const [bookData, setBookData] = useState<BookData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
    // bookDataをサーバーに送信する処理をここに追加
  };

  return (
    <div className="container-fluid px-5 mt-5">
      <h1 className="mb-4">本を追加</h1>
      <div className="mb-3">
        <label htmlFor="isbn" className="form-label">
          ISBN番号:
        </label>
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
                <p>
                  <strong>著者:</strong> {book.summary.author}
                </p>
                <p>
                  <strong>出版社:</strong> {book.summary.publisher}
                </p>
                <p>
                  <strong>発行年:</strong> {book.summary.pubdate}
                </p>
                <p>
                  <strong>ページ数:</strong> {book.summary.pages || "不明"}
                </p>

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
                  onClick={() => handleAddBook(book)}
                >
                  この本を追加する
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
