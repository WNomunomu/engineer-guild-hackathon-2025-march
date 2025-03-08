"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import {
  useSubmitReadingLogsModal,
  useUpdateBookDetailModal,
} from "@/utils/modal";
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
  console.log(`book.categories: ${book?.categories}`);

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

  const { open: openSubmitReadingLogsModal } = useSubmitReadingLogsModal();
  const { open: openUpdateBookDetailModal } = useUpdateBookDetailModal();

  return (
    <div className="container mt-5">
      <div className="container text-center mt-5 mb-4">
        <div className="w-50 mx-auto bg-success bg-opacity-10 rounded py-4 px-3">
          <h3 className="fw-bold">本の詳細</h3>
        </div>
      </div>
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
                    {book.completed && (
                      <p className="card-text mb-2">
                        <span className="badge bg-success">既読</span>
                      </p>
                    )}
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
                    {/* カテゴリーが取得できないため、一旦コメントアウト */}
                    {/*
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
                    */}

                    <div className="mb-4">
                      <strong>本の進捗</strong>
                      <div className="mt-2">
                        <ReadingProgressBar
                          readingProgress={readingProgress}
                          total_pages={book.total_pages}
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn btn-original mt-2"
                      onClick={openSubmitReadingLogsModal}
                    >
                      進捗を追加
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger ms-1 mt-2"
                      onClick={handleDeleteButton}
                    >
                      本を本棚から削除
                    </button>
                    {/* TODO このボタンを押したら本の情報を更新できるモーダルが出る */}
                    <button
                      type="button"
                      className="btn btn-primary ms-1 mt-2"
                      onClick={openUpdateBookDetailModal}
                    >
                      本の情報を更新する
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
