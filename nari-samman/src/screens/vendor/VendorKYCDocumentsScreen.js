// import React, { useMemo, useState } from 'react';
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
// import useStore from '../../store/useStore';
// import { imgSrc } from '../../utils/imageSource';
// import Text from '../../autoTranslation/AutoText';
// import TextInput from '../../autoTranslation/AutoTextInput';

// async function pickImageNative(source) {
//   try {
//     if (source === 'camera') {
//       const { status } = await ImagePicker.requestCameraPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Permission Needed', 'Camera access is required to take document photos.');
//         return null;
//       }
//       const result = await ImagePicker.launchCameraAsync({
//         mediaTypes: ['images'],
//         allowsEditing: true,
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
//         quality: 0.8,
//       });
//       if (!result.canceled && result.assets?.[0]) return result.assets[0].uri;
//     }
//   } catch {
//     Alert.alert('Install Required', 'Run: npx expo install expo-image-picker\nto enable document photo upload.');
//   }
//   return null;
// }

// function DocumentUploadCard({ docKey, title, subtitle, required, value, error, onPick, onRemove }) {
//   const [webPickerOpen, setWebPickerOpen] = useState(false);
//   const inputId = `${docKey}-input`;

//   const handleWebFileChange = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = (ev) => {
//       onPick(docKey, ev.target.result);
//       setWebPickerOpen(false);
//     };
//     reader.readAsDataURL(file);
//   };

//   const choosePhoto = async (source = 'gallery') => {
//     if (Platform.OS === 'web') {
//       setWebPickerOpen(true);
//       return;
//     }
//     const uri = await pickImageNative(source);
//     if (uri) onPick(docKey, uri);
//   };

//   return (
//     <View style={[styles.docCard, error && styles.docCardError]}>
//       <View style={styles.docHeader}>
//         <View style={{ flex: 1 }}>
//           <Text style={styles.docTitle}>{title} {required ? '*' : ''}</Text>
//           <Text style={styles.docSub}>{subtitle}</Text>
//         </View>
//         {value ? <View style={styles.donePill}><Text style={styles.donePillText}>✓ Added</Text></View> : null}
//       </View>

//       <TouchableOpacity onPress={() => choosePhoto('gallery')} style={styles.previewBox} activeOpacity={0.86}>
//         {value ? (
//           <>
//             <Image source={imgSrc(value)} style={styles.previewImage} resizeMode="cover" />
//             <View style={styles.previewOverlay}>
//               <Text style={styles.previewOverlayText}>✏️ Change Photo</Text>
//             </View>
//           </>
//         ) : (
//           <LinearGradient colors={[COLORS.dark, COLORS.darkCard]} style={styles.placeholderBox}>
//             <Text style={styles.placeholderIcon}>📄</Text>
//             <Text style={styles.placeholderTitle}>Upload document photo</Text>
//             <Text style={styles.placeholderSub}>Camera or Gallery</Text>
//           </LinearGradient>
//         )}
//       </TouchableOpacity>

//       <View style={styles.docActions}>
//         <TouchableOpacity onPress={() => choosePhoto('camera')} style={styles.smallBtn}>
//           <Text style={styles.smallBtnText}>📷 Camera</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => choosePhoto('gallery')} style={[styles.smallBtn, styles.galleryBtn]}>
//           <Text style={styles.smallBtnText}>🖼️ Gallery</Text>
//         </TouchableOpacity>
//         {value ? (
//           <TouchableOpacity onPress={() => onRemove(docKey)} style={[styles.smallBtn, styles.removeBtn]}>
//             <Text style={[styles.smallBtnText, { color: COLORS.error }]}>🗑️ Remove</Text>
//           </TouchableOpacity>
//         ) : null}
//       </View>

//       {error ? <Text style={styles.errorText}>{error}</Text> : null}

//       {webPickerOpen && Platform.OS === 'web' ? (
//         <View style={styles.webPickerCard}>
//           <label htmlFor={inputId} style={{ width: '100%', cursor: 'pointer' }}>
//             <View style={styles.webPickerRow}>
//               <Text style={styles.webPickerIcon}>🖼️</Text>
//               <View style={{ flex: 1 }}>
//                 <Text style={styles.webPickerTitle}>Choose image file</Text>
//                 <Text style={styles.webPickerSub}>JPG / PNG document photo</Text>
//               </View>
//               <Text style={styles.webPickerArrow}>→</Text>
//             </View>
//             <input id={inputId} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleWebFileChange} />
//           </label>
//           <TouchableOpacity onPress={() => setWebPickerOpen(false)} style={styles.webCancelBtn}>
//             <Text style={styles.webCancelText}>Cancel</Text>
//           </TouchableOpacity>
//         </View>
//       ) : null}
//     </View>
//   );
// }

