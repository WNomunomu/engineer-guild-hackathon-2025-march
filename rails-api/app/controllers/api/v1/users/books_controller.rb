module Api
  module V1
    module Users
      class BooksController < ApplicationController
        before_action :authenticate_api_v1_user!
        def update
          book = current_api_v1_user.books.find_by(isbn: params[:isbn])
          if book.nil?
            render json: { error: 'Book not found' }, status: 422
            return
          end

          # book_category 登録解除
          book.book_categories.destroy_all
          if book.book_categories.count != 0 
            render json: { error: 'failed to update category' }, status: 422
            return
          end

          # category 再作成
          begin
            category_list = []
            for category in params[:categories].split(',')
              category_list.append(Category.find_or_create_by!(category: category))
            end
          rescue 
            render json: { error: 'Failed to update category' }, status: :unprocessable_entity
            return
          end

          # book_category 作成
          begin
            for category in category_list
              BookCategory.create!(book: book, category: category)
            end
          rescue
            render json: { error: 'Failed to update book_category' }, status: :unprocessable_entity
            return
          end

          # 本更新
          if book.update!(total_pages: params[:total_pages], completed: params[:completed])
            render json: { message: 'Book registered successfully', book: book }, status: :ok
          else
            render json: { error: 'Failed to register book' }, status: :unprocessable_entity
          end
        end

        def create
          # 本作成
          begin
            book = Book.create!(isbn: params[:isbn], total_pages: params[:total_pages], completed: params[:completed], user: current_api_v1_user)
          rescue ActiveRecord::RecordNotFound 
            render json: { error: 'Failed to create book' }, status: :unprocessable_entity
            return
          end

          # category 作成
          begin
            category_list = []
            for category in params[:categories].split(',')
              category_list.append(Category.find_or_create_by!(category: category))
            end
          rescue 
            render json: { error: 'Failed to create category' }, status: :unprocessable_entity
            return
          end

          # book_category 作成
          begin
            for category in category_list
              BookCategory.create!(book: book, category: category)
            end
          rescue
            render json: { error: 'Failed to create book_category' }, status: :unprocessable_entity
            return
          end

          render json: { message: 'Book registered successfully', book: book }, status: :created
        end

        def index
          @user = current_api_v1_user
          books = @user.books
          render json: books
        end

        def destroy
          book = Book.find_by!(isbn: params[:isbn])
          begin
            book.destroy!
          rescue ActiveRecord::RecordNotFound
            render json: { error: 'Book not found' }, status: 422
            return
          rescue
            render json: { error: 'Failed to unregister book' }, status: 422
          end

          render json: { message: 'Book deleted successfully', book: book }, status: :ok
        end
      end
    end
  end
end
