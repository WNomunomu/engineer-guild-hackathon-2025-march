import { useSubmitReadingLogsModal } from "@/utils/modal";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { apiV1Post } from "@/api/api";

import { useBooks, type Book } from "@/hooks/useBooks";

export const SubmitReadingLogsModal = () => {
  const { data, close } = useSubmitReadingLogsModal();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [readAt, setReadAt] = useState(new Date().toISOString().split("T")[0]); // Default to today
  const [pagesRead, setPagesRead] = useState("");

  const { books } = useBooks();

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

      if (!pagesRead) {
        throw new Error("読んだページ数を入力してください");
      }

      const formData = {
        isbn: selectedBook.isbn,
        read_at: readAt,
        pages_read: parseInt(pagesRead || "0", 10),
      };

      console.log(formData);

      const response = await apiV1Post("/users/reading_logs", formData);

      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || "読書履歴の登録に失敗しました");
      // }

      console.log(response);

      // const responseData = await response.json();
      // console.log(responseData);

      setSuccess(true);

      // Reset form and close modal after short delay to show success message
      setTimeout(() => {
        setSelectedBook(null);
        setReadAt(new Date().toISOString().split("T")[0]);
        setPagesRead("");
        setSuccess(false);
        close();
      }, 1500);
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
              value={selectedBook?.isbn || ""}
              onChange={(e) => {
                const selected = books.find(
                  (book) => book.isbn === e.target.value
                );
                setSelectedBook(selected || null);
              }}
              className="form-select form-select-original"
            >
              <option value="">本を選択</option>
              {books.map((book) => (
                <option key={book.isbn} value={book.isbn}>
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
              読んだページ数
            </label>
            <input
              type="number"
              className="form-control form-control-original"
              id="pages_read"
              name="pages_read"
              value={pagesRead}
              onChange={(e) => setPagesRead(e.target.value)}
              placeholder="読んだページ数を入力してください"
              min="0"
              required
            />
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
