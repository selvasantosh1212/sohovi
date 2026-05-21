# Agency Client Onboarding & Account Access Collector — Full Product Plan

## Table of Contents
1. Product Vision
2. The Problem (Deep Dive)
3. Target Customer Analysis
4. Competitive Landscape
5. Core Feature Set (MVP)
6. Advanced Feature Set (V2)
7. AI Integration Strategy
8. Platform Coverage & Access Guides
9. Technical Architecture
10. Security & Compliance
11. White-Label & Agency Branding
12. Pricing Strategy
13. Go-to-Market Strategy
14. Revenue Projections & Milestones
15. Product Roadmap
16. Key Risks & Mitigations
17. Success Metrics

---

## 1. Product Vision

**Product Name (working):** AccessKit

**One-liner:** The fastest way for digital marketing agencies to collect account access from clients — no email chains, no screenshots of wrong screens, no week-long delays.

**Vision Statement:** Become the de facto access handshake layer between agencies and their clients — the moment a contract is signed, an AccessKit link goes out, and within 24 hours the agency has everything they need to start delivering results.

**Core Promise:**
- For agencies: reduce "time to access granted" from 5-7 days to under 24 hours
- For clients: a guided, branded, zero-confusion experience that builds trust from day one
- For the relationship: remove the most common source of early friction that leads to 90-day churn

---

## 2. The Problem (Deep Dive)

### The Onboarding Access Crisis

Every digital marketing agency faces the same wall at the start of every client engagement. The contract is signed. The kickoff call is scheduled. And then nothing can actually begin because the agency doesn't have access to the client's accounts.

The typical sequence:
1. Agency sends email: "Can you add us as admin on your Google Ads account?"
2. Client doesn't know how. Googles it. Gets confused. Sends a screenshot of the wrong screen.
3. Agency sends a Loom video. Client watches it on mute. Clicks wrong thing.
4. Agency follows up 3 times over 5 days.
5. Client partially completes access (wrong permission level).
6. Agency corrects it. Delays project start by 7-10 days.

This plays out across EVERY platform: Google Ads, Meta Business Manager, GA4, Shopify, LinkedIn Ads, TikTok Ads, Google Search Console, Klaviyo — each with its own interface, terminology, and permission levels.

### Why It's Getting Worse

- **Platform fragmentation**: The average agency now needs access to 6-8 platforms per client (was 2-3 in 2018)
- **Client tech illiteracy**: Business owners increasingly delegate admin tasks to assistants who don't have access either
- **Platform UI churn**: Meta, Google, and TikTok change their admin interfaces frequently — Loom videos go stale within months
- **Multi-stakeholder confusion**: The person who signed the contract is rarely the person who controls the ad accounts

### The True Cost

For a 5-person agency onboarding 3 clients/month:
- 3 hours of PM time per client chasing access × 3 clients = 9 hours/month lost
- At $100/hour billable rate = $900/month in unbillable lost time
- Delayed project starts = delayed results = increased 90-day churn risk
- Compounded: 12 months × $900 = **$10,800/year in direct lost value per agency**

The emotional cost is just as real: client frustration before work even begins, agency team morale drain, and a weakened first impression at the most critical moment of a new relationship.

---

## 3. Target Customer Analysis

### Primary Customer: The Small-to-Mid Agency

**Profile:**
- 1–15 person teams
- Specializations: paid media (PPC), SEO, social media, full-service performance marketing
- Onboard 2–6 new clients per month
- Clients are SMBs (local businesses, e-commerce brands, professional services)
- Revenue: $200K–$2M ARR
- Tools already in stack: Slack, Notion, ClickUp/Asana, Google Workspace

**Pain Intensity: HIGH**
They feel this problem viscerally every month. They have no budget or time to build internal tooling. They are highly price-sensitive but will pay $50-150/month for something that saves real hours.

**Decision Maker:** Agency owner or operations manager. Sales cycle is short (days, not months). No procurement committee.

### Secondary Customer: The Freelance Performance Marketer

**Profile:**
- Solo operator or 2-3 person micro-agency
- Manages 5–15 client accounts simultaneously
- Specializes in Google Ads, Meta, or both
- Revenue: $50K–$250K/year
- Often uses minimal tooling; relies on email and spreadsheets

**Pain Intensity: VERY HIGH**
Every hour chasing access is an hour not billing. Has no assistant to delegate to. Values any automation that reduces administrative overhead.

