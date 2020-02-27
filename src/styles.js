import styled from 'styled-components/native';

import { StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const Container = styled.View`
  flex-direction: column-reverse;
`;

export const InputsContainer = styled.View`
  height: 200px;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

export const InputContent = styled.View`
  flex: 1;
  margin-top: 10px;
  width: 280px;
`;

export const IconLigature = styled(Icon).attrs({
  name: 'more-vert',
  color: 'blue',
})`
  position: absolute;
  right: 30px;
  left: 30px;
`;

export const ButtonNavigate = styled.TouchableOpacity`
  width: 60px;
  height: 40px;
  background-color: #fff;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: #000;
  border-radius: 7px;
  margin-bottom: 15px;
  margin: 0 50px;
  top: 45%;
  left: 60%;
`;

export const RouteData = styled.View`
  flex-direction: row;
  justify-content: space-around;
  width: 200px;
  background-color: blue;
  align-items: center;
  border-width: 1px;
  border-color: #000;
  margin-bottom: 15px;
  margin: 0 50px;
  top: 200px;
`;

export const RouteText = styled.Text`
  color: #fff;
  font-weight: bold;
`;

export const ButtonText = styled.Text`
  color: #000;
  font-weight: bold;
`;

export const OverlayData = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
`;

export const style = StyleSheet.create({
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
