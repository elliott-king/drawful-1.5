class CreatePrompts < ActiveRecord::Migration[6.0]
  def change
    create_table :prompts do |t|
      t.string :title
      t.references :drawing

      t.timestamps
    end
  end
end
