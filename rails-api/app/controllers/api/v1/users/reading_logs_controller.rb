module Api
  module V1
    module Users
      class ReadingLogsController < ApplicationController
        before_action :authenticate_api_v1_user!

        def create
          begin
            book = Book.find(reading_log_params[:id])
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

        def retrieve_by_date
          grouped_and_accumulated_logs = current_api_v1_user.reading_logs.where(read_at: params[:startDate].to_date..params[:endDate].to_date).group(:read_at).pluck(
            :read_at,
            Arel.sql('COALESCE(SUM(reading_logs.pages_read), 0)')
          )
          response_data = grouped_and_accumulated_logs.map do |read_date, pages_read|
            formatted_date = read_date.strftime('%Y-%m-%d')
            { formatted_date => { level: (pages_read * AppConstants::EXP_RATE_PER_READ_PAGE).round(0) } }
          end
          render json: response_data
        end

        def reading_log_params
          params.permit(:id, :read_at, :pages_read)
        end
      end
    end
  end
end
