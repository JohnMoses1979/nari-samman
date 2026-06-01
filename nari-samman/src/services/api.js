// ─── services/api.js ─────────────────────────────────────────────────────────
//
// Single source of truth for all backend API calls.
// Change BASE_URL here when deploying — nowhere else.
//
// For Expo Go on a physical device: replace with your machine's LAN IP.
//   e.g. 'http://192.168.1.42:8080'
// For Android Emulator: 'http://10.0.2.2:8080'
// For iOS Simulator:    'http://localhost:8080'
// ─────────────────────────────────────────────────────────────────────────────











import { getToken, getVendorToken, getAdminToken } from '../storage/authStorage';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// ─── Dynamic BASE_URL ─────────────────────────────────────────────────────────
//
// Priority order:
//   1. EXPO_PUBLIC_API_URL env var  → always wins (CI / staging / production)
//   2. Web browser                  → localhost (same machine as backend)
//   3. Android Emulator             → 10.0.2.2 (emulator's alias for host)
//   4. iOS Simulator                → localhost
//   5. Physical device (Expo Go)    → LAN IP read from Expo's manifest
//      If manifest IP is unavailable, falls back to FALLBACK_LAN_IP below.
//
// ── For physical device testing ──────────────────────────────────────────────
// Set EXPO_PUBLIC_API_URL in a .env file at your project root:
//   EXPO_PUBLIC_API_URL=http://192.168.1.42:8080
// OR edit FALLBACK_LAN_IP below with your machine's LAN IP.
// ─────────────────────────────────────────────────────────────────────────────

const PORT = '8080';
// Optional fallback if Expo doesn't provide a LAN host (rare).
// Prefer setting EXPO_PUBLIC_API_URL in a project-root .env instead.
const FALLBACK_LAN_IP = '192.168.10.33'; // set to your laptop/PC LAN IP

const REQUEST_TIMEOUT_MS = 15000;

function getExpoHost() {
    // Expo SDK 54+ provides different fields depending on Expo Go / dev client / web.
    // We try the most reliable options first.
    return (
        Constants.expoGoConfig?.debuggerHost ||
        Constants.expoConfig?.hostUri ||
        Constants.manifest?.debuggerHost ||
        Constants.manifest2?.debuggerHost ||
        ''
    );
}

function isPrivateIpv4(host) {
    // Returns true only for RFC1918 private IPv4 ranges:
    // 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16
    const m = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(host || '');
    if (!m) return false;
    const a = Number(m[1]);
    const b = Number(m[2]);
    const c = Number(m[3]);
    const d = Number(m[4]);
    if ([a, b, c, d].some((n) => Number.isNaN(n) || n < 0 || n > 255)) return false;
    if (a === 10) return true;
    if (a === 192 && b === 168) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    return false;
}

