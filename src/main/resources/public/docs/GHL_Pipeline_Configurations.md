# GHL Pipeline Configurations — Lovoson Media
## Ready-to-Build Specifications

> **Instructions:** Create each pipeline in GHL → Opportunities → Pipelines → Add Pipeline.
> Copy the stage names exactly as written below — automations reference these names.

---

## Pipeline 1: Outbound Prospecting

**Pipeline Name:** `Outbound Prospecting`
**Owner:** DM Setter + Phone Setter

| # | Stage Name | Stage Type | Auto-Move Trigger |
|---|---|---|---|
| 1 | Cold Prospect | Open | Manual add or CSV import |
| 2 | DM Sent | Open | Manual (Setter updates after outreach) |
| 3 | Engaged | Open | Manual (prospect replied) |
| 4 | Warm / Qualified | Open | Manual (passed BANT-lite) |
| 5 | Appointment Booked | Open | Workflow: calendar booking confirmed |
| 6 | Confirmation Call Done | Open | Manual (Phone Setter completes pre-qual) |
| 7 | SET — Ready for Close | Open | Manual (Phone Setter handoff tag applied) |
| 8 | Disqualified | Lost | Manual (fails DQ criteria from SOP §5.2) |

**Required Custom Fields on Opportunities:**
- Lead Temperature (Dropdown: Hot / Warm / Lukewarm / Cold)
- Primary Pain Point (Text)
- Setter Notes (Large Text)
- Lead Source (Dropdown: Instagram / Facebook / LinkedIn / X / Referral / Paid Ads / Website / VSL Funnel)

---

## Pipeline 2: Sales Pipeline

**Pipeline Name:** `Sales Pipeline`
**Owner:** Closer / Sales Lead

| # | Stage Name | Stage Type | Auto-Move Trigger |
|---|---|---|---|
| 1 | Discovery Call Scheduled | Open | Moved from Outbound Prospecting pipeline |
| 2 | Discovery Call Completed | Open | Manual (closer updates post-call) |
| 3 | Proposal Sent | Open | Manual (proposal delivered) |
| 4 | Negotiation | Open | Manual (follow-up in progress) |
| 5 | Closed Won — Starter | Won | Manual → triggers Starter onboarding workflow |
| 6 | Closed Won — Growth Engine | Won | Manual → triggers Growth Engine onboarding workflow |
| 7 | Closed Lost | Lost | Manual |

**Required Custom Fields on Opportunities:**
- Package Type (Dropdown: Starter / Growth Engine)
- Deal Value (Currency)
- Closer Notes (Large Text)
- Current Tools (Text — what CRM/website/booking prospect uses)
- Monthly Marketing Spend (Number)
- Monthly Lead Volume (Number)

---

## Pipeline 3: Client Onboarding & Fulfillment

**Pipeline Name:** `Client Onboarding`
**Owner:** Operations / Fulfillment

| # | Stage Name | Stage Type | Est. Duration |
|---|---|---|---|
| 1 | Onboarding Form Sent | Open | Day 0 |
| 2 | Kickoff Call Scheduled | Open | Day 1-3 |
| 3 | Kickoff Call Completed | Open | Day 3-5 |
| 4 | Website Build — In Progress | Open | Day 5-14 |
| 5 | AI Systems — In Progress | Open | Day 10-18 |
| 6 | Internal QA | Open | Day 18-20 |
| 7 | Client Review & Approval | Open | Day 20-23 |
| 8 | Live & Active | Won | Day 23-28 |
| 9 | 30-Day Check-In | Open | Day 58 |

**Required Custom Fields on Opportunities:**
- Client Niche (Dropdown: HVAC / Dental / MedSpa / Legal / Restaurant / Real Estate / E-Commerce / Consulting / IT / Staffing / Other)
- Google Review Link (URL)
- Client Website URL (URL)
- Onboarding Status (Dropdown: Waiting on Client / In Progress / Blocked / Complete)
- Package Type (Dropdown: Starter / Growth Engine)

---

## Pipeline 4: Client Retention

**Pipeline Name:** `Client Retention`
**Owner:** Account Manager / Ops

| # | Stage Name | Stage Type | Trigger |
|---|---|---|---|
| 1 | Active — Healthy | Open | Auto-moved when client goes live |
| 2 | At Risk | Open | Manual or automated (missed payment, low engagement) |
| 3 | Upsell Opportunity | Open | Starter client hits 90-day mark |
| 4 | Churning | Open | Cancellation request received |
| 5 | Cancelled | Lost | Contract ended |
| 6 | Win-Back | Open | Re-engagement campaign triggered (30+ days post-cancel) |

---

## Setup Checklist

- [ ] Pipeline 1: Outbound Prospecting — created with 8 stages
- [ ] Pipeline 2: Sales Pipeline — created with 7 stages
- [ ] Pipeline 3: Client Onboarding — created with 9 stages
- [ ] Pipeline 4: Client Retention — created with 6 stages
- [ ] All custom fields created (Settings → Custom Fields)
- [ ] Existing "Lovoson Media — Sales" pipeline archived or merged into Pipeline 2
- [ ] Test: manually create an opportunity in each pipeline and move through stages
