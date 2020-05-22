# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

Drawing.destroy_all
User.destroy_all

u = User.create(username: "Luis")
Drawing.create(file: "assets/IMG_8201.JPG", user_id: u.id)
Drawing.create(file: "assets/IMG_8203.JPG", user_id: u.id)


5.times do 
  Prompt.create(title: "#{Faker::DcComics.hero} #{Faker::Verb.ing_form} #{Faker::Space.planet}")

  Prompt.create(title: "#{Faker::Verb.ing_form} #{Faker::House.furniture}")

  Prompt.create(title: "#{Faker::Creature::Animal.name} #{Faker::Creature::Animal.name} ")
end
