import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polygon } from 'react-leaflet';

interface LatLng {
  lat: number;
  lng: number;
}

interface BasicMapProps {
  coordinates?: [number, number][][];
}

const BasicMap: React.FC<BasicMapProps> = ({ coordinates }) => {
  const [center, setCenter] = useState<LatLng>({ lat: 48.21, lng: 31.1 });
  const [isUpdate, setUpdate] = useState<boolean>(false);

  useEffect(() => {
    if (coordinates && coordinates?.length === 1) {
      const coords = coordinates?.flat()
      const latSum = coords.reduce((sum: number, coord: [number, number]) => sum + coord[0], 0);
      const lngSum = coords.reduce((sum: number, coord: [number, number]) => sum + coord[1], 0);
      const latCenter = latSum / coords.length;
      const lngCenter = lngSum / coords.length;
      setUpdate(true);
      setCenter({ lat: latCenter, lng: lngCenter });
    }
  }, [coordinates]);

  if (!isUpdate && coordinates?.length === 1) {
    return null;
  }

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={6}
      style={{ height: '50vh', width: '100%' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {coordinates && coordinates.length > 0 && (
        <Polygon positions={coordinates} color="blue" />
      )}
    </MapContainer>
  );
};

export default BasicMap;
