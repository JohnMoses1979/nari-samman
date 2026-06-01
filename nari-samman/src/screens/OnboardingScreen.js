// import React, { useState, useRef } from 'react';
// import {
//   View, StyleSheet, Dimensions, TouchableOpacity,
//   ScrollView } from
// 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { CommonActions } from '@react-navigation/native';
// import { COLORS } from '../theme/colors';import Text from "../autoTranslation/AutoText";import useAppLanguage from "../autoTranslation/useAppLanguage";
// import NariLogoIcon from '../components/NariLogoIcon';


// const { width, height } = Dimensions.get('window');

// const SLIDES = [
// { id: '1', logo: true, emoji: '', title: "Women-Led Commerce", sub: "Empowering 6,000+ SHG women of West Bengal to sell directly to you — no middlemen, fair prices.", bg: ['#0F1822', '#1C2437'], accent: COLORS.primary },
// { id: '2', emoji: '🧵', title: "Reviving Bengal's Weaving Heritage", sub: "Baluchari, Tant, Jamdani, Murshidabad Silk — rare handloom treasures from master weavers.", bg: ['#0F1822', '#1C2437'], accent: COLORS.primaryLight },
// { id: '3', emoji: '🍯', title: "Pure Sundarbans Products", sub: "Wild honey, organic spices, pickles, and more — straight from forest and farmland to your home.", bg: ['#0F1822', '#1C2437'], accent: COLORS.primary },
// { id: '4', emoji: '🏺', title: "Tribal Crafts & Heritage Art", sub: "Dokra, Patachitra, Terracotta, Bamboo — authentic tribal artifacts that carry centuries of culture.", bg: ['#0F1822', '#1C2437'], accent: COLORS.primaryLight }];


// export default function OnboardingScreen({ navigation }) {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const scrollRef = useRef(null);const lang = useAppLanguage();


//   const goToRoleSelect = () => {
//     navigation.dispatch(
//       CommonActions.reset({ index: 0, routes: [{ name: 'RoleSelect' }] })
//     );
//   };

//   const goNext = () => {
//     if (currentIndex < SLIDES.length - 1) {
//       const nextIndex = currentIndex + 1;
//       scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true });
//       setCurrentIndex(nextIndex);
//     } else {
//       goToRoleSelect();
//     }
//   };

//   const skip = () => goToRoleSelect();

//   return (
//     <View style={styles.container}>
//       <ScrollView
//         ref={scrollRef}
//         horizontal
//         pagingEnabled
//         scrollEnabled
//         showsHorizontalScrollIndicator={false}
//         scrollEventThrottle={16}
//         decelerationRate="fast"
//         snapToInterval={width}
//         onMomentumScrollEnd={(e) => {
//           const idx = Math.round(e.nativeEvent.contentOffset.x / width);
//           setCurrentIndex(idx);
//         }}
//         style={styles.scrollView}>
        
//         {SLIDES.map((item, index) =>
//         <LinearGradient key={item.id} colors={item.bg} style={styles.slide}>
//             {/* Decorative accent circle behind emoji */}
//             <View style={[styles.accentRing, { borderColor: COLORS.primary + '30' }]} />
//             <View style={styles.emojiContainer}>
//               {item.logo ? <NariLogoIcon size={120} /> : <Text style={styles.slideEmoji}>{item.emoji}</Text>}
//             </View>
//             {/* Step indicator */}
//             <View style={styles.stepRow}>
//               {SLIDES.map((_, i) =>
//             <View
//               key={i}
//               style={[styles.dot, i === index && styles.dotActive]} />

//             )}
//             </View>
//             <Text style={[styles.slideTitle, { color: item.accent }]}>{item.title}</Text>
//             <Text style={styles.slideSubtitle}>{item.sub}</Text>
//           </LinearGradient>
//         )}
//       </ScrollView>

//       {/* Footer */}
//       <View style={styles.footer}>
//         <View style={styles.buttons}>
//           <TouchableOpacity onPress={skip} style={styles.skipBtn}>
//             <Text style={styles.skipText}>{"Skip"}</Text>
//           </TouchableOpacity>

//           <TouchableOpacity onPress={goNext} activeOpacity={0.85}>
//             <LinearGradient
//               colors={[COLORS.primaryDark, COLORS.primary]}
//               style={styles.nextBtn}
//               start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              
//               <Text style={styles.nextText}>
//                 {currentIndex === SLIDES.length - 1 ? `🚀 ${"Get Started"}` : `${"Next"} →`}
//               </Text>
//             </LinearGradient>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>);

// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: COLORS.dark },
//   scrollView: { flex: 1 },

//   slide: {
//     width,
//     height,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingHorizontal: 40,
//     paddingBottom: 180
//   },

//   accentRing: {
//     position: 'absolute',
//     width: 260,
//     height: 260,
//     borderRadius: 130,
//     borderWidth: 1,
//     borderColor: COLORS.primary + '20',
//     top: height * 0.18
//   },

//   emojiContainer: {
//     width: 150, height: 150, borderRadius: 75,
//     backgroundColor: 'rgba(157,205,67,0.10)',
//     alignItems: 'center', justifyContent: 'center',
//     marginBottom: 28,
//     borderWidth: 2, borderColor: COLORS.primary + '40',
//     shadowColor: COLORS.primary, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10
//   },
//   slideEmoji: { fontSize: 80 },

//   stepRow: {
//     flexDirection: 'row',
//     gap: 8,
//     marginBottom: 24
//   },
//   dot: {
//     width: 8, height: 8, borderRadius: 4,
//     backgroundColor: 'rgba(157,205,67,0.25)'
//   },
//   dotActive: {
//     width: 28, height: 8, borderRadius: 4,
//     backgroundColor: COLORS.primary
//   },

//   slideTitle: {
//     fontSize: 28, fontWeight: '800', textAlign: 'center',
//     marginBottom: 16, letterSpacing: -0.5, lineHeight: 36
//   },
//   slideSubtitle: {
//     fontSize: 15, color: 'rgba(200,208,228,0.75)',
//     textAlign: 'center', lineHeight: 24
//   },

//   footer: {
//     position: 'absolute', bottom: 0, left: 0, right: 0,
//     paddingHorizontal: 28, paddingBottom: 44, paddingTop: 20,
//     backgroundColor: 'transparent'
//   },

//   buttons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center'
//   },
//   skipBtn: { paddingVertical: 14, paddingHorizontal: 8 },
//   skipText: { color: 'rgba(200,208,228,0.45)', fontSize: 15, fontWeight: '500' },
//   nextBtn: {
//     borderRadius: 50,
//     paddingHorizontal: 36, paddingVertical: 15
//   },
//   nextText: { color: COLORS.dark, fontWeight: '800', fontSize: 15 }
// });















































import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  StatusBar,
  Animated,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { CommonActions } from "@react-navigation/native";
import { COLORS } from "../theme/colors";

const { width, height } = Dimensions.get("window");
const isSmall = height < 700;
const onboardingImageHeight = Math.min(width - 40, isSmall ? height * 0.35 : height * 0.42);

const SLIDES = [
  {
    id: "1",
    image: require("../../assets/women_commerce.png"),
    title: "Women-Led Commerce",
    subtitle:
      "Empowering 6,000+ SHG women of West Bengal to sell directly to you — no middlemen, fair prices.",
    bg: ["#07111F", "#132238", "#243A5E"],
    accent: COLORS.primary,
  },
  {
    id: "2",
    image: require("../../assets/bengal_weaving.png"),
    title: "Bengal's Weaving Heritage",
    subtitle:
      "Baluchari, Tant, Jamdani, Murshidabad Silk — rare handloom treasures from master weavers.",
    bg: ["#07111F", "#16243A", "#2B3F63"],
    accent: COLORS.primaryLight,
  },
  {
    id: "3",
    image: require("../../assets/sundarbans_products.png"),
    title: "Pure Sundarbans Products",
    subtitle:
      "Wild honey, organic spices, pickles, and more — straight from forest and farmland to your home.",
    bg: ["#07111F", "#172A28", "#244B3C"],
    accent: COLORS.primary,
  },
  {
    id: "4",
    image: require("../../assets/tribal_crafts.png"),
    title: "Tribal Crafts & Heritage Art",
    subtitle:
      "Dokra, Patachitra, Terracotta, Bamboo — authentic tribal artifacts that carry centuries of culture.",
    bg: ["#07111F", "#241C1B", "#4A2E1F"],
    accent: COLORS.primaryLight,
  },
];

