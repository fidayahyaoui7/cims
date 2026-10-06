import React from 'react';

const PublicHospitalsHome = () => {
  return (
    <div className="container py-5">
      <header className="mb-4 text-center">
        <h1>Hôpitaux Publics en Tunisie</h1>
        <p className="text-muted">
          Informations générales, missions et organisation du réseau hospitalier public tunisien
        </p>
      </header>

      <section className="mb-5">
        <h2>Mission</h2>
        <p>
          Les hôpitaux publics en Tunisie assurent des services de santé accessibles à tous: urgences,
          soins primaires, hospitalisation, maternité, imagerie, chirurgie et spécialités.
        </p>
      </section>

      <section className="mb-5">
        <h2>Niveaux d'établissements</h2>
        <ul>
          <li>Hôpitaux régionaux: couverture de chaque gouvernorat avec urgences 24/7</li>
          <li>Hôpitaux universitaires: centres de référence avec haut niveau de spécialisation</li>
          <li>Polycliniques et structures locales: proximité et soins de base</li>
        </ul>
      </section>

      <section className="mb-5">
        <h2>Accès et prise de RDV</h2>
        <p>
          Les urgences sont assurées 24h/24 dans la plupart des hôpitaux régionaux et universitaires.
          Pour les consultations programmées, renseignez-vous auprès du service concerné.
        </p>
      </section>

      <section className="mb-5">
        <h2>Annuaire</h2>
        <p>
          Consultez l'annuaire pour rechercher par ville, type d'établissement et services disponibles.
        </p>
        <a className="btn btn-primary" href="/tunisian-hospitals/directory">Accéder à l'annuaire</a>
      </section>
    </div>
  );
};

export default PublicHospitalsHome;
