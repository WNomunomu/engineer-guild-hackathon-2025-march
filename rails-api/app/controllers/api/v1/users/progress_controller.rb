module Api
  module V1
    module Users
      class ProgressController < ApplicationController
        before_action :authenticate_api_v1_user!

        def show
          total_pages_read = current_api_v1_user.reading_logs.sum(&:pages_read)
          total_exp = current_api_v1_user.exp_logs.sum(:exp_points)

          render json: {
            total_pages_read: total_pages_read,
            total_exp: total_exp
          }
        end
      end
    end
  end
end
