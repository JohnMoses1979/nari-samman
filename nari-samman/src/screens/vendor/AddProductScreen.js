// import React, { useState } from 'react';
// import {
//   View,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Image,
//   Platform,
//   Alert,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import * as ImagePicker from 'expo-image-picker';

// import { COLORS, SHADOWS } from '../../theme/colors';
// import useStore, { IMAGES } from '../../store/useStore';
// import { imgSrc } from '../../utils/imageSource';
// import Text from '../../autoTranslation/AutoText';
// import TextInput from '../../autoTranslation/AutoTextInput';

// // ─── Native Image Picker helper ───────────────────────────────────────────────
// async function pickImageNative(source) {
//   try {
//     if (source === 'camera') {
//       const { status } = await ImagePicker.requestCameraPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Permission Needed', 'Camera access is required to take photos.');
//         return null;
//       }
//       const result = await ImagePicker.launchCameraAsync({
//         mediaTypes: ['images'],
//         allowsEditing: true,
//         aspect: [1, 1],
//         quality: 0.8,
//       });
//       if (!result.canceled && result.assets?.[0]) return result.assets[0].uri;
//     } else {
//       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Permission Needed', 'Photo library access is required.');
//         return null;
//       }
//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ['images'],
//         allowsEditing: true,
//         aspect: [1, 1],
//         quality: 0.8,
//       });
//       if (!result.canceled && result.assets?.[0]) return result.assets[0].uri;
//     }
//   } catch {
//     Alert.alert('Install Required', 'Run: npx expo install expo-image-picker\nto enable photo picking on device.');
//   }
//   return null;
// }

// // ─── Category preset assets ───────────────────────────────────────────────────
// const CATEGORY_ASSETS = {
//   food: [
//     { key: 'sundarbanshoney', label: 'Honey' },
//     { key: 'organicspices', label: 'Spices' },
//     { key: 'papad', label: 'Papad' },
//     { key: 'jaggery', label: 'Jaggery' },
//     { key: 'masalas', label: 'Masalas' },
//     { key: 'bengalifood', label: 'Bengali Food' },
//     { key: 'herbal', label: 'Herbal' },
//     { key: 'dryFish', label: 'Dry Fish' },
//   ],
//   textiles: [
//     { key: 'tantSaree', label: 'Tant Saree' },
//     { key: 'baluchari', label: 'Baluchari' },
//     { key: 'jamdani', label: 'Jamdani' },
//     { key: 'bengalSilk', label: 'Bengal Silk' },
//     { key: 'dupattas', label: 'Dupatta' },
//     { key: 'tribalTextiles', label: 'Tribal' },
//     { key: 'handmadeGarments', label: 'Garments' },
//     { key: 'bengaliApparel', label: 'Apparel' },
//   ],
//   crafts: [
//     { key: 'bambooCrafts', label: 'Bamboo' },
//     { key: 'clayArtifacts', label: 'Clay' },
//     { key: 'juteProducts', label: 'Jute' },
//     { key: 'handcraftedDecor', label: 'Decor' },
//     { key: 'ecoUtility', label: 'Eco Utility' },
//   ],
// };

// const CATEGORIES = [
//   { id: 'food', label: 'Food & Allied', emoji: '🍯' },
//   { id: 'textiles', label: 'Handloom & Textile', emoji: '🧵' },
//   { id: 'crafts', label: 'Tribal & Craft', emoji: '🏺' },
// ];

// const UNIT_OPTIONS = ['piece', '250g', '500g', '1kg', '2kg', '500ml', '1L', 'pair', 'set'];

// function getInitialForm(product) {
//   return {
//     name: product?.name || '',
//     category: product?.category || 'food',
//     price: product?.price ? String(product.price) : '',
//     mrp: product?.mrp ? String(product.mrp) : '',
//     unit: product?.unit || '500g',
//     description: product?.description || '',
//     stock: product?.stock !== undefined && product?.stock !== null ? String(product.stock) : '',
//     tags: Array.isArray(product?.tags) ? product.tags.join(', ') : product?.tags || '',
//   };
// }

// export default function AddProductScreen({ navigation, route }) {
//   const editProduct = route?.params?.product || null;
//   const isEditMode = Boolean(editProduct?.id);
//   const { addProductToPending, updateVendorProduct } = useStore();

//   const [form, setForm] = useState(() => getInitialForm(editProduct));
//   const [certifications, setCertifications] = useState({
//     fssai: false,
//     gi: false,
//     handloom: false,
//     nabard: false,
//   });

//   const [imageUri, setImageUri] = useState(() => (typeof editProduct?.image === 'string' ? editProduct.image : null));
//   const [existingImage, setExistingImage] = useState(() => (editProduct?.image && typeof editProduct.image !== 'string' ? editProduct.image : null));
//   const [assetKey, setAssetKey] = useState(null);
//   const [showWebPicker, setShowWebPicker] = useState(false);
//   const [showAssetPicker, setShowAssetPicker] = useState(false);
//   const [submitted, setSubmitted] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [errorMsg, setErrorMsg] = useState('');

//   const update = (key, val) => {
//     setForm((prev) => ({ ...prev, [key]: val }));
//     if (key === 'category') setAssetKey(null);
//   };

//   const setPickedImage = (uri) => {
//     setImageUri(uri);
//     setAssetKey(null);
//     setExistingImage(null);
//   };

//   const choosePresetImage = (key) => {
//     setAssetKey(key);
//     setImageUri(null);
//     setExistingImage(null);
//     setShowAssetPicker(false);
//   };

//   const removePhoto = () => {
//     setImageUri(null);
//     setAssetKey(null);
//     setExistingImage(null);
//   };

//   // Resolved image: URI string or IMAGES require object
//   const resolvedImage = imageUri || (assetKey ? IMAGES[assetKey] : existingImage);
//   const previewSource = resolvedImage ? imgSrc(resolvedImage) : null;
//   const catEmoji = CATEGORIES.find((c) => c.id === form.category)?.emoji || '🍯';

//   const handleWebFileChange = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = (ev) => {
//       setPickedImage(ev.target.result);
//       setShowWebPicker(false);
//     };
//     reader.readAsDataURL(file);
//   };