**Decision Maker:** Themselves. Will pay $20–50/month without hesitation if ROI is clear.

### Tertiary Customer: The Marketing Consultant

**Profile:**
- Embedded or fractional CMO/marketing lead
- Works with 3–8 clients simultaneously
- Needs access to audit or inherit accounts from previous agencies
- Often inherits access chaos from prior engagements

**Pain Intensity: MODERATE-HIGH**
Access collection is part of their audit process. A clean, professional access request builds credibility with new clients.

### Customer Segments NOT to Target (Initially)
- Enterprise agencies (100+ employees): complex procurement, want enterprise contracts
- White-glove boutiques: "we handle everything ourselves" mentality
- Non-marketing agencies (legal, HR): different access needs entirely

### Customer Empathy Map

| Dimension | Detail |
|-----------|--------|
| **Think** | "This should be a 10-minute task — why does it take a week?" |
| **Feel** | Frustrated, powerless, professionally embarrassed |
| **Say** | "We're waiting on the client to grant access" |
| **Do** | Send Loom videos, build Notion checklists, follow up 3–5 times via email |

---

## 4. Competitive Landscape

### Direct Competitors

**Leadsie** (leadsie.com)
- Strongest direct competitor
- Covers 31 platforms including Meta, Google, Shopify, LinkedIn, X, TikTok
- Single link, client connects everything at once
- Clean UI, good platform coverage
- **Weakness:** Primarily OAuth-based (automated connection), less guidance for manual permission flows. Limited AI features. No white-label on lower tiers.
- **Pricing:** ~$29–79/month

**AgencyAccess** (agencyaccess.co)
- Branded onboarding links, guided access flow
- Good coverage of major platforms
- **Weakness:** Less active development, smaller community, limited integrations
- **Pricing:** ~$49/month

**Connexify** (connexify.io)
- Focused on Meta, Google, Shopify primarily
- Simpler feature set
- **Weakness:** Narrower platform coverage, less polish

### Indirect Competitors

**Notion/Google Docs templates** — Free, widely used, but no tracking, no automation, no completion notification

**Loom video walkthroughs** — Effective but go stale when platform UIs change, no completion tracking

**OnboardingMap / Fuzen.io** — Broader onboarding tools; access collection is a secondary feature

### Competitive Positioning: How AccessKit Wins

1. **More guided than Leadsie** — richer step-by-step instructions that update when platforms change UIs
2. **More intelligent** — AI-generated access checklists tailored to the specific service type
3. **More trackable** — real-time status per platform, per client
4. **More integrated** — connects collected access into the agency's existing tools (CRM, project management)
5. **More branded** — every client-facing touchpoint is the agency's brand, not AccessKit's

---

## 5. Core Feature Set (MVP — Months 1-3)

### 5.1 Agency Dashboard

**Onboarding Request Builder**
- Agency selects which platforms to request (checkboxes: Google Ads, Meta, GA4, Shopify, etc.)
- Optionally adds custom notes per platform ("we need access to the MCC, not just the account")
- Selects permission level needed per platform (View, Standard, Admin)
- Names the client and engagement
- System generates a unique branded link

**Client Tracker (Request Pipeline View)**
- Kanban or list view of all active onboarding requests
- Status per client: Sent → In Progress → Partially Complete → Complete
- Status per platform within each client: Pending / Granted / Not Applicable
- Overdue indicators (>48 hours on same step)
- Notification log (who was nudged, when)

**Notification System**
- Email + in-app alerts when:
  - Client opens the link
  - Client marks a platform as complete
  - All platforms are marked complete
  - Client has been stuck on a step for >24 hours (configurable)

### 5.2 Client-Facing Access Guide (The Magic Link)

This is the core product experience. When a client clicks the link:

**Branded Welcome Screen**
- Agency logo and name prominently displayed
- Friendly explanation: "To start working on your campaigns, we need view/manage access to the following platforms. This guide will walk you through each one — it takes about 15 minutes total."
- Progress bar showing overall completion

**Per-Platform Step-by-Step Guide**
- Platform logo and name
- Estimated time: "~3 minutes"
- Difficulty level: Easy / Medium (sets expectations)
- Step-by-step instructions with annotated screenshots showing exactly where to click
- Permission level explanation in plain English: "We're requesting Standard access, which means we can manage your campaigns but cannot access your billing information"
- Completion checkbox: "I've completed this step" — marks as done for agency

