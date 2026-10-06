import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FaHospital, FaXRay, FaProcedures, FaClinicMedical, FaUserMd, FaChartBar } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

const HomePage = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();
  
  const radiologyTypes = [
    {
      title: t('type_xray'),
      description: t('type_xray_desc')
    },
    {
      title: t('type_ultrasound'),
      description: t('type_ultrasound_desc')
    },
    {
      title: t('type_mammography'),
      description: t('type_mammography_desc')
    },
    {
      title: t('type_ct'),
      description: t('type_ct_desc')
    },
    {
      title: t('type_mri'),
      description: t('type_mri_desc')
    },
    {
      title: t('type_petct'),
      description: t('type_petct_desc')
    }
  ];

  const hospitalCategories = [
    {
      title: t('district_hospitals'),
      description: t('district_hospitals_desc')
    },
    {
      title: t('regional_hospitals'),
      description: t('regional_hospitals_desc')
    },
    {
      title: t('university_hospitals'),
      description: t('university_hospitals_desc')
    }
  ];

  const radiologyStats = [
    { equipment: t('xray'), availability: t('widely_available'), notes: t('available_in_all') },
    { equipment: t('ultrasound'), availability: t('high_coverage'), notes: t('used_for_obstetrics') },
    { equipment: t('ct_scan'), availability: t('ct_availability'), notes: t('available_in_regional') },
    { equipment: t('type_mri'), availability: t('stats_mri_avail'), notes: t('stats_mri_notes') },
    { equipment: t('type_petct'), availability: t('stats_petct_avail'), notes: t('stats_petct_notes') }
  ];

  return (
    <div className="app-layout">
      

      <main className="main-content">
        <div className="content-wrapper">
          <div className="container py-5">
            {/* Hero Section */}
            <header className="mb-5 text-center">
              <h1 className="display-4 mb-3">{t('homepage_title')}</h1>
              <p className="lead text-muted">{t('homepage_subtitle')}</p>
            </header>

            {/* Overview Section */}
            <section className="mb-5">
              <h2 className="mb-4">{t('overview_title')}</h2>
              <div className="row">
                <div className="col-lg-8 mx-auto">
                  <p className="lead">
                    {t('overview_text')}
                  </p>
                  <p className="text-muted">{t('data_source')}</p>
                </div>
              </div>
            </section>

            {/* Radiology Types */}
            <section className="mb-5">
              <h2 className="mb-4">{t('radiology_types_title')}</h2>
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
              <h2 className="mb-4">{t('hospitals_by_category')}</h2>
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
              <h2 className="mb-4">{t('radiology_stats_title')}</h2>
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>{t('table_equipment')}</th>
                      <th>{t('table_availability')}</th>
                      <th>{t('table_notes')}</th>
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

     
      {/* Footer */}
      <footer className="bg-primary text-white text-center py-4 mt-auto">
        <div className="container">
          <p className="mb-0">&copy; {year} {t('app_name')}. {t('all_rights_reserved')}</p>
          <div className="footer-links mt-2">
            <a href="/privacy" className="text-white mx-2">{t('privacy_policy')}</a>
            <a href="/terms" className="text-white mx-2">{t('terms_of_use')}</a>
            <a href="/contact" className="text-white mx-2">{t('contact')}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
