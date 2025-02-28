FactoryBot.define do
  factory :reading_log do
    book
    read_at { Faker::Date.between(from: 1.year.ago, to: Date.today) }
    pages_read { 1 }
  end
end
