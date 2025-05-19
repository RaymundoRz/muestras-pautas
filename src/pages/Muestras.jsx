import React, { useState } from 'react';
import { Typography, Box } from '@mui/material';
import BrandSelector from '../components/BrandSelector';
import FileManager from '../components/FileManager';
import RevisionViewer from '../components/RevisionViewer';
import UrlValidator from '../components/UrlValidator';


export default function Muestras() {
  const [reviewResult, setReviewResult] = useState(null);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Revisión de Muestras</Typography>
      <BrandSelector />
      <FileManager onUploadComplete={setReviewResult} />
      <RevisionViewer data={reviewResult} />
      <Typography variant="h4" gutterBottom>Revisión de Muestras</Typography>
      <UrlValidator />

    </Box>
    
  );
}
