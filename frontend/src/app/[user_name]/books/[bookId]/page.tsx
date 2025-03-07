"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useSubmitReadingLogsModal } from "@/utils/modal";
import type { Book } from "@/hooks/useBooks";
import { useReadingProgress, useBooks } from "@/hooks/useBooks";
import { apiV1Delete } from "@/api/api";
import { ReadingProgressBar } from "@/components/ReadingProgressBar";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function BookDetail() {
  const { bookId } = useParams();
  const numericBookId = Number(bookId);

  const { books, isLoading, isError, mutate: mutateBooks } = useBooks();
  const book = books?.find((book: Book) => book.id === numericBookId);
  console.log(`book.image_url: ${book?.image_url}`);

  const { data: readingProgress } = useReadingProgress(numericBookId);
  const { user } = useCurrentUser();

  const router = useRouter();

  const handleDeleteButton = async () => {
    const isConfirmed = window.confirm("本当に削除してもよろしいですか？");

    // キャンセルされた場合は処理を中止
    if (!isConfirmed) {
      return;
    }

    await apiV1Delete(`/users/books/${book?.id}`);

    mutateBooks();

    router.push(`/${user?.name}/books`);
  };

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
                    <p className="card-text mb-2 d-flex">
                      <strong>カテゴリー:</strong>{" "}
                      <div className="ms-1 d-flex">
                        {book.categories == null ? (
                          <div>不明</div>
                        ) : (
                          book.categories.map((category, index) => (
                            <div key={index}>{category.category}</div>
                          ))
                        )}
                      </div>
                    </p>

                    <div className="mb-4">
                      <strong>本の進捗</strong>
                      <ReadingProgressBar
                        readingProgress={readingProgress}
                        total_pages={book.total_pages}
                      />
                    </div>

                    <button
                      type="button"
                      className="btn btn-original"
                      onClick={open}
                    >
                      進捗を追加
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      style={{ marginLeft: "5px" }}
                      onClick={handleDeleteButton}
                    >
                      本を本棚から削除
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
