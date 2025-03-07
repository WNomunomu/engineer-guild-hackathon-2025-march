import { BookThumbnail } from "./BookThumbnail";
import { useBooks } from "@/hooks/useBooks";

// スケルトンスクリーン用のコンポーネント
const BookThumbnailSkeleton = () => {
  return (
    <div className="d-flex flex-column align-items-center">
      {/* サムネイル部分のスケルトン */}
      <div
        className="bg-secondary bg-opacity-25 w-100"
        style={{
          height: "180px",
          borderRadius: "4px",
          animation: "pulse 1.5s infinite ease-in-out",
        }}
      ></div>
      {/* タイトル部分のスケルトン */}
      <div
        className="bg-secondary bg-opacity-25 w-75 mt-2"
        style={{
          height: "16px",
          borderRadius: "2px",
          animation: "pulse 1.5s infinite ease-in-out",
        }}
      ></div>
      {/* 著者部分のスケルトン */}
      <div
        className="bg-secondary bg-opacity-25 w-50 mt-1"
        style={{
          height: "12px",
          borderRadius: "2px",
          animation: "pulse 1.5s infinite ease-in-out",
        }}
      ></div>
    </div>
  );
};

export const BooksListCard = () => {
  const { books, isLoading, isError } = useBooks();

  // エラー時は何も表示しない
  if (!isLoading && isError) {
    return <h1>エラーが発生しました。</h1>;
  }

  // ローディング中の場合はスケルトンスクリーンを表示
  if (isLoading) {
    return (
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="mb-5">
            <div className="row mx-0">
              {/* ダミーのスケルトンを6つ表示 */}
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={`skeleton-${index}`}
                    className="col-12 col-sm-6 col-md-4 col-lg-2 mt-4"
                  >
                    <BookThumbnailSkeleton />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const bookIdList = books?.map((book) => {
    return book.id;
  });

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="mb-5">
          <div className="row mx-0">
            {bookIdList?.length == 0 ? (
              <p className="text-center">本がまだ追加されていません。</p>
            ) : (
              bookIdList?.map((id) => (
                <div
                  key={id}
                  className="col-12 col-sm-6 col-md-4 col-lg-2 mt-4"
                >
                  <BookThumbnail bookId={id} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
