class Drawing < ApplicationRecord
  # TODO: get rid of prompt_id schema
  belongs_to :user
  belongs_to :game, optional: true

  has_many :drawing_prompts
  has_many :prompts, through: :drawing_prompts

  has_many :guesses

  # TODO: this will not work if we re-use prompts over multiple games
  def correct_prompt
    self.drawing_prompts.each do |dp|
      if dp.is_correct
        return dp.prompt
      end
    end
    return nil
  end
end
