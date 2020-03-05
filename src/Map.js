import React, { useState, useRef, useEffect } from 'react';

import { View, Text, Platform, Alert } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';

import getDirections from 'react-native-google-maps-directions';
import GooglePlacesInput from './componentes/AutoComplete';
import MapDirections from './componentes/DirectionsService';

import { getUserLocation, requestLocationPermission } from './services';

import {
  copyArray,
  arrayFormatter,
  getAddressData,
  getCoordinatesData,
  overiedFirstInput,
  overiedLastInput,
} from './util/format';

import {
  mapStyle,
  Container,
  InputsContainer,
  InputContent,
  IconLigature,
  ButtonNavigate,
  RouteData,
  BoldText,
  RouteText,
  OverlayData,
  DescriptionContainer,
} from './styles';

function MapComponent() {
  const [address, setAddress] = useState([]);
  const [coordinates, setCoordinates] = useState([]);
  const [currentPosition, setCurrentPosition] = useState({});
  const [routeStatus, setRouteStatus] = useState({});
  const [selection, setSelection] = useState({});

  const { width, height } = mapStyle.dimensions;

  const ref = useRef({
    firstInput: '',
    secondInput: '',
    mapView: '',
  });

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
      Alert.alert('There was an error in getting latitude and longitude.');
    }
  };

  useEffect(() => {
    getPosition();
  }, []);

  const handleClearInput = route => {
    if (route === 'start') {
      ref.current.firstInput.setAddressText('');
      ref.current.firstInput.value = '';
    } else {
      ref.current.secondInput.setAddressText('');
      ref.current.secondInput.value = '';
    }

    if (coordinates.length >= 2) {
      const cloneAddress = copyArray(address);
      const cloneCoords = copyArray(coordinates);

      const newAddress = arrayFormatter(cloneAddress, route);
      const newCoords = arrayFormatter(cloneCoords, route);

      setAddress([newAddress]);
      setCoordinates([newCoords]);
      setRouteStatus({});
    } else if (coordinates.length === 1) {
      setAddress([]);
      setCoordinates([]);
      setRouteStatus({});
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
        {currentPosition.latitude && currentPosition.longitude && (
          <MapView
            ref={c => (ref.current.mapView = c)}
            provider={PROVIDER_GOOGLE}
            style={mapStyle.dimensions}
            showsUserLocation
            initialRegion={currentPosition}>
            {coordinates.length >= 2 &&
              coordinates.map((coordinate, index) => (
                <Marker key={`coordinate_${index}`} coordinate={coordinate}>
                  <Callout>
                    <DescriptionContainer>
                      <BoldText>{address[index].area}</BoldText>
                      <Text>{address[index].address}</Text>
                    </DescriptionContainer>
                  </Callout>
                </Marker>
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
        )}
        <InputsContainer>
          <InputContent>
            <GooglePlacesInput
              reference={c => (ref.current.firstInput = c)}
              location={currentPosition}
              selection={Platform.OS === 'android' ? selection : undefined}
              placeholder="Type start of route"
              label="A"
              top={100}
              onFocus={() => setSelection({})}
              onBlur={() =>
                setSelection({
                  start: 0,
                  end: 0,
                })
              }
              onPress={() => handleClearInput('start')}
              onSubmit={(data, details = null) => {
                ref.current.firstInput.value = 'value';

                setAddress(
                  address.length === 2 ||
                    (address.length === 1 && !ref.current.secondInput.value)
                    ? overiedFirstInput(address, getAddressData(data))
                    : [getAddressData(data), ...address],
                );
                setCoordinates(
                  coordinates.length === 2 ||
                    (coordinates.length === 1 && !ref.current.secondInput.value)
                    ? overiedFirstInput(
                        coordinates,
                        getCoordinatesData(details),
                      )
                    : [getCoordinatesData(details), ...coordinates],
                );
              }}
            />

            <IconLigature />

            <GooglePlacesInput
              reference={c => (ref.current.secondInput = c)}
              selection={Platform.OS === 'android' ? selection : undefined}
              location={currentPosition}
              placeholder="Enter destination"
              label="B"
              top={50}
              onFocus={() => setSelection({})}
              onBlur={() =>
                setSelection({
                  start: 0,
                  end: 0,
                })
              }
              onPress={() => handleClearInput('end')}
              onSubmit={(data, details = null) => {
                ref.current.secondInput.value = 'value';

                setAddress(
                  address.length === 2 || !ref.current.firstInput.value
                    ? overiedLastInput(address, getAddressData(data))
                    : [...address, getAddressData(data)],
                );
                setCoordinates(
                  coordinates.length === 2 || !ref.current.firstInput.value
                    ? overiedLastInput(coordinates, getCoordinatesData(details))
                    : [...coordinates, getCoordinatesData(details)],
                );
              }}
            />
          </InputContent>
        </InputsContainer>
      </Container>
      {coordinates.length >= 2 && (
        <OverlayData>
          {!isNaN(routeStatus.distance) && !isNaN(routeStatus.duration) && (
            <RouteData>
              <RouteText>
                {routeStatus.distance > 1
                  ? `${Math.trunc(routeStatus.distance)} km`
                  : `${routeStatus.distance * 1000} m`}
              </RouteText>
              <RouteText>{Math.trunc(routeStatus.duration)} min</RouteText>
            </RouteData>
          )}

          <ButtonNavigate onPress={handleGetGoogleMapDirections}>
            <BoldText>Start</BoldText>
          </ButtonNavigate>
        </OverlayData>
      )}
    </View>
  );
}

export default MapComponent;
