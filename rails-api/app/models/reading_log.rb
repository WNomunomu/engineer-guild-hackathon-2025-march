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
class ReadingLog < ApplicationRecord
  belongs_to :user
  belongs_to :book

  validates :read_at, presence: true
  validates :start_page, presence: true, numericality: { greater_than: 0 }
  validates :end_page, presence: true, numericality: { greater_than_or_equal_to: :start_page }

  def pages_read
    # 読んだページ数は、最初のページと最後のページの差に 1 を足す必要があるため
    end_page - start_page + 1
  end
end
