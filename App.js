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

const App = () => {
  const [playing, setPlaying] = useState(false);
  const [activeId, setActiveId] = useState(0);
  const [musicAdded, setMusicAdded] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const playerHeightAnim = scrollY.interpolate({
    inputRange: [0, hp(50) - hp(10) * 2],
    outputRange: [hp(50), hp(10)],
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

  const playerBox = () => {
    const {name, musicCover, musicFile} = musicList[activeId];
    return (
      <View style={styles.playerContainer}>
        <Animated.View style={[styles.playerBox, {height: playerHeightAnim}]}>
          <FastImage
            resizeMode="cover"
            source={musicCover}
            style={styles.playerMusicCard}>
            <Text style={styles.playerMusicName}>{name}</Text>
            <View style={styles.overalay} />
          </FastImage>
          <TouchableOpacity
            onPress={onPressPlayPause}
            style={styles.playIconBox}
            activeOpacity={0.7}>
            <FastImage
              resizeMode="contain"
              style={styles.playIcon}
              source={playing ? images.pause : images.play}
            />
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  const renderItem = ({item, index}) => {
    return (
      <View key={index} style={styles.musicCard}>
        <FastImage
          resizeMode="cover"
          source={item.musicCover}
          style={styles.musicCover}
        />
        <TouchableOpacity onPress={() => setActiveId(index)}>
          <Text style={styles.musicName}>{item.name}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  useEffect(() => {
    startMusicPlayer();
  }, []);

  useEffect(() => {
    setMusicAdded(false);
  }, [activeId]);

  useEffect(() => {
    if (!musicAdded && playing) startPlay();
  }, [musicAdded, playing]);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={styles.header}>
        <Text style={styles.headerText}>LOFI STATION</Text>
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
        renderItem={renderItem}
      />
    </View>
  );
};

export default App;
