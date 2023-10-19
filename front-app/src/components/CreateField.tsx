import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, FeatureGroup, Polygon } from 'react-leaflet';
import axios, { AxiosError } from 'axios';
import { EditControl } from 'react-leaflet-draw';
import { Button, Grid, Typography, Box, Input } from '@mui/material';
import { LatLng } from '../types/data';

const CreateField = () => {
  const [name, setName] = useState<string>('');
  const [polygon, setPolygon] = useState<LatLng[]>([]);
  const navigate = useNavigate();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handlePolygonCreated = (e: { layer: { getLatLngs: () => React.SetStateAction<LatLng[]>[]; }; }) => {
    setPolygon(e.layer.getLatLngs()[0]);
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

        const response = await axios.post(
          'http://localhost:3000/api/v1/fields',
          fieldData,
        );

        setName('');
        setPolygon([]);
        navigate(`/fields/${response.data.id}`);
      } catch (error) {
        const err = error as AxiosError<{name: string[]}>
        const data = err.response?.data.name[0]
        if (data == 'has already been taken') {
          alert('A field with that name already exists');
        }
      }
    } else {
      alert('Please enter a name and draw the field outline before saving.');
    }
  };

  return (
    <Grid item sm={8} mb={4}>
      <Grid item mb={4}>
        <Typography variant="h4">Create a New Field</Typography>
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
        <MapContainer center={[50, 32]} zoom={6} style={{ height: '50vh' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <FeatureGroup>
            <EditControl
              position="topright"
              onCreated={handlePolygonCreated}
              draw={{
                marker: false,
                circle: false,
                circlemarker: false,
              }}
            />
            {polygon.length > 0 && <Polygon positions={polygon} />}
          </FeatureGroup>
        </MapContainer>
      </Grid>
      <Grid item mb={4}>
        <Button variant="contained" color="primary" onClick={handleSaveField}>
          Save Field
        </Button>
      </Grid>
    </Grid>
  );
};

export default CreateField;
