import React, { useState, useRef } from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { View, Dimensions, Text } from 'react-native';

import getDirections from 'react-native-google-maps-directions';
import GooglePlacesInput from './componentes/AutoComplete';
import MapDirections from './componentes/DirectionsService';

import {
  Container,
  InputsContainer,
  InputContent,
  IconLigature,
  ButtonNavigate,
  RouteData,
  ButtonText,
  RouteText,
  style,
  OverlayData,
} from './styles';

function MapComponent() {
  const { width, height } = Dimensions.get('window');

  const [coordinates, setCoordinates] = useState([]);
  const [routeStatus, setRouteStatus] = useState({});

  const ref = useRef({
    firstInput: '',
    secondInput: '',
    mapView: {},
    initialRoute: {},
    routeStatus: {},
  });

  const handleClearInput = (e, route) => {
    if (coordinates.length >= 2) setCoordinates({});

    if (ref.current.firstInput && route === 'start') {
      ref.current.firstInput.setAddressText('');
    } else if (ref.current.secondInput && route === 'end') {
      ref.current.secondInput.setAddressText('');
    }
  };

  const handleGetGoogleMapDirections = () => {
    const data = {
      source: coordinates[0],
      destination: coordinates[coordinates.length - 1],
      params: [
        {
          key: 'travelmode',
          value: 'driving',
        },
      ],
    };

    getDirections(data);
  };

  return (
    <View>
      <Container>
        <MapView
          ref={c => (ref.current.mapView = c)}
          provider={PROVIDER_GOOGLE}
          style={style.mapStyle}
          showsUserLocation
          initialRegion={{
            latitude: -22.9035,
            longitude: -43.2096,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}>
          {coordinates.length >= 2 &&
            coordinates.map((coordinate, index) => (
              <MapView.Marker
                key={`coordinate_${index}`}
                coordinate={coordinate}>
                <MapView.Callout onPress={handleGetGoogleMapDirections}>
                  <Text>Pressione para realizar a rota</Text>
                </MapView.Callout>
              </MapView.Marker>
            ))}
          {coordinates.length >= 2 && (
            <MapDirections
              waypoints={
                coordinates.length > 2 ? coordinates.slice(1, -1) : null
              }
              origin={coordinates[0]}
              destination={coordinates[coordinates.length - 1]}
              onReady={result => {
                setRouteStatus({
                  distance: result.distance,
                  duration: result.duration,
                });

                ref.current.mapView.fitToCoordinates(result.coordinates, {
                  edgePadding: {
                    right: width / 20,
                    bottom: height / 20,
                    left: width / 20,
                    top: height / 20,
                  },
                });
              }}
            />
          )}
        </MapView>
        <InputsContainer>
          <InputContent>
            <GooglePlacesInput
              reference={c => (ref.current.firstInput = c)}
              placeholder="Digite ínicio da rota"
              label="A"
              top={150}
              onPress={e => handleClearInput(e, 'start')}
              onSubmit={(data, details = null) => {
                ref.current.initialRoute = {
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng,
                };
              }}
            />
            <IconLigature />
            <GooglePlacesInput
              reference={c => (ref.current.secondInput = c)}
              placeholder="Digite o destino"
              label="B"
              top={60}
              onPress={e => handleClearInput(e, 'end')}
              onSubmit={(data, details = null) => {
                setCoordinates([
                  {
                    latitude: ref.current.initialRoute.latitude,
                    longitude: ref.current.initialRoute.longitude,
                  },
                  {
                    latitude: details.geometry.location.lat,
                    longitude: details.geometry.location.lng,
                  },
                ]);
              }}
            />
          </InputContent>
        </InputsContainer>
      </Container>
      {coordinates.length >= 2 && (
        <OverlayData>
          {!isNaN(routeStatus.distance) && !isNaN(routeStatus.duration) && (
            <RouteData>
              <RouteText>{Math.trunc(routeStatus.distance)} km</RouteText>
              <RouteText>{Math.trunc(routeStatus.duration)} min</RouteText>
            </RouteData>
          )}

          <ButtonNavigate onPress={handleGetGoogleMapDirections}>
            <ButtonText>Iniciar</ButtonText>
          </ButtonNavigate>
        </OverlayData>
      )}
    </View>
  );
}

export default MapComponent;
