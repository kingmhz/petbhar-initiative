'use client';
import { useState } from 'react';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Phone } from 'lucide-react';
import { InstagramIcon, GmailIcon, WhatsAppIcon } from '@/components/ui/SocialIcons';
import { EmailModal } from '@/components/ui/EmailModal';
import config from '@/lib/siteConfig';

export function Contact() {
  const [purpose, setPurpose] = useState('General enquiry');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, contact, purpose, message }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
        setName('');
        setContact('');
        setMessage('');
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        setError(data.error || 'Failed to send message. Please try again.');
      }
    } catch {
      setError('Connection error. Please try again or email us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(config.contact.email)}`;

  return (
    <section className="bg-ivory py-10 md:py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-start">
          <div>
            <ScrollReveal>
              <SectionLabel>CONTACT</SectionLabel>
              <SectionHeading className="mt-4">
                Let&apos;s do some good<br />together.
              </SectionHeading>
              
              <div className="mt-6 space-y-3.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <button 
                    type="button"
                    onClick={() => setEmailModalOpen(true)}
                    className="group flex items-center gap-3 text-warm-grey hover:text-charcoal transition-all duration-300 text-left cursor-pointer"
                    title="Click for email options (Gmail, default mail app, copy address)"
                  >
                    <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-white shadow-xs border border-charcoal/10 group-hover:border-[#EA4335]/35 group-hover:shadow-[0_2px_12px_rgba(234,67,53,0.18)] transition-all">
                      <GmailIcon size={18} />
                    </span>
                    <span className="group-hover:text-charcoal transition-colors font-medium">{config.contact.email}</span>
                  </button>

                  <div className="flex items-center gap-1.5 text-[11px]">
                    <a
                      href={gmailWebUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-0.5 rounded-lg bg-white border border-charcoal/10 hover:border-[#EA4335] text-warm-grey hover:text-[#EA4335] transition-all flex items-center gap-1 shadow-2xs font-medium"
                      title="Compose directly in Gmail"
                    >
                      <GmailIcon size={12} />
                      <span>Gmail ↗</span>
                    </a>
                    <a
                      href={`mailto:${config.contact.email}`}
                      className="px-2 py-0.5 rounded-lg bg-white border border-charcoal/10 hover:border-charcoal/30 text-warm-grey hover:text-charcoal transition-all flex items-center gap-1 shadow-2xs font-medium"
                      title="Open default system mail app"
                    >
                      <span>Mail ↗</span>
                    </a>
                  </div>
                </div>
                {config.contact.instagram && (
                  <a 
                    href={config.socials.instagram || `https://instagram.com/${config.contact.instagram}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="ig-btn group flex items-center gap-3 text-warm-grey transition-all duration-300"
                  >
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-charcoal/5 group-hover:bg-transparent border border-charcoal/5 group-hover:border-transparent transition-all duration-300 shadow-none group-hover:shadow-[0_0_18px_rgba(255,0,105,0.45)]">
                      <InstagramIcon size={24} />
                    </span>
                    <span className="font-medium transition-all group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#FF7A00] group-hover:via-[#FF0069] group-hover:to-[#D300C5]">
                      @{config.contact.instagram.replace(/^https?:\/\/(www\.)?instagram\.com\//, '').replace(/^@/, '')}
                    </span>
                  </a>
                )}
                {config.contact.whatsapp && (
                  <a 
                    href={`https://wa.me/${config.contact.whatsapp.replace(/\D/g, '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="group flex items-center gap-3 text-warm-grey hover:text-charcoal transition-all duration-300"
                  >
                    <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-white shadow-xs border border-charcoal/10 group-hover:border-[#25D366]/40 group-hover:shadow-[0_2px_12px_rgba(37,211,102,0.22)] transition-all">
                      <WhatsAppIcon size={19} />
                    </span>
                    <span className="transition-colors group-hover:text-charcoal">{config.contact.whatsapp}</span>
                  </a>
                )}
                {config.contact.phone && (
                  <a 
                    href={`tel:${config.contact.phone.replace(/[^+\d]/g, '')}`} 
                    className="group flex items-center gap-3 text-warm-grey hover:text-charcoal transition-all duration-300"
                  >
                    <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-50 text-[#007AFF] border border-blue-200/80 shadow-xs group-hover:bg-[#007AFF] group-hover:text-white group-hover:border-[#007AFF] group-hover:shadow-[0_2px_12px_rgba(0,122,255,0.35)] transition-all">
                      <Phone className="h-4 w-4" />
                    </span>
                    <span className="transition-colors group-hover:text-charcoal">{config.contact.phone}</span>
                  </a>
                )}
              </div>
            </ScrollReveal>
          </div>

          <div>
            <ScrollReveal delay={0.2}>
              <form onSubmit={handleSubmit} className="rounded-2xl border border-charcoal/5 bg-white p-6 sm:p-8 shadow-sm">
                {/* Honeypot field for anti-spam */}
                <input type="text" name="honeypot" className="hidden" tabIndex={-1} autoComplete="off" />
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-xs uppercase tracking-wider text-warm-grey">I want to:</label>
                    <select 
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      className="w-full rounded-xl border border-charcoal/10 bg-transparent px-4 py-3 text-base sm:text-sm outline-none transition focus:border-charcoal/30 focus:ring-0 min-h-[48px]"
                    >
                      <option value="Donate">Donate</option>
                      <option value="Volunteer">Volunteer</option>
                      <option value="Partner">Partner</option>
                      <option value="Support PetBhar Paws">Support PetBhar Paws</option>
                      <option value="General enquiry">General enquiry</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs uppercase tracking-wider text-warm-grey">Name</label>
                    <input 
                      type="text" 
                      required 
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full rounded-xl border border-charcoal/10 bg-transparent px-4 py-3 text-base sm:text-sm outline-none transition focus:border-charcoal/30 focus:ring-0 min-h-[48px]" 
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs uppercase tracking-wider text-warm-grey">Email / Phone</label>
                    <input 
                      type="text" 
                      required 
                      autoComplete="email tel"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="How can we reach you?"
                      className="w-full rounded-xl border border-charcoal/10 bg-transparent px-4 py-3 text-base sm:text-sm outline-none transition focus:border-charcoal/30 focus:ring-0 min-h-[48px]" 
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs uppercase tracking-wider text-warm-grey">Message</label>
                    <textarea 
                      rows={4} 
                      required 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us how you'd like to help or connect..."
                      className="w-full rounded-xl border border-charcoal/10 bg-transparent px-4 py-3 text-base sm:text-sm outline-none transition focus:border-charcoal/30 focus:ring-0" 
                    />
                  </div>
                </div>

                {error && (
                  <p className="mt-4 text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
                    {error}
                  </p>
                )}

                {submitted && (
                  <p className="mt-4 text-xs text-green-700 bg-green-50 p-2.5 rounded-lg border border-green-200">
                    Thank you for reaching out. We will get back to you shortly.
                  </p>
                )}

                <Button 
                  variant="primary" 
                  type="submit" 
                  className="mt-6 w-full justify-center disabled:opacity-50 min-h-[48px]"
                  onClick={() => {}}
                >
                  {submitting ? 'Sending...' : submitted ? 'Message Sent ✓' : 'Send Message'}
                </Button>
              </form>
            </ScrollReveal>
          </div>
        </div>
      </div>

      <EmailModal 
        isOpen={emailModalOpen} 
        onClose={() => setEmailModalOpen(false)} 
        email={config.contact.email} 
      />
    </section>
  );
}

export default Contact;

