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
    fontSize: wp(8),
    fontFamily: fontFamily.COOKIE_REGULAR,
  },
  playerContainer: {
    paddingTop: hp(3),
    backgroundColor: 'black',
    marginBottom: hp(5),
  },
  playerBox: {
    width: wp(100),
    padding: wp(2),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp(10),
  },
  playerMusicCard: {
    width: '100%',
    height: '100%',
    borderRadius: wp(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerMusicInfo: {
    position: 'absolute',
    zIndex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  waveform: {
    width: wp(90),
    height: hp(20),
  },
  waveformImage: {
    width: '100%',
    height: '100%',
  },
  playerMusicName: {
    fontSize: wp(10),
    color: 'white',
    fontFamily: fontFamily.COOKIE_REGULAR,
  },
  playIconBox: {
    position: 'absolute',
    bottom: wp(2),
    right: wp(2),
    height: hp(8),
    aspectRatio: 1,
  },
  playIcon: {
    width: '100%',
    height: '100%',
    borderRadius: wp(10),
  },
  musicList: {},
  musicCard: {
    width: wp(90),
    borderRadius: wp(5),
    alignSelf: 'center',
    marginBottom: hp(5),
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
    fontFamily: fontFamily.COOKIE_REGULAR,
    width: wp(65),
  },
  progressBar: {
    width: wp(55),
    marginLeft: wp(7),
  },
  overalay: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  plusIconBox: {
    position: 'absolute',
    width: wp(14),
    aspectRatio: 1,
    bottom: wp(6),
    right: wp(6),
    borderRadius: wp(7),
  },
  plusIcon: {
    width: '100%',
    height: '100%',
  },
  modalContainer: {
    width: wp(100),
    height: hp(50),
    position: 'absolute',
    bottom: -hp(3),
    alignSelf: 'center',
    borderTopLeftRadius: wp(5),
    borderTopRightRadius: wp(5),
    borderWidth: 1,
    borderColor: 'grey',
    backgroundColor: 'black',
  },
  mixMusicText: {
    color: 'grey',
    fontSize: wp(8),
    alignSelf: 'center',
    paddingTop: hp(2),
    textDecorationLine: 'underline',
    fontFamily: fontFamily.COOKIE_REGULAR,
    marginBottom: hp(2),
  },
});
