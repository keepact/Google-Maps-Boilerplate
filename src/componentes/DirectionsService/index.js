import React from 'react';
import PropTypes from 'prop-types';

import MapViewDirections from 'react-native-maps-directions';
import { GOOGLE_KEY } from 'react-native-dotenv';

function MapDirections({ waypoints, origin, destination, onReady }) {
  return (
    <MapViewDirections
      waypoints={waypoints}
      origin={origin}
      destination={destination}
      apikey={GOOGLE_KEY}
      strokeWidth={3}
      strokeColor="hotpink"
      optimizeWaypoints
      onStart={params => {
        console.tron.log(
          `Started routing between "${params.origin}" and "${params.destination}"`,
        );
      }}
      onReady={onReady}
      onError={errorMessage => {
        console.tron.log(errorMessage);
      }}
    />
  );
}

MapDirections.defaultProps = {
  waypoints: {},
};

MapDirections.propTypes = {
  waypoints: PropTypes.oneOfType([PropTypes.object]),
  origin: PropTypes.oneOfType([PropTypes.object]).isRequired,
  destination: PropTypes.oneOfType([PropTypes.object]).isRequired,
  onReady: PropTypes.func.isRequired,
};

export default MapDirections;
