'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import config from '@/lib/siteConfig';

interface DonationMethodsProps {
  className?: string;
}

export function DonationMethods({ className = '' }: DonationMethodsProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const payeeName = encodeURIComponent(config.org.name);

  const copyToClipboard = (text: string, key: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className={`grid gap-8 md:grid-cols-2 ${className}`}>
      {/* Option 1: UPI Transfer */}
      <div className="rounded-3xl border border-charcoal/5 bg-white p-8 sm:p-10 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl text-charcoal">UPI Payment</h3>
            <span className="text-[10px] uppercase tracking-widest text-warm-grey bg-ivory px-3 py-1 rounded-full border border-charcoal/5">Instant</span>
          </div>

          <div className="mx-auto mt-6 flex aspect-square w-full max-w-[260px] items-center justify-center rounded-2xl border border-charcoal/10 overflow-hidden bg-white shadow-sm p-3 relative">
            <Image
              src={config.upi.qrImage || '/images/petbhar-upi-qr.png'}
              alt="PetBhar UPI Barcode"
              width={240}
              height={240}
              className="w-full h-full object-contain"
              priority
            />
          </div>

          <div className="mt-5 text-center">
            <p className="text-xs font-medium text-charcoal">Scan with any UPI App</p>
            <p className="text-[11px] text-warm-grey mt-0.5">Google Pay &bull; PhonePe &bull; Paytm &bull; BHIM &bull; CRED</p>

            {config.upi.id && (
              <div className="mt-4">
                <p className="text-xs uppercase tracking-widest text-warm-grey">UPI ID</p>
                <div className="mt-1 flex items-center justify-center gap-2">
                  <span className="font-mono text-base font-semibold text-charcoal">{config.upi.id}</span>
                  <button
                    onClick={() => copyToClipboard(config.upi.id, 'upi')}
                    className="p-1.5 text-warm-grey hover:text-charcoal hover:bg-beige/40 rounded-md transition-colors"
                    title="Copy UPI ID"
                    aria-label="Copy UPI ID"
                  >
                    {copiedKey === 'upi' ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                  </button>
                </div>
                {copiedKey === 'upi' && (
                  <p className="text-[11px] text-green-600 mt-1 font-medium">Copied to clipboard!</p>
                )}
              </div>
            )}
          </div>

          {config.upi.id && (
            <div className="mt-6">
              <Button 
                variant="primary" 
                href={`upi://pay?pa=${encodeURIComponent(config.upi.id)}&pn=${encodeURIComponent(payeeName)}`}
                className="w-full justify-center py-3.5 shadow"
              >
                Pay via GPay / PhonePe / Paytm
              </Button>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-warm-grey/80">
          Open any camera or UPI scanner on your phone to contribute instantly
        </p>
      </div>

      {/* Option 2: Direct Bank Account Transfer */}
      <div className="rounded-3xl border border-charcoal/5 bg-white p-8 sm:p-10 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl text-charcoal">Bank Transfer</h3>
            <span className="text-[10px] uppercase tracking-widest text-warm-grey bg-ivory px-3 py-1 rounded-full border border-charcoal/5">NEFT / RTGS / IMPS</span>
          </div>

          {!config.bankAccount.enabled ? (
            <div className="my-10 p-8 rounded-2xl bg-ivory border border-charcoal/5 text-center">
              <div className="w-14 h-14 rounded-full bg-beige/80 flex items-center justify-center mx-auto mb-4 text-charcoal font-serif text-xl font-bold shadow-sm">
                🏛️
              </div>
              <h4 className="font-serif text-lg text-charcoal">Bank Details Coming Soon</h4>
              <p className="mt-2 text-sm text-warm-grey leading-relaxed max-w-xs mx-auto">
                Dedicated non-profit institutional bank account details will be posted here once live.
              </p>
            </div>
          ) : (
            <ul className="mt-8 space-y-4 text-left divide-y divide-charcoal/5">
              <li className="pt-3 first:pt-0">
                <div className="text-xs uppercase tracking-wider text-warm-grey">Account Name</div>
                <div className="mt-1 font-medium text-charcoal text-base flex items-center justify-between">
                  <span>{config.bankAccount.accountHolderName}</span>
                  <button
                    onClick={() => copyToClipboard(config.bankAccount.accountHolderName, 'name')}
                    className="p-1.5 text-warm-grey hover:text-charcoal hover:bg-beige/40 rounded-md transition-colors"
                    title="Copy Name"
                  >
                    {copiedKey === 'name' ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                  </button>
                </div>
              </li>

              <li className="pt-3">
                <div className="text-xs uppercase tracking-wider text-warm-grey">Account Number</div>
                <div className="mt-1 font-mono font-semibold text-charcoal text-lg flex items-center justify-between">
                  <span>{config.bankAccount.accountNumber}</span>
                  <button
                    onClick={() => copyToClipboard(config.bankAccount.accountNumber, 'acc')}
                    className="p-1.5 text-warm-grey hover:text-charcoal hover:bg-beige/40 rounded-md transition-colors"
                    title="Copy Account Number"
                  >
                    {copiedKey === 'acc' ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                  </button>
                </div>
              </li>

              <li className="pt-3">
                <div className="text-xs uppercase tracking-wider text-warm-grey">IFSC Code</div>
                <div className="mt-1 font-mono font-semibold text-charcoal text-base flex items-center justify-between">
                  <span>{config.bankAccount.ifscCode}</span>
                  <button
                    onClick={() => copyToClipboard(config.bankAccount.ifscCode, 'ifsc')}
                    className="p-1.5 text-warm-grey hover:text-charcoal hover:bg-beige/40 rounded-md transition-colors"
                    title="Copy IFSC Code"
                  >
                    {copiedKey === 'ifsc' ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                  </button>
                </div>
              </li>

              <li className="pt-3">
                <div className="text-xs uppercase tracking-wider text-warm-grey">Bank & Branch</div>
                <div className="mt-1 font-medium text-charcoal text-sm">
                  {config.bankAccount.bankName} {config.bankAccount.branch && `• ${config.bankAccount.branch}`}
                </div>
              </li>
            </ul>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-warm-grey/80">
          Transfer receipts and acknowledgement are shared upon request.
        </p>
      </div>

      {/* Trust Guarantee Note */}
      <div className="col-span-full p-6 rounded-2xl bg-ivory border border-charcoal/5 text-center">
        <p className="text-xs sm:text-sm text-warm-grey leading-relaxed max-w-2xl mx-auto">
          <strong className="text-charcoal font-medium">100% Transparency Promise:</strong> Every rupee contributed is allocated strictly toward food rations, meals, and animal care. Public audit records and receipts are published under our <a href="/transparency" className="text-charcoal underline underline-offset-4 hover:opacity-75 font-medium">Transparency section</a>.
        </p>
      </div>
    </div>
  );
}

export default DonationMethods;
