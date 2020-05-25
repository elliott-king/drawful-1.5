class User < ApplicationRecord
  # make sure game is removed after finished
  belongs_to :game
end
