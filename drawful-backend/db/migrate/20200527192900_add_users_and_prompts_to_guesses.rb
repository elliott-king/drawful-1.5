class AddUsersAndPromptsToGuesses < ActiveRecord::Migration[6.0]
  def change
    add_column :guesses, :user_id, :integer
    add_column :guesses, :prompt_id, :integer
    add_column :guesses, :is_correct, :boolean
  end
end
