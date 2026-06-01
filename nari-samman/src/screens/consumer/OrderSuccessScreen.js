// import React, { useEffect, useRef } from 'react';
// import { View, StyleSheet, Animated, TouchableOpacity, Dimensions } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { COLORS } from '../../theme/colors';

// import useStore from '../../store/useStore';import Text from "../../autoTranslation/AutoText";import useAppLanguage from "../../autoTranslation/useAppLanguage";

// const { width } = Dimensions.get('window');

// export default function OrderSuccessScreen({ navigation }) {const lang = useAppLanguage();

//   const { orders } = useStore();
//   const latestOrder = orders[0];
//   const scale = useRef(new Animated.Value(0)).current;
//   const opacity = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     Animated.sequence([
//     Animated.spring(scale, { toValue: 1, tension: 50, friction: 6, useNativeDriver: true }),
//     Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true })]
//     ).start();
//   }, []);

//   return (
//     <LinearGradient colors={['#0F1822', '#1C2437', '#243050']} style={styles.container}>
//       <Animated.View style={[styles.iconCircle, { transform: [{ scale }] }]}>
//         <Text style={styles.successIcon}>✅</Text>
//       </Animated.View>

//       <Animated.View style={{ opacity }}>
//         <Text style={styles.title}>{"Order Placed!"}</Text>
//         <Text style={styles.subtitle}>{"Your order has been confirmed and is being processed at Sandeshkhali warehouse."}</Text>

//         {latestOrder &&
//         <View style={styles.orderCard}>
//             <Text style={styles.orderId}>{"Orders"} #{latestOrder.id}</Text>
//             <View style={styles.orderRow}>
//               <Text style={styles.orderLabel}>{"Order Items"}</Text>
//               <Text style={styles.orderVal}>{latestOrder.items?.length || 0} item(s)</Text>
//             </View>
//             <View style={styles.orderRow}>
//               <Text style={styles.orderLabel}>{"Total Paid"}</Text>
//               <Text style={[styles.orderVal, { color: COLORS.gold }]}>₹{latestOrder.total}</Text>
//             </View>
//             <View style={styles.orderRow}>
//               <Text style={styles.orderLabel}>{"Status"}</Text>
//               <View style={styles.statusBadge}>
//                 <Text style={styles.statusText}>✓ {"Confirmed"}</Text>
//               </View>
//             </View>
//             <View style={styles.orderRow}>
//               <Text style={styles.orderLabel}>{"Tracking"}</Text>
//               <Text style={styles.orderVal}>{latestOrder.tracking}</Text>
//             </View>
//           </View>
//         }

//         <View style={styles.impactCard}>
//           <Text style={styles.impactTitle}>{"🌱 Thank You for Your Support!"}</Text>
//           <Text style={styles.impactText}>{"Your purchase empowers SHG women and artisan families of West Bengal. You're helping build dignified livelihoods."}</Text>
//         </View>

//         <View style={styles.buttons}>
//           <TouchableOpacity
//             onPress={() => latestOrder ?
//             navigation.navigate('OrderDetail', { order: latestOrder }) :
//             navigation.navigate('OrderHistory')
//             }
//             style={styles.trackBtn}>
            
//             <Text style={styles.trackBtnText}>{"Track Order"} 📋</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => navigation.reset({ index: 0, routes: [{ name: 'ConsumerTabs' }] })} style={styles.homeBtn}>
//             <LinearGradient colors={[COLORS.saffron, COLORS.gold]} style={styles.homeBtnGrad}>
//               <Text style={styles.homeBtnText}>{"Continue Shopping"}</Text>
//             </LinearGradient>
//           </TouchableOpacity>
//         </View>
//       </Animated.View>
//     </LinearGradient>);

// }

// const styles = StyleSheet.create({
//   container: { flex: 1, alignItems: 'center', paddingTop: 80, paddingHorizontal: 24 },
//   iconCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
//   successIcon: { fontSize: 60 },
//   title: { fontSize: 30, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 12 },
//   subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.75)', textAlign: 'center', lineHeight: 22, marginBottom: 24 },
//   orderCard: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: 20, width: '100%', marginBottom: 16, gap: 12 },
//   orderId: { fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 4 },
//   orderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
//   orderLabel: { fontSize: 13, color: 'rgba(255,255,255,0.6)' },
//   orderVal: { fontSize: 13, color: '#fff', fontWeight: '600' },
//   statusBadge: { backgroundColor: COLORS.success + '30', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 },
//   statusText: { fontSize: 12, color: COLORS.mint, fontWeight: '700' },
//   impactCard: { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 20, padding: 16, marginBottom: 24 },
//   impactTitle: { fontSize: 14, fontWeight: '700', color: COLORS.gold, marginBottom: 6 },
//   impactText: { fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 20 },
//   buttons: { flexDirection: 'row', gap: 12, width: '100%' },
//   trackBtn: { flex: 1, borderRadius: 50, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)', paddingVertical: 14, alignItems: 'center' },
//   trackBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
//   homeBtn: { flex: 1.2, borderRadius: 50, overflow: 'hidden' },
//   homeBtnGrad: { paddingVertical: 14, alignItems: 'center' },
//   homeBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 }
// });








