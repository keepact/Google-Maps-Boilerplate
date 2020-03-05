import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Platform } from 'react-native';

export const getUserLocation = () =>
  new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      location => resolve(location),
      error => reject(error),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
      },
    );
  });

export const requestLocationPermission = async () => {
  try {
    const granted = await request(
      Platform.select({
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      }),
    );
    if (granted === RESULTS.GRANTED) {
      console.tron.log('Location granted');

      return true;
    }
    console.tron.log('Location permission denied');

    return false;
  } catch (err) {
    console.tron.log(err);

    return err;
  }
};