// export default function VendorKYCDocumentsScreen({ navigation }) {
//   const vendorProfile = useStore((s) => s.vendorProfile);
//   const updateVendorProfile = useStore((s) => s.updateVendorProfile);
//   const markVendorOnboardingStep = useStore((s) => s.markVendorOnboardingStep);

//   const existingDocs = vendorProfile.kycDocuments || {};
//   const [docs, setDocs] = useState({
//     identityProofPhoto: existingDocs.identityProofPhoto || vendorProfile.identityProofPhoto || '',
//     shgCertificatePhoto: existingDocs.shgCertificatePhoto || vendorProfile.shgCertificatePhoto || '',
//     addressProofPhoto: existingDocs.addressProofPhoto || vendorProfile.addressProofPhoto || '',
//     panOrRegistrationPhoto: existingDocs.panOrRegistrationPhoto || vendorProfile.panOrRegistrationPhoto || '',
//   });
//   const [note, setNote] = useState(vendorProfile.kycNote || '');
//   const [errors, setErrors] = useState({});
//   const [saved, setSaved] = useState(false);

//   const isComplete = useMemo(
//     () => Boolean(docs.identityProofPhoto && docs.shgCertificatePhoto),
//     [docs]
//   );

//   const setDocPhoto = (key, uri) => {
//     setDocs((prev) => ({ ...prev, [key]: uri }));
//     setErrors((prev) => ({ ...prev, [key]: null, general: null }));
//     setSaved(false);
//   };

//   const removeDocPhoto = (key) => {
//     setDocs((prev) => ({ ...prev, [key]: '' }));
//     setSaved(false);
//   };

