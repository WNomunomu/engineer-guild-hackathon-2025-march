require 'rails_helper'

RSpec.describe "Api::V1::Users::ReadingLogs", type: :request do
  let(:header) { {} }
  before do
    res = register_and_sign_in("a", "a@a.com", "password")
    header["client"] = res["client"]
    header["access-token"] = res["access-token"]
    header["uid"] = res["uid"]
  end
  describe "GET /api/v1/users/reading_logs" do
    describe "成功時" do
      before do
        User.find_by(email: "a@a.com").reading_logs.create!(pages_read: 10, read_at: Date.today, book: create(:book))
      end
      it "読書履歴が取得できること" do
        get "api/v1/users/reading_logs", headers: header
        expect(response).to have_http_status(200)
        expect(response.body).to eq(User.find_by(email: "a@a.com").reading_logs.to_json)
      end
    end
    
    describe "ログインしていない場合" do
      before do
        header["access-token"] = ""
        User.find_by(email: "a@a.com").reading_logs.create!(pages_read: 10, read_at: Date.today, book: create(:book))
      end
      it "401レスポンスが返ってくる" do
        get "api/v1/users/reading_logs", headers: header
        expect(response).to have_http_status(401)
      end
    end
  end

  describe "POST /api/v1/users/reading_logs" do
    describe "成功時" do
      it "読書履歴が登録できること" do
        post "api/v1/users/reading_logs", headers: header, params: { isbn: create(:book).isbn, read_at: Date.today, pages_read: 10 }
        expect(response).to have_http_status(201)
        expect(User.find_by(email: "a@a.com").reading_logs.count).to eq(1)
      end
    end
    
    describe "ログインしていない場合" do
      before do
        header["access-token"] = ""
      end
      it "401レスポンスが返ってくる" do
        post "api/v1/users/reading_logs", headers: header, params: { isbn: create(:book).isbn, read_at: Date.today, pages_read: 10 }
        expect(response).to have_http_status(401)
      end
    end

    describe "パラメーターが正しくないとき" do
      it "読書履歴が登録できないこと" do
        post "api/v1/users/reading_logs", headers: header, params: { isbn: create(:book).isbn, read_at: Date.today, pages_read: -1 }
        expect(response).to have_http_status(422)
        expect(User.find_by(email: "a@a.com").reading_logs.count).to eq(0)
      end
    end
  end
end
