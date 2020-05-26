class CreateGuesses < ActiveRecord::Migration[6.0]
  def change
    create_table :guesses do |t|
      t.references :drawing, null: false, foreign_key: true

      t.timestamps
    end
  end
end
