import { BookThumbnail } from "./BookThumbnail";
// DBからuserに紐づいた本のリストを取得
const isbnList = [
  "9784048930543",
  "9784295012757",
  "9784873118468",
  "9784774178660",
  "9784274224478",
  "9784797397642",
  "9784865941951",
  "9784873118406",
  "9784297128463",
];

export const BooksListCard = () => {
  return (
    <div className="container mt-4 mb-5">
      <h1>本棚</h1>
      <div className="row mx-0">
        {isbnList.map((isbn) => (
          <div key={isbn} className="col-12 col-sm-6 col-md-4 col-lg-2 mt-4">
            <BookThumbnail isbn={isbn} />
          </div>
        ))}
      </div>
    </div>
  );
};
