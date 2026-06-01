// import React, { useState, useRef, useEffect } from "react";
// import {
//   View,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Dimensions,
//   Animated,
//   FlatList,
//   StatusBar,
//   Alert,
//   Image,
//   Linking,
// } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import { COLORS, SHADOWS } from "../../theme/colors";
// import useStore from "../../store/useStore";
// import { imgSrc } from "../../utils/imageSource";
// import Text from "../../autoTranslation/AutoText";
// import useAppLanguage from "../../autoTranslation/useAppLanguage";
// import { CATEGORY_LABELS } from "../../autoTranslation/staticLabels";
// import NariLogoIcon from "../../components/NariLogoIcon";

// const { width } = Dimensions.get("window");

// const CATEGORY_IDS = ["all", "food", "textiles", "crafts"];
// const CAT_EMOJIS = { all: "✨", food: "🍯", textiles: "🧵", crafts: "🏺" };

// const BANNER_KEYS = [
//   {
//     id: "b1",
//     title: "Sundarbans Honey\nNow Available!",
//     sub: "100% Wild & Pure",
//     category: "food",
//     image: require("../../../assets/sundarbans_products.png"),
//     gradient: ["#131D29", "#1C2437"],
//   },
//   {
//     id: "b2",
//     title: "New Baluchari\nCollection",
//     sub: "Rare Silk Sarees from Bishnupur",
//     category: "textiles",
//     image: require("../../../assets/bengal_weaving.png"),
//     gradient: ["#0F1822", "#243050"],
//   },
//   {
//     id: "b3",
//     title: "Tribal Craft\nFestival",
//     sub: "Dokra, Patachitra & More",
//     category: "crafts",
//     image: require("../../../assets/tribal_crafts.png"),
//     gradient: ["#131D29", "#1C2437"],
//   },
// ];

// function BannerCard({ item, onShopNow }) {
//   return (
//     <LinearGradient colors={item.gradient} style={styles.bannerCard}>
//       <View style={styles.bannerContent}>
//         <Text style={styles.bannerTitle}>{item.title}</Text>
//         <Text style={styles.bannerSubtitle}>{item.sub}</Text>

//         <TouchableOpacity
//           onPress={() => onShopNow(item.category)}
//           style={styles.bannerBtn}
//           activeOpacity={0.85}
//         >
//           <Text style={styles.bannerBtnText}>Shop Now →</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.bannerImageWrap}>
//         <Image source={item.image} style={styles.bannerImage} resizeMode="cover" />
//         <LinearGradient
//           colors={["rgba(255,255,255,0.16)", "rgba(255,255,255,0.02)"]}
//           style={styles.bannerImageOverlay}
//         />
//       </View>
//     </LinearGradient>
//   );
// }

// function ProductCard({ product, onPress, onWishlist, isWishlisted }) {
//   const discount =
//     product.mrp && product.price
//       ? Math.round((1 - product.price / product.mrp) * 100)
//       : 0;

//   return (
//     <TouchableOpacity
//       onPress={() => onPress(product)}
//       style={styles.productCard}
//       activeOpacity={0.9}
//     >
//       <View style={styles.productImageBox}>
//         {imgSrc(product.image) ? (
//           <Image source={imgSrc(product.image)} style={styles.productImg} resizeMode="cover" />
//         ) : (
//           <Text style={styles.productEmoji}>{product.emoji || "🛍️"}</Text>
//         )}

//         {product.badge && (
//           <View style={styles.badge}>
//             <Text style={styles.badgeText}>{product.badge}</Text>
//           </View>
//         )}

//         <TouchableOpacity
//           style={styles.wishlistBtn}
//           onPress={(e) => {
//             e.stopPropagation();
//             onWishlist(product);
//           }}
//         >
//           <Text style={{ fontSize: 16 }}>{isWishlisted ? "❤️" : "🤍"}</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.productInfo}>
//         <Text style={styles.productName} numberOfLines={2}>
//           {product.name}
//         </Text>
//         <Text style={styles.productUnit}>{product.unit}</Text>

//         <View style={styles.priceRow}>
//           <Text style={styles.price}>₹{product.price}</Text>
//           <Text style={styles.mrp}>₹{product.mrp}</Text>
//           <Text style={styles.discount}>{discount}% off</Text>
//         </View>

//         <View style={styles.ratingRow}>
//           <Text style={styles.star}>⭐</Text>
//           <Text style={styles.rating}>{product.rating}</Text>
//           <Text style={styles.reviews}>({product.reviews})</Text>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );
// }

// function ArtisanChip({ artisan, onPress }) {
//   return (
//     <TouchableOpacity
//       style={styles.artisanChip}
//       onPress={() => onPress && onPress(artisan)}
//       activeOpacity={0.85}
//     >
//       <Text style={styles.artisanChipEmoji}>{artisan.avatar}</Text>

//       <View style={{ flex: 1 }}>
//         <Text style={styles.artisanChipName} numberOfLines={1}>
//           {artisan.name}
//         </Text>
//         <Text style={styles.artisanChipShg} numberOfLines={1}>
//           {artisan.shg}
//         </Text>
//       </View>

//       <View style={styles.artisanChipBadge}>
//         <Text style={styles.artisanChipBadgeText}>{artisan.products} products</Text>
//       </View>
//     </TouchableOpacity>
//   );
// }

// export default function HomeScreen({ navigation }) {
//   const {
//     products,
//     artisans,
//     selectedCategory,
//     setCategory,
//     toggleWishlist,
//     isWishlisted,
//     getUnreadCount,
//     loadApprovedProducts,
//   } = useStore();

//   useEffect(() => {
//     if (typeof loadApprovedProducts === 'function') {
//       loadApprovedProducts().catch(() => { }); // silent fail — screen still shows
//     }
//   }, []);

//   const lang = useAppLanguage();

//   const [activeBanner, setActiveBanner] = useState(0);
//   const scrollY = useRef(new Animated.Value(0)).current;

//   const featuredProducts = (products || []).slice(0, 8);
//   const newArrivals = (products || []).filter((p) => p.category === "textiles").slice(0, 6);
//   const unread = getUnreadCount ? getUnreadCount() : 0;

//   // Navigate to Explore tab with a specific category selected
//   const goToExplore = (category = "all") => {
//     setCategory(category);
//     // Navigate to the Explore tab — adjust the tab/screen name to match your navigator
//     navigation.navigate("Explore", { category });
//   };

//   // Navigate to ProductDetail screen
//   const goToProduct = (product) => {
//     navigation.navigate("ProductDetail", { product });
//   };

//   // Navigate to Artisan detail (if you have one) or Explore filtered by artisan
//   const goToArtisan = (artisan) => {
//     // If you have an ArtisanDetail screen, use: navigation.navigate("ArtisanDetail", { artisan });
//     // Otherwise fall back to Explore
//     navigation.navigate("Explore", { category: "all" });
//   };

//   const headerBg = scrollY.interpolate({
//     inputRange: [0, 100],
//     outputRange: ["rgba(26,18,8,0)", "rgba(26,18,8,0.98)"],
//     extrapolate: "clamp",
//   });

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" />

//       {/* Floating Header */}
//       <Animated.View style={[styles.floatingHeader, { backgroundColor: headerBg }]}>
//         <View style={styles.headerTop}>
//           <View>
//             <Text style={styles.greeting}>Nari Samman 🙏</Text>

//             <View style={styles.brandRow}>
//               <NariLogoIcon size={35} />
//               <Text style={styles.headerBrand}>Nari Samman</Text>
//             </View>
//           </View>

//           <TouchableOpacity
//             onPress={() => navigation.navigate("Notifications")}
//             style={styles.iconBtn}
//           >
//             <Text style={styles.iconText}>🔔</Text>
//             {unread > 0 && (
//               <View style={styles.notifBadge}>
//                 <Text style={styles.notifBadgeText}>{unread}</Text>
//               </View>
//             )}
//           </TouchableOpacity>
//         </View>

//         {/* Search Bar — tapping opens Explore in search mode */}
//         <TouchableOpacity
//           style={styles.searchBar}
//           onPress={() => goToExplore("all")}
//           activeOpacity={0.8}
//         >
//           <Text style={styles.searchIcon}>🔍</Text>
//           <Text style={styles.searchPlaceholder}>Search products, artisans...</Text>
//         </TouchableOpacity>
//       </Animated.View>

