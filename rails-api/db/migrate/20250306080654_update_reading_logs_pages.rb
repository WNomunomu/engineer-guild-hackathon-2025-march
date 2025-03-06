class UpdateReadingLogsPages < ActiveRecord::Migration[8.0]
  def change
    remove_column :reading_logs, :pages_read, :integer
    add_column :reading_logs, :start_page, :integer, null: false
    add_column :reading_logs, :end_page, :integer, null: false
  end
end
