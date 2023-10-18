# frozen_string_literal: true

class FieldSerializer < ActiveModel::Serializer
  attributes :id, :name, :area, :coordinates

  def coordinates
    shape = object.shape
    return [] if shape.nil?

    RGeo::GeoJSON.encode(shape)['coordinates']
  end
end