//       <Animated.ScrollView
//         style={styles.scroll}
//         contentContainerStyle={styles.scrollContent}
//         onScroll={Animated.event(
//           [{ nativeEvent: { contentOffset: { y: scrollY } } }],
//           { useNativeDriver: false }
//         )}
//         scrollEventThrottle={16}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Hero Banner */}
//         <LinearGradient colors={["#0F1822", "#1C2437", "#243050"]} style={styles.hero}>
//           <View style={{ height: 150 }} />

//           <ScrollView
//             horizontal
//             pagingEnabled
//             showsHorizontalScrollIndicator={false}
//             snapToInterval={width}
//             decelerationRate="fast"
//             onMomentumScrollEnd={(e) => {
//               const index = Math.round(e.nativeEvent.contentOffset.x / width);
//               setActiveBanner(index);
//             }}
//             style={{ width }}
//           >
//             {BANNER_KEYS.map((item) => (
//               <BannerCard key={item.id} item={item} onShopNow={goToExplore} />
//             ))}
//           </ScrollView>

//           <View style={styles.dots}>
//             {BANNER_KEYS.map((_, i) => (
//               <View key={i} style={[styles.dot, activeBanner === i && styles.dotActive]} />
//             ))}
//           </View>
//         </LinearGradient>

//         {/* Category Chips */}
//         <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitleNoPad}>Browse by Category</Text>
//             <TouchableOpacity onPress={() => goToExplore("all")}>
//               <Text style={styles.seeAll}>View All →</Text>
//             </TouchableOpacity>
//           </View>

//           <ScrollView
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={styles.categories}
//           >
//             {CATEGORY_IDS.map((id) => {
//               const label = CATEGORY_LABELS?.[id] || id;
//               const isActive = selectedCategory === id;

//               return (
//                 <TouchableOpacity
//                   key={id}
//                   onPress={() => goToExplore(id)}
//                   style={[styles.catChip, isActive && styles.catChipActive]}
//                   activeOpacity={0.8}
//                 >
//                   <Text style={styles.catEmoji}>{CAT_EMOJIS[id]}</Text>
//                   <Text style={[styles.catLabel, isActive && styles.catLabelActive]}>
//                     {label}
//                   </Text>
//                 </TouchableOpacity>
//               );
//             })}
//           </ScrollView>
//         </View>

//         {/* Featured Products */}
//         <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitleNoPad}>Featured Products</Text>
//             <TouchableOpacity onPress={() => goToExplore("all")}>
//               <Text style={styles.seeAll}>View All →</Text>
//             </TouchableOpacity>
//           </View>

//           <FlatList
//             data={featuredProducts}
//             renderItem={({ item }) => (
//               <ProductCard
//                 product={item}
//                 onPress={goToProduct}
//                 onWishlist={toggleWishlist}
//                 isWishlisted={isWishlisted(item.id)}
//               />
//             )}
//             keyExtractor={(i) => i.id}
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
//           />
//         </View>

//         {/* Artisan Banner */}
//         <LinearGradient
//           colors={[COLORS.green + "20", COLORS.greenLight + "10"]}
//           style={styles.artisanBanner}
//         >
//           <Text style={styles.artisanBannerTitle}>🌱 Meet Our Artisans</Text>
//           <Text style={styles.artisanBannerSub}>
//             Every purchase directly empowers an SHG woman or tribal artisan
//           </Text>

//           <ScrollView
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={{ gap: 12, paddingTop: 12 }}
//           >
//             {(artisans || []).slice(0, 4).map((a) => (
//               <ArtisanChip key={a.id} artisan={a} onPress={goToArtisan} />
//             ))}
//           </ScrollView>
//         </LinearGradient>

//         {/* WhatsApp Banner */}
//         <TouchableOpacity
//           style={styles.whatsappBanner}
//           activeOpacity={0.85}
//           onPress={() => {
//             const msg =
//               "Hi! I want to order from Nari Samman artisan products. Please share the catalogue!";
//             const url = `whatsapp://send?phone=919876500000&text=${encodeURIComponent(msg)}`;

//             Linking.canOpenURL(url)
//               .then((ok) =>
//                 ok ? Linking.openURL(url) : Alert.alert("WhatsApp not available")
//               )
//               .catch(() => Alert.alert("Error", "Could not open WhatsApp."));
//           }}
//         >
//           <View style={styles.whatsappLeft}>
//             <Text style={styles.whatsappBannerIcon}>💬</Text>
//             <View style={{ flex: 1 }}>
//               <Text style={styles.whatsappBannerTitle}>Order via WhatsApp</Text>
//               <Text style={styles.whatsappBannerSub}>
//                 Chat with your local agent · COD available
//               </Text>
//             </View>
//           </View>

//           <Text style={styles.whatsappArrow}>→</Text>
//         </TouchableOpacity>

//         {/* Trending Now (Textiles) */}
//         <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitleNoPad}>Trending Now</Text>
//             <TouchableOpacity onPress={() => goToExplore("textiles")}>
//               <Text style={styles.seeAll}>View All →</Text>
//             </TouchableOpacity>
//           </View>

//           <FlatList
//             data={newArrivals}
//             renderItem={({ item }) => (
//               <ProductCard
//                 product={item}
//                 onPress={goToProduct}
//                 onWishlist={toggleWishlist}
//                 isWishlisted={isWishlisted(item.id)}
//               />
//             )}
//             keyExtractor={(i) => i.id}
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
//           />
//         </View>

//         {/* Impact Section */}
//         <LinearGradient colors={["#0F1822", "#1C2437"]} style={styles.impactSection}>
//           <Text style={styles.impactTitle}>Our Impact 📊</Text>

//           <View style={styles.impactGrid}>
//             {[
//               { label: "SHG Women", value: "6,000+", emoji: "👩" },
//               { label: "Products", value: "342+", emoji: "📦" },
//               { label: "Districts", value: "12", emoji: "📍" },
//               { label: "Happy Buyers", value: "18.5K", emoji: "😊" },
//             ].map((s, i) => (
//               <View key={i} style={styles.statCard}>
//                 <Text style={styles.statEmoji}>{s.emoji}</Text>
//                 <Text style={styles.statValue}>{s.value}</Text>
//                 <Text style={styles.statLabel}>{s.label}</Text>
//               </View>
//             ))}
//           </View>
//         </LinearGradient>

//         <View style={{ height: 30 }} />
//       </Animated.ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, minHeight: 0, backgroundColor: COLORS.dark },

//   floatingHeader: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     zIndex: 100,
//     paddingTop: 48,
//     paddingHorizontal: 16,
//     paddingBottom: 12,
//   },

//   headerTop: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     marginBottom: 12,
//   },

//   greeting: { fontSize: 12, color: "rgba(200,208,228,0.6)" },

//   brandRow: { flexDirection: "row", alignItems: "center", gap: 8 },

//   headerBrand: { fontSize: 20, fontWeight: "800", color: COLORS.gold },

//   iconBtn: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: "rgba(200,208,228,0.1)",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   iconText: { fontSize: 18 },

//   notifBadge: {
//     position: "absolute",
//     top: 6,
//     right: 6,
//     width: 14,
//     height: 14,
//     borderRadius: 7,
//     backgroundColor: COLORS.bengalRed,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   notifBadgeText: { fontSize: 8, color: "#fff", fontWeight: "700" },

//   searchBar: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//     backgroundColor: "rgba(255,255,255,0.07)",
//     borderRadius: 14,
//     paddingHorizontal: 14,
//     paddingVertical: 10,
//     borderWidth: 1,
//     borderColor: "rgba(157,205,67,0.15)",
//   },

//   searchIcon: { fontSize: 16 },

//   searchPlaceholder: { color: "rgba(200,208,228,0.5)", fontSize: 14 },

//   scroll: { flex: 1, minHeight: 0 },

//   scrollContent: { flexGrow: 1 },

//   hero: { paddingBottom: 24 },

//   bannerCard: {
//     width,
//     height: 190,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingLeft: 24,
//     paddingRight: 18,
//     paddingVertical: 22,
//     overflow: "hidden",
//   },

//   bannerContent: {
//     flex: 1,
//     zIndex: 2,
//     paddingRight: 10,
//   },

//   bannerTitle: {
//     fontSize: 21,
//     fontWeight: "900",
//     color: "#fff",
//     lineHeight: 29,
//   },

