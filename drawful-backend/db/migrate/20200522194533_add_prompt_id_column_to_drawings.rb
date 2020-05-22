class AddPromptIdColumnToDrawings < ActiveRecord::Migration[6.0]
  def change
    add_column :drawings, :prompt_id, :integer
  end
end
