import React, { useState, useEffect } from 'react';
import { FaSearch, FaMapMarkerAlt, FaHospital, FaPhone, FaMapMarkedAlt } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import '../styles/SearchForm.css';

// Fix for default marker icons in Leaflet
const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const hospitalIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Sample Tunisian hospitals data with coordinates
const tunisianHospitals = [
  {
    id: 1,
    name: 'Hôpital Charles Nicolle',
    city: 'Tunis',
    address: 'Boulevard du 9 Avril 1938',
    phone: '71 578 000',
    position: [36.8065, 10.1815],
    services: ['Cardiologie', 'Radiologie', 'Urgences']
  },
  {
    id: 2,
    name: 'Hôpital La Rabta',
    city: 'Tunis',
    address: 'Jabbari 1007',
    phone: '71 573 000',
    position: [36.8048, 10.1643],
    services: ['Neurologie', 'Pédiatrie', 'Chirurgie']
  },
  {
    id: 3,
    name: 'Hôpital Habib Thameur',
    city: 'Tunis',
    address: 'Place du Rassemblement',
    phone: '71 280 000',
    position: [36.7909, 10.1813],
    services: ['Médecine Interne', 'Ophtalmologie', 'ORL']
  },
  {
    id: 4,
    name: 'Hôpital Sahloul',
    city: 'Sousse',
    address: 'Route Ceinture Sahloul',
    phone: '73 369 000',
    position: [35.8254, 10.6084],
    services: ['Cardiologie', 'Maternité', 'Pédiatrie']
  },
  {
    id: 5,
    name: 'Hôpital Fattouma Bourguiba',
    city: 'Monastir',
    address: 'Rue du 1er Juin 1955',
    phone: '73 462 000',
    position: [35.7787, 10.8269],
    services: ['Chirurgie', 'Médecine Interne', 'Urgences']
  },
  {
    id: 6,
    name: 'Hôpital Tahar Sfar',
    city: 'Mahdia',
    address: 'Route de la Plage',
    phone: '73 694 000',
    position: [35.5049, 11.0622],
    services: ['Médecine Générale', 'Pédiatrie', 'Radiologie']
  },
  {
    id: 7,
    name: 'Hôpital Hédi Chaker',
    city: 'Sfax',
    address: 'Route El Aïn km 0.5',
    phone: '74 244 000',
    position: [34.7296, 10.7646],
    services: ['Cardiologie', 'Neurologie', 'Chirurgie']
  },
  {
    id: 8,
    name: 'Hôpital Universitaire Farhat Hached',
    city: 'Sousse',
    address: 'Avenue Ibn El Jazzar',
    phone: '73 222 000',
    position: [35.8288, 10.6339],
    services: ['Médecine Interne', 'Pédiatrie', 'Urgences']
  },
  {
    id: 9,
    name: 'Hôpital Régional de Gabès',
    city: 'Gabès',
    address: 'Route de Matmata',
    phone: '75 274 000',
    position: [33.8815, 10.0982],
    services: ['Médecine Générale', 'Pédiatrie', 'Maternité']
  },
  {
    id: 10,
    name: 'Hôpital Militaire de Tunis',
    city: 'Tunis',
    address: 'Montplaisir',
    phone: '71 780 000',
    position: [36.8337, 10.1896],
    services: ['Médecine Militaire', 'Chirurgie', 'Rééducation']
  },
  {
    id: 11,
    name: 'Hôpital La Rabta',
    city: 'Tunis',
    address: 'Jabbari 1007',
    phone: '71 573 000',
    position: [36.8048, 10.1643],
    services: ['Neurologie', 'Pédiatrie', 'Chirurgie']
  },
  {
    id: 12,
    name: 'Hôpital Habib Thameur',
    city: 'Tunis',
    address: 'Place du Rassemblement',
    phone: '71 280 000',
    position: [36.7909, 10.1813],
    services: ['Médecine Interne', 'Ophtalmologie', 'ORL']
  },
  {
    id: 13,
    name: 'Hôpital Sahloul',
    city: 'Sousse',
    address: 'Route Ceinture Sahloul',
    phone: '73 369 000',
    position: [35.8254, 10.6084],
    services: ['Cardiologie', 'Maternité', 'Pédiatrie']
  },
  {
    id: 14,
    name: 'Hôpital Fattouma Bourguiba',
    city: 'Monastir',
    address: 'Rue du 1er Juin 1955',
    phone: '73 462 000',
    position: [35.7787, 10.8269],
    services: ['Chirurgie', 'Médecine Interne', 'Urgences']
  },
  {
    id: 15,
    name: 'Hôpital Tahar Sfar',
    city: 'Mahdia',
    address: 'Route de la Plage',
    phone: '73 694 000',
    position: [35.5049, 11.0622],
    services: ['Médecine Générale', 'Pédiatrie', 'Radiologie']
  },
  {
    id: 16,
    name: 'Hôpital Hédi Chaker',
    city: 'Sfax',
    address: 'Route El Aïn km 0.5',
    phone: '74 244 000',
    position: [34.7296, 10.7646],
    services: ['Cardiologie', 'Neurologie', 'Chirurgie']
  },
  {
    id: 17,
    name: 'Hôpital Universitaire Farhat Hached',
    city: 'Sousse',
    address: 'Avenue Ibn El Jazzar',
    phone: '73 222 000',
    position: [35.8288, 10.6339],
    services: ['Médecine Interne', 'Pédiatrie', 'Urgences']
  },
  {
    id: 18,
    name: 'Hôpital Régional de Gabès',
    city: 'Gabès',
    address: 'Route de Matmata',
    phone: '75 274 000',
    position: [33.8815, 10.0982],
    services: ['Médecine Générale', 'Pédiatrie', 'Maternité']
  },
  {
    id: 19,
    name: 'Hôpital Militaire de Tunis',
    city: 'Tunis',
    address: 'Montplaisir',
    phone: '71 780 000',
    position: [36.8337, 10.1896],
    services: ['Médecine Militaire', 'Chirurgie', 'Rééducation']
  }
];

