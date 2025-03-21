module Api
  module V1
    module Auth
      class SessionsController < DeviseTokenAuth::SessionsController

        protected

        def render_create_success
          render json: {
            data: @resource.as_json(except: [:tokens, :created_at, :updated_at]),
            status: 'success'
          }
        end
      end
    end
  end
end