**Platform-Specific Fallback Options**
- If client can't find the right screen: "Click here to see an alternate path"
- "I'm having trouble" — surfaces a pre-written email the client can send internally to whoever has access
- "This platform isn't set up yet" — marks as N/A, alerts agency

**Completion Summary**
- Shows which platforms were completed
- Thank you message with agency branding
- Optional next step preview: "Your account manager will reach out within 24 hours"

### 5.3 Platform Library (MVP Coverage — 8 Platforms)

1. **Google Ads** — MCC link request + direct user addition paths
2. **Meta Business Manager** — Partner access + Page/Ad Account/Pixel assignment
3. **Google Analytics 4 (GA4)** — Property-level user addition
4. **Shopify** — Staff account creation with permission matrix
5. **Google Search Console** — User addition with role selection
6. **LinkedIn Campaign Manager** — User addition, connection requirement handling
7. **TikTok Business Center** — Ads account permission assignment
8. **Klaviyo** — User invitation flow

### 5.4 Agency Settings & Branding

- Upload agency logo
- Set primary brand color (used in client link header)
- Custom welcome message template
- Email signature for notification emails
- Custom domain for links (e.g., `onboard.youragency.com`) — paid tier

---

## 6. Advanced Feature Set (V2 — Months 4-9)

### 6.1 Expanded Platform Coverage (20+ Platforms)

- Google Tag Manager — Container access
- HubSpot — User invitation with role selection
- Mailchimp — Audience/account access
- WooCommerce — Admin user addition
- Semrush — User invitation
- Ahrefs — Workspace access
- Hotjar — Site access sharing
- Stripe — Team member invitation
- ActiveCampaign — User invitation
- Bing/Microsoft Ads — User access
- Pinterest Ads — Business access
- Snapchat Ads — Member invitation
- YouTube / Google Merchant Center

### 6.2 Access Health Monitoring

Post-onboarding value: keep monitoring access state.
- Periodic checks: "Is the agency still listed as an active user on this account?"
- Alert agency if access is removed (client offboards or accidentally revokes access)
- Access expiry reminders (some platforms have expiring invitations)
- Annual access audit report: "You have active access to 47 client accounts across these platforms"

### 6.3 Re-Onboarding & Access Transfer

When a client switches agencies:
- **Access Offboarding** flow: guide client through removing previous agency access
- **Access Transfer** flow: remove old agency, add new agency in one session
- Documentation trail: timestamped log of who had access when

### 6.4 CRM & Project Management Integrations

- **Zapier/Make webhooks**: trigger automations when access is granted
- **HubSpot integration**: update deal stage when onboarding is complete
- **ClickUp/Asana/Monday**: create "Campaign Launch" task automatically when all access granted
- **Slack integration**: post to agency's #new-clients channel when a client finishes
- **Google Workspace**: auto-share relevant Drive folders when access complete

### 6.5 Client Questionnaire Module

Combine access collection with intake:
- Pre-access questions: "What is your monthly ad budget?", "Who are your main competitors?", "What's your primary conversion goal?"
- Asset collection: upload brand logo, fonts, brand guidelines
- Legal/compliance consent: "I confirm I have the authority to grant the above access"
- NDA acknowledgment if required

### 6.6 Template Library

Agency-created reusable templates:
- "E-commerce Performance Bundle" — Shopify, Meta, Google Ads, GA4, Klaviyo
- "SEO Audit Bundle" — GSC, GA4, Ahrefs/Semrush, GTM
- "Paid Social Bundle" — Meta, TikTok, LinkedIn, Pinterest
- Community sharing: agencies publish and import each other's templates

### 6.7 Analytics & Reporting

- Average time-to-complete per platform (benchmark against industry average)
- Client completion rates (where do clients get stuck?)
- Platform abandon rates (which platforms cause the most friction?)
- Team performance: which account managers send links fastest?
- Month-over-month onboarding velocity

---

## 7. AI Integration Strategy

AI is not a gimmick here — it directly reduces agency and client friction at multiple points in the workflow.

### 7.1 AI Access Checklist Generator

**Problem Solved:** Agency services vary — "SEO + Paid Media" needs different platforms than "E-commerce + Email Marketing." A generic checklist is wrong for every client.

