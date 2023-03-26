import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';

export const wp = val => widthPercentageToDP(val);
export const hp = val => heightPercentageToDP(val);

export const fontFamily = {
  COOKIE_REGULAR: 'Cookie-Regular',
};

export const images = {
  play: require('./assets/images/icons/play.png'),
  pause: require('./assets/images/icons/pause.png'),
  plus: require('./assets/images/icons/plus.png'),
  waveform: require('./assets/images/icons/soundwave.gif'),
};