// Component to handle map view changes
const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

const SearchForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [filteredHospitals, setFilteredHospitals] = useState(tunisianHospitals);
  const [mapCenter, setMapCenter] = useState([34, 9]); // Center of Tunisia
  const [mapZoom, setMapZoom] = useState(6);

  // Extract unique cities and services
  const cities = [...new Set(tunisianHospitals.map(hospital => hospital.city))];
  const allServices = [...new Set(tunisianHospitals.flatMap(hospital => hospital.services))];

  // Filter hospitals based on selected city and service
  useEffect(() => {
    let result = [...tunisianHospitals];
    
    if (selectedCity) {
      result = result.filter(hospital => hospital.city === selectedCity);
    }
    
    if (selectedService) {
      result = result.filter(hospital => 
        hospital.services.some(service => 
          service.toLowerCase().includes(selectedService.toLowerCase())
        )
      );
    }
    
    setFilteredHospitals(result);
    
    // Update map view if a city is selected
    if (selectedCity && result.length > 0) {
      const firstHospital = result[0];
      setMapCenter(firstHospital.position);
      setMapZoom(12);
    } else if (!selectedCity) {
      setMapCenter([34, 9]);
      setMapZoom(6);
    }
  }, [selectedCity, selectedService]);

  const handleSearch = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleHospitalClick = (hospital) => {
    setMapCenter(hospital.position);
    setMapZoom(14);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-filters">
          <div className="filter-group">
            <label htmlFor="city">Ville</label>
            <select 
              id="city" 
              value={selectedCity || ''} 
              onChange={(e) => setSelectedCity(e.target.value || null)}
              className="filter-select"
            >
              <option value="">Toutes les villes</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="service">Service</label>
            <select 
              id="service" 
              value={selectedService || ''} 
              onChange={(e) => setSelectedService(e.target.value || null)}
              className="filter-select"
            >
              <option value="">Tous les services</option>
              {allServices.map(service => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>
          </div>
          
          <button 
            type="submit" 
            className="search-button"
            disabled={isLoading}
          >
            <FaSearch className="search-icon" />
            {isLoading ? 'Recherche...' : 'Rechercher'}
          </button>
        </div>
      </form>

      <div className="map-container">
        <MapContainer 
          center={mapCenter} 
          zoom={mapZoom} 
          style={{ height: '500px', width: '100%', borderRadius: '8px' }}
          zoomControl={false}
        >
          <ChangeView center={mapCenter} zoom={mapZoom} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {filteredHospitals.map(hospital => (
            <Marker 
              key={hospital.id} 
              position={hospital.position} 
              icon={hospitalIcon}
              eventHandlers={{
                click: () => handleHospitalClick(hospital),
              }}
            >
              <Popup>
                <div className="hospital-popup">
                  <h4 className="font-bold">{hospital.name}</h4>
                  <p className="text-sm text-gray-600">{hospital.city}</p>
                  <p className="text-sm"><FaMapMarkedAlt className="inline mr-1" /> {hospital.address}</p>
                  <p className="text-sm"><FaPhone className="inline mr-1" /> {hospital.phone}</p>
                  <div className="mt-2">
                    <span className="text-xs font-semibold">Services:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {hospital.services.map((service, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="hospitals-list">
        <h3 className="text-xl font-semibold mb-4">
          {filteredHospitals.length} Hôpital{filteredHospitals.length !== 1 ? 'x' : ''} trouvé{filteredHospitals.length !== 1 ? 's' : ''}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHospitals.map(hospital => (
            <div 
              key={hospital.id} 
              className="hospital-card"
              onClick={() => handleHospitalClick(hospital)}
            >
              <div className="hospital-card-header">
                <FaHospital className="hospital-icon" />
                <h4 className="hospital-name">{hospital.name}</h4>
              </div>
              <div className="hospital-details">
                <p className="hospital-address">
                  <FaMapMarkerAlt className="inline mr-1" />
                  {hospital.address}, {hospital.city}
                </p>
                <p className="hospital-phone">
                  <FaPhone className="inline mr-1" />
                  {hospital.phone}
                </p>
                <div className="hospital-services">
                  <span className="services-label">Services:</span>
                  <div className="services-tags">
                    {hospital.services.slice(0, 3).map((service, idx) => (
                      <span key={idx} className="service-tag">{service}</span>
                    ))}
                    {hospital.services.length > 3 && (
                      <span className="more-tag">+{hospital.services.length - 3} plus</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchForm;
