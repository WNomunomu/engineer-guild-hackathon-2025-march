class AddIsbnToBooks < ActiveRecord::Migration[8.0]
  def change
    add_column :books, :isbn, :string unless column_exists?(:books, :isbn)
  end
end
