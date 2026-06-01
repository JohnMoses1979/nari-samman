




// import React, { useState } from 'react';
// import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { COLORS, SHADOWS } from '../../theme/colors';

// import useStore from '../../store/useStore';
// import Text from "../../autoTranslation/AutoText";
// import TextInput from "../../autoTranslation/AutoTextInput";
// import useAppLanguage from "../../autoTranslation/useAppLanguage";

// export default function DeliveryAddressScreen({ navigation }) {
//   const lang = useAppLanguage();

//   const { user, addUserAddress, removeUserAddress, setDefaultUserAddress } = useStore();
//   const addresses = user.addresses || [];
//   const [showForm, setShowForm] = useState(false);
//   const [selected, setSelected] = useState((user.addresses || []).find((a) => a.default)?.id || user.addresses?.[0]?.id);
//   const [newLabel, setNewLabel] = useState('');
//   const [newLine, setNewLine] = useState('');

//   const addAddress = () => {
//     if (!newLabel.trim() || !newLine.trim()) {
//       if (Platform.OS === 'web') alert("Please fill in both fields");
//       else Alert.alert("Error", "Please fill in both fields");
//       return;
//     }

//     const addr = addUserAddress({
//       label: newLabel.trim(),
//       line: newLine.trim(),
//       default: addresses.length === 0
//     });

//     setSelected(addr.id);
//     setNewLabel('');
//     setNewLine('');
//     setShowForm(false);
//   };

//   const selectAddress = (id) => {
//     setSelected(id);
//     setDefaultUserAddress(id);
//   };

//   const removeAddress = (id) => {
//     removeUserAddress(id);

//     if (selected === id) {
//       const next = addresses.find((a) => a.id !== id);
//       setSelected(next?.id);
//       if (next?.id) setDefaultUserAddress(next.id);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <LinearGradient colors={['#0F1822', '#1C2437']} style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
//           <Text style={styles.backText}>{"← Back"}</Text>
//         </TouchableOpacity>

//         <Text style={styles.headerTitle}>{"Delivery Address"} 📍</Text>
//         <Text style={styles.headerSub}>{addresses.length} {"saved address(es)"}</Text>
//       </LinearGradient>

//       <ScrollView
//         style={styles.scroll}
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//         keyboardShouldPersistTaps="handled"
//         nestedScrollEnabled={true}
//       >
//         {addresses.map((addr) => (
//           <View key={addr.id} style={[styles.addrCard, selected === addr.id && styles.addrCardActive]}>
//             <TouchableOpacity style={styles.addrMain} onPress={() => selectAddress(addr.id)}>
//               <View style={[styles.radio, selected === addr.id && styles.radioActive]} />

//               <View style={styles.addrBody}>
//                 <View style={styles.addrLabelRow}>
//                   <View style={styles.labelBadge}>
//                     <Text style={styles.labelBadgeText}>{addr.label}</Text>
//                   </View>

//                   {addr.default && <Text style={styles.defaultTag}>{"Default"}</Text>}
//                 </View>

//                 <Text style={styles.addrLine}>{addr.line}</Text>
//               </View>
//             </TouchableOpacity>

//             <View style={styles.addrActions}>
//               <TouchableOpacity onPress={() => removeAddress(addr.id)}>
//                 <Text style={styles.removeText}>{"Remove"}</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         ))}

//         {showForm ? (
//           <View style={styles.formCard}>
//             <Text style={styles.formTitle}>➕ {"Add New Address"}</Text>

//             <TextInput
//               style={styles.input}
//               placeholder={"Label (e.g. Home, Office)"}
//               placeholderTextColor={COLORS.textMuted}
//               value={newLabel}
//               onChangeText={setNewLabel}
//             />

//             <TextInput
//               style={[styles.input, styles.inputMulti]}
//               placeholder={"Full address with city and PIN"}
//               placeholderTextColor={COLORS.textMuted}
//               value={newLine}
//               onChangeText={setNewLine}
//               multiline
//               numberOfLines={3}
//             />

