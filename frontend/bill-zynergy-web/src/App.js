import React from 'react';
import { Button, Container, Typography, Box } from '@mui/material';
import { Favorite } from '@mui/icons-material';

function App() {
  return (
    <Container sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant="h3" gutterBottom>
        Welcome to Bill Zynergy
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Button variant="contained" color="primary" startIcon={<Favorite />}>
          Like
        </Button>
      </Box>
    </Container>
  );
}

export default App;
