FactoryBot.define do
  factory :category do
    sequence(:category) { |n| "カテゴリ名#{n}" }
  end
end
