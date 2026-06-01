// ─── storage/authStorage.js ───────────────────────────────────────────────────
//
// Thin wrapper around AsyncStorage for auth data.
// Install dependency: npx expo install @react-native-async-storage/async-storage
// ─────────────────────────────────────────────────────────────────────────────

import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'consumer_jwt_token';
const ID_KEY = 'consumer_id';

// ─── Token ────────────────────────────────────────────────────────────────────

export async function saveToken(token) {
    await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function getToken() {
    return AsyncStorage.getItem(TOKEN_KEY);
}

export async function removeToken() {
    await AsyncStorage.removeItem(TOKEN_KEY);
}

// ─── Consumer ID ──────────────────────────────────────────────────────────────

export async function saveConsumerId(id) {
    await AsyncStorage.setItem(ID_KEY, String(id));
}

export async function getConsumerId() {
    const val = await AsyncStorage.getItem(ID_KEY);
    return val ? Number(val) : null;
}

export async function removeConsumerId() {
    await AsyncStorage.removeItem(ID_KEY);
}

// ─── Clear everything on logout ───────────────────────────────────────────────

export async function clearAuthData() {
    await AsyncStorage.multiRemove([TOKEN_KEY, ID_KEY]);
}

// ─── Vendor Auth (separate keys — consumer keys untouched) ───────────────────

const VENDOR_TOKEN_KEY = 'vendor_jwt_token';
const VENDOR_ID_KEY = 'vendor_id';

export async function saveVendorToken(token) {
    await AsyncStorage.setItem(VENDOR_TOKEN_KEY, token);
}

export async function getVendorToken() {
    return AsyncStorage.getItem(VENDOR_TOKEN_KEY);
}

export async function saveVendorId(id) {
    await AsyncStorage.setItem(VENDOR_ID_KEY, String(id));
}

export async function getVendorId() {
    const val = await AsyncStorage.getItem(VENDOR_ID_KEY);
    return val ? Number(val) : null;
}

export async function clearVendorAuthData() {
    await AsyncStorage.multiRemove([VENDOR_TOKEN_KEY, VENDOR_ID_KEY]);
}

// ─── Admin Auth (separate keys) ───────────────────────────────────────────────

const ADMIN_TOKEN_KEY = 'admin_jwt_token';
const ADMIN_EMAIL_KEY = 'admin_email';

export async function saveAdminToken(token) {
    await AsyncStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export async function getAdminToken() {
    return AsyncStorage.getItem(ADMIN_TOKEN_KEY);
}

export async function saveAdminEmail(email) {
    await AsyncStorage.setItem(ADMIN_EMAIL_KEY, String(email || ''));
}

export async function getAdminEmail() {
    return AsyncStorage.getItem(ADMIN_EMAIL_KEY);
}

export async function clearAdminAuthData() {
    await AsyncStorage.multiRemove([ADMIN_TOKEN_KEY, ADMIN_EMAIL_KEY]);
}
