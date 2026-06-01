import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CommonActions } from '@react-navigation/native';
import { COLORS } from '../theme/colors';import Text from "../autoTranslation/AutoText";import useAppLanguage from "../autoTranslation/useAppLanguage";
import NariLogoIcon from '../components/NariLogoIcon';


const { width, height } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {const lang = useAppLanguage();

  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.sequence([
    Animated.parallel([
    Animated.spring(logoScale, { toValue: 1, tension: 60, friction: 7, useNativeDriver: true }),
    Animated.timing(logoOpacity, { toValue: 1, duration: 600, useNativeDriver: true })]
    ),
    Animated.parallel([
    Animated.timing(taglineOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
    Animated.timing(taglineY, { toValue: 0, duration: 500, useNativeDriver: true })]
    )]
    ).start();

    const timer = setTimeout(() => {
      navigation.dispatch(
        CommonActions.reset({ index: 0, routes: [{ name: 'Onboarding' }] })
      );
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient colors={['#0F1822', '#1C2437', '#243050']} style={styles.container}>
      {/* Decorative rings */}
      <View style={styles.ring1} />
      <View style={styles.ring2} />

      <Animated.View style={[styles.logoContainer, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
        <View style={styles.logoCircle}>
          <NariLogoIcon size={120} />
        </View>
        <Text style={styles.brandName}>नारी सम्मान</Text>
        <Text style={styles.brandNameEn}>NARI SAMMAN</Text>
      </Animated.View>

      <Animated.View style={[styles.taglineContainer, { opacity: taglineOpacity, transform: [{ translateY: taglineY }] }]}>
        <Text style={styles.tagline}>{"Empowering Women"}</Text>
        <Text style={styles.taglineSub}>{"From Source to Consumer"}</Text>
        <View style={styles.divider} />
        <Text style={styles.poweredBy}>{"IS&SF Initiative · West Bengal"}</Text>
      </Animated.View>
    </LinearGradient>);

}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  ring1: {
    position: 'absolute',
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: width * 0.45,
    borderWidth: 1,
    borderColor: 'rgba(245, 166, 35, 0.15)'
  },
  ring2: {
    position: 'absolute',
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    borderWidth: 1,
    borderColor: 'rgba(232, 98, 42, 0.2)'
  },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  logoCircle: {
    width: 118, height: 118, borderRadius: 59,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 2, borderColor: COLORS.gold,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 20
  },
  brandName: { fontSize: 32, fontWeight: '800', color: COLORS.gold, letterSpacing: 2 },
  brandNameEn: { fontSize: 13, fontWeight: '600', color: 'rgba(245,166,35,0.7)', letterSpacing: 6, marginTop: 4 },
  taglineContainer: { alignItems: 'center' },
  tagline: { fontSize: 18, fontWeight: '300', color: COLORS.cream, letterSpacing: 0.5 },
  taglineSub: { fontSize: 14, fontWeight: '600', color: COLORS.saffron, marginTop: 4, letterSpacing: 1 },
  divider: { width: 60, height: 1, backgroundColor: 'rgba(245,166,35,0.4)', marginVertical: 16 },
  poweredBy: { fontSize: 11, color: 'rgba(200,208,228,0.5)', letterSpacing: 1 }
});
