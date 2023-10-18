# frozen_string_literal: true

FactoryBot.define do
  factory :field do
    name { Faker::ProgrammingLanguage.name }

    shape do
      coordinates = [
        [51.88984204536498, 34.440567414958146],
        [52.46918769516145, 34.440567414958146],
        [52.46918769516145, 35.60436795641901],
        [51.88984204536498, 35.60436795641901],
        [51.88984204536498, 34.440567414958146]
      ]

      factory = RGeo::Geos.factory(srid: 4326)
      factory.polygon(factory.linear_ring(coordinates.map { |lon, lat| factory.point(lon, lat) }))
    end
  end
end