//   bannerSubtitle: {
//     fontSize: 12,
//     color: "rgba(255,255,255,0.82)",
//     marginTop: 6,
//   },

//   bannerBtn: {
//     marginTop: 14,
//     backgroundColor: COLORS.saffron,
//     borderRadius: 22,
//     paddingHorizontal: 18,
//     paddingVertical: 9,
//     alignSelf: "flex-start",
//     ...SHADOWS.small,
//   },

//   bannerBtnText: {
//     color: "#07111F",
//     fontWeight: "900",
//     fontSize: 13,
//   },

//   bannerImageWrap: {
//     width: 124,
//     height: 124,
//     borderRadius: 28,
//     overflow: "hidden",
//     backgroundColor: "rgba(255,255,255,0.10)",
//     borderWidth: 1,
//     borderColor: "rgba(255,255,255,0.18)",
//     shadowColor: "#000",
//     shadowOpacity: 0.35,
//     shadowRadius: 12,
//     shadowOffset: { width: 0, height: 8 },
//     elevation: 8,
//   },

//   bannerImage: {
//     width: "100%",
//     height: "100%",
//   },

//   bannerImageOverlay: {
//     position: "absolute",
//     left: 0,
//     right: 0,
//     top: 0,
//     bottom: 0,
//   },

//   dots: {
//     flexDirection: "row",
//     justifyContent: "center",
//     gap: 6,
//     paddingTop: 12,
//     paddingBottom: 4,
//   },

//   dot: {
//     width: 6,
//     height: 6,
//     borderRadius: 3,
//     backgroundColor: "rgba(255,255,255,0.3)",
//   },

//   dotActive: {
//     width: 20,
//     backgroundColor: COLORS.gold,
//     borderRadius: 3,
//   },

//   section: { paddingTop: 24 },

//   sectionHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     marginBottom: 14,
//   },

//   sectionTitleNoPad: {
//     fontSize: 18,
//     fontWeight: "800",
//     color: COLORS.textPrimary,
//   },

//   seeAll: {
//     fontSize: 13,
//     color: COLORS.saffron,
//     fontWeight: "800",
//   },

//   categories: { paddingHorizontal: 16, gap: 10 },

//   catChip: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderRadius: 50,
//     backgroundColor: COLORS.darkCard,
//     borderWidth: 1.5,
//     borderColor: COLORS.darkBorder,
//     ...SHADOWS.small,
//   },

//   catChipActive: {
//     backgroundColor: COLORS.saffron,
//     borderColor: COLORS.saffron,
//   },

//   catEmoji: { fontSize: 16 },

//   catLabel: {
//     fontSize: 13,
//     fontWeight: "600",
//     color: COLORS.textSecondary,
//     textTransform: "capitalize",
//   },

//   catLabelActive: { color: "#fff" },

//   productCard: {
//     width: 170,
//     backgroundColor: COLORS.darkCard,
//     borderRadius: 18,
//     overflow: "hidden",
//     ...SHADOWS.medium,
//   },

//   productImageBox: {
//     height: 140,
//     backgroundColor: COLORS.darkCard,
//     alignItems: "center",
//     justifyContent: "center",
//     position: "relative",
//     overflow: "hidden",
//   },

//   productImg: { width: "100%", height: 140 },

//   productEmoji: { fontSize: 60 },

//   badge: {
//     position: "absolute",
//     top: 8,
//     left: 8,
//     backgroundColor: COLORS.bengalRed,
//     borderRadius: 8,
//     paddingHorizontal: 8,
//     paddingVertical: 3,
//   },

//   badgeText: { color: "#fff", fontSize: 9, fontWeight: "700" },

//   wishlistBtn: {
//     position: "absolute",
//     top: 8,
//     right: 8,
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//     backgroundColor: "rgba(0,0,0,0.28)",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   productInfo: { padding: 12 },

//   productName: {
//     fontSize: 13,
//     fontWeight: "700",
//     color: COLORS.textPrimary,
//     lineHeight: 18,
//   },

//   productUnit: {
//     fontSize: 11,
//     color: COLORS.textMuted,
//     marginTop: 2,
//   },

//   priceRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     marginTop: 8,
//     flexWrap: "wrap",
//   },

//   price: { fontSize: 16, fontWeight: "800", color: COLORS.saffron },

//   mrp: {
//     fontSize: 12,
//     color: COLORS.textMuted,
//     textDecorationLine: "line-through",
//   },

//   discount: {
//     fontSize: 11,
//     fontWeight: "800",
//     color: COLORS.success,
//   },

//   ratingRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 3,
//     marginTop: 6,
//   },

//   star: { fontSize: 11 },

//   rating: { fontSize: 12, fontWeight: "700", color: COLORS.textPrimary },

//   reviews: { fontSize: 11, color: COLORS.textMuted },

//   artisanBanner: {
//     margin: 16,
//     borderRadius: 20,
//     padding: 20,
//     borderWidth: 1,
//     borderColor: COLORS.greenLight + "30",
//   },

//   artisanBannerTitle: {
//     fontSize: 16,
//     fontWeight: "800",
//     color: COLORS.green,
//   },

//   artisanBannerSub: {
//     fontSize: 12,
//     color: COLORS.textSecondary,
//     marginTop: 4,
//   },

//   artisanChip: {
//     width: 245,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//     backgroundColor: COLORS.darkCard,
//     borderRadius: 50,
//     paddingVertical: 8,
//     paddingHorizontal: 14,
//     ...SHADOWS.small,
//   },

//   artisanChipEmoji: { fontSize: 20 },

//   artisanChipName: {
//     fontSize: 13,
//     fontWeight: "700",
//     color: COLORS.textPrimary,
//   },

//   artisanChipShg: { fontSize: 10, color: COLORS.textMuted },

//   artisanChipBadge: {
//     backgroundColor: COLORS.green + "20",
//     borderRadius: 20,
//     paddingHorizontal: 8,
//     paddingVertical: 3,
//   },

//   artisanChipBadgeText: {
//     fontSize: 10,
//     color: COLORS.green,
//     fontWeight: "700",
//   },

//   whatsappBanner: {
//     marginHorizontal: 16,
//     marginBottom: 4,
//     backgroundColor: "#25D36618",
//     borderRadius: 18,
//     padding: 16,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     borderWidth: 1.5,
//     borderColor: "#25D36640",
//   },

//   whatsappLeft: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 12,
//     flex: 1,
//   },

//   whatsappBannerIcon: { fontSize: 30 },

//   whatsappBannerTitle: {
//     fontSize: 14,
//     fontWeight: "800",
//     color: "#25D366",
//   },

//   whatsappBannerSub: {
//     fontSize: 11,
//     color: COLORS.textMuted,
//     marginTop: 2,
//   },

//   whatsappArrow: {
//     fontSize: 20,
//     color: "#25D366",
//     fontWeight: "700",
//   },

//   impactSection: {
//     margin: 16,
//     borderRadius: 20,
//     padding: 20,
//   },

//   impactTitle: {
//     fontSize: 16,
//     fontWeight: "800",
//     color: COLORS.gold,
//     marginBottom: 16,
//   },

//   impactGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 12,
//   },

//   statCard: {
//     width: "47%",
//     backgroundColor: "rgba(200,208,228,0.10)",
//     borderRadius: 16,
//     padding: 16,
//     alignItems: "center",
//     minHeight: 110,
//     justifyContent: "center",
//   },

//   statEmoji: { fontSize: 26, marginBottom: 8 },

//   statValue: {
//     fontSize: 22,
//     fontWeight: "900",
//     color: COLORS.gold,
//   },

//   statLabel: {
//     fontSize: 11,
//     color: "rgba(200,208,228,0.6)",
//     marginTop: 3,
//     textAlign: "center",
//   },
// });





















// ─────────────────────────────────────────────────────────────────────────────
//  HomeScreen.js — MODIFIED VERSION
//
//  CHANGES FROM ORIGINAL (search "AI ASSISTANT ADDITION" to find both):
//
//  1. Line ~12:  Added import for AIAssistantFAB component.
//  2. ~Line 210: Added <AIAssistantFAB /> as the last child of the root <View>.
//
//  NOTHING ELSE CHANGED:
//  • All business logic is identical.
//  • useStore(), loadApprovedProducts(), wishlist, cart — untouched.
//  • BannerCard, ProductCard, ArtisanChip — untouched.
//  • All StyleSheet entries — untouched.
//  • Navigation to Explore, ProductDetail, Notifications — untouched.
//  • AutoText / useAppLanguage — untouched.
//  • WhatsApp banner logic — untouched.
//
// ─────────────────────────────────────────────────────────────────────────────

