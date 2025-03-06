require 'rails_helper'

RSpec.describe "Api::V1::User::Progresses", type: :request do
  describe "GET /api/v1/user/progresses" do
    let(:header) { {} }
    let(:user) { "" }
    describe "成功時" do
      before do
        res = register_and_sign_in("a", "a@a.com", "password")
        header["client"] = res["client"]
        header["access-token"] = res["access-token"]
        header["uid"] = res["uid"]
        user = User.find_by(email: "a@a.com")

        User.find_by(email: "a@a.com").reading_logs.create!(start_page: 1, end_page: 10, read_at: Date.today, book: create(:book, user: User.find_by(email: "a@a.com")))
        User.find_by(email: "a@a.com").exp_logs.create!(exp_points: 10, earned_at: Date.today, category: create(:category))
      end
      it "進捗が取得できること" do
        get "api/v1/users/progress", headers: header
        expect(response).to have_http_status(200)
        expect(response.body).to eq({
          total_pages_read: 10,
          total_exp: 10
        }.to_json)
      end
    end

    describe "ログインしていない場合" do
      it "401レスポンスが返ってくる" do
        get "api/v1/users/progress", headers: header
        expect(response).to have_http_status(401)
      end
    end
  end
end
