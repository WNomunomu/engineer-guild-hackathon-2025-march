module Api
  module V1
    module Users
      class BooksController < ApplicationController
        before_action :authenticate_api_v1_user!

        def create
          begin
            book = Book.find_by(isbn: params[:isbn])
          rescue ActiveRecord::RecordNotFound 
            render json: { error: 'Book not found' }, status: :unprocessable_entity
            return
          end

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

        def destroy
          book = Book.find_by(isbn: params[:isbn])
          user_book = current_api_v1_user.user_books.find_by(book: book)
          begin user_book.destroy!
            render json: { message: 'Book unregistered successfully' }
          rescue
            render json: { error: 'Failed to unregister book' }, status: :unprocessable_entity
          end
        end
      end
    end
  end
end
