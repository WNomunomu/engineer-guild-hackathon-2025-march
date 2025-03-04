"use client";

import { CategoryList } from "@/components/CategoriesList";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

interface BookData {
  summary: {
    title: string;
    author: string;
    publisher: string;
    pubdate: string;
    pages: string | null;
  };
  cover: string;
}

// TODO: DBからそれぞれの本に応じたカテゴリを取得
const categories = ["AI", "Computer Science", "Network", "CI/CD"];

export default function BookDetail() {
  const { isbn, user_name } = useParams(); // /[user-name]/books/[isbn] から ISBN を取得
  const [bookData, setBookData] = useState<BookData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [showProgressForm, setShowProgressForm] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (!isbn) return; // ISBNが未取得なら処理しない

    const fetchBookDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${isbn}+isbn`
        );
        console.log("google api called");
        const data = await res.json();

        if (data.items) {
          const book = data.items[0].volumeInfo;

          // Google Books の画像URLを取得
          const googleCover = book.imageLinks?.thumbnail;

          // 画像URLをGoogle Books優先で取得
          const cover =
            googleCover || `https://ndlsearch.ndl.go.jp/thumbnail/${isbn}.jpg`;

          const pages = book.pageCount?.toString() || null;

          const fetchedBookData = {
            summary: {
              title: book.title,
              author: book.authors?.join(", ") || "不明",
              publisher: book.publisher || "不明",
              pubdate: book.publishedDate || "不明",
              pages,
            },
            cover,
          };
          setBookData(fetchedBookData);
        } else {
          setError("書籍が見つかりませんでした。");
          setBookData(null);
        }
      } catch (err) {
        console.log(err);
        setError("APIのリクエストに失敗しました。");
        setBookData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [isbn]);

  const handleProgressUpdate = () => {
    console.log(`進捗: ${currentPage} ページ`);
    // Here, you can add your logic to save/update the progress
    router.push(`/${user_name}/exp_logs`);
  };

  const handleUpdateButtonClick = () => {
    setShowProgressForm(true);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mt-4 mb-4">本の詳細</h1>

      {loading && (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">読み込み中...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger mt-3" role="alert">
          <strong>エラー:</strong> {error}
        </div>
      )}

      {bookData && (
        <div className="row d-flex flex-wrap mx-5">
          {/* Left Section - Book Details */}
          <div className="col-md-6 col-12 mb-4">
            <div className="card shadow-lg border-light">
              <div className="card-body">
                <h2 className="card-title text-dark mb-3">
                  {bookData.summary.title}
                </h2>
                <p className="card-text mb-2">
                  <strong>著者:</strong> {bookData.summary.author}
                </p>
                <p className="card-text mb-2">
                  <strong>出版社:</strong> {bookData.summary.publisher}
                </p>
                <p className="card-text mb-2">
                  <strong>発行年:</strong> {bookData.summary.pubdate}
                </p>
                <p className="card-text mb-4">
                  <strong>ページ数:</strong> {bookData.summary.pages || "不明"}
                </p>

                <div className="text-center">
                  <Image
                    src={bookData.cover}
                    alt={`Cover of ${bookData.summary.title}`}
                    width={200}
                    height={300}
                    className="img-fluid rounded shadow-sm mb-3"
                    unoptimized={true}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Progress & Categories */}
          <div className="col-md-6 col-12 mb-4">
            <div className="card shadow-lg h-100 border-light">
              <div className="card-body">
                <h4 className="card-title text-primary mb-4">進捗</h4>

                <p className="card-text mb-3">
                  現在読んだページ数: <strong>{currentPage}</strong> /{" "}
                  {bookData.summary.pages}
                </p>

                {showProgressForm ? (
                  <>
                    <div className="input-group mb-4">
                      <input
                        type="number"
                        className="form-control form-control-original"
                        value={currentPage}
                        onChange={(e) => setCurrentPage(Number(e.target.value))}
                        min={0}
                        max={Number(bookData.summary.pages)}
                        placeholder="進捗を入力"
                      />
                    </div>
                    <div className="text-center">
                      <button
                        onClick={handleProgressUpdate}
                        className="btn btn-original w-75 py-2"
                      >
                        進捗を登録
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center mt-3">
                    <button
                      onClick={handleUpdateButtonClick}
                      className="btn btn-outline-secondary w-75 py-2"
                    >
                      進捗を更新
                    </button>
                  </div>
                )}

                <div className="mt-4">
                  <h5 className="card-title text-primary">カテゴリ</h5>
                  <CategoryList categories={categories} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
