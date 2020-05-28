DrawingPrompt.destroy_all
Guess.destroy_all
Prompt.destroy_all
Drawing.destroy_all
User.destroy_all
Game.destroy_all

g = Game.create!
u = User.create!(username: "SeedUser", game: g)

5.times do 
  Prompt.create!(title: "#{Faker::DcComics.hero} #{Faker::Verb.ing_form} #{Faker::Space.planet}", user: u)

  Prompt.create!(title: "#{Faker::Verb.ing_form} #{Faker::House.furniture}", user: u)

  Prompt.create!(title: "#{Faker::Creature::Animal.name} #{Faker::Creature::Animal.name}", user: u)
end

Drawing.create!(file: "IMG_8201.JPG", user_id: u.id, game: g)
Drawing.create!(file: "IMG_8203.JPG", user_id: u.id, game: g)

DrawingPrompt.create(drawing: Drawing.last, prompt: Prompt.last, is_correct: false)
DrawingPrompt.create(drawing: Drawing.first, prompt: Prompt.first, is_correct: false)
