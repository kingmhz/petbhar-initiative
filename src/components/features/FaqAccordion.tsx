'use client';

import React, { useState, useMemo } from 'react';
import { ChevronDown, Search, HelpCircle, Heart, Shield, Users, Utensils } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface FaqItem {
  id: string;
  category: 'donations' | 'food' | 'volunteer';
  questionEn: string;
  answerEn: string;
  questionHi: string;
  answerHi: string;
}

const FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'volunteer',
    questionEn: 'Can I personally attend or feed with the team during a distribution drive?',
    answerEn: 'Yes, absolutely! We warmly welcome citizens, students, and families to experience ground reality firsthand. You can assist our kitchen team with meal packing, join our feeding van across designated distribution zones, or spend time feeding street dogs. Fill out the Volunteer Form on our Get Involved page or message our WhatsApp coordinator to join the next Sunday drive.',
    questionHi: 'क्या मैं व्यक्तिगत रूप से वितरण ड्राइव में उपस्थित होकर भोजन बांट सकता हूँ?',
    answerHi: 'हाँ, बिल्कुल! हम सभी नागरिकों, युवाओं और परिवारों का दिल से स्वागत करते हैं ताकि आप ज़मीनी सेवा का प्रत्यक्ष अनुभव कर सकें। आप भोजन पैकिंग में हाथ बंटा सकते हैं, हमारी टीम के साथ वितरण क्षेत्रों में जा सकते हैं या सड़क के बेजुबानों को भोजन करा सकते हैं। अगले रविवार की ड्राइव से जुड़ने के लिए हमारे स्वयंसेवक फॉर्म को भरें या व्हाट्सएप पर संपर्क करें।',
  },
  {
    id: 'faq-2',
    category: 'food',
    questionEn: 'How is the food prepared and what hygiene standards are followed?',
    answerEn: 'All meals are freshly prepared on the morning of each drive in dedicated clean stainless-steel cooking vessels. Our volunteers strictly follow hairnets, gloves, and sanitized kitchen protocols. Meals are packed piping hot into 100% biodegradable compostable boxes and dispatched within 2 hours of preparation to guarantee optimum freshness and warmth.',
    questionHi: 'भोजन कैसे तैयार किया जाता है और स्वच्छता के किन मानकों का पालन होता है?',
    answerHi: 'सभी भोजन ड्राइव के दिन सुबह ताज़ा तैयार किया जाता है। हमारे स्वयंसेवक हेयरनेट, दस्ताने और सैनिटाइज्ड रसोई प्रोटोकॉल का कड़ाई से पालन करते हैं। भोजन को 100% बायोडिग्रेडेबल डिब्बों में गर्म-गर्म पैक किया जाता है और तैयारी के 2 घंटे के भीतर वितरित किया जाता है ताकि पौष्टिकता और ताज़गी बनी रहे।',
  },
  {
    id: 'faq-3',
    category: 'food',
    questionEn: 'What food is served to street dogs and is it medically safe?',
    answerEn: 'Safety is paramount. Street dogs are strictly served boiled golden rice with turmeric broth, boiled eggs/broth, and certified high-protein dog kibble. We strictly NEVER use onions, garlic, excess salt, chillies, or spices, as these ingredients are toxic to canines. Fresh clean water bowls are also placed alongside every feeding spot.',
    questionHi: 'सड़क के श्वानों (कुत्तों) को क्या आहार दिया जाता है और क्या यह स्वास्थ्य के अनुकूल है?',
    answerHi: 'पशु स्वास्थ्य हमारी सर्वोच्च प्राथमिकता है। सड़क के बेजुबानों को हल्दी युक्त उबले चावल, उबले अंडे और प्रमाणित उच्च-प्रोटीन डॉग फूड दिया जाता है। हम प्याज़, लहसुन, मिर्च और मसालों का कभी भी उपयोग नहीं करते क्योंकि ये कुत्तों के स्वास्थ्य के लिए हानिकारक हैं। भोजन के साथ स्वच्छ पेयजल की भी व्यवस्था की जाती है।',
  },
  {
    id: 'faq-4',
    category: 'donations',
    questionEn: 'How do I receive photo & video verification of my dedicated feeding drive?',
    answerEn: 'When you sponsor a dedicated feeding drive (for a birthday, anniversary, or memorial), our field team prints your personalized banner message. During the drive, our media volunteer captures high-resolution photographs and short video clips. These are sent directly to your WhatsApp number within 24 to 48 hours of drive completion.',
    questionHi: 'मेरी समर्पित ड्राइव की फोटो और वीडियो सत्यापन मुझे कैसे प्राप्त होगी?',
    answerHi: 'जब आप किसी जन्मदिन, वर्षगांठ या स्मृति में भोजन ड्राइव समर्पित करते हैं, तो हमारी टीम आपका व्यक्तिगत बैनर तैयार करती है। ड्राइव के दौरान उच्च गुणवत्ता वाली तस्वीरें और वीडियो क्लिप ली जाती हैं, जो 24 से 48 घंटों के भीतर सीधे आपके व्हाट्सएप नंबर पर भेज दी जाती हैं।',
  },
  {
    id: 'faq-5',
    category: 'donations',
    questionEn: 'Is 100% of my donation utilized for food on the ground?',
    answerEn: 'Yes. PetBhar operates on a pure grassroots volunteer model. 100% of executive time and management is contributed voluntarily, with zero founder salaries or administrative cuts. Contributions go directly toward fresh grains, quality animal feed, compostable meal packaging, and ground delivery logistics.',
    questionHi: 'क्या मेरे दान का 100% हिस्सा सीधे भोजन और सेवा में उपयोग होता है?',
    answerHi: 'हाँ। पेटभर पूर्णतः ज़मीनी स्वयंसेवी मॉडल पर कार्य करता है। किसी भी प्रकार का प्रशासनिक वेतन या मुनाफा नहीं लिया जाता। समस्त जन-सहयोग सीधे ताज़ा अनाज, पशु आहार, पर्यावरण-अनुकूल डिब्बों और वितरण व्यवस्था में उपयोग होता है। हर एक पैसे का सार्वजनिक हिसाब रखा जाता है।',
  },
  {
    id: 'faq-6',
    category: 'volunteer',
    questionEn: 'Can I donate physical grains, dog food bags, or bowls instead of money?',
    answerEn: 'Yes! We actively welcome physical in-kind donations. You can donate unopened bags of wheat flour (atta), rice, pulses (dal), cooking oil, heavy cement dog water bowls, or commercial dog food. Please reach out via our Contact page or WhatsApp to arrange a direct drop-off at our kitchen center.',
    questionHi: 'क्या मैं पैसे के बदले अनाज, डॉग फूड या जल पात्र दान कर सकता हूँ?',
    answerHi: 'हाँ! हम सामग्री दान का खुले दिल से स्वागत करते हैं। आप साबुत आटा, चावल, दालें, सरसों तेल, सीमेंट के जल पात्र या डॉग फूड सीधे हमारी रसोई केंद्र पर पहुँचा सकते हैं। ड्रॉप-ऑफ का समय व पता जानने के लिए हमसे व्हाट्सएप पर संपर्क करें।',
  },
];

