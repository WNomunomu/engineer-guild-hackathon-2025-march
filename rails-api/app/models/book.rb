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
class Book < ApplicationRecord
  has_many :book_categories, dependent: :destroy
  has_many :categories, through: :book_categories
  has_many :user_books
  belongs_to :user
  has_many :reading_logs

  # has_one_attached :image

  validates :current_pages, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :total_pages, presence: true, numericality: { greater_than: 0 }
  validates :isbn, presence: true, format: { with: /\A\d{10}(\d{3})?\z/, message: "must be a valid 10 or 13 digit ISBN" }

  def check_is_completed
    if self.total_pages.present?

      all_reading_logs = self.reading_logs
      
      read_pages = Array.new(self.total_pages + 1, false)
      read_pages[0] = true
      
      all_reading_logs.each do |log|
        start_p = [1, log.start_page.to_i].max
        end_p = [log.end_page.to_i, self.total_pages].min
        
        (start_p..end_p).each do |page|
          read_pages[page] = true
        end
      end
      
      all_pages_read = read_pages[1..-1].all?
      
      self.update(completed: all_pages_read)
    end
  end
end
