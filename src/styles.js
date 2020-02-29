import styled from 'styled-components/native';

import { StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const Container = styled.View`
  flex-direction: column-reverse;
`;

export const InputsContainer = styled.View`
  height: 110px;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

export const InputContent = styled.View`
  flex: 1;
  margin-top: 10px;
  width: 280px;
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
  top: 65%;
  left: 60%;
`;

export const RouteData = styled.View`
  flex-direction: row;
  justify-content: space-around;
  width: 200px;
  background-color: #0747a6;
  border-radius: 7px;
  align-items: center;
  border-width: 1px;
  border-color: #000;
  margin-bottom: 15px;
  margin: 0 50px;
  top: 110px;
`;

export const RouteText = styled.Text`
  color: #fff;
  font-weight: bold;
`;

export const BoldText = styled.Text`
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

export const DescriptionContainer = styled.View`
  width: 180px;
`;

export const CloseButton = styled.TouchableOpacity`
  position: absolute;
  top: 12px;
  right: 12px;
`;

export const Label = styled.Text`
  color: #fff;
  right: 17px;
  top: 10px;
`;

export const IconLigature = styled(Icon).attrs({
  name: 'more-vert',
  color: '#0747A6',
  size: 18,
})`
  position: absolute;
  left: 4px;
  top: 36px;
`;

export const IconLabel = styled(Icon).attrs({
  name: 'brightness-1',
  color: '#0747A6',
  size: 25,
})`
  top: 7px;
`;

export const CloseIcon = styled(Icon).attrs({
  name: 'close',
  color: '#000',
  size: 15,
})``;

export const mapStyle = StyleSheet.create({
  dimensions: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