// import React, { useState, useRef, useEffect } from "react";
// import {
//   View,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Dimensions,
//   Animated,
//   FlatList,
//   StatusBar,
//   Alert,
//   Image,
//   Linking,
// } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import { COLORS, SHADOWS } from "../../theme/colors";
// import useStore from "../../store/useStore";
// import { imgSrc } from "../../utils/imageSource";
// import Text from "../../autoTranslation/AutoText";
// import useAppLanguage from "../../autoTranslation/useAppLanguage";
// import { CATEGORY_LABELS } from "../../autoTranslation/staticLabels";
// import NariLogoIcon from "../../components/NariLogoIcon";

// // ─── AI ASSISTANT ADDITION #1 ─────────────────────────────────────────────────
// // New import — component lives in components/AIAssistantFAB.js
// import AIAssistantFAB from "../../components/AIAssistantFAB";
// // ─────────────────────────────────────────────────────────────────────────────

// const { width } = Dimensions.get("window");

// const CATEGORY_IDS = ["all", "food", "textiles", "crafts"];
// const CAT_EMOJIS = { all: "✨", food: "🍯", textiles: "🧵", crafts: "🏺" };

// const BANNER_KEYS = [
//   {
//     id: "b1",
//     title: "Sundarbans Honey\nNow Available!",
//     sub: "100% Wild & Pure",
//     category: "food",
//     image: require("../../../assets/sundarbans_products.png"),
//     gradient: ["#131D29", "#1C2437"],
//   },
//   {
//     id: "b2",
//     title: "New Baluchari\nCollection",
//     sub: "Rare Silk Sarees from Bishnupur",
//     category: "textiles",
//     image: require("../../../assets/bengal_weaving.png"),
//     gradient: ["#0F1822", "#243050"],
//   },
//   {
//     id: "b3",
//     title: "Tribal Craft\nFestival",
//     sub: "Dokra, Patachitra & More",
//     category: "crafts",
//     image: require("../../../assets/tribal_crafts.png"),
//     gradient: ["#131D29", "#1C2437"],
//   },
// ];

// function BannerCard({ item, onShopNow }) {
//   return (
//     <LinearGradient colors={item.gradient} style={styles.bannerCard}>
//       <View style={styles.bannerContent}>
//         <Text style={styles.bannerTitle}>{item.title}</Text>
//         <Text style={styles.bannerSubtitle}>{item.sub}</Text>

//         <TouchableOpacity
//           onPress={() => onShopNow(item.category)}
//           style={styles.bannerBtn}
//           activeOpacity={0.85}
//         >
//           <Text style={styles.bannerBtnText}>Shop Now →</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.bannerImageWrap}>
//         <Image source={item.image} style={styles.bannerImage} resizeMode="cover" />
//         <LinearGradient
//           colors={["rgba(255,255,255,0.16)", "rgba(255,255,255,0.02)"]}
//           style={styles.bannerImageOverlay}
//         />
//       </View>
//     </LinearGradient>
//   );
// }

// function ProductCard({ product, onPress, onWishlist, isWishlisted }) {
//   const discount =
//     product.mrp && product.price
//       ? Math.round((1 - product.price / product.mrp) * 100)
//       : 0;

//   return (
//     <TouchableOpacity
//       onPress={() => onPress(product)}
//       style={styles.productCard}
//       activeOpacity={0.9}
//     >
//       <View style={styles.productImageBox}>
//         {imgSrc(product.image) ? (
//           <Image source={imgSrc(product.image)} style={styles.productImg} resizeMode="cover" />
//         ) : (
//           <Text style={styles.productEmoji}>{product.emoji || "🛍️"}</Text>
//         )}

//         {product.badge && (
//           <View style={styles.badge}>
//             <Text style={styles.badgeText}>{product.badge}</Text>
//           </View>
//         )}

//         <TouchableOpacity
//           style={styles.wishlistBtn}
//           onPress={(e) => {
//             e.stopPropagation();
//             onWishlist(product);
//           }}
//         >
//           <Text style={{ fontSize: 16 }}>{isWishlisted ? "❤️" : "🤍"}</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.productInfo}>
//         <Text style={styles.productName} numberOfLines={2}>
//           {product.name}
//         </Text>
//         <Text style={styles.productUnit}>{product.unit}</Text>

//         <View style={styles.priceRow}>
//           <Text style={styles.price}>₹{product.price}</Text>
//           <Text style={styles.mrp}>₹{product.mrp}</Text>
//           <Text style={styles.discount}>{discount}% off</Text>
//         </View>

//         <View style={styles.ratingRow}>
//           <Text style={styles.star}>⭐</Text>
//           <Text style={styles.rating}>{product.rating}</Text>
//           <Text style={styles.reviews}>({product.reviews})</Text>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );
// }

// function ArtisanChip({ artisan, onPress }) {
//   return (
//     <TouchableOpacity
//       style={styles.artisanChip}
//       onPress={() => onPress && onPress(artisan)}
//       activeOpacity={0.85}
//     >
//       <Text style={styles.artisanChipEmoji}>{artisan.avatar}</Text>

//       <View style={{ flex: 1 }}>
//         <Text style={styles.artisanChipName} numberOfLines={1}>
//           {artisan.name}
//         </Text>
//         <Text style={styles.artisanChipShg} numberOfLines={1}>
//           {artisan.shg}
//         </Text>
//       </View>

//       <View style={styles.artisanChipBadge}>
//         <Text style={styles.artisanChipBadgeText}>{artisan.products} products</Text>
//       </View>
//     </TouchableOpacity>
//   );
// }

// export default function HomeScreen({ navigation }) {
//   const {
//     products,
//     artisans,
//     selectedCategory,
//     setCategory,
//     toggleWishlist,
//     isWishlisted,
//     getUnreadCount,
//     loadApprovedProducts,
//   } = useStore();

//   useEffect(() => {
//     if (typeof loadApprovedProducts === 'function') {
//       loadApprovedProducts().catch(() => { }); // silent fail — screen still shows
//     }
//   }, []);

//   const lang = useAppLanguage();

//   const [activeBanner, setActiveBanner] = useState(0);
//   const scrollY = useRef(new Animated.Value(0)).current;

//   const featuredProducts = (products || []).slice(0, 8);
//   const newArrivals = (products || []).filter((p) => p.category === "textiles").slice(0, 6);
//   const unread = getUnreadCount ? getUnreadCount() : 0;

//   const goToExplore = (category = "all") => {
//     setCategory(category);
//     navigation.navigate("Explore", { category });
//   };

//   const goToProduct = (product) => {
//     navigation.navigate("ProductDetail", { product });
//   };

//   const goToArtisan = (artisan) => {
//     navigation.navigate("Explore", { category: "all" });
//   };

//   const headerBg = scrollY.interpolate({
//     inputRange: [0, 100],
//     outputRange: ["rgba(26,18,8,0)", "rgba(26,18,8,0.98)"],
//     extrapolate: "clamp",
//   });

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" />

//       {/* Floating Header */}
//       <Animated.View style={[styles.floatingHeader, { backgroundColor: headerBg }]}>
//         <View style={styles.headerTop}>
//           <View>
//             <Text style={styles.greeting}>Nari Samman 🙏</Text>

//             <View style={styles.brandRow}>
//               <NariLogoIcon size={35} />
//               <Text style={styles.headerBrand}>Nari Samman</Text>
//             </View>
//           </View>

//           <TouchableOpacity
//             onPress={() => navigation.navigate("Notifications")}
//             style={styles.iconBtn}
//           >
//             <Text style={styles.iconText}>🔔</Text>
//             {unread > 0 && (
//               <View style={styles.notifBadge}>
//                 <Text style={styles.notifBadgeText}>{unread}</Text>
//               </View>
//             )}
//           </TouchableOpacity>
//         </View>

//         <TouchableOpacity
//           style={styles.searchBar}
//           onPress={() => goToExplore("all")}
//           activeOpacity={0.8}
//         >
//           <Text style={styles.searchIcon}>🔍</Text>
//           <Text style={styles.searchPlaceholder}>Search products, artisans...</Text>
//         </TouchableOpacity>
//       </Animated.View>