//   const openCameraOrGallery = () => {
//     if (Platform.OS === 'web') {
//       setShowWebPicker(true);
//     } else {
//       Alert.alert('Add Product Photo', 'Choose how to add a photo', [
//         {
//           text: '📷 Take Photo',
//           onPress: async () => {
//             const u = await pickImageNative('camera');
//             if (u) setPickedImage(u);
//           },
//         },
//         {
//           text: '🖼️ Choose from Gallery',
//           onPress: async () => {
//             const u = await pickImageNative('gallery');
//             if (u) setPickedImage(u);
//           },
//         },
//         { text: 'Cancel', style: 'cancel' },
//       ]);
//     }
//   };

//   const handleSubmit = () => {
//     if (!form.name || !form.price || !form.description) {
//       setErrorMsg('Please fill in product name, price, and description.');
//       return;
//     }

//     setSubmitted(true);
//     const finalImage = resolvedImage ?? (
//       CATEGORY_ASSETS[form.category]?.[0] ? IMAGES[CATEGORY_ASSETS[form.category][0].key] : null
//     );

//     const productData = {
//       ...form,
//       image: finalImage,
//       certifications,
//     };

//     if (isEditMode) {
//       updateVendorProduct(editProduct.id, productData);
//       setShowSuccess(true);
//       return;
//     }

//     addProductToPending(productData);
//     setTimeout(() => setShowSuccess(true), 800);
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Text style={styles.back}>{'← Back'}</Text>
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>{isEditMode ? 'Edit Product' : 'Add New Product'}</Text>
//         <View style={{ width: 60 }} />
//       </View>

//       <ScrollView style={styles.scrollView} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
//         {errorMsg ? (
//           <View style={styles.errorBanner}>
//             <Text style={styles.errorText}>⚠️ {errorMsg}</Text>
//             <TouchableOpacity onPress={() => setErrorMsg('')}>
//               <Text style={styles.errorClose}>✕</Text>
//             </TouchableOpacity>
//           </View>
//         ) : null}

//         {isEditMode ? (
//           <LinearGradient colors={[COLORS.green + '15', COLORS.greenLight + '08']} style={styles.processNote}>
//             <Text style={styles.processTitle}>✏️ Editing Live Product</Text>
//             <Text style={styles.processText}>
//               Product details are loaded below. Change any field and tap Save Changes.
//             </Text>
//           </LinearGradient>
//         ) : null}

//         {/* ── Photo Section ─────────────────────────────────────────────── */}
//         <View style={styles.photoSection}>
//           <Text style={styles.sectionLabel}>{'Product Photo'}</Text>

//           <TouchableOpacity onPress={openCameraOrGallery} style={styles.photoBox} activeOpacity={0.85}>
//             {previewSource ? (
//               <>
//                 <Image source={previewSource} style={styles.photoPreview} resizeMode="cover" />
//                 <View style={styles.photoOverlay}>
//                   <Text style={styles.photoOverlayText}>{'✏️ Change Photo'}</Text>
//                 </View>
//               </>
//             ) : (
//               <LinearGradient colors={[COLORS.cream, COLORS.creamDark]} style={styles.photoPlaceholder}>
//                 <Text style={styles.photoPlaceholderEmoji}>{catEmoji}</Text>
//                 <View style={styles.photoCTA}>
//                   <Text style={styles.photoCTAIcon}>📷</Text>
//                   <Text style={styles.photoCTAText}>{'Tap to Add Photo'}</Text>
//                 </View>
//               </LinearGradient>
//             )}
//           </TouchableOpacity>

//           <View style={styles.photoButtons}>
//             <TouchableOpacity
//               onPress={() => {
//                 pickImageNative('camera').then((u) => {
//                   if (u) setPickedImage(u);
//                 });
//               }}
//               style={styles.photoBtn}>
//               <Text style={styles.photoBtnText}>{'📷 Camera'}</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               onPress={() => {
//                 if (Platform.OS === 'web') {
//                   setShowWebPicker(true);
//                 } else {
//                   pickImageNative('gallery').then((u) => {
//                     if (u) setPickedImage(u);
//                   });
//                 }
//               }}
//               style={[styles.photoBtn, styles.photoBtnGallery]}>
//               <Text style={styles.photoBtnText}>{'🖼️ Gallery'}</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => setShowAssetPicker(true)} style={[styles.photoBtn, styles.photoBtnAsset]}>
//               <Text style={styles.photoBtnText}>{'🎨 Presets'}</Text>
//             </TouchableOpacity>
//             {resolvedImage ? (
//               <TouchableOpacity onPress={removePhoto} style={[styles.photoBtn, styles.photoBtnRemove]}>
//                 <Text style={[styles.photoBtnText, { color: COLORS.error }]}>🗑️</Text>
//               </TouchableOpacity>
//             ) : null}
//           </View>

//           {!previewSource ? (
//             <Text style={styles.photoHint}>{'Clear product photo increases sales by 3× on Nari Samman'}</Text>
//           ) : null}
//         </View>

//         {/* ── Category ──────────────────────────────────────────────────── */}
//         <View style={styles.fieldGroup}>
//           <Text style={styles.fieldLabel}>{'Category *'}</Text>
//           <View style={styles.catRow}>
//             {CATEGORIES.map((cat) => (
//               <TouchableOpacity
//                 key={cat.id}
//                 onPress={() => update('category', cat.id)}
//                 style={[styles.catChip, form.category === cat.id && styles.catChipActive]}>
//                 <Text style={styles.catChipEmoji}>{cat.emoji}</Text>
//                 <Text style={[styles.catChipLabel, form.category === cat.id && styles.catChipLabelActive]}>{cat.label}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>

//         {/* ── Name ──────────────────────────────────────────────────────── */}
//         <View style={styles.fieldGroup}>
//           <Text style={styles.fieldLabel}>{'Product Name *'}</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="e.g. Pure Sundarbans Honey"
//             placeholderTextColor={COLORS.textMuted}
//             value={form.name}
//             onChangeText={(v) => update('name', v)}
//           />
//         </View>

//         {/* ── Price row ─────────────────────────────────────────────────── */}
//         <View style={styles.fieldRow}>
//           <View style={[styles.fieldGroup, { flex: 1 }]}>
//             <Text style={styles.fieldLabel}>{'Selling Price (₹) *'}</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="480"
//               placeholderTextColor={COLORS.textMuted}
//               keyboardType="numeric"
//               value={form.price}
//               onChangeText={(v) => update('price', v)}
//             />
//           </View>
//           <View style={[styles.fieldGroup, { flex: 1 }]}>
//             <Text style={styles.fieldLabel}>{'MRP (₹)'}</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="650"
//               placeholderTextColor={COLORS.textMuted}
//               keyboardType="numeric"
//               value={form.mrp}
//               onChangeText={(v) => update('mrp', v)}
//             />
//           </View>
//         </View>

