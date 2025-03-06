"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useSubmitReadingLogsModal } from "@/utils/modal";
import type { Book } from "@/hooks/useBooks";
import { useBooks } from "@/hooks/useBooks";
import { apiV1Delete } from "@/api/api";

export default function BookDetail() {
  const { bookId } = useParams();
  const numericBookId = Number(bookId);

  const { books, isLoading, isError } = useBooks();
  const book = books?.find((book: Book) => book.id === numericBookId);
  console.log(`book.image_url: ${book?.image_url}`);

  const handleDeleteButton = async() => {
    await apiV1Delete(`/users/books/${book?.id}`);
  }

  const { open } = useSubmitReadingLogsModal();
  return (
    <div className="container mt-5">
      <h1 className="text-center mt-4 mb-4">本の詳細</h1>

      {isLoading && (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">読み込み中...</span>
          </div>
        </div>
      )}

      {isError && (
        <div className="alert alert-danger mt-3" role="alert">
          <strong>エラー:</strong> {isError}
        </div>
      )}

      {book && (
        <div className="row d-flex flex-wrap mx-5">
          {/* Left Section - Book Details */}
          <div className="col-12 mb-4">
            <div className="card shadow-lg border-light">
              <div className="card-body">
                <div className="d-flex row">
                  <div className="col-md-6 col-12 position-relative">
                    <Image
                      src={
                        book.image_url ||
                        `https://ndlsearch.ndl.go.jp/thumbnail/${book.isbn}.jpg` ||
                        "/noimageimage.jpeg"
                      }
                      alt={`Cover of ${book.title}`}
                      unoptimized={true}
                      objectFit={"contain"}
                      fill
                    />
                  </div>
                  <div className="col-md-6 col-12">
                    <h2 className="card-title text-dark mb-3">{book.title}</h2>
                    <p className="card-text mb-2">
                      <strong>著者:</strong> {book.author}
                    </p>
                    {/*
                    <p className="card-text mb-2">
                      <strong>出版社:</strong> {booData.summary.publisher}
                    </p>
                    <p className="card-text mb-2">
                      <strong>発行年:</strong> {bookData.summary.pubdate}
                    </p>
                    */}
                    <p className="card-text mb-2">
                      <strong>ページ数:</strong> {book.total_pages || "不明"}
                    </p>
                    {/*
                    <p className="card-text mb-4">
                      <strong>カテゴリー:</strong>{" "}
                      {bookData.summary.categories || "不明"}
                    </p>
                    */}
                    <button
                      type="button"
                      className="btn btn-original"
                      onClick={open}
                    >
                      進捗を追加
                    </button>
                    <button
                      type="button"
                      className="btn btn-original"
                      style={{ marginLeft: "5px" }}
                      onClick={handleDeleteButton}
                    >
                      削除
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
