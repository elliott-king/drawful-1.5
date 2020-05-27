class Prompt < ApplicationRecord
  has_many :drawing_prompts
  has_many :drawings, through: :drawing_prompts

  belongs_to :user, optional: true

  has_many :guesses
end
