'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, Send, CheckCircle2, MessageCircleHeart, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface WallPostItem {
  id: string;
  donorName: string;
  amount?: number;
  impactDescription: string;
  message?: string;
  occasion?: string;
  city?: string;
  createdAt: string;
}

export default function WallOfKindness() {
  const { t } = useLanguage();
  const [posts, setPosts] = useState<WallPostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [donorName, setDonorName] = useState('');
  const [message, setMessage] = useState('');
  const [city, setCity] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [visibleLimit, setVisibleLimit] = useState(6);

  useEffect(() => {
    let ignore = false;
    async function loadWall() {
      try {
        const res = await fetch('/api/wall');
        if (!ignore && res.ok) {
          const data = await res.json();
          setPosts(data.posts || []);
        }
      } catch (err) {
        console.warn('Could not load wall feed:', err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    loadWall();
    return () => {
      ignore = true;
    };
  }, []);

  const handlePostNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName.trim() || !message.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/wall', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ donorName, message, city }),
      });
      if (res.ok) {
        setSubmitSuccess(true);
        setDonorName('');
        setMessage('');
        setCity('');
        setTimeout(() => {
          setSubmitSuccess(false);
          setShowNoteForm(false);
        }, 3000);
      }
    } catch (err) {
      console.error('Error posting note:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .slice(0, 2)
      .map(part => part[0])
      .join('')
      .toUpperCase() || 'PB';
  };

  return (
    <section className="py-10 md:py-12 bg-cream/30 border-y border-charcoal/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold uppercase tracking-wider mb-2">
              <Heart size={13} /> {t('wall_title')}
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal">
              {t('wall_title')}
            </h2>
            <p className="text-xs sm:text-sm text-warm-grey mt-1 max-w-xl">
              {t('wall_subtitle')}
            </p>
          </div>

          {/* Action Trigger */}
          <button
            type="button"
            onClick={() => setShowNoteForm(!showNoteForm)}
            className="self-start sm:self-auto py-2 px-3.5 rounded-xl bg-white border border-charcoal/15 text-xs font-semibold text-charcoal hover:bg-warm-ivory/20 transition-all flex items-center gap-2 shadow-xs active:scale-98"
          >
            <MessageCircleHeart size={15} className="text-rose-600" />
            <span>{showNoteForm ? 'Close Form' : t('wall_post_note')}</span>
          </button>
        </div>

        {/* Note Submission Form Drawer */}
        {showNoteForm && (
          <div className="mb-6 p-4 sm:p-5 bg-white rounded-2xl border border-charcoal/10 shadow-xs max-w-2xl">
            {submitSuccess ? (
              <div className="py-4 text-center text-emerald-700 flex flex-col items-center gap-2">
                <CheckCircle2 size={28} />
                <span className="text-xs font-semibold">
                  Thank you! Your note has been submitted for moderation and will appear on the wall shortly.
                </span>
              </div>
            ) : (
              <form onSubmit={handlePostNote} className="space-y-3">
                <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider">
                  Post a message of encouragement to our ground kitchen & rescue volunteers:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="Your Name or Family (e.g. Rohit Sharma)"
                    className="w-full px-3 py-2 bg-warm-ivory/20 border border-charcoal/15 rounded-xl text-xs outline-none focus:border-charcoal"
                    required
                  />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City (e.g. Jaipur, Bengaluru)"
                    className="w-full px-3 py-2 bg-warm-ivory/20 border border-charcoal/15 rounded-xl text-xs outline-none focus:border-charcoal"
                  />
                </div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share a heartfelt thought, dedication memory, or words of encouragement..."
                  rows={2}
                  className="w-full px-3 py-2 bg-warm-ivory/20 border border-charcoal/15 rounded-xl text-xs outline-none focus:border-charcoal resize-none"
                  required
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowNoteForm(false)}
                    className="px-4 py-2 text-xs font-medium text-warm-grey hover:text-charcoal"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 rounded-xl bg-charcoal text-ivory text-xs font-semibold hover:bg-black transition-all flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                  >
                    <Send size={12} />
                    <span>{submitting ? 'Posting...' : 'Share Note'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Posts Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-36 bg-white/60 animate-pulse rounded-2xl border border-charcoal/5" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="p-8 sm:p-12 bg-white rounded-3xl border-2 border-dashed border-[#8C6239]/25 text-center max-w-xl mx-auto flex flex-col items-center justify-center space-y-4 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-[#8C6239]/10 text-[#8C6239] flex items-center justify-center text-2xl shadow-xs">
              ✨
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-charcoal font-medium">
              Support us and add your name here
            </h3>
            <p className="text-xs sm:text-sm text-warm-grey max-w-md leading-relaxed">
              Be the first to dedicate a feeding drive, volunteer on the ground, or share a warm note of encouragement for our community kitchen and animals.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href="/get-involved"
                className="px-6 py-3 rounded-xl bg-charcoal text-ivory text-xs sm:text-sm font-semibold hover:bg-black transition-all shadow-sm flex items-center gap-1.5"
              >
                <span>{t('nav_support_us')} &rarr;</span>
              </a>
              <button
                type="button"
                onClick={() => setShowNoteForm(true)}
                className="px-6 py-3 rounded-xl bg-[#FAF8F4] text-charcoal border border-[#8C6239]/30 text-xs sm:text-sm font-semibold hover:bg-[#8C6239]/10 transition-all flex items-center gap-1.5"
              >
                <span>Share a Note of Kindness</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {posts.slice(0, visibleLimit).map((post) => (
                <div
                  key={post.id}
                  className="p-4 sm:p-5 bg-white rounded-2xl border border-charcoal/10 hover:border-charcoal/20 transition-all shadow-xs flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: User Avatar & Badges */}
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-linear-to-br from-terracotta/20 to-amber-100 text-charcoal font-semibold text-xs flex items-center justify-center border border-charcoal/10 shrink-0">
                          {getInitials(post.donorName)}
                        </div>
                        <div>
                          <span className="font-semibold text-charcoal text-xs block leading-tight">
                            {post.donorName}
                          </span>
                          {post.city && (
                            <span className="text-[10px] text-warm-grey">
                              {post.city}
                            </span>
                          )}
                        </div>
                      </div>

                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-medium shrink-0">
                        <ShieldCheck size={11} /> {t('wall_verified')}
                      </span>
                    </div>

                    {/* Occasion or Amount Pill */}
                    {(post.occasion || post.amount) && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {post.occasion && (
                          <span className="text-[10px] bg-warm-ivory/50 text-charcoal px-2 py-0.5 rounded-full font-medium">
                            {post.occasion}
                          </span>
                        )}
                        {post.amount && post.amount > 0 && (
                          <span className="text-[11px] bg-amber-100/90 text-amber-950 border border-amber-300/80 px-2 py-0.5 rounded-full font-bold inline-flex items-center gap-1 shadow-xs">
                            <span>₹{post.amount.toLocaleString('en-IN')}</span>
                            <span className="text-[9px] font-medium uppercase tracking-wider text-amber-800">Donated</span>
                          </span>
                        )}
                      </div>
                    )}

                    {/* Impact Description */}
                    <p className="text-xs font-semibold text-charcoal mb-1.5 leading-snug">
                      {post.impactDescription}
                    </p>

                    {/* Message Quote */}
                    {post.message && (
                      <p className="text-xs text-warm-grey italic bg-warm-ivory/20 p-2 rounded-xl border border-charcoal/5 leading-relaxed">
                        &ldquo;{post.message}&rdquo;
                      </p>
                    )}
                  </div>

                  {/* Footer Timestamp */}
                  <div className="text-[10px] text-warm-grey/70 mt-2.5 pt-2 border-t border-charcoal/5 flex items-center justify-between">
                    <span>{new Date(post.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span className="flex items-center gap-1 text-rose-500">
                      <Sparkles size={11} /> Community Love
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {posts.length > visibleLimit && (
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setVisibleLimit(posts.length)}
                  className="px-5 py-2 rounded-full border border-charcoal/15 bg-white text-xs font-semibold text-charcoal hover:bg-warm-ivory/30 transition-all shadow-xs"
                >
                  View All {posts.length} Kindness Stories &darr;
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
