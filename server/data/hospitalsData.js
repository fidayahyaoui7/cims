/**
 * Consolidated list of Tunisian hospitals and medical centers
 */

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
    description: "Hôpital universitaire spécialisé en traumatologie et grands brûlés, disposant d'un service de radiologie médicale.",
    rating: 4.3,
    reviews: 128,
    openNow: true,
    emergency: true,
    image: 'https://via.placeholder.com/400x250?text=Hôpital+Mongi+Slim'
  },
  // ... (other hospitals from your data)
  {
    id: 'reg-034',
    name: 'Hôpital Régional Mahmoud El Matri (Ariana)',
    type: 'public',
    city: 'Ariana',
    address: 'Hôpital régional d\'Ariana - Tunis',
    phone: '71821286',
    emergencyPhone: '71821621',
    services: ['Radiographie (X-ray)', 'Échographie'],
    description: 'Hôpital régional Mahmoud El Matri à l\'Ariana, assurant les urgences et diverses spécialités.',
    openNow: true,
    emergency: true,
    coordinates: { lat: 36.8625, lng: 10.1956 }
  }
];

module.exports = hospitalsData;
