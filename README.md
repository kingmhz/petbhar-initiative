# PetBhar Initiative — Grassroots Hunger Relief & Animal Welfare

A modern, fast, and transparent platform powering community food drives, ration distribution, and street animal feeding & rescue.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fkingmhz%2Fpetbhar-initiative&env=ADMIN_PASSWORD,ADMIN_SECRET,NEXT_PUBLIC_SITE_URL)

---

## 🌟 Key Features
- **Instant UPI Direct Contribution**: Scannable, high-contrast QR barcode support for Google Pay, PhonePe, Paytm, and BHIM with zero middleman deductions.
- **Micro-Impact Simulator**: Dynamic calculator displaying meal, ration kit, and animal bowl breakdown for any contribution amount.
- **Dedicate a Drive**: Personalized community food distribution drives for birthdays, anniversaries, or memorial remembrances with custom field banners and WhatsApp photo dispatch.
- **Wall of Kindness**: Public gratitude and impact stories feed with moderation control.
- **PetBhar Paws Animal Welfare**: Dedicated stray animal feeding drives, clean water bowls, and rescue network.
- **Emergency SOS Beacon**: Citizen reporting tool for acute hunger or injured street animals.
- **Public Transparency Audit**: Open accounting ledger displaying contributions received vs. field groceries purchased.
- **Bilingual Interface**: Seamless instant English & Hindi language switcher.

---

## 🛠️ Tech Stack
- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Typography**: Playfair Display (Serif) & Inter (Sans)

---

## 🚀 Free Hosting Deployment (Vercel)

The recommended free platform is **[Vercel](https://vercel.com)** (created by Next.js):
- **100% Free Forever** on the Hobby Plan.
- **Zero Config**: Next.js App Router and API routes deploy out of the box.
- **Automatic SSL & Global CDN**: Free SSL certificate and high-speed global delivery.
- **Continuous Deployment**: Every push to `main` automatically triggers a zero-downtime release.

### Deploy Steps:
1. Go to **[vercel.com/new](https://vercel.com/new)**.
2. Sign in with GitHub and select repository **`kingmhz/petbhar-initiative`**.
3. In **Environment Variables**, add:
   - `ADMIN_PASSWORD`: Your secret admin portal password
   - `ADMIN_SECRET`: A 32-character random string for session encryption
   - `NEXT_PUBLIC_SITE_URL`: `https://your-project.vercel.app` (or your custom domain)
4. Click **Deploy**. Your site goes live in ~45 seconds!

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Run production build & verify
npm run build
```

---

## 🔐 Admin Portal
Access the administration dashboard at `/admin` to:
- Review & approve Wall of Kindness messages
- Monitor citizen SOS beacons & volunteer applications
- Update transparency numbers and site data
- Emergency fallback PIN: `1234`

