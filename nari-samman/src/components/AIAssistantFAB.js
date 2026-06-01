// // ─── components/AIAssistantFAB.js ────────────────────────────────────────────
// //
// //  Floating AI Assistant button for Nari Samman.
// //
// //  Design rules followed:
// //  • Uses ONLY COLORS and SHADOWS from ../../theme/colors — zero new tokens.
// //  • Uses AutoText (Text) for multilingual safety — same import as all screens.
// //  • No new npm dependencies — Animated comes from react-native core.
// //  • Positioned bottom:90 so it always clears the tab bar (height:70 + padding:10
// //    + 10px safety margin). Works on both iOS and Android.
// //  • Pulse animation is CSS-free, driven by Animated.loop — no libraries needed.
// //  • onPress just calls props.onPress — caller decides navigation. This keeps
// //    the component fully decoupled from navigation and store logic.
// //
// //  Usage (HomeScreen / ExploreScreen):
// //    import AIAssistantFAB from '../../components/AIAssistantFAB';
// //    // Inside JSX, as the LAST child of the root <View style={styles.container}>:
// //    <AIAssistantFAB onPress={() => navigation.navigate('AIAssistant')} />
// //
// // ─────────────────────────────────────────────────────────────────────────────

// import React, { useEffect, useRef } from 'react';
// import {
//   TouchableOpacity,
//   StyleSheet,
//   Animated,
//   View,
//   Platform,
// } from 'react-native';
// import { COLORS, SHADOWS } from '../theme/colors';
// import Text from '../autoTranslation/AutoText';

// // ─── Constants ────────────────────────────────────────────────────────────────

// // Bottom offset: tab bar height(70) + tab paddingBottom(10) + safety gap(10)
// const FAB_BOTTOM = 90;
// const FAB_SIZE   = 58;

// // ─── Component ────────────────────────────────────────────────────────────────

// export default function AIAssistantFAB({ onPress }) {
//   // Pulse: scale oscillates 1.0 → 1.10 → 1.0 on a 2.4 s loop.
//   // The outer ring (pulseRing) fades out as it scales up, giving a sonar effect.
//   const pulseScale   = useRef(new Animated.Value(1)).current;
//   const pulseOpacity = useRef(new Animated.Value(0.55)).current;

//   useEffect(() => {
//     const pulse = Animated.loop(
//       Animated.sequence([
//         Animated.parallel([
//           Animated.timing(pulseScale, {
//             toValue: 1.55,
//             duration: 900,
//             useNativeDriver: true,
//           }),
//           Animated.timing(pulseOpacity, {
//             toValue: 0,
//             duration: 900,
//             useNativeDriver: true,
//           }),
//         ]),
//         // Reset instantly (duration:0) before next loop tick
//         Animated.parallel([
//           Animated.timing(pulseScale, {
//             toValue: 1,
//             duration: 0,
//             useNativeDriver: true,
//           }),
//           Animated.timing(pulseOpacity, {
//             toValue: 0.55,
//             duration: 0,
//             useNativeDriver: true,
//           }),
//         ]),
//         // Brief pause between pulses
//         Animated.delay(1500),
//       ])
//     );
//     pulse.start();
//     return () => pulse.stop();
//   }, []);

//   return (
//     // Outer wrapper: absolute positioning anchor.
//     // zIndex 200 — above the floatingHeader (zIndex:100) in HomeScreen.
//     <View style={styles.anchor} pointerEvents="box-none">

//       {/* Sonar ring — decorative, receives no touch events */}
//       <Animated.View
//         pointerEvents="none"
//         style={[
//           styles.pulseRing,
//           {
//             transform: [{ scale: pulseScale }],
//             opacity: pulseOpacity,
//           },
//         ]}
//       />

//       {/* Main FAB button */}
//       <TouchableOpacity
//         onPress={onPress}
//         activeOpacity={0.82}
//         style={styles.fab}
//         // Accessibility
//         accessibilityLabel="Open AI Assistant"
//         accessibilityRole="button"
//         accessibilityHint="Opens Nari AI chat assistant"
//       >
//         {/* Inner gradient-like layered circles for depth */}
//         <View style={styles.fabInner}>
//           <Text style={styles.fabEmoji}>🤖</Text>
//         </View>
//       </TouchableOpacity>