**How it Works:**
- Agency describes the engagement in plain English: "Performance marketing for a DTC skincare brand — Google Shopping, Meta prospecting and retargeting, email via Klaviyo, Shopify store"
- AI parses the description and auto-generates the exact platform checklist with correct permission levels per platform
- Example output: "Based on your engagement, you need: Google Ads (Admin — for MCC link), Google Merchant Center (Standard), Meta Business Manager (Admin), Klaviyo (Manager), Shopify (Marketing Manager role), GA4 (Editor)"
- Agency reviews, adjusts, and sends

**Model:** Claude API (claude-sonnet-4-6) with a structured prompt and platform permission knowledge base as context.

### 7.2 AI-Powered Step Updater

**Problem Solved:** Meta, Google, and TikTok change their UIs constantly. Static screenshots go stale within months. Clients follow outdated instructions and get lost.

**How it Works:**
- Automated browser agent periodically navigates each platform's admin flows
- Detects when UI elements have moved, been renamed, or removed
- Flags instructions for human review or auto-updates low-risk changes (text changes, menu renames)
- Agency notified: "Meta's Business Manager interface updated — your client guides have been refreshed"
- Full version history of guide changes maintained

**Technical Approach:** Headless browser (Playwright) + screenshot diff comparison + LLM-based change detection and rewrite.

### 7.3 AI Client Support Chat (Embedded in Link)

**Problem Solved:** Client clicks the link at 9pm, gets stuck on step 3 of Meta Business Manager, has no one to ask, abandons.

**How it Works:**
- Embedded chat widget on the client-facing access link (no login required)
- Powered by Claude API with all platform access documentation as context
- Handles questions like:
  - "I don't see the Partners option in my Business Settings"
  - "What does 'Standard' access mean? Will you see my billing?"
  - "I'm a co-owner, not the primary admin — can I still grant access?"
- If AI can't resolve: escalates to agency (email + in-app alert with conversation transcript)
- All conversations logged for agency review

### 7.4 Intelligent Nudge Engine

**Problem Solved:** Client gets the link, completes 2 of 5 platforms, and then life gets in the way for 3 days.

**How it Works:**
- AI monitors completion patterns across all clients in real time
- Identifies the stall point (which platform/step is most commonly abandoned at each agency)
- Generates personalized follow-up messages, not generic "reminder" emails:
  - **Day 1 after stall:** "Quick note — looks like you got to the Meta Business Manager step. Here's a direct link to the exact page you need..."
  - **Day 3:** "Need help? Here's a 2-minute walkthrough specifically for this step..."
  - **Day 5:** Option to schedule a 10-minute screen-share with the agency
- Tone calibrated to client profile: professional for enterprise, casual for small business

### 7.5 Permission Level Advisor

