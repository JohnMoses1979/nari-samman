// ─── components/AppAlert.js ───────────────────────────────────────────────────
//
// Themed in-app alert modal — matches the existing dark/gold design language.
// Drop-in replacement for React Native's Alert.alert and browser alert().
//
// Usage:
//   <AppAlert
//     visible={alertState.visible}
//     type="success" | "error" | "info" | "warning" | "confirm"
//     title="Address saved"
//     message="Your address has been saved successfully."
//     onClose={() => setAlertState({ visible: false })}
//     // Optional — only for type="confirm":
//     confirmLabel="Delete"
//     onConfirm={handleDelete}
//   />
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useRef } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Animated,
    Dimensions,
} from 'react-native';
import { COLORS, SHADOWS } from '../theme/colors';
import Text from '../autoTranslation/AutoText';

const { width } = Dimensions.get('window');

const ALERT_CONFIG = {
    success: { emoji: '✅', accentColor: COLORS.success || '#28a745', label: 'Success' },
    error: { emoji: '❌', accentColor: COLORS.bengalRed || '#dc3545', label: 'Error' },
    warning: { emoji: '⚠️', accentColor: '#f0a500', label: 'Warning' },
    info: { emoji: 'ℹ️', accentColor: COLORS.primary || '#D7A94B', label: 'Info' },
    confirm: { emoji: '🗑️', accentColor: COLORS.bengalRed || '#dc3545', label: 'Confirm' },
};

export default function AppAlert({
    visible,
    type = 'info',
    title,
    message,
    onClose,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    onConfirm,
}) {
    const scaleAnim = useRef(new Animated.Value(0.85)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 80, friction: 8 }),
                Animated.timing(opacityAnim, { toValue: 1, duration: 180, useNativeDriver: true }),
            ]).start();
        } else {
            scaleAnim.setValue(0.85);
            opacityAnim.setValue(0);
        }
    }, [visible]);

    const cfg = ALERT_CONFIG[type] || ALERT_CONFIG.info;

    return (
        <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <Animated.View
                    style={[styles.box, { transform: [{ scale: scaleAnim }], opacity: opacityAnim }]}
                >
                    {/* Accent bar */}
                    <View style={[styles.accentBar, { backgroundColor: cfg.accentColor }]} />

                    <Text style={styles.emoji}>{cfg.emoji}</Text>
                    <Text style={styles.title}>{title || cfg.label}</Text>
                    {message ? <Text style={styles.message}>{message}</Text> : null}

                    {type === 'confirm' ? (
                        <View style={styles.btnRow}>
                            <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
                                <Text style={styles.cancelBtnText}>{cancelLabel}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => { onConfirm?.(); onClose?.(); }}
                                style={[styles.confirmBtn, { backgroundColor: cfg.accentColor }]}
                            >
                                <Text style={styles.confirmBtnText}>{confirmLabel}</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity
                            onPress={onClose}
                            style={[styles.okBtn, {
                                backgroundColor: cfg.accentColor + '20',
                                borderColor: cfg.accentColor + '60'
                            }]}
                        >
                            <Text style={[styles.okBtnText, { color: cfg.accentColor }]}>OK</Text>
                        </TouchableOpacity>
                    )}
                </Animated.View>
            </View>
        </Modal>
    );
}

// ─── Helper hook — keeps alert state in one object ───────────────────────────
export function useAppAlert() {
    const [alertState, setAlertState] = React.useState({
        visible: false, type: 'info', title: '', message: '',
        confirmLabel: 'Confirm', onConfirm: null,
    });

    const showAlert = (type, title, message) =>
        setAlertState({ visible: true, type, title, message, onConfirm: null });

    const showConfirm = (title, message, onConfirm, confirmLabel = 'Delete') =>
        setAlertState({ visible: true, type: 'confirm', title, message, onConfirm, confirmLabel });

    const hideAlert = () => setAlertState((s) => ({ ...s, visible: false }));

    return { alertState, showAlert, showConfirm, hideAlert };
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    box: {
        width: Math.min(width - 48, 340),
        backgroundColor: '#1C2437',
        borderRadius: 24,
        paddingHorizontal: 24,
        paddingBottom: 24,
        paddingTop: 0,
        alignItems: 'center',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(200,208,228,0.1)',
        ...SHADOWS?.large,
    },
    accentBar: {
        width: '100%',
        height: 4,
        borderRadius: 2,
        marginBottom: 20,
    },
    emoji: { fontSize: 40, marginBottom: 12 },
    title: {
        fontSize: 18,
        fontWeight: '800',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 8,
    },
    message: {
        fontSize: 14,
        color: 'rgba(200,208,228,0.7)',
        textAlign: 'center',
        lineHeight: 21,
        marginBottom: 20,
    },
    okBtn: {
        paddingHorizontal: 32,
        paddingVertical: 11,
        borderRadius: 14,
        borderWidth: 1,
        marginTop: 4,
    },
    okBtnText: { fontSize: 14, fontWeight: '700' },
    btnRow: { flexDirection: 'row', gap: 12, width: '100%', marginTop: 4 },
    cancelBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: 'rgba(200,208,228,0.2)',
        alignItems: 'center',
    },
    cancelBtnText: { fontSize: 14, fontWeight: '600', color: 'rgba(200,208,228,0.7)' },
    confirmBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 14,
        alignItems: 'center',
    },
    confirmBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});