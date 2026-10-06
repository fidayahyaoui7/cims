import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SimpleMap from '../components/SimpleMap';
import hospitalsData from '../data/hospitalsData';
import '../styles/MapPage.css';

// Coordinates for all Tunisian regions and cities with hospitals
const regionCoordinates = {
  // North East
  'tunis': { lat: 36.8065, lng: 10.1815 },
  'la_marsa': { lat: 36.8765, lng: 10.3256 },  // Added for Hôpital Mongi Slim
  'ariana': { lat: 36.8665, lng: 10.1647 },
  'ben_arous': { lat: 36.7435, lng: 10.2316 },
  'manouba': { lat: 36.8101, lng: 10.0966 },
  'bizerte': { lat: 37.2744, lng: 9.8749 },
  'menzel_bourguiba': { lat: 37.15, lng: 9.7833 },  // Added for Hôpital Habib Bougatfa
  'nabeul': { lat: 36.4561, lng: 10.7376 },
  'zaghouan': { lat: 36.4091, lng: 10.1428 },
  'beja': { lat: 36.7333, lng: 9.1833 },
  'jendouba': { lat: 36.5, lng: 8.7833 },
  'kef': { lat: 36.1833, lng: 8.7167 },
  'siliana': { lat: 36.0833, lng: 9.3667 },
  'kairouan': { lat: 35.6833, lng: 10.1 },
  'kasserine': { lat: 35.1667, lng: 8.8333 },
  'sidi_bouzid': { lat: 35.0333, lng: 9.5 },
  'sousse': { lat: 35.8254, lng: 10.641 },
  'msaken': { lat: 35.7333, lng: 10.5833 },  // Added for Hôpital 7 Novembre 1987
  'monastir': { lat: 35.7833, lng: 10.8 },
  'mahdia': { lat: 35.5, lng: 11.0667 },
  'ksar_hellal': { lat: 35.65, lng: 10.9 },  // Added for Hôpital Haj Ali Soua
  'sfax': { lat: 34.7333, lng: 10.7667 },
  'gabes': { lat: 33.8833, lng: 10.1167 },
  'medenine': { lat: 33.35, lng: 10.5 },
  'zarzis': { lat: 33.5, lng: 11.1167 },
  'tataouine': { lat: 32.9333, lng: 10.45 },
  'gafsa': { lat: 34.4167, lng: 8.7833 },
  'tozeur': { lat: 33.9167, lng: 8.1333 },
  'kebili': { lat: 33.7, lng: 8.9667 },
  'khereddine': { lat: 36.85, lng: 10.2 },
  'menzel_temime': { lat: 36.6833, lng: 10.95 },
  'kerkennah': { lat: 34.7, lng: 10.35 },  // Corrected coordinates for Kerkennah
  'moknine': { lat: 35.6333, lng: 10.95 },  // Added for Hôpital de Moknine
  'jebeniana': { lat: 35.0333, lng: 10.9167 },  // Corrected coordinates for Jebeniana
  'metlaoui': { lat: 34.3167, lng: 8.4 },  // Added for Hôpital de Metlaoui
  'el_kef': { lat: 36.1833, lng: 8.7167 },  // Added for Hôpital Régional du Kef
};