//   const validate = () => {
//     const e = {};
//     if (!docs.identityProofPhoto) e.identityProofPhoto = 'Identity proof photo is required';
//     if (!docs.shgCertificatePhoto) e.shgCertificatePhoto = 'SHG certificate / registration document photo is required';
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   const saveKycDocuments = () => {
//     if (!validate()) return;
//     updateVendorProfile({
//       kycDocuments: docs,
//       identityProofPhoto: docs.identityProofPhoto,
//       shgCertificatePhoto: docs.shgCertificatePhoto,
//       addressProofPhoto: docs.addressProofPhoto,
//       panOrRegistrationPhoto: docs.panOrRegistrationPhoto,
//       kycNote: note.trim(),
//       kycStatus: 'submitted',
//     });
//     markVendorOnboardingStep('kycSubmitted');
//     setSaved(true);

//     if (Platform.OS === 'web') {
//       setTimeout(() => navigation.navigate('VendorTabs', { screen: 'VendorDashboard' }), 500);
//     } else {
//       Alert.alert('KYC Documents Saved', 'KYC document photos are saved to your vendor profile.', [
//         { text: 'OK', onPress: () => navigation.navigate('VendorTabs', { screen: 'VendorDashboard' }) },
//       ]);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <LinearGradient colors={COLORS.gradientHero} style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
//           <Text style={styles.backText}>← Back</Text>
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>KYC Documents</Text>
//         <Text style={styles.headerSub}>Upload document photos only. No Aadhaar, GST, or FSSAI number entry is required here.</Text>
//       </LinearGradient>

//       <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
//         <View style={styles.infoCard}>
//           <Text style={styles.infoIcon}>🪪</Text>
//           <View style={{ flex: 1 }}>
//             <Text style={styles.infoTitle}>Photo based verification</Text>
//             <Text style={styles.infoText}>Admin will review these photos during vendor approval. Clear, readable document photos help faster approval.</Text>
//           </View>
//         </View>

//         {saved ? <Text style={styles.successBanner}>✅ KYC document photos saved to profile</Text> : null}

//         <DocumentUploadCard
//           docKey="identityProofPhoto"
//           title="Identity Proof Photo"
//           subtitle="Aadhaar / Voter ID / any government ID photo"
//           required
//           value={docs.identityProofPhoto}
//           error={errors.identityProofPhoto}
//           onPick={setDocPhoto}
//           onRemove={removeDocPhoto}
//         />

//         <DocumentUploadCard
//           docKey="shgCertificatePhoto"
//           title="SHG Certificate / Registration Photo"
//           subtitle="Upload SHG registration, certificate, or group authorization photo"
//           required
//           value={docs.shgCertificatePhoto}
//           error={errors.shgCertificatePhoto}
//           onPick={setDocPhoto}
//           onRemove={removeDocPhoto}
//         />

//         <DocumentUploadCard
//           docKey="addressProofPhoto"
//           title="Address Proof Photo"
//           subtitle="Optional, but useful for admin verification"
//           value={docs.addressProofPhoto}
//           error={errors.addressProofPhoto}
//           onPick={setDocPhoto}
//           onRemove={removeDocPhoto}
//         />

//         <DocumentUploadCard
//           docKey="panOrRegistrationPhoto"
//           title="PAN / Extra Registration Photo"
//           subtitle="Optional extra compliance document photo"
//           value={docs.panOrRegistrationPhoto}
//           error={errors.panOrRegistrationPhoto}
//           onPick={setDocPhoto}
//           onRemove={removeDocPhoto}
//         />

//         <View style={styles.noteCard}>
//           <Text style={styles.noteLabel}>Admin Note (optional)</Text>
//           <TextInput
//             style={styles.noteInput}
//             value={note}
//             onChangeText={(v) => {
//               setNote(v);
//               setSaved(false);
//             }}
//             placeholder="Example: SHG certificate is in leader name / address proof belongs to group office"
//             placeholderTextColor={COLORS.textMuted}
//             multiline
//           />
//         </View>

//         <TouchableOpacity onPress={saveKycDocuments} activeOpacity={0.86} style={[styles.submitBtn, !isComplete && styles.submitBtnMuted]}>
//           <LinearGradient colors={isComplete ? [COLORS.green, COLORS.greenLight] : [COLORS.darkBorder, COLORS.darkBorder]} style={styles.submitGrad}>
//             <Text style={[styles.submitText, !isComplete && styles.submitTextMuted]}>Save KYC Documents →</Text>
//           </LinearGradient>
//         </TouchableOpacity>

//         <View style={{ height: 34 }} />
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: COLORS.dark },
//   header: { paddingTop: 54, paddingHorizontal: 20, paddingBottom: 22 },
//   backBtn: { alignSelf: 'flex-start', marginBottom: 16 },
//   backText: { color: COLORS.textSecondary, fontWeight: '700', fontSize: 15 },
//   headerTitle: { color: COLORS.textPrimary, fontSize: 26, fontWeight: '900' },
//   headerSub: { color: COLORS.textSecondary, fontSize: 13, lineHeight: 20, marginTop: 8 },
//   scroll: { padding: 16 },
//   infoCard: { flexDirection: 'row', gap: 12, padding: 14, borderRadius: 18, backgroundColor: COLORS.warning + '12', borderWidth: 1, borderColor: COLORS.warning + '35', marginBottom: 14 },
//   infoIcon: { fontSize: 28 },
//   infoTitle: { color: COLORS.warning, fontSize: 14, fontWeight: '800', marginBottom: 4 },
//   infoText: { color: COLORS.textSecondary, fontSize: 12, lineHeight: 18 },
//   successBanner: { color: COLORS.success, backgroundColor: COLORS.success + '15', borderRadius: 12, padding: 12, marginBottom: 12, fontWeight: '800' },
//   docCard: { backgroundColor: COLORS.darkCard, borderRadius: 20, padding: 14, marginBottom: 14, borderWidth: 1.5, borderColor: COLORS.darkBorder, ...SHADOWS.small },
//   docCardError: { borderColor: COLORS.error },
//   docHeader: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', marginBottom: 12 },
//   docTitle: { color: COLORS.textPrimary, fontSize: 15, fontWeight: '900' },
//   docSub: { color: COLORS.textMuted, fontSize: 12, lineHeight: 17, marginTop: 3 },
//   donePill: { backgroundColor: COLORS.success + '20', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
//   donePillText: { color: COLORS.success, fontSize: 11, fontWeight: '900' },
//   previewBox: { height: 170, borderRadius: 16, overflow: 'hidden', backgroundColor: COLORS.dark, borderWidth: 1, borderColor: COLORS.darkBorder },
//   previewImage: { width: '100%', height: '100%' },
//   previewOverlay: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingVertical: 9, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center' },
//   previewOverlayText: { color: '#fff', fontWeight: '800', fontSize: 12 },
//   placeholderBox: { flex: 1, alignItems: 'center', justifyContent: 'center' },
//   placeholderIcon: { fontSize: 40, marginBottom: 8 },
//   placeholderTitle: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '800' },
//   placeholderSub: { color: COLORS.textMuted, fontSize: 12, marginTop: 3 },
//   docActions: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginTop: 12 },
//   smallBtn: { backgroundColor: COLORS.primary + '22', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: COLORS.primary + '35' },
//   galleryBtn: { backgroundColor: COLORS.info + '18', borderColor: COLORS.info + '30' },
//   removeBtn: { backgroundColor: COLORS.error + '12', borderColor: COLORS.error + '25' },
//   smallBtnText: { color: COLORS.textPrimary, fontSize: 12, fontWeight: '800' },
//   errorText: { color: COLORS.error, fontSize: 11, fontWeight: '700', marginTop: 8 },
//   webPickerCard: { backgroundColor: COLORS.dark, borderRadius: 14, padding: 10, marginTop: 12, borderWidth: 1, borderColor: COLORS.darkBorder },
//   webPickerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.darkCard, borderRadius: 12, padding: 12 },
//   webPickerIcon: { fontSize: 22 },
//   webPickerTitle: { color: COLORS.textPrimary, fontSize: 13, fontWeight: '800' },
//   webPickerSub: { color: COLORS.textMuted, fontSize: 11, marginTop: 2 },
//   webPickerArrow: { color: COLORS.saffron, fontSize: 18, fontWeight: '900' },
//   webCancelBtn: { alignSelf: 'center', paddingHorizontal: 14, paddingVertical: 8, marginTop: 8 },
//   webCancelText: { color: COLORS.textMuted, fontWeight: '800' },
//   noteCard: { backgroundColor: COLORS.darkCard, borderRadius: 18, padding: 14, marginBottom: 14, ...SHADOWS.small },
//   noteLabel: { color: COLORS.textSecondary, fontSize: 12, fontWeight: '800', marginBottom: 8 },
//   noteInput: { minHeight: 84, backgroundColor: COLORS.dark, color: COLORS.textPrimary, borderRadius: 14, borderWidth: 1.5, borderColor: COLORS.darkBorder, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, textAlignVertical: 'top' },
//   submitBtn: { marginTop: 6, borderRadius: 16, overflow: 'hidden', ...SHADOWS.medium },
//   submitBtnMuted: { opacity: 0.9 },
//   submitGrad: { paddingVertical: 16, alignItems: 'center' },
//   submitText: { color: '#fff', fontSize: 15, fontWeight: '900' },
//   submitTextMuted: { color: COLORS.textMuted },
// });






























