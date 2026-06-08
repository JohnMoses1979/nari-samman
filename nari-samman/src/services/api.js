import axios from "axios";

export const API_BASE_URL = "http://13.207.19.48:8080";
export const API_URL = API_BASE_URL;
export const BASE_URL = API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 25000,
  headers: {
    "Content-Type": "application/json",
  },
});

async function postFirst(paths, payload) {
  let lastError;

  for (const path of paths) {
    try {
      const response = await api.post(path, payload);
      return response.data;
    } catch (error) {
      lastError = error;
      const status = error?.response?.status;

      // Try next path only if route missing
      if (status !== 404 && status !== 405) {
        throw error;
      }
    }
  }

  throw lastError;
}

function getPhone(payload) {
  if (typeof payload === "string") return payload;

  return (
    payload?.phone ||
    payload?.mobileNumber ||
    payload?.phoneNumber ||
    payload?.mobile ||
    payload?.number ||
    ""
  );
}

function getOtp(payload, otpValue) {
  return (
    otpValue ||
    payload?.code ||
    payload?.otp ||
    payload?.otpCode ||
    payload?.verificationCode ||
    ""
  );
}

/* OTP */
export const sendOtp = async (payload) => {
  const phone = getPhone(payload);

  return postFirst(
    [
      "/api/otp/send",
      "/api/send-otp",
      "/api/auth/send-otp",
      "/otp/send",
      "/send-otp"
    ],
    { phone }
  );
};

export const sendOTP = sendOtp;
export const sendOtpToPhone = sendOtp;
export const sendOTPToPhone = sendOtp;
export const requestOtp = sendOtp;
export const requestOTP = sendOtp;

export const verifyOtp = async (payload, otpValue) => {
  const phone = getPhone(payload);
  const code = getOtp(payload, otpValue);

  return postFirst(
    [
      "/api/otp/verify",
      "/api/verify-otp",
      "/api/auth/verify-otp",
      "/otp/verify",
      "/verify-otp"
    ],
    { phone, code }
  );
};

export const verifyOTP = verifyOtp;
export const verifyOtpForPhone = verifyOtp;
export const verifyOTPForPhone = verifyOtp;
export const verifyOtpCode = verifyOtp;
export const verifyPhoneOtp = verifyOtp;

/* Consumer */
export const registerConsumer = async (payload) => {
  return postFirst(
    [
      "/api/consumers/register",
      "/api/consumer/register",
      "/api/auth/consumer/register",
      "/api/auth/register-consumer"
    ],
    payload
  );
};

export const createConsumer = registerConsumer;
export const createAccount = registerConsumer;
export const registerUser = registerConsumer;
export const signupConsumer = registerConsumer;
export const signUpConsumer = registerConsumer;

export const loginConsumer = async (payload) => {
  return postFirst(
    [
      "/api/consumers/login",
      "/api/consumer/login",
      "/api/auth/consumer/login",
      "/api/auth/login"
    ],
    payload
  );
};

export const consumerLogin = loginConsumer;
export const signInConsumer = loginConsumer;

/* Vendor / SHG / Artisan */
export const registerVendor = async (payload) => {
  return postFirst(
    [
      "/api/vendors/register",
      "/api/vendor/register",
      "/api/shg/register",
      "/api/artisans/register",
      "/api/artisan/register",
      "/api/auth/vendor/register",
      "/api/auth/shg/register"
    ],
    payload
  );
};

export const createVendor = registerVendor;
export const registerSHG = registerVendor;
export const registerShg = registerVendor;
export const registerArtisan = registerVendor;
export const signupVendor = registerVendor;
export const signUpVendor = registerVendor;

export const loginVendor = async (payload) => {
  return postFirst(
    [
      "/api/vendors/login",
      "/api/vendor/login",
      "/api/shg/login",
      "/api/artisans/login",
      "/api/artisan/login",
      "/api/auth/vendor/login",
      "/api/auth/shg/login"
    ],
    payload
  );
};

export const vendorLogin = loginVendor;
export const loginSHG = loginVendor;
export const loginShg = loginVendor;
export const loginArtisan = loginVendor;
export const signInVendor = loginVendor;

/* Admin */
export const adminLogin = async (payloadOrEmail, passwordArg) => {
  let email = "";
  let password = "";

  // Support: adminLogin("email", "password")
  if (typeof payloadOrEmail === "string") {
    email = payloadOrEmail;
    password = passwordArg || "";
  }

  // Support: adminLogin({ email, password })
  if (payloadOrEmail && typeof payloadOrEmail === "object") {
    email =
      payloadOrEmail.email ||
      payloadOrEmail.adminEmail ||
      payloadOrEmail.username ||
      payloadOrEmail.userName ||
      payloadOrEmail.emailAddress ||
      "";

    password =
      payloadOrEmail.password ||
      payloadOrEmail.adminPassword ||
      passwordArg ||
      "";
  }

  const response = await api.post("/api/admin/login", {
    email: String(email).trim(),
    password: String(password)
  });

  return response.data;
};

export const loginAdmin = adminLogin;
export const signInAdmin = adminLogin;
export const accessAdmin = adminLogin;

