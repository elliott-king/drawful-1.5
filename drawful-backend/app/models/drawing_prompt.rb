class DrawingPrompt < ApplicationRecord
  belongs_to :prompt 
  belongs_to :drawing 
end
