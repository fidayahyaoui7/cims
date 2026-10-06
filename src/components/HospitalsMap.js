import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTranslation } from 'react-i18next';
import { FaMapMarkerAlt, FaPhone, FaHospital, FaGlobe } from 'react-icons/fa';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const HospitalsMap = () => {
  const { t, i18n } = useTranslation();
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [center, setCenter] = useState([33.8869, 9.5375]); // Center of Tunisia
  const [selectedRegion, setSelectedRegion] = useState('all');

  // Sample hospital data - replace with your actual data source
  const sampleHospitals = [
    {
      id: 1,
      name: 'Hôpital Charles Nicolle',
      name_ar: 'مستشفى شارل نيكول',
      type: 'public',
      region: 'Tunis',
      region_ar: 'تونس',
      address: 'Boulevard 9 Avril, Tunis 1006',
      phone: '+216 71 578 000',
      lat: 36.8065,
      lng: 10.1815
    },
    // Add more hospitals here
  ];

  useEffect(() => {
    // In a real app, fetch hospitals from your API
    setHospitals(sampleHospitals);
    setLoading(false);
  }, []);

  const filteredHospitals = selectedRegion === 'all' 
    ? hospitals 
    : hospitals.filter(h => h.region === selectedRegion);

  const ChangeView = ({ center, zoom }) => {
    const map = useMap();
    map.setView(center, zoom);
    return null;
  };

  if (loading) {
    return <div className="text-center py-8">{t('loading')}...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        {i18n.language === 'ar' ? 'خريطة المستشفيات في تونس' : 'Carte des Hôpitaux en Tunisie'}
      </h1>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('filter_by_region')}:
        </label>
        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="w-full md:w-64 p-2 border border-gray-300 rounded-md"
        >
          <option value="all">{t('all_regions')}</option>
          <option value="Tunis">{i18n.language === 'ar' ? 'تونس' : 'Tunis'}</option>
          {/* Add more regions */}
        </select>
      </div>

      <div className="h-[600px] w-full rounded-lg overflow-hidden shadow-lg">
        <MapContainer 
          center={center} 
          zoom={7} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <ChangeView center={center} zoom={7} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {filteredHospitals.map((hospital) => (
            <Marker 
              key={hospital.id} 
              position={[hospital.lat, hospital.lng]}
              icon={L.icon({
                iconUrl: '/hospital-marker.png', // Add your custom marker icon
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                popupAnchor: [0, -32]
              })}
            >
              <Popup>
                <div className="space-y-2">
                  <h3 className="font-bold text-lg">
                    {i18n.language === 'ar' ? hospital.name_ar : hospital.name}
                  </h3>
                  <div className="flex items-center">
                    <FaHospital className="text-blue-600 mr-2" />
                    <span>{t(hospital.type === 'public' ? 'public_hospital' : 'private_clinic')}</span>
                  </div>
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="text-red-500 mr-2" />
                    <span>{hospital.address}</span>
                  </div>
                  {hospital.phone && (
                    <div className="flex items-center">
                      <FaPhone className="text-green-600 mr-2" />
                      <a href={`tel:${hospital.phone}`} className="hover:underline">
                        {hospital.phone}
                      </a>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default HospitalsMap;
