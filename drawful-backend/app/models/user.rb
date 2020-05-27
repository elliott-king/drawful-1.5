class User < ApplicationRecord
  # make sure game is removed after finished
  belongs_to :game, optional: true

  has_many :drawings
  has_many :guesses
  has_many :prompts
end
