'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Minus, HeartHandshake, Check, Copy, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { siteConfig } from '@/lib/siteConfig';

interface PantryItem {
  id: string;
  nameKey: 'pantry_item_atta' | 'pantry_item_rice' | 'pantry_item_dal' | 'pantry_item_kibble' | 'pantry_item_bowl' | 'pantry_item_veggies';
  price: number;
  unit: string;
  impactSnippet: string;
  icon: string;
  bgLight: string;
}

const PANTRY_ITEMS: PantryItem[] = [
  {
    id: 'atta',
    nameKey: 'pantry_item_atta',
    price: 420,
    unit: '10 kg bag',
    impactSnippet: 'Yields ~140 hot chapatis for hungry laborers & children',
    icon: '🌾',
    bgLight: 'bg-amber-50/70 border-amber-200/70',
  },
  {
    id: 'rice',
    nameKey: 'pantry_item_rice',
    price: 490,
    unit: '10 kg bag',
    impactSnippet: 'Prepares ~80 wholesome khichdi & rice portions',
    icon: '🍚',
    bgLight: 'bg-stone-50 border-stone-200/70',
  },
  {
    id: 'dal',
    nameKey: 'pantry_item_dal',
    price: 780,
    unit: '5 kg pack',
    impactSnippet: 'Essential protein for underprivileged shelter families',
    icon: '🫘',
    bgLight: 'bg-yellow-50/70 border-yellow-200/70',
  },
  {
    id: 'kibble',
    nameKey: 'pantry_item_kibble',
    price: 1850,
    unit: '20 kg sack',
    impactSnippet: 'Feeds street dogs with wholesome, nutritious dog food & fresh meals',
    icon: '🐕',
    bgLight: 'bg-orange-50/70 border-orange-200/70',
  },
  {
    id: 'bowl',
    nameKey: 'pantry_item_bowl',
    price: 250,
    unit: '1 concrete bowl',
    impactSnippet: 'Placed roadside to quench thirst of birds & strays all summer',
    icon: '🥣',
    bgLight: 'bg-sky-50/70 border-sky-200/70',
  },
  {
    id: 'veggies',
    nameKey: 'pantry_item_veggies',
    price: 950,
    unit: '1 farm crate',
    impactSnippet: 'Potatoes, pumpkins, greens & pure mustard cooking oil',
    icon: '🥬',
    bgLight: 'bg-emerald-50/70 border-emerald-200/70',
  },
];

