interface CategoryListProps {
  categories: string[]; // カテゴリ名のリスト
}

// const categories = ["AI", "Computer Science", "Network", "CI/CD"];

export const CategoryList = ({ categories }: CategoryListProps) => {
  return (
    <div className="d-flex flex-wrap gap-2">
      {categories.map((category, index) => (
        <span key={index} className="badge bg-info text-white p-2 rounded-pill">
          {category}
        </span>
      ))}
    </div>
  );
};