export default function OnboardingScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const translateAnim = useRef(new Animated.Value(0)).current;

  const item = SLIDES[currentIndex];

  const goToRoleSelect = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "RoleSelect" }],
      })
    );
  };

  const changeSlide = (nextIndex) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(translateAnim, {
        toValue: -18,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentIndex(nextIndex);
      translateAnim.setValue(18);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 160,
          useNativeDriver: true,
        }),
        Animated.timing(translateAnim, {
          toValue: 0,
          duration: 160,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const goNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      changeSlide(currentIndex + 1);
    } else {
      goToRoleSelect();
    }
  };

  return (
    <LinearGradient colors={item.bg} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#07111F" />

      <View style={[styles.glowTop, { backgroundColor: item.accent + "24" }]} />
      <View style={[styles.glowBottom, { backgroundColor: item.accent + "18" }]} />

      <View style={styles.header}>
        <TouchableOpacity onPress={goToRoleSelect} style={styles.skipTopBtn}>
          <Text style={styles.skipTopText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateX: translateAnim }],
          },
        ]}
      >
        <View style={[styles.imageCard, { borderColor: item.accent + "55" }]}>
          <View style={styles.imageFrame}>
            <Image source={item.image} style={styles.image} resizeMode="contain" />
          </View>

          <LinearGradient
            colors={["transparent", "rgba(7,17,31,0.62)"]}
            style={styles.imageFade}
          />

          <View style={[styles.badge, { backgroundColor: item.accent }]}>
            <Text style={styles.badgeText}>
              {currentIndex + 1} / {SLIDES.length}
            </Text>
          </View>
        </View>

        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === currentIndex && [
                  styles.activeDot,
                  { backgroundColor: item.accent },
                ],
              ]}
            />
          ))}
        </View>

        <Text style={[styles.title, { color: item.accent }]} numberOfLines={2}>
          {item.title}
        </Text>

        <Text style={styles.subtitle} numberOfLines={4}>
          {item.subtitle}
        </Text>
      </Animated.View>

      <LinearGradient
        colors={["transparent", "rgba(7,17,31,0.94)", "#07111F"]}
        style={styles.footerGradient}
      >
        <View style={styles.footer}>
          <TouchableOpacity onPress={goToRoleSelect} style={styles.skipBtn}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={goNext} activeOpacity={0.9}>
            <LinearGradient
              colors={[COLORS.primaryDark, COLORS.primary]}
              style={styles.nextBtn}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.nextText}>
                {currentIndex === SLIDES.length - 1 ? "Get Started" : "Next →"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    overflow: "hidden",
  },

  header: {
    position: "absolute",
    top: Platform.OS === "android" ? 38 : 56,
    right: 20,
    zIndex: 10,
  },

  skipTopBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },

  skipTopText: {
    color: "rgba(235,241,250,0.9)",
    fontSize: 13,
    fontWeight: "800",
  },

  glowTop: {
    position: "absolute",
    top: -90,
    right: -80,
    width: 240,
    height: 240,
    borderRadius: 120,
  },

  glowBottom: {
    position: "absolute",
    bottom: 70,
    left: -110,
    width: 300,
    height: 300,
    borderRadius: 150,
  },

  content: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 82 : 96,
    paddingBottom: 140,
  },

  imageCard: {
    width: "100%",
    height: onboardingImageHeight,
    borderRadius: 28,
    overflow: "hidden",
    borderWidth: 1.5,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.42,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },

  imageFrame: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },

  image: {
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
  },

  imageFade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 90,
  },

  badge: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  badgeText: {
    color: "#07111F",
    fontSize: 11,
    fontWeight: "900",
  },

  dots: {
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 18,
    gap: 8,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.25)",
  },

  activeDot: {
    width: 34,
  },

  title: {
    width: "100%",
    fontSize: isSmall ? 23 : 28,
    lineHeight: isSmall ? 30 : 36,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 10,
    paddingHorizontal: 6,
  },

  subtitle: {
    width: "100%",
    fontSize: isSmall ? 13 : 15,
    lineHeight: isSmall ? 20 : 24,
    color: "rgba(235,241,250,0.82)",
    textAlign: "center",
    paddingHorizontal: 6,
  },

  footerGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 38,
  },

  footer: {
    width: "100%",
    paddingHorizontal: 26,
    paddingBottom: Platform.OS === "ios" ? 34 : 30,
    paddingTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  skipBtn: {
    paddingVertical: 14,
    paddingHorizontal: 8,
  },

  skipText: {
    color: "rgba(235,241,250,0.58)",
    fontSize: 15,
    fontWeight: "700",
  },

  nextBtn: {
    minWidth: 120,
    alignItems: "center",
    borderRadius: 50,
    paddingHorizontal: 30,
    paddingVertical: 14,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.42,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },

  nextText: {
    color: "#07111F",
    fontWeight: "900",
    fontSize: 15,
  },
});