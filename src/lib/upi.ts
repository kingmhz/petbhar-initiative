/**
 * Utility to generate UPI payment URLs targeting Google Pay directly
 * with automated fallbacks for other UPI apps across Android, iOS, and Web.
 */

export interface UpiIntentOptions {
  upiId: string;
  payeeName: string;
  amount?: number;
  note?: string;
}

export interface UpiIntentUrls {
  gpayUrl: string;
  genericUpiUrl: string;
}

export function getUpiPaymentUrls({
  upiId,
  payeeName,
  amount,
  note = 'PetBhar Initiative Support',
}: UpiIntentOptions): UpiIntentUrls {
  const cleanUpi = encodeURIComponent(upiId.trim());
  const cleanName = encodeURIComponent(payeeName.trim());
  const cleanNote = encodeURIComponent(note.trim());
  const am = amount && amount > 0 ? `&am=${amount}` : '';

  // Standard NPCI UPI URI Query
  const upiQuery = `pa=${cleanUpi}&pn=${cleanName}${am}&cu=INR&tn=${cleanNote}`;
  const genericUpiUrl = `upi://pay?${upiQuery}`;

  // Android: Direct Google Pay application package intent with browser fallback to generic UPI
  const androidIntent = `intent://pay?${upiQuery}#Intent;scheme=upi;package=com.google.android.apps.nbu.paisa.user;S.browser_fallback_url=${encodeURIComponent(genericUpiUrl)};end`;

  // iOS: Google Pay registered custom URL scheme (gpay://)
  const iosGpay = `gpay://upi/pay?${upiQuery}`;

  if (typeof window !== 'undefined') {
    const ua = navigator.userAgent || '';
    if (/iPad|iPhone|iPod/.test(ua)) {
      return { gpayUrl: iosGpay, genericUpiUrl };
    }
    if (/android/i.test(ua)) {
      return { gpayUrl: androidIntent, genericUpiUrl };
    }
  }

  // Default to Android intent for mobile compatibility
  return { gpayUrl: androidIntent, genericUpiUrl };
}
