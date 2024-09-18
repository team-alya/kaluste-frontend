import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';

const WelcomePage: React.FC = () => {
  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '30px',
        minHeight: '100vh',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        <Typography variant="h3" sx={{ marginBottom: '20px', color: '#3f51b5' }}>
          KalusteArvio
        </Typography>

        <Box
          component="img"
          src="logo.png"
          alt="Logo"
          sx={{ width: '100px', marginBottom: '20px' }}
        />

        <Typography variant="h6" sx={{ marginBottom: '20px' }}>
          Hei! Olen KalusteArvioBotti. Autan sinua arvioimaan mitä sinun kannattaa
          tehdä tarpeettomalle tai huonokuntoiselle kalusteelle.
        </Typography>

        <Typography variant="h6" sx={{ marginBottom: '20px' }}>
          1. Lataa kuva kalusteesta.
          <br /><br />
          2. Tarkista tekoälyn tunnistamat kalusteen tiedot.
          <br /><br />
          3. Tekoäly auttaa sinua arvioimaan mitä kalusteelle kannattaa tehdä.
        </Typography>

        <Button variant="contained" color="primary" sx={{ marginTop: '20px' }}>
          ALOITA
        </Button>
      </Box>
    </Container>
  );
};

export default WelcomePage;
