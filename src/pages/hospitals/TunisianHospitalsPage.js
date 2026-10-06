import React from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';

const TunisianHospitalsPage = () => {
  const { t } = useTranslation();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('hospitals.title')}
      </Typography>
      <Typography variant="body1" paragraph>
        {t('hospitals.description')}
      </Typography>
      <Outlet />
    </Container>
  );
};

export default TunisianHospitalsPage;
