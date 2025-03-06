# == Schema Information
#
# Table name: books
#
#  id            :bigint           not null, primary key
#  author        :string(255)
#  completed     :boolean          default(FALSE)
#  current_pages :integer          default(0)
#  image_url     :string(255)
#  isbn          :string(255)
#  title         :string(255)
#  total_pages   :integer
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  user_id       :bigint           not null
#
# Indexes
#
#  index_books_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
FactoryBot.define do
  factory :book do
    author { "Jane Doe" }
    title { "Jane Doe" }
    isbn { "1111111111" }
    total_pages {10}
  end
end