//             <View style={styles.formBtns}>
//               <TouchableOpacity onPress={() => setShowForm(false)} style={styles.cancelBtn}>
//                 <Text style={styles.cancelBtnText}>{"Cancel"}</Text>
//               </TouchableOpacity>

//               <TouchableOpacity onPress={addAddress} style={styles.saveBtn}>
//                 <Text style={styles.saveBtnText}>{"Save Address"}</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         ) : (
//           <TouchableOpacity onPress={() => setShowForm(true)} style={styles.addBtn}>
//             <Text style={styles.addBtnText}>+ {"Add New Address"}</Text>
//           </TouchableOpacity>
//         )}

//         <View style={styles.infoBox}>
//           <Text style={styles.infoTitle}>📦 {"Delivery Info"}</Text>
//           <Text style={styles.infoText}>
//             {"• Free delivery on orders above ₹500\n• Standard delivery: 5–7 business days\n• Dispatched from Sandeshkhali Warehouse, N24PGS"}
//           </Text>
//         </View>

//         <View style={{ height: 30 }} />
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     minHeight: 0,
//     backgroundColor: COLORS.dark
//   },

//   header: {
//     paddingTop: 52,
//     paddingHorizontal: 20,
//     paddingBottom: 24
//   },

//   backBtn: {
//     marginBottom: 16
//   },

//   backText: {
//     fontSize: 14,
//     color: 'rgba(200,208,228,0.7)',
//     fontWeight: '600'
//   },

//   headerTitle: {
//     fontSize: 24,
//     fontWeight: '800',
//     color: '#fff'
//   },

//   headerSub: {
//     fontSize: 13,
//     color: 'rgba(200,208,228,0.5)',
//     marginTop: 4
//   },

//   scroll: {
//     flex: 1,
//     minHeight: 0,
//     ...(Platform.OS === 'web' ? { overflow: 'auto', WebkitOverflowScrolling: 'touch' } : {})
//   },

//   scrollContent: {
//     padding: 16,
//     paddingBottom: Platform.OS === 'web' ? 40 : 30,
//     flexGrow: 1
//   },

//   addrCard: {
//     backgroundColor: COLORS.darkCard,
//     borderRadius: 18,
//     padding: 16,
//     marginBottom: 12,
//     borderWidth: 1.5,
//     borderColor: COLORS.darkBorder,
//     ...SHADOWS.small
//   },

//   addrCardActive: {
//     borderColor: COLORS.saffron,
//     backgroundColor: COLORS.saffron + '06'
//   },

//   addrMain: {
//     flexDirection: 'row',
//     gap: 14,
//     alignItems: 'flex-start'
//   },

//   radio: {
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     borderWidth: 2,
//     borderColor: COLORS.textMuted,
//     marginTop: 2,
//     flexShrink: 0
//   },

//   radioActive: {
//     borderColor: COLORS.saffron,
//     backgroundColor: COLORS.saffron
//   },

//   addrBody: {
//     flex: 1
//   },

//   addrLabelRow: {
//     flexDirection: 'row',
//     gap: 8,
//     alignItems: 'center',
//     marginBottom: 8
//   },

//   labelBadge: {
//     backgroundColor: COLORS.saffron + '20',
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     paddingVertical: 3
//   },

//   labelBadgeText: {
//     fontSize: 11,
//     fontWeight: '700',
//     color: COLORS.saffron
//   },

//   defaultTag: {
//     fontSize: 11,
//     color: COLORS.success,
//     fontWeight: '600'
//   },

//   addrLine: {
//     fontSize: 14,
//     color: COLORS.textSecondary,
//     lineHeight: 20
//   },

//   addrActions: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     marginTop: 12,
//     paddingTop: 10,
//     borderTopWidth: 1,
//     borderColor: COLORS.darkBorder
//   },

//   removeText: {
//     fontSize: 13,
//     color: COLORS.bengalRed,
//     fontWeight: '600'
//   },