import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, Dimensions, ScrollView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../theme/colors';

import useStore from '../../store/useStore';
import Text from "../../autoTranslation/AutoText";
import useAppLanguage from "../../autoTranslation/useAppLanguage";

const { width } = Dimensions.get('window');

export default function OrderSuccessScreen({ navigation }) {
  const lang = useAppLanguage();

  const { orders } = useStore();
  const latestOrder = orders[0];
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 1, tension: 50, friction: 6, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true })
    ]).start();
  }, []);

  return (
    <LinearGradient colors={['#0F1822', '#1C2437', '#243050']} style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
      >
        <Animated.View style={[styles.iconCircle, { transform: [{ scale }] }]}>
          <Text style={styles.successIcon}>✅</Text>
        </Animated.View>

        <Animated.View style={{ opacity }}>
          <Text style={styles.title}>{"Order Placed!"}</Text>
          <Text style={styles.subtitle}>{"Your order has been confirmed and is being processed at Sandeshkhali warehouse."}</Text>

          {latestOrder &&
          <View style={styles.orderCard}>
              <Text style={styles.orderId}>{"Orders"} #{latestOrder.id}</Text>
              <View style={styles.orderRow}>
                <Text style={styles.orderLabel}>{"Order Items"}</Text>
                <Text style={styles.orderVal}>{latestOrder.items?.length || 0} item(s)</Text>
              </View>
              <View style={styles.orderRow}>
                <Text style={styles.orderLabel}>{"Total Paid"}</Text>
                <Text style={[styles.orderVal, { color: COLORS.gold }]}>₹{latestOrder.total}</Text>
              </View>
              <View style={styles.orderRow}>
                <Text style={styles.orderLabel}>{"Status"}</Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>✓ {"Confirmed"}</Text>
                </View>
              </View>
              <View style={styles.orderRow}>
                <Text style={styles.orderLabel}>{"Tracking"}</Text>
                <Text style={styles.orderVal}>{latestOrder.tracking}</Text>
              </View>
            </View>
          }

          <View style={styles.impactCard}>
            <Text style={styles.impactTitle}>{"🌱 Thank You for Your Support!"}</Text>
            <Text style={styles.impactText}>{"Your purchase empowers SHG women and artisan families of West Bengal. You're helping build dignified livelihoods."}</Text>
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity
              onPress={() => latestOrder ?
              navigation.navigate('OrderDetail', { order: latestOrder }) :
              navigation.navigate('OrderHistory')
              }
              style={styles.trackBtn}>
              
              <Text style={styles.trackBtnText}>{"Track Order"} 📋</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.reset({ index: 0, routes: [{ name: 'ConsumerTabs' }] })} style={styles.homeBtn}>
              <LinearGradient colors={[COLORS.saffron, COLORS.gold]} style={styles.homeBtnGrad}>
                <Text style={styles.homeBtnText}>{"Continue Shopping"}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    flex: 1,
    minHeight: 0,
    width: '100%',
    ...(Platform.OS === 'web' ? { overflow: 'auto', WebkitOverflowScrolling: 'touch' } : {})
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'web' ? 40 : 30
  },
  iconCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  successIcon: { fontSize: 60 },
  title: { fontSize: 30, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.75)', textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  orderCard: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: 20, width: '100%', marginBottom: 16, gap: 12 },
  orderId: { fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 4 },
  orderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderLabel: { fontSize: 13, color: 'rgba(255,255,255,0.6)' },
  orderVal: { fontSize: 13, color: '#fff', fontWeight: '600' },
  statusBadge: { backgroundColor: COLORS.success + '30', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 },
  statusText: { fontSize: 12, color: COLORS.mint, fontWeight: '700' },
  impactCard: { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 20, padding: 16, marginBottom: 24 },
  impactTitle: { fontSize: 14, fontWeight: '700', color: COLORS.gold, marginBottom: 6 },
  impactText: { fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 20 },
  buttons: { flexDirection: 'row', gap: 12, width: '100%' },
  trackBtn: { flex: 1, borderRadius: 50, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)', paddingVertical: 14, alignItems: 'center' },
  trackBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  homeBtn: { flex: 1.2, borderRadius: 50, overflow: 'hidden' },
  homeBtnGrad: { paddingVertical: 14, alignItems: 'center' },
  homeBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 }
});
