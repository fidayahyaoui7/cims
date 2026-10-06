import React from 'react';
import { Link } from 'react-router-dom';
import { FaHospital, FaXRay, FaProcedures, FaClinicMedical, FaUserMd, FaChartBar } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

const HomePageFr = () => {
  const year = new Date().getFullYear();
  
  const radiologyTypes = [
    {
      title: 'Radiographie',
      description: 'Disponible pour les examens osseux, thoraciques et les cas de traumatologie.'
    },
    {
      title: 'Échographie',
      description: 'Utilisée pour les examens abdominaux, obstétricaux et des tissus mous.'
    },
    {
      title: 'Mammographie',
      description: 'Disponible dans les hôpitaux régionaux et universitaires pour le dépistage du cancer du sein.'
    },
    {
      title: 'Scanner',
      description: 'Disponible dans les hôpitaux régionaux et universitaires pour les traumatismes, l\'oncologie et les diagnostics complexes.'
    },
    {
      title: 'IRM',
      description: 'Concentrée dans les CHU pour la neurologie, l\'orthopédie et l\'oncologie.'
    },
    {
      title: 'TEP-Scan',
      description: 'Imagerie nucléaire spécialisée, disponible à l\'Institut Salah Azaiez pour l\'oncologie.'
    }
  ];

  const hospitalCategories = [
    {
      title: 'Hôpitaux de District',
      description: 'Services d\'imagerie de base : radiographie et échographie. Principalement situés dans les zones rurales et les petites villes.'
    },
    {
      title: 'Hôpitaux Régionaux',
      description: 'Gamme plus large de services : radiographie, échographie, scanner, mammographie. Au moins un par gouvernorat.'
    },
    {
      title: 'Centres Hospitalo-Universitaires (CHU)',
      description: 'Gamme complète de radiologie : scanner, IRM, TEP-Scan (oncologie), radiologie interventionnelle, formation et recherche. Principalement situés à Tunis, Sousse, Monastir et Sfax.'
    }
  ];

  const radiologyStats = [
    { equipment: 'Radiographie', availability: 'Large disponibilité', notes: 'Disponible dans tous les hôpitaux' },
    { equipment: 'Échographie', availability: 'Couverture élevée', notes: 'Utilisée pour les examens obstétricaux et abdominaux' },
    { equipment: 'Scanner', availability: '~9 par million', notes: 'Disponible dans les hôpitaux régionaux et les CHU' },
    { equipment: 'IRM', availability: '~2 par million', notes: 'Principalement dans les CHU' },
    { equipment: 'TEP-Scan', availability: '1 centre national', notes: 'À l\'Institut Salah Azaiez à Tunis' }
  ];

  return (
    <div className="app-layout">
      <main className="main-content">
        <div className="content-wrapper">
          <div className="container py-5">
            {/* Section d'accueil */}
            <header className="mb-5 text-center">
              <h1 className="display-4 mb-3">Centres Médicaux de Tunisie</h1>
              <p className="lead text-muted">Trouvez des centres médicaux et prenez rendez-vous à travers la Tunisie</p>
            </header>

            {/* Section Aperçu */}
            <section className="mb-5">
              <h2 className="mb-4">Aperçu</h2>
              <div className="row">
                <div className="col-lg-8 mx-auto">
                  <p className="lead">
                    La Tunisie dispose d'un système bien structuré d'hôpitaux publics offrant des services d'imagerie médicale et de radiologie.
                    Les hôpitaux sont classés en hôpitaux de district, hôpitaux régionaux et centres hospitalo-universitaires (CHU).
                    Les services disponibles vont de la radiographie et de l'échographie de base à des techniques avancées comme le scanner, l'IRM, le TEP-Scan,
                    et la radiologie interventionnelle. Le secteur public de la santé représente plus de 80% des lits d'hôpitaux à l'échelle nationale.
                    Chaque gouvernorat dispose d'au moins un hôpital régional équipé de services de radiologie, tandis que les grandes villes
                    comme Tunis, Sousse, Monastir et Sfax abritent des CHU dotés de technologies avancées.
                  </p>
                  <p className="text-muted">Données de l'OMS et du Ministère de la Santé</p>
                </div>
              </div>
            </section>

            {/* Types de Radiologie */}
            <section className="mb-5">
              <h2 className="mb-4">Types de Radiologie Disponibles</h2>
              <div className="row g-4">
                {radiologyTypes.map((type, index) => (
                  <div className="col-md-6 col-lg-4" key={index}>
                    <div className="card h-100">
                      <div className="card-body">
                        <h5 className="card-title">{type.title}</h5>
                        <p className="card-text">{type.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Hôpitaux par Catégorie */}
            <section className="mb-5">
              <h2 className="mb-4">Hôpitaux par Catégorie</h2>
              <div className="row g-4">
                {hospitalCategories.map((category, index) => (
                  <div className="col-md-4" key={index}>
                    <div className="card h-100">
                      <div className="card-body">
                        <h4 className="card-title">{category.title}</h4>
                        <p className="card-text">{category.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Statistiques de Radiologie */}
            <section className="mb-5">
              <h2 className="mb-4">Statistiques de Radiologie</h2>
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Équipement</th>
                      <th>Disponibilité (par million d'habitants)</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {radiologyStats.map((stat, index) => (
                      <tr key={index}>
                        <td>{stat.equipment}</td>
                        <td>{stat.availability}</td>
                        <td>{stat.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </main>
      
      {/* Section Informations Personnelles */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h2 className="text-center mb-4">Informations Personnelles</h2>
              <form className="needs-validation" noValidate>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="prenom" className="form-label">Prénom</label>
                    <input type="text" className="form-control" id="prenom" required />
                    <div className="invalid-feedback">
                      Un prénom valide est requis.
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="nom" className="form-label">Nom</label>
                    <input type="text" className="form-control" id="nom" required />
                    <div className="invalid-feedback">
                      Un nom valide est requis.
                    </div>
                  </div>
                  <div className="col-12">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" placeholder="votre@email.com" required />
                    <div className="invalid-feedback">
                      Veuillez entrer une adresse email valide.
                    </div>
                  </div>
                  <div className="col-12">
                    <label htmlFor="telephone" className="form-label">Numéro de téléphone</label>
                    <input type="tel" className="form-control" id="telephone" required />
                    <div className="invalid-feedback">
                      Veuillez entrer un numéro de téléphone valide.
                    </div>
                  </div>
                  <div className="col-12">
                    <label htmlFor="adresse" className="form-label">Adresse</label>
                    <input type="text" className="form-control" id="adresse" required />
                    <div className="invalid-feedback">
                      Veuillez entrer votre adresse.
                    </div>
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="ville" className="form-label">Ville</label>
                    <input type="text" className="form-control" id="ville" required />
                    <div className="invalid-feedback">
                      Veuillez fournir une ville valide.
                    </div>
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="gouvernorat" className="form-label">Gouvernorat</label>
                    <select className="form-select" id="gouvernorat" required>
                      <option value="" disabled selected>Choisir...</option>
                      <option>Tunis</option>
                      <option>Ariana</option>
                      <option>Ben Arous</option>
                      <option>La Manouba</option>
                      <option>Nabeul</option>
                      <option>Zaghouan</option>
                      <option>Bizerte</option>
                      <option>Béja</option>
                      <option>Jendouba</option>
                      <option>Le Kef</option>
                      <option>Siliana</option>
                      <option>Sousse</option>
                      <option>Monastir</option>
                      <option>Mahdia</option>
                      <option>Sfax</option>
                      <option>Kairouan</option>
                      <option>Kasserine</option>
                      <option>Sidi Bouzid</option>
                      <option>Gabès</option>
                      <option>Médenine</option>
                      <option>Tataouine</option>
                      <option>Gafsa</option>
                      <option>Tozeur</option>
                      <option>Kébili</option>
                    </select>
                    <div className="invalid-feedback">
                      Veuillez sélectionner un gouvernorat valide.
                    </div>
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="codePostal" className="form-label">Code Postal</label>
                    <input type="text" className="form-control" id="codePostal" required />
                    <div className="invalid-feedback">
                      Code postal requis.
                    </div>
                  </div>
                </div>

                <hr className="my-4" />

                <h4 className="mb-3">Détails du Rendez-vous</h4>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="dateRendezVous" className="form-label">Date préférée</label>
                    <input type="date" className="form-control" id="dateRendezVous" required />
                    <div className="invalid-feedback">
                      Veuillez sélectionner une date.
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="heureRendezVous" className="form-label">Heure préférée</label>
                    <select className="form-select" id="heureRendezVous" required>
                      <option value="" disabled selected>Sélectionner une heure...</option>
                      <option>08:00</option>
                      <option>09:00</option>
                      <option>10:00</option>
                      <option>11:00</option>
                      <option>13:00</option>
                      <option>14:00</option>
                      <option>15:00</option>
                      <option>16:00</option>
                    </select>
                    <div className="invalid-feedback">
                      Veuillez sélectionner une heure.
                    </div>
                  </div>
                  <div className="col-12">
                    <label htmlFor="motif" className="form-label">Motif de la consultation/Notes</label>
                    <textarea className="form-control" id="motif" rows="3"></textarea>
                  </div>
                </div>

                <hr className="my-4" />

                <button className="w-100 btn btn-primary btn-lg" type="submit">Prendre Rendez-vous</button>
              </form>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pied de page */}
      <footer className="bg-primary text-white text-center py-4 mt-auto">
        <div className="container">
          <p className="mb-0">&copy; {year} RDVMedical. Tous droits réservés.</p>
          <div className="footer-links mt-2">
            <a href="/privacy" className="text-white mx-2">Politique de confidentialité</a>
            <a href="/terms" className="text-white mx-2">Conditions d'utilisation</a>
            <a href="/contact" className="text-white mx-2">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePageFr;
