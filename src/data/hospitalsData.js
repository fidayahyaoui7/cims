/**
 * Consolidated list of Tunisian hospitals and medical centers
 * Organized by type and city for better maintainability
 */

// Helper functions for generating consistent data
const generateOperatingHours = (type) => {
  switch(type) {
    case 'public':
      return {
        monday: { open: '08:00', close: '18:00' },
        tuesday: { open: '08:00', close: '18:00' },
        wednesday: { open: '08:00', close: '18:00' },
        thursday: { open: '08:00', close: '18:00' },
        friday: { open: '08:00', close: '13:00' },
        saturday: { open: '09:00', close: '13:00' },
        sunday: { open: 'Closed', close: 'Closed' },
        emergency: { open: '00:00', close: '24:00' },
        description: 'Standard public hospital hours with 24/7 emergency services.'
      };
    case 'university':
      return {
        monday: { open: '08:00', close: '17:00' },
        tuesday: { open: '08:00', close: '17:00' },
        wednesday: { open: '08:00', close: '17:00' },
        thursday: { open: '08:00', close: '17:00' },
        friday: { open: '08:00', close: '13:00' },
        saturday: { open: '09:00', close: '13:00' },
        sunday: { open: 'Closed', close: 'Closed' },
        emergency: { open: '00:00', close: '24:00' },
        description: 'Teaching hospital hours with 24/7 emergency coverage and specialized academic services.'
      };
    case 'private':
      return {
        monday: { open: '08:00', close: '20:00' },
        tuesday: { open: '08:00', close: '20:00' },
        wednesday: { open: '08:00', close: '20:00' },
        thursday: { open: '08:00', close: '20:00' },
        friday: { open: '08:00', close: '20:00' },
        saturday: { open: '09:00', close: '18:00' },
        sunday: { open: '09:00', close: '13:00' },
        emergency: { open: '08:00', close: '22:00' },
        description: 'Extended hours for private healthcare services with emergency coverage until 10 PM.'
      };
    default:
      return {
        monday: { open: '08:00', close: '17:00' },
        tuesday: { open: '08:00', close: '17:00' },
        wednesday: { open: '08:00', close: '17:00' },
        thursday: { open: '08:00', close: '17:00' },
        friday: { open: '08:00', close: '13:00' },
        saturday: { open: 'Closed', close: 'Closed' },
        sunday: { open: 'Closed', close: 'Closed' },
        emergency: { open: '08:00', close: '20:00' },
        description: 'Standard operating hours for this healthcare facility.'
      };
  }
};

const generateFeatures = (type) => {
  const baseFeatures = ['Parking', 'Wheelchair Access', 'Pharmacy'];
  
  if (type === 'university') {
    return [...baseFeatures, 'Teaching Hospital', 'Research Facilities'];
  }
  
  return baseFeatures;
};

const generateDoctors = (specialties, count = 2) => {
  const doctors = [];
  const firstNames = ['Mohamed', 'Ahmed', 'Ali', 'Fatma', 'Amira', 'Salah', 'Nadia', 'Karim'];
  const lastNames = ['Ben Ammar', 'Trabelsi', 'Ben Ali', 'Gharsallah', 'Karray', 'Bouzayen', 'Masmoudi', 'Haddad'];
  
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const specialty = specialties[Math.floor(Math.random() * specialties.length)];
    
    doctors.push({
      name: `Dr. ${firstName} ${lastName}`,
      specialty: specialty,
      qualifications: 'MD',
      image: `https://randomuser.me/api/portraits/med/${i % 2 === 0 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`,
      available: Math.random() > 0.3, // 70% chance of being available
      languages: ['Arabic', 'French']
    });
  }
  
  return doctors;
};

