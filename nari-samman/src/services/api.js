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

export const sendOtp = async (payload) => {
  const phone = getPhone(payload);
  const response = await api.post("/api/otp/send", { phone });
  return response.data;
};

export const sendOTP = sendOtp;
export const sendOtpToPhone = sendOtp;
export const sendOTPToPhone = sendOtp;
export const requestOtp = sendOtp;
export const requestOTP = sendOtp;

export const verifyOtp = async (payload, otpValue) => {
  const phone = getPhone(payload);
  const code = getOtp(payload, otpValue);
  const response = await api.post("/api/otp/verify", { phone, code });
  return response.data;
};

export const verifyOTP = verifyOtp;
export const verifyOtpForPhone = verifyOtp;
export const verifyOTPForPhone = verifyOtp;
export const verifyOtpCode = verifyOtp;
export const verifyPhoneOtp = verifyOtp;

export const registerConsumer = async (payload) => {
  const response = await api.post("/api/consumers/register", payload);
  return response.data;
};

export const createConsumer = registerConsumer;
export const createAccount = registerConsumer;
export const registerUser = registerConsumer;
export const signupConsumer = registerConsumer;
export const signUpConsumer = registerConsumer;

export const loginConsumer = async (payload) => {
  const response = await api.post("/api/consumers/login", payload);
  return response.data;
};

export const consumerLogin = loginConsumer;
export const signInConsumer = loginConsumer;

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

export { api };
export default api;
