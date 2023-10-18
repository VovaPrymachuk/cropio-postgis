import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { IField } from '../types/data';
import {
  Card,
  CardContent,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import BasicMap from './UI/BasicMap';
import { DeleteConfirmationDialog } from './UI/DeleteConfirmationDialog';

export const Field = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [field, setField] = useState<IField>();

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/v1/fields/${id}`)
      .then((response) => {
        setField(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/fields/${id}`);
      navigate('/fields');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item sm={8} sx={{mx: 4}}>
        <Card>
          <CardContent>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h5" component="div">
                {field?.name}
              </Typography>
              <Stack direction="row-reverse">
                <IconButton
                  color="primary"
                  component={Link}
                  to={`/fields/${field?.id}/edit`}
                >
                  <EditIcon />
                </IconButton>
                <DeleteConfirmationDialog
                  action="show"
                  onDelete={handleDelete}
                />
              </Stack>
            </div>
            <Typography variant="body1">
              {field?.area} square kilometers
            </Typography>
          </CardContent>
        </Card>
        <BasicMap coordinates={field?.coordinates} />
      </Grid>
      <Grid item sm={3}>
        <pre>
          {JSON.stringify({
            type: 'FeatureCollection',
            features: field?.coordinates?.map((coords: any, index: any) => ({
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Polygon',
                coordinates: [coords],
              },
            })),
          }, null, 2)}
        </pre>
      </Grid>
    </Grid>
  );
};
