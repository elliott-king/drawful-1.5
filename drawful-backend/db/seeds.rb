DrawingPrompt.destroy_all
Guess.destroy_all
Prompt.destroy_all
Drawing.destroy_all
User.destroy_all
Game.destroy_all

g = Game.create!
u = User.create!(username: "SeedUser", game: g)

# 5.times do 
#   Prompt.create!(title: "#{Faker::DcComics.hero} #{Faker::Verb.ing_form} #{Faker::Space.planet}", user: u)

#   Prompt.create!(title: "#{Faker::Verb.ing_form} #{Faker::House.furniture}", user: u)

#   Prompt.create!(title: "#{Faker::Creature::Animal.name} #{Faker::Creature::Animal.name}", user: u)
# end

Prompt.create(title: "president duck", user: u)
Prompt.create(title: "taco cat", user: u)
Prompt.create(title: "corona virus", user: u)
Prompt.create(title: "racing dresser", user: u)
Prompt.create(title: "modern art", user: u)
Prompt.create(title: "cynical lizard", user: u)
Prompt.create(title: "underwear", user: u)
Prompt.create(title: "the pope", user: u)
Prompt.create(title: "bald eagle wearing a hat", user: u)
Prompt.create(title: "just a regular guy", user: u)
Prompt.create(title: "poster for the goonies", user: u)
Prompt.create(title: "extremely tight pants", user: u)

# Prompt.create(title: "", user: u)
# Prompt.create(title: "", user: u)
# Prompt.create(title: "", user: u)
# Prompt.create(title: "", user: u)
# Prompt.create(title: "", user: u)
# Prompt.create(title: "", user: u)
# Prompt.create(title: "", user: u)
# Prompt.create(title: "", user: u)
# Prompt.create(title: "", user: u)

Drawing.create!(file: "IMG_8201.JPG", user_id: u.id, game: g)
Drawing.create!(file: "IMG_8203.JPG", user_id: u.id, game: g)

DrawingPrompt.create(drawing: Drawing.last, prompt: Prompt.last, is_correct: false)
DrawingPrompt.create(drawing: Drawing.first, prompt: Prompt.first, is_correct: false)
