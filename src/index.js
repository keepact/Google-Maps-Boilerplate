import React from 'react';

import MapComponent from './Map';
import './config/ReactotronConfig';

navigator.geolocation = require('@react-native-community/geolocation');

const App = () => <MapComponent />;

export default App;
