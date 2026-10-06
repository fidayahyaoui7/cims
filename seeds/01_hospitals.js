exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('hospitals').del()
    .then(function () {
      // Inserts seed entries
      return knex('hospitals').insert([
        {
          name: 'Hôpital Charles Nicolle',
          address: 'Boulevard 9 Avril, Tunis 1006',
          city: 'Tunis',
          phone: '71 578 000',
          email: 'contact@rnt.utm.tn',
          website: 'www.rns.tn',
          latitude: 36.8065,
          longitude: 10.1815,
          type: 'public',
          has_emergency: true,
          has_radiology: true,
          services: 'Radiologie, Urgences, Cardiologie, Pédiatrie',
          created_at: new Date(),
          updated_at: new Date()
        },
        
        {
          name: 'Hôpital Militaire de Tunis',
          address: 'Avenue de la Ligue Arabe, Montplaisir',
          city: 'Tunis',
          phone: '71 780 000',
          type: 'military',
          has_emergency: true,
          has_radiology: true,
          services: 'Radiologie, Urgences, Médecine Interne',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Hôpital Fattouma Bourguiba',
          address: 'Rue du 1er Juin, Monastir 5000',
          city: 'Monastir',
          phone: '73 462 000',
          type: 'public',
          has_emergency: true,
          has_radiology: true,
          services: 'Radiologie, Cardiologie, Pédiatrie, Urgences',
          created_at: new Date(),
          updated_at: new Date()
        }
      ]);
    });
};
