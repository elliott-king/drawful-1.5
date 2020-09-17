class RemoveFileFromDrawings < ActiveRecord::Migration[6.0]
  def change
    remove_column :drawings, :file, :string
  end
end
