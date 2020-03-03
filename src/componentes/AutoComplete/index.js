import React from 'react';
import PropTypes from 'prop-types';

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { YellowBox } from 'react-native';
import { GOOGLE_KEY } from 'react-native-dotenv';
import { CloseButton, CloseIcon, IconLabel, Label } from '../../styles';
import { getDescriptionData } from '../../util/format';

function GooglePlacesInput({
  reference,
  location,
  placeholder,
  onPress,
  onSubmit,
  label,
  top,
  selection,
  onBlur,
  onFocus,
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
      renderDescription={row => getDescriptionData(row)} // custom description render
      onPress={onSubmit}
      getDefaultValue={() => ''}
      textInputProps={{
        selection,
        onBlur,
        onFocus,
      }}
      query={{
        // available options: https://developers.google.com/places/web-service/autocomplete
        key: GOOGLE_KEY, // API KEY
        strictbounds: true, //  Returns only those places that are strictly within the region defined by location and radius

        radius: '20000', // 200 km
        location: `${location.latitude}, ${location.longitude}`, // current device Location

        types: ['address'], // default: 'geocode'
        language: 'pt-BR', // language of the results
        components: 'country:br', // country
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
          <IconLabel />
          <Label>{label}</Label>
        </>
      )}
      renderRightButton={() => (
        <CloseButton onPress={onPress}>
          <CloseIcon />
        </CloseButton>
      )}
      styles={{
        container: {
          position: 'relative',
        },
        textInputContainer: {
          width: '100%',
          backgroundColor: 'rgba(0,0,0,0)',
          borderBottomWidth: 0,
          borderTopWidth: 0,
          shadowOpacity: 0,
        },
        textInput: {
          backgroundColor: '#eee',
          paddingRight: 20,
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

YellowBox.ignoreWarnings([
  'Warning: Failed prop type: The prop `selection.start` is marked as required in `TextInput`, but its value is `undefined`',
]);

GooglePlacesInput.propTypes = {
  reference: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.object,
    }),
  ]).isRequired,
  location: PropTypes.oneOfType([PropTypes.object]).isRequired,
  selection: PropTypes.oneOfType([PropTypes.object]).isRequired,
  onBlur: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  onPress: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  top: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
};

export default GooglePlacesInput;
