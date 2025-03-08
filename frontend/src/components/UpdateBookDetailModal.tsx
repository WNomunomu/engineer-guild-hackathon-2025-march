"use client";

import { useUpdateBookDetailModal } from "@/utils/modal";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { apiV1Patch } from "@/api/api";
import { useParams } from "next/navigation";
import { useBooks } from "@/hooks/useBooks";

export const UpdateBookDetailModal = () => {
  const { bookId } = useParams();
  const { data, close } = useUpdateBookDetailModal();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Manage category inputs dynamically
  const [categories, setCategories] = useState<string[]>([""]);
  const [totalPages, setTotalPages] = useState<number | string>(""); // For total pages
  const [completed, setCompleted] = useState<boolean>(false); // For completion status

  const { books } = useBooks();

  if (books == null) return <></>;
  const selectedBook = books.find((book) => book.id.toString() === bookId);

  if (!selectedBook) {
    return <></>;
  }

  const isOpened = data?.isOpened ?? false;

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Filter out empty categories
      const categoryArray = categories.filter((cat) => cat.trim() !== "");

      const formData = {
        id: selectedBook.id,
        categories: categoryArray,
        total_pages: totalPages || selectedBook.total_pages, // Use updated total pages or current value
        completed:
          completed !== selectedBook.completed
            ? completed
            : selectedBook.completed, // Update completed status if changed
        title: selectedBook.title,
        author: selectedBook.author,
      };

      console.log(`formData.id: ${formData.id}`);
      console.log(`formData.categoryArray: ${formData.categories}`);
      console.log(`formData.total_pages: ${formData.total_pages}`);
      console.log(`formData.completed: ${formData.completed}`);

      await apiV1Patch(`/users/books/${selectedBook.id}`, formData); // API endpoint for updating categories

      setSuccess(true);

      // Reset form and close modal after short delay to show success message
      setTimeout(() => {
        setCategories([""]); // Reset categories field (reset to 1 empty input)
        setTotalPages(""); // Reset total pages
        setCompleted(false); // Reset completed status
        setSuccess(false);
        close();
      }, 1500);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        console.log(`err: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = () => {
    setCategories([...categories, ""]); // Add a new empty input field
  };

  const handleCategoryChange = (index: number, value: string) => {
    const newCategories = [...categories];
    newCategories[index] = value; // Update the category at the specified index
    setCategories(newCategories);
  };

  const handleTotalPagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTotalPages(e.target.value); // Update total pages
  };

  const handleCompletedChange = () => {
    setCompleted(!completed); // Toggle completed status
  };

  return (
    <Modal show={isOpened} onHide={close}>
      <Modal.Header closeButton>
        <Modal.Title>本のカテゴリーを更新</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && (
          <div className="alert alert-success">本の情報が更新されました！</div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="mb-3">
            <label htmlFor="categories" className="form-label">
              カテゴリーを更新
            </label>

            {categories.map((category, index) => (
              <div key={index} className="d-flex mb-2">
                <input
                  type="text"
                  className="form-control btn-original"
                  id={`category-${index}`}
                  name={`category-${index}`}
                  placeholder="カテゴリーを入力"
                  value={category}
                  onChange={(e) => handleCategoryChange(index, e.target.value)}
                />
                {index === categories.length - 1 && (
                  <button
                    type="button"
                    className="btn btn-outline-primary ms-2"
                    onClick={handleAddCategory}
                  >
                    Add
                  </button>
                )}
              </div>
            ))}
            <small className="form-text text-muted">
              例: Network, OS, Python, JavaScript
            </small>
          </div>

          <div className="mb-3">
            <label htmlFor="totalPages" className="form-label">
              総ページ数を更新
            </label>
            <input
              type="number"
              className="form-control"
              id="totalPages"
              placeholder="総ページ数"
              value={totalPages}
              onChange={handleTotalPagesChange}
            />
          </div>

          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="completed"
              checked={completed}
              onChange={handleCompletedChange}
            />
            <label className="form-check-label" htmlFor="completed">
              既読にする
            </label>
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
