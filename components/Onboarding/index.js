import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  Animated,
  ImageBackground,
} from 'react-native';
import DATA from './onboard';

const screenWidth = Dimensions.get('screen').width;

export default function Onboarding() {
  const [isCompleted, setIsCompleted] = useState(false);

  const scrollX = new Animated.Value(0);

  useEffect(() => {
    scrollX.addListener(({ value }) => {
      value / screenWidth === DATA.length - 1 ? setIsCompleted(true) : null;
    });

    return () => scrollX.removeListener();
  }, []);

  const OnboardingItem = ({ item }) => {
    const { title, desc, image, id } = item;

    return (
      <View key={id} style={styles.container}>
        <ImageBackground source={image} style={styles.image}>
          <View style={styles.textBox}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.text}>{desc}</Text>
          </View>
        </ImageBackground>
      </View>
    );
  };

  const renderOnboardingList = () => {
    return (
      <Animated.ScrollView
        horizontal
        pagingEnabled
        scrollEnabled
        scrollEventThrottle={16}
        snapToAlignment="center"
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}>
        {DATA.map((item) => (
          <OnboardingItem item={item} />
        ))}
      </Animated.ScrollView>
    );
  };

  const renderBtnCTA = () => (
    <TouchableOpacity>
      <Text style={styles.btnText}>{isCompleted ? "Let's Go!" : 'Skip'}</Text>
    </TouchableOpacity>
  );

  const renderDots = () => {
    const dotsPosition = Animated.divide(scrollX, screenWidth);

    return (
      <View style={styles.dotsContainer}>
        {DATA.map((_, index) => {
          const opacity = dotsPosition.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });
          const dotSize = dotsPosition.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [10, 20, 10],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              style={{
                ...styles.dot,
                width: dotSize,
                height: dotSize,
                opacity,
              }}
              key={`dot-${index}`}
            />
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView>
      {renderOnboardingList()}
      <View style={styles.dotsRoot}>{renderDots()}</View>
      <View style={styles.btn}>{renderBtnCTA()}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: screenWidth,
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  textBox: {
    bottom: 80,
    position: 'absolute',
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'gray',
    textAlign: 'center',
    marginBottom: 6,
  },
  text: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  dot: {
    backgroundColor: 'dodgerblue',
    borderRadius: 10,
    marginHorizontal: 4,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dotsRoot: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    bottom: '30%',
  },
  btn: {
    width: 150,
    paddingVertical: 15,
    paddingLeft: 40,
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    backgroundColor: 'dodgerblue',
    position: 'absolute',
    bottom: 20,
    right: 0,
  },
  btnText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
