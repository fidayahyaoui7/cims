export const tunisiaRegions = [
  // Tunis Region
  {
    id: 'tunis',
    name: 'Tunis',
    hospitals: [
      {
        id: 'mongi-slim',
        name: 'Hôpital Universitaire Mongi Slim',
        address: 'Avenue Mongi Slim, La Marsa 2078',
        city: 'La Marsa',
        phone: '71764325',
        emergencyPhone: '71764845, 71764033, 71764066',
        type: 'university',
        beds: 128,
        coordinates: { lat: 36.8865, lng: 10.3216 },
        services: [
          'Radiographie (X-ray)',
          'Scanner (CT)',
          'IRM',
          'Échographie',
          'Mammographie'
        ]
      },
      {
        id: 'habib-thameur',
        name: 'Hôpital Habib Thameur',
        address: 'Montfleury',
        city: 'Tunis',
        phone: '71492773',
        emergencyPhone: '71397000',
        type: 'public',
        beds: 95,
        coordinates: { lat: 36.8065, lng: 10.1815 },
        services: [
          'Radiographie (X-ray)',
          'Scanner (CT)',
          'Échographie',
          'Mammographie'
        ]
      },
      {
        id: 'charles-nicolle',
        name: 'Hôpital Charles Nicolle',
        address: 'Boulevard du 9 Avril 1938',
        city: 'Tunis',
        phone: '71578000',
        emergencyPhone: '71578500',
        type: 'university',
        beds: 850,
        coordinates: { lat: 36.8165, lng: 10.1915 },
        services: [
          'Radiographie (X-ray)',
          'Scanner (CT)',
          'IRM',
          'Échographie',
          'Radiologie interventionnelle'
        ]
      },
      {
        id: 'aziza-othmana',
        name: 'Hôpital Aziza Othmana',
        address: 'Place de la Kasbah',
        city: 'Tunis',
        phone: '71334000',
        type: 'public',
        beds: 320,
        coordinates: { lat: 36.7965, lng: 10.1715 },
        services: [
          'Radiographie (X-ray)',
          'Scanner (CT)',
          'Échographie'
        ]
      },
      {
        id: 'la-rabta',
        name: 'Hôpital La Rabta',
        address: 'Jabbari',
        city: 'Tunis',
        phone: '71578000',
        type: 'public',
        beds: 420,
        coordinates: { lat: 36.8265, lng: 10.1615 },
        services: [
          'Radiographie (X-ray)',
          'Scanner (CT)',
          'IRM',
          'Échographie',
          'Mammographie',
          'Radiologie interventionnelle'
        ]
      },
      {
        id: 'salah-azaiez',
        name: 'Institut Salah Azaiez',
        address: 'Bab Saadoun',
        city: 'Tunis',
        phone: '71560000',
        type: 'specialized',
        beds: 150,
        coordinates: { lat: 36.8165, lng: 10.1515 },
        services: [
          'Radiographie (X-ray)',
          'Scanner (CT)',
          'IRM',
          'Échographie',
          'Mammographie',
          'PET-CT'
        ]
      }
    ]
  },
  
  // Sousse Region
  {
    id: 'sousse',
    name: 'Sousse',
    hospitals: [
      {
        id: 'farhat-hached',
        name: 'CHU Farhat Hached',
        address: 'Avenue Ibn El Jazzar',
        city: 'Sousse',
        phone: '73211000',
        emergencyPhone: '73211500',
        type: 'university',
        beds: 650,
        coordinates: { lat: 35.8333, lng: 10.6167 },
        services: [
          'Radiographie (X-ray)',
          'Scanner (CT)',
          'IRM',
          'Échographie',
          'Radiologie interventionnelle'
        ]
      },
      {
        id: 'sahloul',
        name: 'Hôpital Universitaire Sahloul',
        address: 'Route Ceinture, Sahloul',
        city: 'Sousse',
        phone: '73224000',
        emergencyPhone: '73224500',
        type: 'university',
        beds: 580,
        coordinates: { lat: 35.8500, lng: 10.6000 },
        services: [
          'Radiographie (X-ray)',
          'Scanner (CT)',
          'IRM',
          'Échographie',
          'Mammographie',
          'Radiologie interventionnelle'
        ]
      },
      {
        id: 'sousse-regional',
        name: 'Hôpital Régional de Sousse',
        address: 'Avenue 7 Novembre',
        city: 'Sousse',
        phone: '73220000',
        type: 'public',
        beds: 320,
        coordinates: { lat: 35.8400, lng: 10.6300 },
        services: [
          'Radiographie (X-ray)',
          'Scanner (CT)',
          'Échographie'
        ]
      }
    ]
  },
  
  // Monastir Region
  {
    id: 'monastir',
    name: 'Monastir',
    hospitals: [
      {
        id: 'fattouma-bourguiba',
        name: 'Hôpital Universitaire Fattouba Bourguiba',
        address: 'Route de Skanes',
        city: 'Monastir',
        phone: '73460000',
        emergencyPhone: '73460500',
        type: 'university',
        beds: 720,
        coordinates: { lat: 35.7833, lng: 10.8333 }
      }
    ]
  },
  
  // Sfax Region
  {
    id: 'sfax',
    name: 'Sfax',
    hospitals: [
      {
        id: 'hedi-chaker',
        name: 'Hôpital Universitaire Hédi Chaker',
        address: 'Route El Ain Km 0.5',
        city: 'Sfax',
        phone: '74244000',
        emergencyPhone: '74244500',
        type: 'university',
        beds: 680,
        coordinates: { lat: 34.7500, lng: 10.7167 }
      },
      {
        id: 'habib-bourguiba',
        name: 'Hôpital Habib Bourguiba',
        address: 'Route El Ain',
        city: 'Sfax',
        phone: '74240000',
        type: 'public',
        beds: 450,
        coordinates: { lat: 34.7600, lng: 10.7000 }
      }
    ]
  },
  
  // Nabeul Region
  {
    id: 'nabeul',
    name: 'Nabeul',
    hospitals: [
      {
        id: 'nabeul-regional',
        name: 'Hôpital Régional de Nabeul',
        address: 'Avenue Habib Bourguiba',
        city: 'Nabeul',
        phone: '72280000',
        type: 'public',
        beds: 320,
        coordinates: { lat: 36.4500, lng: 10.7333 }
      },
      {
        id: 'maamouri',
        name: 'Hôpital Régional Mohamed Tahar Maamouri',
        address: 'Rue des Oranges',
        city: 'Nabeul',
        phone: '72285000',
        type: 'public',
        beds: 280,
        coordinates: { lat: 36.4400, lng: 10.7200 }
      }
    ]
  },
  
  // Bizerte Region
  {
    id: 'bizerte',
    name: 'Bizerte',
    hospitals: [
      {
        id: 'khereddine',
        name: 'Hôpital Régional de Khereddine',
        address: 'Route de Tunis',
        city: 'Bizerte',
        phone: '72430000',
        type: 'public',
        beds: 380,
        coordinates: { lat: 37.2833, lng: 9.8667 }
      },
      {
        id: 'bougatfa',
        name: 'Hôpital Régional Habib Bougatfa',
        address: 'Menzel Bourguiba',
        city: 'Bizerte',
        phone: '72420000',
        type: 'public',
        beds: 250,
        coordinates: { lat: 37.1500, lng: 9.7833 }
      }
    ]
  },
  
  // Jendouba Region
  {
    id: 'jendouba',
    name: 'Jendouba',
    hospitals: [
      {
        id: 'jendouba-regional',
        name: 'Hôpital Régional de Jendouba',
        address: 'Avenue Habib Bourguiba',
        city: 'Jendouba',
        phone: '78460000',
        type: 'public',
        beds: 280,
        coordinates: { lat: 36.5000, lng: 8.7833 }
      }
    ]
  },
  
  // Kairouan Region
  {
    id: 'kairouan',
    name: 'Kairouan',
    hospitals: [
      {
        id: 'ibn-el-jazzar',
        name: 'Hôpital Universitaire Ibn El Jazzar',
        address: 'Route de Kairouan',
        city: 'Kairouan',
        phone: '77220000',
        type: 'university',
        beds: 420,
        coordinates: { lat: 35.6833, lng: 10.1000 }
      }
    ]
  },
  
  // Kasserine Region
  {
    id: 'kasserine',
    name: 'Kasserine',
    hospitals: [
      {
        id: 'kasserine-regional',
        name: 'Hôpital Régional de Kasserine',
        address: 'Avenue de l\'Indépendance',
        city: 'Kasserine',
        phone: '77200000',
        type: 'public',
        beds: 240
      }
    ]
  },
  
  // Gabès Region
  {
    id: 'gabes',
    name: 'Gabès',
    hospitals: [
      {
        id: 'gabes-regional',
        name: 'Hôpital Régional de Gabès',
        address: 'Route de Matmata',
        city: 'Gabès',
        phone: '75273000',
        type: 'public',
        beds: 360
      }
    ]
  },
  
  // Gafsa Region
  {
    id: 'gafsa',
    name: 'Gafsa',
    hospitals: [
      {
        id: 'gafsa-regional',
        name: 'Hôpital Régional de Gafsa',
        address: 'Route de Kasserine',
        city: 'Gafsa',
        phone: '76220000',
        type: 'public',
        beds: 310
      }
    ]
  },
  
  // Kébili Region
  {
    id: 'kebili',
    name: 'Kébili',
    hospitals: [
      {
        id: 'kebili-regional',
        name: 'Hôpital Régional de Kébili',
        address: 'Avenue Habib Bourguiba',
        city: 'Kébili',
        phone: '75600000',
        type: 'public',
        beds: 180
      }
    ]
  },
  
  // Le Kef Region
  {
    id: 'lekef',
    name: 'Le Kef',
    hospitals: [
      {
        id: 'lekef-regional',
        name: 'Hôpital Régional du Kef',
        address: 'Avenue Habib Bourguiba',
        city: 'Le Kef',
        phone: '78200000',
        type: 'public',
        beds: 260
      }
    ]
  },
  
  // Mahdia Region
  {
    id: 'mahdia',
    name: 'Mahdia',
    hospitals: [
      {
        id: 'tahar-sfar',
        name: 'Hôpital Régional Tahar Sfar',
        address: 'Route de Rejiche',
        city: 'Mahdia',
        phone: '73300000',
        type: 'public',
        beds: 320
      },
      {
        id: 'ksouressaf',
        name: 'Hôpital Régional de Ksour Essaf',
        address: 'Ksour Essaf',
        city: 'Mahdia',
        phone: '73310000',
        type: 'public',
        beds: 150
      }
    ]
  },
  
  // Médenine Region
  {
    id: 'medenine',
    name: 'Médenine',
    hospitals: [
      {
        id: 'medenine-regional',
        name: 'Hôpital Régional de Médenine',
        address: 'Route de Tataouine',
        city: 'Médenine',
        phone: '75600000',
        type: 'public',
        beds: 340
      },
      {
        id: 'djerba',
        name: 'Hôpital de Djerba',
        address: 'Zone Touristique',
        city: 'Houmt Souk',
        phone: '75634000',
        type: 'public',
        beds: 280
      },
      {
        id: 'zarzis',
        name: 'Hôpital Régional de Zarzis',
        address: 'Route de la Plage',
        city: 'Zarzis',
        phone: '75640000',
        type: 'public',
        beds: 220
      },
      {
        id: 'ben-guerdane',
        name: 'Hôpital Régional de Ben Guerdane',
        address: 'Avenue de la République',
        city: 'Ben Guerdane',
        phone: '75680000',
        type: 'public',
        beds: 180
      }
    ]
  },
  
  // Sidi Bouzid Region
  {
    id: 'sidi-bouzid',
    name: 'Sidi Bouzid',
    hospitals: [
      {
        id: 'sidi-bouzid-regional',
        name: 'Hôpital Régional de Sidi Bouzid',
        address: 'Avenue Habib Bourguiba',
        city: 'Sidi Bouzid',
        phone: '76200000',
        type: 'public',
        beds: 230
      }
    ]
  },
  
  // Siliana Region
  {
    id: 'siliana',
    name: 'Siliana',
    hospitals: [
      {
        id: 'siliana-regional',
        name: 'Hôpital Régional de Siliana',
        address: 'Avenue Habib Bourguiba',
        city: 'Siliana',
        phone: '78200000',
        type: 'public',
        beds: 210
      }
    ]
  },
  
  // Tataouine Region
  {
    id: 'tataouine',
    name: 'Tataouine',
    hospitals: [
      {
        id: 'tataouine-regional',
        name: 'Hôpital Régional de Tataouine',
        address: 'Avenue Habib Bourguiba',
        city: 'Tataouine',
        phone: '75600000',
        type: 'public',
        beds: 190
      }
    ]
  },
  
  // Tozeur Region
  {
    id: 'tozeur',
    name: 'Tozeur',
    hospitals: [
      {
        id: 'tozeur-regional',
        name: 'Hôpital Régional de Tozeur',
        address: 'Route de Nefta',
        city: 'Tozeur',
        phone: '76400000',
        type: 'public',
        beds: 200
      }
    ]
  },
  
  // Zaghouan Region
  {
    id: 'zaghouan',
    name: 'Zaghouan',
    hospitals: [
      {
        id: 'zaghouan-regional',
        name: 'Hôpital Régional de Zaghouan',
        address: 'Avenue Habib Bourguiba',
        city: 'Zaghouan',
        phone: '72700000',
        type: 'public',
        beds: 180
      }
    ]
  },
  
  // Ben Arous Region
  {
    id: 'ben-arous',
    name: 'Ben Arous',
    hospitals: [
      {
        id: 'ben-arous-regional',
        name: 'Hôpital Régional de Ben Arous',
        address: 'Route de Tunis',
        city: 'Ben Arous',
        phone: '79382000',
        type: 'public',
        beds: 290
      }
    ]
  },
  
  // Ariana Region
  {
    id: 'ariana',
    name: 'Ariana',
    hospitals: [
      {
        id: 'abderrahmen-mami',
        name: 'Hôpital Abderrahmen Mami',
        address: 'Ariana Ville',
        city: 'Ariana',
        phone: '71706000',
        type: 'public',
        beds: 350
      }
    ]
  },
  
  // Manouba Region
  {
    id: 'manouba',
    name: 'Manouba',
    hospitals: [
      {
        id: 'manouba-regional',
        name: 'Hôpital Régional de la Manouba',
        address: 'Avenue de l\'Indépendance',
        city: 'La Manouba',
        phone: '71715000',
        type: 'public',
        beds: 280
      }
    ]
  },
  
  // Béja Region
  {
    id: 'beja',
    name: 'Béja',
    hospitals: [
      {
        id: 'beja-regional',
        name: 'Hôpital Régional de Béja',
        address: 'Avenue Habib Bourguiba',
        city: 'Béja',
        phone: '78460222',
        type: 'public',
        beds: 310
      },
      {
        id: 'medjez-el-bab',
        name: 'Hôpital Régional de Medjez El Bab',
        address: 'Avenue de l\'Hôpital',
        city: 'Medjez El Bab',
        phone: '78430000',
        type: 'public',
        beds: 180
      }
    ]
  }
];

export const getHospitalsByRegion = (regionId) => {
  const region = tunisiaRegions.find(r => r.id === regionId);
  return region ? region.hospitals : [];
};

export const getHospitalById = (hospitalId) => {
  for (const region of tunisiaRegions) {
    const hospital = region.hospitals.find(h => h.id === hospitalId);
    if (hospital) return hospital;
  }
  return null;
};
