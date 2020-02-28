import React, { useState, useRef, useEffect } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import { View, Text, PermissionsAndroid, Alert } from 'react-native';

import Geolocation from 'react-native-geolocation-service';
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
  const [coordinates, setCoordinates] = useState([]);
  const [routeStatus, setRouteStatus] = useState({});
  const [address, setAddress] = useState([]);

  const { width, height } = style.mapStyle;

  const [position, setPosition] = useState({
    latitude: -22.9707112,
    longitude: -43.18644330000001,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

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

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Permissão de Localização',
          message: 'A aplicação precisa da permissão de localização.',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(
          pos => {
            setPosition({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            });
          },
          error => {
            console.tron.log(error);
            Alert.alert('Houve um erro ao pegar a latitude e longitude.');
          },
        );
      } else {
        Alert.alert('Permissão de localização não concedida');
      }
    } catch (err) {
      console.tron.log(err);
    }
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

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
            latitude: position.latitude,
            longitude: position.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}>
          {coordinates.length >= 2 &&
            coordinates.map((coordinate, index) => (
              <Marker key={`coordinate_${index}`} coordinate={coordinate}>
                <Callout>
                  <View style={{ width: 180 }}>
                    <Text>{address[index]}</Text>
                  </View>
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
        <InputsContainer>
          <InputContent>
            <GooglePlacesInput
              reference={c => (ref.current.firstInput = c)}
              placeholder="Digite ínicio da rota"
              label="A"
              top={100}
              onPress={e => handleClearInput(e, 'start')}
              onSubmit={(data, details = null) => {
                ref.current.initialRoute = {
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng,
                  startAddress: data.description,
                };
              }}
            />
            <IconLigature />
            <GooglePlacesInput
              reference={c => (ref.current.secondInput = c)}
              placeholder="Digite o destino"
              label="B"
              top={50}
              onPress={e => handleClearInput(e, 'end')}
              onSubmit={(data, details = null) => {
                setAddress([
                  ref.current.initialRoute.startAddress,
                  data.description,
                ]);
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
