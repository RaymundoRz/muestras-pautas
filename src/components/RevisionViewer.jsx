import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export default function RevisionViewer({ data }) {
  if (!data) return null;

  return (
    <Box mt={4}>
      <Typography variant="h5">Resultados de la Revisión</Typography>
      <Paper sx={{ p: 2, mt: 2, backgroundColor: '#f7f7f7' }}>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </Paper>
    </Box>
  );
}
