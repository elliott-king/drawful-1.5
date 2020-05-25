class Game < ApplicationRecord
  has_many :users
  has_many :drawings

  def user_count
    self.users.count
  end
end
