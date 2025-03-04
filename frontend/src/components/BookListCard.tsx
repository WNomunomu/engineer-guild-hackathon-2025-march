import { BookThumbnail } from "./BookThumbnail";
import { useBooks } from "@/hooks/useBooks";

// DBからuserに紐づいた本のリストを取得
// const isbnList = [
//   "9784048930543",
//   "9784295012757",
//   "9784873118468",
//   "9784774178660",
//   "9784274224478",
//   "9784797397642",
//   "9784865941951",
//   "9784873118406",
//   "9784297128463",
//   "9784798160276", // 独習JavaScript
//   "9784774174044", // Linuxコマンドポケットリファレンス
//   "9784822284312", // Google クラウドの核心
//   "9784815604974", // 図解入門 TCP/IP
//   "9784798141022", // プログラマのためのDocker教科書
//   "9784802614061", // ハッカーと画家がなぜか表示されちゃう
//   "9784839960100", // 世界で闘うプログラミング力を鍛える本
//   // "9784798068534", // ハッカーと画家がなぜか表示されちゃう
//   "9784046052520", // バイリンガルITエンジニアの英語
//   "9784295017936", // すっきりわかるJava入門
//   "9784297141738", // github actions CI/CD のはずなのに、、、
//   // "9784163917689", // 牛尾剛さんのやつのはずなのに
//   // "9784814400850", // binary hacks rebooted
// ];

export const BooksListCard = () => {
  const { books, isLoading, isError } = useBooks();
  if (!isLoading && isError) {
    alert("error loading books")
  }

  console.log(books)

  const isbnList = books?.map((book) => {return  book.isbn});

  return (
    <div className="container mt-4 mb-5">
      <div className="row mx-0">
        {isbnList?.map((isbn) => (
          <div key={isbn} className="col-12 col-sm-6 col-md-4 col-lg-2 mt-4">
            <BookThumbnail isbn={isbn} />
          </div>
        ))}
      </div>
    </div>
  );
};
