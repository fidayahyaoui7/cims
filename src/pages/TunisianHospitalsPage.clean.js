import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaMapMarkerAlt, FaPhone, FaChevronDown, FaChevronUp, FaHospital } from 'react-icons/fa';
import { 
  Container, 
  Typography, 
  TextField, 
  Card, 
  CardContent, 
  Chip, 
  Box, 
  Collapse,
  List,
  ListItemButton,
  ListItemText,
  Divider
} from '@mui/material';

// Hospital data organized by region with services
const hospitalsByRegion = {
  'Tunis Region': [
    { 
      id: 'h1', 
      name: 'Hôpital Charles Nicolle', 
      city: 'Tunis', 
      address: 'Boulevard du 9 Avril 1938',
      phone: '71 578 000',
      position: [36.8065, 10.1815],
      services: ['Cardiologie', 'Radiologie', 'Urgences']
    },
    { 
      id: 'h2', 
      name: 'Hôpital La Rabta', 
      city: 'Tunis', 
      address: 'Jabbari 1007',
      phone: '71 573 000',
      position: [36.8048, 10.1643],
      services: ['Neurologie', 'Pédiatrie', 'Chirurgie']
    },
    { 
      id: 'h3', 
      name: 'Hôpital Habib Thameur', 
      city: 'Tunis', 
      address: 'Place du Rassemblement',
      phone: '71 280 000',
      position: [36.7909, 10.1813],
      services: ['Médecine Interne', 'Ophtalmologie', 'ORL']
    },
  ],
  'Sousse Region': [
    { 
      id: 's1', 
      name: 'Hôpital Sahloul', 
      city: 'Sousse', 
      address: 'Route Ceinture Sahloul',
      phone: '73 369 000',
      position: [35.8254, 10.6084],
      services: ['Cardiologie', 'Maternité', 'Pédiatrie']
    },
    { 
      id: 's2', 
      name: 'Hôpital Universitaire Farhat Hached', 
      city: 'Sousse', 
      address: 'Avenue Ibn El Jazzar',
      phone: '73 222 000',
      position: [35.8288, 10.6339],
      services: ['Médecine Interne', 'Pédiatrie', 'Urgences']
    },
  ],
  'Sfax Region': [
    { 
      id: 'sf1', 
      name: 'Hôpital Hédi Chaker', 
      city: 'Sfax', 
      address: 'Route El Aïn km 0.5',
      phone: '74 244 000',
      position: [34.7296, 10.7646],
      services: ['Cardiologie', 'Neurologie', 'Chirurgie']
    },
    { 
      id: 'sf2', 
      name: 'Hôpital Habib Bourguiba', 
      city: 'Sfax', 
      phone: '74 240 000',
      services: ['Médecine Générale', 'Pédiatrie', 'Radiologie']
    },
  ],
  'Monastir Region': [
    { 
      id: 'm1', 
      name: 'Hôpital Fattouma Bourguiba', 
      city: 'Monastir', 
      address: 'Rue du 1er Juin 1955',
      phone: '73 462 000',
      position: [35.7787, 10.8269],
      services: ['Chirurgie', 'Médecine Interne', 'Urgences']
    },
  ],
  'Mahdia Region': [
    { 
      id: 'md1', 
      name: 'Hôpital Tahar Sfar', 
      city: 'Mahdia', 
      address: 'Route de la Plage',
      phone: '73 694 000',
      position: [35.5049, 11.0622],
      services: ['Médecine Générale', 'Pédiatrie', 'Radiologie']
    },
  ],
  'Gabès Region': [
    { 
      id: 'g1', 
      name: 'Hôpital Régional de Gabès', 
      city: 'Gabès', 
      address: 'Route de Matmata',
      phone: '75 274 000',
      position: [33.8815, 10.0982],
      services: ['Médecine Générale', 'Pédiatrie', 'Maternité']
    },
  ],
  'Military Hospitals': [
    { 
      id: 'mil1', 
      name: 'Hôpital Militaire de Tunis', 
      city: 'Tunis', 
      address: 'Montplaisir',
      phone: '71 780 000',
      position: [36.8337, 10.1896],
      services: ['Médecine Militaire', 'Chirurgie', 'Rééducation']
    },
  ],
};

