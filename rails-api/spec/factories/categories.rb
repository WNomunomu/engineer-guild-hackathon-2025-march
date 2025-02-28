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
FactoryBot.define do
  factory :category do
    category { "rails" }
  end
end
