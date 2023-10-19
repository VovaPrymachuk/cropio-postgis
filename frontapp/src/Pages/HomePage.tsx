import React, { useState, useEffect } from 'react';
import { Grid, Paper } from '@mui/material';
import BasicMap from '../components/UI/BasicMap';
import { FieldList } from '../components/FieldList';
import { getCoordinates } from '../api';

export const HomePage = () => {
  const [coordinates, setCoordinates] = useState([]);
  const [recordDeleted, setRecordDeleted] = useState(false);

  const getCoordinatesResponse = async () => {
    try {
      const response = await getCoordinates();
      setCoordinates(response);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getCoordinatesResponse()
  }, [recordDeleted]);

  const onRecordDeleted = () => setRecordDeleted(!recordDeleted)

  return (
    <>
      <Grid item sm={8} mb={4}>
        <Paper>
          <BasicMap coordinates={coordinates} />
        </Paper>
      </Grid>
      <Grid item sm={8}>
        <Paper>
          <FieldList onRecordDeleted={onRecordDeleted} />
        </Paper>
      </Grid>
    </>
  );
};
