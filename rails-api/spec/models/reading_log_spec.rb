# == Schema Information
#
# Table name: reading_logs
#
#  id         :bigint           not null, primary key
#  pages_read :integer
#  read_at    :date
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  book_id    :bigint           not null
#  user_id    :bigint           not null
#
# Indexes
#
#  index_reading_logs_on_book_id  (book_id)
#  index_reading_logs_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (book_id => books.id)
#  fk_rails_...  (user_id => users.id)
#
require 'rails_helper'

RSpec.describe ReadingLog, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
