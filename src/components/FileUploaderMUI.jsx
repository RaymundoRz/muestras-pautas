// src/components/FileUploaderMUI.jsx
import React, { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  TextField,
  Paper,
  Stack,
  Alert,
  Divider
} from '@mui/material';

export default function FileUploaderMUI() {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setResponse(data);
      setError(null);
    } catch (err) {
      setError('Error al subir el archivo');
      setResponse(null);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom color="primary">
          Administrador de Muestras y Pautas
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Stack spacing={3}>
          <Button variant="contained" component="label">
            Seleccionar archivo
            <input hidden type="file" onChange={(e) => setFile(e.target.files[0])} />
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            onClick={handleUpload}
            disabled={!file}
          >
            Subir y Validar
          </Button>

          {error && <Alert severity="error">{error}</Alert>}

          {response && (
            <Box>
              <Typography variant="h6" gutterBottom>Respuesta del servidor:</Typography>
              <TextField
                fullWidth
                multiline
                rows={10}
                value={JSON.stringify(response, null, 2)}
                InputProps={{ readOnly: true }}
              />
            </Box>
          )}
        </Stack>
      </Paper>
    </Container>
  );
}