import React, { useEffect, useMemo, useState } from 'react';
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
import { imgSrc } from '../../utils/imageSource';
import Text from '../../autoTranslation/AutoText';
import TextInput from '../../autoTranslation/AutoTextInput';
import AppAlert, { useAppAlert } from '../../components/AppAlert';
import { submitVendorKyc, getVendorKycStatus } from '../../services/api';
import { getVendorId, getVendorToken } from '../../storage/authStorage';

// ─── Native image picker helper ───────────────────────────────────────────────
async function pickImageNative(source) {
  try {
    if (source === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Needed', 'Camera access is required to take document photos.');
        return null;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
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
        quality: 0.8,
      });
      if (!result.canceled && result.assets?.[0]) return result.assets[0];
    }
  } catch {
    Alert.alert('Install Required', 'Run: npx expo install expo-image-picker');
  }
  return null;
}

// ─── Document Upload Card (unchanged UI, updated internals) ───────────────────
function DocumentUploadCard({ docKey, title, subtitle, required, value, error, onPick, onRemove, headers }) {
  const [webPickerOpen, setWebPickerOpen] = useState(false);
  const inputId = `${docKey}-input`;

  const handleWebFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      // For web: store { uri: dataURL, name: file.name, type: file.type, blob: file }
      onPick(docKey, {
        uri: ev.target.result,
        name: file.name,
        type: file.type || 'image/jpeg',
        blob: file,
      });
      setWebPickerOpen(false);
    };
    reader.readAsDataURL(file);
  };

  const choosePhoto = async (source = 'gallery') => {
    if (Platform.OS === 'web') {
      setWebPickerOpen(true);
      return;
    }
    const asset = await pickImageNative(source);
    if (asset) {
      onPick(docKey, {
        uri: asset.uri,
        name: asset.fileName || `${docKey}.jpg`,
        type: asset.mimeType || 'image/jpeg',
      });
    }
  };

  const previewUri = value?.uri || null;
  const isExisting = Boolean(value?.existing);

  return (
    <View style={[styles.docCard, error && styles.docCardError]}>
      <View style={styles.docHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.docTitle}>{title} {required ? '*' : ''}</Text>
          <Text style={styles.docSub}>{subtitle}</Text>
        </View>
        {value ? <View style={styles.donePill}><Text style={styles.donePillText}>✓ Added</Text></View> : null}
      </View>

      <TouchableOpacity onPress={() => choosePhoto('gallery')} style={styles.previewBox} activeOpacity={0.86}>
        {previewUri ? (
          <>
            <Image source={{ uri: previewUri, headers: headers || {} }} style={styles.previewImage} resizeMode="cover" />
            <View style={styles.previewOverlay}>
              <Text style={styles.previewOverlayText}>{isExisting ? '👁 View / Replace' : '✏️ Change Photo'}</Text>
            </View>
          </>
        ) : (
          <LinearGradient colors={[COLORS.dark, COLORS.darkCard]} style={styles.placeholderBox}>
            <Text style={styles.placeholderIcon}>📄</Text>
            <Text style={styles.placeholderTitle}>Upload document photo</Text>
            <Text style={styles.placeholderSub}>Camera or Gallery</Text>
          </LinearGradient>
        )}
      </TouchableOpacity>

      <View style={styles.docActions}>
        <TouchableOpacity onPress={() => choosePhoto('camera')} style={styles.smallBtn}>
          <Text style={styles.smallBtnText}>📷 Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => choosePhoto('gallery')} style={[styles.smallBtn, styles.galleryBtn]}>
          <Text style={styles.smallBtnText}>🖼️ Gallery</Text>
        </TouchableOpacity>
        {value ? (
          <TouchableOpacity onPress={() => onRemove(docKey)} style={[styles.smallBtn, styles.removeBtn]}>
            <Text style={[styles.smallBtnText, { color: COLORS.error }]}>🗑️ Remove</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {webPickerOpen && Platform.OS === 'web' ? (
        <View style={styles.webPickerCard}>
          <label htmlFor={inputId} style={{ width: '100%', cursor: 'pointer' }}>
            <View style={styles.webPickerRow}>
              <Text style={styles.webPickerIcon}>🖼️</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.webPickerTitle}>Choose image file</Text>
                <Text style={styles.webPickerSub}>JPG / PNG document photo</Text>
              </View>
              <Text style={styles.webPickerArrow}>→</Text>
            </View>
            <input id={inputId} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleWebFileChange} />
          </label>
          <TouchableOpacity onPress={() => setWebPickerOpen(false)} style={styles.webCancelBtn}>
            <Text style={styles.webCancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function VendorKYCDocumentsScreen({ navigation }) {
  const vendorProfile       = useStore((s) => s.vendorProfile);
  const updateVendorProfile = useStore((s) => s.updateVendorProfile);
  const markVendorOnboardingStep = useStore((s) => s.markVendorOnboardingStep);

  const { alertState, showAlert, hideAlert } = useAppAlert();

  // ── local doc state: values are { uri, name, type, blob? } or null ─────────
  const [docs, setDocs] = useState({
    identityProof:    null,
    shgCertificate:   null,
    addressProof:     null,
    panRegistration:  null,
  });
  const [note, setNote]         = useState(vendorProfile.kycNote || '');
  const [errors, setErrors]     = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);

  // ── KYC status fetched from backend ─────────────────────────────────────────
  const [backendKyc, setBackendKyc] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [imageHeaders, setImageHeaders] = useState({});

  const existingFile = (url) => (url ? { uri: url, name: 'existing', type: 'image/jpeg', existing: true } : null);

  // Fetch existing KYC status on mount
  useEffect(() => {
    let mounted = true;
    async function loadStatus() {
      try {
        setStatusLoading(true);
        const vendorId = await getVendorId();
        if (!vendorId) return;
        const res = await getVendorKycStatus(vendorId);
        if (mounted && res?.success) {
          setBackendKyc(res.kyc);
          // Sync kycStatus into Zustand store so profile screen reflects it
          updateVendorProfile({ kycStatus: res.kyc.kycStatus?.toLowerCase() });

          // Prefill previews for already-uploaded docs (so they remain visible after logout/login)
          setDocs((prev) => ({
            identityProof: prev.identityProof || existingFile(res.kyc.identityProofUrl),
            shgCertificate: prev.shgCertificate || existingFile(res.kyc.shgCertificateUrl),
            addressProof: prev.addressProof || existingFile(res.kyc.addressProofUrl),
            panRegistration: prev.panRegistration || existingFile(res.kyc.panRegistrationUrl),
          }));
        }
      } catch {
        // No prior submission — that's fine
      } finally {
        if (mounted) setStatusLoading(false);
      }
    }
    loadStatus();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const token = await getVendorToken();
        if (!mounted) return;
        setImageHeaders(token ? { Authorization: `Bearer ${token}` } : {});
      } catch {
        if (mounted) setImageHeaders({});
      }
    })();
    return () => { mounted = false; };
  }, []);

  const isComplete = useMemo(
    () => Boolean(docs.identityProof && docs.shgCertificate),
    [docs]
  );

  const setDocPhoto = (key, fileObj) => {
    setDocs((prev) => ({ ...prev, [key]: fileObj }));
    setErrors((prev) => ({ ...prev, [key]: null }));
    setSubmitted(false);
  };

  const removeDocPhoto = (key) => {
    setDocs((prev) => ({ ...prev, [key]: null }));
    setSubmitted(false);
  };

  const validate = () => {
    const e = {};
    if (!docs.identityProof) e.identityProof = 'Identity proof photo is required';
    if (!docs.shgCertificate) e.shgCertificate = 'SHG certificate photo is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Build file object for FormData ───────────────────────────────────────────
  // On web we have { uri (dataURL), name, type, blob }
  // On native we have { uri (file://...), name, type }
  const buildFileArg = (fileObj) => {
    if (!fileObj) return null;
    if (fileObj.existing) return null;
    if (Platform.OS === 'web') {
      // Use the raw Blob/File if available; otherwise convert data URL to Blob
      if (fileObj.blob) return fileObj.blob;
      // Fallback: convert dataURL to Blob
      const byteString = atob(fileObj.uri.split(',')[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
      return new Blob([ab], { type: fileObj.type || 'image/jpeg' });
    }
    // Native: return as-is — submitVendorKyc handles { uri, name, type }
    return fileObj;
  };

  const saveKycDocuments = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const vendorId = await getVendorId();
      if (!vendorId) throw new Error('Not logged in');

      const res = await submitVendorKyc(vendorId, {
        identityProof:   buildFileArg(docs.identityProof),
        shgCertificate:  buildFileArg(docs.shgCertificate),
        addressProof:    buildFileArg(docs.addressProof),
        panRegistration: buildFileArg(docs.panRegistration),
        vendorNote:      note.trim(),
      });

      if (res?.success) {
        setBackendKyc(res.kyc);
        setDocs((prev) => ({
          identityProof: prev.identityProof || existingFile(res.kyc.identityProofUrl),
          shgCertificate: prev.shgCertificate || existingFile(res.kyc.shgCertificateUrl),
          addressProof: prev.addressProof || existingFile(res.kyc.addressProofUrl),
          panRegistration: prev.panRegistration || existingFile(res.kyc.panRegistrationUrl),
        }));
        updateVendorProfile({
          kycStatus: 'submitted',
          kycNote: note.trim(),
        });
        markVendorOnboardingStep('kycSubmitted');
        setSubmitted(true);

        showAlert('success', 'KYC Submitted', 'Documents uploaded. Admin will review within 1–2 business days.');
        setTimeout(() => {
          navigation.navigate('VendorTabs', { screen: 'VendorDashboard' });
        }, 1200);
      } else {
        showAlert('error', 'Submission Failed', res?.message || 'Please try again.');
      }
    } catch (e) {
      showAlert('error', 'Upload Error', e.message || 'Network error. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render admin status banner (shown when prior submission exists) ─────────
  const renderStatusBanner = () => {
    if (!backendKyc) return null;
    const st = backendKyc.kycStatus;
    const config = {
      PENDING:  { color: '#FF9800', bg: '#FF980018', emoji: '⏳', text: 'Under admin review. You will be notified once verified.' },
      APPROVED: { color: '#4CAF50', bg: '#4CAF5018', emoji: '✅', text: 'Your KYC is verified! You can list and sell products.' },
      REJECTED: { color: '#F44336', bg: '#F4433618', emoji: '❌', text: backendKyc.adminNote || 'KYC was rejected. Please re-upload corrected documents.' },
    }[st] || { color: '#FF9800', bg: '#FF980018', emoji: '⏳', text: 'Under review.' };

    return (
      <View style={[styles.statusBanner, { backgroundColor: config.bg, borderColor: config.color + '40' }]}>
        <Text style={styles.statusBannerEmoji}>{config.emoji}</Text>
        <View style={{ flex: 1 }}>
          <Text style={[styles.statusBannerTitle, { color: config.color }]}>
            KYC {st === 'PENDING' ? 'Pending Review' : st === 'APPROVED' ? 'Verified ✓' : 'Rejected'}
          </Text>
          <Text style={styles.statusBannerText}>{config.text}</Text>
          {st === 'APPROVED' && (
            <Text style={styles.statusBannerSub}>Submitted: {backendKyc.submittedAt}</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={COLORS.gradientHero} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>KYC Documents</Text>
        <Text style={styles.headerSub}>Upload document photos. No Aadhaar, GST, or FSSAI number entry required here.</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Info banner */}
        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>🪪</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.infoTitle}>Photo based verification</Text>
            <Text style={styles.infoText}>Admin will review photos during vendor approval. Clear, readable document photos help faster approval.</Text>
          </View>
        </View>

        {/* Backend KYC status */}
        {statusLoading ? (
          <View style={styles.statusLoading}>
            <ActivityIndicator color={COLORS.primary} size="small" />
            <Text style={styles.statusLoadingText}>Checking KYC status...</Text>
          </View>
        ) : renderStatusBanner()}

        {submitted ? (
          <Text style={styles.successBanner}>✅ KYC documents uploaded to server</Text>
        ) : null}

        {/* Document upload cards */}
        <DocumentUploadCard
          docKey="identityProof"
          title="Identity Proof Photo"
          subtitle="Aadhaar / Voter ID / any government ID photo"
          required
          value={docs.identityProof}
          error={errors.identityProof}
          onPick={setDocPhoto}
          onRemove={removeDocPhoto}
          headers={imageHeaders}
        />
        <DocumentUploadCard
          docKey="shgCertificate"
          title="SHG Certificate / Registration Photo"
          subtitle="SHG registration, certificate, or group authorization photo"
          required
          value={docs.shgCertificate}
          error={errors.shgCertificate}
          onPick={setDocPhoto}
          onRemove={removeDocPhoto}
          headers={imageHeaders}
        />
        <DocumentUploadCard
          docKey="addressProof"
          title="Address Proof Photo"
          subtitle="Optional, but useful for admin verification"
          value={docs.addressProof}
          error={errors.addressProof}
          onPick={setDocPhoto}
          onRemove={removeDocPhoto}
          headers={imageHeaders}
        />
        <DocumentUploadCard
          docKey="panRegistration"
          title="PAN / Extra Registration Photo"
          subtitle="Optional extra compliance document photo"
          value={docs.panRegistration}
          error={errors.panRegistration}
          onPick={setDocPhoto}
          onRemove={removeDocPhoto}
          headers={imageHeaders}
        />

        {/* Admin note */}
        <View style={styles.noteCard}>
          <Text style={styles.noteLabel}>Admin Note (optional)</Text>
          <TextInput
            style={styles.noteInput}
            value={note}
            onChangeText={(v) => { setNote(v); setSubmitted(false); }}
            placeholder="Example: SHG certificate is in leader name / address proof belongs to group office"
            placeholderTextColor={COLORS.textMuted}
            multiline
          />
        </View>

        {/* Submit button */}
        <TouchableOpacity
          onPress={saveKycDocuments}
          activeOpacity={0.86}
          disabled={submitting || !isComplete}
          style={[styles.submitBtn, (!isComplete || submitting) && styles.submitBtnMuted]}
        >
          <LinearGradient
            colors={isComplete && !submitting ? [COLORS.green, COLORS.greenLight] : [COLORS.darkBorder, COLORS.darkBorder]}
            style={styles.submitGrad}
          >
            {submitting ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <ActivityIndicator color="#fff" size="small" />
                <Text style={styles.submitText}>Uploading...</Text>
              </View>
            ) : (
              <Text style={[styles.submitText, (!isComplete) && styles.submitTextMuted]}>
                {backendKyc ? 'Re-submit KYC Documents →' : 'Submit KYC Documents →'}
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 34 }} />
      </ScrollView>

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
  header: { paddingTop: 54, paddingHorizontal: 20, paddingBottom: 22 },
  backBtn: { alignSelf: 'flex-start', marginBottom: 16 },
  backText: { color: COLORS.textSecondary, fontWeight: '700', fontSize: 15 },
  headerTitle: { color: COLORS.textPrimary, fontSize: 26, fontWeight: '900' },
  headerSub: { color: COLORS.textSecondary, fontSize: 13, lineHeight: 20, marginTop: 8 },
  scroll: { padding: 16 },
  infoCard: { flexDirection: 'row', gap: 12, padding: 14, borderRadius: 18, backgroundColor: COLORS.warning + '12', borderWidth: 1, borderColor: COLORS.warning + '35', marginBottom: 14 },
  infoIcon: { fontSize: 28 },
  infoTitle: { color: COLORS.warning, fontSize: 14, fontWeight: '800', marginBottom: 4 },
  infoText: { color: COLORS.textSecondary, fontSize: 12, lineHeight: 18 },
  statusBanner: { flexDirection: 'row', gap: 12, padding: 14, borderRadius: 16, borderWidth: 1.5, marginBottom: 14, alignItems: 'flex-start' },
  statusBannerEmoji: { fontSize: 26 },
  statusBannerTitle: { fontSize: 14, fontWeight: '800', marginBottom: 4 },
  statusBannerText: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18 },
  statusBannerSub: { fontSize: 11, color: COLORS.textMuted, marginTop: 4 },
  statusLoading: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, marginBottom: 14 },
  statusLoadingText: { color: COLORS.textMuted, fontSize: 13 },
  successBanner: { color: COLORS.success, backgroundColor: COLORS.success + '15', borderRadius: 12, padding: 12, marginBottom: 12, fontWeight: '800' },
  docCard: { backgroundColor: COLORS.darkCard, borderRadius: 20, padding: 14, marginBottom: 14, borderWidth: 1.5, borderColor: COLORS.darkBorder, ...SHADOWS.small },
  docCardError: { borderColor: COLORS.error },
  docHeader: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', marginBottom: 12 },
  docTitle: { color: COLORS.textPrimary, fontSize: 15, fontWeight: '900' },
  docSub: { color: COLORS.textMuted, fontSize: 12, lineHeight: 17, marginTop: 3 },
  donePill: { backgroundColor: COLORS.success + '20', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  donePillText: { color: COLORS.success, fontSize: 11, fontWeight: '900' },
  previewBox: { height: 170, borderRadius: 16, overflow: 'hidden', backgroundColor: COLORS.dark, borderWidth: 1, borderColor: COLORS.darkBorder },
  previewImage: { width: '100%', height: '100%' },
  previewOverlay: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingVertical: 9, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center' },
  previewOverlayText: { color: '#fff', fontWeight: '800', fontSize: 12 },
  placeholderBox: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  placeholderIcon: { fontSize: 40, marginBottom: 8 },
  placeholderTitle: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '800' },
  placeholderSub: { color: COLORS.textMuted, fontSize: 12, marginTop: 3 },
  docActions: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginTop: 12 },
  smallBtn: { backgroundColor: COLORS.primary + '22', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: COLORS.primary + '35' },
  galleryBtn: { backgroundColor: COLORS.info + '18', borderColor: COLORS.info + '30' },
  removeBtn: { backgroundColor: COLORS.error + '12', borderColor: COLORS.error + '25' },
  smallBtnText: { color: COLORS.textPrimary, fontSize: 12, fontWeight: '800' },
  errorText: { color: COLORS.error, fontSize: 11, fontWeight: '700', marginTop: 8 },
  webPickerCard: { backgroundColor: COLORS.dark, borderRadius: 14, padding: 10, marginTop: 12, borderWidth: 1, borderColor: COLORS.darkBorder },
  webPickerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.darkCard, borderRadius: 12, padding: 12 },
  webPickerIcon: { fontSize: 22 },
  webPickerTitle: { color: COLORS.textPrimary, fontSize: 13, fontWeight: '800' },
  webPickerSub: { color: COLORS.textMuted, fontSize: 11, marginTop: 2 },
  webPickerArrow: { color: COLORS.saffron, fontSize: 18, fontWeight: '900' },
  webCancelBtn: { alignSelf: 'center', paddingHorizontal: 14, paddingVertical: 8, marginTop: 8 },
  webCancelText: { color: COLORS.textMuted, fontWeight: '800' },
  noteCard: { backgroundColor: COLORS.darkCard, borderRadius: 18, padding: 14, marginBottom: 14, ...SHADOWS.small },
  noteLabel: { color: COLORS.textSecondary, fontSize: 12, fontWeight: '800', marginBottom: 8 },
  noteInput: { minHeight: 84, backgroundColor: COLORS.dark, color: COLORS.textPrimary, borderRadius: 14, borderWidth: 1.5, borderColor: COLORS.darkBorder, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, textAlignVertical: 'top' },
  submitBtn: { marginTop: 6, borderRadius: 16, overflow: 'hidden', ...SHADOWS.medium },
  submitBtnMuted: { opacity: 0.9 },
  submitGrad: { paddingVertical: 16, alignItems: 'center' },
  submitText: { color: '#fff', fontSize: 15, fontWeight: '900' },
  submitTextMuted: { color: COLORS.textMuted },
});