const TunisianHospitalsPage = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRegions, setExpandedRegions] = useState({});

  const toggleRegion = (region) => {
    setExpandedRegions(prev => ({
      ...prev,
      [region]: !prev[region]
    }));
  };

  const filteredRegions = Object.entries(hospitalsByRegion).filter(([region, hospitals]) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      region.toLowerCase().includes(query) ||
      hospitals.some(h => 
        h.name.toLowerCase().includes(query) || 
        h.city.toLowerCase().includes(query)
      )
    );
  });

  // Auto-expand regions when searching
  if (searchQuery) {
    filteredRegions.forEach(([region]) => {
      if (!expandedRegions[region]) {
        setExpandedRegions(prev => ({ ...prev, [region]: true }));
      }
    });
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <FaHospital style={{ marginRight: 12, color: '#1976d2', fontSize: '2rem' }} />
        <Typography variant="h4" component="h1">
          {t('hospitals.title', 'Tunisian Public Hospitals')}
        </Typography>
      </Box>
      
      <TextField
        fullWidth
        variant="outlined"
        placeholder={t('hospitals.search_placeholder', 'Search hospitals...')}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ 
          mb: 4,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            backgroundColor: '#fff',
          }
        }}
        InputProps={{
          startAdornment: <FaMapMarkerAlt style={{ marginRight: 8, color: '#666' }} />
        }}
      />

      <List>
        {filteredRegions.map(([region, hospitals]) => (
          <React.Fragment key={region}>
            <ListItemButton 
              onClick={() => toggleRegion(region)}
              sx={{
                bgcolor: expandedRegions[region] ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' },
                borderRadius: 1,
                mb: 0.5
              }}
            >
              <ListItemText 
                primary={
                  <Box display="flex" alignItems="center">
                    <Typography variant="h6" component="span">
                      {region}
                    </Typography>
                    <Chip 
                      label={`${hospitals.length}`} 
                      size="small" 
                      sx={{ 
                        ml: 1.5,
                        bgcolor: 'primary.light',
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                  </Box>
                }
              />
              {expandedRegions[region] ? <FaChevronUp /> : <FaChevronDown />}
            </ListItemButton>
            
            <Collapse in={expandedRegions[region]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {hospitals.map((hospital) => (
                  <Card 
                    key={hospital.id} 
                    variant="outlined" 
                    sx={{ 
                      mb: 1, 
                      ml: 2, 
                      mr: 2,
                      borderLeft: '4px solid',
                      borderLeftColor: 'primary.main',
                      '&:hover': {
                        boxShadow: 2,
                        transform: 'translateY(-1px)',
                        transition: 'all 0.2s ease-in-out',
                        borderLeftWidth: '6px',
                        ml: '18px'
                      },
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out'
                    }}
                    onClick={() => {
                      // You can add navigation to hospital details here
                      console.log('Viewing hospital:', hospital.id);
                    }}
                  >
                    <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {hospital.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, mb: 0.5 }}>
                        <FaMapMarkerAlt style={{ color: '#f44336', marginRight: 8, fontSize: '0.9rem' }} />
                        <Typography variant="body2" color="text.secondary">
                          {hospital.city} {hospital.address && `• ${hospital.address}`}
                        </Typography>
                      </Box>
                      {hospital.phone && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, mb: 1 }}>
                          <FaPhone style={{ color: '#2196f3', marginRight: 8, fontSize: '0.9rem' }} />
                          <Typography variant="body2" color="text.secondary">
                            {hospital.phone}
                          </Typography>
                        </Box>
                      )}
                      {hospital.services && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                            Services:
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {hospital.services.slice(0, 3).map((service, idx) => (
                              <Chip 
                                key={idx} 
                                label={service} 
                                size="small" 
                                sx={{ 
                                  height: 22,
                                  '& .MuiChip-label': { px: 1 },
                                  fontSize: '0.7rem'
                                }}
                              />
                            ))}
                            {hospital.services.length > 3 && (
                              <Chip 
                                label={`+${hospital.services.length - 3}`} 
                                size="small"
                                sx={{ 
                                  height: 22,
                                  '& .MuiChip-label': { px: 1 },
                                  fontSize: '0.7rem'
                                }}
                              />
                            )}
                          </Box>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </List>
            </Collapse>
            <Divider sx={{ my: 1 }} />
          </React.Fragment>
        ))}
        
        {filteredRegions.length === 0 && (
          <Box textAlign="center" py={4}>
            <Typography color="text.secondary">
              {t('hospitals.no_results', 'No hospitals found matching your search.')}
            </Typography>
          </Box>
        )}
      </List>
    </Container>
  );
};

export default TunisianHospitalsPage;