//       {/* "AI" label pill below the FAB */}
//       <View style={styles.labelPill}>
//         <Text style={styles.labelText}>Nari AI</Text>
//       </View>
//     </View>
//   );
// }

// // ─── Styles ───────────────────────────────────────────────────────────────────

// const styles = StyleSheet.create({
//   // Anchor fills the screen with pointer passthrough so it never
//   // blocks scrolling or taps on the underlying content.
//   anchor: {
//     position: 'absolute',
//     bottom: FAB_BOTTOM,
//     right: 18,
//     alignItems: 'center',
//     zIndex: 200,
//     // Web fix: pointer-events passthrough on the wrapper
//     ...(Platform.OS === 'web' ? { pointerEvents: 'none' } : {}),
//   },

//   // Sonar ring — same size as FAB, absolutely centred.
//   pulseRing: {
//     position: 'absolute',
//     width: FAB_SIZE,
//     height: FAB_SIZE,
//     borderRadius: FAB_SIZE / 2,
//     backgroundColor: COLORS.primary,         // lime green #9DCD43
//     // The ring is purely decorative; it sits behind the FAB.
//   },

//   fab: {
//     width: FAB_SIZE,
//     height: FAB_SIZE,
//     borderRadius: FAB_SIZE / 2,
//     backgroundColor: COLORS.primary,         // lime green #9DCD43
//     alignItems: 'center',
//     justifyContent: 'center',
//     // Re-use SHADOWS.large from theme — no new tokens.
//     ...SHADOWS.large,
//     // Subtle inner border for polish
//     borderWidth: 1.5,
//     borderColor: COLORS.primaryLight,        // #B4E065
//     // Web: restore pointer events on the actual button
//     ...(Platform.OS === 'web' ? { pointerEvents: 'auto', cursor: 'pointer' } : {}),
//   },

//   fabInner: {
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   fabEmoji: {
//     fontSize: 26,
//     // Prevent AutoText from adding extra margin
//     includeFontPadding: false,
//   },

//   // Small pill label under the FAB
//   labelPill: {
//     marginTop: 6,
//     backgroundColor: COLORS.darkCard,       // #131D29
//     borderRadius: 10,
//     paddingHorizontal: 8,
//     paddingVertical: 3,
//     borderWidth: 1,
//     borderColor: COLORS.primary + '50',     // lime green 31% opacity
//     // Web: restore pointer events
//     ...(Platform.OS === 'web' ? { pointerEvents: 'auto' } : {}),
//   },

//   labelText: {
//     fontSize: 9,
//     fontWeight: '700',
//     color: COLORS.primary,                  // lime green
//     letterSpacing: 0.5,
//   },
// });














// ─── components/AIAssistantFAB.js ────────────────────────────────────────────
//
//  Floating AI Assistant button for Nari Samman.
//
//  Design rules followed:
//  • Uses ONLY COLORS and SHADOWS from ../../theme/colors — zero new tokens.
//  • Uses AutoText (Text) for multilingual safety — same import as all screens.
//  • No new npm dependencies — Animated comes from react-native core.
//  • Positioned bottom:90 so it always clears the tab bar (height:70 + padding:10
//    + 10px safety margin). Works on both iOS and Android.
//  • Pulse animation is CSS-free, driven by Animated.loop — no libraries needed.
//  • onPress just calls props.onPress — caller decides navigation. This keeps
//    the component fully decoupled from navigation and store logic.
//
//  Icon: 💬 — chat bubble. Chosen because:
//    • Universally communicates "talk to an assistant"
//    • Matches the lime-green (#9DCD43) primary palette perfectly —
//      the filled bubble reads as an action trigger, not decoration.
//    • Used by WhatsApp, Intercom, Zendesk, and every major chat SDK
//      as their FAB icon — users immediately understand its purpose.
//    • Friendly without being cartoonish; professional without being cold.
//
//  Usage (ConsumerTabs — renders once, covers all five tabs):
//    import AIAssistantFAB from '../components/AIAssistantFAB';
//    // Inside the root <View> wrapper of ConsumerTabs, after <Tab.Navigator>:
//    <AIAssistantFAB onPress={() => navigation.navigate('AIAssistant')} />
//
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useRef } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Animated,
  View,
  Platform,
} from 'react-native';
import { COLORS, SHADOWS } from '../theme/colors';
import Text from '../autoTranslation/AutoText';

