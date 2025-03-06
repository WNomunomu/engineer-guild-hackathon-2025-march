Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      get 'hello', to: 'hello#index'
      get 'current_user', to: 'users#show'

      # 書籍関連
      resources :books, only: [:index, :create]

      # ユーザーに紐づくリソース
      namespace :users do
        resources :books, only: [:index, :create, :destroy] do
          collection do
            patch ':isbn', to: 'books#update'
          end
        end

        resources :reading_logs, only: [:index, :create] do
          collection do
            get 'retrieve-by-date', to: 'reading_logs#retrieve_by_date'
          end
        end

        get 'reading_logs', to: 'reading_logs#index'

        get 'exp_logs', to: 'exp_logs#index'

        get 'progress', to: 'progress#show'
      end

      # Devise Token Auth (ユーザー認証)
      mount_devise_token_auth_for "User", at: "auth"
    end
  end

  # ヘルスチェック用
  get "up" => "rails/health#show", as: :rails_health_check
end
