class Drawing < ApplicationRecord
  # TODO: get rid of prompt_id schema
  belongs_to :user
  belongs_to :game, optional: true

  has_many :drawing_prompts
  has_many :prompts, through: :drawing_prompts
end
