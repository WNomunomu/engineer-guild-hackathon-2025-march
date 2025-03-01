class AddColumnToUserBook < ActiveRecord::Migration[8.0]
  def change
    add_column :user_books, :completed, :boolean, default: false
  end
end
