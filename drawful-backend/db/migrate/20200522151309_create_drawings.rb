class CreateDrawings < ActiveRecord::Migration[6.0]
  def change
    create_table :drawings do |t|
      t.string :file
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