function resolveBaseUrl() {
    const envUrl =
        process.env.EXPO_PUBLIC_API_URL ||
        process.env.EXPO_PUBLIC_API_BASE_URL ||
        Constants.expoConfig?.extra?.apiUrl ||
        Constants.expoConfig?.extra?.apiBaseUrl ||
        Constants.manifest?.extra?.apiUrl ||
        Constants.manifest?.extra?.apiBaseUrl ||
        '';

    // 1. Explicit env/config var (highest priority — works for all device types)
    if (envUrl) {
        return envUrl;
    }

    // 2. Web browser
    if (Platform.OS === 'web') {
        return `http://localhost:${PORT}`;
    }

    // 3. Android Emulator
    if (Platform.OS === 'android') {
        // __DEV__ is true for emulator AND physical device.
        // We distinguish them by checking if the Expo host is a LAN IP.
        const expoHost = getExpoHost();
        const hostIp = expoHost.split(':')[0];

        // Emulator's debuggerHost is typically "10.0.2.2" or "localhost"
        const isEmulator =
            !hostIp ||
            hostIp === 'localhost' ||
            hostIp === '127.0.0.1' ||
            hostIp.startsWith('10.0.2');

        if (isEmulator) {
            return `http://10.0.2.2:${PORT}`;
        }

        // Physical Android device — use the same LAN IP Expo is running on
        // If Expo is running in "Tunnel" mode, hostIp will look like "*.exp.direct"
        // which is NOT your laptop IP, so don't use it for backend calls.
        if (isPrivateIpv4(hostIp)) {
            return `http://${hostIp}:${PORT}`;
        }

        if (FALLBACK_LAN_IP) {
            return `http://${FALLBACK_LAN_IP}:${PORT}`;
        }

        if (__DEV__) {
            console.warn(
                `[api] Could not determine LAN IP from Expo host (${expoHost}). Set EXPO_PUBLIC_API_URL to your laptop LAN IP, e.g. http://192.168.x.x:8080`
            );
        }
        return `http://localhost:${PORT}`;
    }

    // 4. iOS — simulator or physical device
    if (Platform.OS === 'ios') {
        const expoHost = getExpoHost();
        const hostIp = expoHost.split(':')[0];

        const isSimulator =
            !hostIp ||
            hostIp === 'localhost' ||
            hostIp === '127.0.0.1';

        if (isSimulator) {
            return `http://localhost:${PORT}`;
        }

        // Physical iOS device
        // Tunnel hostnames (e.g. *.exp.direct) are not your laptop IP; use LAN IP instead.
        if (isPrivateIpv4(hostIp)) {
            return `http://${hostIp}:${PORT}`;
        }

        if (FALLBACK_LAN_IP) {
            return `http://${FALLBACK_LAN_IP}:${PORT}`;
        }

        if (__DEV__) {
            console.warn(
                `[api] Could not determine LAN IP from Expo host (${expoHost}). Set EXPO_PUBLIC_API_URL to your laptop LAN IP, e.g. http://192.168.x.x:8080`
            );
        }
        return `http://localhost:${PORT}`;
    }

    // 5. Unknown — safest fallback
    return `http://localhost:${PORT}`;
}

// ─── ADD THIS immediately after: export const BASE_URL = resolveBaseUrl();
// ─────────────────────────────────────────────────────────────────────────────
// buildImageUrl — converts a relative image path from the API into a full URL.
//
// Backend returns:  "/api/product-images/7/img_abc12345.jpg"
// This returns:     "http://192.168.10.33:8080/api/product-images/7/img_abc12345.jpg"
//
// Works on:
//   • Web browser (laptop)        — BASE_URL = http://localhost:8080
//   • Android physical (Expo Go)  — BASE_URL = http://192.168.10.33:8080
//   • Android emulator            — BASE_URL = http://10.0.2.2:8080
//   • iOS simulator               — BASE_URL = http://localhost:8080
//   • Production                  — BASE_URL = https://api.yourdomain.com
//
// If the backend ever returns an already-absolute URL (starts with http),
// it is returned as-is so nothing breaks during migration.
// ─────────────────────────────────────────────────────────────────────────────
export function buildImageUrl(path) {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://')) {
        // Already absolute — strip the host portion and rebuild with current BASE_URL.
        // This handles the old localhost URLs already stored or cached.
        try {
            const parsed = new URL(path);
            return BASE_URL + parsed.pathname;
        } catch {
            return path; // malformed — pass through unchanged
        }
    }
    // Relative path — prepend BASE_URL
    return BASE_URL + path;
}

export const BASE_URL = resolveBaseUrl();

