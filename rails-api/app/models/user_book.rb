# == Schema Information
#
# Table name: user_books
#
#  id            :bigint           not null, primary key
#  completed     :boolean          default(FALSE)
#  current_pages :integer          default(0)
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  book_id       :bigint           not null
#  user_id       :bigint           not null
#
# Indexes
#
#  index_user_books_on_book_id  (book_id)
#  index_user_books_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (book_id => books.id)
#  fk_rails_...  (user_id => users.id)
#
class UserBook < ApplicationRecord
  belongs_to :user
  belongs_to :book

  validates :current_pages, presence: true, numericality: { greater_than_or_equal_to: 0 }

  after_initialize :set_default_current_pages

  private

  def set_default_current_pages
    self.current_pages ||= 0
  end
end
