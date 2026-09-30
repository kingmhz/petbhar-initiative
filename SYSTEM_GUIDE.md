# PetBhar Initiative — Complete System & Architecture Guide

A comprehensive architectural manual covering the frontend, backend, programming languages, API routes, security model, data storage, and administration for the **PetBhar Initiative** platform.

---

## 📑 Table of Contents
1. [Executive Overview](#1-executive-overview)
2. [Programming Languages & Core Technologies](#2-programming-languages--core-technologies)
3. [Frontend Architecture](#3-frontend-architecture)
4. [Backend & API Architecture](#4-backend--api-architecture)
5. [Logins, Credentials & Authentication](#5-logins-credentials--authentication)
6. [Data Storage & Schemas](#6-data-storage--schemas)
7. [Security & Rate Limiting](#7-security--rate-limiting)
8. [Deployment & Operations](#8-deployment--operations)

---

## 1. Executive Overview

**PetBhar Initiative** is a dual-mission grassroots humanitarian and animal welfare web application. The platform serves two primary goals:
1. **Community Hunger Relief**: Organizing food drives, hot cooked meals, and dry ration kit distribution for underserved families and daily-wage laborers.
2. **PetBhar Paws**: Grassroots street animal feeding drives, fresh terracotta water points, nutrition bowls, and emergency rescue beacons.

The web platform is built for high speed, zero latency, 100% financial transparency, and mobile accessibility across India with instant UPI QR payments.

---

## 2. Programming Languages & Core Technologies

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Language** | **TypeScript** | `v5.x` | Strongly typed superset of JavaScript ensuring compile-time bug prevention. |
| **Frontend Framework** | **React** | `v19.2.x` | Modern UI library utilizing Server and Client Components, hooks, and virtual DOM. |
| **Fullstack Meta-Framework** | **Next.js** | `v16.3.4` | App Router, Turbopack engine, serverless Route Handlers, and static optimization. |
| **Styling & Design System** | **Tailwind CSS** | `v4.x` | Utility-first CSS framework with high-performance PostCSS engine and custom color tokens. |
| **Animation Engine** | **Framer Motion** | `v13.2.x` | Smooth page transitions, Ken Burns hero motion, modal entrance animations, and counters. |
| **Iconography** | **Lucide React** | `v1.43.x` | Clean, accessible SVG vector icons. |
| **Backend Runtime** | **Node.js** | `v20+` / `v26+` | Serverless runtime executing API route handlers and file operations. |

### Why TypeScript?
- **Type Safety**: Prevents runtime errors like `Cannot read properties of undefined`.
- **Self-Documenting Models**: Data types such as `SiteConfig`, `Project`, and `Report` are strictly typed in `src/lib/siteConfig.ts`.
- **Compile-Time Validation**: Running `npx tsc --noEmit` verifies the entire codebase before any production deployment.

### Why React 19 & Next.js 16?
- **Hybrid Rendering**: Combines Static Site Generation (SSG) for ultra-fast load times on informational pages with Dynamic Route Handlers for the admin portal and form submissions.
- **Turbopack**: Next-generation bundler delivering near-instant local compilation and fast builds.
- **Zero-Friction API Routes**: Next.js App Router integrates backend endpoints directly inside `src/app/api/` without requiring an external Express or Django server.

---

## 3. Frontend Architecture

### Directory Layout
```
src/
├── app/                      # Next.js App Router pages and API routes
│   ├── page.tsx              # Homepage (Hero, Impact band, Calculator & Barcode, Pillars, CTA)
│   ├── layout.tsx            # Root layout (Header, Footer, LanguageProvider, Toast container)
│   ├── about/page.tsx        # Mission, founding story, philosophical values
│   ├── work/page.tsx         # Food relief drives, gallery lightbox, video player
│   ├── paws/page.tsx         # PetBhar Paws stray animal welfare, feeding record, SOS beacon
│   ├── transparency/page.tsx # 100% public financial ledger, Ground Economics, audits
│   ├── get-involved/page.tsx # Donation tiers, dedicate drive, volunteer & partner forms
│   ├── contact/page.tsx      # Contact details, WhatsApp trigger, messaging form
│   ├── admin/page.tsx        # Secure admin panel with live data editor and media manager
│   └── api/                  # Backend Route Handlers (see Section 4)
├── components/
│   ├── layout/               # Header, Navigation, Footer, Language Switcher
│   ├── sections/             # Page sections (Hero, Impact, HomePillars, GroundEconomics, etc.)
│   ├── features/             # Interactive widgets (ImpactSimulator, PaymentBarcode, Modals)
│   └── ui/                   # Atomic UI elements (Button, ImpactCounter, SectionHeading)
├── context/
│   └── LanguageContext.tsx   # Bilingual context (English & Hindi) with persistent preference
└── lib/
    ├── siteConfig.ts         # Data models and site configuration loader
    ├── upi.ts                # Cross-platform UPI deep-link and intent generator
    ├── auth.ts               # Timing-safe cryptographic authentication
    └── rateLimit.ts          # IP-based sliding window rate limiter
```

### Page Route Overview

1. **Homepage (`/`)**:
   - `Hero`: High-impact cinematic banner with 1-click UPI popup and dedicate drive modal.
   - `Impact`: 5 live animated counter metrics (*Meals Distributed, Families Supported, People Fed, Community Drives, Stray Animals Fed*).
   - `ImpactSimulator` + `PaymentBarcode`: Side-by-side interactive impact calculator and direct UPI payment barcode.
   - `HomePillars`: 3 cards linking to `/work`, `/paws`, and `/transparency`.
   - `EmotionalBanner`: Closing call-to-action with direct support buttons.

2. **Our Work (`/work`)**:
   - Detailed project records with status badges (*planned*, *active*, *completed*).
   - Video player showcase and photo lightbox gallery.

3. **PetBhar Paws (`/paws`)**:
   - Stray animal welfare initiative.
   - Live fed counter (`3+ Animals Fed`), bowl nutrition breakdown, and Emergency Rescue SOS Beacon.

4. **Transparency & Public Ledger (`/transparency`)**:
   - Complete financial transparency: funds collected vs. field expenditures.
   - `GroundEconomics`: Unit breakdown showing cost of meals (₹30) and animal bowls (₹15).
   - Verified procurement bills and public audit ledger.

5. **Get Involved (`/get-involved`)**:
   - Donation methods, Dedicate a Drive form, Impact Card Generator, and Volunteer/Partner forms.

6. **Admin Panel (`/admin`)**:
   - Master login dashboard allowing instant editing of metrics, stray animal counts, and media uploads.

---

## 4. Backend & API Architecture

The backend operates via **Next.js Serverless Route Handlers** (`src/app/api/`) deployed seamlessly to Vercel's global edge network.

### API Routes Specification

| Route | Method | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `/api/admin/login` | `POST` | Public (Rate-limited) | Validates admin password and issues an HTTP-only session cookie. |
| `/api/admin/logout` | `POST` | Public | Clears the `admin_session` cookie. |
| `/api/admin/data` | `GET` | Public | Returns current `siteData.json` configuration. |
| `/api/admin/data` | `POST` | Admin Only | Updates impact stats, projects, animals fed, and financial ledger. |
| `/api/admin/upload` | `POST` | Admin Only | Multipart file upload for photos and videos to `public/uploads/`. |
| `/api/admin/submissions` | `GET` | Admin Only | Retrieves all form submissions (volunteers, partners, contacts). |
| `/api/volunteer` | `POST` | Public (Rate-limited) | Submits volunteer applications into `data/submissions.json`. |
| `/api/partner` | `POST` | Public (Rate-limited) | Submits partner/restaurant inquiries. |
| `/api/contact` | `POST` | Public (Rate-limited) | Submits general contact messages. |
| `/api/dedicate` | `POST` | Public (Rate-limited) | Submits dedicated feeding drive requests. |
| `/api/beacon` | `POST` | Public (Rate-limited) | Submits emergency SOS alerts for hunger or injured animals. |
| `/api/wall` | `GET` / `POST` | Public | Wall of Kindness testimonials and gratitude notes. |
| `/api/health` | `GET` | Public | System status health check. |

---

## 5. Logins, Credentials & Authentication

### Admin Portal Credentials
- **Admin Portal URL**: `/admin` (e.g., `https://your-domain.vercel.app/admin` or `http://localhost:3000/admin`)
- **Primary Master Password**: `petbhar2026`
- **Emergency Fallback PIN**: `1234`
- **Configurable Env Variable**: `ADMIN_PASSWORD` in `.env.local` or Vercel dashboard.

### Session Management
- **Token Generation**: Uses SHA-256 hash of `${ADMIN_PASSWORD}:${ADMIN_SECRET}`.
- **Cookie Security**:
  - `HttpOnly: true` (Inaccessible to client-side JavaScript, prevents XSS token theft).
  - `Secure: true` (Enforced on production HTTPS).
  - `SameSite: Lax` (Protects against CSRF attacks).
  - `Max-Age: 86400` (Session valid for 24 hours).

### Official Contact & UPI Identifiers
- **Default Contact Email**: `petbharinitiative@gmail.com`
- **Default WhatsApp & Phone**: `+91 95489 82164`
- **Default UPI ID**: `petbhar@upi` (customizable via Admin Dashboard)
- **Payee Name**: `PETBHAR INITIATIVE`
- **UPI Barcode Asset**: `public/images/petbhar-upi-qr.png`

---

## 6. Data Storage & Schemas

### 1. `data/siteData.json`
Stores the core dynamic state of the organization:
```json
{
  "org": {
    "name": "PetBhar",
    "fullName": "PetBhar Initiative",
    "tagline": "No one should sleep hungry.",
    "mission": "...",
    "description": "...",
    "philosophy": "...",
    "values": ["Food", "Dignity", "Hope"]
  },
  "contact": {
    "email": "petbharinitiative@gmail.com",
    "phone": "+91 95489 82164",
    "whatsapp": "+91 95489 82164",
    "instagram": "petbharinitiative",
    "youtube": ""
  },
  "upi": {
    "id": "petbhar@upi",
    "qrImage": "/images/petbhar-upi-qr.png",
    "payeeName": "PETBHAR INITIATIVE"
  },
  "impact": {
    "peopleFed": 0,
    "familiesSupported": 0,
    "mealsDistributed": 0,
    "communitiesReached": 0,
    "animalsFed": 3
  },
  "transparency": {
    "contributionsReceived": 0,
    "foodPurchased": 0,
    "mealsDistributed": 0,
    "groceryKitsDistributed": 0,
    "familiesSupported": 0
  },
  "projects": [...]
}
```

### 2. `data/submissions.json`
Stores user interactions:
- `volunteers`: Name, phone, email, city, availability, skills.
- `partners`: Organization name, contact person, business type, message.
- `contacts`: General citizen inquiries.
- `dedications`: Birthday/anniversary drive dedication bookings.
- `beacons`: Emergency location coordinates, incident description, photo URLs.

---

## 7. Security & Rate Limiting

1. **Timing-Safe Password Validation**:
   - Uses `crypto.timingSafeEqual` over SHA-256 digested buffers in [`src/lib/auth.ts`](file:///c:/Users/hasan/Documents/PetBhar%20website/src/lib/auth.ts).
   - Completely immunizes the portal against timing attacks that try to guess passwords character-by-character.
2. **IP Rate Limiting**:
   - Implemented in [`src/lib/rateLimit.ts`](file:///c:/Users/hasan/Documents/PetBhar%20website/src/lib/rateLimit.ts).
   - `/api/admin/login`: Maximum 15 attempts per 15-minute sliding window (50 in development).
   - Form submissions: Protected against automated spam bursts with HTTP 429 Retry-After headers.
3. **Environment Isolation**:
   - Secrets are loaded exclusively from `.env.local` (local) and Vercel Encrypted Environment Variables (production).
   - No private keys or admin passwords are ever committed to public repositories.

---

## 8. Deployment & Operations

### Useful CLI Commands

```bash
# Start local development server (http://localhost:3000)
npm run dev

# Run TypeScript compilation check
npx tsc --noEmit

# Test full Next.js production build
npm run build

# Deploy to production via Vercel CLI
npx vercel --prod

# Check current Vercel deployment status
npx vercel ls
```

### Environment Variables Matrix

| Variable | Required | Description | Example |
| :--- | :---: | :--- | :--- |
| `ADMIN_PASSWORD` | **Yes** | Master password for `/admin` portal | `petbhar2026` |
| `ADMIN_SECRET` | **Yes** | 32-character secret salt for session tokens | `petbhar_secure_salt_2026` |
| `NEXT_PUBLIC_SITE_URL` | **Yes** | Canonical base URL of the website | `https://petbhar.vercel.app` |
| `VERCEL_OIDC_TOKEN` | Auto | Managed automatically by Vercel CLI | *Vercel Managed* |
