# PetBhar Initiative — Deployment & Hosting Guide

This guide explains how to host and deploy the PetBhar website and Admin Portal across popular cloud and server platforms.

---

## 🚀 Deployment Options

### Option 1: Vercel (Fastest & Zero-Configuration)

Vercel is the creator of Next.js and provides instant deployment with zero server maintenance.

1. **Push your code to GitHub / GitLab / Bitbucket**:
   ```bash
   git init
   git add .
   git commit -m "feat: complete PetBhar platform with backend"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```
2. **Import Project into Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new) and select your repository.
   - Framework Preset: **Next.js** (auto-detected).
3. **Configure Environment Variables**:
   In the Vercel dashboard (*Project Settings → Environment Variables*), add:
   - `ADMIN_PASSWORD`: A secure password for the Admin Portal.
   - `ADMIN_SECRET`: A random 32-character secret string.
   - `NEXT_PUBLIC_SITE_URL`: `https://petbhar.org` (or your domain).
   - `NOTIFICATION_WEBHOOK_URL`: (Optional) Discord or Slack webhook for instant alerts.
4. **Click Deploy**:
   Vercel compiles the static pages, serves images via edge CDN, and hosts API endpoints automatically.

---

### Option 2: Docker Container (Render, Railway, Fly.io, or AWS)

A production-ready, multi-stage `Dockerfile` is included in the project root.

#### Running Locally with Docker:
```bash
# 1. Build the production image
docker build -t petbhar-website .

# 2. Run the container on port 3000
docker run -p 3000:3000 \
  -e ADMIN_PASSWORD="your_strong_password" \
  -e ADMIN_SECRET="your_random_secret" \
  petbhar-website
```

#### Deploying on Railway / Render:
1. Connect your GitHub repository.
2. The platform will automatically detect the `Dockerfile`.
3. Add environment variables (`ADMIN_PASSWORD`, `ADMIN_SECRET`).
4. (Optional for Railway/Render) Attach a persistent volume to `/app/data` to persist CMS updates across redeployments.

---

### Option 3: Traditional Linux VPS (Ubuntu / Debian + Nginx + PM2)

If deploying to a VPS (DigitalOcean, Hetzner, AWS EC2, Linode):

1. **SSH into your server and install Node.js 20 & PM2**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo npm install -g pm2
   ```

2. **Clone and Build**:
   ```bash
   git clone <repo-url> /var/www/petbhar
   cd /var/www/petbhar
   npm ci
   npm run build
   ```

3. **Create Production Environment File**:
   ```bash
   cp .env.example .env.local
   nano .env.local
   ```

4. **Start Application with PM2**:
   ```bash
   # In standalone mode
   pm2 start .next/standalone/server.js --name "petbhar" -- -p 3000
   pm2 save
   pm2 startup
   ```

5. **Nginx Reverse Proxy Configuration** (`/etc/nginx/sites-available/petbhar`):
   ```nginx
   server {
       server_name petbhar.org www.petbhar.org;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   Enable SSL with Certbot:
   ```bash
   sudo certbot --nginx -d petbhar.org -d www.petbhar.org
   ```

---

## 🛡️ Health Check & Monitoring

A dedicated health check endpoint is live at:
```http
GET /api/health
```
Response:
```json
{
  "status": "ok",
  "service": "PetBhar Initiative Web & Admin API",
  "timestamp": "2026-09-12T06:47:00.000Z",
  "uptimeSeconds": 1284,
  "environment": "production"
}
```
Use this URL in your cloud provider's health check probe or uptime monitors (e.g. UptimeRobot, BetterUptime).

---

## 🔒 Security Best Practices for Production

1. **Change Default Password**: Never leave `ADMIN_PASSWORD` as `petbhar2026` in production.
2. **Session Cookies**: Cookies automatically use `secure: true` on HTTPS connections and `SameSite: 'lax'`.
3. **Rate Limiting**: Built-in sliding window rate limiting prevents abuse (10 req/min on public forms, 5 attempts/15 min on admin login).
4. **Honeypot Protection**: Anti-bot honeypots transparently drop bot submissions.
