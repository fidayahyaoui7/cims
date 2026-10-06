/**
 * Complete list of Tunisian governorates with their hospitals
 */

const tunisiaGovernorates = [
  {
    id: 'tunis',
    name: 'Tunis',
    governorate: 'Tunis',
    hospitals: [
      {
        id: 'pub-001',
        name: 'Hôpital Universitaire Mongi Slim',
        type: 'public',
        city: 'La Marsa',
        services: ['Traumatologie', 'Grands brûlés', 'Radiologie', 'Urgences'],
        rating: 4.3,
        emergency: true
      },
      {
        id: 'pub-002',
        name: 'Hôpital La Rabta',
        type: 'public',
        city: 'Tunis',
        services: ['Urgences', 'Médecine Interne', 'Chirurgie'],
        rating: 4.1,
        emergency: true
      },
      {
        id: 'pub-003',
        name: 'Hôpital Charles Nicolle',
        type: 'public',
        city: 'Tunis',
        services: ['Urgences', 'Pédiatrie', 'Cardiologie'],
        rating: 4.2,
        emergency: true
      }
    ]
  },
  {
    id: 'ariana',
    name: 'Ariana',
    governorate: 'Ariana',
    hospitals: [
      {
        id: 'pub-004',
        name: 'Hôpital Régional Mahmoud El Matri',
        type: 'public',
        city: 'Ariana',
        services: ['Urgences', 'Médecine Générale'],
        rating: 3.9,
        emergency: true
      }
    ]
  },
  // Additional governorates will be added in the next part
  {
    id: 'bizerte',
    name: 'Bizerte',
    governorate: 'Bizerte',
    hospitals: [
      {
        id: 'pub-009',
        name: 'Hôpital Régional de Bizerte',
        type: 'public',
        city: 'Bizerte',
        services: ['Urgences', 'Médecine Générale', 'Chirurgie'],
        rating: 3.8,
        emergency: true
      },
      {
        id: 'pub-010',
        name: 'Hôpital 15 Octobre',
        type: 'public',
        city: 'Menzel Bourguiba',
        services: ['Urgences', 'Médecine Interne'],
        rating: 3.7,
        emergency: true
      }
    ]
  },
  {
    id: 'sousse',
    name: 'Sousse',
    governorate: 'Sousse',
    hospitals: [
      {
        id: 'pub-016',
        name: 'CHU Sahloul',
        type: 'public',
        city: 'Sousse',
        services: ['Urgences', 'Médecine Interne', 'Chirurgie', 'Cardiologie'],
        rating: 4.2,
        emergency: true
      },
      {
        id: 'pub-017',
        name: 'CHU Farhat Hached',
        type: 'public',
        city: 'Sousse',
        services: ['Urgences', 'Médecine Interne', 'Chirurgie'],
        rating: 4.0,
        emergency: true
      }
    ]
  },
  {
    id: 'sfax',
    name: 'Sfax',
    governorate: 'Sfax',
    hospitals: [
      {
        id: 'pub-022',
        name: 'CHU Hédi Chaker',
        type: 'public',
        city: 'Sfax',
        services: ['Urgences', 'Médecine Interne', 'Chirurgie', 'Cardiologie'],
        rating: 4.0,
        emergency: true
      },
      {
        id: 'pub-023',
        name: 'CHU Habib Bourguiba',
        type: 'public',
        city: 'Sfax',
        services: ['Urgences', 'Médecine Interne', 'Chirurgie'],
        rating: 3.9,
        emergency: true
      }
    ]
  },
  {
    id: 'gabes',
    name: 'Gabès',
    governorate: 'Gabès',
    hospitals: [
      {
        id: 'pub-031',
        name: 'Hôpital Régional de Gabès',
        type: 'public',
        city: 'Gabès',
        services: ['Urgences', 'Médecine Générale', 'Chirurgie'],
        rating: 3.6,
        emergency: true
      }
    ]
  },
  {
    id: 'medenine',
    name: 'Médenine',
    governorate: 'Médenine',
    hospitals: [
      {
        id: 'pub-035',
        name: 'Hôpital Régional de Médenine',
        type: 'public',
        city: 'Médenine',
        services: ['Urgences', 'Médecine Générale', 'Chirurgie'],
        rating: 3.7,
        emergency: true
      },
      {
        id: 'pub-036',
        name: 'Hôpital de Zarzis',
        type: 'public',
        city: 'Zarzis',
        services: ['Urgences', 'Médecine Générale'],
        rating: 3.6,
        emergency: true
      }
    ]
  }
  // Additional governorates can be added as needed
];

export default tunisiaGovernorates;