export default function FaqAccordion() {
  const { locale, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'donations' | 'food' | 'volunteer'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(['faq-1', 'faq-3']));

  const toggleFaq = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filteredFaqs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return FAQS.filter((item) => {
      const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
      const question = locale === 'hi' ? item.questionHi : item.questionEn;
      const answer = locale === 'hi' ? item.answerHi : item.answerEn;
      const matchesSearch = !q || question.toLowerCase().includes(q) || answer.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery, locale]);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-charcoal/10 shadow-sm">
      <div className="max-w-2xl mx-auto text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-charcoal/5 text-charcoal px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
          <HelpCircle size={14} />
          <span>Clear Answers & Transparency</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal tracking-tight">
          {t('faq_title')}
        </h2>
        <p className="text-warm-grey text-xs sm:text-sm mt-2 leading-relaxed">
          {t('faq_subtitle')}
        </p>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap bg-warm-ivory/30 p-1 rounded-xl border border-charcoal/10 gap-1 w-full sm:w-auto">
          {[
            { id: 'all', label: t('faq_tab_all'), icon: HelpCircle },
            { id: 'donations', label: t('faq_tab_donations'), icon: Heart },
            { id: 'food', label: t('faq_tab_food'), icon: Utensils },
            { id: 'volunteer', label: t('faq_tab_volunteer'), icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id as typeof selectedCategory)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  active
                    ? 'bg-charcoal text-ivory shadow-xs'
                    : 'text-warm-grey hover:text-charcoal'
                }`}
              >
                <Icon size={13} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-grey" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-warm-ivory/20 border border-charcoal/15 rounded-xl text-charcoal outline-none focus:border-charcoal transition-all shadow-xs"
          />
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-10 bg-warm-ivory/20 rounded-2xl border border-charcoal/5">
            <p className="text-xs sm:text-sm text-warm-grey">
              No questions found matching your filter. Feel free to contact our team directly.
            </p>
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = openIds.has(faq.id);
            const question = locale === 'hi' ? faq.questionHi : faq.questionEn;
            const answer = locale === 'hi' ? faq.answerHi : faq.answerEn;

            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all ${
                  isOpen
                    ? 'bg-warm-ivory/15 border-charcoal/30 shadow-xs'
                    : 'bg-white border-charcoal/10 hover:border-charcoal/20'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left transition-colors"
                >
                  <span className="text-xs sm:text-sm font-semibold text-charcoal flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-terracotta shrink-0" />
                    {question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen ? 'bg-charcoal text-ivory rotate-180' : 'bg-charcoal/5 text-charcoal'
                    }`}
                  >
                    <ChevronDown size={14} />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-warm-grey leading-relaxed border-t border-charcoal/5 animate-fadeIn">
                    <p className="whitespace-pre-line">{answer}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Help Banner */}
      <div className="mt-8 pt-6 border-t border-charcoal/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-warm-grey">
        <div className="flex items-center gap-2">
          <Shield size={14} className="text-emerald-600" />
          <span>Have an unanswered question or special inquiry?</span>
        </div>
        <a
          href="/contact"
          className="font-semibold text-charcoal hover:underline flex items-center gap-1"
        >
          Message our team &rarr;
        </a>
      </div>
    </div>
  );
}
