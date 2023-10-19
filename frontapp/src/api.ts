import axios from "axios";
import { LatLng } from "./types/data";

export const getField = async (id: string) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/v1/fields/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getFields = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/v1/fields');
    return response.data
  } catch (error) {
    console.error(error);
  }
};

export const getCoordinates = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/v1/coordinates');
    return response.data
  } catch (error) {
    console.error(error);
  }
};

export const handleDeleteField = async (id: number) => {
  try {
    await axios.delete(`http://localhost:3000/api/v1/fields/${id}`);
  } catch (error) {
    console.error(error);
  }
};

export const createField = async (name: string, polygon: LatLng[]) => {
  try {
    const fieldData = {
      field: {
        name,
        coordinates: polygon.map((latLng) => [latLng.lat, latLng.lng]),
      },
    };

    const response = await axios.post('http://localhost:3000/api/v1/fields', fieldData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateField = async (id: string, name: string, coordinates: LatLng[]) => {
  try {
    const fieldData = {
      field: {
        name,
        coordinates: coordinates.map((latLng) => [latLng.lat, latLng.lng]),
      },
    };
    const response = await axios.put(`http://localhost:3000/api/v1/fields/${id}`, fieldData);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};