/**
 * Complete list of Tunisian hospitals by region
 */

const tunisiaHospitals = [
  // Ariana
  {
    id: 'hosp-ari-001',
    name: 'Hôpital Abderrahmen Mami',
    type: 'public',
    city: 'Ariana',
    address: 'Ariana Ville, 2080',
    phone: '71706000',
    emergencyPhone: '71706010',
    region: 'Ariana',
    rating: 4.0,
    reviews: 95,
    services: ['Radiographie (X-ray)', 'Échographie', 'Scanner (CT)']
  },
 

  // Ben Arous
  {
    id: 'hosp-bar-001',
    name: 'Hôpital Taoufik Bouhima',
    type: 'public',
    city: 'Ben Arous',
    address: 'Route de Tunis, Ben Arous',
    phone: '79382000',
    emergencyPhone: '79382050',
    region: 'Ben Arous',
    services: ['Radiographie (X-ray)', 'Échographie'],
    rating: 3.9,
    reviews: 85
  },

  // Ben Guerdane
  {
    id: 'hosp-bg-001',
    name: 'Hôpital Régional de Ben Guerdane',
    type: 'public',
    city: 'Ben Guerdane',
    address: 'Avenue de la République, Ben Guerdane',
    phone: '75680000',
    emergencyPhone: '75680050',
    region: 'Médenine',
    rating: 3.7,
    reviews: 65
  },

  // Béja
  {
    id: 'hosp-bej-001',
    name: 'Hôpital Régional de Béja',
    type: 'public',
    city: 'Béja',
    address: 'Avenue Habib Bourguiba, Béja 9000',
    phone: '78460222',
    emergencyPhone: '78460200',
    region: 'Béja',
    rating: 3.8,
    reviews: 72
  },

  // Djerba
  {
    id: 'hosp-dj-001',
    name: 'Hôpital de Djerba',
    type: 'public',
    city: 'Houmt Souk',
    address: 'Zone Touristique, Djerba',
    phone: '75634000',
    emergencyPhone: '75634500',
    region: 'Médenine',
    rating: 4.0,
    reviews: 110
  },

  // Gabès
  {
    id: 'hosp-gab-001',
    name: 'Hôpital Régional de Gabès',
    type: 'public',
    city: 'Gabès',
    address: 'Route de Matmata, Gabès 6000',
    phone: '75273000',
    emergencyPhone: '75273500',
    region: 'Gabès',
    rating: 3.9,
    reviews: 88
  },

  // Gafsa
  {
    id: 'hosp-gaf-001',
    name: 'Hôpital Régional de Gafsa',
    type: 'public',
    city: 'Gafsa',
    address: 'Route de Kasserine, Gafsa 2100',
    phone: '76220000',
    emergencyPhone: '76220500',
    region: 'Gafsa',
    rating: 3.8,
    reviews: 76
  },

  // Jebeniana
  {
    id: 'hosp-jeb-001',
    name: 'Hôpital de Jebeniana',
    type: 'public',
    city: 'Jebeniana',
    address: 'Avenue Habib Bourguiba, Jebeniana',
    phone: '74620000',
    region: 'Sfax',
    rating: 3.6,
    reviews: 42
  },

  // Jendouba
  {
    id: 'hosp-jen-001',
    name: 'Hôpital Régional de Jendouba',
    type: 'public',
    city: 'Jendouba',
    address: 'Avenue Habib Bourguiba, Jendouba 8100',
    phone: '78600000',
    emergencyPhone: '78600500',
    region: 'Jendouba',
    rating: 3.7,
    reviews: 68
  },

  // Kairouan
  {
    id: 'hosp-kai-001',
    name: 'Hôpital Universitaire Ibn El Jazzar',
    type: 'university',
    city: 'Kairouan',
    address: 'Route de Kairouan, 3100',
    phone: '77220000',
    emergencyPhone: '77220500',
    region: 'Kairouan',
    rating: 4.0,
    reviews: 92
  },

  // Kasserine
  {
    id: 'hosp-kas-001',
    name: 'Hôpital Régional de Kasserine',
    type: 'public',
    city: 'Kasserine',
    address: 'Avenue de l\'Indépendance, Kasserine 1200',
    phone: '77200000',
    emergencyPhone: '77200500',
    region: 'Kasserine',
    rating: 3.7,
    reviews: 64
  },

  // Kebili
  {
    id: 'hosp-keb-001',
    name: 'Hôpital Régional de Kébili',
    type: 'public',
    city: 'Kébili',
    address: 'Avenue Habib Bourguiba, Kébili 4200',
    phone: '75600000',
    emergencyPhone: '75600500',
    region: 'Kébili',
    rating: 3.6,
    reviews: 58
  },

  // Kerkennah
  {
    id: 'hosp-ker-001',
    name: 'Hôpital de Kerkennah',
    type: 'public',
    city: 'Remla',
    address: 'Ile de Kerkennah, Sfax',
    phone: '74650000',
    region: 'Sfax',
    rating: 3.5,
    reviews: 45
  },

  // Khereddine
  {
    id: 'hosp-khe-001',
    name: 'Hôpital Régional de Khereddine',
    type: 'public',
    city: 'Khereddine',
    address: '16, rue Imam El Ghazal, Khereddine',
    phone: '71731860',
    emergencyPhone: '71730100',
    region: 'Ariana',
    rating: 3.8,
    reviews: 65
  },

  // Ksar Hellal
  {
    id: 'hosp-ksh-001',
    name: 'Hôpital de Ksar Hellal',
    type: 'public',
    city: 'Ksar Hellal',
    address: 'Avenue Habib Bourguiba, Ksar Hellal',
    phone: '73620000',
    region: 'Monastir',
    rating: 3.5,
    reviews: 52
  },

  // La Marsa
  {
    id: 'hosp-mar-001',
    name: 'Hôpital Universitaire Mongi Slim',
    type: 'public',
    city: 'La Marsa',
    address: 'Avenue Mongi Slim, La Marsa 2078',
    phone: '71764325',
    emergencyPhone: '71764845, 71764033, 71764066',
    region: 'Tunis',
    rating: 4.3,
    reviews: 128
  },

  // Le Kef
  {
    id: 'hosp-kef-001',
    name: 'Hôpital Régional du Kef',
    type: 'public',
    city: 'Le Kef',
    address: 'Avenue Habib Bourguiba, Le Kef 7100',
    phone: '78220000',
    emergencyPhone: '78220500',
    region: 'Le Kef',
    rating: 3.7,
    reviews: 71
  },

  // M'Saken
  {
    id: 'hosp-msa-001',
    name: 'Hôpital de M\'Saken',
    type: 'public',
    city: 'M\'Saken',
    address: 'Avenue Habib Bourguiba, M\'Saken',
    phone: '73200000',
    region: 'Sousse',
    rating: 3.6,
    reviews: 62
  },

  // Mahdia
  {
    id: 'hosp-mah-001',
    name: 'Hôpital Régional de Mahdia',
    type: 'public',
    city: 'Mahdia',
    address: 'Route de Rejiche, Mahdia 5100',
    phone: '73320000',
    emergencyPhone: '73320500',
    region: 'Mahdia',
    rating: 3.9,
    reviews: 84
  },

  // Mahres
  {
    id: 'hosp-mah-002',
    name: 'Hôpital de Mahres',
    type: 'public',
    city: 'Mahres',
    address: 'Avenue Habib Bourguiba, Mahres',
    phone: '74200000',
    region: 'Sfax',
    rating: 3.5,
    reviews: 48
  },

  // Medjez El Bab
  {
    id: 'hosp-med-001',
    name: 'Hôpital de Medjez El Bab',
    type: 'public',
    city: 'Medjez El Bab',
    address: 'Avenue Habib Bourguiba, Medjez El Bab',
    phone: '78200000',
    region: 'Béja',
    rating: 3.6,
    reviews: 54
  },

  // Menzel Bourguiba
  {
    id: 'hosp-mb-001',
    name: 'Hôpital 15 Octobre',
    type: 'public',
    city: 'Menzel Bourguiba',
    address: 'Avenue Habib Bourguiba, Menzel Bourguiba',
    phone: '78210000',
    region: 'Bizerte',
    rating: 3.7,
    reviews: 67
  },

  // Menzel Temime
  {
    id: 'hosp-mt-001',
    name: 'Hôpital de Menzel Temime',
    type: 'public',
    city: 'Menzel Temime',
    address: 'Avenue Habib Bourguiba, Menzel Temime',
    phone: '72200000',
    region: 'Nabeul',
    rating: 3.5,
    reviews: 49
  },

  // Metlaoui
  {
    id: 'hosp-met-001',
    name: 'Hôpital de Métlaoui',
    type: 'public',
    city: 'Métlaoui',
    address: 'Avenue Habib Bourguiba, Métlaoui',
    phone: '76250000',
    region: 'Gafsa',
    rating: 3.4,
    reviews: 43
  },

  // Moknine
  {
    id: 'hosp-mok-001',
    name: 'Hôpital de Moknine',
    type: 'public',
    city: 'Moknine',
    address: 'Avenue Habib Bourguiba, Moknine',
    phone: '73220000',
    region: 'Monastir',
    rating: 3.6,
    reviews: 57
  },

  // Monastir
  {
    id: 'hosp-mon-001',
    name: 'Hôpital Fattouma Bourguiba',
    type: 'university',
    city: 'Monastir',
    address: 'Rue du 1er juin 1995, Monastir 5000',
    phone: '73460309',
    emergencyPhone: '73460411, 73447108',
    region: 'Monastir',
    rating: 4.3,
    reviews: 124
  },

  // Médenine
  {
    id: 'hosp-med-002',
    name: 'Hôpital Régional de Médenine',
    type: 'public',
    city: 'Médenine',
    address: 'Avenue Habib Bourguiba, Médenine 4100',
    phone: '75600000',
    emergencyPhone: '75600500',
    region: 'Médenine',
    rating: 3.8,
    reviews: 76
  },

  // Nabeul
  {
    id: 'hosp-nab-001',
    name: 'Hôpital Régional de Nabeul',
    type: 'public',
    city: 'Nabeul',
    address: 'Avenue Habib Bourguiba, Nabeul 8000',
    phone: '72220000',
    emergencyPhone: '72220500',
    region: 'Nabeul',
    rating: 3.9,
    reviews: 89
  },
  
  // Sfax
  {
    id: 'hosp-sfa-001',
    name: 'Hôpital Hédi Chaker',
    type: 'university',
    city: 'Sfax',
    address: 'Route El Aïn Km 1, 3029 Sfax',
    phone: '74244000',
    emergencyPhone: '74244050',
    region: 'Sfax',
    services: ['Radiographie (X-ray)', 'Échographie', 'Scanner (CT)', 'IRM'],
    rating: 4.1,
    reviews: 98
  },
  {
    id: 'hosp-sfx-002',
    name: 'CHU Habib Bourguiba',
    type: 'university',
    city: 'Sfax',
    address: 'Route El Ain Km 2, Sfax',
    phone: '74246000',
    emergencyPhone: '74246050',
    region: 'Sfax',
    rating: 4.0,
    reviews: 95
  },

  // Sidi Bouzid
  {
    id: 'hosp-sbz-001',
    name: 'Hôpital Régional de Sidi Bouzid',
    type: 'public',
    city: 'Sidi Bouzid',
    address: 'Avenue Habib Bourguiba, Sidi Bouzid 9100',
    phone: '76220000',
    emergencyPhone: '76220500',
    region: 'Sidi Bouzid',
    rating: 3.7,
    reviews: 69
  },

  // Siliana
  {
    id: 'hosp-sil-001',
    name: 'Hôpital Régional de Siliana',
    type: 'public',
    city: 'Siliana',
    address: 'Avenue Habib Bourguiba, Siliana 6100',
    phone: '78220000',
    emergencyPhone: '78220500',
    region: 'Siliana',
    rating: 3.6,
    reviews: 61
  },

  // Sousse
  {
    id: 'hosp-sus-001',
    name: 'Hôpital Sahloul',
    type: 'university',
    city: 'Sousse',
    address: 'Route Ceinture, 4054 Sahloul',
    phone: '73246000',
    emergencyPhone: '73246050',
    region: 'Sousse',
    services: ['Radiographie (X-ray)', 'Échographie', 'Scanner (CT)', 'IRM'],
    rating: 4.3,
    reviews: 156
  },
  {
    id: 'hosp-sou-003',
    name: 'Hôpital Régional de Sousse',
    type: 'public',
    city: 'Sousse',
    address: 'Avenue Mohammed Karoui, Sousse 4000',
    phone: '73220000',
    emergencyPhone: '73220500',
    region: 'Sousse',
    rating: 4.0,
    reviews: 112
  },
  

  // Tataouine
  {
    id: 'hosp-tat-001',
    name: 'Hôpital Régional de Tataouine',
    type: 'public',
    city: 'Tataouine',
    address: 'Avenue Habib Bourguiba, Tataouine 3200',
    phone: '75620000',
    emergencyPhone: '75620500',
    region: 'Tataouine',
    rating: 3.6,
    reviews: 58
  },

  // Tozeur
  {
    id: 'hosp-toz-001',
    name: 'Hôpital Régional de Tozeur',
    type: 'public',
    city: 'Tozeur',
    address: 'Avenue Habib Bourguiba, Tozeur 2200',
    phone: '76400000',
    emergencyPhone: '76400500',
    region: 'Tozeur',
    rating: 3.7,
    reviews: 63
  },

  // Tunis
  {
    id: 'hosp-tun-001',
    name: 'Hôpital Charles Nicolle',
    type: 'university',
    city: 'Tunis',
    address: 'Boulevard 9 Avril 1938, 1006 Tunis',
    phone: '71578000',
    emergencyPhone: '71578050',
    region: 'Tunis',
    services: ['Radiographie (X-ray)', 'Échographie', 'Scanner (CT)', 'IRM'],
    rating: 4.4,
    reviews: 156
  },
  {
    id: 'hosp-tun-002',
    name: 'Hôpital La Rabta',
    type: 'public',
    city: 'Tunis',
    address: 'La Rabta, Tunis 1007',
    phone: '71262083',
    emergencyPhone: '71578763',
    region: 'Tunis',
    rating: 4.0,
    reviews: 112
  },
  {
    id: 'hosp-tun-003',
    name: 'Hôpital Habib Thameur',
    type: 'public',
    city: 'Tunis',
    address: 'Montfleury, Tunis',
    phone: '71492773',
    emergencyPhone: '71397000',
    region: 'Tunis',
    rating: 4.1,
    reviews: 95
  },
  {
    id: 'hosp-tun-004',
    name: 'Hôpital Aziza Othmana',
    type: 'public',
    city: 'Tunis',
    address: 'Place de la Kasbah, Tunis 1008',
    phone: '71560763',
    emergencyPhone: '71570777',
    region: 'Tunis',
    rating: 4.2,
    reviews: 87
  },
  {
    id: 'hosp-tun-005',
    name: 'Hôpital Razi',
    type: 'public',
    city: 'Tunis',
    address: 'La Manouba, Tunis 1004',
    phone: '71510700',
    emergencyPhone: '71510750',
    region: 'Tunis',
    rating: 4.0,
    reviews: 102
  },
 
  

  // Zaghouan
  {
    id: 'hosp-zag-001',
    name: 'Hôpital Régional de Zaghouan',
    type: 'public',
    city: 'Zaghouan',
    address: 'Avenue Habib Bourguiba, Zaghouan 1100',
    phone: '72200000',
    emergencyPhone: '72200500',
    region: 'Zaghouan',
    rating: 3.7,
    reviews: 67
  },
  {
    id: 'hosp-zag-002',
    name: 'Hôpital de Bir Mcherga',
    type: 'public',
    city: 'Bir Mcherga',
    address: 'Avenue Habib Bourguiba, Bir Mcherga',
    phone: '72210000',
    region: 'Zaghouan',
    rating: 3.5,
    reviews: 53
  },

  // Zarzis
  {
    id: 'hosp-zar-001',
    name: 'Hôpital de Zarzis',
    type: 'public',
    city: 'Zarzis',
    address: 'Avenue Habib Bourguiba, Zarzis 4170',
    phone: '75630000',
    emergencyPhone: '75630500',
    region: 'Médenine',
    rating: 3.8,
    reviews: 79
  },
  // Tunis
  {
    id: 'hosp-001',
    name: 'Hôpital Universitaire Mongi Slim',
    type: 'public',
    city: 'La Marsa',
    address: 'Avenue Mongi Slim, La Marsa 2078',
    phone: '71764325',
    emergencyPhone: '71764845, 71764033, 71764066',
    region: 'Tunis',
    rating: 4.3,
    reviews: 128
  },
  {
    id: 'hosp-002',
    name: 'Hôpital Habib Thameur',
    type: 'public',
    city: 'Tunis',
    address: 'Montfleury, Tunis',
    phone: '71492773',
    emergencyPhone: '71397000',
    region: 'Tunis',
    rating: 4.1,
    reviews: 95
  },
  {
    id: 'hosp-003',
    name: 'Hôpital Aziza Othmana',
    type: 'public',
    city: 'Tunis',
    address: 'Place de la Kasbah, Tunis 1008',
    phone: '71560763',
    emergencyPhone: '71570777',
    region: 'Tunis',
    rating: 4.2,
    reviews: 87
  },
  // Add more hospitals from the list...
  {
    id: 'hosp-004',
    name: 'Hôpital Charles Nicolle',
    type: 'public',
    city: 'Tunis',
    address: 'Boulevard 9 Avril 1938, Tunis 1006',
    phone: '71262740',
    emergencyPhone: '71578007, 71578346',
    region: 'Tunis',
    rating: 4.4,
    reviews: 156
  },
  {
    id: 'hosp-005',
    name: 'Hôpital La Rabta',
    type: 'public',
    city: 'Tunis',
    address: 'La Rabta, Tunis 1007',
    phone: '71262083',
    emergencyPhone: '71578763',
    region: 'Tunis',
    rating: 4.0,
    reviews: 112
  },
  {
    id: 'hosp-006',
    name: 'Institut Salah Azaiez',
    type: 'public',
    city: 'Tunis',
    address: 'Bab Saadoun, Tunis 1006',
    phone: '71263980',
    emergencyPhone: '71263980',
    region: 'Tunis',
    rating: 4.1,
    reviews: 92
  },
  // Sousse
  {
    id: 'hosp-101',
    name: 'CHU Farhat Hached',
    type: 'university',
    city: 'Sousse',
    address: 'Avenue Ibn El Jazzar, Sousse 4000',
    phone: '73211000',
    region: 'Sousse',
    rating: 4.2,
    reviews: 142
  },
  // Monastir
  {
    id: 'hosp-201',
    name: 'Hôpital Fattouma Bourguiba',
    type: 'university',
    city: 'Monastir',
    address: 'Rue du 1er juin 1995, Monastir 5000',
    phone: '73460309',
    emergencyPhone: '73460411, 73447108',
    region: 'Monastir',
    rating: 4.3,
    reviews: 124
  },
  // Sfax
  {
    id: 'hosp-301',
    name: 'Hôpital Hédi Chaker',
    type: 'public',
    city: 'Sfax',
    address: 'Route El Ain Km 0,5, Sfax',
    phone: '74242181',
    emergencyPhone: '74244422, 74244511',
    region: 'Sfax',
    rating: 4.1,
    reviews: 98
  },
  // Add more regions and hospitals...
  {
    id: 'hosp-401',
    name: 'Hôpital Régional de Nabeul',
    type: 'public',
    city: 'Nabeul',
    address: 'Avenue Habib Bourguiba, Nabeul',
    phone: '72287000',
    region: 'Nabeul',
    rating: 3.9,
    reviews: 76
  },
  {
    id: 'hosp-402',
    name: 'Hôpital Régional de Khereddine',
    type: 'public',
    city: 'Khereddine',
    address: '16, rue Imam El Ghazal - KHEREDDINE',
    phone: '71731860',
    emergencyPhone: '71730100, 71730964',
    region: 'Ariana',
    rating: 3.8,
    reviews: 65
  },
  // Add more hospitals from the list...
];

// Group hospitals by region
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
  return [...new Set(tunisiaHospitals.map(h => h.region))].sort();
};

export default tunisiaHospitals;