//         {/* ── Unit & Stock ──────────────────────────────────────────────── */}
//         <View style={styles.fieldRow}>
//           <View style={[styles.fieldGroup, { flex: 1 }]}>
//             <Text style={styles.fieldLabel}>{'Unit'}</Text>
//             <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
//               {UNIT_OPTIONS.map((u) => (
//                 <TouchableOpacity key={u} onPress={() => update('unit', u)} style={[styles.unitChip, form.unit === u && styles.unitChipActive]}>
//                   <Text style={[styles.unitChipText, form.unit === u && styles.unitChipTextActive]}>{u}</Text>
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//           </View>
//           <View style={[styles.fieldGroup, { width: 90 }]}>
//             <Text style={styles.fieldLabel}>{'Stock'}</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="50"
//               placeholderTextColor={COLORS.textMuted}
//               keyboardType="numeric"
//               value={form.stock}
//               onChangeText={(v) => update('stock', v)}
//             />
//           </View>
//         </View>

//         {/* ── Description ───────────────────────────────────────────────── */}
//         <View style={styles.fieldGroup}>
//           <Text style={styles.fieldLabel}>{'Product Description *'}</Text>
//           <TextInput
//             style={[styles.input, styles.textArea]}
//             placeholder={"Describe your product — how it's made, its unique qualities..."}
//             placeholderTextColor={COLORS.textMuted}
//             multiline
//             numberOfLines={5}
//             value={form.description}
//             onChangeText={(v) => update('description', v)}
//           />
//         </View>

//         {/* ── Tags ──────────────────────────────────────────────────────── */}
//         <View style={styles.fieldGroup}>
//           <Text style={styles.fieldLabel}>{'Tags (comma separated)'}</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="organic, handmade, wild, traditional"
//             placeholderTextColor={COLORS.textMuted}
//             value={form.tags}
//             onChangeText={(v) => update('tags', v)}
//           />
//         </View>

//         {/* ── Certifications ────────────────────────────────────────────── */}
//         <View style={styles.fieldGroup}>
//           <Text style={styles.fieldLabel}>{'Certifications & Compliance'}</Text>
//           <View style={styles.certRow}>
//             {[
//               { key: 'fssai', label: 'FSSAI Licensed', emoji: '🍽️', note: 'Required for food products' },
//               { key: 'gi', label: 'GI Tag Certified', emoji: '🏷️', note: 'Geographical Indication' },
//               { key: 'handloom', label: 'Handloom Mark', emoji: '🧵', note: 'For textile products' },
//               { key: 'nabard', label: 'NABARD SHG Verified', emoji: '🏦', note: 'SHG scheme registration' },
//             ].map((cert) => (
//               <TouchableOpacity
//                 key={cert.key}
//                 onPress={() => setCertifications((prev) => ({ ...prev, [cert.key]: !prev[cert.key] }))}
//                 style={[styles.certChip, certifications[cert.key] && styles.certChipActive]}>
//                 <Text style={styles.certEmoji}>{cert.emoji}</Text>
//                 <View>
//                   <Text style={[styles.certLabel, certifications[cert.key] && styles.certLabelActive]}>{cert.label}</Text>
//                   <Text style={styles.certNote}>{cert.note}</Text>
//                 </View>
//                 {certifications[cert.key] ? <Text style={styles.certCheck}>✓</Text> : null}
//               </TouchableOpacity>
//             ))}
//           </View>
//           <Text style={styles.certHint}>{'Certified products get priority placement and GI badge on listing'}</Text>
//         </View>

//         <LinearGradient colors={[COLORS.green + '15', COLORS.greenLight + '08']} style={styles.processNote}>
//           <Text style={styles.processTitle}>{isEditMode ? '💾 Save Changes' : '📋 Approval Process'}</Text>
//           <Text style={styles.processText}>
//             {isEditMode
//               ? 'Your product details will be updated immediately in My Products and product listings.'
//               : `1. Submit your product here\n2. Nari Samman team reviews for quality & compliance\n3. Your product goes live in 24–48 hours\n4. Orders flow through Sandeshkhali warehouse — no Logistics for you!`}
//           </Text>
//         </LinearGradient>

//         <TouchableOpacity onPress={handleSubmit} style={styles.submitBtn} disabled={submitted}>
//           <LinearGradient colors={[COLORS.green, COLORS.greenLight]} style={styles.submitGrad}>
//             <Text style={styles.submitText}>
//               {submitted ? (isEditMode ? 'Saving...' : 'Submitting...') : isEditMode ? '✓ Save Changes' : '✓ Submit for Approval'}
//             </Text>
//           </LinearGradient>
//         </TouchableOpacity>

//         <View style={{ height: 30 }} />
//       </ScrollView>

//       {/* ── Preset Asset Picker Modal ──────────────────────────────────── */}
//       {showAssetPicker ? (
//         <View style={styles.overlay}>
//           <View style={[styles.modalBox, { maxHeight: 510 }]}>
//             <Text style={styles.modalTitle}>{'Choose a Preset Image'}</Text>
//             <Text style={styles.modalSub}>{'Select a Nari Samman photo that matches your product'}</Text>
//             <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.assetGrid}>
//               {(CATEGORY_ASSETS[form.category] || []).map(({ key, label }) => (
//                 <TouchableOpacity
//                   key={key}
//                   onPress={() => choosePresetImage(key)}
//                   style={[styles.assetThumb, assetKey === key && styles.assetThumbSelected]}>
//                   <Image source={IMAGES[key]} style={styles.assetThumbImg} resizeMode="cover" />
//                   <Text style={styles.assetThumbLabel}>{label}</Text>
//                   {assetKey === key ? (
//                     <View style={styles.assetCheck}>
//                       <Text style={{ color: '#fff', fontSize: 11, fontWeight: '800' }}>✓</Text>
//                     </View>
//                   ) : null}
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//             <TouchableOpacity onPress={() => setShowAssetPicker(false)} style={styles.cancelBtn}>
//               <Text style={styles.cancelBtnText}>{'Cancel'}</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       ) : null}

