# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_05_25_222925) do

  create_table "drawing_prompts", force: :cascade do |t|
    t.integer "prompt_id"
    t.integer "drawing_id"
    t.boolean "is_correct"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["drawing_id"], name: "index_drawing_prompts_on_drawing_id"
    t.index ["prompt_id"], name: "index_drawing_prompts_on_prompt_id"
  end

  create_table "drawings", force: :cascade do |t|
    t.string "file"
    t.integer "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "prompt_id"
    t.integer "game_id"
    t.index ["user_id"], name: "index_drawings_on_user_id"
  end

  create_table "games", force: :cascade do |t|
    t.boolean "is_started"
    t.string "code"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "guesses", force: :cascade do |t|
    t.integer "drawing_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["drawing_id"], name: "index_guesses_on_drawing_id"
  end

  create_table "prompts", force: :cascade do |t|
    t.string "title"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "username"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "game_id"
  end

  add_foreign_key "drawings", "users"
  add_foreign_key "guesses", "drawings"
end
