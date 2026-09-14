'use client';

import React, { useState } from 'react';
import { X, AlertTriangle, MapPin, Phone, User, CheckCircle2, Loader2, Navigation, Heart, Utensils, ShieldAlert } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface ReportNeedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReportNeedModal({ isOpen, onClose }: ReportNeedModalProps) {
  const { t } = useLanguage();

  const [category, setCategory] = useState<'stray_food' | 'injured_animal' | 'water_bowl' | 'hungry_community'>('stray_food');
  const [urgency, setUrgency] = useState<'immediate' | 'within_24h' | 'general'>('within_24h');
  const [location, setLocation] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedCount, setEstimatedCount] = useState('5-10');
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [coordinates, setCoordinates] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Lock body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close modal on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = `${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}`;
        setCoordinates(coords);
        if (!location) {
          setLocation(`GPS Pin: ${coords}`);
        }
        setIsLocating(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        alert('Could not fetch GPS location. Please type the address or nearby landmark manually.');
        setIsLocating(false);
      },
      { timeout: 10000 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!location.trim()) {
      setErrorMessage('Please specify the location or landmark.');
      return;
    }
    if (!reporterPhone.trim()) {
      setErrorMessage('Please provide a WhatsApp or phone number so our ground rescue team can coordinate.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/beacon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          urgency,
          location,
          landmark,
          city: city || 'Local Area',
          coordinates,
          description,
          estimatedCount: parseInt(estimatedCount) || 5,
          reporterName,
          reporterPhone,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setErrorMessage(data.error || 'Failed to submit report. Please try again.');
      }
    } catch {
      setErrorMessage('Network connection error. Please try again or WhatsApp our team.');
    }

    setIsSubmitting(false);
  };

  const handleReset = () => {
    setSubmitted(false);
    setLocation('');
    setLandmark('');
    setCity('');
    setDescription('');
    setReporterName('');
    setReporterPhone('');
    setCoordinates(null);
    setErrorMessage('');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-xs cursor-pointer"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="relative w-full max-w-lg bg-ivory rounded-3xl shadow-2xl border border-charcoal/10 overflow-hidden flex flex-col max-h-[92vh] cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between p-5 border-b border-charcoal/10 bg-warm-ivory/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
              <AlertTriangle size={16} />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-charcoal leading-tight">
                {t('sos_title')}
              </h3>
              <span className="text-[11px] text-warm-grey">
                Direct Dispatch to PetBhar Ground Volunteers
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-warm-grey hover:text-charcoal hover:bg-charcoal/5 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                <CheckCircle2 size={36} />
              </div>
              <div>
                <h4 className="font-serif text-xl font-bold text-charcoal">
                  {t('sos_success')}
                </h4>
                <p className="text-xs text-warm-grey max-w-sm mx-auto mt-1.5 leading-relaxed">
                  Thank you for being the eyes and heart of the community. Our local ground team has been alerted and will coordinate food distribution or animal relief.
                </p>
              </div>

              {/* Direct WhatsApp Emergency Contact */}
              <div className="p-4 bg-warm-ivory/30 rounded-2xl border border-charcoal/10 text-left space-y-2">
                <span className="text-[11px] font-semibold text-charcoal uppercase tracking-wider block">
                  Critical Emergency Hotline
                </span>
                <p className="text-xs text-warm-grey">
                  For extreme emergencies, you can also send live location or media directly to our ground coordinator:
                </p>
                <a
                  href={`https://wa.me/919548982164?text=${encodeURIComponent(`🚨 Urgent PetBhar SOS Beacon Alert:\nLocation: ${location}\nCategory: ${category}\nNotes: ${description}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-xl transition-colors"
                >
                  <Phone size={13} /> Chat on WhatsApp Directly
                </a>
              </div>

              <button
                onClick={handleReset}
                className="w-full py-3 rounded-xl bg-charcoal text-ivory text-xs font-semibold hover:bg-black transition-all"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <ShieldAlert size={15} className="shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Category Picker */}
              <div>
                <label className="text-xs font-semibold text-warm-grey uppercase tracking-wider mb-2 block">
                  Category of Need
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'stray_food', label: t('sos_cat_stray'), icon: Heart },
                    { id: 'injured_animal', label: t('sos_cat_injured'), icon: ShieldAlert },
                    { id: 'hungry_community', label: t('sos_cat_slum'), icon: Utensils },
                    { id: 'water_bowl', label: t('sos_cat_water'), icon: MapPin },
                  ].map((cat) => {
                    const Icon = cat.icon;
                    const active = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id as typeof category)}
                        className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all text-xs font-medium ${
                          active
                            ? 'bg-charcoal text-ivory border-charcoal shadow-xs'
                            : 'bg-white hover:bg-warm-ivory/20 text-charcoal border-charcoal/15'
                        }`}
                      >
                        <Icon size={16} className={`shrink-0 mt-0.5 ${active ? 'text-cream' : 'text-warm-grey'}`} />
                        <span className="leading-tight">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Urgency Selector */}
              <div>
                <label className="text-xs font-semibold text-warm-grey uppercase tracking-wider mb-1.5 block">
                  {t('sos_urgency')}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'immediate', label: t('sos_urgency_today'), color: 'border-red-400 bg-red-50/50 text-red-800' },
                    { id: 'within_24h', label: t('sos_urgency_24h'), color: 'border-amber-400 bg-amber-50/50 text-amber-800' },
                    { id: 'general', label: t('sos_urgency_general'), color: 'border-emerald-400 bg-emerald-50/50 text-emerald-800' },
                  ].map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => setUrgency(u.id as typeof urgency)}
                      className={`py-2 px-2.5 rounded-xl border text-[11px] font-semibold transition-all text-center ${
                        urgency === u.id
                          ? `${u.color} font-bold shadow-xs scale-102`
                          : 'bg-white border-charcoal/15 text-warm-grey hover:text-charcoal'
                      }`}
                    >
                      {u.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Estimated Count Selector */}
              <div>
                <label className="text-xs font-semibold text-warm-grey uppercase tracking-wider mb-1.5 block">
                  Estimated Count (Strays / People)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['1-3', '4-8', '8-15', '15+'].map((countOption) => (
                    <button
                      key={countOption}
                      type="button"
                      onClick={() => setEstimatedCount(countOption)}
                      className={`py-1.5 px-2 rounded-xl border text-[11px] font-semibold transition-all text-center ${
                        estimatedCount === countOption
                          ? 'bg-charcoal text-ivory border-charcoal shadow-xs'
                          : 'bg-white border-charcoal/15 text-warm-grey hover:text-charcoal'
                      }`}
                    >
                      {countOption}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Input & GPS */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-warm-grey uppercase tracking-wider">
                    {t('sos_location')} *
                  </label>
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={isLocating}
                    className="text-[11px] font-semibold text-terracotta hover:underline flex items-center gap-1"
                  >
                    {isLocating ? <Loader2 size={11} className="animate-spin" /> : <Navigation size={11} />}
                    <span>{isLocating ? 'Locating...' : t('sos_gps_btn')}</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Near Metro Pillar 142, Ring Road, Block B"
                  className="w-full px-3.5 py-2.5 bg-white border border-charcoal/15 rounded-xl text-xs text-charcoal outline-none focus:border-charcoal transition-all shadow-xs"
                  required
                />
                {coordinates && (
                  <span className="text-[10px] text-emerald-700 block mt-1">
                    ✓ GPS Coordinates Captured: {coordinates}
                  </span>
                )}
              </div>

              {/* Landmark & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-medium text-warm-grey mb-1 block">Landmark / Area</label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="e.g. Opposite Shiv Mandir"
                    className="w-full px-3 py-2 bg-white border border-charcoal/15 rounded-xl text-xs text-charcoal outline-none focus:border-charcoal"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-warm-grey mb-1 block">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Delhi NCR, Jaipur, Pune"
                    className="w-full px-3 py-2 bg-white border border-charcoal/15 rounded-xl text-xs text-charcoal outline-none focus:border-charcoal"
                  />
                </div>
              </div>

              {/* Description & Estimated Count */}
              <div>
                <label className="text-[11px] font-medium text-warm-grey mb-1 block">
                  Description / Number of Animals or People
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="e.g. Pack of 7 stray dogs haven't eaten for 2 days, one has minor paw injury..."
                  className="w-full px-3.5 py-2 bg-white border border-charcoal/15 rounded-xl text-xs text-charcoal outline-none focus:border-charcoal resize-none"
                />
              </div>

              {/* Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-charcoal/10">
                <div>
                  <label className="text-[11px] font-semibold text-warm-grey uppercase tracking-wider mb-1 block">
                    Your Name
                  </label>
                  <div className="relative">
                    <User size={13} className="absolute left-3 top-3 text-warm-grey/60" />
                    <input
                      type="text"
                      value={reporterName}
                      onChange={(e) => setReporterName(e.target.value)}
                      placeholder="e.g. Ananya"
                      className="w-full pl-8 pr-3 py-2 bg-white border border-charcoal/15 rounded-xl text-xs text-charcoal outline-none focus:border-charcoal"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-warm-grey uppercase tracking-wider mb-1 block">
                    WhatsApp / Phone *
                  </label>
                  <div className="relative">
                    <Phone size={13} className="absolute left-3 top-3 text-warm-grey/60" />
                    <input
                      type="tel"
                      value={reporterPhone}
                      onChange={(e) => setReporterPhone(e.target.value)}
                      placeholder="e.g. 98765 43210"
                      className="w-full pl-8 pr-3 py-2 bg-white border border-charcoal/15 rounded-xl text-xs text-charcoal outline-none focus:border-charcoal"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-charcoal text-ivory text-xs font-semibold hover:bg-black transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 active:scale-98"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Dispatching SOS Alert...</span>
                  </>
                ) : (
                  <span>{t('sos_submit')}</span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
