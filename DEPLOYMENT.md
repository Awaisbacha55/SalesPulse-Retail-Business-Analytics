# SalesPulse — Cloud Deployment Guide (PostgreSQL & Metabase)

This guide provides end-to-end instructions for deploying the **SalesPulse Retail Analytics Warehouse** to cloud PostgreSQL and hosting an interactive **Metabase Business Intelligence Dashboard** online.

For architectural blueprints and container persistence strategies, refer to [`docs/deployment_guide.md`](docs/deployment_guide.md).

---

## 1. Cloud Architecture Overview

```
┌────────────────────────────────────────────────────────────────────────┐
│                          SALESPULSE CLOUD STACK                        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┴───────────────────────────────┐
    │                                                               │
    ▼                                                               ▼
┌────────────────────────┐                      ┌────────────────────────┐
│ 1. Analytical Database │                      │ 2. Cloud BI Dashboard  │
│    Cloud PostgreSQL    │◄── PostgreSQL SSL ───┤     Cloud Metabase     │
│ • 9 Relational Tables  │    Read-Only Query   │ • Interactive Visuals  │
│ • 4 Analytical Views   │    Connection        │ • Global Date Filters  │
│ • Neon / Supabase Host │                      │ • Render / Docker Host │
└────────────────────────┘                      └────────────────────────┘
```

The system separates the **Analytical Database** (housing the 1.55M Olist records) from the **Metabase Application** (which saves card definitions, visual layouts, and public sharing tokens).

---

## 2. Prerequisites

1. **GitHub Account**: Access to [Awaisbacha55/SalesPulse-Retail-Business-Analytics](https://github.com/Awaisbacha55/SalesPulse-Retail-Business-Analytics).
2. **Cloud PostgreSQL Instance**: Free-tier PostgreSQL 16/17 database hosted on [Neon](https://neon.tech/) or [Supabase](https://supabase.com/).
3. **Cloud Host / Container Runner**: Free-tier web service on [Render.com](https://render.com/) or local Docker engine.
4. **Python 3.12+**: Local runtime for running the batch ETL ingestion pipeline.

---

## 3. Step 1: Analytical Database Setup (Cloud PostgreSQL)

1. **Create Target Database**:
   Provision a new PostgreSQL database named `salespulse` in your cloud provider.
2. **Execute DDL Schema**:
   Run [`database/create_tables.sql`](database/create_tables.sql) to generate all 9 tables and analytical B-tree indexes:
   ```bash
   psql "postgres://[user]:[password]@[host]:5432/salespulse?sslmode=require" -f database/create_tables.sql
   ```
3. **Populate Dataset via Python ETL**:
   Update your `.env` with the cloud connection parameters:
   ```env
   DB_HOST=[ep-xyz.us-east-2.aws.neon.tech]
   DB_PORT=5432
   DB_NAME=salespulse
   DB_USER=[username]
   DB_PASSWORD=[password]
   ```
   Execute the batch loader:
   ```bash
   python python/import_olist_data.py
   ```
4. **Deploy Analytical Views**:
   Execute [`sql/04_bonus_views_and_pareto.sql`](sql/04_bonus_views_and_pareto.sql) to compile the 4 reusable analytical views.
5. **Verify Row Counts**:
   Run [`sql/00_verify_tables.sql`](sql/00_verify_tables.sql) to confirm all 1,550,922 rows across all 9 tables are loaded.

---

## 4. Step 2: Deploying Cloud Metabase (Docker on Render or Cloud VM)

1. Sign up for a free account at [Render.com](https://render.com/) or spin up a cloud VM (e.g. AWS EC2/DigitalOcean).
2. For Docker deployment, specify the official Metabase image:
   ```text
   metabase/metabase:latest
   ```
3. Set the environment variable to ensure JVM memory fits within host limits:
   - `JAVA_OPTS`: `-Xmx400m`
4. Launch the web service or container. Metabase will initialize at `http://[host]:3000` or `https://[app-name].onrender.com`.

---

## 5. Step 3: Connect Metabase to PostgreSQL

1. Open your live Metabase instance (e.g., [SalesPulse Live Public Dashboard](http://51.21.250.3:3000/public/dashboard/a9d2ce25-d3b7-4958-8aeb-a9096cb2770f)).
2. Complete the initial admin setup.
3. Select **Add your data** → **PostgreSQL**.
4. Input the connection parameters:
   - **Host**: Your cloud PostgreSQL host (e.g., `ep-xyz.us-east-2.aws.neon.tech`)
   - **Port**: `5432`
   - **Database Name**: `salespulse`
   - **Database Username**: `[your_db_user]`
   - **Database Password**: `[your_db_password]`
   - **SSL**: Enabled (`require`)
5. Click **Connect Database**. Metabase will synchronize table schemas and foreign key relationships.

---

## 6. Step 4: Building Dashboard Cards & Enabling Public Sharing

1. Import or paste the visual queries directly from [`dashboard/dashboard_queries.sql`](dashboard/dashboard_queries.sql).
2. Configure scorecards, monthly revenue trajectories, and SLA correlation charts as documented in [`dashboard/dashboard_overview.md`](dashboard/dashboard_overview.md).
3. Connect the interactive Field Filters (`date_filter`, `state_filter`, `category_filter`) to their respective dashboard widgets.
4. To share the dashboard publicly without requiring login credentials:
   - Open the **SalesPulse Executive Dashboard**.
   - Click the **Sharing & Embedding** icon in the top right.
   - Toggle on **Public Link**.
   - Copy the public dashboard link and share it with reviewers (e.g., `http://51.21.250.3:3000/public/dashboard/a9d2ce25-d3b7-4958-8aeb-a9096cb2770f`).
