class AddDefaultToBooks < ActiveRecord::Migration[8.0]
  def change
    change_column_default :books, :current_pages, 0
    change_column_default :books, :completed, false
  end
end
