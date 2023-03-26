import {Platform, StyleSheet} from 'react-native';
import {fontFamily, hp, wp} from './constants';

const IOS_PADDING = Platform.OS === 'ios' ? 40 : 0;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingTop: IOS_PADDING,
  },
  header: {
    width: wp(100),
    paddingTop: hp(2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: 'pink',
    fontSize: wp(8),
    fontFamily: fontFamily.COOKIE_REGULAR,
  },
  playerContainer: {
    paddingTop: hp(5),
    backgroundColor: 'black',
  },
  playerBox: {
    width: wp(100),
    padding: wp(2),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp(10),
    backgroundColor: 'pink',
  },
  playerMusicCard: {
    width: '100%',
    height: '100%',
    borderRadius: wp(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerMusicName: {
    zIndex: 1,
    position: 'absolute',
    fontSize: wp(12),
    color: 'white',
    fontFamily: fontFamily.COOKIE_REGULAR,
  },
  playIconBox: {
    position: 'absolute',
    bottom: wp(2),
    right: wp(2),
  },
  playIcon: {
    width: wp(16),
    aspectRatio: 1,
    borderRadius: wp(8),
    backgroundColor: 'pink',
  },
  musicList: {},
  musicCard: {
    width: wp(90),
    borderRadius: wp(5),
    alignSelf: 'center',
    marginVertical: hp(3),
    flexDirection: 'row',
    alignItems: 'center',
  },
  musicCover: {
    height: hp(10),
    aspectRatio: 1,
    borderRadius: hp(5),
  },
  musicName: {
    fontSize: wp(8),
    color: 'grey',
    paddingLeft: wp(10),
    paddingVertical: hp(2),
    fontFamily: fontFamily.COOKIE_REGULAR,
    width: wp(65),
  },
  overalay: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
});
