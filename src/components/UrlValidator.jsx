// src/components/UrlValidator.jsx
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Stack,
  CircularProgress
} from '@mui/material';

export default function UrlValidator() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleValidate = async () => {
    if (!url.trim()) {
      setError('La URL no puede estar vacía');
      return;
    }
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch(`http://localhost:8000/validar-url?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError('Error al comunicarse con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Validar URL de Muestra</Typography>

      <Stack spacing={2} direction="row" sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="URL de muestra"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button variant="contained" onClick={handleValidate} disabled={loading}>
          Validar
        </Button>
      </Stack>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {result && (
        <Paper sx={{ p: 3, mt: 3, backgroundColor: '#f5f5f5' }}>
          <Typography variant="h6">Resultado de la revisión</Typography>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(result, null, 2)}</pre>
        </Paper>
      )}
    </Box>
  );
}
