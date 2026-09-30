# PetBhar Initiative — Credentials, Logins & Quick Access Reference

> [!CAUTION]
> This document contains administrative access routes, master passwords, fallback credentials, and system settings. Keep this file private and never share it publicly.

---

## 🔐 1. Admin Portal Login

| Detail | Value |
| :--- | :--- |
| **Admin Login URL** | `https://your-domain.vercel.app/admin`<br>*(Local: `http://localhost:3000/admin`)* |
| **Primary Master Password** | `petbhar2026` |
| **Emergency Fallback PIN** | `1234` |
| **Session Lifetime** | 24 Hours (`HttpOnly`, `SameSite=Lax`, `Secure` Cookie) |
| **Rate Limit** | 15 attempts / 15 mins (50 in local development) |

### What you can do inside the Admin Panel:
- **Edit Impact Numbers**: Update Meals Distributed, Families Supported, People Fed, and Drives.
- **Update PetBhar Paws Record**: Update the number of stray animals fed (e.g. `3+ Stray Animals Fed`).
- **Manage Financial Transparency**: Add and update contributions received, food procurement expenses, and receipt records.
- **Upload Media**: Upload videos and photos directly to the gallery with instant live preview.
- **Review Submissions**: View incoming volunteer applications, partner inquiries, citizen contact messages, and dedicated drive bookings.
- **Configure UPI**: Change the active UPI ID, payee name, and payment barcode.

---

## 🔑 2. Environment Variables & Secrets

These values are configured in `.env.local` for local development and in the **Vercel Project Dashboard** (`Settings > Environment Variables`) for production:

```env
# Master password used to access /admin
ADMIN_PASSWORD=petbhar2026

# Secret key used to encrypt session tokens
ADMIN_SECRET=petbhar_secure_salt_2026

# The public URL of the live deployed application
NEXT_PUBLIC_SITE_URL=https://petbhar.vercel.app
```

---

## 💳 3. Payment & UPI Configuration

| Key | Value | Description |
| :--- | :--- | :--- |
| **UPI ID** | `petbhar@upi` | Destination VPA for donations |
| **Payee Name** | `PETBHAR INITIATIVE` | Display name shown on Google Pay / PhonePe |
| **Barcode Asset** | `/images/petbhar-upi-qr.png` | Scannable high-resolution QR barcode |
| **Bank Account** | `Disabled` by default | Can be toggled on in `data/siteData.json` |

---

## 📬 4. Official Communication Channels

| Channel | Identifier | Purpose |
| :--- | :--- | :--- |
| **Email** | `petbharinitiative@gmail.com` | Official inquiries, receipts & confirmations |
| **Phone & WhatsApp** | `+91 95489 82164` | Ground coordination, donor updates, SOS alerts |
| **Instagram** | `@petbharinitiative` | Social updates, stories, volunteer photos |
| **GitHub Repo** | `https://github.com/kingmhz/petbhar-initiative` | Source code repository |

---

## 🛡️ 5. How to Reset the Admin Password

If you ever need to change the password:
1. **Local Development**:
   - Open `.env.local` and change:
     ```env
     ADMIN_PASSWORD=your_new_password_here
     ```
   - Restart the dev server (`npm run dev`).
2. **Production on Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard) &rarr; select project `petbhar-initiative`.
   - Navigate to **Settings** &rarr; **Environment Variables**.
   - Edit the `ADMIN_PASSWORD` variable and save.
   - Trigger a Redeploy (or push any commit to `main`).
