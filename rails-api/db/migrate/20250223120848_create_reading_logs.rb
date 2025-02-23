class CreateReadingLogs < ActiveRecord::Migration[8.0]
  def change
    create_table :reading_logs do |t|
      t.references :user, null: false, foreign_key: true
      t.references :book, null: false, foreign_key: true
      t.date :read_at
      t.integer :pages_read

      t.timestamps
    end
  end
end
