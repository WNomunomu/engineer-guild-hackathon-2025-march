# == Schema Information
#
# Table name: exp_logs
#
#  id          :bigint           not null, primary key
#  earned_at   :date
#  exp_points  :integer
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  category_id :bigint           not null
#  user_id     :bigint           not null
#
# Indexes
#
#  index_exp_logs_on_category_id  (category_id)
#  index_exp_logs_on_user_id      (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (category_id => categories.id)
#  fk_rails_...  (user_id => users.id)
#
require 'rails_helper'

RSpec.describe ExpLog, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
