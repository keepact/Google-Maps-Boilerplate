import React, { useState, useEffect } from 'react';

import {
  getLanguage,
  getUserLocation,
  requestLocationPermission,
} from './services';

import MapComponent from './Map';
import Context from './context';

import './config/ReactotronConfig';

navigator.geolocation = require('@react-native-community/geolocation');

const App = () => {
  const [currentPosition, setCurrentPosition] = useState({});
  const [locale, setLocale] = useState({});

  const getPosition = async () => {
    try {
      const permission = await requestLocationPermission();

      if (permission) {
        const location = await getUserLocation();
        const { latitude, longitude } = location.coords;

        setCurrentPosition({
          latitude,
          longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        });
      }
    } catch (err) {
      console.tron.log(err);
    }
    return null;
  };

  useEffect(() => {
    getPosition();
    setLocale(getLanguage());
  }, []);

  return (
    <Context.Provider value={[currentPosition, setCurrentPosition, locale]}>
      <MapComponent />
    </Context.Provider>
  );
};

export default App;
