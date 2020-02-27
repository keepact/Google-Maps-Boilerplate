import React from 'react';
import PropTypes from 'prop-types';

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { GOOGLE_KEY } from 'react-native-dotenv';

function GooglePlacesInput({
  reference,
  placeholder,
  onPress,
  onSubmit,
  label,
  top,
}) {
  return (
    <GooglePlacesAutocomplete
      ref={reference}
      placeholder={placeholder}
      minLength={2} // minimum length of text to search
      autoFocus={false}
      returnKeyType="search" // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
      keyboardAppearance="light" // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
      listViewDisplayed={false} // true/false/undefined
      fetchDetails
      renderDescription={row => row.description} // custom description render
      onPress={onSubmit}
      getDefaultValue={() => ''}
      query={{
        // available options: https://developers.google.com/places/web-service/autocomplete

        key: GOOGLE_KEY,

        language: 'br', // language of the results

        types: ['address'], // default: 'geocode'
      }}
      currentLocation // Will add a 'Current location' button at the top of the predefined places list
      currentLocationLabel="Current location"
      nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
      GoogleReverseGeocodingQuery={
        {
          // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
        }
      }
      GooglePlacesSearchQuery={{
        // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search

        rankby: 'distance',

        type: 'cafe',
      }}
      GooglePlacesDetailsQuery={{
        // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
        // fields: 'address_component, name, geometry',
        fields: 'geometry',
      }}
      filterReverseGeocodingByTypes={[
        'locality',

        'administrative_area_level_3',
      ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
      debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
      renderLeftButton={() => (
        <>
          <Icon name="brightness-1" color="blue" />
          <Text>{label}</Text>
        </>
      )}
      renderRightButton={() => (
        <TouchableOpacity onPress={onPress}>
          <Icon name="close" color="#ddd" />
        </TouchableOpacity>
      )}
      styles={{
        textInputContainer: {
          width: '100%',
        },
        description: {
          fontWeight: 'bold',
        },
        predefinedPlacesDescription: {
          color: '#1faadb',
        },
        listView: {
          backgroundColor: '#fff',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,

          elevation: 5,
          position: 'absolute',
          top,
        },
      }}
    />
  );
}

GooglePlacesInput.propTypes = {
  reference: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.object,
    }),
  ]).isRequired,
  top: PropTypes.number.isRequired,
  onPress: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
};

export default GooglePlacesInput;
