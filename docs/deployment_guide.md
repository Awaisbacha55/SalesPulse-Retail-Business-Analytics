# SalesPulse — Cloud Deployment Guide (Free-Tier Architecture)

## 1. Executive Summary

This guide outlines the planned technical architecture and execution roadmap for deploying the **SalesPulse** repository and interactive BI dashboard online using **100% free-tier cloud hosting services**.

> [!NOTE]
> This document serves as an architectural deployment plan. In accordance with safety rules, no external cloud resources have been provisioned and no local database configurations have been altered. Deployment will occur only upon your explicit instruction and provider selection.

---

## 2. Planned Cloud Architecture Overview

```
┌────────────────────────────────────────────────────────────────────────┐
│                          SALESPULSE CLOUD STACK                        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┼───────────────────────────────┐
    │                               │                               │
    ▼                               ▼                               ▼
┌────────────────────────┐  ┌────────────────────────┐  ┌────────────────────────┐
│ 1. Source Code & Docs  │  │ 2. Analytical Database │  │ 3. Cloud BI Dashboard  │
│      GitHub Repo       │  │    Cloud PostgreSQL    │  │     Cloud Metabase     │
│ • Version Control      │  │ • SalesPulse Warehouse │  │ • Public Executive UI │
│ • Documentation Assets │  │ • Supabase / Neon /    │  │ • Render / Railway /   │
│ • SQL & ETL Scripts    │  │   Aiven Free Tier      │  │   Fly.io Free Tier     │
└────────────────────────┘  └───────────┬────────────┘  └───────────┬────────────┘
                                        │                           │
                                        │   PostgreSQL Read-Only    │
                                        │      Connection (SSL)     │
                                        └───────────────────────────┤
                                                                    │
                                                        ┌───────────▼────────────┐
                                                        │ 4. Metabase App DB     │
                                                        │ (Persistent App State) │
                                                        │ • Stores cards, users  │
                                                        │ • Prevents data reset  │
                                                        └────────────────────────┘
```

The system separates the **Analytical Database** (holding the 1.55M Olist records) from the **Metabase Application Database** (storing dashboard layouts, questions, and visual settings) to prevent dashboard state corruption during container sleep cycles.

---

## 3. Recommended Free-Tier Cloud Providers

| Component | Recommended Provider | Free Tier Limits | Key Advantages |
| :--- | :--- | :--- | :--- |
| **Source Code** | **GitHub** | Unlimited public repositories | Native Markdown rendering, image hosting, git tracking |
| **Analytical DB** | **Neon.tech** or **Supabase** | 0.5 GB–1.0 GB storage, compute pooling | PostgreSQL 16/17 native, SSL enforced, high query concurrency |
| **Metabase Host** | **Render.com** or **Koyeb** | 512 MB RAM, 0.1 CPU, free web service | Native Docker support, free automated SSL, GitHub deployment |
| **Metabase State DB** | **Supabase** (Secondary schema) | Free shared PostgreSQL | Guarantees dashboard tiles and configs survive container restarts |

---

## 4. Step-by-Step Deployment Blueprint

### Step 1: Analytical Database Migration to Cloud PostgreSQL

1. **Schema Initialization**:
   Execute [`database/create_tables.sql`](../database/create_tables.sql) against the target cloud PostgreSQL instance using `psql`:
   ```bash
   psql "postgres://[user]:[password]@[host]:5432/[dbname]?sslmode=require" -f database/create_tables.sql
   ```
2. **Dataset Loading**:
   Run the batch ETL ingestion script targeting the cloud connection string via `.env`:
   ```env
   DB_HOST=[cloud-host.neon.tech]
   DB_PORT=5432
   DB_NAME=[dbname]
   DB_USER=[user]
   DB_PASSWORD=[password]
   ```
   Execute the loader:
   ```bash
   python python/import_olist_data.py
   ```
3. **Index & Verification**:
   Execute [`sql/00_verify_tables.sql`](../sql/00_verify_tables.sql) to confirm all 9 tables are populated.

---

### Step 2: Deploying Cloud Metabase on Render (Docker)

1. Sign up for a free account at [Render.com](https://render.com/).
2. Select **New +** $\rightarrow$ **Web Service**.
3. Choose **Deploy an existing image** and specify the official Metabase image:
   `metabase/metabase:latest`
4. Configure Environment Variables for persistent Metabase application state:
   - `MB_DB_TYPE`: `postgres`
   - `MB_DB_DBNAME`: `[metabase_app_db]`
   - `MB_DB_PORT`: `5432`
   - `MB_DB_USER`: `[user]`
   - `MB_DB_PASS`: `[password]`
   - `MB_DB_HOST`: `[cloud-host]`
   - `JAVA_OPTS`: `-Xmx400m` *(Optimizes JVM memory consumption to fit within Render's 512 MB free RAM ceiling)*
5. Click **Create Web Service**. Render will build and expose Metabase at an automated `https://[app-name].onrender.com` URL.

---

### Step 3: Connect Cloud Metabase to SalesPulse Analytical DB

1. Access your live Metabase URL: `https://[app-name].onrender.com`.
2. Connect to the **SalesPulse analytical database** using read-only credentials.
3. Import queries from [`dashboard/dashboard_queries.sql`](../dashboard/dashboard_queries.sql) to build the dashboard cards.

---

### Step 4: Public Dashboard Sharing & Security Hardening

To share the dashboard safely with recruiters without exposing underlying database credentials:
1. Navigate to the **SalesPulse Dashboard** in Metabase.
2. Click the **Sharing & Embedding** icon.
3. Enable **Public Link**.
4. Generate a public, read-only URL.
5. In your cloud PostgreSQL provider, ensure the connecting database user has **read-only privileges** only:
   ```sql
   -- Create dedicated read-only role for Metabase
   CREATE USER metabase_viewer WITH PASSWORD '[secure_random_password]';
   GRANT CONNECT ON DATABASE salespulse TO metabase_viewer;
   GRANT USAGE ON SCHEMA public TO metabase_viewer;
   GRANT SELECT ON ALL TABLES IN SCHEMA public TO metabase_viewer;
   ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO metabase_viewer;
   ```

---

## 5. Free-Tier Limitations & Mitigation Strategies

1. **Render Free-Tier Spin-Down (Inactivity Sleep)**:
   - *Limitation*: Free web services on Render sleep after 15 minutes of inactivity. The initial page load after sleep takes 30–50 seconds.
   - *Mitigation*: Set up a free uptime monitor (e.g., [UptimeRobot](https://uptimerobot.com/)) pinging the Metabase health check endpoint (`/api/health`) every 10 minutes to prevent sleep during interview cycles.
2. **PostgreSQL Cloud Storage Limits**:
   - *Limitation*: Free tiers typically cap storage between 500 MB and 1 GB.
   - *Mitigation*: The complete SalesPulse database (1.55M rows) consumes ~350 MB in PostgreSQL including indexes, fitting comfortably within the 500 MB ceiling. Avoid creating duplicate temporary tables.
3. **RAM Ceiling (512 MB)**:
   - *Limitation*: Metabase runs on the Java Virtual Machine (JVM). Heavy simultaneous analytical queries can trigger Out-Of-Memory (OOM) errors.
   - *Mitigation*: Enforce `JAVA_OPTS=-Xmx400m` and rely on database-level aggregation queries so Metabase processes summarized data rather than raw million-row payloads.

