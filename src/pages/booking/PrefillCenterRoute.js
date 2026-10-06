import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { centersAPI } from '../../services/api';
import { useTranslation } from 'react-i18next';

export default function PrefillCenterRoute() {
  const { centerId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('PrefillCenterRoute mounted with centerId:', centerId);
    console.log('Location state:', location.state);
    
    const run = async () => {
      try {
        setIsLoading(true);
        
        // First check if we have prefill data in the location state
        const statePrefill = location.state?.prefillData;
        
        if (statePrefill) {
          console.log('Using prefill data from location state:', statePrefill);
          // Store in localStorage for persistence
          localStorage.setItem('bookingPrefill', JSON.stringify(statePrefill));
          
          // If we have a centerId in the prefill data, use that
          const targetCenterId = statePrefill.centerId || centerId;
          
          if (targetCenterId) {
            console.log('Fetching center data for ID:', targetCenterId);
            const data = await centersAPI.getById(targetCenterId);
            const center = data?.center || data;
            
            if (center) {
              console.log('Center data loaded:', center);
              localStorage.setItem('selectedCenter', JSON.stringify(center));
              
              // Navigate to patient info with prefill data
              navigate('/booking/patient-info', { 
                state: { prefillData: statePrefill },
                replace: true 
              });
              return;
            }
          }
        }
        
        // If we get here, either no prefill data or center fetch failed
        // Try to get prefill data from localStorage as fallback
        const storedPrefill = JSON.parse(localStorage.getItem('bookingPrefill') || '{}');
        console.log('Stored prefill data:', storedPrefill);
        
        if (storedPrefill.selectedDate && storedPrefill.selectedTime) {
          console.log('Using stored prefill data');
          navigate('/booking/patient-info', { 
            state: { prefillData: storedPrefill },
            replace: true 
          });
          return;
        }
        
        // If we still don't have prefill data, go to date-time selection
        console.log('No prefill data available, redirecting to date-time selection');
        navigate('/booking/datetime', { replace: true });
        
      } catch (e) {
        console.error('Error in PrefillCenterRoute:', e);
        setError(e.message || 'Failed to load booking information');
      } finally {
        setIsLoading(false);
      }
    };
    
    run();
    
    // Cleanup function to ensure we don't leave stale data
    return () => {
      localStorage.removeItem('bookingPrefill');
    };
  }, [centerId, navigate]);

  return <div style={{ padding: 24 }}>Préparation de la réservation...</div>;
}
