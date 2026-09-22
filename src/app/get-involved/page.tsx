'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { DonationMethods } from '@/components/sections/DonationMethods';
import DedicateDriveModal from '@/components/features/DedicateDriveModal';
import ImpactCardGeneratorModal from '@/components/features/ImpactCardGeneratorModal';
import FaqAccordion from '@/components/features/FaqAccordion';
import { useLanguage } from '@/context/LanguageContext';

export default function GetInvolvedPage() {
  const { t } = useLanguage();
  const [showDedicateModal, setShowDedicateModal] = useState(false);
  const [showImpactCardModal, setShowImpactCardModal] = useState(false);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  // Volunteer form state
  const [volData, setVolData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    availability: 'Flexible',
    activity: 'Food Distribution',
    skills: '',
  });
  const [volSubmitting, setVolSubmitting] = useState(false);
  const [volSubmitted, setVolSubmitted] = useState(false);
  const [volError, setVolError] = useState('');

  // Partner form state
  const [partnerData, setPartnerData] = useState({
    orgName: '',
    contactPerson: '',
    email: '',
    phone: '',
    type: 'Restaurant / Cafe',
    message: '',
  });
  const [partnerSubmitting, setPartnerSubmitting] = useState(false);
  const [partnerSubmitted, setPartnerSubmitted] = useState(false);
  const [partnerError, setPartnerError] = useState('');

  const handleVolunteerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVolSubmitting(true);
    setVolError('');
    try {
      const res = await fetch('/api/volunteer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(volData),
      });
      const data = await res.json();
      if (res.ok) {
        setVolSubmitted(true);
        setVolData({
          name: '',
          phone: '',
          email: '',
          city: '',
          availability: 'Flexible',
          activity: 'Food Distribution',
          skills: '',
        });
        setTimeout(() => setVolSubmitted(false), 5000);
      } else {
        setVolError(data.error || 'Failed to submit application. Please try again.');
      }
    } catch {
      setVolError('Connection error. Please try again later.');
    } finally {
      setVolSubmitting(false);
    }
  };

  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPartnerSubmitting(true);
    setPartnerError('');
    try {
      const res = await fetch('/api/partner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partnerData),
      });
      const data = await res.json();
      if (res.ok) {
        setPartnerSubmitted(true);
        setPartnerData({
          orgName: '',
          contactPerson: '',
          email: '',
          phone: '',
          type: 'Restaurant / Cafe',
          message: '',
        });
        setTimeout(() => setPartnerSubmitted(false), 5000);
      } else {
        setPartnerError(data.error || 'Failed to send proposal. Please try again.');
      }
    } catch {
      setPartnerError('Connection error. Please try again later.');
    } finally {
      setPartnerSubmitting(false);
    }
  };

  return (
    <main>
      {/* Page Header */}
      <section className="bg-charcoal text-ivory py-24 sm:py-32 md:py-40 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeIn}>
            <SectionLabel dark>{t('get_involved_label')}</SectionLabel>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light mt-6 sm:mt-8 leading-tight">
              Make a Difference
            </h1>
            <p className="text-ivory/70 text-lg sm:text-xl mt-4 sm:mt-6 max-w-2xl font-light">
              Your time, resources, or voice can change lives. Join our mission today.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Donation Section */}
      <section className="bg-ivory py-16 sm:py-24 scroll-mt-24" id="donate">
        <div className="max-w-7xl mx-auto px-6 mb-12 sm:mb-16">
          <motion.div {...fadeIn} className="text-center">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-charcoal">
              Support Our Work
            </h2>
            <p className="text-charcoal/70 mt-4 sm:mt-6 max-w-2xl mx-auto text-sm sm:text-base">
              Every contribution, no matter the size, directly fuels our initiatives to provide food and resources to those in need.
            </p>
          </motion.div>
        </div>
        <div className="max-w-7xl mx-auto px-6">
          <DonationMethods />
        </div>

        {/* Special Community Ways to Give */}
        <div className="mt-16 max-w-7xl mx-auto px-6">
          <motion.div {...fadeIn} className="text-center mb-10">
            <h3 className="font-serif text-2xl sm:text-3xl text-charcoal">
              More Meaningful Ways to Support
            </h3>
            <p className="text-xs sm:text-sm text-warm-grey mt-2 max-w-xl mx-auto">
              Celebrate personal milestones with ground food drives or share your verified impact stories with friends.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto gap-6 sm:gap-8">
            {/* Card 1: Dedicate */}
            <motion.div {...fadeIn} className="rounded-2xl border border-charcoal/10 bg-white p-6 sm:p-7 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-2xl mb-4">
                  🎂
                </div>
                <h4 className="font-serif text-xl text-charcoal font-semibold">
                  Dedicate a Feeding Drive
                </h4>
                <p className="text-xs sm:text-sm text-warm-grey mt-2 leading-relaxed">
                  Sponsor a wholesome food drive for birthdays, wedding anniversaries, or in loving memory. Includes custom ground banner & WhatsApp photo dispatch.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowDedicateModal(true)}
                className="mt-6 inline-flex items-center justify-center px-4 py-3 rounded-xl bg-charcoal text-ivory text-xs sm:text-sm font-medium hover:bg-charcoal/90 transition-colors shadow-sm"
              >
                Sponsor a Dedicated Drive &rarr;
              </button>
            </motion.div>

            {/* Card 2: Impact Card */}
            <motion.div {...fadeIn} className="rounded-2xl border border-charcoal/10 bg-white p-6 sm:p-7 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-2xl mb-4">
                  📸
                </div>
                <h4 className="font-serif text-xl text-charcoal font-semibold">
                  Social Impact Card
                </h4>
                <p className="text-xs sm:text-sm text-warm-grey mt-2 leading-relaxed">
                  Generate a bespoke 9:16 high-resolution graphic for Instagram Stories and WhatsApp Status showing meals sponsored to inspire friends.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowImpactCardModal(true)}
                className="mt-6 inline-flex items-center justify-center px-4 py-3 rounded-xl bg-charcoal text-ivory text-xs sm:text-sm font-medium hover:bg-charcoal/90 transition-colors shadow-sm"
              >
                Create Story Graphic &rarr;
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Volunteer Form Section */}
      <section className="bg-beige/50 py-16 sm:py-24 px-6 scroll-mt-24" id="volunteer">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeIn} className="text-center mb-12 sm:mb-16">
            <SectionLabel>VOLUNTEER</SectionLabel>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-charcoal mt-4 sm:mt-6">
              Join Our Team
            </h2>
          </motion.div>

          <motion.form 
            {...fadeIn} 
            onSubmit={handleVolunteerSubmit}
            className="space-y-6 bg-white p-6 sm:p-8 md:p-12 rounded-3xl shadow-sm border border-charcoal/5"
          >
            {/* Honeypot field */}
            <input type="text" name="honeypot" className="hidden" tabIndex={-1} autoComplete="off" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-charcoal uppercase tracking-wider">Name</label>
                <input 
                  type="text" 
                  autoComplete="name"
                  value={volData.name}
                  onChange={(e) => setVolData({ ...volData, name: e.target.value })}
                  className="w-full bg-beige/30 border border-charcoal/10 rounded-xl px-4 py-3 text-base sm:text-sm focus:outline-none focus:border-charcoal/30 transition-colors min-h-[48px]" 
                  placeholder="Your full name" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-charcoal uppercase tracking-wider">Phone</label>
                <input 
                  type="tel" 
                  inputMode="tel"
                  autoComplete="tel"
                  value={volData.phone}
                  onChange={(e) => setVolData({ ...volData, phone: e.target.value })}
                  className="w-full bg-beige/30 border border-charcoal/10 rounded-xl px-4 py-3 text-base sm:text-sm focus:outline-none focus:border-charcoal/30 transition-colors min-h-[48px]" 
                  placeholder="+91 XXXXX XXXXX" 
                  required 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-charcoal uppercase tracking-wider">Email</label>
                <input 
                  type="email" 
                  inputMode="email"
                  autoComplete="email"
                  value={volData.email}
                  onChange={(e) => setVolData({ ...volData, email: e.target.value })}
                  className="w-full bg-beige/30 border border-charcoal/10 rounded-xl px-4 py-3 text-base sm:text-sm focus:outline-none focus:border-charcoal/30 transition-colors min-h-[48px]" 
                  placeholder="your.email@example.com" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-charcoal uppercase tracking-wider">City / Area</label>
                <input 
                  type="text" 
                  autoComplete="address-level2"
                  value={volData.city}
                  onChange={(e) => setVolData({ ...volData, city: e.target.value })}
                  className="w-full bg-beige/30 border border-charcoal/10 rounded-xl px-4 py-3 text-base sm:text-sm focus:outline-none focus:border-charcoal/30 transition-colors min-h-[48px]" 
                  placeholder="Your locality or city" 
                  required 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-charcoal uppercase tracking-wider">Availability</label>
                <select 
                  value={volData.availability}
                  onChange={(e) => setVolData({ ...volData, availability: e.target.value })}
                  className="w-full bg-beige/30 border border-charcoal/10 rounded-xl px-4 py-3 text-base sm:text-sm focus:outline-none focus:border-charcoal/30 transition-colors min-h-[48px]"
                >
                  <option value="Weekdays">Weekdays</option>
                  <option value="Weekends">Weekends</option>
                  <option value="Both">Both Weekdays & Weekends</option>
                  <option value="Flexible">Flexible / On-Call</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-charcoal uppercase tracking-wider">Preferred Activity</label>
                <select 
                  value={volData.activity}
                  onChange={(e) => setVolData({ ...volData, activity: e.target.value })}
                  className="w-full bg-beige/30 border border-charcoal/10 rounded-xl px-4 py-3 text-base sm:text-sm focus:outline-none focus:border-charcoal/30 transition-colors min-h-[48px]"
                >
                  <option value="Food Distribution">Food Distribution (Humanity)</option>
                  <option value="Animal Feeding (Paws)">Animal Feeding & Care (Paws)</option>
                  <option value="Cooking / Preparation">Cooking & Meal Packaging</option>
                  <option value="Logistics / Coordination">Logistics & Supply Coordination</option>
                  <option value="Social Media & Documentation">Social Media & Documentation</option>
                  <option value="Other">Other / General Volunteer</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-charcoal uppercase tracking-wider">Skills & Experience (Optional)</label>
              <textarea 
                value={volData.skills}
                onChange={(e) => setVolData({ ...volData, skills: e.target.value })}
                className="w-full bg-beige/30 border border-charcoal/10 rounded-xl px-4 py-3 text-base sm:text-sm focus:outline-none focus:border-charcoal/30 transition-colors min-h-[120px]" 
                placeholder="Tell us how you'd like to contribute..."
              ></textarea>
            </div>

            {volError && (
              <p className="text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                {volError}
              </p>
            )}

            {volSubmitted && (
              <p className="text-xs text-green-700 bg-green-50 p-3 rounded-lg border border-green-200">
                Thank you for applying to volunteer with PetBhar! We will reach out to you shortly.
              </p>
            )}

            <button 
              type="submit" 
              disabled={volSubmitting}
              className="w-full bg-charcoal text-ivory py-4 rounded-xl hover:bg-charcoal/90 transition-colors font-medium uppercase tracking-widest text-sm disabled:opacity-50"
            >
              {volSubmitting ? 'Submitting...' : volSubmitted ? 'Application Submitted ✓' : 'Submit Application'}
            </button>
          </motion.form>
        </div>
      </section>

      {/* Partner Section */}
      <section className="bg-ivory py-24 px-6 scroll-mt-24" id="partner">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeIn} className="text-center mb-16">
            <SectionLabel>PARTNER WITH US</SectionLabel>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-charcoal mt-6 mb-6">
              Collaborate
            </h2>
            <p className="text-charcoal/70">
              We work with restaurants, grocery stores, corporations, and other organisations to maximize our impact. Let&apos;s join forces.
            </p>
          </motion.div>

          <motion.form 
            {...fadeIn} 
            onSubmit={handlePartnerSubmit}
            className="space-y-6"
          >
            {/* Honeypot field */}
            <input type="text" name="honeypot" className="hidden" tabIndex={-1} autoComplete="off" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              <input 
                type="text" 
                autoComplete="organization"
                value={partnerData.orgName}
                onChange={(e) => setPartnerData({ ...partnerData, orgName: e.target.value })}
                placeholder="Organisation Name" 
                className="w-full bg-transparent border-b border-charcoal/20 px-0 py-3 text-base sm:text-sm focus:outline-none focus:border-charcoal transition-colors placeholder:text-charcoal/40 min-h-[48px]" 
                required 
              />
              <input 
                type="text" 
                autoComplete="name"
                value={partnerData.contactPerson}
                onChange={(e) => setPartnerData({ ...partnerData, contactPerson: e.target.value })}
                placeholder="Contact Person" 
                className="w-full bg-transparent border-b border-charcoal/20 px-0 py-3 text-base sm:text-sm focus:outline-none focus:border-charcoal transition-colors placeholder:text-charcoal/40 min-h-[48px]" 
                required 
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              <input 
                type="email" 
                inputMode="email"
                autoComplete="email"
                value={partnerData.email}
                onChange={(e) => setPartnerData({ ...partnerData, email: e.target.value })}
                placeholder="Email Address" 
                className="w-full bg-transparent border-b border-charcoal/20 px-0 py-3 text-base sm:text-sm focus:outline-none focus:border-charcoal transition-colors placeholder:text-charcoal/40 min-h-[48px]" 
                required 
              />
              <input 
                type="tel" 
                inputMode="tel"
                autoComplete="tel"
                value={partnerData.phone}
                onChange={(e) => setPartnerData({ ...partnerData, phone: e.target.value })}
                placeholder="Phone Number" 
                className="w-full bg-transparent border-b border-charcoal/20 px-0 py-3 text-base sm:text-sm focus:outline-none focus:border-charcoal transition-colors placeholder:text-charcoal/40 min-h-[48px]" 
              />
            </div>
            <select 
              value={partnerData.type}
              onChange={(e) => setPartnerData({ ...partnerData, type: e.target.value })}
              className="w-full bg-transparent border-b border-charcoal/20 px-0 py-3 text-base sm:text-sm focus:outline-none focus:border-charcoal transition-colors text-charcoal/70 min-h-[48px]"
            >
              <option value="Restaurant / Cafe">Restaurant / Cafe</option>
              <option value="Grocery Store / Supplier">Grocery Store / Supplier</option>
              <option value="Corporate Business">Corporate Business</option>
              <option value="NGO / Trust">NGO / Trust</option>
              <option value="Other">Other</option>
            </select>
            <textarea 
              value={partnerData.message}
              onChange={(e) => setPartnerData({ ...partnerData, message: e.target.value })}
              placeholder="How would you like to partner with us?" 
              className="w-full bg-transparent border-b border-charcoal/20 px-0 py-3 text-base sm:text-sm focus:outline-none focus:border-charcoal transition-colors min-h-[110px] placeholder:text-charcoal/40" 
              required
            ></textarea>

            {partnerError && (
              <p className="text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                {partnerError}
              </p>
            )}

            {partnerSubmitted && (
              <p className="text-xs text-green-700 bg-green-50 p-3 rounded-lg border border-green-200">
                Thank you for your proposal! Our team will reach out to discuss collaboration.
              </p>
            )}
            
            <div className="pt-4 text-center">
              <button 
                type="submit" 
                disabled={partnerSubmitting}
                className="w-full sm:w-auto inline-block px-10 py-4 border border-charcoal text-charcoal rounded-full hover:bg-charcoal hover:text-ivory transition-colors uppercase tracking-widest text-sm disabled:opacity-50 min-h-[48px]"
              >
                {partnerSubmitting ? 'Sending...' : partnerSubmitted ? 'Proposal Sent ✓' : 'Send Proposal'}
              </button>
            </div>
          </motion.form>
        </div>
      </section>

      {/* Volunteer & Donor FAQ Accordion */}
      <section className="py-16 sm:py-20 px-6 bg-beige/30 border-t border-charcoal/5">
        <div className="max-w-4xl mx-auto">
          <FaqAccordion />
        </div>
      </section>

      {/* Feature Modals */}
      <DedicateDriveModal
        isOpen={showDedicateModal}
        onClose={() => setShowDedicateModal(false)}
      />
      <ImpactCardGeneratorModal
        isOpen={showImpactCardModal}
        onClose={() => setShowImpactCardModal(false)}
      />
    </main>
  );
}
