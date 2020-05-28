class RemovePromptIdFromDrawings < ActiveRecord::Migration[6.0]
  def change
    remove_column :drawings, :prompt_id
  end
end
