import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useBrand } from '../context/BrandContext';

const brands = ['FIAT', 'Peugeot', 'Jeep', 'Ram', 'Citroën', 'Opel'];

export default function BrandSelector() {
  const { selectedBrand, setSelectedBrand } = useBrand();

  return (
    <FormControl fullWidth sx={{ mb: 4 }}>
      <InputLabel>Selecciona una marca</InputLabel>
      <Select
        value={selectedBrand || ''}
        label="Selecciona una marca"
        onChange={(e) => setSelectedBrand(e.target.value)}
      >
        {brands.map((brand) => (
          <MenuItem key={brand} value={brand}>{brand}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
