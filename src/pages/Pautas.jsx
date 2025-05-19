import React, { useState } from 'react';
import { Typography, Box } from '@mui/material';
import BrandSelector from '../components/BrandSelector';
import FileManager from '../components/FileManager';
import RevisionViewer from '../components/RevisionViewer';

export default function Pautas() {
  const [reviewResult, setReviewResult] = useState(null);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Revisión de Pautas</Typography>
      <BrandSelector />
      <FileManager onUploadComplete={setReviewResult} />
      <RevisionViewer data={reviewResult} />
    </Box>
  );
}
