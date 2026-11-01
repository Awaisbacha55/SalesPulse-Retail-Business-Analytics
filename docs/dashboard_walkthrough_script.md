# SalesPulse — 3-Minute Video Walkthrough Script (Loom / YouTube)

This presentation script is prepared for recording a **2 to 3-minute video walkthrough** for portfolio presentations, LinkedIn posts, Loom recordings, and technical recruiter evaluations.

---

## Video Outline & Time Breakdown

```
  0:00 - 0:30  │  Introduction, Business Problem & Architecture
  0:30 - 1:00  │  Data Quality Forensic & Review PK Resolution
  1:00 - 1:45  │  Advanced SQL Analytics (CTEs, Window Functions, Pareto)
  1:45 - 2:30  │  Metabase Interactive Executive Dashboard Walkthrough
  2:30 - 3:00  │  Core Commercial Insights, Recommendations & Wrap-Up
```

---

## Presentation Script

### 1. Introduction & The Business Problem (0:00 – 0:30)
> *"Hello! My name is Muhammad Awais, and today I'm excited to present **SalesPulse — Retail Business Analytics with SQL**.*  
> *In fast-growing e-commerce marketplaces, executive managers often ask analysts the exact same questions every single week: What is our revenue growth? Which categories drive margin? Why are customers leaving bad reviews?*  
> *SalesPulse solves this by transforming over 100,000 real Brazilian e-commerce orders from Olist into a centralized PostgreSQL 17 data warehouse, a library of 39+ trusted SQL queries, and a self-service Business Intelligence dashboard in Metabase."*

---

### 2. Relational Architecture & Data Quality Engineering (0:30 – 1:00)
*(Screen share: Show `images/salespulse_erd.png` in DBeaver)*  
> *"Our database models the entire transaction lifecycle across 9 relational tables and 1.55 million records.  
> Before loading data, I built automated Python validation scripts to audit primary keys. That audit uncovered a critical real-world anomaly: **814 duplicate review IDs** in the reviews dataset.  
> Rather than blindly dropping records, I investigated the root cause: when customers bought multi-item orders, the system reused review IDs for distinct order feedback. To prevent dropping legitimate reviews, I engineered a surrogate primary key (`review_record_id`), successfully preserving 100% of customer evaluations."*

---

### 3. Advanced SQL Analytics: CTEs, Window Functions & Pareto (1:00 – 1:45)
*(Screen share: Show `sql/02_joins_and_cte_analysis.sql` and `sql/03_window_functions.sql` in DBeaver)*  
> *"Next, I authored over 39 production SQL queries organized across aggregations, multi-table joins, CTEs, and advanced window functions.  
> Using window functions like `LAG()`, `SUM() OVER`, and `ROW_NUMBER()`, I tracked month-over-month revenue growth, cumulative financial milestones, and rolling 3-month moving averages.  
> In our bonus analysis, I performed a **Pareto 80/20 analysis**: we proved that the top **25.9% of product SKUs generate 80% of total platform revenue** (R\$ 16.01M total GMV across 99,440 orders)."*

---

### 4. Interactive Metabase Executive Dashboard (1:45 – 2:30)
*(Screen share: Show `images/dashboard_preview.png` or live Metabase dashboard)*  
> *"To make these insights accessible to non-technical stakeholders, I constructed this interactive Metabase dashboard.  
> Across the top, our executive scorecards track core North Star metrics: **R\$ 16.01 million in revenue**, an **Average Order Value of R\$ 160.99**, and a **91.89% on-time delivery rate**.  
> Down below, managers can filter by date range, Brazilian state, and product category.  
> Notice this critical correlation: orders delivered on time average **4.29 out of 5 stars**, but when a package is delayed, satisfaction plunges to **2.57 stars** — a massive 1.72-star drop. This proves that logistics transit times, not product defects, are the primary driver of customer dissatisfaction."*

---

### 5. Strategic Recommendations & Conclusion (2:30 – 3:00)
> *"Based on these findings, I formulated three data-backed recommendations:  
> 1. Implement automated 48-hour carrier SLA alerts to reroute delayed packages proactively.  
> 2. Launch targeted re-engagement campaigns to address our **3.12% repeat purchase rate**, converting one-time buyers into loyal repeat customers.  
> 3. Establish localized micro-fulfillment hubs in São Paulo and Rio de Janeiro, which together generate over **51%** of all platform sales.  
> The full SQL codebase, database schemas, and documentation are available on my GitHub repository. Thank you!"*

---

## Recording Checklist for Loom / YouTube

- [ ] Audio clear and microphone tested.
- [ ] Browser window sized to 1080p (1920x1080).
- [ ] DBeaver open with `02_joins_and_cte_analysis.sql` and ERD ready.
- [ ] Metabase dashboard open in fullscreen preview.
- [ ] GitHub repository tab open at `https://github.com/Awaisbacha55/SalesPulse-Retail-Business-Analytics`.

