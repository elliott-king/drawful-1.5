class CreateDrawingPrompts < ActiveRecord::Migration[6.0]
  def change
    create_table :drawing_prompts do |t|
      t.references :prompt
      t.references :drawing
      t.boolean :is_correct

      t.timestamps
    end
  end
end
