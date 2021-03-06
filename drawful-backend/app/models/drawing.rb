class Drawing < ApplicationRecord
  # TODO: get rid of prompt_id schema
  has_one_attached :image
  
  belongs_to :user
  belongs_to :game, optional: true

  has_many :drawing_prompts
  has_many :prompts, through: :drawing_prompts

  has_many :guesses

  def correct_prompt
    self.drawing_prompts.each do |dp|
      if dp.is_correct
        return dp.prompt
      end
    end
    return nil
  end

  def image_url
    if image.attached?
      image.blob.service_url
    end
  end
end