//       {/* ── Web File Picker Modal ──────────────────────────────────────── */}
//       {showWebPicker && Platform.OS === 'web' ? (
//         <View style={styles.overlay}>
//           <View style={styles.modalBox}>
//             <Text style={styles.modalTitle}>Add Product Photo</Text>
//             <Text style={styles.modalSub}>Choose how to add your product image</Text>
//             <label htmlFor="cam-input" style={{ width: '100%', cursor: 'pointer' }}>
//               <View style={styles.pickerRow}>
//                 <Text style={styles.pickerRowIcon}>📷</Text>
//                 <View style={{ flex: 1 }}>
//                   <Text style={styles.pickerRowTitle}>Take Photo</Text>
//                   <Text style={styles.pickerRowSub}>Use camera to click a fresh product photo</Text>
//                 </View>
//                 <Text style={styles.pickerArrow}>→</Text>
//               </View>
//               <input id="cam-input" type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={handleWebFileChange} />
//             </label>
//             <label htmlFor="gal-input" style={{ width: '100%', cursor: 'pointer', marginTop: 10 }}>
//               <View style={styles.pickerRow}>
//                 <Text style={styles.pickerRowIcon}>🖼️</Text>
//                 <View style={{ flex: 1 }}>
//                   <Text style={styles.pickerRowTitle}>Choose from Gallery</Text>
//                   <Text style={styles.pickerRowSub}>Select an existing photo from your device</Text>
//                 </View>
//                 <Text style={styles.pickerArrow}>→</Text>
//               </View>
//               <input id="gal-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleWebFileChange} />
//             </label>
//             <TouchableOpacity onPress={() => setShowWebPicker(false)} style={styles.cancelBtn}>
//               <Text style={styles.cancelBtnText}>{'Cancel'}</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       ) : null}

//       {/* ── Success Overlay ───────────────────────────────────────────── */}
//       {showSuccess ? (
//         <View style={styles.overlay}>
//           <View style={styles.successBox}>
//             <Text style={styles.successEmoji}>🎉</Text>
//             <Text style={styles.successTitle}>{isEditMode ? 'Product Updated!' : 'Product Submitted!'}</Text>
//             {resolvedImage ? <Image source={imgSrc(resolvedImage)} style={styles.successImage} resizeMode="cover" /> : null}
//             <Text style={styles.successMsg}>
//               <Text style={{ fontWeight: '700' }}>{form.name}</Text>
//               {isEditMode
//                 ? ' has been updated successfully.'
//                 : ' is under review by the Nari Samman team.\nIt will go live once approved (24–48 hrs).'}
//             </Text>
//             <TouchableOpacity onPress={() => navigation.goBack()} style={styles.successBtn}>
//               <Text style={styles.successBtnText}>{isEditMode ? 'Back to My Products' : 'Back to Dashboard'}</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       ) : null}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: COLORS.dark },
//   scrollView: { flex: 1 },
//   header: {
//     flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
//     paddingTop: 52, paddingHorizontal: 16, paddingBottom: 12,
//     backgroundColor: COLORS.darkCard, ...SHADOWS.small
//   },
//   back: { fontSize: 15, color: COLORS.green, fontWeight: '600' },
//   headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
//   scroll: { padding: 16, flexGrow: 1 },

//   errorBanner: {
//     flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
//     backgroundColor: COLORS.error + '15', borderRadius: 12, padding: 12, marginBottom: 12,
//     borderWidth: 1, borderColor: COLORS.error + '40'
//   },
//   errorText: { flex: 1, fontSize: 13, color: COLORS.error, fontWeight: '500' },
//   errorClose: { fontSize: 16, color: COLORS.error, fontWeight: '700', paddingLeft: 8 },

//   // Photo
//   photoSection: { backgroundColor: COLORS.darkCard, borderRadius: 20, padding: 16, marginBottom: 16, ...SHADOWS.small },
//   sectionLabel: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 12 },
//   photoBox: {
//     width: '100%', height: 190, borderRadius: 16, overflow: 'hidden',
//     borderWidth: 2, borderColor: COLORS.darkBorder, borderStyle: 'dashed', marginBottom: 12
//   },
//   photoPreview: { width: '100%', height: '100%' },
//   photoOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.45)', paddingVertical: 8, alignItems: 'center' },
//   photoOverlayText: { color: '#fff', fontSize: 13, fontWeight: '600' },
//   photoPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
//   photoPlaceholderEmoji: { fontSize: 52 },
//   photoCTA: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
//   photoCTAIcon: { fontSize: 16 },
//   photoCTAText: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary },
//   photoButtons: { flexDirection: 'row', gap: 6, marginBottom: 8, flexWrap: 'wrap' },
//   photoBtn: { flex: 1, minWidth: 72, backgroundColor: COLORS.dark, borderRadius: 50, paddingVertical: 9, alignItems: 'center', borderWidth: 1.5, borderColor: COLORS.darkBorder },
//   photoBtnGallery: { backgroundColor: COLORS.green + '12', borderColor: COLORS.green + '40' },
//   photoBtnAsset: { backgroundColor: COLORS.saffron + '12', borderColor: COLORS.saffron + '50' },
//   photoBtnRemove: { flex: 0, paddingHorizontal: 14, borderColor: COLORS.error + '40' },
//   photoBtnText: { fontSize: 11, fontWeight: '700', color: COLORS.textSecondary },
//   photoHint: { fontSize: 11, color: COLORS.green, textAlign: 'center', fontStyle: 'italic' },

//   // Form fields
//   fieldGroup: { marginBottom: 16 },
//   fieldLabel: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 8 },
//   input: { backgroundColor: COLORS.darkCard, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: COLORS.textPrimary, borderWidth: 1.5, borderColor: COLORS.darkBorder },
//   textArea: { height: 120, textAlignVertical: 'top' },
//   fieldRow: { flexDirection: 'row', gap: 12, marginBottom: 0 },
//   catRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
//   catChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 50, backgroundColor: COLORS.darkCard, borderWidth: 1.5, borderColor: COLORS.darkBorder },
//   catChipActive: { backgroundColor: COLORS.green, borderColor: COLORS.green },
//   catChipEmoji: { fontSize: 14 },
//   catChipLabel: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
//   catChipLabelActive: { color: '#fff' },
//   unitChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: COLORS.darkCard, borderWidth: 1.5, borderColor: COLORS.darkBorder },
//   unitChipActive: { backgroundColor: COLORS.green, borderColor: COLORS.green },
//   unitChipText: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '600' },
//   unitChipTextActive: { color: '#fff' },
//   processNote: { borderRadius: 16, padding: 16, marginBottom: 16 },
//   processTitle: { fontSize: 14, fontWeight: '700', color: COLORS.green, marginBottom: 8 },
//   processText: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 22 },
//   submitBtn: { borderRadius: 50, overflow: 'hidden' },
//   submitGrad: { paddingVertical: 16, alignItems: 'center' },
//   submitText: { color: '#fff', fontWeight: '700', fontSize: 16 },

