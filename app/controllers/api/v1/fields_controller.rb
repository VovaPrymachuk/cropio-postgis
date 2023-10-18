require 'pry'

class Api::V1::FieldsController < ApplicationController
  before_action :set_field, only: %i[ show update destroy ]
  before_action :set_fileds, only: %i[ index coordinates ]

  # GET /fields
  def index
    render json: @fields
  end

  # GET /fields/1
  def show
    render json: @field, serializer: FieldSerializer
  end

  # POST /fields
  def create # rubocop:disable Metrics/AbcSize
    @field = Field.new(name: params[:field][:name])

    if params[:field][:coordinates].present?
      polygon = generate_polygon

      if polygon.valid?
        @field.shape = polygon
      else
        render json: { error: 'Invalid polygon geometry' }, status: :unprocessable_entity
        return
      end
    end

    if @field.save
      render json: @field, serializer: FieldSerializer, status: :created, location: api_v1_field_path(@field)
    else
      render json: @field.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /fields/1
  def update
    polygon = generate_polygon

    unless polygon.valid?
      render json: { error: 'Invalid polygon geometry' }, status: :unprocessable_entity
      return
    end

    if @field.update(name: params[:field][:name], shape: polygon)
      render json: @field, serializer: FieldSerializer
    else
      render json: @field.errors, status: :unprocessable_entity
    end
  end

  # DELETE /fields/1
  def destroy
    @field.destroy!
  end

  def coordinates
    @coordinates = if @fields
      @fields.pluck(:shape).map { |f| RGeo::GeoJSON.encode(f)['coordinates'][0] }
                   else
      []
                   end

    render json: @coordinates
  end

  private
    def set_fileds
      @fields = Field.all
    end

    def set_field
      @field = Field.find(params[:id])
    end

    def generate_polygon
      factory = RGeo::Geos.factory(srid: 4326)
      coordinates = params[:field][:coordinates].map { |lon, lat| [lon.to_f, lat.to_f] }
      factory.polygon(factory.linear_ring(coordinates.map { |lon, lat| factory.point(lon, lat) }))
    end
end
