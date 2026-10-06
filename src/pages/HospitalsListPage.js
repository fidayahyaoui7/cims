import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Row, Col, Card, Spinner, Alert, Form, Button } from 'react-bootstrap';
import { api } from '../services/api';

const HospitalsListPage = () => {
  const { t } = useTranslation();
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    city: '',
    type: '',
    search: ''
  });

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query params from filters
      const params = new URLSearchParams();
      if (filters.city) params.append('city', filters.city);
      if (filters.type) params.append('type', filters.type);
      if (filters.search) params.append('search', filters.search);
      
      const response = await fetch(`/api/hospitals?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setHospitals(data);
    } catch (err) {
      console.error('Error fetching hospitals:', err);
      setError(t('error_loading_hospitals') || 'Failed to load hospitals. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchHospitals();
  };

  const clearFilters = () => {
    setFilters({
      city: '',
      type: '',
      search: ''
    });
  };

  if (loading && hospitals.length === 0) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">{t('loading') || 'Loading hospitals...'}</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h1 className="mb-4">{t('hospitals_list') || 'Hospitals List'}</h1>
      
      {/* Filters */}
      <Card className="mb-4">
        <Card.Body>
          <Form onSubmit={handleSearch}>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('city') || 'City'}</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={filters.city}
                    onChange={handleFilterChange}
                    placeholder={t('filter_by_city') || 'Filter by city'}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('type') || 'Type'}</Form.Label>
                  <Form.Select
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                  >
                    <option value="">{t('all_types') || 'All Types'}</option>
                    <option value="public">{t('public') || 'Public'}</option>
                    <option value="private">{t('private') || 'Private'}</option>
                    <option value="military">{t('military') || 'Military'}</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('search') || 'Search'}</Form.Label>
                  <div className="input-group">
                    <Form.Control
                      type="text"
                      name="search"
                      value={filters.search}
                      onChange={handleFilterChange}
                      placeholder={t('search_hospitals') || 'Search hospitals...'}
                    />
                    <Button 
                      variant="outline-secondary" 
                      type="button"
                      onClick={clearFilters}
                    >
                      {t('clear') || 'Clear'}
                    </Button>
                  </div>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* Error Message */}
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {/* Hospitals List */}
      {hospitals.length === 0 ? (
        <Alert variant="info">
          {t('no_hospitals_found') || 'No hospitals found matching your criteria.'}
        </Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {hospitals.map((hospital) => (
            <Col key={hospital.id}>
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>{hospital.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {hospital.city} • {hospital.type}
                  </Card.Subtitle>
                  <Card.Text>
                    {hospital.address && <div><strong>{t('address') || 'Address'}:</strong> {hospital.address}</div>}
                    {hospital.phone && <div><strong>{t('phone') || 'Phone'}:</strong> {hospital.phone}</div>}
                    {hospital.email && <div><strong>Email:</strong> {hospital.email}</div>}
                    {hospital.website && (
                      <div>
                        <strong>Website:</strong>{' '}
                        <a href={hospital.website.startsWith('http') ? hospital.website : `http://${hospital.website}`} 
                           target="_blank" 
                           rel="noopener noreferrer">
                          {hospital.website}
                        </a>
                      </div>
                    )}
                    {hospital.services && (
                      <div className="mt-2">
                        <strong>{t('services') || 'Services'}:</strong>
                        <div className="d-flex flex-wrap gap-1 mt-1">
                          {hospital.services.split(',').map((service, i) => (
                            <span key={i} className="badge bg-secondary me-1 mb-1">
                              {service.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card.Text>
                </Card.Body>
                <Card.Footer>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      {hospital.has_emergency && (
                        <span className="text-danger">
                          <i className="fas fa-ambulance me-1"></i>
                          {t('emergency_available') || 'Emergency'}
                        </span>
                      )}
                    </small>
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => {
                        // Navigate to hospital details or booking page
                        console.log('View details for hospital:', hospital.id);
                      }}
                    >
                      {t('view_details') || 'View Details'}
                    </Button>
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default HospitalsListPage;
