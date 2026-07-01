import { createContext, useContext, useCallback, useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useHelpers';
import api, { getData } from '../services/api';
import { useCmsContent } from './CmsContext';

const LocationContext = createContext(null);

export function LocationProvider({ children }) {
  const [selectedLocation, setSelectedLocation] = useLocalStorage('mart_location', null);
  const locationsData = useCmsContent('locations');
  const [locations, setLocations] = useState(locationsData.locations || []);
  const selectConfig = locationsData.selectLocation || {};

  useEffect(() => {
    api.get('/locations')
      .then((res) => {
        const data = getData(res) || [];
        setLocations(data.map((l) => ({ id: l.slug, name: l.name, icon: l.icon, lat: l.lat, lng: l.lng })));
      })
      .catch(() => setLocations(locationsData.locations || []));
  }, [locationsData.locations]);

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
