"use client";

import { useUpdateBookDetailModal } from "@/utils/modal";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { apiV1Post } from "@/api/api";
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

  const { books } = useBooks();

  if (books == null) return <></>;
  const selectedBook = books.find((book) => book.id.toString() === bookId);

  if (!selectedBook) {
    return <div>指定された本が見つかりませんでした。</div>;
  }

  const isOpened = data?.isOpened ?? false;

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Filter out empty categories
      const categoryArray = categories.filter((cat) => cat.trim() !== "");
      console.log(`categoryArray: ${categoryArray}`);

      const formData = {
        id: selectedBook.id,
        categories: categoryArray, // Include categories in the form data
      };

      console.log(formData);

      await apiV1Post("/users/update_book_categories", formData); // API endpoint for updating categories

      setSuccess(true);

      // Reset form and close modal after short delay to show success message
      setTimeout(() => {
        setCategories([""]); // Reset categories field (reset to 1 empty input)
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

  const handleAddCategory = () => {
    setCategories([...categories, ""]); // Add a new empty input field
  };

  const handleCategoryChange = (index: number, value: string) => {
    const newCategories = [...categories];
    newCategories[index] = value; // Update the category at the specified index
    setCategories(newCategories);
  };

  return (
    <Modal show={isOpened} onHide={close}>
      <Modal.Header closeButton>
        <Modal.Title>本のカテゴリーを更新</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && (
          <div className="alert alert-success">
            カテゴリーが更新されました！
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="mb-3">
            <label htmlFor="categories" className="form-label">
              カテゴリー
            </label>

            {categories.map((category, index) => (
              <div key={index} className="d-flex mb-2">
                <input
                  type="text"
                  className="form-control"
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
