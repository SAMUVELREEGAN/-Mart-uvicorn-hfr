import { createContext, useContext, useCallback } from 'react';
import locationsData from '../json/locations.json';
import { useLocalStorage } from '../hooks/useHelpers';

const LocationContext = createContext(null);

export function LocationProvider({ children }) {
  const [selectedLocation, setSelectedLocation] = useLocalStorage('mart_location', null);
  const locations = locationsData.locations;
  const selectConfig = locationsData.selectLocation;

  const selectLocation = useCallback((location) => {
    setSelectedLocation(location);
  }, [setSelectedLocation]);

  const clearLocation = useCallback(() => {
    setSelectedLocation(null);
  }, [setSelectedLocation]);

  return (
    <LocationContext.Provider value={{
      locations, selectedLocation, selectLocation, clearLocation, selectConfig,
    }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocation must be used within LocationProvider');
  return ctx;
}
