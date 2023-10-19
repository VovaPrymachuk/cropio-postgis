export interface IField {
  id?: number;
  name: string;
  area: number;
  coordinates: [number, number][][];
}

export interface LatLng {
  lat: number;
  lng: number;
}
