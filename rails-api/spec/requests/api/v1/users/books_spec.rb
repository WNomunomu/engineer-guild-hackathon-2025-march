require 'rails_helper'
require 'json'

RSpec.describe "API::V1::Books", type: :request do
  let(:headers) { {} }
  let(:params) { {} }
  before do
    res = register_and_sign_in("a", "a@a.com", "password")
    headers["client"] = res["client"]
    headers["access-token"] = res["access-token"]
    headers["uid"] = res["uid"]
  end
  
  describe "PATCH api/v1/users/books" do
    let(:url_params) { {} }
    subject { patch "api/v1/users/books/#{url_params[:isbn]}", headers: headers, params: params }
    before do
      # 必須パラメーター
      params[:isbn] = "1111122222"
      params[:completed] = "false"
      params[:total_pages] = 100
      params[:categories] = "frontend,cicd" # カンマ区切り
      post "api/v1/users/books", headers: headers, params: params
    end
    
    describe "成功時" do
      before do
        # 必須パラメーター
        url_params[:isbn] = "1111122222"
        params[:completed] = "true"
        params[:total_pages] = 200
        params[:categories] = "frontend,ci,cd" # カンマ区切り
      end
      it "修正が成功すること" do
        subject
        expect(response).to have_http_status(200)
        expect(User.first.books.first.completed).to eq true
        expect(User.first.books.first.book_categories.count).to eq 3
        expect(User.first.books.first.categories.count).to eq 3
        expect(Category.all.count).to eq 4
        expect(User.first.books.first.total_pages).to eq 200
      end
    end

    describe "失敗時" do
      describe "認証できないとき" do
        before do
          headers["client"] = ""
        end

        it "修正が失敗し、正しいhttp status が返ってくる" do
          subject
          expect(response).to have_http_status(404)
        end
      end
    end
  end

  describe "POST api/v1/users/books" do
    subject { post "api/v1/users/books", headers: headers, params: params }

    describe "成功時" do
      before do
        # 必須パラメーター
        params[:isbn] = "1111122222"
        params[:completed] = "false"
        params[:total_pages] = 100
        params[:categories] = "frontend,cicd" # カンマ区切り
      end

      it "登録が成功すること" do
        subject
        expect(response).to have_http_status(:created)
        expect(User.first.books.count).to eq 1
        expect(User.first.books.first.categories.count).to eq 2
      end
    end

    describe "失敗時" do
      describe "認証できないとき" do
        before do
          headers["client"] = ""
        end

        it "登録が失敗し、正しいhttp status が返ってくる" do
          subject
          expect(User.first.books.count).to eq 0
          expect(response).to have_http_status(401)
        end
      end
    end
  end

  describe "GET api/v1/users/books" do
    subject { get "api/v1/users/books", headers: headers }

    describe "認証できないとき" do
      before do
        headers["client"] = ""
      end

      it "登録が失敗し、正しいhttp status が返ってくる" do
        subject
        expect(User.first.books.count).to eq 0
        expect(response).to have_http_status(401)
      end
    end

    describe "成功時" do
      before do
        post "api/v1/users/books", headers: headers, params: {:isbn => create(:book, user: User.find_by(email: "a@a.com")).isbn}
      end
      it "returns a list of books" do
        subject
        expect(response).to have_http_status(:ok)
        expect(response.body).to eq(User.first.books.to_json)
      end
    end
  end
  
  describe "DELETE api/v1/users/books/:isbn" do
    subject { delete "api/v1/users/books/#{params[:isbn]}", headers: headers }
    describe "認証できないとき" do
      before do
        book = create(:book, user: User.first)
        params[:isbn] = book.isbn
        headers["client"] = ""
      end

      it "登録が外せず、正しいhttp status が返ってくる" do
        subject
        expect(User.first.books.count).to eq 1
        expect(response).to have_http_status(401)
      end
    end

    describe "成功時" do
      before do
        p = {}
        p[:isbn] = "1111122222"
        p[:completed] = "false"
        p[:total_pages] = 100
        p[:categories] = "frontend,cicd" # カンマ区切り
        post "api/v1/users/books", headers: headers, params: p
        
        params[:isbn] = "1111122222"
      end
      it "登録が外れ、正しいhttp status が返ってくる" do
        subject
        expect(response).to have_http_status(:ok)
        expect(User.first.books.count).to eq(0)
        expect(User.first.books.count).to eq(0)
      end
    end
  end
end
