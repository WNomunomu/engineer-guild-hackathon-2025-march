require 'rails_helper'

RSpec.describe "Api::V1::User::ExpLogs", type: :request do
  describe "GET /api/v1/user/exp_logs" do
    let(:header) { {} }
    describe "成功時" do
      before do
        res = register_and_sign_in("a", "a@a.com", "password")
        header["client"] = res["client"]
        header["access-token"] = res["access-token"]
        header["uid"] = res["uid"]
      end
      let(:user) { User.find_by(email: "a@a.com") }
      let(:category1) { create :category }
      let(:category2) { create :category }
      let(:book1) do
        book = create(:book)
        book.categories << category1
        book
      end
      let(:book2) do
        book = create(:book)
        book.categories << category2
        book
      end
      let!(:reading_log1) { create :reading_log, book: book1, user: user , pages_read: 100}
      let!(:reading_log2) { create :reading_log, book: book1, user: user , pages_read: 200}
      let!(:reading_log3) { create :reading_log, book: book2, user: user , pages_read: 200}

      let(:expected_body) do
        [
          {
            "category_id"   => category1.id,
            "category_name" => category1.category,
            "pages_read"    => 300
          },
          {
            "category_id"   => category2.id,
            "category_name" => category2.category,
            "pages_read"    => 200
          },
        ]
      end
      it "進捗が取得できること" do
        get "api/v1/users/exp_logs", headers: header
        expect(response).to have_http_status(200)
        expect(JSON.parse(response.body)).to eq(expected_body)
      end
    end

    describe "ログインしていない場合" do
      it "401レスポンスが返ってくる" do
        get "api/v1/users/exp_logs", headers: header
        expect(response).to have_http_status(401)
      end
    end
  end
end
