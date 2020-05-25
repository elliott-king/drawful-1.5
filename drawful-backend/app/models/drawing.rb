class Drawing < ApplicationRecord
  belongs_to :user
  belongs_to :game

  has_many :drawingprompts
  has_many :prompts, through: :drawingprompts
end
