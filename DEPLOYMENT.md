# SalesPulse — Deployment Guide (Vercel & Neon PostgreSQL)

This guide provides end-to-end instructions for deploying the **SalesPulse Retail Analytics Dashboard** to **Vercel** connected to **Neon Serverless PostgreSQL**.

---

## 1. System Architecture

```
                                  +------------------------------+
                                  |   Neon Serverless Postgres   |
                                  |      (Database: salespulse)  |
                                  |  - 9 Relational Tables       |
                                  |  - 4 Materialized Views      |
                                  |  - SSL Encrypted (Port 5432) |
                                  +--------------+---------------+
                                                 ^
                                                 | Server-side pg Pool
                                                 | (SSL rejectUnauthorized: false)
                                                 v
+-------------------------------+  HTTPS JSON    +------------------------------+
|     Vercel Client Browser     | <------------> |   Next.js 15 Serverless API  |
|  - React 19 / Tailwind CSS    |                |  - /api/overview             |
|  - Interactive Recharts       |                |  - /api/revenue              |
|  - Global State & Category    |                |  - /api/products, /api/sla   |
|    Filters                    |                |  - Parameterized SQL Caching |
+-------------------------------+                +------------------------------+
```

---

## 2. Prerequisites

1. **GitHub Account**: Access to repository [Awaisbacha55/SalesPulse-Retail-Business-Analytics](https://github.com/Awaisbacha55/SalesPulse-Retail-Business-Analytics).
2. **Neon PostgreSQL Account**: Active instance hosting the `salespulse` database with the 9 Olist tables and 4 views populated.
3. **Vercel Account**: Free tier hobby account on [vercel.com](https://vercel.com).
4. **Node.js**: Version 18.x or 20.x installed locally (for optional local testing).

---

## 3. Step-by-Step Vercel Web Deployment (Recommended)

### Step 1: Sign in to Vercel
1. Go to [https://vercel.com](https://vercel.com) and log in using your GitHub account.

### Step 2: Import the GitHub Repository
1. On your Vercel Dashboard, click **Add New...** $\rightarrow$ **Project**.
2. Under "Import Git Repository", locate `Awaisbacha55/SalesPulse-Retail-Business-Analytics` and click **Import**.

### Step 3: Configure Project Root Directory (CRITICAL)
Because the Next.js application lives inside the `salespulse-dashboard/` folder:
1. In the **Project Settings** screen, find **Root Directory**.
2. Click **Edit** and set the path to:
   ```text
   salespulse-dashboard
   ```
3. Click **Continue**. (Vercel will automatically detect the **Next.js** framework preset).

### Step 4: Add Environment Variables
Expand the **Environment Variables** accordion and add your database connection string:

| Key | Example Value | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql://<username>:<password>@ep-xyz.us-east-2.aws.neon.tech/salespulse?sslmode=require` | Neon connection string with SSL |

> **Security Note**: Never commit your real database password or `.env.local` to Git. Only paste it directly into Vercel's secure environment variable form.

*Optional individual fallback variables (if not using `DATABASE_URL`):*
```env
PGHOST=ep-xyz.us-east-2.aws.neon.tech
PGDATABASE=salespulse
PGUSER=neondb_owner
PGPASSWORD=your_neon_password_here
PGPORT=5432
PGSSLMODE=require
```

### Step 5: Deploy
1. Click **Deploy**.
2. Vercel will install dependencies (`npm install`), execute the Next.js production build (`next build`), and deploy the app to global edge networks.
3. Once completed (approx. 60–90 seconds), you will receive a public production URL (e.g. `https://salespulse-retail-business-analytics.vercel.app`).

---

## 4. Alternative: Deploy via Vercel CLI

If you prefer deploying via your terminal:

```bash
# 1. Install Vercel CLI globally
npm install -g vercel

# 2. Navigate to dashboard directory
cd salespulse-dashboard

# 3. Authenticate and link project
vercel login
vercel

# 4. Set production environment variable
vercel env add DATABASE_URL production
# (Paste your Neon PostgreSQL connection string when prompted)

# 5. Deploy to Production
vercel --prod
```

---

## 5. Local Development and Verification

Before deploying to Vercel or when testing locally:

```bash
# 1. Navigate to dashboard directory
cd salespulse-dashboard

# 2. Copy example environment file
cp .env.example .env.local

# 3. Populate .env.local with your database credentials
# DATABASE_URL=postgresql://postgres:password@localhost:5432/salespulse

# 4. Install dependencies
npm install

# 5. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 6. Post-Deployment Verification Checklist

Verify that all features are functioning smoothly on your deployed Vercel URL:

- [ ] **Neon Connection Status**: Top header shows the green `"Neon PostgreSQL Connected"` badge.
- [ ] **Overview KPIs**: Total Revenue displays `R$ 13.59M`, Orders `99,441`, and AOV `R$ 137.75`.
- [ ] **Interactive Filters**: Changing State (e.g., `SP`) or Category dynamically updates KPI cards and Recharts.
- [ ] **Navigation Routes**:
  - `/` — Executive Overview
  - `/revenue` — Monthly GMV velocity and MoM growth rate
  - `/products` — Top revenue categories, Pareto analysis, and top SKUs
  - `/customers` — Retention donut, customer lifetime value segments
  - `/regions` — Geographic state distribution and GMV share
  - `/delivery` — Logistics SLA compliance and star rating penalty
  - `/insights` — 5 empirical insights and 3 executive action recommendations
- [ ] **Responsive Design**: Test desktop, tablet, and mobile views.

---

## 7. Troubleshooting & Common Questions

### Q1: Vercel shows "Internal Server Error (500)" on API routes
- **Cause**: The `DATABASE_URL` is missing or the database user has insufficient privileges.
- **Fix**: In Vercel Project Settings $\rightarrow$ Environment Variables, verify `DATABASE_URL` is configured for **Production**, **Preview**, and **Development**. Ensure `?sslmode=require` is present at the end of the connection string.

### Q2: Build fails on Vercel with "Cannot find module"
- **Cause**: The **Root Directory** in Vercel settings was left as `./` instead of `salespulse-dashboard`.
- **Fix**: Go to Vercel $\rightarrow$ Project Settings $\rightarrow$ General $\rightarrow$ Root Directory, set to `salespulse-dashboard`, and trigger a Redeploy.

### Q3: Neon Connection Timeout / Too Many Clients
- **Cause**: Serverless functions spawning concurrent connections.
- **Fix**: `salespulse-dashboard/lib/db.ts` uses connection pooling with `max: 10` and `idleTimeoutMillis: 30000`. In Neon, use the pooled connection string (`-pooler` in the host name) if high concurrency is expected.

