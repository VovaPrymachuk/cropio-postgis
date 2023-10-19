import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapContainer, TileLayer, FeatureGroup, Polygon } from 'react-leaflet';
import axios from 'axios';
import { EditControl } from 'react-leaflet-draw';
import { Button, Grid, Typography, Box, Input } from '@mui/material';
import { LatLng } from '../types/data';

interface LayerCoordinates {
  toGeoJSON: () => {
    geometry: {
      coordinates: [number, number][][];
    };
  };
}

const EditField = () => {
  const [name, setName] = useState<string>('');
  const [polygon, setPolygon] = useState<LatLng[]>([]);
  const [center, setCenter] = useState<LatLng | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/fields/${id}`,
        );

        let { name, coordinates } = response.data;
        coordinates = coordinates.flat()
        setName(name);
        setPolygon(
          coordinates.map((coord: [number, number]) => ({ lat: coord[0], lng: coord[1] })),
        );

        if (coordinates.length > 0) {
          const latSum = coordinates.reduce(
            (sum: number, coord: [number, number]) => sum + coord[0],
            0,
          );
          const lngSum = coordinates.reduce(
            (sum: number, coord: [number, number]) => sum + coord[1],
            0,
          );
          const latCenter = latSum / coordinates.length;
          const lngCenter = lngSum / coordinates.length;
          setCenter({ lat: latCenter, lng: lngCenter });
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [id]);

  const handlePolygonCreated = (e: {
    layer: { getLatLngs: () => React.SetStateAction<LatLng[]>[] };
  }) => {
    setPolygon(e.layer.getLatLngs()[0]);
  };

  const handlePolygonEdited = (e: {
    layers: { eachLayer: (arg0: (a: LayerCoordinates) => void) => void; };
  }) => {
    e.layers.eachLayer((a: LayerCoordinates) => {
      const coordinates = a.toGeoJSON().geometry.coordinates[0];
      const updatedLatLngs = coordinates.map(
        (coordinate: [number, number]) => ({
          lat: coordinate[1],
          lng: coordinate[0],
        }),
      );
  
      setPolygon(updatedLatLngs);
    });
  };  

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleSaveField = async () => {
    if (name && polygon.length > 0) {
      try {
        const fieldData = {
          field: {
            name: name,
            coordinates: polygon.map((latLng) => [latLng.lat, latLng.lng]),
          },
        };

        const response = await axios.put(
          `http://localhost:3000/api/v1/fields/${id}`,
          fieldData,
        );

        navigate(`/fields/${response.data.id}`);
      } catch (error) {
        console.error(error);
      }
    } else {
      alert('Please enter a name and draw the field outline before saving.');
    }
  };

  return (
    <Grid item sm={8} mb={4}>
      <Grid item mb={4}>
        <Typography variant="h4">Edit Field</Typography>
      </Grid>
      <Grid item mb={4}>
        <Box display="flex" alignItems="center">
          <Typography variant="subtitle1" style={{ marginRight: '8px' }}>
            Name:
          </Typography>
          <Input
            type="text"
            value={name}
            onChange={handleNameChange}
            fullWidth
          />
        </Box>
      </Grid>
      <Grid item mb={4}>
        {center && (
          <MapContainer
            center={[center.lat, center.lng]}
            zoom={7}
            style={{ height: '50vh' }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <FeatureGroup>
              <EditControl
                position="topright"
                onCreated={handlePolygonCreated}
                onEdited={handlePolygonEdited}
                draw={{
                  marker: false,
                  circle: false,
                  circlemarker: false,
                }}
              />
              {polygon.length > 0 && <Polygon positions={polygon} />}
            </FeatureGroup>
          </MapContainer>
        )}
      </Grid>
      <Grid item mb={4}>
        <Button variant="contained" color="primary" onClick={handleSaveField}>
          Save Field
        </Button>
      </Grid>
    </Grid>
  );
};

export default EditField;
