class Field < ApplicationRecord
  before_save :calculate_area

  validates :name, presence: true
  validates :shape, presence: true

  private

  def calculate_area
    self.area = shape.area * (111 * 111)
  end
end
