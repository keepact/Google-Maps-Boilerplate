import Reactotron from 'reactotron-react-native';
import { HOST_NAME } from 'react-native-dotenv';

if (__DEV__) {
  const tron = Reactotron.configure({ host: HOST_NAME })
    .useReactNative()
    .connect();

  tron.clear();

  console.tron = tron;
}
