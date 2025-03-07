import { useSubmitReadingLogsModal } from "@/utils/modal";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { apiV1Post } from "@/api/api";

import { useBooks, useReadingProgress, type Book } from "@/hooks/useBooks";

type SubmitReadingLogsModalProps = {
  alreadySelectedBook?: Book;
};

export const SubmitReadingLogsModal = (props: SubmitReadingLogsModalProps) => {
  const { alreadySelectedBook } = props;

  const { data, close } = useSubmitReadingLogsModal();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [selectedBook, setSelectedBook] = useState<Book | null | undefined>(
    alreadySelectedBook
  );
  const [readAt, setReadAt] = useState(new Date().toISOString().split("T")[0]); // Default to today
  const [startPage, setStartPage] = useState("");
  const [endPage, setEndPage] = useState("");

  const { books } = useBooks();

  const { mutate: mutateReadingProgress } = useReadingProgress(
    selectedBook?.id ?? 0
  );

  if (books == null) return <></>;

  const isOpened = data?.isOpened ?? false;

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!selectedBook) {
        throw new Error("本を選択してください");
      }

      if (!readAt) {
        throw new Error("読んだ日を入力してください");
      }

      if (!startPage || !endPage) {
        throw new Error("読んだページ数を入力してください");
      }

      if (parseInt(startPage) < 1) {
        throw new Error("開始ページ番号は0以上を入力してください");
      }

      if (parseInt(endPage) > selectedBook.total_pages) {
        throw new Error(
          "終了ページは選択した本の最後のページ番号よりも小さい数字を入力してください"
        );
      }

      const formData = {
        id: selectedBook.id,
        read_at: readAt,
        start_page: parseInt(startPage, 10),
        end_page: parseInt(endPage, 10),
      };

      console.log(formData);
      // console.log(selectedBook.current_page)

      await apiV1Post("/users/reading_logs", formData);

      setSuccess(true);

      // Reset form and close modal after short delay to show success message
      setTimeout(() => {
        setSelectedBook(null);
        setReadAt(new Date().toISOString().split("T")[0]);
        setStartPage("");
        setEndPage("");
        setSuccess(false);
        close();
      }, 1500);

      mutateReadingProgress();

      close();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={isOpened} onHide={close}>
      <Modal.Header closeButton>
        <Modal.Title>読書履歴の登録</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && (
          <div className="alert alert-success">読書履歴が保存されました！</div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="mb-3">
            <label htmlFor="bookSelect" className="form-label">
              本を選択
            </label>
            <select
              id="bookSelect"
              value={selectedBook?.id || ""}
              onChange={(e) => {
                const selected = books.find(
                  (book) => book.id === parseInt(e.target.value)
                );
                setSelectedBook(selected || null);
              }}
              className="form-select form-select-original"
            >
              <option value="">本を選択</option>
              {books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="read_at" className="form-label">
              読んだ日
            </label>
            <input
              type="date"
              className="form-control form-control-original"
              id="read_at"
              name="read_at"
              value={readAt}
              onChange={(e) => setReadAt(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="pages_read" className="form-label">
              読んだページ
            </label>
            <div className="d-flex row align-items-center g-2">
              <div className="col-auto">
                <div className="input-group">
                  <span className="input-group-text">開始</span>
                  <input
                    type="number"
                    className="form-control"
                    id="start_page"
                    name="start_page"
                    placeholder="ページ番号"
                    min="0"
                    required
                    onChange={(e) => setStartPage(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-auto">
                <span className="align-middle px-1">から</span>
              </div>

              <div className="col-auto">
                <div className="input-group">
                  <span className="input-group-text">終了</span>
                  <input
                    type="number"
                    className="form-control"
                    id="end_page"
                    name="end_page"
                    placeholder="ページ番号"
                    min="0"
                    required
                    onChange={(e) => setEndPage(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-auto">
                <span className="align-middle px-1">まで</span>
              </div>
            </div>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <button
          className="btn btn-secondary"
          onClick={close}
          disabled={isLoading}
        >
          キャンセル
        </button>
        <button
          className="btn btn-original"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "送信中..." : "保存"}
        </button>
      </Modal.Footer>
    </Modal>
  );
};
