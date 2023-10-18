import React, { useState, useEffect } from 'react';
import { Grid, Paper } from '@mui/material';
import BasicMap from '../components/UI/BasicMap';
import { FieldList } from '../components/FieldList';
import axios from 'axios';

export const HomePage = () => {
  const [coordinates, setCoordinates] = useState([]);
  const [recordDeleted, setRecordDeleted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/coordinates');
        setCoordinates(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [recordDeleted]);

  return (
    <>
      <Grid item sm={8} mb={4}>
        <Paper>
          <BasicMap coordinates={coordinates} />
        </Paper>
      </Grid>
      <Grid item sm={8}>
        <Paper>
          <FieldList onRecordDeleted={() => setRecordDeleted(!recordDeleted)} />
        </Paper>
      </Grid>
    </>
  );
};
