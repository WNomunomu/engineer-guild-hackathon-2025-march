module Api
  module V1
    module Users
      class ReadingLogsController < ApplicationController
        before_action :authenticate_api_v1_user!

        def create
          begin
            book = Book.find_by(isbn: reading_log_params[:isbn])
          rescue ActiveRecord::RecordNotFound 
            render json: { error: 'Book not found' }, status: :unprocessable_entity
            return
          end

          reading_log = current_api_v1_user.reading_logs.create(read_at: reading_log_params[:read_at], pages_read: reading_log_params[:pages_read], book: book)
          if reading_log.persisted?
            render json: { message: 'Reading log saved', log: reading_log }, status: :created
          else
            render json: { error: 'Failed to save reading log' }, status: :unprocessable_entity
          end
        end

        def index
          logs = current_api_v1_user.reading_logs
          render json: logs
        end
        def reading_log_params
          params.permit(:isbn, :read_at, :pages_read)
        end        
      end
    end
  end
end
