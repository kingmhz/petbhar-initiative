'use client';

import React, { useState } from 'react';
import { ShieldCheck, Utensils, Truck, Sparkles, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface AllocationItem {
  id: string;
  percentage: number;
  labelKey: 'rupee_food_grains' | 'rupee_packaging' | 'rupee_kitchen' | 'rupee_admin';
  descKey: 'rupee_food_grains_desc' | 'rupee_packaging_desc' | 'rupee_kitchen_desc' | 'rupee_admin_desc';
  color: string;
  badgeColor: string;
  strokeColor: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export default function RupeeBreakdownChart() {
  const { t } = useLanguage();
  const [activeSegment, setActiveSegment] = useState<string>('food');

  const allocations: AllocationItem[] = [
    {
      id: 'food',
      percentage: 88,
      labelKey: 'rupee_food_grains',
      descKey: 'rupee_food_grains_desc',
      color: 'bg-amber-500',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      strokeColor: '#D97706',
      icon: Utensils,
    },
    {
      id: 'packaging',
      percentage: 7,
      labelKey: 'rupee_packaging',
      descKey: 'rupee_packaging_desc',
      color: 'bg-emerald-600',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      strokeColor: '#059669',
      icon: Truck,
    },
    {
      id: 'kitchen',
      percentage: 5,
      labelKey: 'rupee_kitchen',
      descKey: 'rupee_kitchen_desc',
      color: 'bg-sky-600',
      badgeColor: 'bg-sky-100 text-sky-900 border-sky-300',
      strokeColor: '#0284C7',
      icon: Sparkles,
    },
    {
      id: 'admin',
      percentage: 0,
      labelKey: 'rupee_admin',
      descKey: 'rupee_admin_desc',
      color: 'bg-charcoal',
      badgeColor: 'bg-green-100 text-green-900 border-green-300',
      strokeColor: '#1A1817',
      icon: ShieldCheck,
    },
  ];

  // SVG Donut calculation
  const radius = 75;
  const circumference = 2 * Math.PI * radius; // ~471.24

  // Calculate offsets for 88%, 7%, 5%
  const seg1Length = (88 / 100) * circumference;
  const seg2Length = (7 / 100) * circumference;
  const seg3Length = (5 / 100) * circumference;

  const currentItem = allocations.find(a => a.id === activeSegment) || allocations[0];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-charcoal/10 shadow-sm">
      <div className="max-w-2xl mx-auto text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
          <ShieldCheck size={14} className="text-emerald-600" />
          <span>{t('rupee_guarantee_badge')}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal tracking-tight">
          {t('rupee_title')}
        </h2>
        <p className="text-warm-grey text-xs sm:text-sm mt-2 leading-relaxed">
          {t('rupee_subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Interactive Donut Visual */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-64 h-64 flex items-center justify-center">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 200 200"
            >
              {/* Background ring */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                className="stroke-warm-ivory/60 fill-none"
                strokeWidth="24"
              />

              {/* Segment 1: Food (88%) */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                className="transition-all duration-500 cursor-pointer fill-none hover:opacity-90"
                stroke="#D97706"
                strokeWidth={activeSegment === 'food' ? '28' : '24'}
                strokeDasharray={`${seg1Length} ${circumference}`}
                strokeDashoffset="0"
                strokeLinecap="round"
                onMouseEnter={() => setActiveSegment('food')}
                onClick={() => setActiveSegment('food')}
              />

              {/* Segment 2: Packaging (7%) */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                className="transition-all duration-500 cursor-pointer fill-none hover:opacity-90"
                stroke="#059669"
                strokeWidth={activeSegment === 'packaging' ? '28' : '24'}
                strokeDasharray={`${seg2Length} ${circumference}`}
                strokeDashoffset={`-${seg1Length + 2}`}
                strokeLinecap="round"
                onMouseEnter={() => setActiveSegment('packaging')}
                onClick={() => setActiveSegment('packaging')}
              />

              {/* Segment 3: Kitchen & Vessels (5%) */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                className="transition-all duration-500 cursor-pointer fill-none hover:opacity-90"
                stroke="#0284C7"
                strokeWidth={activeSegment === 'kitchen' ? '28' : '24'}
                strokeDasharray={`${seg3Length} ${circumference}`}
                strokeDashoffset={`-${seg1Length + seg2Length + 4}`}
                strokeLinecap="round"
                onMouseEnter={() => setActiveSegment('kitchen')}
                onClick={() => setActiveSegment('kitchen')}
              />
            </svg>

            {/* Centered Stat in Donut */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none p-4">
              <span className="text-3xl sm:text-4xl font-serif font-extrabold text-charcoal tracking-tight">
                {currentItem.percentage}%
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-warm-grey mt-0.5 line-clamp-1 max-w-[120px]">
                {t(currentItem.labelKey)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4 text-[11px] text-warm-grey">
            <CheckCircle2 size={13} className="text-emerald-600" />
            <span>Click or hover on segments to inspect allocation</span>
          </div>
        </div>

        {/* Right Column: Breakdown Cards & Transparency Disclosures */}
        <div className="lg:col-span-7 space-y-3.5">
          {allocations.map((item) => {
            const Icon = item.icon;
            const isSelected = activeSegment === item.id;
            return (
              <div
                key={item.id}
                onMouseEnter={() => setActiveSegment(item.id)}
                onClick={() => setActiveSegment(item.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-charcoal bg-warm-ivory/20 shadow-xs'
                    : 'border-charcoal/10 bg-white hover:border-charcoal/30'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-charcoal text-ivory' : 'bg-charcoal/5 text-charcoal'
                      }`}
                    >
                      <Icon size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-charcoal">
                        {t(item.labelKey)}
                      </h4>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full border ${item.badgeColor}`}
                  >
                    {item.percentage}%
                  </span>
                </div>

                {/* Progress bar visual */}
                <div className="w-full bg-warm-ivory/60 h-2 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${item.color}`}
                    style={{ width: `${Math.max(item.percentage, item.id === 'admin' ? 0 : 4)}%` }}
                  />
                </div>

                <p className="text-xs text-warm-grey leading-relaxed">
                  {t(item.descKey)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