// Log once in dev so you can confirm which URL is being used
if (__DEV__) {
    console.log(`[api] BASE_URL resolved to: ${BASE_URL}`);
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

async function authHeaders() {
    const token = await getToken();
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

async function authTokenOnlyHeaders() {
    const token = await getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

async function fetchWithTimeout(url, options) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        return response;
    } catch (err) {
        if (err?.name === 'AbortError') {
            throw new Error(`Request timed out. Server not reachable at ${BASE_URL}`);
        }

        const msg = String(err?.message || err);
        if (/Network request failed/i.test(msg) || /Failed to fetch/i.test(msg)) {
            throw new Error(
                `Cannot reach backend at ${BASE_URL}. Ensure: (1) phone + PC are on the same Wi‑Fi, (2) Expo connection is LAN (not Tunnel), and (3) Windows Firewall allows inbound TCP 8080. You can also set EXPO_PUBLIC_API_URL to your PC LAN IP (e.g. http://192.168.x.x:8080).`
            );
        }

        throw err;
    } finally {
        clearTimeout(timeoutId);
    }
}

async function handleResponse(response) {
    const text = await response.text();
    const data = text
        ? (() => {
            try {
                return JSON.parse(text);
            } catch {
                return { message: text };
            }
        })()
        : null;
    if (!response.ok) {
        const msg = data?.message || data?.error || `Request failed with status ${response.status}`;
        throw new Error(msg);
    }
    return data;
}

// ─── Consumer Auth ────────────────────────────────────────────────────────────

export async function registerConsumer(payload) {
    const response = await fetchWithTimeout(`${BASE_URL}/api/consumers/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    return handleResponse(response);
}

export async function loginConsumer(payload) {
    const response = await fetchWithTimeout(`${BASE_URL}/api/consumers/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    return handleResponse(response);
}

// ─── Consumer Profile (JWT protected) ─────────────────────────────────────────

export async function fetchConsumerProfile(consumerId) {
    const headers = await authHeaders();
    const response = await fetchWithTimeout(`${BASE_URL}/api/consumers/${consumerId}`, {
        method: 'GET',
        headers,
    });
    return handleResponse(response);
}

export async function updateConsumerProfile(consumerId, payload) {
    const headers = await authHeaders();
    const response = await fetchWithTimeout(`${BASE_URL}/api/consumers/${consumerId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload),
    });
    return handleResponse(response);
}

export async function deleteConsumerAccount(consumerId) {
    const headers = await authHeaders();
    const response = await fetchWithTimeout(`${BASE_URL}/api/consumers/${consumerId}`, {
        method: 'DELETE',
        headers,
    });
    return handleResponse(response);
}


// ─── OTP (Twilio Verify) ──────────────────────────────────────────────────────

export async function sendOtpToPhone(phone) {
    const response = await fetchWithTimeout(`${BASE_URL}/api/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
    });
    return handleResponse(response);
}

export async function verifyPhoneOtp(phone, code) {
    const response = await fetchWithTimeout(`${BASE_URL}/api/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code }),
    });
    return handleResponse(response);
}

// ─── Forgot Password ──────────────────────────────────────────────────────────

// Step 1: Verify phone is registered before sending OTP
// role: 'consumer' | 'vendor'
export async function checkPhoneRegistered(role, phone) {
    const endpoint = role === 'vendor'
        ? `${BASE_URL}/api/vendors/check-phone`
        : `${BASE_URL}/api/consumers/check-phone`;
    const response = await fetchWithTimeout(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
    });
    return handleResponse(response);
}

// Step 2: Reset password (called after OTP is verified by /api/otp/verify)
// role: 'consumer' | 'vendor'
export async function resetPasswordApi(role, phone, otp, newPassword) {
    const endpoint = role === 'vendor'
        ? `${BASE_URL}/api/vendors/reset-password`
        : `${BASE_URL}/api/consumers/reset-password`;
    const response = await fetchWithTimeout(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp, newPassword }),
    });
    return handleResponse(response);
}


// ─── Consumer Addresses (JWT protected) ──────────────────────────────────────

export async function fetchAddresses(consumerId) {
    const headers = await authHeaders();
    const response = await fetchWithTimeout(
        `${BASE_URL}/api/addresses/consumer/${consumerId}`, { method: 'GET', headers }
    );
    return handleResponse(response);
}

export async function addAddress(payload) {
    const headers = await authHeaders();
    const response = await fetchWithTimeout(`${BASE_URL}/api/addresses`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
    });
    return handleResponse(response);
}

export async function updateAddress(addressId, payload) {
    const headers = await authHeaders();
    const response = await fetchWithTimeout(`${BASE_URL}/api/addresses/${addressId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload),
    });
    return handleResponse(response);
}

