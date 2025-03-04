# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

User.create!(
  email: 'a@a.com',
  name: 'テスト太郎',
  password: "password", 
  password_confirmation: "password"
)

Book.create!(
  isbn: "1111111111",
  total_pages: 10,
  user: User.find_by(email: 'a@a.com')
)

1..2.times do |i|
  Category.create!(
    name: "frontend#{i}"
  )
end

# 0..1.times do |i|
#   BookCategory.create!(

#   )
# end
