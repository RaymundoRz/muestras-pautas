import React from 'react';
import { Typography, Box } from '@mui/material';

export default function Dashboard() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>Bienvenido</Typography>
      <Typography variant="body1">
        Este administrador permite automatizar y validar el proceso de revisión de muestras y pautas por marca.
        Usa el menú de la izquierda para comenzar.
      </Typography>
    </Box>
  );
}