export default function PantryWishlist() {
  const { t } = useLanguage();
  const [quantities, setQuantities] = useState<Record<string, number>>({
    atta: 1,
    rice: 1,
    kibble: 0,
    dal: 0,
    bowl: 0,
    veggies: 0,
  });
  const [copied, setCopied] = useState(false);

  const updateQuantity = (id: string, delta: number) => {
    setQuantities((prev) => {
      const cur = prev[id] || 0;
      const next = Math.max(0, cur + delta);
      return { ...prev, [id]: next };
    });
  };

  const totalAmount = useMemo(() => {
    return PANTRY_ITEMS.reduce((sum, item) => {
      return sum + item.price * (quantities[item.id] || 0);
    }, 0);
  }, [quantities]);

  const selectedItemsSummary = useMemo(() => {
    return PANTRY_ITEMS
      .filter((item) => (quantities[item.id] || 0) > 0)
      .map((item) => `${quantities[item.id]}x ${t(item.nameKey).split(' ')[0]}`)
      .join(', ');
  }, [quantities, t]);

  const upiId = siteConfig.upi?.id || 'petbhar@upi';
  const payeeName = siteConfig.upi?.payeeName || 'PetBhar Initiative';

  const upiDeepLink = useMemo(() => {
    if (totalAmount === 0) return '#';
    const note = selectedItemsSummary ? `PetBhar Pantry: ${selectedItemsSummary}` : 'PetBhar Pantry Support';
    return `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${totalAmount}&cu=INR&tn=${encodeURIComponent(note)}`;
  }, [totalAmount, selectedItemsSummary, upiId, payeeName]);

  const handleCopyUPI = async () => {
    try {
      await navigator.clipboard.writeText(upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.warn('Could not copy UPI ID');
    }
  };

  return (
    <div className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-10 border border-charcoal/10 shadow-sm">
      <div className="max-w-2xl mx-auto text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 border border-amber-300 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
          <ShoppingBag size={14} className="text-amber-700" />
          <span>Tangible Community Giving</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal tracking-tight">
          {t('pantry_title')}
        </h2>
        <p className="text-warm-grey text-xs sm:text-sm mt-2 leading-relaxed">
          {t('pantry_subtitle')}
        </p>
      </div>

      {/* Grid of Pantry Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {PANTRY_ITEMS.map((item) => {
          const qty = quantities[item.id] || 0;
          return (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition-all ${
                qty > 0
                  ? 'bg-white border-charcoal shadow-xs ring-1 ring-charcoal/10'
                  : `${item.bgLight} hover:bg-white hover:border-charcoal/30`
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl" role="img" aria-label={item.id}>
                    {item.icon}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-charcoal leading-tight">
                      {t(item.nameKey)}
                    </h3>
                    <span className="text-[11px] text-warm-grey block mt-0.5">
                      {item.unit}
                    </span>
                  </div>
                </div>
                <span className="text-sm font-bold text-charcoal shrink-0 font-serif">
                  ₹{item.price}
                </span>
              </div>

              <p className="text-xs text-warm-grey mb-4 leading-relaxed min-h-[32px]">
                {item.impactSnippet}
              </p>

              {/* Quantity Adjuster */}
              <div className="flex items-center justify-between pt-2 border-t border-charcoal/5">
                <span className="text-xs text-warm-grey font-medium">Quantity</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, -1)}
                    disabled={qty === 0}
                    className="w-8 h-8 rounded-lg border border-charcoal/15 bg-white text-charcoal flex items-center justify-center hover:bg-warm-ivory/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
                    aria-label={`Decrease ${item.id}`}
                  >
                    <Minus size={13} />
                  </button>

                  <span className="w-8 text-center text-xs font-bold text-charcoal">
                    {qty}
                  </span>

                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-8 h-8 rounded-lg border border-charcoal/20 bg-charcoal text-ivory flex items-center justify-center hover:bg-black transition-all active:scale-95 shadow-xs"
                    aria-label={`Increase ${item.id}`}
                  >
                    <Plus size={13} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Basket Sticky Checkout Card */}
      <div className="bg-white border border-charcoal/15 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left w-full md:w-auto">
          <span className="text-xs text-warm-grey uppercase tracking-wider font-semibold block mb-0.5">
            {t('pantry_total')}
          </span>
          <div className="flex items-baseline justify-center md:justify-start gap-2">
            <span className="text-3xl sm:text-4xl font-serif font-extrabold text-charcoal">
              ₹{totalAmount.toLocaleString('en-IN')}
            </span>
            {selectedItemsSummary ? (
              <span className="text-xs text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 truncate max-w-xs">
                {selectedItemsSummary}
              </span>
            ) : (
              <span className="text-xs text-warm-grey italic">
                {t('pantry_empty_cart')}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 w-full md:w-auto">
          {/* Copy UPI Button */}
          <button
            type="button"
            onClick={handleCopyUPI}
            className="flex items-center gap-1.5 px-3.5 py-3 rounded-xl border border-charcoal/15 bg-warm-ivory/20 hover:bg-warm-ivory/50 text-charcoal text-xs font-medium transition-all"
            title="Copy Official UPI ID"
          >
            {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
            <span>{copied ? 'UPI Copied!' : upiId}</span>
          </button>

          {/* 1-Tap UPI Sponsor (Mobile Only) */}
          <a
            href={upiDeepLink}
            className={`flex md:hidden items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-md active:scale-98 ${
              totalAmount > 0
                ? 'bg-charcoal text-ivory hover:bg-black cursor-pointer'
                : 'bg-charcoal/40 text-ivory/60 cursor-not-allowed pointer-events-none'
            }`}
          >
            <HeartHandshake size={16} />
            <span>{t('pantry_sponsor_upi')} &rarr;</span>
            <ArrowUpRight size={14} className="opacity-70" />
          </a>
        </div>
      </div>
    </div>
  );
}
