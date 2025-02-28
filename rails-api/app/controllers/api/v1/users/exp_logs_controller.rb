module Api
  module V1
    module Users
      class ExpLogsController < ApplicationController
        before_action :authenticate_api_v1_user!

        def index
          # current_user の reading_logs からカテゴリごとの合計ページ数を取得
          # ※ has_many :categories, through: :book_categories が Book にある想定
          category_pages = current_api_v1_user.reading_logs
            .joins(book: :categories)
            .group('categories.id', 'categories.category')
            .pluck(
              'categories.id',
              'categories.category',
              Arel.sql('COALESCE(SUM(reading_logs.pages_read), 0)')
            )
        
          # pluck は配列で返ってくるので、そのまま map で整形
          response_data = category_pages.map do |category_id, category_name, pages_read|
            {
              category_id: category_id,
              category_name: category_name,
              pages_read: pages_read
            }
          end
        
          render json: response_data
        end
      end
    end
  end
end