//       <Animated.ScrollView
//         style={styles.scroll}
//         contentContainerStyle={styles.scrollContent}
//         onScroll={Animated.event(
//           [{ nativeEvent: { contentOffset: { y: scrollY } } }],
//           { useNativeDriver: false }
//         )}
//         scrollEventThrottle={16}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Hero Banner */}
//         <LinearGradient colors={["#0F1822", "#1C2437", "#243050"]} style={styles.hero}>
//           <View style={{ height: 150 }} />

//           <ScrollView
//             horizontal
//             pagingEnabled
//             showsHorizontalScrollIndicator={false}
//             snapToInterval={width}
//             decelerationRate="fast"
//             onMomentumScrollEnd={(e) => {
//               const index = Math.round(e.nativeEvent.contentOffset.x / width);
//               setActiveBanner(index);
//             }}
//             style={{ width }}
//           >
//             {BANNER_KEYS.map((item) => (
//               <BannerCard key={item.id} item={item} onShopNow={goToExplore} />
//             ))}
//           </ScrollView>

//           <View style={styles.dots}>
//             {BANNER_KEYS.map((_, i) => (
//               <View key={i} style={[styles.dot, activeBanner === i && styles.dotActive]} />
//             ))}
//           </View>
//         </LinearGradient>

//         {/* Category Chips */}
//         <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitleNoPad}>Browse by Category</Text>
//             <TouchableOpacity onPress={() => goToExplore("all")}>
//               <Text style={styles.seeAll}>View All →</Text>
//             </TouchableOpacity>
//           </View>

//           <ScrollView
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={styles.categories}
//           >
//             {CATEGORY_IDS.map((id) => {
//               const label = CATEGORY_LABELS?.[id] || id;
//               const isActive = selectedCategory === id;

//               return (
//                 <TouchableOpacity
//                   key={id}
//                   onPress={() => goToExplore(id)}
//                   style={[styles.catChip, isActive && styles.catChipActive]}
//                   activeOpacity={0.8}
//                 >
//                   <Text style={styles.catEmoji}>{CAT_EMOJIS[id]}</Text>
//                   <Text style={[styles.catLabel, isActive && styles.catLabelActive]}>
//                     {label}
//                   </Text>
//                 </TouchableOpacity>
//               );
//             })}
//           </ScrollView>
//         </View>

//         {/* Featured Products */}
//         <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitleNoPad}>Featured Products</Text>
//             <TouchableOpacity onPress={() => goToExplore("all")}>
//               <Text style={styles.seeAll}>View All →</Text>
//             </TouchableOpacity>
//           </View>

//           <FlatList
//             data={featuredProducts}
//             renderItem={({ item }) => (
//               <ProductCard
//                 product={item}
//                 onPress={goToProduct}
//                 onWishlist={toggleWishlist}
//                 isWishlisted={isWishlisted(item.id)}
//               />
//             )}
//             keyExtractor={(i) => i.id}
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
//           />
//         </View>

//         {/* Artisan Banner */}
//         <LinearGradient
//           colors={[COLORS.green + "20", COLORS.greenLight + "10"]}
//           style={styles.artisanBanner}
//         >
//           <Text style={styles.artisanBannerTitle}>🌱 Meet Our Artisans</Text>
//           <Text style={styles.artisanBannerSub}>
//             Every purchase directly empowers an SHG woman or tribal artisan
//           </Text>

//           <ScrollView
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={{ gap: 12, paddingTop: 12 }}
//           >
//             {(artisans || []).slice(0, 4).map((a) => (
//               <ArtisanChip key={a.id} artisan={a} onPress={goToArtisan} />
//             ))}
//           </ScrollView>
//         </LinearGradient>

//         {/* WhatsApp Banner */}
//         <TouchableOpacity
//           style={styles.whatsappBanner}
//           activeOpacity={0.85}
//           onPress={() => {
//             const msg =
//               "Hi! I want to order from Nari Samman artisan products. Please share the catalogue!";
//             const url = `whatsapp://send?phone=919876500000&text=${encodeURIComponent(msg)}`;

//             Linking.canOpenURL(url)
//               .then((ok) =>
//                 ok ? Linking.openURL(url) : Alert.alert("WhatsApp not available")
//               )
//               .catch(() => Alert.alert("Error", "Could not open WhatsApp."));
//           }}
//         >
//           <View style={styles.whatsappLeft}>
//             <Text style={styles.whatsappBannerIcon}>💬</Text>
//             <View style={{ flex: 1 }}>
//               <Text style={styles.whatsappBannerTitle}>Order via WhatsApp</Text>
//               <Text style={styles.whatsappBannerSub}>
//                 Chat with your local agent · COD available
//               </Text>
//             </View>
//           </View>

//           <Text style={styles.whatsappArrow}>→</Text>
//         </TouchableOpacity>

//         {/* Trending Now (Textiles) */}
//         <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitleNoPad}>Trending Now</Text>
//             <TouchableOpacity onPress={() => goToExplore("textiles")}>
//               <Text style={styles.seeAll}>View All →</Text>
//             </TouchableOpacity>
//           </View>

//           <FlatList
//             data={newArrivals}
//             renderItem={({ item }) => (
//               <ProductCard
//                 product={item}
//                 onPress={goToProduct}
//                 onWishlist={toggleWishlist}
//                 isWishlisted={isWishlisted(item.id)}
//               />
//             )}
//             keyExtractor={(i) => i.id}
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
//           />
//         </View>

//         {/* Impact Section */}
//         <LinearGradient colors={["#0F1822", "#1C2437"]} style={styles.impactSection}>
//           <Text style={styles.impactTitle}>Our Impact 📊</Text>

//           <View style={styles.impactGrid}>
//             {[
//               { label: "SHG Women", value: "6,000+", emoji: "👩" },
//               { label: "Products", value: "342+", emoji: "📦" },
//               { label: "Districts", value: "12", emoji: "📍" },
//               { label: "Happy Buyers", value: "18.5K", emoji: "😊" },
//             ].map((s, i) => (
//               <View key={i} style={styles.statCard}>
//                 <Text style={styles.statEmoji}>{s.emoji}</Text>
//                 <Text style={styles.statValue}>{s.value}</Text>
//                 <Text style={styles.statLabel}>{s.label}</Text>
//               </View>
//             ))}
//           </View>
//         </LinearGradient>

//         <View style={{ height: 30 }} />
//       </Animated.ScrollView>

//       {/* ─── AI ASSISTANT ADDITION #2 ─────────────────────────────────────────
//           Single line addition. Placed as the last child of the root <View>
//           so it renders above ALL content (zIndex:200 in the component).
//           onPress navigates to AIAssistant screen — no store/logic changes.
//       ──────────────────────────────────────────────────────────────────────── */}
//       <AIAssistantFAB onPress={() => navigation.navigate("AIAssistant")} />
//       {/* ──────────────────────────────────────────────────────────────────── */}

//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, minHeight: 0, backgroundColor: COLORS.dark },

//   floatingHeader: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     zIndex: 100,
//     paddingTop: 48,
//     paddingHorizontal: 16,
//     paddingBottom: 12,
//   },

//   headerTop: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     marginBottom: 12,
//   },

//   greeting: { fontSize: 12, color: "rgba(200,208,228,0.6)" },

//   brandRow: { flexDirection: "row", alignItems: "center", gap: 8 },

//   headerBrand: { fontSize: 20, fontWeight: "800", color: COLORS.gold },

//   iconBtn: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: "rgba(200,208,228,0.1)",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   iconText: { fontSize: 18 },

//   notifBadge: {
//     position: "absolute",
//     top: 6,
//     right: 6,
//     width: 14,
//     height: 14,
//     borderRadius: 7,
//     backgroundColor: COLORS.bengalRed,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   notifBadgeText: { fontSize: 8, color: "#fff", fontWeight: "700" },

//   searchBar: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//     backgroundColor: "rgba(255,255,255,0.07)",
//     borderRadius: 14,
//     paddingHorizontal: 14,
//     paddingVertical: 10,
//     borderWidth: 1,
//     borderColor: "rgba(157,205,67,0.15)",
//   },

//   searchIcon: { fontSize: 16 },

//   searchPlaceholder: { color: "rgba(200,208,228,0.5)", fontSize: 14 },

//   scroll: { flex: 1, minHeight: 0 },

