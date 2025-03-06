# == Schema Information
#
# Table name: reading_logs
#
#  id         :bigint           not null, primary key
#  end_page   :integer          not null
#  read_at    :date
#  start_page :integer          not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  book_id    :bigint           not null
#  user_id    :bigint           not null
#
# Indexes
#
#  index_reading_logs_on_book_id  (book_id)
#  index_reading_logs_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (book_id => books.id)
#  fk_rails_...  (user_id => users.id)
#
FactoryBot.define do
  factory :reading_log do
    book
    read_at { Faker::Date.between(from: 1.year.ago, to: Date.today) }
  end
end
