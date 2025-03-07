"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { BookStack } from "@/components/BookStackCard";
import { apiV1Post } from "@/api/api";
import { useBooks } from "@/hooks/useBooks";
import { useParams, useRouter } from "next/navigation";
import type { Book } from "@/hooks/useBooks";

// Google Books API のレスポンスの型を定義
interface VolumeInfo {
  title: string;
  authors?: string[];
  publisher?: string;
  publishedDate?: string;
  pageCount?: number;
  categories?: string[];
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
    categories: string[];
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
  const { books } = useBooks();
  // 未読本に限定
  const unreadBooks = books?.filter((book: Book) => !book.completed);

  const { user_name } = useParams();

  const router = useRouter();

  const [isAnimationComplete, setIsAnimationComplete] =
    useState<boolean>(false);

  // 📌 2つの異なる `BookStack` のデータを用意
  const [bookDataArrayNew, setBookDataArrayNew] = useState<BookDataForStack[]>(
    []
  );
  const [bookDataArrayUnread, setBookDataArrayUnread] = useState<
    unknown[] | undefined
  >([]);

  // 📌 それぞれのオフセットを管理
  const [offsetsNew, setOffsetsNew] = useState<number[]>([]);
  const [offsetsUnread, setOffsetsUnread] = useState<number[]>([]);

  // コンポーネントのマウント時に状態をリセットする
  useEffect(() => {
    resetBookState();
  }, []);

  // 本の状態をリセットする関数
  const resetBookState = () => {
    setBookDataArrayNew([]);
    setBookDataArrayUnread([]);
    setIsbn("");
    setBookData([]);
    setIsAnimationComplete(false);
    setError(null);
  };

  const totalPagesNew = bookDataArrayNew.reduce(
    (sum, book) => sum + (book.totalPage || 0),
    0
  );
  const totalPagesUnread = (
    (bookDataArrayUnread as BookDataForStack[]) || []
  ).reduce((sum, book) => sum + (book.totalPage || 0), 0);
  const totalPagesSum = Math.floor((totalPagesNew + totalPagesUnread) * 0.1);

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
      console.log("google api called");
      const data = await res.json();

      if (data.items && data.items.length > 0) {
        const books: BookData[] = data.items.map((item: GoogleBooksItem) => {
          const googleCover = item.volumeInfo.imageLinks?.thumbnail || "";
          console.log(`googleCover: ${googleCover}`);
          return {
            summary: {
              title: item.volumeInfo.title,
              author: item.volumeInfo.authors?.join(", ") || "不明",
              publisher: item.volumeInfo.publisher || "不明",
              pubdate: item.volumeInfo.publishedDate || "不明",
              pages: item.volumeInfo.pageCount?.toString() || null,
              categories: item.volumeInfo.categories || [],
            },
            cover: googleCover,
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

  const handleAddBook = async (book: BookData) => {
    console.log("本を追加する処理:", book);

    // `BookStack` に渡す形式に変換
    const formattedBook: BookDataForStack = {
      title: book.summary.title,
      category: book.summary.publisher,
      totalPage: book.summary.pages ? parseInt(book.summary.pages, 10) : 200, // デフォルト200ページ
    };

    // TODO: エラーハンドリング
    await apiV1Post("/users/books", {
      title: book.summary.title,
      total_pages: book.summary.pages ? parseInt(book.summary.pages, 10) : 200,
      isbn: book.isbn,
      author: book.summary.author,
      image_url: book.cover,
      categories: book.summary.categories,
    });

    setBookDataArrayNew((prevBooks) => {
      const updatedBooks = [formattedBook, ...prevBooks];
      console.log(updatedBooks);
      setOffsetsNew(
        updatedBooks.map(() => Math.floor(Math.random() * 50) - 20)
      );
      return updatedBooks;
    });

    // 未読本のリスト（固定データ）
    setBookDataArrayUnread(() => {
      // const updatedBooks = [...prevBooks, ...mockUnreadBooks];
      const updatedBooks = unreadBooks;
      setOffsetsUnread(
        updatedBooks?.map(() => Math.floor(Math.random() * 50) - 20) || []
      );
      return updatedBooks;
    });
  };

  // 「さらに本を追加する」ボタンをクリックした時の処理
  const handleAddAnotherBook = () => {
    resetBookState();
  };

  return (
    <div className="container-fluid px-5 mt-5">
      {bookDataArrayNew.length > 0 ? (
        <div
          className="d-flex flex-column justify-content-center position-relative"
          style={{ minHeight: "80vh" }}
        >
          {/* 📌 タイトルを後から表示するが、位置を固定して BookStack が下がらないようにする */}
          {isAnimationComplete && (
            <motion.h2
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              style={{
                color: "#000", // 📌 タイトルの色を黒に変更
                fontSize: "2rem",
                position: "relative",
                top: "0px", // 📌 BookStack に影響を与えないよう上に配置
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              <div className="container text-center mt-5 mb-4">
                <div className="w-50 mx-auto bg-success bg-opacity-10 rounded py-4 px-3">
                  <h3 className="fw-bold">積読</h3>
                  <strong className="mt-3">標高: {totalPagesSum} mm</strong>
                </div>
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

          <BookStack
            bookDataArray={bookDataArrayUnread as BookDataForStack[]}
            offsets={offsetsUnread}
          />

          <div className="d-flex justify-content-center mt-5 mb-5">
            <button
              className="btn btn-original me-2"
              onClick={handleAddAnotherBook}
            >
              さらに本を追加する
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => router.push(`/${user_name}`)}
            >
              戻る
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="container text-center mt-5 mb-4">
            <div className="w-25 mx-auto bg-success bg-opacity-10 rounded py-4 px-3">
              <h3 className="fw-bold">本を追加</h3>
            </div>
          </div>
          <div className="mx-auto mb-3 w-50">
            {error && (
              <div className="alert alert-danger mt-3" role="alert">
                {error}
              </div>
            )}
            <label htmlFor="isbn" className="form-label">
              ISBN番号:
            </label>
            <input
              type="text"
              id="isbn"
              className="form-control form-control-original"
              value={isbn}
              onChange={handleIsbnChange}
              placeholder="ISBN番号を入力"
            />
            <button
              className="btn btn-original mb-3 mt-3"
              onClick={handleSearchBook}
              disabled={loading}
            >
              {loading ? "検索中..." : "検索"}
            </button>
          </div>

          {bookData.length > 0 && (
            <div className="mt-4 mx-auto w-75 mb-5">
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
                    <p>
                      <strong>カテゴリー:</strong> {book.summary.categories}
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
