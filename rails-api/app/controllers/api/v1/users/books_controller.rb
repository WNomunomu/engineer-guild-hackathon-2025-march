module Api
  module V1
    module Users
      class BooksController < ApplicationController
        before_action :authenticate_api_v1_user!

        def create
          book = Book.find(params[:book_id])
          user_book = current_api_v1_user.user_books.create(book: book)

          if user_book.persisted?
            render json: { message: 'Book registered successfully', book: book }, status: :created
          else
            render json: { error: 'Failed to register book' }, status: :unprocessable_entity
          end
        end

        def index
          @user = current_api_v1_user
          books = @user.books
          render json: books
        end
      end
    end
  end
end