**Problem Solved:** Agencies sometimes request the wrong access level — too much (scares clients into hesitating), too little (can't actually do the work).

**How it Works:**
- Agency describes what they need to do on each platform
- AI recommends the minimum permission level that enables the work
- Example: "You need to create and edit campaigns but not manage billing — that maps to 'Standard' in Google Ads, not 'Admin'"
- Generates client-facing privacy-reassuring copy: "Standard access means we can manage your campaigns but we cannot view or change your payment information"

### 7.6 Post-Onboarding Access Anomaly Detection

**Problem Solved:** A client's intern accidentally revoked agency access from GA4 last month. The agency has been pulling stale reports for weeks without knowing.

**How it Works:**
- AI monitors connected platform APIs (where available via OAuth) for access state changes
- Detects access revocations, permission downgrades, account deletions
- Immediate alert to agency: "Your access to Acme Corp's GA4 property was removed 2 days ago. Send a re-access request?"
- One-click to re-send the relevant section of the original onboarding guide

---

## 8. Platform Coverage & Access Guide Details

### What Every Guide Must Include

Each platform guide must contain:
- **Admin prerequisites**: what role the client needs to hold before they can add anyone
- **Multiple access paths**: most platforms have 2-3 different routes to the same place
- **Screenshot gallery**: annotated, current screenshots (reviewed quarterly minimum)
- **Permission matrix**: what each role level can and cannot do, in plain English — no jargon
- **Common errors**: "If you see this error message, it means X. Do Y to fix it."
- **Verification step**: "After granting access, here's what the confirmation screen looks like"

### Google Ads (Critical)

- **Two distinct flows**: Direct user addition vs. MCC (Manager Account) link request
- **MCC is strongly preferred** for agencies — client provides 10-digit Customer ID, agency sends link request from their MCC, client approves in the Managers tab
- **Permission levels**: Admin, Standard, Read-only, Email only
- **Common failure**: Client grants Read-only when Standard is needed
- **Edge case**: Client's Google Ads account is already linked to a previous agency's MCC — requires unlinking first before a new MCC can be connected

### Meta Business Manager (Most Complex)

- **Architecture confusion**: Meta Business Suite ≠ Meta Business Manager ≠ Ads Manager — clients confuse these constantly
- **Multiple asset types**: Ad Account, Page, Pixel, Catalog, Instagram Account — each must be granted separately
- **Partner flow (B2B) vs. People flow (individual)**: Agencies must use the Partner flow, not individual user addition
- **Common failure**: Client sends their Business Portfolio ID instead of their Business ID (different fields, similar names)
- **Edge case**: Client's ad account is personal (not under a Business Manager) — requires migration to a Business Manager before partner access can be granted

### Google Analytics 4

- **Account level vs. Property level**: Granting at account level gives access to ALL properties — usually not what's intended
- **Recommended role for agencies**: Editor (can configure events, goals, audiences — needed for proper campaign measurement)
- **Common failure**: Client adds agency to old Universal Analytics property instead of GA4
- **Edge case**: Property is inside a Google Marketing Platform organization — completely different access path

### Shopify

- **Staff account limits by plan**: Basic = 2 staff, Shopify = 5 staff, Advanced = 15 staff
- **Role categories**: Full permissions vs. granular (Orders, Products, Reports, Marketing, etc.)
- **Minimum agency needs**: Orders (view), Products (view), Analytics, Online Store, Marketing
- **Common failure**: Client invites the wrong email address (agency personal email vs. agency team email)

### LinkedIn Campaign Manager

- **Connection requirement**: Can only add members who are 1st, 2nd, or 3rd-degree LinkedIn connections
- **Roles**: Account Manager (full control), Campaign Manager (campaigns + ads), Creative Manager (ads only)
- **Common failure**: Client tries to add agency but they're not connected — must send a LinkedIn connection request first

### TikTok Business Center

- **Business Center required**: Client must have a Business Center set up (not just a personal TikTok account)
- **Roles**: Admin (full), Operator (campaigns + finances), Analyst (view only)
- **Common failure**: Client tries to share from TikTok personal profile instead of Business Center

### Google Search Console

- **Verified Owner vs. Delegated Owner**: Only Verified Owners can add others; Delegated Owners can be added/removed by Verified Owners
- **Roles**: Verified Owner, Delegated Owner, Full User, Restricted User
- **Recommended**: Full User for agencies (view all reports, submit sitemaps)
- **Common failure**: Client adds agency as Restricted User, limiting report access

### Klaviyo

- **Roles**: Analyst (view only), Manager (create/edit campaigns and flows), Admin (full access including billing)
- **Recommended**: Manager role for agencies
- **Security note**: Klaviyo Terms of Service explicitly prohibit password sharing — user invitation is the only compliant method
- **Common failure**: Client sends login credentials instead of using the invite system

---

## 9. Technical Architecture

### Recommended Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Frontend | Next.js (App Router), React, TypeScript, Tailwind CSS | Consistent with existing Sohovi patterns |
| Backend | Supabase (PostgreSQL) + Server Actions | Same stack, row-level security for agency isolation |
| Auth | Clerk | Agency users authenticated; client links are token-based (no client login required) |
| Email | Resend or Postmark | Transactional emails: link delivery, completion notifications, nudges |
| AI | Anthropic Claude API (claude-sonnet-4-6) | Checklist generation, support chat, nudge messages, permission advisor |
| File Storage | Supabase Storage or Cloudflare R2 | Brand assets (logos, guide screenshots) |
| Scheduled Jobs | Supabase Edge Functions (cron) or Inngest | Access health monitoring, automated nudges, UI change detection |
| Analytics | PostHog or Plausible | Product analytics, funnel analysis, feature adoption tracking |
| Payments | Stripe | Subscription billing, plan management |

### Core Data Model

```sql
agencies
  id, clerk_user_id, name, logo_url, brand_color, custom_domain, plan, created_at

onboarding_requests
  id, agency_id, client_name, client_email, token (uuid), status,
  template_id, created_at, completed_at

request_platforms
  id, request_id, platform_slug, permission_level,
  status (pending/granted/na), completed_at, notes

guide_steps
  id, platform_slug, step_number, title, body (markdown),
  screenshot_url, last_verified_at, version

notifications
  id, agency_id, request_id, event_type, sent_at, channel (email/in-app)

nudge_log
  id, request_id, message, sent_at, channel, outcome (opened/completed/ignored)
```

### Client Magic Link Flow

```
Agency creates request
  → system generates UUID token
  → creates onboarding_request record
  → sends email to client with link

Client opens /onboard/{token}
  → no auth required
  → server validates token (not expired, exists)
  → renders branded guide for requested platforms

Client completes each platform
  → updates request_platforms.status = 'granted'
  → triggers real-time notification to agency
  → progress bar updates

All platforms complete
  → onboarding_request.status = 'complete'
  → agency receives completion notification
  → optional: Zapier webhook fires to CRM
```

### Security Architecture

- Token is UUID v4 (128-bit entropy) — not guessable by brute force
- Token expiry: 30 days (configurable per agency)
- No client PII stored beyond name + email
- No platform credentials ever stored — access is granted through official platform permission flows only
- All agency data isolated by `agency_id` with Supabase Row Level Security policies
- Rate limiting on token validation endpoint (prevent enumeration)
- All connections over TLS 1.3, data encrypted at rest (AES-256)

---

## 10. Security & Compliance

### Non-Negotiables

**Never store passwords.** The entire product philosophy is that access is granted through official platform permission systems — no credential sharing, no password vaults for client accounts. This is both legally correct and the only approach platforms permit in their Terms of Service.

**Data minimization.** Only collect what's needed: client name, email, which platforms were granted access on which date. No behavioral tracking of clients beyond completion status.

**Full audit trail.** Every access grant, status change, and nudge logged with timestamp and actor.

### Compliance Roadmap

| Certification | Target | Why |
|--------------|--------|-----|
| GDPR / CCPA | Launch | Required for EU clients from day one |
| SOC 2 Type II | Month 18 | Required to sell to agencies with enterprise clients |
| ISO 27001 | Month 24 | Long-term enterprise credibility |

### Agency-Specific Compliance Features

- **Data Processing Agreement (DPA)** available for download — agencies need this for EU clients
- **Client data deletion**: agency can purge any client's onboarding record at contract end
- **Access log export**: timestamped record of all access events exportable as PDF/CSV (valuable if client disputes arise)

---

## 11. White-Label & Agency Branding

White-labeling is a primary differentiator. Agencies sell their services on professionalism — an onboarding experience that exposes a third-party tool undermines that positioning.

### Branding Tiers

**Starter (Solo plan):**
- Agency logo + name in header
- "Powered by AccessKit" in small footer text
- Custom welcome message

**Professional (Agency plan):**
- Full logo replacement
- Brand primary color applied throughout
- Custom subdomain: `onboard.youragency.com`
- No "Powered by AccessKit" attribution
- Custom email "From" name (e.g., "Acme Digital Agency")

**Agency+ plan:**
- Custom root domain: `onboarding.youragency.com`
- Custom email domain: notifications from `noreply@youragency.com`
- Agency-editable notes added to each platform's guide steps
- White-label PDF export of completed access summary

### The Upsell Psychology

The moment an agency sends their first client a link branded "Powered by AccessKit," they feel the gap. The upgrade to fully white-labeled is obvious and immediately worth the cost. This is a high-conversion tier transition built into the product experience itself.

---

## 12. Pricing Strategy

### Tiers

| Plan | Price | Key Limits |
|------|-------|-----------|
| **Solo** | $29/mo or $290/yr | 1 user, 5 active requests, 8 platforms, AccessKit branding |
| **Agency** | $69/mo or $690/yr | 5 users, unlimited requests, 20+ platforms, full white-label, Zapier |
| **Agency+** | $149/mo or $1,490/yr | Unlimited users, AI features, custom domain, health monitoring, API |
| **Enterprise** | From $299/mo | Multiple brands, SSO, SOC 2 docs, dedicated account manager |

### Pricing Logic

- **Annual plans**: 2 months free (17% discount) — target 40% of sign-ups choosing annual
- **14-day free trial**, no credit card required — reduce sign-up friction
- **First onboarding request free** (freemium hook) — lets freelancers experience the core value before paying
- **Entry-level price-matches Leadsie ($29)** — removes "just use Leadsie" objection at the bottom tier
- **AI features locked to Agency+** — drives upgrades from Agency tier as AI features become proven

### Revenue Projections

| Month | Agencies | Avg Revenue/Agency | MRR |
|-------|----------|-------------------|-----|
| 1 | 15 | $29 | $435 |
| 3 | 30 | $40 | $1,200 |
| 6 | 75 | $55 | $4,125 |
| 12 | 200 | $59 | $11,800 |
| 18 | 500 | $59 | $29,500 |

**Path to $10K MRR:** ~170 agencies at $29, or ~90 at $69, or a realistic mix of tiers. Achievable by Month 10-12.

---

## 13. Go-to-Market Strategy

### Phase 1: Zero-Cost Community Distribution (Months 1-3)

**Target Communities:**
- Reddit: r/PPC, r/digital_marketing, r/agency — post genuinely useful content about the access problem, include tool link
- Facebook Groups: "Digital Marketing Agency Owners", "PPC Chat"
- LinkedIn: "The 5-day access problem" thought leadership posts targeting agency personas
- Twitter/X: engage authentically with agency owners complaining about onboarding delays

**Direct Outreach (100-person list):**
- Find agency owners on LinkedIn searching "PPC agency owner" / "Google Ads freelancer"
- Personalized cold DM: "Saw your post about waiting on client access — built something to fix that, want early access?"
- Offer 3 months free for honest product feedback

**Agency Slack Groups:**
- Traffic Think Tank, Agency Collective, PPC Chat
- These communities are highly trusted; one authentic post from a member outperforms a paid ad

### Phase 2: SEO Content Moat (Months 3-9)

**Target Keywords (high intent, low competition):**
- "how to get client google ads access"
- "client won't grant meta business manager access"
- "agency onboarding checklist template"
- "how to give agency access to shopify"
- "GA4 grant access to agency"

Each platform access guide built into the product doubles as a rankable, evergreen blog post. These are searched by agencies at the exact moment of experiencing the pain.

**YouTube:**
- "How to get Google Ads access from a client (2026)"
- "Meta Business Manager access — what your clients need to do"
- Positioned as neutral, helpful tutorials — not branded ads — that funnel to AccessKit

### Phase 3: Partnership & Ecosystem (Months 6-18)

**Integration-as-Distribution:**
- AgencyAnalytics: "When you create a new client, automatically send them an AccessKit onboarding link"
- ClickUp / Asana: publish "Agency Client Onboarding" project template that includes AccessKit step
- Zapier / Make: AccessKit as a featured app in agency automation templates

**Referral Program:**
- Agency coaches/consultants have direct access to dozens of agency owners each
- 20% recurring commission for lifetime of referred customer
- Target: agency-focused LinkedIn creators with 10K+ followers

**Shopify Partner Program:**
- 1M+ Shopify agency partners who need client store access constantly
- AccessKit listed as a recommended tool in the Shopify Partner ecosystem

### Phase 4: Product-Led Growth (Month 9+)

**The Built-In Viral Loop:**
- Every client who receives an AccessKit link sees the product
- Some of those clients are agency owners or freelancers themselves
- Subtle "Get your own AccessKit" CTA on the completion screen (removable on Agency+ tier)
- Estimated viral coefficient: 0.1–0.2 (every 5–10 agencies brings 1 organic new agency)

**Case Studies:**
- "How [Agency Name] cut onboarding time from 7 days to 18 hours"
- Feature customers prominently on website and in community posts

---

## 14. Feature Prioritization Matrix

| Feature | Impact | Effort | Priority |
|---------|--------|--------|----------|
| Core 8-platform guides | High | Medium | P0 — MVP |
| Agency dashboard (request builder + tracker) | High | Medium | P0 — MVP |
| Client magic link | High | Low | P0 — MVP |
| Email notifications | High | Low | P0 — MVP |
| Completion tracking per platform | High | Low | P0 — MVP |
| Agency branding (logo + color) | Medium | Low | P0 — MVP |
| AI checklist generator | High | Medium | P1 — Month 3 |
| Zapier webhook integration | Medium | Low | P1 — Month 3 |
| Custom subdomain | Medium | Low | P1 — Month 3 |
| AI nudge engine | High | Medium | P1 — Month 4 |
| Additional 15+ platforms | Medium | High | P1 — Month 4 |
| Access health monitoring | Medium | High | P2 — Month 6 |
| AI client support chat | High | High | P2 — Month 6 |
| Analytics dashboard | Medium | Medium | P2 — Month 6 |
| Client questionnaire module | Medium | Medium | P2 — Month 5 |
| Re-onboarding / access transfer flows | Low | Low | P2 — Month 5 |
| Template library + community | Low | Medium | P3 — Month 9 |
| SOC 2 Type II certification | Low | Very High | P3 — Month 18 |

---

## 15. Product Roadmap

### Month 1-2: Foundation (MVP)
- Agency dashboard: request builder + pipeline tracker
- Client magic link with 8-platform guide library
- Annotated screenshot galleries for all 8 platforms
- Email notification system (link sent, platform completed, all complete)
- Basic agency branding (logo + primary color)
- Stripe payment integration
- ProductHunt launch

### Month 3-4: Distribution & Intelligence
- AI checklist generator (Claude API)
- Custom subdomain support (`onboard.youragency.com`)
- Zapier / Make webhook integration
- Slack notification integration for agencies
- SEO blog posts for each platform guide
- Reddit / community distribution push

### Month 5-6: Depth
- Expand platform library to 20+
- AI intelligent nudge engine
- Client questionnaire + asset collection module
- Access health monitoring (beta, OAuth-based platforms)
- Analytics dashboard (completion rates, platform abandon points)

### Month 7-9: Ecosystem
- AgencyAnalytics integration
- HubSpot CRM deal-stage automation
- ClickUp / Asana task creation automation
- AI client support chat (Claude-powered, embedded in link)
- Template library with community sharing

### Month 10-12: Scale
- Enterprise tier
- API access for Agency+ tier
- Access offboarding and transfer flows
- Referral / affiliate program launch
- Target milestone: $10K MRR

### Month 13-18: Moat Building
- SOC 2 Type II audit and certification
- White-label reseller program (agencies resell AccessKit under their brand to sub-agencies)
- AI UI change detection — auto-updating guide screenshots when platforms redesign
- Vertical-specific editions: E-commerce Pack, SEO Pack, Paid Social Pack

---

## 16. Key Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Leadsie copies AI features | High | Medium | Speed to market; lock AI as primary moat before they react |
| Platform UIs change faster than guides update | High | High | AI-assisted monitoring + community-flagged updates |
| Low free-to-paid conversion rate | Medium | High | Optimize first-run experience; show time-saved calculator on dashboard |
| Enterprise sales cycle too slow | Low | Low | Stay SMB-focused for first 12 months |
| Clients refuse to use a link (prefer email) | Medium | Low | Embed in agency email workflows via Zapier; one-click email templates |
| Agencies decide to build internally | Low | Medium | Ongoing AI features create compounding build complexity |
| Platform changes OAuth scopes or API access | Medium | Medium | Maintain instruction-based fallback for all platforms |

---

## 17. Success Metrics

**North Star Metric:** Median time-to-access-granted (link sent → all platforms complete)
- Baseline (current industry): 5-7 days
- Target: under 24 hours

**Product Health Metrics:**

| Metric | Target |
|--------|--------|
| Completion rate per platform | >80% |
| Average completion time | <24 hours |
| Agency NPS | >50 |
| Monthly churn rate | <3% |
| Free-to-paid conversion | >15% |
| Annual plan take rate | >35% |
| Viral coefficient | >0.10 |

**Business Metrics:**
- MRR growth rate: >15%/month for first 12 months
- CAC payback period: <3 months
- LTV:CAC ratio: >5:1

---

## Summary

AccessKit is a focused, high-value SaaS tool that solves a universally felt and consistently underserved pain point for digital marketing agencies. The problem is evergreen — as long as agencies onboard clients and platforms exist, the access collection problem exists. The core MVP is achievable in 4-6 weeks. The AI layer — particularly the checklist generator, intelligent nudges, and self-updating guides — creates a durable competitive moat that instruction-based competitors cannot easily replicate. White-label capability and integration ecosystem make it sticky. Distribution through agency communities is low-cost and highly targeted. The path to $10K MRR is clear and conservative, reachable by Month 10-12 with consistent execution.

The single biggest differentiator over existing competitors (Leadsie, AgencyAccess) is combining guided human-readable instructions with AI intelligence — so the product gets smarter over time while competitors maintain static guides that age poorly.
