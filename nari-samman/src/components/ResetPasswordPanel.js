import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../theme/colors';
import useStore from '../store/useStore';
import Text from '../autoTranslation/AutoText';
import TextInput from '../autoTranslation/AutoTextInput';

function normalizeRole(role) {
  return role === 'shg' ? 'vendor' : role || 'consumer';
}

export default function ResetPasswordPanel({ role = 'consumer', onClose }) {
  const changePassword = useStore((s) => s.changePassword);
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  const setField = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: null, general: null }));
    setSuccess('');
  };

  const handleReset = () => {
    const e = {};
    if (!form.current || form.current.length < 6) e.current = 'Enter current password';
    if (!form.next || form.next.length < 6) e.next = 'New password must be at least 6 characters';
    if (form.next !== form.confirm) e.confirm = 'Confirm password does not match';
    if (form.current && form.next && form.current === form.next) e.next = 'New password must be different from current password';

    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }

    const result = changePassword(normalizeRole(role), form.current, form.next);
    if (!result?.success) {
      setErrors({ current: result?.message || 'Current password is incorrect' });
      return;
    }

    setForm({ current: '', next: '', confirm: '' });
    setErrors({});
    setSuccess('Password reset successfully');
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>🔐 Reset Password</Text>
          <Text style={styles.sub}>Enter current password, then set a new password.</Text>
        </View>
        {onClose ? (
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <TextInput
        style={[styles.input, errors.current && styles.inputError]}
        placeholder="Current password"
        placeholderTextColor={COLORS.textMuted}
        value={form.current}
        onChangeText={(v) => setField('current', v)}
        secureTextEntry
        autoCapitalize="none"
      />
      {errors.current ? <Text style={styles.errorText}>{errors.current}</Text> : null}

      <TextInput
        style={[styles.input, errors.next && styles.inputError]}
        placeholder="New password"
        placeholderTextColor={COLORS.textMuted}
        value={form.next}
        onChangeText={(v) => setField('next', v)}
        secureTextEntry
        autoCapitalize="none"
      />
      {errors.next ? <Text style={styles.errorText}>{errors.next}</Text> : null}

      <TextInput
        style={[styles.input, errors.confirm && styles.inputError]}
        placeholder="Confirm new password"
        placeholderTextColor={COLORS.textMuted}
        value={form.confirm}
        onChangeText={(v) => setField('confirm', v)}
        secureTextEntry
        autoCapitalize="none"
      />
      {errors.confirm ? <Text style={styles.errorText}>{errors.confirm}</Text> : null}

      {success ? <Text style={styles.successText}>✅ {success}</Text> : null}

      <TouchableOpacity onPress={handleReset} activeOpacity={0.88} style={styles.submitWrap}>
        <LinearGradient colors={[COLORS.saffron, COLORS.gold]} style={styles.submitBtn}>
          <Text style={styles.submitText}>Reset Password</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 14,
    backgroundColor: COLORS.darkCard,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.darkBorder,
    ...SHADOWS.small,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 14 },
  title: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary },
  sub: { fontSize: 12, color: COLORS.textMuted, marginTop: 4, lineHeight: 18 },
  closeBtn: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.06)' },
  closeText: { color: COLORS.textMuted, fontWeight: '800' },
  input: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1.2,
    borderColor: 'rgba(200,208,228,0.14)',
    borderRadius: 13,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: COLORS.textPrimary,
    fontSize: 14,
    marginTop: 10,
  },
  inputError: { borderColor: COLORS.error || COLORS.bengalRed },
  errorText: { color: COLORS.error || COLORS.bengalRed, fontSize: 11, marginTop: 5 },
  successText: { color: COLORS.success, fontSize: 12, fontWeight: '800', marginTop: 12 },
  submitWrap: { marginTop: 14, borderRadius: 14, overflow: 'hidden' },
  submitBtn: { paddingVertical: 14, alignItems: 'center', borderRadius: 14 },
  submitText: { color: '#fff', fontSize: 14, fontWeight: '800' },
});
