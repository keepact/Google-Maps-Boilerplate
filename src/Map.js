import React, { useState, useRef, useEffect } from 'react';

import { View, Text, PermissionsAndroid, Alert } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';

import Geolocation from 'react-native-geolocation-service';
import getDirections from 'react-native-google-maps-directions';
import GooglePlacesInput from './componentes/AutoComplete';
import MapDirections from './componentes/DirectionsService';

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
  const [routeStatus, setRouteStatus] = useState({});

  const { width, height } = mapStyle.dimensions;

  const [position, setPosition] = useState({
    latitude: -22.9707112,
    longitude: -43.18644330000001,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const ref = useRef({
    firstInput: '',
    secondInput: '',
    mapView: '',
  });

  const copyArray = data => {
    const newCopy = [...data];

    return newCopy;
  };

  const overiedFirstInput = (data, item) => {
    const clone = copyArray(data);
    const newArray = clone.pop();

    const AddToFront = [item].concat(newArray);
    return AddToFront;
  };

  const overiedLastInput = (data, item) => {
    const clone = copyArray(data);
    clone.pop();

    const AddToLast = clone.concat(item);
    return AddToLast;
  };

  const handleClearInput = route => {
    if (route === 'start') {
      ref.current.firstInput.setAddressText('');
    } else {
      ref.current.secondInput.setAddressText('');
    }

    if (coordinates.length >= 2) {
      const cloneAddress = copyArray(address);
      const cloneCoords = copyArray(coordinates);

      const newAddress =
        route === 'start' ? cloneAddress.pop() : cloneAddress.shift();
      const newCoords =
        route === 'start' ? cloneCoords.pop() : cloneCoords.shift();

      setAddress([newAddress]);
      setCoordinates([newCoords]);
      setRouteStatus({});
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
          style={mapStyle.dimensions}
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
        <InputsContainer>
          <InputContent>
            <GooglePlacesInput
              reference={c => (ref.current.firstInput = c)}
              placeholder="Digite ínicio da rota"
              label="A"
              top={100}
              onPress={() => handleClearInput('start')}
              onSubmit={(data, details = null) => {
                setAddress(
                  address.length === 2
                    ? overiedFirstInput(address, {
                        address: `${data.terms[0].value.replace(
                          'Avenida',
                          'Av.',
                        )} - ${data.terms[1].value}`,
                        area: data.terms[2].value,
                      })
                    : [
                        {
                          address: `${data.terms[0].value.replace(
                            'Avenida',
                            'Av.',
                          )} - ${data.terms[1].value}`,
                          area: data.terms[2].value,
                        },
                        ...address,
                      ],
                );
                setCoordinates(
                  coordinates.length === 2
                    ? overiedFirstInput(coordinates, {
                        latitude: details.geometry.location.lat,
                        longitude: details.geometry.location.lng,
                      })
                    : [
                        {
                          latitude: details.geometry.location.lat,
                          longitude: details.geometry.location.lng,
                        },
                        ...coordinates,
                      ],
                );
              }}
            />
            <IconLigature />
            <GooglePlacesInput
              reference={c => (ref.current.secondInput = c)}
              placeholder="Digite o destino"
              label="B"
              top={50}
              onPress={() => handleClearInput('end')}
              onSubmit={(data, details = null) => {
                setAddress(
                  address.length === 2
                    ? overiedLastInput(address, {
                        address: `${data.terms[0].value.replace(
                          'Avenida',
                          'Av.',
                        )} - ${data.terms[1].value}`,
                        area: data.terms[2].value,
                      })
                    : [
                        ...address,
                        {
                          address: `${data.terms[0].value.replace(
                            'Avenida',
                            'Av.',
                          )} - ${data.terms[1].value}`,
                          area: data.terms[2].value,
                        },
                      ],
                );
                setCoordinates(
                  coordinates.length === 2
                    ? overiedLastInput(coordinates, {
                        latitude: details.geometry.location.lat,
                        longitude: details.geometry.location.lng,
                      })
                    : [
                        ...coordinates,
                        {
                          latitude: details.geometry.location.lat,
                          longitude: details.geometry.location.lng,
                        },
                      ],
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
              <RouteText>{Math.trunc(routeStatus.distance)} km</RouteText>
              <RouteText>{Math.trunc(routeStatus.duration)} min</RouteText>
            </RouteData>
          )}

          <ButtonNavigate onPress={handleGetGoogleMapDirections}>
            <BoldText>Iniciar</BoldText>
          </ButtonNavigate>
        </OverlayData>
      )}
    </View>
  );
}

export default MapComponent;
