FactoryBot.define do
  factory :user_book do
    book
    user
    current_pages { 0 }
  end
end