//   // Overlay / modals
//   overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center', zIndex: 999 },
//   modalBox: { backgroundColor: COLORS.darkCard, borderRadius: 24, padding: 22, width: 330, alignItems: 'center', ...SHADOWS.large },
//   modalTitle: { fontSize: 19, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 4 },
//   modalSub: { fontSize: 12, color: COLORS.textMuted, marginBottom: 14, textAlign: 'center' },

//   assetGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center', paddingVertical: 6 },
//   assetThumb: { width: 82, alignItems: 'center', borderRadius: 14, borderWidth: 2, borderColor: 'transparent', padding: 2 },
//   assetThumbSelected: { borderColor: COLORS.saffron, backgroundColor: COLORS.saffron + '10' },
//   assetThumbImg: { width: 74, height: 74, borderRadius: 10 },
//   assetThumbLabel: { fontSize: 10, fontWeight: '600', color: COLORS.textSecondary, marginTop: 4, textAlign: 'center' },
//   assetCheck: { position: 'absolute', top: 6, right: 6, width: 18, height: 18, borderRadius: 9, backgroundColor: COLORS.saffron, alignItems: 'center', justifyContent: 'center' },

//   pickerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, width: '100%', backgroundColor: COLORS.dark, borderRadius: 16, padding: 14 },
//   pickerRowIcon: { fontSize: 26 },
//   pickerRowTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
//   pickerRowSub: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
//   pickerArrow: { fontSize: 18, color: COLORS.textMuted },

//   cancelBtn: { marginTop: 14, width: '100%', paddingVertical: 12, borderRadius: 50, borderWidth: 1.5, borderColor: COLORS.darkBorder, alignItems: 'center' },
//   cancelBtnText: { fontSize: 14, color: COLORS.textSecondary, fontWeight: '600' },
//   // Certification section
//   certRow: { gap: 8, marginBottom: 8 },
//   certChip: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.darkCard, borderRadius: 12, padding: 12, borderWidth: 1.5, borderColor: COLORS.darkBorder },
//   certChipActive: { borderColor: COLORS.success, backgroundColor: COLORS.success + '12' },
//   certEmoji: { fontSize: 20 },
//   certLabel: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
//   certLabelActive: { color: COLORS.success },
//   certNote: { fontSize: 10, color: COLORS.textMuted, marginTop: 1 },
//   certCheck: { fontSize: 16, color: COLORS.success, fontWeight: '800', marginLeft: 'auto' },
//   certHint: { fontSize: 11, color: COLORS.success, fontStyle: 'italic' },
//   successBox: { backgroundColor: COLORS.darkCard, borderRadius: 24, padding: 28, alignItems: 'center', width: 320, ...SHADOWS.large },
//   successEmoji: { fontSize: 52, marginBottom: 10 },
//   successTitle: { fontSize: 22, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 10 },
//   successImage: { width: 110, height: 110, borderRadius: 18, marginBottom: 12 },
//   successMsg: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
//   successBtn: { backgroundColor: COLORS.green, borderRadius: 50, paddingHorizontal: 28, paddingVertical: 14 },
//   successBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 }
// });






















import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';

import { COLORS, SHADOWS } from '../../theme/colors';
import useStore from '../../store/useStore';
import Text from '../../autoTranslation/AutoText';
import TextInput from '../../autoTranslation/AutoTextInput';
import AppAlert, { useAppAlert } from '../../components/AppAlert';

// ─── Native Image Picker helper ───────────────────────────────────────────────
async function pickImageNative(source) {
  try {
    if (source === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Needed', 'Camera access is required.');
        return null;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets?.[0]) return result.assets[0];
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Needed', 'Photo library access is required.');
        return null;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        allowsMultipleSelection: true,
      });
      if (!result.canceled && result.assets?.length > 0) return result.assets;
    }
  } catch {
    Alert.alert('Error', 'Could not open image picker. Ensure expo-image-picker is installed.');
  }
  return null;
}

const CATEGORIES = [
  { id: 'food', label: 'Food & Allied', emoji: '🍯' },
  { id: 'textiles', label: 'Handloom & Textile', emoji: '🧵' },
  { id: 'crafts', label: 'Tribal & Craft', emoji: '🏺' },
];

const UNIT_OPTIONS = ['piece', '250g', '500g', '1kg', '2kg', '500ml', '1L', 'pair', 'set'];

function getInitialForm(product) {
  return {
    name: product?.name || '',
    category: product?.category || 'food',
    price: product?.sellingPrice ? String(product.sellingPrice) : '',
    mrp: product?.mrp ? String(product.mrp) : '',
    unit: product?.unit || '500g',
    description: product?.description || '',
    stock: product?.stock !== undefined ? String(product.stock) : '',
    tags: Array.isArray(product?.tags) ? product.tags.join(', ') : product?.tags || '',
    certifications: Array.isArray(product?.certifications) ? product.certifications.join(',') : '',
  };
}

// Derive MIME type from file extension as a fallback
function getMimeFromUri(uri = '') {
  const lower = uri.toLowerCase();
  if (lower.endsWith('.png'))  return 'image/png';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.gif'))  return 'image/gif';
  return 'image/jpeg'; // default for .jpg / .jpeg / unknown
}

