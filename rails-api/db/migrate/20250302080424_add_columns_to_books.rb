class AddColumnsToBooks < ActiveRecord::Migration[8.0]
  def change
    add_column :books, :completed, :boolean
    add_column :books, :current_pages, :integer
  end
end
