class CreateFields < ActiveRecord::Migration[7.1]
  def change
    create_table :fields do |t|
      t.string :name, null: false
      t.integer :area
      t.multi_polygon :shape, geographic: true

      t.timestamps
    end
    add_index :fields, :name, unique: true
  end
end
