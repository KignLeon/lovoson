# GHL Tags & Custom Fields — Lovoson Media
## Complete Configuration Reference

> **Instructions:** Create all tags in Settings → Tags. Create all custom fields in Settings → Custom Fields.
> Use exact names below — workflows and automations reference these strings.

---

## Tags — Full Taxonomy

### Source Tags (How the lead found us)
```
source:instagram
source:facebook
source:linkedin
source:x-twitter
source:cold-outreach
source:referral
source:paid-ads
source:organic-website
source:vsl-funnel
source:old-list
```

### Status Tags (Where the lead/client stands)
```
status:cold
status:engaged
status:warm
status:appointment-booked
status:no-show
status:no-show-3x
status:client
status:at-risk
status:cancelled
```

### Client Package Tags
```
client:starter
client:growth-engine
```

### Niche Tags (Client industry)
```
niche:hvac
niche:plumbing
niche:dental
niche:medspa
niche:legal
niche:real-estate
niche:restaurant
niche:ecom
niche:consulting
niche:it-support
niche:staffing
niche:recruiting
niche:local-biz
```

### Workflow Tags (Active automation tracking)
```
wf:nurture-active
wf:nurture-complete
wf:reactivation-active
wf:onboarding-active
wf:review-request-sent
```

### Upsell Tags
```
upsell:growth-engine-offered
upsell:growth-engine-accepted
```

### Setter Tags (Team assignment)
```
setter:dm-assigned
setter:phone-assigned
setter:set-ready-for-close
```

### Disqualification Tags
```
dq:no-budget
dq:no-revenue
dq:conduct
dq:competitor
dq:unresponsive-3x
```

### Reactivation
```
reactivation
```

---

## Custom Fields — Full List

### Contact-Level Fields

| Field Label | Field Key (auto-generated) | Type | Purpose |
|---|---|---|---|
| Demo Link | `demo_link` | URL | Personalized demo link per lead |
| Lead Temperature | `lead_temperature` | Dropdown | Hot / Warm / Lukewarm / Cold |
| Primary Pain Point | `primary_pain_point` | Text | From SPIN qualification |
| Current Tools | `current_tools` | Text | CRM/website/booking tools they use |
| Monthly Marketing Spend | `monthly_marketing_spend` | Number | Pre-call qualification |
| Monthly Lead Volume | `monthly_lead_volume` | Number | Pre-call qualification |
| Package Type | `package_type` | Dropdown | Starter / Growth Engine |
| Client Niche | `client_niche` | Dropdown | HVAC / Dental / MedSpa / Legal / Restaurant / Real Estate / E-Commerce / Consulting / IT / Staffing / Other |
| Setter Notes | `setter_notes` | Large Text | Handoff notes from setter to closer |
| Closer Notes | `closer_notes` | Large Text | Discovery call notes |
| Onboarding Status | `onboarding_status` | Dropdown | Waiting on Client / In Progress / Blocked / Complete |
| Google Review Link | `google_review_link` | URL | Client's Google review URL |
| Client Website URL | `client_website_url` | URL | Website we built/manage |
| Business Name | `business_name` | Text | Lead's business name |
| Lead Source Detail | `lead_source_detail` | Text | Specific detail (e.g., "saw IG reel from 5/10") |

### Dropdown Options Reference

**Lead Temperature:**
- Hot
- Warm
- Lukewarm
- Cold

**Package Type:**
- Starter ($999 + $299/mo)
- Growth Engine ($2,000 + $750/mo)

**Client Niche:**
- HVAC
- Plumbing
- Dental
- MedSpa
- Legal
- Real Estate
- Restaurant
- E-Commerce
- Consulting
- IT Support
- Staffing
- Recruiting
- Other

**Onboarding Status:**
- Waiting on Client
- In Progress
- Blocked
- Complete

---

## Setup Checklist

### Tags
- [ ] All source tags created (10 tags)
- [ ] All status tags created (9 tags)
- [ ] All client package tags created (2 tags)
- [ ] All niche tags created (13 tags)
- [ ] All workflow tags created (5 tags)
- [ ] All upsell tags created (2 tags)
- [ ] All setter tags created (3 tags)
- [ ] All DQ tags created (5 tags)
- [ ] Reactivation tag created (1 tag)
- [ ] **Total: 50 tags**

### Custom Fields
- [ ] All 15 contact-level custom fields created
- [ ] Dropdown options configured for each dropdown field
- [ ] Test: open a contact, verify all custom fields appear
- [ ] Test: verify dropdown options are correct

### Verification
- [ ] Create a test contact with all tags applied — verify they show correctly
- [ ] Create a test contact with all custom fields filled — verify data saves
- [ ] Reference `{{contact.demo_link}}` in a test SMS — verify it pulls correctly