//   scrollContent: { flexGrow: 1 },

//   hero: { paddingBottom: 24 },

//   bannerCard: {
//     width,
//     height: 190,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingLeft: 24,
//     paddingRight: 18,
//     paddingVertical: 22,
//     overflow: "hidden",
//   },

//   bannerContent: {
//     flex: 1,
//     zIndex: 2,
//     paddingRight: 10,
//   },

//   bannerTitle: {
//     fontSize: 21,
//     fontWeight: "900",
//     color: "#fff",
//     lineHeight: 29,
//   },

//   bannerSubtitle: {
//     fontSize: 12,
//     color: "rgba(255,255,255,0.82)",
//     marginTop: 6,
//   },

//   bannerBtn: {
//     marginTop: 14,
//     backgroundColor: COLORS.saffron,
//     borderRadius: 22,
//     paddingHorizontal: 18,
//     paddingVertical: 9,
//     alignSelf: "flex-start",
//     ...SHADOWS.small,
//   },

//   bannerBtnText: {
//     color: "#07111F",
//     fontWeight: "900",
//     fontSize: 13,
//   },

//   bannerImageWrap: {
//     width: 124,
//     height: 124,
//     borderRadius: 28,
//     overflow: "hidden",
//     backgroundColor: "rgba(255,255,255,0.10)",
//     borderWidth: 1,
//     borderColor: "rgba(255,255,255,0.18)",
//     shadowColor: "#000",
//     shadowOpacity: 0.35,
//     shadowRadius: 12,
//     shadowOffset: { width: 0, height: 8 },
//     elevation: 8,
//   },

//   bannerImage: {
//     width: "100%",
//     height: "100%",
//   },

//   bannerImageOverlay: {
//     position: "absolute",
//     left: 0,
//     right: 0,
//     top: 0,
//     bottom: 0,
//   },

//   dots: {
//     flexDirection: "row",
//     justifyContent: "center",
//     gap: 6,
//     paddingTop: 12,
//     paddingBottom: 4,
//   },

//   dot: {
//     width: 6,
//     height: 6,
//     borderRadius: 3,
//     backgroundColor: "rgba(255,255,255,0.3)",
//   },

//   dotActive: {
//     width: 20,
//     backgroundColor: COLORS.gold,
//     borderRadius: 3,
//   },

//   section: { paddingTop: 24 },

//   sectionHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     marginBottom: 14,
//   },

//   sectionTitleNoPad: {
//     fontSize: 18,
//     fontWeight: "800",
//     color: COLORS.textPrimary,
//   },

//   seeAll: {
//     fontSize: 13,
//     color: COLORS.saffron,
//     fontWeight: "800",
//   },

//   categories: { paddingHorizontal: 16, gap: 10 },

//   catChip: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderRadius: 50,
//     backgroundColor: COLORS.darkCard,
//     borderWidth: 1.5,
//     borderColor: COLORS.darkBorder,
//     ...SHADOWS.small,
//   },

//   catChipActive: {
//     backgroundColor: COLORS.saffron,
//     borderColor: COLORS.saffron,
//   },

//   catEmoji: { fontSize: 16 },

//   catLabel: {
//     fontSize: 13,
//     fontWeight: "600",
//     color: COLORS.textSecondary,
//     textTransform: "capitalize",
//   },

//   catLabelActive: { color: "#fff" },

//   productCard: {
//     width: 170,
//     backgroundColor: COLORS.darkCard,
//     borderRadius: 18,
//     overflow: "hidden",
//     ...SHADOWS.medium,
//   },

//   productImageBox: {
//     height: 140,
//     backgroundColor: COLORS.darkCard,
//     alignItems: "center",
//     justifyContent: "center",
//     position: "relative",
//     overflow: "hidden",
//   },

//   productImg: { width: "100%", height: 140 },

//   productEmoji: { fontSize: 60 },

//   badge: {
//     position: "absolute",
//     top: 8,
//     left: 8,
//     backgroundColor: COLORS.bengalRed,
//     borderRadius: 8,
//     paddingHorizontal: 8,
//     paddingVertical: 3,
//   },

//   badgeText: { color: "#fff", fontSize: 9, fontWeight: "700" },

//   wishlistBtn: {
//     position: "absolute",
//     top: 8,
//     right: 8,
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//     backgroundColor: "rgba(0,0,0,0.28)",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   productInfo: { padding: 12 },

//   productName: {
//     fontSize: 13,
//     fontWeight: "700",
//     color: COLORS.textPrimary,
//     lineHeight: 18,
//   },

//   productUnit: {
//     fontSize: 11,
//     color: COLORS.textMuted,
//     marginTop: 2,
//   },

//   priceRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     marginTop: 8,
//     flexWrap: "wrap",
//   },

//   price: { fontSize: 16, fontWeight: "800", color: COLORS.saffron },

//   mrp: {
//     fontSize: 12,
//     color: COLORS.textMuted,
//     textDecorationLine: "line-through",
//   },

//   discount: {
//     fontSize: 11,
//     fontWeight: "800",
//     color: COLORS.success,
//   },

//   ratingRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 3,
//     marginTop: 6,
//   },

//   star: { fontSize: 11 },

//   rating: { fontSize: 12, fontWeight: "700", color: COLORS.textPrimary },

//   reviews: { fontSize: 11, color: COLORS.textMuted },

//   artisanBanner: {
//     margin: 16,
//     borderRadius: 20,
//     padding: 20,
//     borderWidth: 1,
//     borderColor: COLORS.greenLight + "30",
//   },

//   artisanBannerTitle: {
//     fontSize: 16,
//     fontWeight: "800",
//     color: COLORS.green,
//   },

//   artisanBannerSub: {
//     fontSize: 12,
//     color: COLORS.textSecondary,
//     marginTop: 4,
//   },

//   artisanChip: {
//     width: 245,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//     backgroundColor: COLORS.darkCard,
//     borderRadius: 50,
//     paddingVertical: 8,
//     paddingHorizontal: 14,
//     ...SHADOWS.small,
//   },

//   artisanChipEmoji: { fontSize: 20 },

//   artisanChipName: {
//     fontSize: 13,
//     fontWeight: "700",
//     color: COLORS.textPrimary,
//   },

//   artisanChipShg: { fontSize: 10, color: COLORS.textMuted },

//   artisanChipBadge: {
//     backgroundColor: COLORS.green + "20",
//     borderRadius: 20,
//     paddingHorizontal: 8,
//     paddingVertical: 3,
//   },

//   artisanChipBadgeText: {
//     fontSize: 10,
//     color: COLORS.green,
//     fontWeight: "700",
//   },

//   whatsappBanner: {
//     marginHorizontal: 16,
//     marginBottom: 4,
//     backgroundColor: "#25D36618",
//     borderRadius: 18,
//     padding: 16,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     borderWidth: 1.5,
//     borderColor: "#25D36640",
//   },

//   whatsappLeft: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 12,
//     flex: 1,
//   },

//   whatsappBannerIcon: { fontSize: 30 },

//   whatsappBannerTitle: {
//     fontSize: 14,
//     fontWeight: "800",
//     color: "#25D366",
//   },

//   whatsappBannerSub: {
//     fontSize: 11,
//     color: COLORS.textMuted,
//     marginTop: 2,
//   },

//   whatsappArrow: {
//     fontSize: 20,
//     color: "#25D366",
//     fontWeight: "700",
//   },

//   impactSection: {
//     margin: 16,
//     borderRadius: 20,
//     padding: 20,
//   },

//   impactTitle: {
//     fontSize: 16,
//     fontWeight: "800",
//     color: COLORS.gold,
//     marginBottom: 16,
//   },

//   impactGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 12,
//   },

//   statCard: {
//     width: "47%",
//     backgroundColor: "rgba(200,208,228,0.10)",
//     borderRadius: 16,
//     padding: 16,
//     alignItems: "center",
//     minHeight: 110,
//     justifyContent: "center",
//   },

//   statEmoji: { fontSize: 26, marginBottom: 8 },

//   statValue: {
//     fontSize: 22,
//     fontWeight: "900",
//     color: COLORS.gold,
//   },

//   statLabel: {
//     fontSize: 11,
//     color: "rgba(200,208,228,0.6)",
//     marginTop: 3,
//     textAlign: "center",
//   },
// });

















