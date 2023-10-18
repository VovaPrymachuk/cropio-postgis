# frozen_string_literal: true

class ChangeShapeForFields < ActiveRecord::Migration[7.1]
  def up
    change_column :fields, :shape, 'geometry(Polygon,4326)', using: 'shape::geometry(Polygon,4326)'
  end

  def down
    change_column :fields, :shape, 'geometry(MultiPolygon,4326)', using: 'shape::geometry(MultiPolygon,4326)'
  end
end
