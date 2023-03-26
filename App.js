import React, {useEffect, useRef, useState} from 'react';
import FastImage from 'react-native-fast-image';
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Animated,
  FlatList,
} from 'react-native';
import TrackPlayer, {RepeatMode} from 'react-native-track-player';
import {styles} from './AppStyles';
import {hp, images} from './constants';
import {musicList} from './musicList';
import Slider from '@react-native-community/slider';
import Modal from 'react-native-modal';

const App = () => {
  const [activeId, setActiveId] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [musicAdded, setMusicAdded] = useState(false);
  const [themeColor, setThemeColor] = useState('pink');
  const [showMixMusicModal, setShowMixMusicModal] = useState(false);

  const closeModal = () => setShowMixMusicModal(false);

  const scrollY = useRef(new Animated.Value(0)).current;
  const playerHeightAnim = scrollY.interpolate({
    inputRange: [0, (hp(30) - hp(10)) * 2],
    outputRange: [hp(30), hp(10)],
    extrapolate: 'clamp',
  });
  const waveformHeightAnim = scrollY.interpolate({
    inputRange: [0, (hp(30) - hp(10)) * 2],
    outputRange: [hp(20), hp(0)],
    extrapolate: 'clamp',
  });

  const onPressPlayPause = () => {
    playing ? stopPlay() : startPlay();
    setPlaying(prev => !prev);
  };

  const startMusicPlayer = async () => {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.setRepeatMode(RepeatMode.Track);
  };

  const onScroll = e => {
    const offsetY = e.nativeEvent.contentOffset.y;
    scrollY.setValue(offsetY);
  };

  const startPlay = async () => {
    if (!musicAdded) {
      await TrackPlayer.reset();
      await TrackPlayer.add([{url: musicList[activeId].musicFile}]);
      setMusicAdded(true);
    }
    await TrackPlayer.play();
  };

  const stopPlay = async () => {
    await TrackPlayer.pause();
  };

  const valueChange = (val, index) => {
    // console.log({val}, {index});
  };

  const playerBox = () => {
    const {name, musicCover} = musicList[activeId];
    return (
      <View style={styles.playerContainer}>
        <Animated.View
          style={[
            styles.playerBox,
            {height: playerHeightAnim, backgroundColor: themeColor},
          ]}>
          <FastImage
            resizeMode="cover"
            source={musicCover}
            style={styles.playerMusicCard}>
            <View style={styles.playerMusicInfo}>
              <Animated.View
                style={[styles.waveform, {height: waveformHeightAnim}]}>
                <FastImage
                  resizeMode="contain"
                  style={styles.waveformImage}
                  source={images.waveform}
                />
              </Animated.View>
              <Text style={styles.playerMusicName}>{name}</Text>
            </View>
            <View style={styles.overalay} />
          </FastImage>
          <TouchableOpacity
            onPress={onPressPlayPause}
            style={styles.playIconBox}
            activeOpacity={0.7}>
            <FastImage
              resizeMode="contain"
              style={[styles.playIcon, {backgroundColor: themeColor}]}
              source={playing ? images.pause : images.play}
            />
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  const renderItemLofiMusic = ({item, index}) => {
    return (
      <View key={index} style={styles.musicCard}>
        <FastImage
          resizeMode="cover"
          source={item.musicCover}
          style={styles.musicCover}
        />
        <TouchableOpacity onPress={() => setActiveId(index)}>
          <Text
            style={[styles.musicName, activeId === index && {color: 'white'}]}>
            {item.name}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderItemWhiteMusic = ({item, index}) => {
    return (
      <View key={index} style={styles.musicCard}>
        <FastImage
          resizeMode="cover"
          source={item.musicCover}
          style={styles.musicCover}
        />
        <View>
          <TouchableOpacity onPress={() => setActiveId(index)}>
            <Text style={styles.musicName}>{item.name}</Text>
          </TouchableOpacity>
          <Slider
            value={0.2}
            tapToSeek={true}
            style={styles.progressBar}
            thumbTintColor={themeColor}
            maximumTrackTintColor={'grey'}
            minimumTrackTintColor={themeColor}
            onValueChange={val => valueChange(val, index)}
          />
        </View>
      </View>
    );
  };

  useEffect(() => {
    startMusicPlayer();
  }, []);

  useEffect(() => {
    setMusicAdded(false);
    setThemeColor(musicList[activeId].themeColor);
  }, [activeId]);

  useEffect(() => {
    if (!musicAdded && playing) startPlay();
  }, [musicAdded, playing]);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={styles.header}>
        <Text style={[styles.headerText, {color: themeColor}]}>
          LOFI STATION
        </Text>
      </View>
      <FlatList
        data={musicList}
        decelerationRate={0.99}
        stickyHeaderIndices={[0]}
        ListHeaderComponent={playerBox}
        scrollEventThrottle={100}
        onScroll={onScroll}
        showsVerticalScrollIndicator={false}
        style={styles.musicList}
        renderItem={renderItemLofiMusic}
      />
      <TouchableOpacity
        onPress={() => setShowMixMusicModal(true)}
        style={[styles.plusIconBox, {backgroundColor: themeColor}]}>
        <FastImage
          resizeMode="contain"
          source={images.plus}
          style={styles.plusIcon}
        />
      </TouchableOpacity>
      <Modal isVisible={showMixMusicModal} onBackdropPress={closeModal}>
        <View style={styles.modalContainer}>
          <Text style={styles.mixMusicText}>Mix White Music</Text>
          <FlatList
            data={musicList}
            decelerationRate={0.99}
            style={styles.musicList}
            renderItem={renderItemWhiteMusic}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </Modal>
    </View>
  );
};

export default App;
