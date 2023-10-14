class Api::V1::FieldsController < ApplicationController
  before_action :set_field, only: %i[ show update destroy ]

  # GET /fields
  def index
    @fields = Field.all

    render json: @fields
  end

  # GET /fields/1
  def show
    render json: @field
  end

  # POST /fields
  def create
    @field = Field.new(field_params)

    if @field.save
      render json: @field, status: :created, location: api_v1_field_path(@field)
    else
      render json: @field.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /fields/1
  def update
    if @field.update(field_params)
      render json: @field
    else
      render json: @field.errors, status: :unprocessable_entity
    end
  end

  # DELETE /fields/1
  def destroy
    @field.destroy!
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_field
      @field = Field.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def field_params
      params.require(:field).permit(:name, :area)
    end
end