//   formCard: {
//     backgroundColor: COLORS.darkCard,
//     borderRadius: 18,
//     padding: 20,
//     marginBottom: 12,
//     ...SHADOWS.small
//   },

//   formTitle: {
//     fontSize: 15,
//     fontWeight: '700',
//     color: COLORS.textPrimary,
//     marginBottom: 14
//   },

//   input: {
//     backgroundColor: COLORS.darkCard,
//     borderRadius: 12,
//     padding: 14,
//     fontSize: 14,
//     color: COLORS.textPrimary,
//     marginBottom: 12
//   },

//   inputMulti: {
//     height: 80,
//     textAlignVertical: 'top'
//   },

//   formBtns: {
//     flexDirection: 'row',
//     gap: 12
//   },

//   cancelBtn: {
//     flex: 1,
//     paddingVertical: 12,
//     borderRadius: 50,
//     borderWidth: 1.5,
//     borderColor: COLORS.darkBorder,
//     alignItems: 'center'
//   },

//   cancelBtnText: {
//     fontSize: 14,
//     color: COLORS.textMuted,
//     fontWeight: '600'
//   },

//   saveBtn: {
//     flex: 2,
//     paddingVertical: 12,
//     borderRadius: 50,
//     backgroundColor: COLORS.saffron,
//     alignItems: 'center'
//   },

//   saveBtnText: {
//     fontSize: 14,
//     color: '#fff',
//     fontWeight: '700'
//   },

//   addBtn: {
//     borderWidth: 1.5,
//     borderColor: COLORS.saffron,
//     borderStyle: 'dashed',
//     borderRadius: 18,
//     paddingVertical: 16,
//     alignItems: 'center',
//     marginBottom: 16
//   },

//   addBtnText: {
//     fontSize: 14,
//     color: COLORS.saffron,
//     fontWeight: '600'
//   },

//   infoBox: {
//     backgroundColor: COLORS.green + '15',
//     borderRadius: 18,
//     padding: 18,
//     borderWidth: 1,
//     borderColor: COLORS.greenLight + '30'
//   },

//   infoTitle: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: COLORS.green,
//     marginBottom: 10
//   },

//   infoText: {
//     fontSize: 13,
//     color: COLORS.textSecondary,
//     lineHeight: 22
//   }
// });



















// ─── screens/consumer/DeliveryAddressScreen.js ───────────────────────────────
//
// Changes from original:
//   - All address data now fetched from / persisted to real backend
//   - Full address form (name, phone, line, landmark, city, state, pincode, type)
//   - Zustand address store calls removed (addresses are now server-owned)
//   - AppAlert replaces all Alert.alert / browser alert calls
//   - Edit mode added alongside Add mode
//   - Loading states on every async button
//   - Delete confirmation via AppAlert confirm type
//   - Existing card UI, header, and stylesheet are identical to original
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../../theme/colors';
import Text from '../../autoTranslation/AutoText';
import TextInput from '../../autoTranslation/AutoTextInput';
import AppAlert, { useAppAlert } from '../../components/AppAlert';

