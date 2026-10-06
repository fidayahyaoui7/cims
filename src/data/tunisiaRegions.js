const tunisiaRegions = [
  {
    id: 'tunis',
    name: 'Tunis',
    hospitals: [
      'Hôpital Charles Nicolle',
      'Hôpital La Rabta',
      'Hôpital Aziza Othmana',
      'Hôpital Razi',
      'Hôpital Mongi Slim',
      'Clinique El Manar',
      'Clinique Les Berges du Lac'
    ]
  },
  {
    id: 'ariana',
    name: 'Ariana',
    hospitals: [
      'Hôpital Abderrahmen Mami',
      'Hôpital Razi',
      'Clinique Ennasr',
      'Clinique El Ghazela'
    ]
  },
  {
    id: 'ben_arous',
    name: 'Ben Arous',
    hospitals: [
      'Hôpital Taoufik Bouhima',
      'Hôpital Mongi Ben Hamida',
      'Clinique Ennasim',
      'Clinique Les Oliviers'
    ]
  },
  {
    id: 'manouba',
    name: 'La Manouba',
    hospitals: [
      'Hôpital Régional de La Manouba',
      'Hôpital Mongi Slim',
      'Clinique El Manar'
    ]
  },
  {
    id: 'nabeul',
    name: 'Nabeul',
    hospitals: [
      'Hôpital Universitaire Nabeul',
      'Hôpital Régional de Nabeul',
      'Clinique Les Oliviers',
      'Clinique Ennajah'
    ]
  },
  {
    id: 'zaghouan',
    name: 'Zaghouan',
    hospitals: [
      'Hôpital Régional de Zaghouan',
      'Hôpital de Bir Mcherga'
    ]
  },
  {
    id: 'bizerte',
    name: 'Bizerte',
    hospitals: [
      'Hôpital Régional de Bizerte',
      'Hôpital 15 Octobre',
      'Hôpital de Menzel Bourguiba',
      'Clinique Les Oliviers',
      'Clinique Ennour'
    ]
  },
  {
    id: 'beja',
    name: 'Béja',
    hospitals: [
      'Hôpital Régional de Béja',
      'Hôpital de Nefza',
      'Hôpital de Téboursouk'
    ]
  },
  {
    id: 'jendouba',
    name: 'Jendouba',
    hospitals: [
      'Hôpital Régional de Jendouba',
      'Hôpital de Bou Salem',
      'Hôpital de Tabarka'
    ]
  },
  {
    id: 'kef',
    name: 'Le Kef',
    hospitals: [
      'Hôpital Régional du Kef',
      'Hôpital de Tajerouine',
      'Hôpital de Kalâat Khasba'
    ]
  },
  {
    id: 'siliana',
    name: 'Siliana',
    hospitals: [
      'Hôpital Régional de Siliana',
      'Hôpital de Gaâfour',
      'Hôpital de Bargou'
    ]
  },
  {
    id: 'sousse',
    name: 'Sousse',
    hospitals: [
      'CHU Sahloul',
      'CHU Farhat Hached',
      'Hôpital Régional de Sousse',
      'Clinique Les Oliviers',
      'Clinique Ennasr'
    ]
  },
  {
    id: 'monastir',
    name: 'Monastir',
    hospitals: [
      'CHU Fattouma Bourguiba',
      'Hôpital Régional de Monastir',
      'Hôpital Taher Sfar',
      'Clinique Essalem',
      'Clinique Ennour'
    ]
  },
  {
    id: 'mahdia',
    name: 'Mahdia',
    hospitals: [
      'Hôpital Régional de Mahdia',
      'Hôpital de Boumerdes',
      'Hôpital de Rejiche',
      'Clinique Essalem'
    ]
  },
  {
    id: 'sfax',
    name: 'Sfax',
    hospitals: [
      'CHU Hédi Chaker',
      'CHU Habib Bourguiba',
      'Hôpital Régional de Sfax',
      'Hôpital Taher Maamouri',
      'Clinique Ennasr',
      'Clinique Les Oliviers'
    ]
  },
  {
    id: 'kairouan',
    name: 'Kairouan',
    hospitals: [
      'Hôpital Universitaire Ibn El Jazzar',
      'Hôpital Régional de Kairouan',
      'Hôpital de Bouhajla',
      'Hôpital de Chebika'
    ]
  },
  {
    id: 'kasserine',
    name: 'Kasserine',
    hospitals: [
      'Hôpital Régional de Kasserine',
      'Hôpital de Sbeitla',
      'Hôpital de Fériana'
    ]
  },
  {
    id: 'sidi_bouzid',
    name: 'Sidi Bouzid',
    hospitals: [
      'Hôpital Régional de Sidi Bouzid',
      'Hôpital de Meknassi',
      'Hôpital de Regueb'
    ]
  },
  {
    id: 'gabes',
    name: 'Gabès',
    hospitals: [
      'Hôpital Régional de Gabès',
      'Hôpital Taoufik Cheikhrouhou',
      'Hôpital de Matmata',
      'Hôpital de Ghannouche'
    ]
  },
  {
    id: 'medenine',
    name: 'Médenine',
    hospitals: [
      'Hôpital Régional de Médenine',
      'Hôpital de Zarzis',
      'Hôpital de Ben Guerdane',
      'Hôpital de Djerba'
    ]
  },
  {
    id: 'tataouine',
    name: 'Tataouine',
    hospitals: [
      'Hôpital Régional de Tataouine',
      'Hôpital de Remada',
      'Hôpital de Ghomrassen'
    ]
  },
  {
    id: 'gafsa',
    name: 'Gafsa',
    hospitals: [
      'Hôpital Régional de Gafsa',
      'Hôpital de Métlaoui',
      'Hôpital de Redeyef',
      'Hôpital de Moularès'
    ]
  },
  {
    id: 'tozeur',
    name: 'Tozeur',
    hospitals: [
      'Hôpital Régional de Tozeur',
      'Hôpital de Degueche',
      'Hôpital de Nefta'
    ]
  },
  {
    id: 'kebili',
    name: 'Kébili',
    hospitals: [
      'Hôpital Régional de Kébili',
      'Hôpital de Douz',
      'Hôpital de Souk Lahad'
    ]
  }
];

export default tunisiaRegions;