export default function AddProductScreen({ navigation, route }) {
  const editProduct = route?.params?.product || null;
  const isEditMode = Boolean(editProduct?.id);

  const { vendorProfile, addProductToPending, updateVendorProduct } = useStore();
  const { alertState, showAlert, hideAlert } = useAppAlert();

  const [form, setForm] = useState(() => getInitialForm(editProduct));
  const [certifications, setCertifications] = useState({
    fssai: editProduct?.certifications?.includes('fssai') || false,
    gi: editProduct?.certifications?.includes('gi') || false,
    handloom: editProduct?.certifications?.includes('handloom') || false,
    nabard: editProduct?.certifications?.includes('nabard') || false,
  });

  // Pending image files (new uploads) — each is { uri, name, type } or File
  const [pendingImages, setPendingImages] = useState([]);
  // Existing images from server (edit mode)
  const [existingImages, setExistingImages] = useState(
    editProduct?.imageUrls?.map((url, i) => ({
      url,
      id: editProduct.images?.[i]?.id || null,
      markedForDelete: false,
    })) || []
  );

  const [showWebPicker, setShowWebPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const update = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const catEmoji = CATEGORIES.find((c) => c.id === form.category)?.emoji || '🍯';

  // All visible preview images (existing not deleted + pending)
  const visibleExisting = existingImages.filter((img) => !img.markedForDelete);
  const allPreviews = [
    ...visibleExisting.map((img) => ({ source: { uri: img.url }, key: `ex_${img.id}` })),
    ...pendingImages.map((img, i) => ({
      source: { uri: img.uri || img.localUri },
      key: `new_${i}`,
    })),
  ];

  const addPendingImages = useCallback((assets) => {
    const arr = Array.isArray(assets) ? assets : [assets];
    const mapped = arr.map((a) => {
      // expo-image-picker: a.type = 'image' (category), a.mimeType = 'image/jpeg' (actual MIME)
      const mimeType = a.mimeType || getMimeFromUri(a.uri) || 'image/jpeg';
      const ext = mimeType.split('/')[1] || 'jpg';
      return {
        uri: a.uri,
        name: a.fileName || `product_${Date.now()}.${ext}`,
        type: mimeType,
        localUri: a.uri,
      };
    });
    setPendingImages((prev) => [...prev, ...mapped]);
  }, []);

  const removeExistingImage = (id) => {
    setExistingImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, markedForDelete: true } : img))
    );
  };

  const removePendingImage = (index) => {
    setPendingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleWebFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const mapped = files.map((f) => ({
      uri: URL.createObjectURL(f),
      name: f.name,
      type: f.type,
      localUri: URL.createObjectURL(f),
      webFile: f,
    }));
    setPendingImages((prev) => [...prev, ...mapped]);
    setShowWebPicker(false);
  };

  const openCamera = async () => {
    if (Platform.OS === 'web') {
      setShowWebPicker(true);
      return;
    }
    const asset = await pickImageNative('camera');
    if (asset) addPendingImages(asset);
  };

  const openGallery = async () => {
    if (Platform.OS === 'web') {
      setShowWebPicker(true);
      return;
    }
    const assets = await pickImageNative('gallery');
    if (assets) addPendingImages(assets);
  };

  const handleSubmit = async () => {
    // Validations
    if (!form.name.trim()) {
      showAlert('error', 'Required', 'Product name is required.');
      return;
    }
    if (!form.description.trim()) {
      showAlert('error', 'Required', 'Product description is required.');
      return;
    }
    if (!form.price || parseFloat(form.price) <= 0) {
      showAlert('error', 'Invalid Price', 'Selling price must be greater than 0.');
      return;
    }
    if (form.mrp && parseFloat(form.mrp) < parseFloat(form.price)) {
      showAlert('error', 'Invalid MRP', 'MRP must be ≥ selling price.');
      return;
    }
    if (!isEditMode && pendingImages.length === 0) {
      showAlert('error', 'Image Required', 'Please add at least one product photo.');
      return;
    }
    if (isEditMode && visibleExisting.length === 0 && pendingImages.length === 0) {
      showAlert('error', 'Image Required', 'Product must have at least one photo.');
      return;
    }

    const certKeys = Object.entries(certifications)
      .filter(([, v]) => v)
      .map(([k]) => k)
      .join(',');

    const payload = {
      name: form.name.trim(),
      category: form.category,
      sellingPrice: parseFloat(form.price),
      mrp: form.mrp ? parseFloat(form.mrp) : parseFloat(form.price),
      unit: form.unit,
      description: form.description.trim(),
      stock: form.stock ? parseInt(form.stock, 10) : 0,
      tags: form.tags,
      certifications: certKeys,
    };

    // Build actual image files for multipart
    const imageFiles = pendingImages.map((img) => {
      if (img.webFile) return img.webFile; // Web File object
      return { uri: img.uri, name: img.name, type: img.type }; // RN asset
    });

    const deleteIds = existingImages
      .filter((img) => img.markedForDelete && img.id)
      .map((img) => img.id);

    setLoading(true);
    try {
      if (isEditMode) {
        await updateVendorProduct(vendorProfile.id, editProduct.id, payload, imageFiles, deleteIds);
      } else {
        await addProductToPending(vendorProfile.id, payload, imageFiles);
      }
      setShowSuccess(true);
    } catch (err) {
      showAlert('error', 'Submission Failed', err.message || 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>{'← Back'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEditMode ? 'Edit Product' : 'Add New Product'}</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {isEditMode && (
          <LinearGradient colors={[COLORS.green + '15', COLORS.greenLight + '08']} style={styles.processNote}>
            <Text style={styles.processTitle}>✏️ Editing Product</Text>
            <Text style={styles.processText}>
              Changes will re-submit the product for admin approval.
            </Text>
          </LinearGradient>
        )}

        {/* ── Image Gallery ────────────────────────────────────────────────── */}
        <View style={styles.photoSection}>
          <Text style={styles.sectionLabel}>Product Photos</Text>

          {/* Preview grid */}
          {allPreviews.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {visibleExisting.map((img) => (
                  <View key={`ex_${img.id}`} style={styles.thumbWrap}>
                    <Image source={{ uri: img.url }} style={styles.thumb} resizeMode="cover" />
                    <TouchableOpacity style={styles.thumbRemove} onPress={() => removeExistingImage(img.id)}>
                      <Text style={{ color: '#fff', fontSize: 10, fontWeight: '800' }}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
                {pendingImages.map((img, i) => (
                  <View key={`new_${i}`} style={styles.thumbWrap}>
                    <Image source={{ uri: img.uri }} style={styles.thumb} resizeMode="cover" />
                    <TouchableOpacity style={styles.thumbRemove} onPress={() => removePendingImage(i)}>
                      <Text style={{ color: '#fff', fontSize: 10, fontWeight: '800' }}>✕</Text>
                    </TouchableOpacity>
                    <View style={styles.thumbNewBadge}><Text style={styles.thumbNewBadgeText}>NEW</Text></View>
                  </View>
                ))}
              </View>
            </ScrollView>
          ) : (
            <View style={styles.photoPlaceholder}>
              <Text style={styles.photoPlaceholderEmoji}>{catEmoji}</Text>
              <Text style={styles.photoCTAText}>Add product photos below</Text>
            </View>
          )}

          <View style={styles.photoButtons}>
            <TouchableOpacity onPress={openCamera} style={styles.photoBtn}>
              <Text style={styles.photoBtnText}>📷 Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={openGallery} style={[styles.photoBtn, styles.photoBtnGallery]}>
              <Text style={styles.photoBtnText}>🖼️ Gallery</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.photoHint}>
            Max 5 MB per image · JPG, PNG, WebP · At least 1 required
          </Text>
        </View>

        {/* ── Category ─────────────────────────────────────────────────────── */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Category *</Text>
          <View style={styles.catRow}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => update('category', cat.id)}
                style={[styles.catChip, form.category === cat.id && styles.catChipActive]}
              >
                <Text style={styles.catChipEmoji}>{cat.emoji}</Text>
                <Text style={[styles.catChipLabel, form.category === cat.id && styles.catChipLabelActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Name ─────────────────────────────────────────────────────────── */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Product Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Pure Sundarbans Honey"
            placeholderTextColor={COLORS.textMuted}
            value={form.name}
            onChangeText={(v) => update('name', v)}
          />
        </View>

        {/* ── Price row ────────────────────────────────────────────────────── */}
        <View style={styles.fieldRow}>
          <View style={[styles.fieldGroup, { flex: 1 }]}>
            <Text style={styles.fieldLabel}>Selling Price (₹) *</Text>
            <TextInput
              style={styles.input}
              placeholder="480"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="numeric"
              value={form.price}
              onChangeText={(v) => update('price', v)}
            />
          </View>
          <View style={[styles.fieldGroup, { flex: 1 }]}>
            <Text style={styles.fieldLabel}>MRP (₹)</Text>
            <TextInput
              style={styles.input}
              placeholder="650"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="numeric"
              value={form.mrp}
              onChangeText={(v) => update('mrp', v)}
            />
          </View>
        </View>

        {/* ── Unit & Stock ──────────────────────────────────────────────────── */}
        <View style={styles.fieldRow}>
          <View style={[styles.fieldGroup, { flex: 1 }]}>
            <Text style={styles.fieldLabel}>Unit</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
              {UNIT_OPTIONS.map((u) => (
                <TouchableOpacity
                  key={u}
                  onPress={() => update('unit', u)}
                  style={[styles.unitChip, form.unit === u && styles.unitChipActive]}
                >
                  <Text style={[styles.unitChipText, form.unit === u && styles.unitChipTextActive]}>{u}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <View style={[styles.fieldGroup, { width: 90 }]}>
            <Text style={styles.fieldLabel}>Stock</Text>
            <TextInput
              style={styles.input}
              placeholder="50"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="numeric"
              value={form.stock}
              onChangeText={(v) => update('stock', v)}
            />
          </View>
        </View>

        {/* ── Description ──────────────────────────────────────────────────── */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Product Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder={"Describe your product — how it's made, its unique qualities..."}
            placeholderTextColor={COLORS.textMuted}
            multiline
            numberOfLines={5}
            value={form.description}
            onChangeText={(v) => update('description', v)}
          />
        </View>

        {/* ── Tags ─────────────────────────────────────────────────────────── */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Tags (comma separated)</Text>
          <TextInput
            style={styles.input}
            placeholder="organic, handmade, wild, traditional"
            placeholderTextColor={COLORS.textMuted}
            value={form.tags}
            onChangeText={(v) => update('tags', v)}
          />
        </View>

        {/* ── Certifications ───────────────────────────────────────────────── */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Certifications & Compliance</Text>
          <View style={styles.certRow}>
            {[
              { key: 'fssai', label: 'FSSAI Licensed', emoji: '🍽️', note: 'Required for food products' },
              { key: 'gi', label: 'GI Tag Certified', emoji: '🏷️', note: 'Geographical Indication' },
              { key: 'handloom', label: 'Handloom Mark', emoji: '🧵', note: 'For textile products' },
              { key: 'nabard', label: 'NABARD SHG Verified', emoji: '🏦', note: 'SHG scheme registration' },
            ].map((cert) => (
              <TouchableOpacity
                key={cert.key}
                onPress={() => setCertifications((prev) => ({ ...prev, [cert.key]: !prev[cert.key] }))}
                style={[styles.certChip, certifications[cert.key] && styles.certChipActive]}
              >
                <Text style={styles.certEmoji}>{cert.emoji}</Text>
                <View>
                  <Text style={[styles.certLabel, certifications[cert.key] && styles.certLabelActive]}>
                    {cert.label}
                  </Text>
                  <Text style={styles.certNote}>{cert.note}</Text>
                </View>
                {certifications[cert.key] ? <Text style={styles.certCheck}>✓</Text> : null}
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.certHint}>Certified products get priority placement and GI badge</Text>
        </View>

        <LinearGradient colors={[COLORS.green + '15', COLORS.greenLight + '08']} style={styles.processNote}>
          <Text style={styles.processTitle}>{isEditMode ? '💾 Save Changes' : '📋 Approval Process'}</Text>
          <Text style={styles.processText}>
            {isEditMode
              ? 'Product will be re-reviewed by the Nari Samman team before going live.'
              : `1. Submit your product\n2. Nari Samman team reviews within 24–48 hours\n3. On approval, your product goes live on the platform`}
          </Text>
        </LinearGradient>

        <TouchableOpacity onPress={handleSubmit} style={styles.submitBtn} disabled={loading}>
          <LinearGradient colors={[COLORS.green, COLORS.greenLight]} style={styles.submitGrad}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>
                {isEditMode ? '✓ Save Changes' : '✓ Submit for Approval'}
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* ── Web File Picker ───────────────────────────────────────────────── */}
      {showWebPicker && Platform.OS === 'web' && (
        <View style={styles.overlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Add Product Photos</Text>
            <Text style={styles.modalSub}>Select one or more images</Text>
            <label htmlFor="prod-img-input" style={{ width: '100%', cursor: 'pointer' }}>
              <View style={styles.pickerRow}>
                <Text style={styles.pickerRowIcon}>🖼️</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.pickerRowTitle}>Choose Photos</Text>
                  <Text style={styles.pickerRowSub}>JPG, PNG, WebP · Max 5 MB each</Text>
                </View>
                <Text style={styles.pickerArrow}>→</Text>
              </View>
              <input
                id="prod-img-input"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                multiple
                style={{ display: 'none' }}
                onChange={handleWebFileChange}
              />
            </label>
            <TouchableOpacity onPress={() => setShowWebPicker(false)} style={styles.cancelBtn}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ── Success Overlay ───────────────────────────────────────────────── */}
      {showSuccess && (
        <View style={styles.overlay}>
          <View style={styles.successBox}>
            <Text style={styles.successEmoji}>🎉</Text>
            <Text style={styles.successTitle}>{isEditMode ? 'Product Updated!' : 'Product Submitted!'}</Text>
            <Text style={styles.successMsg}>
              <Text style={{ fontWeight: '700' }}>{form.name}</Text>
              {isEditMode
                ? ' has been re-submitted for admin review.'
                : ' is under review by the Nari Samman team.\nIt will go live once approved (24–48 hrs).'}
            </Text>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.successBtn}>
              <Text style={styles.successBtnText}>
                {isEditMode ? 'Back to My Products' : 'Back to Dashboard'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <AppAlert
        visible={alertState.visible}
        type={alertState.type}
        title={alertState.title}
        message={alertState.message}
        onClose={hideAlert}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark },
  scrollView: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 52, paddingHorizontal: 16, paddingBottom: 12,
    backgroundColor: COLORS.darkCard, ...SHADOWS.small,
  },
  back: { fontSize: 15, color: COLORS.green, fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  scroll: { padding: 16, flexGrow: 1 },

  // Photos
  photoSection: { backgroundColor: COLORS.darkCard, borderRadius: 20, padding: 16, marginBottom: 16, ...SHADOWS.small },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 12 },
  thumbWrap: { position: 'relative', width: 88, height: 88 },
  thumb: { width: 88, height: 88, borderRadius: 12 },
  thumbRemove: {
    position: 'absolute', top: 4, right: 4,
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.7)', alignItems: 'center', justifyContent: 'center',
  },
  thumbNewBadge: {
    position: 'absolute', bottom: 4, left: 4,
    backgroundColor: COLORS.green, borderRadius: 4, paddingHorizontal: 4, paddingVertical: 1,
  },
  thumbNewBadgeText: { fontSize: 8, color: '#fff', fontWeight: '800' },
  photoPlaceholder: {
    height: 110, borderRadius: 16, borderWidth: 2, borderColor: COLORS.darkBorder,
    borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center',
    gap: 6, marginBottom: 12, backgroundColor: COLORS.dark,
  },
  photoPlaceholderEmoji: { fontSize: 36 },
  photoCTAText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '600' },
  photoButtons: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  photoBtn: {
    flex: 1, backgroundColor: COLORS.dark, borderRadius: 50,
    paddingVertical: 9, alignItems: 'center', borderWidth: 1.5, borderColor: COLORS.darkBorder,
  },
  photoBtnGallery: { backgroundColor: COLORS.green + '12', borderColor: COLORS.green + '40' },
  photoBtnText: { fontSize: 12, fontWeight: '700', color: COLORS.textSecondary },
  photoHint: { fontSize: 11, color: COLORS.textMuted, textAlign: 'center', fontStyle: 'italic' },

  // Fields
  fieldGroup: { marginBottom: 16 },
  fieldLabel: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 8 },
  input: {
    backgroundColor: COLORS.darkCard, borderRadius: 14, paddingHorizontal: 14,
    paddingVertical: 12, fontSize: 14, color: COLORS.textPrimary,
    borderWidth: 1.5, borderColor: COLORS.darkBorder,
  },
  textArea: { height: 120, textAlignVertical: 'top' },
  fieldRow: { flexDirection: 'row', gap: 12, marginBottom: 0 },
  catRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 50,
    backgroundColor: COLORS.darkCard, borderWidth: 1.5, borderColor: COLORS.darkBorder,
  },
  catChipActive: { backgroundColor: COLORS.green, borderColor: COLORS.green },
  catChipEmoji: { fontSize: 14 },
  catChipLabel: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
  catChipLabelActive: { color: '#fff' },
  unitChip: {
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10,
    backgroundColor: COLORS.darkCard, borderWidth: 1.5, borderColor: COLORS.darkBorder,
  },
  unitChipActive: { backgroundColor: COLORS.green, borderColor: COLORS.green },
  unitChipText: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '600' },
  unitChipTextActive: { color: '#fff' },

  // Certifications
  certRow: { gap: 8, marginBottom: 8 },
  certChip: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: COLORS.darkCard, borderRadius: 12, padding: 12,
    borderWidth: 1.5, borderColor: COLORS.darkBorder,
  },
  certChipActive: { borderColor: COLORS.success, backgroundColor: COLORS.success + '12' },
  certEmoji: { fontSize: 20 },
  certLabel: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  certLabelActive: { color: COLORS.success },
  certNote: { fontSize: 10, color: COLORS.textMuted, marginTop: 1 },
  certCheck: { fontSize: 16, color: COLORS.success, fontWeight: '800', marginLeft: 'auto' },
  certHint: { fontSize: 11, color: COLORS.success, fontStyle: 'italic' },

  processNote: { borderRadius: 16, padding: 16, marginBottom: 16 },
  processTitle: { fontSize: 14, fontWeight: '700', color: COLORS.green, marginBottom: 8 },
  processText: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 22 },
  submitBtn: { borderRadius: 50, overflow: 'hidden' },
  submitGrad: { paddingVertical: 16, alignItems: 'center' },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  // Modals
  overlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center', zIndex: 999,
  },
  modalBox: { backgroundColor: COLORS.darkCard, borderRadius: 24, padding: 22, width: 330, alignItems: 'center', ...SHADOWS.large },
  modalTitle: { fontSize: 19, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 4 },
  modalSub: { fontSize: 12, color: COLORS.textMuted, marginBottom: 14, textAlign: 'center' },
  pickerRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12, width: '100%',
    backgroundColor: COLORS.dark, borderRadius: 16, padding: 14,
  },
  pickerRowIcon: { fontSize: 26 },
  pickerRowTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  pickerRowSub: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  pickerArrow: { fontSize: 18, color: COLORS.textMuted },
  cancelBtn: {
    marginTop: 14, width: '100%', paddingVertical: 12, borderRadius: 50,
    borderWidth: 1.5, borderColor: COLORS.darkBorder, alignItems: 'center',
  },
  cancelBtnText: { fontSize: 14, color: COLORS.textSecondary, fontWeight: '600' },

  successBox: { backgroundColor: COLORS.darkCard, borderRadius: 24, padding: 28, alignItems: 'center', width: 320, ...SHADOWS.large },
  successEmoji: { fontSize: 52, marginBottom: 10 },
  successTitle: { fontSize: 22, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 10 },
  successMsg: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  successBtn: { backgroundColor: COLORS.green, borderRadius: 50, paddingHorizontal: 28, paddingVertical: 14 },
  successBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});