/* Attach all functions to default api object */
api.sendOtp = sendOtp;
api.sendOTP = sendOtp;
api.sendOtpToPhone = sendOtp;
api.sendOTPToPhone = sendOtp;
api.requestOtp = sendOtp;
api.requestOTP = sendOtp;

api.verifyOtp = verifyOtp;
api.verifyOTP = verifyOtp;
api.verifyOtpForPhone = verifyOtp;
api.verifyOTPForPhone = verifyOtp;
api.verifyOtpCode = verifyOtp;
api.verifyPhoneOtp = verifyOtp;

api.registerConsumer = registerConsumer;
api.createConsumer = registerConsumer;
api.createAccount = registerConsumer;
api.registerUser = registerConsumer;
api.signupConsumer = registerConsumer;
api.signUpConsumer = registerConsumer;

api.loginConsumer = loginConsumer;
api.consumerLogin = loginConsumer;
api.signInConsumer = loginConsumer;

api.registerVendor = registerVendor;
api.createVendor = registerVendor;
api.registerSHG = registerVendor;
api.registerShg = registerVendor;
api.registerArtisan = registerVendor;
api.signupVendor = registerVendor;
api.signUpVendor = registerVendor;

api.loginVendor = loginVendor;
api.vendorLogin = loginVendor;
api.loginSHG = loginVendor;
api.loginShg = loginVendor;
api.loginArtisan = loginVendor;
api.signInVendor = loginVendor;

api.adminLogin = adminLogin;
api.loginAdmin = adminLogin;
api.signInAdmin = adminLogin;
api.accessAdmin = adminLogin;


/* Admin KYC Dashboard Fix */
function getAuthHeaders() {
  let token = "";

  try {
    token =
      localStorage.getItem("adminToken") ||
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      "";
  } catch (e) {}

  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function getFirst(paths, fallback = []) {
  let lastError;

  for (const path of paths) {
    try {
      const response = await api.get(path, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      lastError = error;
      const status = error?.response?.status;

      // Try next route for route/security mismatch
      if (![400, 401, 403, 404, 405].includes(status)) {
        throw error;
      }
    }
  }

  console.warn("Admin API fallback used:", lastError?.message);
  return fallback;
}

async function postFirstAdmin(paths, payload = {}) {
  let lastError;

  for (const path of paths) {
    try {
      const response = await api.post(path, payload, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      lastError = error;
      const status = error?.response?.status;

      if (![400, 401, 403, 404, 405].includes(status)) {
        throw error;
      }
    }
  }

  throw lastError;
}

export const adminGetAllKyc = async () => {
  const data = await getFirst(
    [
      "/api/admin/kyc",
      "/api/admin/kyc/all",
      "/api/admin/vendors/kyc",
      "/api/admin/vendor-kyc",
      "/api/admin/kyc-documents",
      "/api/vendor-kyc/admin/all",
      "/api/kyc/admin/all"
    ],
    []
  );

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.kyc)) return data.kyc;
  if (Array.isArray(data?.documents)) return data.documents;
  if (Array.isArray(data?.content)) return data.content;

  return [];
};

export const adminGetKyc = adminGetAllKyc;
export const adminGetAllKYC = adminGetAllKyc;
export const getAllKyc = adminGetAllKyc;
export const getAllKYC = adminGetAllKyc;
export const getKycRequests = adminGetAllKyc;
export const adminGetKycRequests = adminGetAllKyc;

export const adminGetDashboardStats = async () => {
  const data = await getFirst(
    [
      "/api/admin/dashboard",
      "/api/admin/stats",
      "/api/admin/dashboard/stats",
      "/api/admin/summary"
    ],
    {
      totalVendors: 0,
      pendingKyc: 0,
      approvedKyc: 0,
      rejectedKyc: 0,
      totalConsumers: 0,
      totalOrders: 0
    }
  );

  return data || {};
};

export const adminApproveKyc = async (id, payload = {}) => {
  return postFirstAdmin(
    [
      `/api/admin/kyc/${id}/approve`,
      `/api/admin/vendor-kyc/${id}/approve`,
      `/api/admin/kyc-documents/${id}/approve`,
      `/api/vendor-kyc/${id}/approve`
    ],
    payload
  );
};

export const adminRejectKyc = async (id, payload = {}) => {
  return postFirstAdmin(
    [
      `/api/admin/kyc/${id}/reject`,
      `/api/admin/vendor-kyc/${id}/reject`,
      `/api/admin/kyc-documents/${id}/reject`,
      `/api/vendor-kyc/${id}/reject`
    ],
    payload
  );
};

api.adminGetAllKyc = adminGetAllKyc;
api.adminGetKyc = adminGetAllKyc;
api.adminGetAllKYC = adminGetAllKyc;
api.getAllKyc = adminGetAllKyc;
api.getAllKYC = adminGetAllKyc;
api.getKycRequests = adminGetAllKyc;
api.adminGetKycRequests = adminGetAllKyc;

api.adminGetDashboardStats = adminGetDashboardStats;
api.adminApproveKyc = adminApproveKyc;
api.adminRejectKyc = adminRejectKyc;


export { api };
export default api;
