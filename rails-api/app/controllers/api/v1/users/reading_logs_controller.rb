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

          reading_log = current_api_v1_user.reading_logs.create(
            read_at: reading_log_params[:read_at], 
            start_page: reading_log_params[:start_page], 
            end_page: reading_log_params[:end_page], 
            book: book
          )

          # 読破したかチェック
          book.check_is_completed

          if reading_log.persisted?
            render json: { message: 'Reading log saved', log: reading_log }, status: :created
          else
            render json: { error: 'Failed to save reading log' }, status: :unprocessable_entity
          end
        end

        def index
          logs = current_api_v1_user.reading_logs
          
          stats = {
            total_pages: calculate_total_pages(logs),
            streak_days: calculate_streak_days(logs),
            weekly_pages: calculate_weekly_pages(logs),
            monthly_pages: calculate_monthly_pages(logs)
          }

          render json: stats
        end

        def retrieve_by_date
          logs = current_api_v1_user.reading_logs.where(read_at: params[:startDate].to_date..params[:endDate].to_date)
        
          grouped_logs = logs.group_by(&:read_at).transform_values do |daily_logs|
            daily_logs.sum(&:pages_read)
          end
        
          response_data = grouped_logs.map do |read_date, pages_read|
            formatted_date = read_date.strftime('%Y-%m-%d')
            {
              formatted_date => {
                level: (pages_read * AppConstants::EXP_RATE_PER_READ_PAGE).round(0)
              }
            }
          end
        
          render json: response_data
        end

        def reading_log_params
          params.permit(:id, :read_at, :start_page, :end_page)
        end

        private
  
        def calculate_total_pages(logs)
          logs.sum("end_page - start_page + 1")
        end
        
        def calculate_streak_days(logs)
          # 日付でグループ化して連続日数を計算
          dates = logs.pluck(:read_at).compact.uniq.sort
          return 0 if dates.empty?
          
          current_streak = 1
          max_streak = 1
          
          (1...dates.length).each do |i|
            if dates[i] == dates[i-1] + 1.day
              current_streak += 1
              max_streak = [max_streak, current_streak].max
            else
              current_streak = 1
            end
          end
          
          max_streak
        end
        
        def calculate_weekly_pages(logs)
          start_of_week = Date.today.beginning_of_week
          logs.where("read_at >= ?", start_of_week)
              .sum("end_page - start_page + 1")
        end
        
        def calculate_monthly_pages(logs)
          start_of_month = Date.today.beginning_of_month
          logs.where("read_at >= ?", start_of_month)
              .sum("end_page - start_page + 1") 
        end
      end
    end
  end
end
