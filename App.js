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
import {styles} from './AppStyles';
import {hp, images, wp} from './constants';
import {ambientSoundList, musicList} from './musicList';
import Slider from '@react-native-community/slider';
import Modal from 'react-native-modal';
import Sound from 'react-native-sound';

const App = () => {
  // utility variables
  const [playing, setPlaying] = useState(false);
  const [musicAdded, setMusicAdded] = useState(false);
  const [themeColor, setThemeColor] = useState('pink');
  const [activeMusicIndex, setActiveMusicIndex] = useState(0);
  const [showMixMusicModal, setShowMixMusicModal] = useState(false);

  // audio players and their volume
  const numAmbientSounds = ambientSoundList.length;
  const [lofiPlayer, setLofiPlayer] = useState(null);
  const [lofPlayerSound, setLofiPlayerSound] = useState(0.5);
  const [ambientSoundPlayers, setAmbientSoundPlayers] = useState(null);
  const [ambientSoundVolume, setAmbientSoundVolume] = useState(
    Array(numAmbientSounds).fill(0),
  );

  // Utility Functions
  const getAnim = (anim, toValue, delay, duration) =>
    Animated.timing(anim, {toValue, delay, duration, useNativeDriver: false});

  // Animation Variables and Functions
  const scrollY = useRef(new Animated.Value(0)).current;
  const widthRef = useRef(new Animated.Value(0)).current;
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
  const onScroll = e => scrollY.setValue(e.nativeEvent.contentOffset.y);
  const startMixMusicIconAnimation = () => {
    getAnim(widthRef, wp(50), 0, 1000).start(() => {
      getAnim(widthRef, 0, 2000, 1000).start();
    });
  };

  // Modal Functions
  const closeModal = () => setShowMixMusicModal(false);
  const onPressSaveSettings = () => {};

  // Lofi Player Functions
  const stopPlay = () => lofiPlayer.pause();
  const onPressPlayPause = () => {
    playing ? stopPlay() : startPlay();
    setPlaying(prev => !prev);
  };
  const startPlay = async () => {
    if (musicAdded) lofiPlayer.play();
    else {
      if (lofiPlayer) lofiPlayer.release();
      const player = new Sound(
        musicList[activeMusicIndex].musicFile,
        Sound.MAIN_BUNDLE,
      );
      setMusicAdded(true);
      setLofiPlayer(player);
      player.getNumberOfLoops(-1);
      setTimeout(() => {
        player.play();
        player.setVolume(0.3);
      }, 500);
    }
  };

  // Ambient Player Functions
  const volumeChange = async (value, index, type = 'ambient') => {
    if (type === 'lofi') lofiPlayer.setVolume(value);
    else ambientSoundPlayers[index].setVolume(value);
  };
  const valueChange = (value, index, type = 'ambient') => {
    if (type === 'lofi') setLofiPlayerSound(value);
    else {
      setAmbientSoundVolume(prev => {
        const newList = [...prev];
        newList[index] = value;
        return newList;
      });
    }
  };
  const getAmbientSoundPlayers = async () => {
    if (ambientSoundPlayers) return;
    const players = ambientSoundList.map(item => {
      const player = new Sound(item.musicFile, Sound.MAIN_BUNDLE);
      player.setNumberOfLoops(-1);
      setTimeout(() => {
        player.play();
        player.setVolume(0);
      }, 500);
      return player;
    });
    setAmbientSoundPlayers(players);
  };
  const onPressResetValues = () => {
    ambientSoundPlayers.forEach(player => {
      player.setVolume(0);
    });
    setAmbientSoundVolume(Array(ambientSoundList.length).fill(0));
  };

  // Components
  const playerBox = () => {
    const {name, musicCover} = musicList[activeMusicIndex];
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
        <TouchableOpacity onPress={() => setActiveMusicIndex(index)}>
          <Text
            style={[
              styles.musicName,
              activeMusicIndex === index && {color: 'white'},
            ]}>
            {item.name}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  const renderItemAmbientMusic = ({item, index}) => {
    return (
      <View key={index} style={styles.musicCard}>
        <FastImage
          resizeMode="contain"
          source={item.musicCover}
          style={styles.ambineSoundCover}
        />
        <View>
          <Text style={[styles.musicName, {color: item.color}]}>
            {item.name}
          </Text>
          <Slider
            value={ambientSoundVolume[index]}
            tapToSeek={true}
            style={styles.progressBar}
            thumbTintColor={themeColor}
            maximumTrackTintColor={'grey'}
            minimumTrackTintColor={themeColor}
            onValueChange={val => valueChange(val, index)}
            onSlidingComplete={val => volumeChange(val, index)}
          />
        </View>
      </View>
    );
  };

  // Lofi Player Triggers
  useEffect(() => {
    return () => {
      if (lofiPlayer) lofiPlayer.release();
      if (ambientSoundPlayers)
        ambientSoundPlayers.forEach(player => player.release());
    };
  }, []);
  useEffect(() => {
    if (!musicAdded && playing) startPlay();
  }, [musicAdded, playing]);
  useEffect(() => {
    setMusicAdded(false);
    setThemeColor(musicList[activeMusicIndex].themeColor);
  }, [activeMusicIndex]);

  // Ambinet Player Triggers
  useEffect(() => {
    getAmbientSoundPlayers();
    startMixMusicIconAnimation();
  }, []);

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
        <Animated.View style={{width: widthRef}}>
          <Text numberOfLines={1} style={styles.mixMusicText}>
            Mix Ambient Sounds
          </Text>
        </Animated.View>
        <FastImage
          resizeMode="contain"
          source={images.plus}
          style={styles.plusIcon}
        />
      </TouchableOpacity>
      <Modal isVisible={showMixMusicModal} onBackdropPress={closeModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              onPress={onPressResetValues}
              style={styles.resetValueBox}>
              <Text style={styles.resetValueText}>Reset Values</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onPressSaveSettings}
              style={styles.resetValueBox}>
              <Text style={styles.resetValueText}>Save Settings</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={ambientSoundList}
            decelerationRate={0.99}
            style={styles.musicList}
            renderItem={renderItemAmbientMusic}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </Modal>
    </View>
  );
};

export default App;
