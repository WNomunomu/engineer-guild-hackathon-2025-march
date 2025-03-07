module Api
  module V1
    module Users
      class ExpLogsController < ApplicationController
        before_action :authenticate_api_v1_user!

        def index
          reading_logs = current_api_v1_user.reading_logs.includes(book: :categories)
        
          # カテゴリごとにグループ化してpages_readを合計
          category_pages = Hash.new(0)
          reading_logs.each do |log|
            log.book.categories.each do |category|
              category_pages[category] += log.pages_read
            end
          end
        
          response_data = category_pages.map do |category, pages_read|
            {
              category: category.category,
              level: (pages_read * AppConstants::EXP_RATE_PER_READ_PAGE).round(0),
              exp: pages_read,
            }
          end
          
          render json: response_data
        end
      end
    end
  end
end
