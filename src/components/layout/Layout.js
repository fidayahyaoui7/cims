import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import '../../styles/theme.css';
import './Layout.css';

const Layout = ({ children, hideHeader = false }) => {
  return (
    <div className="app-layout">
      {!hideHeader && <Header />}
      <main className="main-content">
        <div className="content-wrapper">
          {children}
        </div>
      </main>
      <footer className="app-footer">
        <div className="container">
          <p>© {new Date().getFullYear()} RDVMedical. Tous droits réservés.</p>
          <div className="footer-links">
            <a href="/privacy">Politique de confidentialité</a>
            <a href="/terms">Conditions d'utilisation</a>
            <a href="/contact">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  hideHeader: PropTypes.bool
};

export default Layout;
