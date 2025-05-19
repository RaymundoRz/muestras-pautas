// src/components/FileManager.jsx
import React, { useState } from 'react';
import {
  Button, Box, Typography, Alert, Stack, LinearProgress
} from '@mui/material';
import { useBrand } from '../context/BrandContext';

export default function FileManager({ onUploadComplete }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { selectedBrand } = useBrand();

  const handleUpload = async () => {
    if (!file || !selectedBrand) {
      setError('Debes seleccionar una marca y un archivo.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('brand', selectedBrand);

    try {
      setLoading(true);
      setError(null);
      const res = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      onUploadComplete(data);
    } catch (err) {
      setError('Error al subir el archivo');
      onUploadComplete(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box mt={2}>
      <Stack spacing={2} direction="column">
        {!selectedBrand && (
          <Alert severity="warning">Selecciona una marca antes de continuar.</Alert>
        )}

        <Button variant="contained" component="label">
          Seleccionar archivo
          <input hidden type="file" onChange={(e) => setFile(e.target.files[0])} />
        </Button>

        <Button
          variant="outlined"
          color="primary"
          onClick={handleUpload}
          disabled={!file || !selectedBrand || loading}
        >
          Subir y Validar
        </Button>

        {loading && <LinearProgress />}
        {error && <Alert severity="error">{error}</Alert>}

        {file && (
          <Typography variant="body2" color="textSecondary">
            Archivo seleccionado: {file.name}
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
