class Drawing < ApplicationRecord
  belongs_to :user
  belongs_to :game, optional: true

  has_many :drawingprompts
  has_many :prompts, through: :drawingprompts
end