export async function deleteAddress(addressId) {
    const headers = await authHeaders();
    const response = await fetchWithTimeout(`${BASE_URL}/api/addresses/${addressId}`, {
        method: 'DELETE',
        headers,
    });
    return handleResponse(response);
}

export async function setDefaultAddress(addressId) {
    const headers = await authHeaders();
    const response = await fetchWithTimeout(
        `${BASE_URL}/api/addresses/${addressId}/default`, { method: 'PUT', headers }
    );
    return handleResponse(response);
}


// ─── Vendor auth headers (uses vendor token, not consumer token) ──────────────
async function vendorAuthHeaders() {
    // Import inline to avoid circular deps with authStorage
    const { getVendorToken } = await import('../storage/authStorage');
    // Note: since api.js already imports getToken from authStorage at top,
    // we can just call getVendorToken directly if authStorage is already imported.
    // If your bundler complains, move getVendorToken import to the top of api.js.
    const token = await getVendorToken();
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

async function adminAuthHeaders() {
    const token = await getAdminToken();
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

// ─── Vendor Auth ──────────────────────────────────────────────────────────────

export async function registerVendor(payload) {
    const response = await fetchWithTimeout(`${BASE_URL}/api/vendors/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    return handleResponse(response);
}

export async function loginVendor(payload) {
    const response = await fetchWithTimeout(`${BASE_URL}/api/vendors/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    return handleResponse(response);
}

// ─── Vendor Profile (JWT protected) ──────────────────────────────────────────

export async function fetchVendorProfile(vendorId) {
    const headers = await vendorAuthHeaders();
    const response = await fetchWithTimeout(`${BASE_URL}/api/vendors/${vendorId}`, {
        method: 'GET',
        headers,
    });
    return handleResponse(response);
}

export async function updateVendorProfileApi(vendorId, payload) {
    const headers = await vendorAuthHeaders();
    const response = await fetchWithTimeout(`${BASE_URL}/api/vendors/${vendorId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload),
    });
    return handleResponse(response);
}




// ─── ADD THESE FUNCTIONS to your existing services/api.js ────────────────────
//
// Paste below your existing vendorAuthHeaders() and updateVendorProfileApi()
// ─────────────────────────────────────────────────────────────────────────────

// ─── Vendor KYC: Submit documents (multipart form-data) ───────────────────────
//
// Usage:
//   submitVendorKyc(vendorId, {
//     identityProof:   fileObject,   // { uri, name, type } from ImagePicker / FileReader
//     shgCertificate:  fileObject,
//     addressProof:    fileObject,   // optional
//     panRegistration: fileObject,   // optional
//     vendorNote:      'string',     // optional
//   })
//
// On React Native pass { uri, name, type } objects.
// On web pass Blob / File objects obtained from FileReader or <input type="file">.
// ─────────────────────────────────────────────────────────────────────────────

export async function submitVendorKyc(vendorId, { identityProof, shgCertificate, addressProof, panRegistration, vendorNote } = {}) {
    const token = await getVendorToken();

    const formData = new FormData();

    if (identityProof) {
        // React Native: { uri, name, type }
        // Web:          Blob / File
        formData.append('identityProof', identityProof.uri
            ? { uri: identityProof.uri, name: identityProof.name || 'identity.jpg', type: identityProof.type || 'image/jpeg' }
            : identityProof);
    }
    if (shgCertificate) {
        formData.append('shgCertificate', shgCertificate.uri
            ? { uri: shgCertificate.uri, name: shgCertificate.name || 'shg_cert.jpg', type: shgCertificate.type || 'image/jpeg' }
            : shgCertificate);
    }
    if (addressProof) {
        formData.append('addressProof', addressProof.uri
            ? { uri: addressProof.uri, name: addressProof.name || 'address.jpg', type: addressProof.type || 'image/jpeg' }
            : addressProof);
    }
    if (panRegistration) {
        formData.append('panRegistration', panRegistration.uri
            ? { uri: panRegistration.uri, name: panRegistration.name || 'pan.jpg', type: panRegistration.type || 'image/jpeg' }
            : panRegistration);
    }
    if (vendorNote) {
        formData.append('vendorNote', vendorNote);
    }

    const response = await fetchWithTimeout(`${BASE_URL}/api/vendors/${vendorId}/kyc`, {
        method: 'POST',
        headers: {
            // Do NOT set Content-Type manually — fetch sets multipart boundary automatically
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
    });
    return handleResponse(response);
}

// ─── Vendor KYC: Get own KYC status + admin note ──────────────────────────────

export async function getVendorKycStatus(vendorId) {
    const headers = await vendorAuthHeaders();
    const response = await fetchWithTimeout(`${BASE_URL}/api/vendors/${vendorId}/kyc/status`, {
        method: 'GET',
        headers,
    });
    return handleResponse(response);
}

// ─── Admin KYC: List all submissions (optionally filtered by status) ───────────
//
// status: 'PENDING' | 'APPROVED' | 'REJECTED' | undefined (all)

export async function adminGetAllKyc(status) {
    const headers = await adminAuthHeaders();
    const url = status
        ? `${BASE_URL}/api/admin/vendor-kyc?status=${status}`
        : `${BASE_URL}/api/admin/vendor-kyc`;
    const response = await fetchWithTimeout(url, { method: 'GET', headers });
    return handleResponse(response);
}

// ─── Admin KYC: Get single vendor KYC detail ─────────────────────────────────

export async function adminGetVendorKyc(vendorId) {
    const headers = await adminAuthHeaders();
    const response = await fetchWithTimeout(`${BASE_URL}/api/admin/vendor-kyc/${vendorId}`, {
        method: 'GET',
        headers,
    });
    return handleResponse(response);
}

// ─── Admin KYC: Approve ────────────────────────────────────────────────────────

export async function adminApproveKyc(vendorId, adminNote = '') {
    const headers = await adminAuthHeaders();
    const response = await fetchWithTimeout(`${BASE_URL}/api/admin/vendor-kyc/${vendorId}/approve`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ adminNote }),
    });
    return handleResponse(response);
}

// ─── Admin KYC: Reject ────────────────────────────────────────────────────────

export async function adminRejectKyc(vendorId, adminNote) {
    if (!adminNote || !adminNote.trim()) throw new Error('Rejection reason is required');
    const headers = await adminAuthHeaders();
    const response = await fetchWithTimeout(`${BASE_URL}/api/admin/vendor-kyc/${vendorId}/reject`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ adminNote }),
    });
    return handleResponse(response);
}

// ─── Admin: Login ────────────────────────────────────────────────────────────

export async function adminLogin(email, password) {
    const response = await fetchWithTimeout(`${BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
}

// ─── Admin: Vendor list ──────────────────────────────────────────────────────

export async function adminListVendors() {
    const headers = await adminAuthHeaders();
    const response = await fetchWithTimeout(`${BASE_URL}/api/admin/vendors`, {
        method: 'GET',
        headers,
    });
    return handleResponse(response);
}


// ─── Product APIs ──────────────────────────────────────────────────────────────

// ── Consumer: fetch approved products (optional category filter) ───────────────
export async function fetchApprovedProducts(category) {
    const url = category && category !== 'all'
        ? `${BASE_URL}/api/products?category=${encodeURIComponent(category)}`
        : `${BASE_URL}/api/products`;
    const response = await fetchWithTimeout(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
    return handleResponse(response);
}

// ── Consumer: fetch single product detail ─────────────────────────────────────
export async function fetchProductDetail(productId) {
    const response = await fetchWithTimeout(`${BASE_URL}/api/products/${productId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse(response);
}

// ── Vendor: create product (multipart — images + JSON data) ───────────────────
// â”€â”€ Vendor: fetch own products â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export async function fetchVendorProducts(vendorId) {
    const headers = await vendorAuthHeaders();
    const response = await fetchWithTimeout(`${BASE_URL}/api/vendors/${vendorId}/products`, {
        method: 'GET',
        headers,
    });
    return handleResponse(response);
}

export async function createVendorProduct(vendorId, productData, imageFiles) {
    const token = await getVendorToken();

    const formData = new FormData();

    // Serialize text fields as JSON string part
    formData.append('data', JSON.stringify(productData));

    // Append image files — handle both React Native and Web
    if (imageFiles && imageFiles.length > 0) {
        imageFiles.forEach((file, index) => {
            if (!file) return;

            if (Platform.OS === 'web') {
                // Web: file is a native File/Blob object
                const webFile = file.webFile || file;
                formData.append('images', webFile, webFile.name || `product_${index}.jpg`);
            } else {
                // React Native (Expo Go): must pass { uri, name, type } object
                const safeMime = (file.type && file.type.startsWith('image/'))
                    ? file.type
                    : 'image/jpeg';   // reject 'image', 'video', etc.

                formData.append('images', {
                    uri: file.uri,
                    name: file.name || `product_${index}.jpg`,
                    type: safeMime,
                });
            }
        });
    }

    // Use fetchWithTimeout for proper error handling on mobile
    const response = await fetchWithTimeout(
        `${BASE_URL}/api/vendors/${vendorId}/products`,
        {
            method: 'POST',
            headers: {
                // DO NOT set Content-Type — fetch sets multipart boundary automatically
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: formData,
        }
    );
    return handleResponse(response);
}

// ── Vendor: update product (multipart) ────────────────────────────────────────
export async function updateVendorProductApi(vendorId, productId, productData, newImageFiles, deleteImageIds) {
    const token = await getVendorToken();

    const formData = new FormData();
    formData.append('data', JSON.stringify(productData));

    if (newImageFiles && newImageFiles.length > 0) {
        newImageFiles.forEach((file, index) => {
            if (!file) return;

            if (Platform.OS === 'web') {
                const webFile = file.webFile || file;
                formData.append('images', webFile, webFile.name || `product_${index}.jpg`);
            } else {
                formData.append('images', {
                    uri: file.uri,
                    name: file.name || `product_${index}.jpg`,
                    type: file.type || 'image/jpeg',
                });
            }
        });
    }

    let url = `${BASE_URL}/api/vendors/${vendorId}/products/${productId}`;
    if (deleteImageIds && deleteImageIds.length > 0) {
        url += '?' + deleteImageIds.map((id) => `deleteImageIds=${id}`).join('&');
    }

    const response = await fetchWithTimeout(url, {
        method: 'PUT',
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
    });
    return handleResponse(response);
}

// ── Vendor: delete product ─────────────────────────────────────────────────────
export async function deleteVendorProductApi(vendorId, productId) {
    const headers = await vendorAuthHeaders();
    const response = await fetchWithTimeout(
        `${BASE_URL}/api/vendors/${vendorId}/products/${productId}`,
        { method: 'DELETE', headers }
    );
    return handleResponse(response);
}

// ── Admin: list products (optional status filter) ──────────────────────────────
export async function adminFetchProducts(status) {
    const headers = await adminAuthHeaders();
    const url = status ? `${BASE_URL}/api/admin/products?status=${status}` : `${BASE_URL}/api/admin/products`;
    const response = await fetchWithTimeout(url, { method: 'GET', headers });
    return handleResponse(response);
}

// ── Admin: approve product ─────────────────────────────────────────────────────
export async function adminApproveProductApi(productId, badge) {
    const headers = await adminAuthHeaders();
    const response = await fetchWithTimeout(`${BASE_URL}/api/admin/products/${productId}/approve`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ badge: badge || null }),
    });
    return handleResponse(response);
}

// ── Admin: reject product ──────────────────────────────────────────────────────
export async function adminRejectProductApi(productId, rejectionReason) {
    const headers = await adminAuthHeaders();
    const response = await fetchWithTimeout(`${BASE_URL}/api/admin/products/${productId}/reject`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ rejectionReason }),
    });
    return handleResponse(response);
}

// Orders: database-backed consumer, vendor, and admin flow.
export async function createOrderApi(payload) {
    const headers = await authHeaders();
    const response = await fetchWithTimeout(`${BASE_URL}/api/orders`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
    });
    return handleResponse(response);
}

export async function fetchConsumerOrdersApi(consumerId) {
    const headers = await authHeaders();
    const response = await fetchWithTimeout(`${BASE_URL}/api/orders/consumer/${consumerId}`, {
        method: 'GET',
        headers,
    });
    return handleResponse(response);
}

export async function fetchVendorOrdersApi(vendorId) {
    const headers = await vendorAuthHeaders();
    const response = await fetchWithTimeout(`${BASE_URL}/api/vendors/${vendorId}/orders`, {
        method: 'GET',
        headers,
    });
    return handleResponse(response);
}

export async function vendorPackOrderApi(vendorId, vendorOrderId) {
    const headers = await vendorAuthHeaders();
    const response = await fetchWithTimeout(`${BASE_URL}/api/vendors/${vendorId}/orders/${vendorOrderId}/pack`, {
        method: 'PUT',
        headers,
    });
    return handleResponse(response);
}

export async function vendorSendToLogisticsApi(vendorId, vendorOrderId) {
    const headers = await vendorAuthHeaders();
    const response = await fetchWithTimeout(`${BASE_URL}/api/vendors/${vendorId}/orders/${vendorOrderId}/send-to-logistics`, {
        method: 'PUT',
        headers,
    });
    return handleResponse(response);
}

export async function fetchAdminOrdersApi() {
    const headers = await adminAuthHeaders();
    const response = await fetchWithTimeout(`${BASE_URL}/api/admin/orders`, {
        method: 'GET',
        headers,
    });
    return handleResponse(response);
}

export async function fetchDispatchesApi() {
    const headers = await adminAuthHeaders();
    const response = await fetchWithTimeout(`${BASE_URL}/api/admin/dispatches`, {
        method: 'GET',
        headers,
    });
    return handleResponse(response);
}

export async function adminUpdateDispatchStatusApi(dispatchId, status) {
    const headers = await adminAuthHeaders();
    const response = await fetchWithTimeout(`${BASE_URL}/api/admin/dispatches/${dispatchId}/status`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ status }),
    });
    return handleResponse(response);
}

// ─── AI Chat ──────────────────────────────────────────────────────────────────
//
// Calls the Nari AI backend which proxies to Groq.
// The endpoint is permitAll() — no JWT required, but we attach it if present
// so future personalization (order history context) can use it server-side.
//
// @param {{ messages: Array<{role: string, content: string}> }} payload
// @returns {{ success: boolean, reply?: string, message?: string, model?: string }}
// ─────────────────────────────────────────────────────────────────────────────

export async function sendAiChatMessage(payload) {
    // Attach consumer JWT if available — endpoint works without it too.
    const headers = await authHeaders();

    const response = await fetchWithTimeout(`${BASE_URL}/api/ai/chat`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
    });

    // handleResponse throws on non-2xx — we catch and normalize here
    // so the AI screen always gets a predictable { success, reply/message } shape.
    try {
        return await handleResponse(response);
    } catch (err) {
        return {
            success: false,
            message: err.message || 'Could not reach AI service. Please try again.',
        };
    }
}

export async function transcribeAudioApi(formData) {
    const headers = await authTokenOnlyHeaders();
    const response = await fetchWithTimeout(`${BASE_URL}/api/ai/transcribe`, {
        method: 'POST',
        headers,
        body: formData,
    });

    try {
        return await handleResponse(response);
    } catch (err) {
        return {
            success: false,
            error: err.message || 'Could not transcribe voice input.',
        };
    }
}

export async function transcribeAudioBase64Api(payload) {
    const headers = await authHeaders();
    const response = await fetchWithTimeout(`${BASE_URL}/api/ai/transcribe-base64`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
    });

    try {
        return await handleResponse(response);
    } catch (err) {
        return {
            success: false,
            error: err.message || 'Could not transcribe voice input.',
        };
    }
}
