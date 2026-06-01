import React, { useState } from 'react';
import {
  View, StyleSheet, ScrollView, TouchableOpacity,
  Switch, Alert, Platform } from
'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../../theme/colors';
import useStore from '../../store/useStore';
import ResetPasswordPanel from '../../components/ResetPasswordPanel';
import { resetToScreen } from '../../navigation/NavigationService';import Text from "../../autoTranslation/AutoText";import TextInput from "../../autoTranslation/AutoTextInput";import useAppLanguage from "../../autoTranslation/useAppLanguage";


export default function AdminSettingsScreen({ navigation }) {
  const { logout, adminProfile, updateAdminProfile } = useStore();const lang = useAppLanguage();

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: adminProfile?.name || 'Devanjan Bose',
    role: adminProfile?.role || 'Founder Sewak / Admin',
    organisation: adminProfile?.organisation || 'IS&SF',
    phone: adminProfile?.phone || '+91 98765 00000',
    email: adminProfile?.email || 'admin@narisamman.in',
    warehouse: adminProfile?.warehouse || 'Sandeshkhali, N24PGS'
  });
  const [errors, setErrors] = useState({});
  const [showResetPassword, setShowResetPassword] = useState(false);

  const [settings, setSettings] = useState({
    autoApprove: false,
    emailAlerts: true,
    smsAlerts: true,
    weeklyReport: true,
    maintenanceMode: false,
    newVendorNotif: true,
    orderAlerts: true
  });

  const toggle = (key) => setSettings((s) => ({ ...s, [key]: !s[key] }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';else
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    updateAdminProfile({
      name: form.name.trim(),
      role: form.role.trim(),
      organisation: form.organisation.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      warehouse: form.warehouse.trim()
    });
    setEditMode(false);
  };

  const handleCancel = () => {
    const p = adminProfile || {};
    setForm({
      name: p.name || 'Devanjan Bose',
      role: p.role || 'Founder Sewak / Admin',
      organisation: p.organisation || 'IS&SF',
      phone: p.phone || '+91 98765 00000',
      email: p.email || 'admin@narisamman.in',
      warehouse: p.warehouse || 'Sandeshkhali, N24PGS'
    });
    setErrors({});
    setEditMode(false);
  };

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      logout();resetToScreen('RoleSelect');
    } else {
      Alert.alert('Logout Admin', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => {logout();resetToScreen('RoleSelect');} }]
      );
    }
  };

  const SETTING_GROUPS = [
  {
    title: '🤖 Automation',
    items: [
    { key: 'autoApprove', label: 'Auto-Approve Verified Vendors', sub: 'Skip manual review for KYC-verified SHGs' },
    { key: 'maintenanceMode', label: 'Maintenance Mode', sub: 'Temporarily disable consumer access' }]

  },
  {
    title: '🔔 Notifications',
    items: [
    { key: 'emailAlerts', label: 'Email Alerts', sub: 'Receive admin alerts via email' },
    { key: 'smsAlerts', label: 'SMS Alerts', sub: 'Receive critical alerts via SMS' },
    { key: 'newVendorNotif', label: 'New Vendor Registration', sub: 'Alert when new SHG registers' },
    { key: 'orderAlerts', label: 'High-Value Order Alerts', sub: 'Alert for orders above ₹5,000' }]

  },
  {
    title: '📊 Reports',
    items: [
    { key: 'weeklyReport', label: 'Weekly Report Email', sub: 'Auto-send summary every Monday' }]

  }];


  const QUICK_LINKS = [
  { emoji: '🌐', label: "Select Language", onPress: () => navigation.navigate('Multilingual') },
  { emoji: '🔐', label: 'Reset Password', onPress: () => setShowResetPassword(true) },
  { emoji: '📄', label: 'Terms & Policies', onPress: () => Alert.alert('Terms', 'Nari Samman platform policies apply to all users.') },
  { emoji: '🔒', label: 'Privacy Policy', onPress: () => Alert.alert('Privacy', 'We protect data per Indian IT Act standards.') },
  { emoji: '📞', label: 'IS&SF Contact', onPress: () => Alert.alert('Contact', `Email: ${form.email}\nPhone: ${form.phone}`) },
  { emoji: '🆘', label: 'Support & Help', onPress: () => Alert.alert('Help', 'For technical support, email: tech@narisamman.in') }];


  const currentProfile = adminProfile || form;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>{"← Back"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{"Settings"}</Text>
        {!editMode ?
        <TouchableOpacity onPress={() => setEditMode(true)} style={styles.editBtn}>
            <Text style={styles.editBtnText}>✏️ {"Edit"}</Text>
          </TouchableOpacity> :

        <TouchableOpacity onPress={handleCancel} style={styles.cancelBtn}>
            <Text style={styles.cancelBtnText}>✕ {"Cancel"}</Text>
          </TouchableOpacity>
        }
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Admin Profile Card */}
        <LinearGradient colors={['#0F1822', '#1C2437']} style={styles.profileCard}>
          <View style={styles.adminAvatar}>
            <Text style={styles.adminAvatarEmoji}>🏛️</Text>
          </View>
          <Text style={styles.adminName}>{currentProfile.name || form.name}</Text>
          <Text style={styles.adminRole}>{currentProfile.role || form.role} · {currentProfile.organisation || form.organisation}</Text>
          <View style={styles.adminBadge}>
            <Text style={styles.adminBadgeText}>{"SUPER ADMIN"}</Text>
          </View>
        </LinearGradient>

        {/* Admin Info — view or edit */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{"Admin Information"}</Text>

          {editMode ?
          <View style={styles.editCard}>
              {[
            { key: 'name', label: 'Admin Name', icon: '👤', kb: 'default', cap: 'words' },
            { key: 'role', label: 'Role / Title', icon: '🏛️', kb: 'default', cap: 'words' },
            { key: 'organisation', label: 'Organisation', icon: '🏢', kb: 'default', cap: 'words' },
            { key: 'phone', label: 'Phone', icon: '📞', kb: 'phone-pad', cap: 'none' },
            { key: 'email', label: 'Email', icon: '📧', kb: 'email-address', cap: 'none' },
            { key: 'warehouse', label: 'Warehouse Location', icon: '🏭', kb: 'default', cap: 'words' }].
            map((field, i) =>
            <View key={field.key} style={[styles.editFieldRow, i > 0 && styles.fieldDivider]}>
                  <Text style={styles.editFieldIcon}>{field.icon}</Text>
                  <View style={styles.editFieldContent}>
                    <Text style={styles.editFieldLabel}>{field.label}</Text>
                    <TextInput
                  style={[styles.editInput, errors[field.key] && styles.editInputError]}
                  value={form[field.key]}
                  onChangeText={(v) => setForm((f) => ({ ...f, [field.key]: v }))}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  placeholderTextColor="rgba(200,208,228,0.3)"
                  keyboardType={field.kb}
                  autoCapitalize={field.cap} />
                
                    {errors[field.key] ? <Text style={styles.errorText}>{errors[field.key]}</Text> : null}
                  </View>
                </View>
            )}
              <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
                <Text style={styles.saveBtnText}>{"💾 Save Changes"}</Text>
              </TouchableOpacity>
            </View> :

          [
          { label: 'Admin Name', value: currentProfile.name, icon: '👤' },
          { label: 'Role', value: currentProfile.role, icon: '🏛️' },
          { label: 'Organisation', value: currentProfile.organisation, icon: '🏢' },
          { label: 'Phone', value: currentProfile.phone, icon: '📞' },
          { label: 'Email', value: currentProfile.email, icon: '📧' },
          { label: 'Portal Version', value: 'v1.0.0', icon: '⚙️' },
          { label: 'Warehouse', value: currentProfile.warehouse, icon: '🏭' }].
          map((info, i) =>
          <View key={i} style={styles.infoRow}>
                <Text style={styles.infoIcon}>{info.icon}</Text>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>{info.label}</Text>
                  <Text style={styles.infoValue}>{info.value}</Text>
                </View>
              </View>
          )
          }
        </View>

        {/* Toggle Settings */}
        {SETTING_GROUPS.map((group, gi) =>
        <View key={gi} style={styles.section}>
            <Text style={styles.sectionTitle}>{group.title}</Text>
            <View style={styles.settingsCard}>
              {group.items.map((item, i) =>
            <View key={item.key} style={[styles.settingRow, i < group.items.length - 1 && styles.settingDivider]}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>{item.label}</Text>
                    <Text style={styles.settingSub}>{item.sub}</Text>
                  </View>
                  <Switch
                value={settings[item.key]}
                onValueChange={() => toggle(item.key)}
                trackColor={{ false: COLORS.creamDark, true: COLORS.purple + '60' }}
                thumbColor={settings[item.key] ? COLORS.purple : '#ccc'} />
              
                </View>
            )}
            </View>
          </View>
        )}

        {/* Quick Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{"Quick Links"}</Text>
          <View style={styles.linksCard}>
            {QUICK_LINKS.map((link, i) =>
            <TouchableOpacity key={i} onPress={link.onPress}
            style={[styles.linkRow, i < QUICK_LINKS.length - 1 && styles.settingDivider]}>
                <Text style={styles.linkEmoji}>{link.emoji}</Text>
                <Text style={styles.linkLabel}>{link.label}</Text>
                <Text style={styles.linkArrow}>›</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {showResetPassword && (
          <ResetPasswordPanel role="admin" onClose={() => setShowResetPassword(false)} />
        )}

        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>{"🚪 Logout Admin Portal"}</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>{"Nari Samman Platform v1.0 · IS&SF Initiative · West Bengal"}</Text>
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>);

}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 52, paddingHorizontal: 16, paddingBottom: 12, backgroundColor: COLORS.darkCard, ...SHADOWS.small },
  back: { fontSize: 15, color: COLORS.purple, fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  editBtn: { backgroundColor: 'rgba(245,166,35,0.15)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1, borderColor: COLORS.gold + '50' },
  editBtnText: { fontSize: 13, color: COLORS.gold, fontWeight: '700' },
  cancelBtn: { backgroundColor: 'rgba(200,208,228,0.08)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1, borderColor: 'rgba(200,208,228,0.15)' },
  cancelBtnText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '600' },
  profileCard: { alignItems: 'center', padding: 32, paddingTop: 40 },
  adminAvatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: COLORS.gold, marginBottom: 14 },
  adminAvatarEmoji: { fontSize: 40 },
  adminName: { fontSize: 22, fontWeight: '800', color: '#fff' },
  adminRole: { fontSize: 13, color: 'rgba(200,208,228,0.6)', marginTop: 4 },
  adminBadge: { marginTop: 12, backgroundColor: COLORS.darkCard, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6 },
  adminBadgeText: { color: '#fff', fontWeight: '800', fontSize: 12, letterSpacing: 1 },
  section: { padding: 16, paddingBottom: 0 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 12 },
  infoRow: { flexDirection: 'row', gap: 12, alignItems: 'center', backgroundColor: COLORS.darkCard, borderRadius: 14, padding: 14, marginBottom: 8, ...SHADOWS.small },
  infoIcon: { fontSize: 22 },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 11, color: COLORS.textMuted },
  infoValue: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary, marginTop: 2 },
  editCard: { backgroundColor: COLORS.darkCard, borderRadius: 20, overflow: 'hidden', ...SHADOWS.small, padding: 4 },
  editFieldRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 12 },
  fieldDivider: { borderTopWidth: 1, borderTopColor: COLORS.darkBorder },
  editFieldIcon: { fontSize: 20, marginTop: 22 },
  editFieldContent: { flex: 1 },
  editFieldLabel: { fontSize: 11, color: COLORS.textMuted, marginBottom: 5 },
  editInput: { backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(200,208,228,0.15)', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, fontSize: 14, color: COLORS.textPrimary },
  editInputError: { borderColor: COLORS.bengalRed },
  errorText: { fontSize: 11, color: COLORS.bengalRed, marginTop: 3 },
  saveBtn: { margin: 12, marginTop: 8, backgroundColor: COLORS.purple, borderRadius: 14, paddingVertical: 12, alignItems: 'center' },
  saveBtnText: { fontSize: 14, fontWeight: '800', color: '#fff' },
  settingsCard: { backgroundColor: COLORS.darkCard, borderRadius: 20, ...SHADOWS.small, overflow: 'hidden' },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  settingDivider: { borderBottomWidth: 1, borderBottomColor: COLORS.creamDark },
  settingInfo: { flex: 1, paddingRight: 12 },
  settingLabel: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  settingSub: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  linksCard: { backgroundColor: COLORS.darkCard, borderRadius: 20, ...SHADOWS.small, overflow: 'hidden' },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16, paddingVertical: 14 },
  linkEmoji: { fontSize: 20 },
  linkLabel: { flex: 1, fontSize: 14, fontWeight: '500', color: COLORS.textPrimary },
  linkArrow: { fontSize: 20, color: COLORS.textMuted },
  logoutBtn: { margin: 16, marginTop: 20, backgroundColor: COLORS.bengalRed + '15', borderRadius: 20, borderWidth: 1.5, borderColor: COLORS.bengalRed + '50', paddingVertical: 16, alignItems: 'center' },
  logoutText: { fontSize: 16, fontWeight: '700', color: COLORS.bengalRed },
  footer: { textAlign: 'center', fontSize: 11, color: COLORS.textMuted, paddingHorizontal: 16, paddingBottom: 4 }
});