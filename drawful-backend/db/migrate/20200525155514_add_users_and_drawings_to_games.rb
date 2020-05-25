class AddUsersAndDrawingsToGames < ActiveRecord::Migration[6.0]
  def change
    add_column :drawings, :game_id, :integer
    add_column :users, :game_id, :integer
  end
end
