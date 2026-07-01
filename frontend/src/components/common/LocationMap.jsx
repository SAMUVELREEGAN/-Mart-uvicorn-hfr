import { useCmsContent } from '../../contexts';
import { useMemo, useState } from 'react';
import { useLocation } from '../../contexts/LocationContext';
import { Icon } from '../../utils/iconResolver';
import Button from '../common/Button';
import './LocationMap.css';

function haversineKm(lat1, lng1, lat2, lng2) {
  const toRad = (d) => (d * Math.PI) / 180;
  const r = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return r * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getBounds(locList) {
  const withCoords = locList.filter((l) => l.lat != null && l.lng != null);
  if (!withCoords.length) return null;
  return withCoords.reduce(
    (acc, loc) => ({
      minLat: Math.min(acc.minLat, loc.lat),
      maxLat: Math.max(acc.maxLat, loc.lat),
      minLng: Math.min(acc.minLng, loc.lng),
      maxLng: Math.max(acc.maxLng, loc.lng),
    }),
    {
      minLat: withCoords[0].lat,
      maxLat: withCoords[0].lat,
      minLng: withCoords[0].lng,
      maxLng: withCoords[0].lng,
    },
  );
}

function getPinPosition(loc, bounds) {
  const latSpan = bounds.maxLat - bounds.minLat || 1;
  const lngSpan = bounds.maxLng - bounds.minLng || 1;
  return {
    left: `${((loc.lng - bounds.minLng) / lngSpan) * 100}%`,
    top: `${((bounds.maxLat - loc.lat) / latSpan) * 100}%`,
  };
}

export default function LocationMap({
  variant = 'home',
  draftLocation,
  onDraftChange,
  onConfirm,
}) {
  const locationsData = useCmsContent('locations');
  const { locations, selectedLocation, selectLocation, selectConfig } = useLocation();
  const mapConfig = locationsData.map;
  const variantConfig = locationsData.variants?.[variant] || {};
  const isModal = variant === 'modal';
  const [searchQuery, setSearchQuery] = useState('');

  const activeLocation = isModal ? (draftLocation ?? selectedLocation) : selectedLocation;

  const embedUrl = useMemo(() => {
    const target = activeLocation || locations[0];
    if (!target?.lat || !target?.lng) {
      const first = locations[0];
      const pad = mapConfig.bboxPadding || 0.08;
      const bbox = `${first.lng - pad},${first.lat - pad},${first.lng + pad},${first.lat + pad}`;
      return `${mapConfig.embedBase}?bbox=${bbox}&layer=mapnik&marker=${first.lat}%2C${first.lng}`;
    }
    const pad = mapConfig.bboxPadding || 0.08;
    const { lat, lng } = target;
    const bbox = `${lng - pad},${lat - pad},${lng + pad},${lat + pad}`;
    return `${mapConfig.embedBase}?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
  }, [activeLocation, locations, mapConfig]);

  const bounds = useMemo(() => getBounds(locations), [locations]);

  const filteredLocations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return locations;
    return locations.filter((loc) => loc.name.toLowerCase().includes(q));
  }, [locations, searchQuery]);

  const handleSelect = (loc) => {
    if (isModal && onDraftChange) {
      onDraftChange(loc);
      return;
    }
    selectLocation(loc);
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      let nearest = locations[0];
      let minDist = Infinity;
      locations.forEach((loc) => {
        if (!loc.lat || !loc.lng) return;
        const d = haversineKm(latitude, longitude, loc.lat, loc.lng);
        if (d < minDist) {
          minDist = d;
          nearest = loc;
        }
      });
      const located = { ...nearest, userLat: latitude, userLng: longitude };
      if (isModal && onDraftChange) {
        onDraftChange(located);
      } else {
        selectLocation(located);
      }
    });
  };

  const handleConfirm = () => {
    if (activeLocation) selectLocation(activeLocation);
    onConfirm?.();
  };

  const showPickerLabel = variantConfig.showPickerLabel ?? !isModal;
  const showSearch = variantConfig.showSearch ?? isModal;
  const pickerLabel = variantConfig.pickerLabel || mapConfig.manualSelectLabel;

  return (
    <div className={`location-map location-map--${variant}`}>
      <div className="location-map__header">
        <div>
          <h3 className="location-map__title">{selectConfig.title}</h3>
          <p className="location-map__subtitle">{selectConfig.subtitle}</p>
        </div>
        <Button
          label={mapConfig.currentLocationButton.label}
          icon={mapConfig.currentLocationButton.icon}
          variant="outline"
          size="sm"
          onClick={handleCurrentLocation}
        />
      </div>

      <div className="location-map__body">
        <div className="location-map__frame-wrap">
          <iframe
            title={selectConfig.title}
            className="location-map__frame"
            src={embedUrl}
            loading="lazy"
          />
          {bounds && isModal && (
            <div className="location-map__pins" aria-hidden="true">
              {filteredLocations.map((loc) => {
                if (!loc.lat || !loc.lng) return null;
                const pos = getPinPosition(loc, bounds);
                const isActive = activeLocation?.id === loc.id;
                return (
                  <button
                    key={loc.id}
                    type="button"
                    className={`location-map__pin ${isActive ? 'location-map__pin--active' : ''}`}
                    style={{ left: pos.left, top: pos.top }}
                    onClick={() => handleSelect(loc)}
                    aria-label={loc.name}
                  >
                    <Icon name={loc.icon || selectConfig.icon} />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="location-map__picker">
          {showSearch && (
            <div className="location-map__search">
              <Icon name={mapConfig.searchIcon || 'FaSearch'} className="location-map__search-icon" />
              <input
                type="search"
                className="location-map__search-input"
                placeholder={variantConfig.searchPlaceholder || mapConfig.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label={variantConfig.searchPlaceholder || mapConfig.searchPlaceholder}
              />
            </div>
          )}
          {showPickerLabel && pickerLabel && (
            <p className="location-map__picker-label">{pickerLabel}</p>
          )}
          <div className="location-map__chips">
            {filteredLocations.map((loc) => (
              <button
                key={loc.id}
                type="button"
                className={`location-map__chip ${activeLocation?.id === loc.id ? 'location-map__chip--active' : ''}`}
                onClick={() => handleSelect(loc)}
              >
                <Icon name={loc.icon || selectConfig.icon} />
                <span>{loc.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {isModal && (
        <div className="location-map__footer">
          <Button
            label={mapConfig.confirmButton.label}
            icon={mapConfig.confirmButton.icon}
            variant="primary"
            onClick={handleConfirm}
            disabled={!activeLocation}
          />
        </div>
      )}
    </div>
  );
}