import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  FlatList,
  StatusBar,
  Alert,
  Image,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, SHADOWS } from "../../theme/colors";
import useStore from "../../store/useStore";
import { imgSrc } from "../../utils/imageSource";
import Text from "../../autoTranslation/AutoText";
import useAppLanguage from "../../autoTranslation/useAppLanguage";
import { CATEGORY_LABELS } from "../../autoTranslation/staticLabels";
import NariLogoIcon from "../../components/NariLogoIcon";

// AIAssistantFAB has been moved to ConsumerTabs — renders once across all tabs.
// No import needed here.

const { width } = Dimensions.get("window");

const CATEGORY_IDS = ["all", "food", "textiles", "crafts"];
const CAT_EMOJIS = { all: "✨", food: "🍯", textiles: "🧵", crafts: "🏺" };

const BANNER_KEYS = [
  {
    id: "b1",
    title: "Sundarbans Honey\nNow Available!",
    sub: "100% Wild & Pure",
    category: "food",
    image: require("../../../assets/sundarbans_products.png"),
    gradient: ["#131D29", "#1C2437"],
  },
  {
    id: "b2",
    title: "New Baluchari\nCollection",
    sub: "Rare Silk Sarees from Bishnupur",
    category: "textiles",
    image: require("../../../assets/bengal_weaving.png"),
    gradient: ["#0F1822", "#243050"],
  },
  {
    id: "b3",
    title: "Tribal Craft\nFestival",
    sub: "Dokra, Patachitra & More",
    category: "crafts",
    image: require("../../../assets/tribal_crafts.png"),
    gradient: ["#131D29", "#1C2437"],
  },
];

function BannerCard({ item, onShopNow }) {
  return (
    <LinearGradient colors={item.gradient} style={styles.bannerCard}>
      <View style={styles.bannerContent}>
        <Text style={styles.bannerTitle}>{item.title}</Text>
        <Text style={styles.bannerSubtitle}>{item.sub}</Text>

        <TouchableOpacity
          onPress={() => onShopNow(item.category)}
          style={styles.bannerBtn}
          activeOpacity={0.85}
        >
          <Text style={styles.bannerBtnText}>Shop Now →</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bannerImageWrap}>
        <Image source={item.image} style={styles.bannerImage} resizeMode="cover" />
        <LinearGradient
          colors={["rgba(255,255,255,0.16)", "rgba(255,255,255,0.02)"]}
          style={styles.bannerImageOverlay}
        />
      </View>
    </LinearGradient>
  );
}

