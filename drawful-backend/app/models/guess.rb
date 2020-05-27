class Guess < ApplicationRecord
  belongs_to :drawing
  belongs_to :user 
  belongs_to :prompt
end
