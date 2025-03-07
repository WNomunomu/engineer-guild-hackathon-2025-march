module Api
  module V1
    module Users
      class BooksController < ApplicationController
        before_action :authenticate_api_v1_user!
        def update
          book = current_api_v1_user.books.find_by(id: params[:id])
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

          # category 作成
          begin
            category_list = []
            
            categories = params[:categories]
            categories = JSON.parse(categories) if categories.is_a?(String)
            
            categories.each do |category|
              category_list << Category.find_or_create_by!(category: category)
            end
          rescue => e
            render json: { error: "Failed to create category: #{e.message}" }, status: :unprocessable_entity
            return
          end
        
          # book_category 作成
          begin
            category_list.each do |category|
              BookCategory.create!(book: book, category: category)
            end
          rescue => e
            render json: { error: "Failed to create book_category: #{e.message}" }, status: :unprocessable_entity
            return
          end

          # 本更新
          if book.update!(total_pages: params[:total_pages], completed: params[:completed], title: params[:title], author: params[:author])
            render json: { message: 'Book registered successfully', book: book }, status: :ok
          else
            render json: { error: 'Failed to register book' }, status: :unprocessable_entity
          end
        end

        def create
          # 本作成
          begin
            book = Book.create!(
              isbn: params[:isbn], 
              total_pages: params[:total_pages], 
              completed: params[:completed], 
              image_url: params[:image_url], 
              user: current_api_v1_user, 
              title: params[:title], 
              author: params[:author]
            )
          rescue ActiveRecord::RecordInvalid => e
            render json: { error: "Failed to create book: #{e.message}" }, status: :unprocessable_entity
            return
          end
        
          # category 作成
          begin
            category_list = []

            categories = params[:categories]
            categories = JSON.parse(categories) if categories.is_a?(String)
            
            categories.each do |category|
              category_list << Category.find_or_create_by!(category: category)
            end
          rescue => e
            render json: { error: "Failed to create category: #{e.message}" }, status: :unprocessable_entity
            return
          end
        
          # book_category 作成
          begin
            category_list.each do |category|
              BookCategory.create!(book: book, category: category)
            end
          rescue => e
            render json: { error: "Failed to create book_category: #{e.message}" }, status: :unprocessable_entity
            return
          end
        
          render json: { message: 'Book registered successfully', book: book }, status: :created
        end

        def index
          @user = current_api_v1_user
          # # binding.pry
          # books = @user.books.joins(:categories).group('books.id')
          # books.map do |book|
          #   # binding.pry
          # end
          render json: @user.books
        end

        def reading_progress
          book = Book.find_by!(id: params[:id])

          reading_progress = calculate_reading_progress(book)

          render json: reading_progress
        end

        def destroy
          book = Book.find_by!(id: params[:id])
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
        
        private
      
        def calculate_reading_progress(book)
          return [] unless book.total_pages.present? && book.total_pages > 0
          
          logs = current_api_v1_user.reading_logs.where(book_id: book.id)
          
          reading_progress = Array.new(book.total_pages, false)
          
          logs.each do |log|
            start_p = [1, log.start_page.to_i].max
            end_p = [log.end_page.to_i, book.total_pages].min
            
            (start_p..end_p).each do |page|
              reading_progress[page - 1] = true
            end
          end
          
          reading_progress
        end
      end
    end
  end
end
