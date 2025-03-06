class ModifyColumnsOfBooks < ActiveRecord::Migration[8.0]
  def change
    remove_column :books, :image_id, :string
    add_column :books, :image_url, :string
  end
end