const hospitalsData = [
  // Public Hospitals
  {
    id: 'pub-001',
    name: 'Hôpital Universitaire Mongi Slim',
    type: 'public',
    city: 'La Marsa',
    address: 'Avenue Mongi Slim, La Marsa 2078',
    phone: '71764325',
    emergencyPhone: '71764845, 71764033, 71764066',
    services: ['Radiographie (X-ray)', 'Scanner (CT)', 'IRM', 'Échographie', 'Mammographie'],
    coordinates: { lat: 36.8765, lng: 10.3256 },
    description: 'Hôpital universitaire spécialisé en traumatologie et grands brûlés, disposant d\'un service de radiologie médicale.',
    rating: 4.3,
    reviews: 128,
    openNow: true,
    emergency: true,
    image: 'https://via.placeholder.com/400x250?text=Hôpital+Mongi+Slim',
    city_id: 'tunis'
  },
  {
    id: 'pub-002',
    name: 'Hôpital Habib Thameur',
    type: 'public',
    city: 'Tunis',
    address: 'Montfleury, Tunis',
    phone: '71492773',
    emergencyPhone: '71397000',
    website: 'hopitalhabibthameur.tn',
    services: ['Radiographie (X-ray)', 'Scanner (CT)', 'Échographie', 'Mammographie'],
    coordinates: { lat: 36.8105, lng: 10.1812 },
    description: 'Établissement public offrant divers services médicaux, dont l\'imagerie médicale.',
    rating: 4.1,
    reviews: 95,
    openNow: true,
    emergency: true,
    image: 'https://via.placeholder.com/400x250?text=Hôpital+Habib+Thameur'
  },
  {
    id: 'pub-003',
    name: 'Hôpital Aziza Othmana',
    type: 'public',
    city: 'Tunis',
    address: 'Place de la Kasbah, Tunis 1008',
    phone: '71560763',
    emergencyPhone: '71570777',
    services: ['Radiographie (X-ray)', 'Scanner (CT)', 'Échographie'],
    coordinates: { lat: 36.7975, lng: 10.1717 },
    description: 'Hôpital historique fondé en 1662, offrant une gamme de services médicaux, y compris l\'imagerie médicale.',
    rating: 4.0,
    reviews: 87,
    openNow: true,
    emergency: true,
    image: 'https://via.placeholder.com/400x250?text=Hôpital+Aziza+Othmana'
  },
  {
    id: 'pub-004',
    name: 'Hôpital Charles Nicolle',
    type: 'public',
    city: 'Tunis',
    address: 'Boulevard 9 Avril 1938, Tunis 1006',
    phone: '71262740',
    emergencyPhone: '71578007, 71578346',
    website: 'chucharlesnicolle.tn',
    services: ['Radiographie (X-ray)', 'Scanner (CT)', 'IRM', 'Échographie', 'Radiologie interventionnelle'],
    coordinates: { lat: 36.8065, lng: 10.1815 },
    description: 'Centre hospitalier universitaire de référence, disposant d\'un service d\'imagerie médicale avec des horaires de garde.',
    rating: 4.2,
    reviews: 156,
    openNow: true,
    emergency: true,
    image: 'https://via.placeholder.com/400x250?text=Hôpital+Charles+Nicolle'
  },
  {
    id: 'pub-005',
    name: 'Hôpital La Rabta',
    type: 'public',
    city: 'Tunis',
    address: 'La Rabta, Tunis 1007',
    phone: '71262083',
    emergencyPhone: '71578763',
    services: ['Radiographie (X-ray)', 'Scanner (CT)', 'IRM', 'Échographie', 'Mammographie', 'Radiologie interventionnelle'],
    coordinates: { lat: 36.8112, lng: 10.1718 },
    description: 'Hôpital universitaire offrant des services d\'imagerie médicale.',
    rating: 4.0,
    reviews: 112,
    openNow: true,
    emergency: true,
    image: 'https://via.placeholder.com/400x250?text=Hôpital+La+Rabta'
  },
  {
    id: 'pub-006',
    name: 'Institut Salah Azaiez',
    type: 'public',
    city: 'Tunis',
    address: 'Bab Saadoun, Tunis 1006',
    phone: '71263980',
    emergencyPhone: '71263980',
    website: 'institutsalahazaiez.com',
    services: ['Radiographie (X-ray)', 'Scanner (CT)', 'IRM', 'Échographie', 'Mammographie', 'PET-CT'],
    coordinates: { lat: 36.8055, lng: 10.1614 },
    description: 'Institut spécialisé en oncologie, proposant des services d\'imagerie médicale, y compris la scintigraphie osseuse et rénale.',
    rating: 4.4,
    reviews: 92,
    openNow: true,
    emergency: true,
    image: 'https://via.placeholder.com/400x250?text=Institut+Salah+Azaiez'
  },
  {
    id: 'pub-007',
    name: 'Institut Hédi Raies d\'Ophtalmologie',
    type: 'public',
    city: 'Tunis',
    address: 'Boulevard 9 Avril 1938, Tunis 1006',
    phone: '71263701',
    emergencyPhone: '71577922',
    services: ['Radiographie (ophtalmo)', 'Échographie (oculaire)'],
    coordinates: { lat: 36.8065, lng: 10.1815 },
    description: 'Spécialisé en ophtalmologie, cet institut dispose de services d\'imagerie médicale adaptés aux pathologies oculaires.',
    rating: 4.3,
    reviews: 78,
    openNow: true,
    emergency: true,
    image: 'https://via.placeholder.com/400x250?text=Institut+Hédi+Raies'
  },
  {
    id: 'pub-008',
    name: 'Institut National de Neurologie',
    type: 'public',
    city: 'Tunis',
    address: 'La Rabta, Tunis 1007',
    phone: '71572053',
    emergencyPhone: '71572693, 71578603',
    services: ['Radiographie (X-ray)', 'Scanner (CT)', 'IRM', 'Échographie (Doppler)'],
    coordinates: { lat: 36.8112, lng: 10.1718 },
    description: 'Établissement de référence en neurologie, proposant des services de neuro-imagerie.',
    rating: 4.5,
    reviews: 104,
    openNow: true,
    emergency: true,
    image: 'https://via.placeholder.com/400x250?text=Institut+National+de+Neurologie'
  },
  
  // University Hospitals
  {
    id: 'uni-001',
    name: 'CHU Farhat Hached',
    type: 'university',
    city: 'Sousse',
    address: 'Avenue Ibn El Jazzar, Sousse 4000',
    phone: '73211000',
    services: ['Radiographie (X-ray)', 'Scanner (CT)', 'IRM', 'Échographie', 'Radiologie interventionnelle'],
    coordinates: { lat: 35.8293, lng: 10.6404 },
    description: 'Centre Hospitalier Universitaire offrant des soins médicaux complets avec un service d\'imagerie médicale moderne.',
    rating: 4.3,
    reviews: 142,
    openNow: true,
    emergency: true,
    image: 'https://via.placeholder.com/400x250?text=CHU+Farhat+Hached'
  },
  {
    id: 'pub-010',
    name: 'Hôpital Farhat Hached Sousse',
    type: 'public',
    city: 'Sousse',
    address: 'Avenue Ibn El Jazzar, Sousse 4000',
    phone: '73222293',
    emergencyPhone: '73221425, 73223311',
    services: ['Radiographie (X-ray)', 'Scanner (CT)', 'Échographie'],
    coordinates: { lat: 35.8254, lng: 10.6086 },
    description: 'Centre hospitalier universitaire disposant de services d\'imagerie médicale.',
    rating: 4.1,
    reviews: 107,
    openNow: true,
    emergency: true,
    image: 'https://via.placeholder.com/400x250?text=Hôpital+Farhat+Hached'
  },
  {
    id: 'pub-011',
    name: 'Hôpital Fattouma Bourguiba',
    type: 'public',
    city: 'Monastir',
    address: 'Rue du 1er juin 1995, Monastir 5000',
    phone: '73460309',
    emergencyPhone: '73460411, 73447108',
    services: ['Radiographie (X-ray)', 'Scanner (CT)', 'IRM', 'Échographie', 'Mammographie'],
    coordinates: { lat: 35.7688, lng: 10.8111 },
    description: 'Hôpital universitaire offrant des services d\'imagerie médicale de pointe.',
    rating: 4.3,
    reviews: 124,
    openNow: true,
    emergency: true,
    image: 'https://via.placeholder.com/400x250?text=Hôpital+Fattouma+Bourguiba'
  },
  {
    id: 'pub-012',
    name: 'Hôpital Hédi Chaker',
    type: 'public',
    city: 'Sfax',
    address: 'Route El Ain Km 0,5, Sfax',
    phone: '74242181',
    emergencyPhone: '74244422, 74244511',
    services: ['Radiographie (X-ray)', 'Scanner (CT)', 'IRM', 'Échographie'],
    coordinates: { lat: 34.7507, lng: 10.7663 },
    description: 'Hôpital régional disposant de services d\'imagerie médicale complète.',
    rating: 4.0,
    reviews: 98,
    openNow: true,
    emergency: true,
    image: 'https://via.placeholder.com/400x250?text=Hôpital+Hédi+Chaker'
  },
  {
    id: 'pub-013',
    name: 'Hôpital Habib Bourguiba',
    type: 'public',
    city: 'Sfax',
    address: 'Avenue El Ferdaouss, Sfax 3029',
    phone: '74242333',
    emergencyPhone: '74241511, 74241500',
    services: ['Radiographie (X-ray)', 'Scanner (CT)', 'IRM', 'Échographie', 'Radiologie interventionnelle'],
    coordinates: { lat: 34.7406, lng: 10.7603 },
    description: 'Centre hospitalier universitaire offrant des services d\'imagerie médicale avancée.',
    rating: 4.2,
    reviews: 115,
    openNow: true,
    emergency: true,
    image: 'https://via.placeholder.com/400x250?text=Hôpital+Habib+Bourguiba'
  },
  {
    id: 'pub-014',
    name: 'Complexe Sanitaire Djebel Ouest',
    type: 'public',
    city: 'Zaghouan',
    address: 'Route Zaghouane, Djebel Ouest 1111',
    phone: '72640477',
    services: ['Radiographie (X-ray)', 'Échographie'],
    coordinates: { lat: 36.4095, lng: 9.9504 },
    description: 'Établissement de santé offrant des services d\'imagerie médicale et des soins de santé généraux.',
    rating: 3.9,
    reviews: 65,
    openNow: true,
    emergency: true,
    image: 'https://via.placeholder.com/400x250?text=Complexe+Sanitaire+Djebel+Ouest'
  },
  
  // University Hospitals
  {
    id: 'uni-001',
    name: 'CHU Sahloul',
    type: 'university',
    city: 'Sousse',
    address: 'Route Ceinture, Sahloul, Sousse',
    phone: '73211000',
    website: 'chusahloul.rns.tn',
    services: ['Radiographie (X-ray)', 'Scanner (CT)', 'IRM', 'Échographie', 'Mammographie', 'Radiologie interventionnelle'],
    coordinates: { lat: 35.8245, lng: 10.6346 },
    description: 'Major university hospital in Sousse with comprehensive medical services.',
    rating: 4.0,
    reviews: 120,
    openNow: true,
    openingHours: '24/7',
    image: 'https://via.placeholder.com/400x250?text=CHU+Sahloul'
  },
  
 
  
  // Medical Imaging Centers
  {
    id: 'img-001',
    name: 'Centre d\'Imagerie Médicale Ibn El Jazzar',
    type: 'imaging',
    city: 'Sousse',
    address: 'Avenue Yasser Arafat, Sousse',
    phone: '73230000',
    services: ['Radiographie (X-ray)', 'Scanner (CT)', 'IRM', 'Échographie', 'Mammographie'],
    coordinates: { lat: 35.8300, lng: 10.6255 },
    description: 'Modern medical imaging center with advanced diagnostic equipment.',
    rating: 4.6,
    reviews: 124,
    openNow: true,
    openingHours: '08:00 - 20:00',
    image: 'https://via.placeholder.com/400x250?text=Centre+Imagerie+Ibn+El+Jazzar'
  },
  
  // Regional Hospitals
  {
    id: 'reg-001',
    name: 'Hôpital Régional de Nabeul',
    type: 'public',
    city: 'Nabeul',
    address: 'Avenue Habib Bourguiba, Nabeul',
    phone: '72287000',
    services: ['Radiographie (X-ray)', 'Scanner (CT)', 'Échographie'],
    coordinates: { lat: 36.4561, lng: 10.7376 },
    description: 'Main public hospital in the Nabeul governorate.',
    rating: 3.9,
    reviews: 76,
    openNow: true,
    openingHours: '24/7',
    image: 'https://via.placeholder.com/400x250?text=Hôpital+Régional+Nabeul'
  }
  ,
  // Additional Regional Hospitals (added)
  {
    id: 'reg-002',
    name: 'Hôpital Régional de Khereddine',
    type: 'public',
    city: 'Khereddine',
    address: '16, rue Imam El Ghazal - KHEREDDINE',
    phone: '+216 71 731 860',
    fax: '+216 71 734 864',
    emergencyPhone: '71 730 100 / 71 730 964',
    services: ['Radiographie (X-ray)', 'Échographie'],
    description: "Hôpital régional assurant les urgences et les soins de base.",
    openNow: true,
    emergency: true
  },
  {
    id: 'reg-003',
    name: 'Hôpital Régional Habib Bougatfa (Menzel Bourguiba)',
    type: 'public',
    city: 'Menzel Bourguiba',
    address: 'Menzel Bourguiba, Bizerte',
    phone: '+216 72 460 284',
    fax: '+216 72 464 411',
    emergencyPhone: '72 460 455 / 014 / 690 / 520 / 560',
    services: ['Radiographie (X-ray)', 'Échographie'],
    description: 'Hôpital régional de référence pour le gouvernorat de Bizerte.',
    openNow: true,
    emergency: true
  },
  {
    id: 'reg-004',
    name: 'Hôpital Régional Ahmed Tlételi Nabeul',
    type: 'public',
    city: 'Nabeul',
    address: 'Avenue Habib THAMEUR - Nabeul',
    phone: '+216 72 285 673',
    fax: '+216 72 285 673',
    emergencyPhone: '72 285 633',
    services: ['Radiographie (X-ray)', 'Échographie'],
    description: 'Hôpital régional à Nabeul.',
    openNow: true,
    emergency: true
  },
  {
    id: 'reg-005',
    name: 'Hôpital Régional Mohamed Tahar Maamouri Nabeul',
    type: 'public',
    city: 'Nabeul',
    address: 'El Mrezka - Nabeul',
    phone: '+216 72 285 673',
    fax: '+216 72 285 673',
    emergencyPhone: '72 285 022',
    services: ['Radiographie (X-ray)', 'Échographie'],
    description: 'Hôpital régional à El Mrezka - Nabeul.',
    openNow: true,
    emergency: true
  },
  {
    id: 'reg-006',
    name: 'Hôpital Régional de Menzel Temime',
    type: 'public',
    city: 'Menzel Temime',
    address: 'Rue de la Place - Menzel Temime',
    phone: '+216 72 295 000',
    fax: '+216 72 295 001',
    emergencyPhone: '72 295 002',
    services: ['Radiographie (X-ray)', 'Échographie'],
    description: 'Hôpital régional de Menzel Temime.',
    openNow: true,
    emergency: true
  },
  {
    id: 'reg-007',
    name: "Hôpital Régional de Zaghouan",
    type: 'public',
    city: 'Zaghouan',
    address: "Avenue de l'Environnement - Zaghouan",
    phone: '+216 72 674 000',
    fax: '+216 72 674 001',
    emergencyPhone: '72 674 002',
    services: ['Radiographie (X-ray)', 'Échographie'],
    description: 'Hôpital régional de Zaghouan.',
    openNow: true,
    emergency: true
  },
  {
    id: 'reg-008',
    name: 'Hôpital Régional de Jendouba',
    type: 'public',
    city: 'Jendouba',
    address: 'Rue du Grand Maghreb - Jendouba 8100',
    phone: '+216 78 600 000',
    fax: '+216 78 600 001',
    emergencyPhone: '78 600 002',
    services: ['Radiographie (X-ray)', 'Scanner (CT)', 'Échographie'],
    description: 'Hôpital régional de Jendouba.',
    openNow: true,
    emergency: true
  },
  {
    id: 'reg-009',
    name: 'Hôpital Régional de Béja',
    type: 'public',
    city: 'Béja',
    address: '22, Avenue Habib Bourguiba, Béja',
    phone: '+216 78 460 000',
    fax: '+216 78 460 001',
    emergencyPhone: '78 460 002',
    services: ['Radiographie (X-ray)', 'Scanner (CT)', 'Échographie'],
    description: 'Hôpital régional de Béja.',
    openNow: true,
    emergency: true
  },
  {
    id: 'reg-010',
    name: 'Hôpital Régional de Medjez El Bab',
    type: 'public',
    city: 'Medjez El Bab',
    address: 'Medjez El Bab, Béja',
    phone: '+216 78 470 000',
    fax: '+216 78 470 001',
    emergencyPhone: '78 470 002',
    services: ['Radiographie (X-ray)', 'Échographie'],
    description: 'Hôpital régional à Medjez El Bab (Béja).',
    openNow: true,
    emergency: true
  },
  {
    id: 'reg-011',
    name: "Hôpital Régional M'Hamed Bourguiba du Kef",
    type: 'public',
    city: 'Le Kef',
    address: 'Kef 7100',
    phone: '+216 78 200 000',
    fax: '+216 78 200 001',
    emergencyPhone: '78 200 002',
    services: ['Radiographie (X-ray)', 'Scanner (CT)', 'Échographie'],
    description: 'Hôpital régional du Kef.',
    openNow: true,
    emergency: true
  },
  {
    id: 'reg-012',
    name: 'Hôpital Régional de Siliana',
    type: 'public',
    city: 'Siliana',
    address: 'Siliana 6100',
    phone: '+216 78 500 000',
    fax: '+216 78 500 001',
    emergencyPhone: '78 500 002',
    services: ['Radiographie (X-ray)', 'Échographie'],
    description: 'Hôpital régional de Siliana.',
    openNow: true,
    emergency: true
  },
  {
    id: 'reg-013',
    name: 'Hôpital Régional de Kasserine',
    type: 'public',
    city: 'Kasserine',
    address: 'Hôpital régional de Kasserine',
    phone: '+216 77 200 000',
    fax: '+216 77 200 001',
    emergencyPhone: '77 200 002',
    services: ['Radiographie (X-ray)', 'Scanner (CT)', 'Échographie'],
    description: 'Hôpital régional de Kasserine.',
    openNow: true,
    emergency: true
  },
  {
    id: 'reg-014',
    name: 'Hôpital Régional Ibn El Jazzar de Kairouan',
    type: 'public',
    city: 'Kairouan',
    address: 'Rue Ibn El Jazzar - Kairouan 3100',
    phone: '+216 77 227 177',
    fax: '+216 77 229 712',
    emergencyPhone: '77 226 300 / 77 228 333',
    services: ['Radiographie (X-ray)', 'Scanner (CT)', 'IRM', 'Échographie'],
    description: 'Hôpital régional de Kairouan.',
    openNow: true,
    emergency: true
  },
  {
    id: 'reg-015',
    name: "Hôpital Régional 7 Novembre 1987 de M'Saken",
    type: 'public',
    city: "M'Saken",
    address: "M'Saken - 4070",
    phone: '+216 73 280 000',
    fax: '+216 73 280 001',
    emergencyPhone: '73 280 002',
    services: ['Radiographie (X-ray)', 'Échographie'],
    description: "Hôpital régional de M'Saken.",
    openNow: true,
    emergency: true
  },
  {
    id: 'reg-015',
    name: 'Hôpital Régional Tahar Sfar de Mahdia',
    type: 'public',
    city: 'Mahdia',
    address: 'Hôpital Tahar Sfar - Mahdia',
    phone: '+216 73 690 000',
    fax: '+216 73 690 001',
    emergencyPhone: '73 690 002',
    services: ['Radiographie (X-ray)', 'Scanner (CT)', 'Échographie'],
    id: 'reg-016',
    name: 'Hôpital Régional Haj Ali Soua Ksar Hellal',
    type: 'public',
    city: 'Ksar Hellal',
    address: 'Avenue Haj Ali Soua - Ksar Hellal 5070',
    phone: '+216 73 476 054',
    fax: '+216 73 476 054',
    emergencyPhone: '73 476 275 / 73 475 214',
    services: ['Radiographie (X-ray)', 'Échographie'],
    description: 'Hôpital régional de Ksar Hellal.',
    openNow: true,
    emergency: true
  },
  {
    id: 'reg-018',
    name: 'Hôpital Régional de Kerkennah',
    type: 'public',
    city: 'Kerkennah',
    address: 'Kerkennah 3070',
    phone: '+216 74 297 000',
    fax: '+216 74 297 001',
    emergencyPhone: '74 297 002',
    services: ['Radiographie (X-ray)'],
    description: 'Hôpital régional de Kerkennah.',
    openNow: true,
    emergency: true
  },
  {
    id: 'reg-019',
    name: 'Hôpital Régional Houcine Bouzaiene de Gafsa',
    type: 'public',
    city: 'Gafsa',
    address: 'Doualy Gafsa 2100',
    phone: '+216 76 220 000',
    fax: '+216 76 220 001',
    emergencyPhone: '76 220 002',
    services: ['Radiographie (X-ray)', 'Scanner (CT)', 'Échographie'],
    description: 'Hôpital régional de Gafsa.',
    openNow: true,
    emergency: true
  },
  {
    id: 'reg-020',
    name: 'Hôpital Régional de Tozeur',
    type: 'public',
    city: 'Tozeur',
    address: 'Tozeur 2200',
    phone: '+216 76 450 000',
    fax: '+216 76 450 001',
    emergencyPhone: '76 450 002',
    services: ['Radiographie (X-ray)', 'Échographie'],
    description: 'Hôpital régional de Tozeur.',
    openNow: true,
    emergency: true
  },
  {
    id: 'reg-021',
    name: 'Hôpital Régional de Sidi Bouzid',
    type: 'public',
    city: 'Sidi Bouzid',
    address: 'Sidi Bouzid 9100',
    phone: '+216 76 630 000',
    fax: '+216 76 630 001',
    emergencyPhone: '76 630 002',
    services: ['Radiographie (X-ray)', 'Scanner (CT)', 'Échographie'],
    description: 'Hôpital régional de Sidi Bouzid.',
    openNow: true,
    emergency: true
  },
  {
    id: 'reg-022',
    name: 'Hôpital Régional Mohamed Ben Sassi de Gabès',
    type: 'public',
    city: 'Gabès',
    address: 'Mtorrech - Gabès',
    phone: '+216 75 270 000',
    fax: '+216 75 270 001',
    emergencyPhone: '75 270 002',
    services: ['Radiographie (X-ray)', 'Scanner (CT)', 'IRM', 'Échographie'],
    description: 'Hôpital régional de Gabès.',
    openNow: true,
    emergency: true
  },
  {
    id: 'reg-023',
    name: 'Hôpital Régional de Kebili',
    type: 'public',
    city: 'Kebili',
    address: 'Kebili 4200',
    phone: '+216 75 490 000',
    fax: '+216 75 490 001',
    emergencyPhone: '75 490 002',
    services: ['Radiographie (X-ray)', 'Échographie'],
    description: 'Hôpital régional de Kebili.',
    openNow: true,
    emergency: true
  },
  {
    id: 'reg-024',
    name: 'Hôpital Régional Habib Bourguiba de Médenine',
    type: 'public',
    city: 'Médenine',
    address: 'Médenine 4100',
    phone: '+216 75 640 000',
    fax: '+216 75 640 001',
    emergencyPhone: '75 640 002',
    services: ['Radiographie (X-ray)', 'Scanner (CT)', 'IRM', 'Échographie'],
    description: 'Hôpital régional de Médenine.',
    openNow: true,
    emergency: true
  },
  {
    id: 'reg-025',
    name: 'Hôpital Régional Sadok Mokadem de Djerba',
    type: 'public',
    city: 'Djerba',
    address: 'Houmt Souk - Djerba',
    phone: '+216 75 730 000',
    fax: '+216 75 730 001',
    emergencyPhone: '75 730 002',
    services: ['Radiographie (X-ray)', 'Scanner (CT)', 'Échographie'],
    description: 'Hôpital régional de Djerba (Sadok Mokadem).',
    openNow: true,
    emergency: true
  },
  {
    id: 'reg-026',
    name: 'Hôpital Régional de Moknine',
    type: 'public',
    city: 'Moknine',
    address: 'Rue Koubine - Moknine 5050',
    phone: '+216 73 490 000',
    fax: '+216 73 490 001',
    emergencyPhone: '73 490 002',
    services: ['Radiographie (X-ray)', 'Échographie'],
    description: 'Hôpital régional de Moknine.',
    openNow: true,
    emergency: true
  },
  {
    id: 'reg-027',
    name: 'Hôpital Régional de Ben Guerdane',
    type: 'public',
    city: 'Ben Guerdane',
    address: 'Ben Guerdane 4170',
    phone: '+216 75 710 050',
    services: ['Radiographie (X-ray)'],
    description: 'Hôpital régional de Ben Guerdane.',
    openNow: true,
    emergency: true
  },
  {
    id: 'reg-028',
    name: 'Hôpital Régional de Jebeniana',
    type: 'public',
    city: 'Jebeniana',
    address: 'Hôpital régional de Jébéniana - 3080',
    phone: '+216 74 880 031',
    fax: '+216 74 880 023',
    emergencyPhone: '74 880 031',
    services: ['Radiographie (X-ray)'],
    description: 'Hôpital régional de Jebeniana.',
    openNow: true,
    emergency: true
  },
  {
    id: 'reg-029',
    name: 'Hôpital Régional de Ben Arous',
    type: 'public',
    city: 'Ben Arous',
    address: 'Hôpital régional de Ben Arous',
    phone: '+216 71 315 600',
    services: ['Radiographie (X-ray)', 'Échographie'],
    description: 'Hôpital régional de Ben Arous.',
    openNow: true,
    emergency: true
  },
  {
    id: 'reg-030',
    name: 'Hôpital Régional de Mahres',
    type: 'public',
    city: 'Mahres',
    address: 'Cité Hachana GP1 - Mahres 3060',
    phone: '+216 74 290 012',
    fax: '+216 74 290 012',
    emergencyPhone: '74 290 293',
    services: ['Radiographie (X-ray)'],
    description: 'Hôpital régional de Mahres.',
    openNow: true,
    emergency: true
  },
  {
    id: 'reg-031',
    name: 'Hôpital Régional de Metlaoui',
    type: 'public',
    city: 'Metlaoui',
    address: 'Route de Tozeur - Metlaoui 2130',
    phone: '+216 76 241 600',
    fax: '+216 76 241 600',
    emergencyPhone: '76 241 600 / 502',
    services: ['Radiographie (X-ray)'],
    description: 'Hôpital régional de Metlaoui.',
    openNow: true,
    emergency: true
  },
  {
    id: 'reg-032',
    name: 'Hôpital Régional de Zarzis',
    type: 'public',
    city: 'Zarzis',
    address: 'Zarzis 4170',
    phone: '+216 75 680 726',
    fax: '+216 75 680 726',
    emergencyPhone: '75 694 400',
    services: ['Radiographie (X-ray)', 'Échographie'],
    description: 'Hôpital régional de Zarzis.',
    openNow: true,
    emergency: true
  },
  {
    id: 'reg-033',
    name: 'Hôpital Régional de Tataouine',
    type: 'public',
    city: 'Tataouine',
    address: 'Tataouine 3200',
    phone: '+216 75 862 005',
    fax: '+216 75 862 005',
    emergencyPhone: '75 870 114 / 690',
    services: ['Radiographie (X-ray)', 'Échographie'],
    description: 'Hôpital régional de Tataouine.',
    openNow: true,
    emergency: true
  }
];

export default hospitalsData;
