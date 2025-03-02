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
        User.find_by(email: "a@a.com").reading_logs.create!(pages_read: 10, read_at: Date.today, book: create(:book, user: User.find_by(email: "a@a.com")))
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
        User.find_by(email: "a@a.com").reading_logs.create!(pages_read: 10, read_at: Date.today, book: create(:book, user: User.find_by(email: "a@a.com")))
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
        post "api/v1/users/reading_logs", headers: header, params: { isbn: create(:book, user: User.find_by(email: "a@a.com")).isbn, read_at: Date.today, pages_read: 10 }
        expect(response).to have_http_status(201)
        expect(User.find_by(email: "a@a.com").reading_logs.count).to eq(1)
      end
    end
    
    describe "ログインしていない場合" do
      before do
        header["access-token"] = ""
      end
      it "401レスポンスが返ってくる" do
        post "api/v1/users/reading_logs", headers: header, params: { isbn: create(:book, user: User.find_by(email: "a@a.com")).isbn, read_at: Date.today, pages_read: 10 }
        expect(response).to have_http_status(401)
      end
    end

    describe "パラメーターが正しくないとき" do
      it "読書履歴が登録できないこと" do
        post "api/v1/users/reading_logs", headers: header, params: { isbn: create(:book, user: User.find_by(email: "a@a.com")).isbn, read_at: Date.today, pages_read: -1 }
        expect(response).to have_http_status(422)
        expect(User.find_by(email: "a@a.com").reading_logs.count).to eq(0)
      end
    end
  end

  describe "GET /api/v1/users/reading_logs/retrieve-by-date" do
    describe "成功時" do
      before do
        user = User.find_by(email: "a@a.com")
        book = create(:book)
        user.reading_logs.create!(pages_read: 10, read_at: Date.today, book: book)
        user.reading_logs.create!(pages_read: 20, read_at: Date.today - 1, book: book)
        user.reading_logs.create!(pages_read: 30, read_at: Date.today - 1, book: create(:book))
        user.reading_logs.create!(pages_read: 20, read_at: Date.today - 50, book: book)
      end

      it "指定した期間の読書履歴が取得できること" do
        get "api/v1/users/reading_logs/retrieve-by-date", headers: header, params: { from_date: Date.today - 2, to_date: Date.today }
        expect(response).to have_http_status(200)
        expect(JSON.parse(response.body)).to eq([0,50,10])
      end
    end
  end
end
