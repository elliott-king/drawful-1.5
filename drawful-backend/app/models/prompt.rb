class Prompt < ApplicationRecord
  has_many :drawingprompts
  has_many :drawings, through: :drawingprompts
end
