class RemoveDrawingId < ActiveRecord::Migration[6.0]
  def change
    remove_column :prompts, :drawing_id, :integer
  end
end
