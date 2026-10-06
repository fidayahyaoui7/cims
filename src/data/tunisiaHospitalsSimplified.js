/**
 * Simplified list of Tunisian hospitals by region
 * Only includes essential information for region and hospital selection
 */

const tunisiaHospitals = [
  // Tunis Region
  {
    id: 'hosp-tun-001',
    name: 'Hôpital Universitaire Mongi Slim',
    type: 'university',
    city: 'La Marsa',
    address: 'Avenue Mongi Slim, La Marsa 2078',
    phone: '71764325',
    region: 'Tunis',
    beds: 128
  },
  {
    id: 'hosp-tun-002',
    name: 'Hôpital Habib Thameur',
    type: 'public',
    city: 'Tunis',
    address: 'Montfleury',
    phone: '71492773',
    region: 'Tunis',
    beds: 95
  },
  {
    id: 'hosp-tun-003',
    name: 'Hôpital Charles Nicolle',
    type: 'university',
    city: 'Tunis',
    address: 'Boulevard du 9 Avril 1938',
    phone: '71578000',
    region: 'Tunis',
    beds: 850
  },
  {
    id: 'hosp-tun-004',
    name: 'Hôpital Aziza Othmana',
    type: 'public',
    city: 'Tunis',
    address: 'Place de la Kasbah',
    phone: '71334000',
    region: 'Tunis',
    beds: 320
  },
  {
    id: 'hosp-tun-005',
    name: 'Hôpital La Rabta',
    type: 'public',
    city: 'Tunis',
    address: 'Jabbari',
    phone: '71578000',
    region: 'Tunis',
    beds: 420
  },
  
  // Sousse Region
  {
    id: 'hosp-sou-001',
    name: 'CHU Farhat Hached',
    type: 'university',
    city: 'Sousse',
    address: 'Avenue Ibn El Jazzar',
    phone: '73211000',
    region: 'Sousse',
    beds: 650
  },
  {
    id: 'hosp-sou-002',
    name: 'Hôpital Universitaire Sahloul',
    type: 'university',
    city: 'Sousse',
    address: 'Route Ceinture, Sahloul',
    phone: '73224000',
    region: 'Sousse',
    beds: 580
  },
  {
    id: 'hosp-sou-003',
    name: 'Hôpital Régional de Sousse',
    type: 'public',
    city: 'Sousse',
    address: 'Avenue 7 Novembre',
    phone: '73220000',
    region: 'Sousse',
    beds: 320
  },
  
  // Monastir Region
  {
    id: 'hosp-mon-001',
    name: 'Hôpital Universitaire Fattouma Bourguiba',
    type: 'university',
    city: 'Monastir',
    address: 'Route de Skanes',
    phone: '73460000',
    region: 'Monastir',
    beds: 720
  },
  
  // Sfax Region
  {
    id: 'hosp-sfa-001',
    name: 'Hôpital Universitaire Hédi Chaker',
    type: 'university',
    city: 'Sfax',
    address: 'Route El Ain Km 0.5',
    phone: '74244000',
    region: 'Sfax',
    beds: 680
  },
  {
    id: 'hosp-sfa-002',
    name: 'Hôpital Habib Bourguiba',
    type: 'public',
    city: 'Sfax',
    address: 'Route El Ain',
    phone: '74240000',
    region: 'Sfax',
    beds: 450
  },
  
  // Nabeul Region
  {
    id: 'hosp-nab-001',
    name: 'Hôpital Régional de Nabeul',
    type: 'public',
    city: 'Nabeul',
    address: 'Avenue Habib Bourguiba',
    phone: '72280000',
    region: 'Nabeul',
    beds: 320
  },
  {
    id: 'hosp-nab-002',
    name: 'Hôpital Régional Mohamed Tahar Maamouri',
    type: 'public',
    city: 'Nabeul',
    address: 'Rue des Oranges',
    phone: '72285000',
    region: 'Nabeul',
    beds: 280
  },
  
  // Tozeur Region
  {
    id: 'hosp-toz-001',
    name: 'Hôpital Régional de Tozeur',
    type: 'public',
    city: 'Tozeur',
    address: 'Route de Nefta',
    phone: '76400000',
    region: 'Tozeur',
    beds: 200
  },
  
  // Zaghouan Region
  {
    id: 'hosp-zag-001',
    name: 'Hôpital Régional de Zaghouan',
    type: 'public',
    city: 'Zaghouan',
    address: 'Avenue Habib Bourguiba',
    phone: '72700000',
    region: 'Zaghouan',
    beds: 180
  }
];

// Utility functions
export const getHospitalsByRegion = () => {
  return tunisiaHospitals.reduce((acc, hospital) => {
    if (!acc[hospital.region]) {
      acc[hospital.region] = [];
    }
    acc[hospital.region].push(hospital);
    return acc;
  }, {});
};

export const getRegions = () => {
  const hospitalsByRegion = getHospitalsByRegion();
  return Object.keys(hospitalsByRegion).sort().map(region => ({
    id: region,
    name: region,
    count: hospitalsByRegion[region].length
  }));
};

export default tunisiaHospitals;
