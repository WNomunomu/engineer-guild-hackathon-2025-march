# == Schema Information
#
# Table name: categories
#
#  id         :bigint           not null, primary key
#  category   :string(255)
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_categories_on_category  (category) UNIQUE
#
class Category < ApplicationRecord
  has_many :book_categories, dependent: :destroy
  has_many :books, through: :book_categories
  has_many :exp_logs

  validates :category, presence: true, uniqueness: true
end
