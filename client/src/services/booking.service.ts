import { unwrap, api } from '@/lib/api';

export interface BookingWorkshop {
  id: string;
  name: string;
  batchName: string;
  startDate: string;
  mode: string;
  sessionTimeLabel?: string;
  capacity: number;
  seatsAvailable: number;
  pricing: { currentPrice: number; currency: string; currencySymbol: string; priceNote?: string };
  inclusions: string[];
}

export interface RegistrationDraft {
  id: string;
  registrationCode: string;
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  city?: string;
  amount: number;
  currencySymbol: string;
  status: string;
  workshopName: string;
  batchName: string;
}

export async function fetchBookingConfig() {
  return unwrap<{ enabled: boolean; keyId: string | null; currency: string; holdMinutes: number }>(api.get('/booking/config'));
}

export async function fetchBookingWorkshop() {
  return unwrap<BookingWorkshop>(api.get('/booking/workshop'));
}

export async function createRegistration(payload: Record<string, string>) {
  return unwrap<{ registration: RegistrationDraft; workshop: BookingWorkshop }>(api.post('/booking/register', payload));
}

export async function createPaymentOrder(registrationCode: string) {
  return unwrap<{
    order: { id: string; amount: number; currency: string };
    keyId: string;
    prefill: { name: string; email: string; contact: string };
    branding: { name: string; description: string; image: string };
    registration: RegistrationDraft;
  }>(api.post('/booking/order', { registrationCode }));
}

export async function verifyPayment(payload: {
  registrationCode: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) {
  return unwrap<{ registration: RegistrationDraft }>(api.post('/booking/verify', payload));
}

export async function fetchRegistration(code: string) {
  return unwrap<RegistrationDraft>(api.get(`/booking/${code}`));
}

export function loadRazorpayScript() {
  return new Promise<void>((resolve, reject) => {
    if (document.getElementById('razorpay-checkout')) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.id = 'razorpay-checkout';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Unable to load payment.'));
    document.body.appendChild(script);
  });
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}