const MapPage = () => {
  const [hospitals, setHospitals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const searchQuery = location.state?.searchQuery || '';

  // Filter hospitals based on search query
  const filteredHospitals = useMemo(() => {
    if (!searchQuery) return hospitals;
    
    const query = searchQuery.toLowerCase();
    return hospitals.filter(hospital => 
      hospital.name.toLowerCase().includes(query) ||
      (hospital.city && hospital.city.toLowerCase().includes(query)) ||
      (hospital.region && hospital.region.toLowerCase().includes(query))
    );
  }, [hospitals, searchQuery]);

  useEffect(() => {
    // Process hospitals data to include coordinates
    const processedHospitals = hospitalsData.map(hospital => {
      // Clean and format city name for lookup
      const cleanCityName = (city) => {
        if (!city) return 'tunis';
        return city
          .toLowerCase()
          .replace(/ /g, '_')  // Replace spaces with underscores
          .replace(/'/g, '')   // Remove apostrophes
          .replace(/-/g, '_'); // Replace hyphens with underscores
      };

      const cityKey = cleanCityName(hospital.city);
      
      // Log the lookup for debugging
      if (!hospital.coordinates && !regionCoordinates[cityKey]) {
        console.warn(`No coordinates found for ${hospital.city} (key: ${cityKey}) - using default`);
      }
      
      // Use hospital's coordinates if available, otherwise use city/region coordinates
      const coordinates = hospital.coordinates || regionCoordinates[cityKey] || regionCoordinates['tunis'];
      
      return {
        ...hospital,
        // Ensure region is set, default to city if not available
        region: hospital.region || hospital.city || 'Tunis',
        position: {
          lat: coordinates.lat,
          lng: coordinates.lng
        }
      };
    });

    console.log('Processed hospitals:', processedHospitals);
    setHospitals(processedHospitals);
    setIsLoading(false);
  }, []);

  // Create markers from filtered hospitals with enhanced popups and click handlers
  // Add click handler for hospital details links
  useEffect(() => {
    const handleDetailsClick = (e) => {
      const detailsLink = e.target.closest('.hospital-details-link');
      if (detailsLink) {
        e.preventDefault();
        e.stopPropagation();
        const hospitalId = detailsLink.dataset.hospitalId;
        const hospital = filteredHospitals.find(h => h.id === hospitalId);
        if (hospital) {
          // Use the correct path for hospital details
          navigate(`/centers/${hospitalId}`, { 
            state: { 
              center: hospital,
              hospital: hospital // Include hospital in state for backward compatibility
            } 
          });
        }
      }
    };

    document.addEventListener('click', handleDetailsClick);
    return () => {
      
      document.removeEventListener('click', handleDetailsClick);
    };
  }, [filteredHospitals, navigate]);

  const hospitalMarkers = filteredHospitals.map(hospital => {
    // Create a more detailed popup content
    const popupContent = `
      <div class="hospital-popup min-w-[250px] p-3">
        <h3 class="text-lg font-bold text-blue-700 mb-1">${hospital.name}</h3>
        ${hospital.address ? `<p class="text-sm text-gray-700 mb-1">📍 ${hospital.address}</p>` : ''}
        <p class="text-sm text-gray-600 mb-2">🏥 ${hospital.city}, ${hospital.region}</p>
        <div class="border-t border-gray-200 my-2"></div>
        ${hospital.phone ? `
          <div class="flex items-center text-sm text-gray-700 mb-1">
            <span class="w-5">📞</span>
            <a href="tel:${hospital.phone}" class="hover:text-blue-600" onclick="event.stopPropagation();">${hospital.phone}</a>
          </div>` : ''}
        ${hospital.emergencyPhone ? `
          <div class="flex items-center text-sm text-red-600 font-medium mb-1">
            <span class="w-5">🆘</span>
            <a href="tel:${hospital.emergencyPhone}" class="hover:text-red-700" onclick="event.stopPropagation();">${hospital.emergencyPhone}</a>
          </div>` : ''}
        <div class="mt-3 pt-2 border-t border-gray-100 flex justify-end">
          <a href="#" 
             class="hospital-details-link text-sm text-blue-600 hover:text-blue-800 font-medium" 
             data-hospital-id="${hospital.id}"
             onclick="event.stopPropagation(); return false;">
            Voir les détails →
          </a>
        </div>
      </div>
    `;

    return {
      position: hospital.position,
      popup: popupContent,
      hospitalData: hospital
    };
  });

  // Calculate center based on filtered results or use default
  const mapCenter = useMemo(() => {
    if (filteredHospitals.length > 0) {
      // Calculate average position of all filtered hospitals
      const sum = filteredHospitals.reduce(
        (acc, hospital) => ({
          lat: acc.lat + hospital.position.lat,
          lng: acc.lng + hospital.position.lng
        }),
        { lat: 0, lng: 0 }
      );
      return {
        lat: sum.lat / filteredHospitals.length,
        lng: sum.lng / filteredHospitals.length
      };
    }
    return { lat: 35, lng: 9 }; // Default center for Tunisia
  }, [filteredHospitals]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Carte des Hôpitaux en Tunisie</h1>
        <p className="text-gray-600 mt-2">
          {searchQuery 
            ? `Résultats pour : ${searchQuery}`
            : 'Trouvez les hôpitaux et centres de santé en Tunisie'}
        </p>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="h-[600px] w-full">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredHospitals.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="text-gray-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Aucun hôpital trouvé</h3>
              <p className="mt-2 text-sm text-gray-500">
                Aucun hôpital ne correspond à votre recherche. Essayez avec d'autres termes.
              </p>
              <button
                onClick={() => navigate('/map')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Afficher tous les hôpitaux
              </button>
            </div>
          ) : (
            <SimpleMap 
              center={mapCenter}
              zoom={filteredHospitals.length === 1 ? 14 : 7}
              markers={hospitalMarkers}
            />
          )}
        </div>
        
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-600 rounded-full mr-2"></div>
              <span className="text-sm">Hôpitaux publics</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-600 rounded-full mr-2"></div>
              <span className="text-sm">Hôpitaux universitaires</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
