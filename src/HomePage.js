import React from 'react';
import { Link } from 'react-router-dom';
import { FaHospital, FaXRay, FaProcedures, FaClinicMedical, FaUserMd, FaChartBar } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

const HomePage = () => {
  const year = new Date().getFullYear();
  
  const radiologyTypes = [
    {
      title: 'X-ray',
      description: 'Widely available for bones, chest, and trauma cases.'
    },
    {
      title: 'Ultrasound',
      description: 'Used for abdominal, obstetric, and soft tissue examinations.'
    },
    {
      title: 'Mammography',
      description: 'Available in regional and university hospitals for breast cancer screening.'
    },
    {
      title: 'CT Scan',
      description: 'Available in regional and university hospitals for trauma, oncology, and complex diagnostics.'
    },
    {
      title: 'MRI',
      description: 'Concentrated in university hospitals for neurology, orthopedics, and oncology.'
    },
    {
      title: 'PET-CT',
      description: 'Specialized nuclear imaging, available at Institut Salah Azaiez for oncology.'
    }
  ];

  const hospitalCategories = [
    {
      title: 'District Hospitals',
      description: 'Basic imaging services: X-ray and ultrasound. Primarily serving rural areas and small towns.'
    },
    {
      title: 'Regional Hospitals',
      description: 'Broader range of services: X-ray, ultrasound, CT scan, mammography. At least one per governorate.'
    },
    {
      title: 'University Hospitals (CHU)',
      description: 'Full range of radiology: CT, MRI, PET-CT (oncology), interventional radiology, training & research. Mainly located in Tunis, Sousse, Monastir, and Sfax.'
    }
  ];

  const radiologyStats = [
    { equipment: 'X-ray', availability: 'Widely available', notes: 'Available in all hospitals' },
    { equipment: 'Ultrasound', availability: 'High coverage', notes: 'Used for obstetrics and abdominal examinations' },
    { equipment: 'CT Scanner', availability: '~9 per million', notes: 'Available in regional hospitals and CHUs' },
    { equipment: 'MRI', availability: '~2 per million', notes: 'Mainly in CHUs' },
    { equipment: 'PET-CT', availability: '1 national center', notes: 'At Institut Salah Azaiez in Tunis' }
  ];

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-container">
          <div className="language-selector">
            <button>عربي</button>
            <button className="lang-en">EN</button>
            <button className="active">FR</button>
          </div>
          <nav className="main-nav">
            <ul className="nav-links">
              <li><a href="/help">Aide</a></li>
              <li><a href="/about">À propos</a></li>
              <li><a href="/tunisian-hospitals">Hôpitaux tunisiens</a></li>
              <li><a href="/">Accueil</a></li>
            </ul>
          </nav>
          <div className="header-actions">
            <div className="auth-buttons">
              <button className="btn btn-secondary">Voir la carte interactive</button>
              <a className="btn btn-primary" href="/book">Prendre un rendez-vous</a>
              <a className="btn btn-outline" href="/register">Register</a>
              <a className="btn btn-outline" href="/login">Login</a>
            </div>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="content-wrapper">
          <div className="container py-5">
            {/* Hero Section */}
            <header className="mb-5 text-center">
              <h1 className="display-4 mb-3">Medical Centers of Tunisia</h1>
              <p className="lead text-muted">Find medical centers and book appointments across Tunisia</p>
            </header>

            {/* Overview Section */}
            <section className="mb-5">
              <h2 className="mb-4">Overview</h2>
              <div className="row">
                <div className="col-lg-8 mx-auto">
                  <p className="lead">
                    Tunisia has a well-structured system of public hospitals offering medical imaging and radiology services. 
                    Hospitals are classified into district hospitals, regional hospitals, and university hospitals (CHU). 
                    Available services range from basic X-rays and ultrasounds to advanced techniques like CT scans, MRIs, PET-CT, 
                    and interventional radiology. The public health sector represents over 80% of hospital beds nationwide. 
                    Each governorate has at least one regional hospital equipped with radiology services, while major cities 
                    like Tunis, Sousse, Monastir, and Sfax are home to university hospitals with advanced technologies.
                  </p>
                  <p className="text-muted">Data from WHO and the Ministry of Health</p>
                </div>
              </div>
            </section>

            {/* Radiology Types */}
            <section className="mb-5">
              <h2 className="mb-4">Available Radiology Types</h2>
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

            {/* Hospitals by Category */}
            <section className="mb-5">
              <h2 className="mb-4">Hospitals by Category</h2>
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

            {/* Radiology Statistics */}
            <section className="mb-5">
              <h2 className="mb-4">Radiology Statistics</h2>
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Equipment</th>
                      <th>Availability (per million inhabitants)</th>
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
      
      {/* Personal Information Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h2 className="text-center mb-4">Personal Information</h2>
              <form className="needs-validation" noValidate>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="firstName" className="form-label">First name</label>
                    <input type="text" className="form-control" id="firstName" required />
                    <div className="invalid-feedback">
                      Valid first name is required.
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="lastName" className="form-label">Last name</label>
                    <input type="text" className="form-control" id="lastName" required />
                    <div className="invalid-feedback">
                      Valid last name is required.
                    </div>
                  </div>
                  <div className="col-12">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" placeholder="you@example.com" required />
                    <div className="invalid-feedback">
                      Please enter a valid email address.
                    </div>
                  </div>
                  <div className="col-12">
                    <label htmlFor="phone" className="form-label">Phone Number</label>
                    <input type="tel" className="form-control" id="phone" required />
                    <div className="invalid-feedback">
                      Please enter a valid phone number.
                    </div>
                  </div>
                  <div className="col-12">
                    <label htmlFor="address" className="form-label">Address</label>
                    <input type="text" className="form-control" id="address" required />
                    <div className="invalid-feedback">
                      Please enter your address.
                    </div>
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="city" className="form-label">City</label>
                    <input type="text" className="form-control" id="city" required />
                    <div className="invalid-feedback">
                      Please provide a valid city.
                    </div>
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="state" className="form-label">State/Region</label>
                    <select className="form-select" id="state" required>
                      <option value="" disabled selected>Choose...</option>
                      <option>Tunis</option>
                      <option>Ariana</option>
                      <option>Ben Arous</option>
                      <option>Manouba</option>
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
                      <option>Medenine</option>
                      <option>Tataouine</option>
                      <option>Gafsa</option>
                      <option>Tozeur</option>
                      <option>Kebili</option>
                    </select>
                    <div className="invalid-feedback">
                      Please select a valid state.
                    </div>
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="zip" className="form-label">ZIP/Postal Code</label>
                    <input type="text" className="form-control" id="zip" required />
                    <div className="invalid-feedback">
                      Zip code required.
                    </div>
                  </div>
                </div>

                <hr className="my-4" />

                <h4 className="mb-3">Appointment Details</h4>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="appointmentDate" className="form-label">Preferred Date</label>
                    <input type="date" className="form-control" id="appointmentDate" required />
                    <div className="invalid-feedback">
                      Please select a date.
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="appointmentTime" className="form-label">Preferred Time</label>
                    <select className="form-select" id="appointmentTime" required>
                      <option value="" disabled selected>Select time...</option>
                      <option>08:00 AM</option>
                      <option>09:00 AM</option>
                      <option>10:00 AM</option>
                      <option>11:00 AM</option>
                      <option>01:00 PM</option>
                      <option>02:00 PM</option>
                      <option>03:00 PM</option>
                      <option>04:00 PM</option>
                    </select>
                    <div className="invalid-feedback">
                      Please select a time.
                    </div>
                  </div>
                  <div className="col-12">
                    <label htmlFor="medicalConcern" className="form-label">Medical Concern/Notes</label>
                    <textarea className="form-control" id="medicalConcern" rows="3"></textarea>
                  </div>
                </div>

                <hr className="my-4" />

                <button className="w-100 btn btn-primary btn-lg" type="submit">Book Appointment</button>
              </form>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
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