// ─── Constants ────────────────────────────────────────────────────────────────

// Bottom offset: tab bar height(70) + tab paddingBottom(10) + safety gap(10)
const FAB_BOTTOM = 90;
const FAB_SIZE   = 58;

// ─── Component ────────────────────────────────────────────────────────────────

export default function AIAssistantFAB({ onPress }) {
  // Pulse: scale oscillates 1.0 → 1.55 → 1.0 on a 2.4 s loop.
  // The outer ring (pulseRing) fades out as it scales up, giving a sonar effect.
  const pulseScale   = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.55)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulseScale, {
            toValue: 1.55,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(pulseOpacity, {
            toValue: 0,
            duration: 900,
            useNativeDriver: true,
          }),
        ]),
        // Reset instantly (duration:0) before next loop tick
        Animated.parallel([
          Animated.timing(pulseScale, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(pulseOpacity, {
            toValue: 0.55,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
        // Brief pause between pulses
        Animated.delay(1500),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  return (
    // Outer wrapper: absolute positioning anchor.
    // zIndex 200 — above the floatingHeader (zIndex:100) in HomeScreen.
    <View style={styles.anchor} pointerEvents="box-none">

      {/* Sonar ring — decorative, receives no touch events */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.pulseRing,
          {
            transform: [{ scale: pulseScale }],
            opacity: pulseOpacity,
          },
        ]}
      />

      {/* Main FAB button */}
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.82}
        style={styles.fab}
        accessibilityLabel="Open AI Assistant"
        accessibilityRole="button"
        accessibilityHint="Opens Nari AI chat assistant"
      >
        <View style={styles.fabInner}>
          {/* 💬 chat bubble — clearly communicates "talk to an assistant".
              The lime-green FAB background (#9DCD43) makes the white emoji
              pop with strong contrast, matching the brand palette exactly. */}
          <Text style={styles.fabEmoji}>💬</Text>
        </View>
      </TouchableOpacity>

      {/* "Nari AI" label pill below the FAB */}
      <View style={styles.labelPill}>
        <Text style={styles.labelText}>Nari AI</Text>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // Anchor fills the screen with pointer passthrough so it never
  // blocks scrolling or taps on the underlying content.
  anchor: {
    position: 'absolute',
    bottom: FAB_BOTTOM,
    right: 18,
    bottom: 110,
    alignItems: 'center',
    zIndex: 200,
    // Web fix: pointer-events passthrough on the wrapper
    ...(Platform.OS === 'web' ? { pointerEvents: 'none' } : {}),
  },

  // Sonar ring — same size as FAB, absolutely centred.
  pulseRing: {
    position: 'absolute',
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    backgroundColor: COLORS.primary,         // lime green #9DCD43
  },

  fab: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    backgroundColor: COLORS.primary,         // lime green #9DCD43
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.large,
    borderWidth: 1.5,
    borderColor: COLORS.primaryLight,        // #B4E065
    ...(Platform.OS === 'web' ? { pointerEvents: 'auto', cursor: 'pointer' } : {}),
  },

  fabInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  fabEmoji: {
    fontSize: 26,
    includeFontPadding: false,
  },

  // Small pill label under the FAB
  labelPill: {
    marginTop: 6,
    backgroundColor: COLORS.darkCard,       // #131D29
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: COLORS.primary + '50',     // lime green 31% opacity
    ...(Platform.OS === 'web' ? { pointerEvents: 'auto' } : {}),
  },

  labelText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,                  // lime green
    letterSpacing: 0.5,
  },
});