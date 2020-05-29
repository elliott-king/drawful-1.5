DrawingPrompt.destroy_all
Guess.destroy_all
Prompt.destroy_all
Drawing.destroy_all
User.destroy_all
Game.destroy_all

g = Game.create!
u = User.create!(username: "SeedUser", game: g)

prompt_strings = [
  "magical musical cowboy",
  "the sidewalk's end",
  "beyonce with a flamethrower",
  "a rocket powered by love",
  "desperate house flies",
  "sinful banjo",
  "pupper in paradise",
  "a helpful serving of bees",
  "mahogany treasure chest filled with relics from my childhood",
  "hipster batman",
  "steve doran",
  "a large man next to a smaller man",
  "kinky boots",
  "testing my sanity",
  "optimus prime "
]

prompt_strings.each do |prompt|
  Prompt.create(title: prompt, user: u)
end

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

Prompt.create(title: "president duck", user: u)
Prompt.create(title: "taco cat", user: u)
Prompt.create(title: "corona virus", user: u)
Prompt.create(title: "racing dresser", user: u)
Prompt.create(title: "modern art", user: u)
Prompt.create(title: "the pope", user: u)
Prompt.create(title: "bald eagle wearing a hat", user: u)
Prompt.create(title: "just a regular guy", user: u)
Prompt.create(title: "poster for the goonies", user: u)
Prompt.create(title: "extremely tight pants", user: u)

Drawing.create!(file: "IMG_8201.JPG", user_id: u.id, game: g)
Drawing.create!(file: "IMG_8203.JPG", user_id: u.id, game: g)

DrawingPrompt.create(drawing: Drawing.last, prompt: Prompt.last, is_correct: false)
DrawingPrompt.create(drawing: Drawing.first, prompt: Prompt.first, is_correct: false)
