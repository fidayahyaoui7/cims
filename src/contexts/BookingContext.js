import { createContext, useContext, useState, useCallback, useEffect } from 'react';

// Storage key for persisting booking data
const STORAGE_KEY = 'booking_data';

// Create the context with a default value
const BookingContext = createContext({
  bookingData: null,
  updateBookingData: () => {},
  nextStep: () => {},
  prevStep: () => {},
  resetBooking: () => {},
  clearBooking: () => {}
});

export const BookingProvider = ({ children }) => {
  const [bookingData, setBookingData] = useState(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {
      center: null,
      doctor: null,
      date: null,
      time: null,
      radiologyType: null,
      region: null,
      status: 'draft',
      step: 1,
      patientInfo: {
        name: '',
        email: '',
        phone: '',
        notes: ''
      }
    };
  });

  // Persist to localStorage whenever bookingData changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookingData));
  }, [bookingData]);

  const updateBookingData = useCallback((newData) => {
    if (!newData || typeof newData !== 'object') {
      console.warn('Invalid data provided to updateBookingData:', newData);
      return;
    }
    
    console.group('Updating Booking Data');
    console.log('Current state:', bookingData);
    console.log('New data to merge:', newData);
    
    setBookingData(prev => {
      // Start with a fresh copy of the previous state
      const updated = { ...prev };
      
      // Handle center data separately to ensure proper merging
      if (newData.center) {
        updated.center = {
          ...(prev.center || {}),
          ...newData.center
        };
      }
      
      // Handle patient info separately to ensure proper merging
      if (newData.patientInfo) {
        updated.patientInfo = {
          ...(prev.patientInfo || {}),
          ...newData.patientInfo
        };
      }
      
      // Handle other data
      Object.keys(newData).forEach(key => {
        if (key !== 'center' && key !== 'patientInfo') {
          updated[key] = newData[key];
        }
      });
      
      console.log('Updated booking data:', updated);
      console.groupEnd();
      return updated;
    });
  }, [bookingData]); // Add bookingData to dependency array

  const nextStep = useCallback((data = {}) => {
    console.group('nextStep called');
    console.log('Current step:', bookingData?.step);
    console.log('Incoming data:', data);
    
    setBookingData(prev => {
      const newStep = Math.min((prev.step || 0) + 1, 5);
      console.log('New step will be:', newStep);
      
      // Deep merge patientInfo if it exists
      let mergedData = { ...prev };
      
      if (data.patientInfo) {
        mergedData = {
          ...mergedData,
          patientInfo: {
            ...(mergedData.patientInfo || {}),
            ...data.patientInfo
          }
        };
        console.log('Merged patient info:', mergedData.patientInfo);
      }
      
      // Merge other data
      const { patientInfo: _, ...otherData } = data;
      const updated = {
        ...mergedData,
        ...otherData,
        step: newStep
      };
      
      console.log('Updated booking data:', updated);
      console.groupEnd();
      return updated;
    });
  }, [bookingData?.step]);

  const prevStep = useCallback(() => {
    setBookingData(prev => ({
      ...prev,
      step: Math.max(prev.step - 1, 1)
    }));
  }, []);

  const resetBooking = useCallback(() => {
    setBookingData({
      center: null,
      doctor: null,
      date: null,
      time: null,
      patientInfo: {
        name: '',
        email: '',
        phone: '',
        notes: ''
      },
      status: 'cancelled',
      step: 1
    });
  }, []);

  const clearBooking = useCallback(() => {
    // Clear localStorage
    localStorage.removeItem(STORAGE_KEY);
    
    // Reset state
    setBookingData({
      center: null,
      doctor: null,
      date: null,
      time: null,
      patientInfo: {
        name: '',
        email: '',
        phone: '',
        notes: ''
      },
      status: 'cancelled',
      step: 1,
      radiologyType: null,
      region: null
    });
  }, []);

  return (
    <BookingContext.Provider 
      value={{
        bookingData,
        updateBookingData,
        nextStep,
        prevStep,
        resetBooking,
        clearBooking
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

export default BookingContext;