function ProductCard({ product, onPress, onWishlist, isWishlisted }) {
  const discount =
    product.mrp && product.price
      ? Math.round((1 - product.price / product.mrp) * 100)
      : 0;

  return (
    <TouchableOpacity
      onPress={() => onPress(product)}
      style={styles.productCard}
      activeOpacity={0.9}
    >
      <View style={styles.productImageBox}>
        {imgSrc(product.image) ? (
          <Image source={imgSrc(product.image)} style={styles.productImg} resizeMode="cover" />
        ) : (
          <Text style={styles.productEmoji}>{product.emoji || "🛍️"}</Text>
        )}

        {product.badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{product.badge}</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.wishlistBtn}
          onPress={(e) => {
            e.stopPropagation();
            onWishlist(product);
          }}
        >
          <Text style={{ fontSize: 16 }}>{isWishlisted ? "❤️" : "🤍"}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.productUnit}>{product.unit}</Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{product.price}</Text>
          <Text style={styles.mrp}>₹{product.mrp}</Text>
          <Text style={styles.discount}>{discount}% off</Text>
        </View>

        <View style={styles.ratingRow}>
          <Text style={styles.star}>⭐</Text>
          <Text style={styles.rating}>{product.rating}</Text>
          <Text style={styles.reviews}>({product.reviews})</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function ArtisanChip({ artisan, onPress }) {
  return (
    <TouchableOpacity
      style={styles.artisanChip}
      onPress={() => onPress && onPress(artisan)}
      activeOpacity={0.85}
    >
      <Text style={styles.artisanChipEmoji}>{artisan.avatar}</Text>

      <View style={{ flex: 1 }}>
        <Text style={styles.artisanChipName} numberOfLines={1}>
          {artisan.name}
        </Text>
        <Text style={styles.artisanChipShg} numberOfLines={1}>
          {artisan.shg}
        </Text>
      </View>

      <View style={styles.artisanChipBadge}>
        <Text style={styles.artisanChipBadgeText}>{artisan.products} products</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen({ navigation }) {
  const {
    products,
    artisans,
    selectedCategory,
    setCategory,
    toggleWishlist,
    isWishlisted,
    getUnreadCount,
    loadApprovedProducts,
  } = useStore();

  useEffect(() => {
    if (typeof loadApprovedProducts === 'function') {
      loadApprovedProducts().catch(() => { });
    }
  }, []);

  const lang = useAppLanguage();

  const [activeBanner, setActiveBanner] = useState(0);
  const scrollY = useRef(new Animated.Value(0)).current;

  const featuredProducts = (products || []).slice(0, 8);
  const newArrivals = (products || []).filter((p) => p.category === "textiles").slice(0, 6);
  const unread = getUnreadCount ? getUnreadCount() : 0;

  const goToExplore = (category = "all") => {
    setCategory(category);
    navigation.navigate("Explore", { category });
  };

  const goToProduct = (product) => {
    navigation.navigate("ProductDetail", { product });
  };

  const goToArtisan = (artisan) => {
    navigation.navigate("Explore", { category: "all" });
  };

  const headerBg = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: ["rgba(26,18,8,0)", "rgba(26,18,8,0.98)"],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Floating Header */}
      <Animated.View style={[styles.floatingHeader, { backgroundColor: headerBg }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Nari Samman 🙏</Text>

            <View style={styles.brandRow}>
              <NariLogoIcon size={35} />
              <Text style={styles.headerBrand}>Nari Samman</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate("Notifications")}
            style={styles.iconBtn}
          >
            <Text style={styles.iconText}>🔔</Text>
            {unread > 0 && (
              <View style={styles.notifBadge}>
                <Text style={styles.notifBadgeText}>{unread}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => goToExplore("all")}
          activeOpacity={0.8}
        >
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchPlaceholder}>Search products, artisans...</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Banner */}
        <LinearGradient colors={["#0F1822", "#1C2437", "#243050"]} style={styles.hero}>
          <View style={{ height: 150 }} />

          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            snapToInterval={width}
            decelerationRate="fast"
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / width);
              setActiveBanner(index);
            }}
            style={{ width }}
          >
            {BANNER_KEYS.map((item) => (
              <BannerCard key={item.id} item={item} onShopNow={goToExplore} />
            ))}
          </ScrollView>

          <View style={styles.dots}>
            {BANNER_KEYS.map((_, i) => (
              <View key={i} style={[styles.dot, activeBanner === i && styles.dotActive]} />
            ))}
          </View>
        </LinearGradient>

        {/* Category Chips */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitleNoPad}>Browse by Category</Text>
            <TouchableOpacity onPress={() => goToExplore("all")}>
              <Text style={styles.seeAll}>View All →</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categories}
          >
            {CATEGORY_IDS.map((id) => {
              const label = CATEGORY_LABELS?.[id] || id;
              const isActive = selectedCategory === id;

              return (
                <TouchableOpacity
                  key={id}
                  onPress={() => goToExplore(id)}
                  style={[styles.catChip, isActive && styles.catChipActive]}
                  activeOpacity={0.8}
                >
                  <Text style={styles.catEmoji}>{CAT_EMOJIS[id]}</Text>
                  <Text style={[styles.catLabel, isActive && styles.catLabelActive]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Featured Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitleNoPad}>Featured Products</Text>
            <TouchableOpacity onPress={() => goToExplore("all")}>
              <Text style={styles.seeAll}>View All →</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={featuredProducts}
            renderItem={({ item }) => (
              <ProductCard
                product={item}
                onPress={goToProduct}
                onWishlist={toggleWishlist}
                isWishlisted={isWishlisted(item.id)}
              />
            )}
            keyExtractor={(i) => i.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
          />
        </View>

        {/* Artisan Banner */}
        <LinearGradient
          colors={[COLORS.green + "20", COLORS.greenLight + "10"]}
          style={styles.artisanBanner}
        >
          <Text style={styles.artisanBannerTitle}>🌱 Meet Our Artisans</Text>
          <Text style={styles.artisanBannerSub}>
            Every purchase directly empowers an SHG woman or tribal artisan
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12, paddingTop: 12 }}
          >
            {(artisans || []).slice(0, 4).map((a) => (
              <ArtisanChip key={a.id} artisan={a} onPress={goToArtisan} />
            ))}
          </ScrollView>
        </LinearGradient>

        {/* WhatsApp Banner */}
        <TouchableOpacity
          style={styles.whatsappBanner}
          activeOpacity={0.85}
          onPress={() => {
            const msg =
              "Hi! I want to order from Nari Samman artisan products. Please share the catalogue!";
            const url = `whatsapp://send?phone=919876500000&text=${encodeURIComponent(msg)}`;

            Linking.canOpenURL(url)
              .then((ok) =>
                ok ? Linking.openURL(url) : Alert.alert("WhatsApp not available")
              )
              .catch(() => Alert.alert("Error", "Could not open WhatsApp."));
          }}
        >
          <View style={styles.whatsappLeft}>
            <Text style={styles.whatsappBannerIcon}>💬</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.whatsappBannerTitle}>Order via WhatsApp</Text>
              <Text style={styles.whatsappBannerSub}>
                Chat with your local agent · COD available
              </Text>
            </View>
          </View>

          <Text style={styles.whatsappArrow}>→</Text>
        </TouchableOpacity>

        {/* Trending Now (Textiles) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitleNoPad}>Trending Now</Text>
            <TouchableOpacity onPress={() => goToExplore("textiles")}>
              <Text style={styles.seeAll}>View All →</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={newArrivals}
            renderItem={({ item }) => (
              <ProductCard
                product={item}
                onPress={goToProduct}
                onWishlist={toggleWishlist}
                isWishlisted={isWishlisted(item.id)}
              />
            )}
            keyExtractor={(i) => i.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
          />
        </View>

        {/* Impact Section */}
        <LinearGradient colors={["#0F1822", "#1C2437"]} style={styles.impactSection}>
          <Text style={styles.impactTitle}>Our Impact 📊</Text>

          <View style={styles.impactGrid}>
            {[
              { label: "SHG Women", value: "6,000+", emoji: "👩" },
              { label: "Products", value: "342+", emoji: "📦" },
              { label: "Districts", value: "12", emoji: "📍" },
              { label: "Happy Buyers", value: "18.5K", emoji: "😊" },
            ].map((s, i) => (
              <View key={i} style={styles.statCard}>
                <Text style={styles.statEmoji}>{s.emoji}</Text>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        <View style={{ height: 30 }} />
      </Animated.ScrollView>

      {/* AIAssistantFAB is rendered in ConsumerTabs — no instance needed here */}

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, minHeight: 0, backgroundColor: COLORS.dark },

  floatingHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },

  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },

  greeting: { fontSize: 12, color: "rgba(200,208,228,0.6)" },

  brandRow: { flexDirection: "row", alignItems: "center", gap: 8 },

  headerBrand: { fontSize: 20, fontWeight: "800", color: COLORS.gold },

  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(200,208,228,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },

  iconText: { fontSize: 18 },

  notifBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.bengalRed,
    alignItems: "center",
    justifyContent: "center",
  },

  notifBadgeText: { fontSize: 8, color: "#fff", fontWeight: "700" },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(157,205,67,0.15)",
  },

  searchIcon: { fontSize: 16 },

  searchPlaceholder: { color: "rgba(200,208,228,0.5)", fontSize: 14 },

  scroll: { flex: 1, minHeight: 0 },

  scrollContent: { flexGrow: 1 },

  hero: { paddingBottom: 24 },

  bannerCard: {
    width,
    height: 190,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 24,
    paddingRight: 18,
    paddingVertical: 22,
    overflow: "hidden",
  },

  bannerContent: {
    flex: 1,
    zIndex: 2,
    paddingRight: 10,
  },

  bannerTitle: {
    fontSize: 21,
    fontWeight: "900",
    color: "#fff",
    lineHeight: 29,
  },

  bannerSubtitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.82)",
    marginTop: 6,
  },

  bannerBtn: {
    marginTop: 14,
    backgroundColor: COLORS.saffron,
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 9,
    alignSelf: "flex-start",
    ...SHADOWS.small,
  },

  bannerBtnText: {
    color: "#07111F",
    fontWeight: "900",
    fontSize: 13,
  },

  bannerImageWrap: {
    width: 124,
    height: 124,
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },

  bannerImage: {
    width: "100%",
    height: "100%",
  },

  bannerImageOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },

  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    paddingTop: 12,
    paddingBottom: 4,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.3)",
  },

  dotActive: {
    width: 20,
    backgroundColor: COLORS.gold,
    borderRadius: 3,
  },

  section: { paddingTop: 24 },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 14,
  },

  sectionTitleNoPad: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },

  seeAll: {
    fontSize: 13,
    color: COLORS.saffron,
    fontWeight: "800",
  },

  categories: { paddingHorizontal: 16, gap: 10 },

  catChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 50,
    backgroundColor: COLORS.darkCard,
    borderWidth: 1.5,
    borderColor: COLORS.darkBorder,
    ...SHADOWS.small,
  },

  catChipActive: {
    backgroundColor: COLORS.saffron,
    borderColor: COLORS.saffron,
  },

  catEmoji: { fontSize: 16 },

  catLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textSecondary,
    textTransform: "capitalize",
  },

  catLabelActive: { color: "#fff" },

  productCard: {
    width: 170,
    backgroundColor: COLORS.darkCard,
    borderRadius: 18,
    overflow: "hidden",
    ...SHADOWS.medium,
  },

  productImageBox: {
    height: 140,
    backgroundColor: COLORS.darkCard,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },

  productImg: { width: "100%", height: 140 },

  productEmoji: { fontSize: 60 },

  badge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: COLORS.bengalRed,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },

  badgeText: { color: "#fff", fontSize: 9, fontWeight: "700" },

  wishlistBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(0,0,0,0.28)",
    alignItems: "center",
    justifyContent: "center",
  },

  productInfo: { padding: 12 },

  productName: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textPrimary,
    lineHeight: 18,
  },

  productUnit: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    flexWrap: "wrap",
  },

  price: { fontSize: 16, fontWeight: "800", color: COLORS.saffron },

  mrp: {
    fontSize: 12,
    color: COLORS.textMuted,
    textDecorationLine: "line-through",
  },

  discount: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.success,
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 6,
  },

  star: { fontSize: 11 },

  rating: { fontSize: 12, fontWeight: "700", color: COLORS.textPrimary },

  reviews: { fontSize: 11, color: COLORS.textMuted },

  artisanBanner: {
    margin: 16,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.greenLight + "30",
  },

  artisanBannerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.green,
  },

  artisanBannerSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },

  artisanChip: {
    width: 245,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: COLORS.darkCard,
    borderRadius: 50,
    paddingVertical: 8,
    paddingHorizontal: 14,
    ...SHADOWS.small,
  },

  artisanChipEmoji: { fontSize: 20 },

  artisanChipName: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },

  artisanChipShg: { fontSize: 10, color: COLORS.textMuted },

  artisanChipBadge: {
    backgroundColor: COLORS.green + "20",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },

  artisanChipBadgeText: {
    fontSize: 10,
    color: COLORS.green,
    fontWeight: "700",
  },

  whatsappBanner: {
    marginHorizontal: 16,
    marginBottom: 4,
    backgroundColor: "#25D36618",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1.5,
    borderColor: "#25D36640",
  },

  whatsappLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },

  whatsappBannerIcon: { fontSize: 30 },

  whatsappBannerTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#25D366",
  },

  whatsappBannerSub: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },

  whatsappArrow: {
    fontSize: 20,
    color: "#25D366",
    fontWeight: "700",
  },

  impactSection: {
    margin: 16,
    borderRadius: 20,
    padding: 20,
  },

  impactTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.gold,
    marginBottom: 16,
  },

  impactGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  statCard: {
    width: "47%",
    backgroundColor: "rgba(200,208,228,0.10)",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    minHeight: 110,
    justifyContent: "center",
  },

  statEmoji: { fontSize: 26, marginBottom: 8 },

  statValue: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.gold,
  },

  statLabel: {
    fontSize: 11,
    color: "rgba(200,208,228,0.6)",
    marginTop: 3,
    textAlign: "center",
  },
});