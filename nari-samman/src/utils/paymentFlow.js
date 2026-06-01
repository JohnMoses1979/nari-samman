import { Platform } from 'react-native';

const DEFAULT_API_BASE_URL = 'http://192.168.10.33:8080';
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  DEFAULT_API_BASE_URL;

function loadRazorpayWebScript() {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Browser checkout is unavailable.'));
  }

  if (window.Razorpay) {
    return Promise.resolve(window.Razorpay);
  }

  const existing = document.querySelector('script[data-razorpay-checkout="true"]');
  if (existing) {
    return new Promise((resolve, reject) => {
      const timer = setInterval(() => {
        if (window.Razorpay) {
          clearInterval(timer);
          resolve(window.Razorpay);
        }
      }, 50);

      existing.addEventListener('error', () => {
        clearInterval(timer);
        reject(new Error('Failed to load Razorpay checkout.'));
      }, { once: true });
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.dataset.razorpayCheckout = 'true';
    script.onload = () => resolve(window.Razorpay);
    script.onerror = () => reject(new Error('Failed to load Razorpay checkout.'));
    document.body.appendChild(script);
  });
}

async function openRazorpayWeb(options) {
  const Razorpay = await loadRazorpayWebScript();
  return new Promise((resolve, reject) => {
    const rzp = new Razorpay({
      ...options,
      modal: {
        escape: true,
        backdropclose: false,
        ondismiss: () => reject(new Error('Payment cancelled')),
      },
      handler: (response) => resolve(response),
    });

    rzp.on('payment.failed', (response) => {
      reject(new Error(response?.error?.description || 'Payment failed'));
    });

    rzp.open();
  });
}

async function openNativeRazorpay(options) {
  const RazorpayCheckout = require('react-native-razorpay');
  return RazorpayCheckout.open(options);
}

function buildGatewayOptions(options, paymentMethod) {
  if (!paymentMethod || paymentMethod === 'cod') {
    return options;
  }

  const prefill = {
    ...(options.prefill || {}),
    method: paymentMethod,
  };

  if (paymentMethod === 'upi' && options.prefill?.vpa) {
    prefill.vpa = options.prefill.vpa;
  }

  return {
    ...options,
    prefill,
  };
}

export async function createPaymentOrder({ amount, paymentMethod, deliveryAddress }) {
  const response = await fetch(`${API_BASE_URL}/api/payments/create-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount,
      paymentMethod,
      deliveryAddress,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || 'Unable to create payment order.');
  }

  return data;
}

export async function verifyPayment(payload) {
  const response = await fetch(`${API_BASE_URL}/api/payments/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok || !data?.success) {
    throw new Error(data?.message || 'Payment verification failed.');
  }

  return data;
}

export async function launchRazorpayCheckout(options) {
  const paymentMethod = options?.method || options?.paymentMethod || null;
  const gatewayOptions = buildGatewayOptions(options, paymentMethod);

  if (Platform.OS === 'web') {
    return openRazorpayWeb(gatewayOptions);
  }

  return openNativeRazorpay(gatewayOptions);
}
