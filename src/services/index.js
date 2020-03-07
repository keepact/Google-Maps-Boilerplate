import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Platform, NativeModules } from 'react-native';

import { filterObject } from '../util/format';
import language from '../langs';

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

export const getWatchPosition = () =>
  new Promise((resolve, reject) => {
    navigator.geolocation.watchPosition(
      location => resolve(location),
      error => reject(error),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
      },
    );
  });

export const clearWatchPosition = watchID => {
  navigator.geolocation.clearWatch(watchID);
};

export const getLanguage = () => {
  const deviceLocale =
    Platform.OS === 'ios'
      ? NativeModules.SettingsManager.settings.AppleLocale
      : NativeModules.I18nManager.localeIdentifier;

  const hasLang = language.langs.includes(deviceLocale);

  if (hasLang) {
    const lang = filterObject(language, deviceLocale);
    return lang[deviceLocale];
  }
  return language.en_US;
};

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