import {
  fetchAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from '../../services/api';
import { getConsumerId } from '../../storage/authStorage';

const ADDRESS_TYPES = ['Home', 'Office', 'Other'];

const EMPTY_FORM = {
  fullName: '',
  phoneNumber: '',
  addressLine: '',
  landmark: '',
  city: '',
  state: '',
  pincode: '',
  addressType: 'Home',
};

export default function DeliveryAddressScreen({ navigation }) {
  const [addresses, setAddresses] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null); // null = add, number = edit
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saveLoading, setSaveLoading] = useState(false);

  // Per-address action loading (keyed by address id)
  const [defaultLoading, setDefaultLoading] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);

  const { alertState, showAlert, showConfirm, hideAlert } = useAppAlert();

  // ── Load addresses on mount ──────────────────────────────────────────────────
  const loadAddresses = useCallback(async () => {
    try {
      const consumerId = await getConsumerId();
      if (!consumerId) return;
      const result = await fetchAddresses(consumerId);
      setAddresses(result?.addresses || []);
    } catch (err) {
      showAlert('error', 'Failed to load', err.message || 'Could not fetch addresses.');
    } finally {
      setPageLoading(false);
    }
  }, []);

  useEffect(() => { loadAddresses(); }, [loadAddresses]);

  // ── Form helpers ─────────────────────────────────────────────────────────────
  const setField = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!/^\d{10}$/.test(form.phoneNumber.replace(/\D/g, '')))
      e.phoneNumber = 'Enter a valid 10-digit phone number';
    if (!form.addressLine.trim() || form.addressLine.trim().length < 5)
      e.addressLine = 'Address must be at least 5 characters';
    if (!form.city.trim()) e.city = 'City is required';
    if (!form.state.trim()) e.state = 'State is required';
    if (!/^\d{6}$/.test(form.pincode.trim())) e.pincode = 'Enter a valid 6-digit pincode';
    if (!form.addressType) e.addressType = 'Select an address type';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const openAddForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setShowForm(true);
  };

  const openEditForm = (addr) => {
    setEditingId(addr.id);
    setForm({
      fullName: addr.fullName || '',
      phoneNumber: addr.phoneNumber || '',
      addressLine: addr.addressLine || '',
      landmark: addr.landmark || '',
      city: addr.city || '',
      state: addr.state || '',
      pincode: addr.pincode || '',
      addressType: addr.addressType || 'Home',
    });
    setErrors({});
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrors({});
  };

  // ── Save (Add or Edit) ───────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!validate()) return;
    setSaveLoading(true);
    try {
      const payload = {
        fullName: form.fullName.trim(),
        phoneNumber: form.phoneNumber.replace(/\D/g, ''),
        addressLine: form.addressLine.trim(),
        landmark: form.landmark.trim() || null,
        city: form.city.trim(),
        state: form.state.trim(),
        pincode: form.pincode.trim(),
        addressType: form.addressType,
      };

      if (editingId) {
        const result = await updateAddress(editingId, payload);
        setAddresses((prev) =>
          prev.map((a) => (a.id === editingId ? result.address : a))
        );
        showAlert('success', 'Address Updated', 'Your address has been updated successfully.');
      } else {
        const result = await addAddress(payload);
        setAddresses((prev) => {
          // If this is the first address it's auto-default; clear old defaults display
          const updated = prev.map((a) =>
            result.address.isDefault ? { ...a, isDefault: false } : a
          );
          return [result.address, ...updated];
        });
        showAlert('success', 'Address Added', 'Your new address has been saved successfully.');
      }

      cancelForm();
    } catch (err) {
      showAlert('error', editingId ? 'Update Failed' : 'Save Failed',
        err.message || 'Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────────
  const confirmDelete = (addr) => {
    showConfirm(
      'Delete Address?',
      `Remove ${addr.addressType} address at ${addr.city}? This cannot be undone.`,
      () => handleDelete(addr.id),
      'Delete'
    );
  };

  const handleDelete = async (addressId) => {
    setDeleteLoading(addressId);
    try {
      await deleteAddress(addressId);
      setAddresses((prev) => {
        const remaining = prev.filter((a) => a.id !== addressId);
        // If deleted was default and there are others, promote first
        const deletedWasDefault = prev.find((a) => a.id === addressId)?.isDefault;
        if (deletedWasDefault && remaining.length > 0) {
          remaining[0] = { ...remaining[0], isDefault: true };
        }
        return remaining;
      });
      showAlert('success', 'Address Deleted', 'The address has been removed.');
    } catch (err) {
      showAlert('error', 'Delete Failed', err.message || 'Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  // ── Set Default ───────────────────────────────────────────────────────────────
  const handleSetDefault = async (addressId) => {
    if (addresses.find((a) => a.id === addressId)?.isDefault) return; // already default
    setDefaultLoading(addressId);
    try {
      await setDefaultAddress(addressId);
      setAddresses((prev) =>
        prev.map((a) => ({ ...a, isDefault: a.id === addressId }))
      );
      showAlert('success', 'Default Updated', 'Default delivery address has been changed.');
    } catch (err) {
      showAlert('error', 'Failed', err.message || 'Could not update default address.');
    } finally {
      setDefaultLoading(null);
    }
  };

  // ── Dismiss panels on tab blur ────────────────────────────────────────────────
  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', cancelForm);
    return unsubscribe;
  }, [navigation]);

  // ─────────────────────────────────────────────────────────────────────────────

  if (pageLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.saffron} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ── Header — identical to original ── */}
      <LinearGradient colors={['#0F1822', '#1C2437']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>{'← Back'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Delivery Address 📍</Text>
        <Text style={styles.headerSub}>{addresses.length} saved address(es)</Text>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
      >
        {/* ── Address Cards ── */}
        {addresses.map((addr) => (
          <View
            key={addr.id}
            style={[styles.addrCard, addr.isDefault && styles.addrCardActive]}
          >
            <TouchableOpacity
              style={styles.addrMain}
              onPress={() => handleSetDefault(addr.id)}
              disabled={!!defaultLoading || !!deleteLoading}
            >
              {defaultLoading === addr.id ? (
                <ActivityIndicator size="small" color={COLORS.saffron} style={{ width: 20 }} />
              ) : (
                <View style={[styles.radio, addr.isDefault && styles.radioActive]} />
              )}

              <View style={styles.addrBody}>
                <View style={styles.addrLabelRow}>
                  <View style={styles.labelBadge}>
                    <Text style={styles.labelBadgeText}>{addr.addressType}</Text>
                  </View>
                  {addr.isDefault && <Text style={styles.defaultTag}>Default</Text>}
                </View>

                <Text style={styles.addrName}>{addr.fullName}</Text>
                <Text style={styles.addrLine}>{addr.addressLine}</Text>
                {addr.landmark ? (
                  <Text style={styles.addrMeta}>Near: {addr.landmark}</Text>
                ) : null}
                <Text style={styles.addrMeta}>
                  {addr.city}, {addr.state} – {addr.pincode}
                </Text>
                <Text style={styles.addrMeta}>📱 {addr.phoneNumber}</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.addrActions}>
              <TouchableOpacity
                onPress={() => openEditForm(addr)}
                style={styles.editActionBtn}
                disabled={!!saveLoading || !!deleteLoading}
              >
                <Text style={styles.editActionText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => confirmDelete(addr)}
                disabled={!!deleteLoading}
              >
                {deleteLoading === addr.id ? (
                  <ActivityIndicator size="small" color={COLORS.bengalRed} />
                ) : (
                  <Text style={styles.removeText}>Remove</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* ── Add / Edit Form ── */}
        {showForm ? (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>
              {editingId ? '✏️ Edit Address' : '➕ Add New Address'}
            </Text>

            <FormField
              label="Full Name *"
              value={form.fullName}
              onChangeText={(v) => setField('fullName', v)}
              placeholder="Recipient's full name"
              error={errors.fullName}
              autoCapitalize="words"
            />

            <FormField
              label="Phone Number *"
              value={form.phoneNumber}
              onChangeText={(v) => setField('phoneNumber', v.replace(/\D/g, '').slice(0, 10))}
              placeholder="10-digit mobile number"
              error={errors.phoneNumber}
              keyboardType="number-pad"
              maxLength={10}
            />

            <FormField
              label="Address Line *"
              value={form.addressLine}
              onChangeText={(v) => setField('addressLine', v)}
              placeholder="House/Flat no., Street, Area"
              error={errors.addressLine}
              multiline
              numberOfLines={2}
              inputStyle={styles.multilineInput}
            />

            <FormField
              label="Landmark (Optional)"
              value={form.landmark}
              onChangeText={(v) => setField('landmark', v)}
              placeholder="Near temple, school, etc."
              error={errors.landmark}
            />

            <View style={styles.rowFields}>
              <View style={{ flex: 1 }}>
                <FormField
                  label="City *"
                  value={form.city}
                  onChangeText={(v) => setField('city', v)}
                  placeholder="City"
                  error={errors.city}
                  autoCapitalize="words"
                />
              </View>
              <View style={{ flex: 1 }}>
                <FormField
                  label="Pincode *"
                  value={form.pincode}
                  onChangeText={(v) => setField('pincode', v.replace(/\D/g, '').slice(0, 6))}
                  placeholder="6-digit PIN"
                  error={errors.pincode}
                  keyboardType="number-pad"
                  maxLength={6}
                />
              </View>
            </View>

            <FormField
              label="State *"
              value={form.state}
              onChangeText={(v) => setField('state', v)}
              placeholder="State"
              error={errors.state}
              autoCapitalize="words"
            />

            {/* Address Type Selector */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Address Type *</Text>
              <View style={styles.typeRow}>
                {ADDRESS_TYPES.map((t) => (
                  <TouchableOpacity
                    key={t}
                    onPress={() => setField('addressType', t)}
                    style={[styles.typeBtn, form.addressType === t && styles.typeBtnActive]}
                  >
                    <Text
                      style={[styles.typeBtnText, form.addressType === t && styles.typeBtnTextActive]}
                    >
                      {t === 'Home' ? '🏠' : t === 'Office' ? '🏢' : '📌'} {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.addressType ? (
                <Text style={styles.errorText}>{errors.addressType}</Text>
              ) : null}
            </View>

            <View style={styles.formBtns}>
              <TouchableOpacity onPress={cancelForm} style={styles.cancelBtn}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSave}
                style={[styles.saveBtn, saveLoading && styles.saveBtnDisabled]}
                disabled={saveLoading}
              >
                {saveLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.saveBtnText}>
                    {editingId ? '💾 Update' : '💾 Save Address'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity onPress={openAddForm} style={styles.addBtn}>
            <Text style={styles.addBtnText}>+ Add New Address</Text>
          </TouchableOpacity>
        )}

        {/* ── Info Box — identical to original ── */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>📦 Delivery Info</Text>
          <Text style={styles.infoText}>
            {'• Free delivery on orders above ₹500\n• Standard delivery: 5–7 business days\n• Dispatched from Sandeshkhali Warehouse, N24PGS'}
          </Text>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* ── Themed Alert Modal ── */}
      <AppAlert
        visible={alertState.visible}
        type={alertState.type}
        title={alertState.title}
        message={alertState.message}
        confirmLabel={alertState.confirmLabel}
        onConfirm={alertState.onConfirm}
        onClose={hideAlert}
      />
    </View>
  );
}

// ─── Small internal field component ──────────────────────────────────────────
function FormField({ label, value, onChangeText, placeholder, error, inputStyle, ...rest }) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.input, error && styles.inputError, inputStyle]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        {...rest}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
// Core card/header/scroll styles are identical to original.
// New styles are appended at the bottom.
const styles = StyleSheet.create({
  container: { flex: 1, minHeight: 0, backgroundColor: COLORS.dark },
  header: { paddingTop: 52, paddingHorizontal: 20, paddingBottom: 24 },
  backBtn: { marginBottom: 16 },
  backText: { fontSize: 14, color: 'rgba(200,208,228,0.7)', fontWeight: '600' },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#fff' },
  headerSub: { fontSize: 13, color: 'rgba(200,208,228,0.5)', marginTop: 4 },

  scroll: {
    flex: 1, minHeight: 0,
    ...(Platform.OS === 'web' ? { overflow: 'auto', WebkitOverflowScrolling: 'touch' } : {}),
  },
  scrollContent: {
    padding: 16,
    paddingBottom: Platform.OS === 'web' ? 40 : 30,
    flexGrow: 1,
  },

  // ── Address card — identical to original ──
  addrCard: {
    backgroundColor: COLORS.darkCard, borderRadius: 18, padding: 16,
    marginBottom: 12, borderWidth: 1.5, borderColor: COLORS.darkBorder, ...SHADOWS.small,
  },
  addrCardActive: { borderColor: COLORS.saffron, backgroundColor: COLORS.saffron + '06' },
  addrMain: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: COLORS.textMuted, marginTop: 2, flexShrink: 0 },
  radioActive: { borderColor: COLORS.saffron, backgroundColor: COLORS.saffron },
  addrBody: { flex: 1 },
  addrLabelRow: { flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 6 },
  labelBadge: { backgroundColor: COLORS.saffron + '20', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 3 },
  labelBadgeText: { fontSize: 11, fontWeight: '700', color: COLORS.saffron },
  defaultTag: { fontSize: 11, color: COLORS.success, fontWeight: '600' },
  addrName: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 2 },
  addrLine: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 20 },
  addrMeta: { fontSize: 12, color: COLORS.textMuted, marginTop: 2, lineHeight: 18 },
  addrActions: {
    flexDirection: 'row', justifyContent: 'flex-end', gap: 16,
    marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderColor: COLORS.darkBorder,
  },
  editActionBtn: {},
  editActionText: { fontSize: 13, color: COLORS.primary || COLORS.gold, fontWeight: '600' },
  removeText: { fontSize: 13, color: COLORS.bengalRed, fontWeight: '600' },

  // ── Form card ──
  formCard: {
    backgroundColor: COLORS.darkCard, borderRadius: 18, padding: 20,
    marginBottom: 12, ...SHADOWS.small,
  },
  formTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 16 },

  fieldGroup: { marginBottom: 12 },
  fieldLabel: { fontSize: 12, color: 'rgba(200,208,228,0.65)', marginBottom: 6, fontWeight: '600' },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(200,208,228,0.15)',
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11,
    fontSize: 14, color: COLORS.textPrimary,
  },
  inputError: { borderColor: COLORS.bengalRed },
  multilineInput: { height: 70, textAlignVertical: 'top', paddingTop: 10 },
  errorText: { fontSize: 11, color: COLORS.bengalRed, marginTop: 4 },

  rowFields: { flexDirection: 'row', gap: 12 },

  // Address type selector
  typeRow: { flexDirection: 'row', gap: 8, marginTop: 2 },
  typeBtn: {
    flex: 1, paddingVertical: 9, borderRadius: 12,
    borderWidth: 1.5, borderColor: 'rgba(200,208,228,0.15)',
    alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.03)',
  },
  typeBtnActive: { borderColor: COLORS.saffron, backgroundColor: COLORS.saffron + '15' },
  typeBtnText: { fontSize: 12, color: 'rgba(200,208,228,0.6)', fontWeight: '600' },
  typeBtnTextActive: { color: COLORS.saffron },

  // ── Form buttons ──
  formBtns: { flexDirection: 'row', gap: 12, marginTop: 8 },
  cancelBtn: {
    flex: 1, paddingVertical: 12, borderRadius: 50,
    borderWidth: 1.5, borderColor: COLORS.darkBorder, alignItems: 'center',
  },
  cancelBtnText: { fontSize: 14, color: COLORS.textMuted, fontWeight: '600' },
  saveBtn: {
    flex: 2, paddingVertical: 12, borderRadius: 50,
    backgroundColor: COLORS.saffron, alignItems: 'center',
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { fontSize: 14, color: '#fff', fontWeight: '700' },

  // ── Add button — identical to original ──
  addBtn: {
    borderWidth: 1.5, borderColor: COLORS.saffron, borderStyle: 'dashed',
    borderRadius: 18, paddingVertical: 16, alignItems: 'center', marginBottom: 16,
  },
  addBtnText: { fontSize: 14, color: COLORS.saffron, fontWeight: '600' },

  // ── Info box — identical to original ──
  infoBox: {
    backgroundColor: COLORS.green + '15', borderRadius: 18, padding: 18,
    borderWidth: 1, borderColor: (COLORS.greenLight || COLORS.green) + '30',
  },
  infoTitle: { fontSize: 14, fontWeight: '700', color: COLORS.green, marginBottom: 10 },
  infoText: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 22 },
});