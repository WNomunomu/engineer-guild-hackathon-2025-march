// import { useBooks } from "@/hooks/useBooks";
import Image from "next/image";
// import { Spinner } from "react-bootstrap";

export const BooksListCard = () => {
  // const { books, isLoading, isError } = useBooks();

  // if (isLoading) return <Spinner animation="border" />;
  // if (isError) return <p className="text-danger">エラーが発生しました。</p>;

  // NDLの書影APIを用いた画像取得
  // https://ndlsearch.ndl.go.jp/thumbnail/${isbn}.jpg

  const books = [
    {
      id: 1,
      title: "ネットワークはなぜつながるのか",
      author: "戸根勤",
      image_url: "https://ndlsearch.ndl.go.jp/thumbnail/9784822283117.jpg",
      categories: [{ id: 1, category: "ネットワーク" }],
      total_pages: 320,
    },
    {
      id: 2,
      title: "リーダブルコード",
      author: "Dustin Boswell",
      image_url: "https://ndlsearch.ndl.go.jp/thumbnail/9784873115658.jpg",
      categories: [{ id: 2, category: "プログラミング" }],
      total_pages: 256,
    },
    {
      id: 3,
      title: "入門 コンピュータ科学 ITを支える技術と理論の基礎知識",
      author: "斎藤康毅",
      image_url: "https://ndlsearch.ndl.go.jp/thumbnail/9784048930543.jpg",
      categories: [{ id: 3, category: "computer science" }],
      total_pages: 384,
    },
    {
      id: 4,
      title: "kubernetes CI/CDパイプラインの実装",
      author: "戸根勤",
      image_url: "https://ndlsearch.ndl.go.jp/thumbnail/9784295012757.jpg", // 仮の画像
      categories: [{ id: 1, category: "ネットワーク" }],
      total_pages: 320,
    },
    {
      id: 5,
      title: "リーダブルコード",
      author: "Dustin Boswell",
      image_url: "https://ndlsearch.ndl.go.jp/thumbnail/9784822283117.jpg",
      categories: [{ id: 2, category: "プログラミング" }],
      total_pages: 256,
    },
    {
      id: 6,
      title: "ゼロから作る Deep Learning",
      author: "斎藤康毅",
      image_url: "https://ndlsearch.ndl.go.jp/thumbnail/9784822283117.jpg",
      categories: [{ id: 3, category: "AI・機械学習" }],
      total_pages: 384,
    },
  ];

  return (
    <div className="container mt-4">
      <h1>技術書一覧</h1>
      <div className="row">
        {books?.map((book) => (
          <div key={book.id} className="col-md-2 mb-4">
            <div className="card">
              {book.image_url && (
                <div
                  className="position-relative"
                  style={{ width: "100%", height: "280px" }}
                >
                  <Image
                    src={book.image_url}
                    alt={book.title}
                    layout="fill"
                    objectFit="cover"
                    className="card-img-top"
                  />
                </div>
              )}
              {/* TODO: 本棚の一覧は画像だけで良い気がする。クリックしたら本の詳細ページへ */}
              {/*
              <div className="card-body">
                <h5 className="card-title">{book.title}</h5>
                <p className="card-text">著者: {book.author}</p>
                <p className="card-text">
                  カテゴリ: {book.categories.map((c) => c.category).join(", ")}
                </p>
                <p className="card-text">総ページ数: {book.total_pages}</p>
              </div>
              */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
