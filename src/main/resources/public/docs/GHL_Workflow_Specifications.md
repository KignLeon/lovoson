# GHL Workflow Specifications — Lovoson Media
## Automation Build Guide

> **Instructions:** Build each workflow in GHL → Automation → Workflows → Create Workflow → Start from Scratch.
> Copy triggers, conditions, and message templates exactly as written.
> Replace `[CALENDAR LINK]` with your actual scheduling URL.
> Replace `[CLOSER NAME]` with the assigned closer's name.

---

## Workflow 1.1: New Lead → Instant Engagement

**Workflow Name:** `WF-1.1 — New Lead Instant Engagement`

### Trigger
- **Type:** Form Submitted
- **Filter:** Any lead capture form

### Actions (in order)

```
1. CREATE/UPDATE CONTACT
   → Ensure contact record exists

2. ADD TAG → source:{dynamic based on form}
   → Tag by lead source

3. CREATE OPPORTUNITY
   → Pipeline: "Outbound Prospecting"
   → Stage: "Cold Prospect"
   → Opportunity Name: {{contact.first_name}} {{contact.last_name}} — New Lead

4. SEND SMS (immediate)
   Message:
   "Hey {{contact.first_name}}! Thanks for reaching out to Lovoson Media. 
   Here's my calendar to grab a quick call: [CALENDAR LINK]"

5. SEND EMAIL (immediate)
   Subject: "Welcome to Lovoson Media — Next Steps"
   Body: Branded welcome email with calendar link + what to expect

6. INTERNAL NOTIFICATION
   → Send email/SMS to setter team
   → Subject: "🔔 New Lead: {{contact.first_name}} {{contact.last_name}}"

7. WAIT → 1 hour

8. IF/ELSE → Contact has tag "status:appointment-booked"?
   → YES: Go to Step 14 (END)
   → NO: Continue

9. SEND SMS
   "Hey {{contact.first_name}}, did you get a chance to check out the calendar link? 
   Happy to find a time that works: [CALENDAR LINK]"

10. WAIT → 24 hours

11. IF/ELSE → Contact has tag "status:appointment-booked"?
    → YES: END
    → NO: Continue

12. SEND SMS + EMAIL
    SMS: "Hey {{contact.first_name}}, just wanted to bump this one more time — 
    I know you're busy. Here's the link if you want to grab 15 minutes: [CALENDAR LINK]"
    Email: Value-driven follow-up with social proof

13. WAIT → 48 hours → ADD TAG "wf:nurture-complete"

14. END WORKFLOW
```

### Stop Conditions
- Contact replies (move to manual follow-up)
- Contact books appointment (tag triggers exit)
- Contact opts out (DND auto-enabled)

---

## Workflow 1.2: Missed Call Text-Back

**Workflow Name:** `WF-1.2 — Missed Call Text-Back`

### Trigger
- **Type:** Call Status → Missed Call

### Actions

```
1. WAIT → 1 minute

2. SEND SMS
   "Hey! Sorry I missed your call. I'll be right with you — 
   or grab a time here: [CALENDAR LINK]"

3. INTERNAL NOTIFICATION
   → Alert next available setter
   → "📞 Missed call from {{contact.first_name}} {{contact.phone}}"

4. END WORKFLOW
```

### Prerequisites
- LC Phone connected
- Settings → Phone → Missed Call Text-Back enabled

---

## Workflow 2.1: Appointment Booked → Pre-Call Sequence

**Workflow Name:** `WF-2.1 — Appointment Confirmation & Reminders`

### Trigger
- **Type:** Appointment Status = Confirmed/Booked

### Actions

```
1. UPDATE OPPORTUNITY
   → Pipeline: "Outbound Prospecting"
   → Stage: "Appointment Booked"

2. ADD TAG → "status:appointment-booked"

3. REMOVE TAG → "wf:nurture-complete" (stop nurture if active)

4. SEND SMS (immediate)
   "Confirmed! You're booked for {{appointment.start_date}} at {{appointment.start_time}}. 
   You'll be chatting with our team about how we can systematize your growth. See you then!"

5. SEND EMAIL
   Subject: "You're Confirmed — Here's What to Expect"
   Body: Calendar details + what the call covers + ask them to come prepared with:
   • Current monthly marketing spend
   • Approximate monthly lead volume
   • Any tools they currently use

6. WAIT UNTIL → 24 hours before appointment

7. SEND SMS
   "Quick reminder — your call with Lovoson Media is tomorrow at {{appointment.start_time}}. 
   We'll be looking at your current setup and showing you the AI system live."

8. WAIT UNTIL → 1 hour before appointment

9. SEND SMS
   "See you in an hour! Here's your call link: [MEETING LINK]"

10. END WORKFLOW
```

---

## Workflow 2.2: No-Show Handling

**Workflow Name:** `WF-2.2 — No-Show Recovery`

### Trigger
- **Type:** Appointment Status = No Show

### Actions

```
1. UPDATE OPPORTUNITY
   → Stage: "No-Show" (add this stage to pipelines if needed)

2. ADD TAG → "status:no-show"

3. WAIT → 30 minutes

4. SEND SMS
   "Hey {{contact.first_name}}, looks like we missed each other today. 
   Totally understand life gets busy. Would it make sense to reschedule? 
   I've got a spot this week: [CALENDAR LINK]"

5. WAIT → 24 hours

6. IF/ELSE → Contact has tag "status:appointment-booked"?
   → YES: REMOVE TAG "status:no-show" → END
   → NO: Continue

7. SEND EMAIL
   Subject: "Still interested in automating your lead follow-up?"
   Body: Value-driven email with case study + calendar link

8. WAIT → 72 hours

9. IF/ELSE → Contact has tag "status:appointment-booked"?
   → YES: END
   → NO: Continue

10. SEND SMS (final)
    "Hey {{contact.first_name}}, last follow-up from me on this. 
    If automating your bookings and reviews ever becomes a priority, 
    feel free to reach out. Have a great one!"

11. ADD TAG → "status:no-show-3x" (if this is 3rd no-show)

12. END WORKFLOW
```

---

## Workflow 3.1: Closed Won → Onboarding Kickoff

**Workflow Name:** `WF-3.1 — Client Onboarding Kickoff`

### Trigger
- **Type:** Opportunity Stage Changed
- **Filter:** Stage = "Closed Won — Starter" OR "Closed Won — Growth Engine"

### Actions

```
1. IF/ELSE → Opportunity Stage = "Closed Won — Starter"?

   → YES (Starter Path):
     a. ADD TAG → "client:starter", "status:client"
     b. REMOVE TAGS → "status:warm", "status:engaged", "wf:nurture-complete"
     c. CREATE OPPORTUNITY
        → Pipeline: "Client Onboarding"
        → Stage: "Onboarding Form Sent"
     d. SEND EMAIL: Starter Welcome Package
        Subject: "Welcome to Lovoson Media — Let's Get Started"
        Body: What's included, timeline, onboarding form link

   → NO (Growth Engine Path):
     a. ADD TAG → "client:growth-engine", "status:client"
     b. REMOVE TAGS → "status:warm", "status:engaged", "wf:nurture-complete"
     c. CREATE OPPORTUNITY
        → Pipeline: "Client Onboarding"
        → Stage: "Onboarding Form Sent"
     d. SEND EMAIL: Growth Engine Welcome Package
        Subject: "Welcome to Lovoson Media — Your Growth Engine Starts Now"
        Body: Full deliverables list, timeline, onboarding form link, kickoff scheduling

2. SEND ONBOARDING FORM
   → GHL Form: "Client Onboarding Form" (see Forms section below)

3. INTERNAL NOTIFICATION
   → "🎉 New Client: {{contact.first_name}} {{contact.last_name}} — [Package Type]"
   → Notify fulfillment team

4. CREATE TASK
   → "Schedule Kickoff Call with {{contact.first_name}}"
   → Assigned to: Operations lead
   → Due: 2 days from now

5. WAIT → 48 hours

6. IF/ELSE → Onboarding form submitted?
   → YES: END (or continue to next step)
   → NO: SEND SMS
     "Hey {{contact.first_name}}! Quick reminder to fill out the onboarding form 
     so we can get started on your build: [FORM LINK]"

7. WAIT → 48 hours

8. IF/ELSE → Still not submitted?
   → YES: CREATE TASK → "Manual follow-up: onboarding form not submitted"
   → NO: END

9. END WORKFLOW
```

---

## Workflow 3.2: Google Review Request System

**Workflow Name:** `WF-3.2 — Google Review Automation`

> **Note:** This is a template workflow you configure PER CLIENT.
> Clone it for each client and set their specific Google Review link.

### Trigger
- **Type:** Tag Added = "review-request"
- OR: Manual trigger from client's sub-account

### Actions

```
1. WAIT → 2 hours (give time after service completion)

2. SEND SMS
   "Hey {{contact.first_name}}! Thanks for choosing [Client Business Name]. 
   We'd love your feedback — it takes 30 seconds: 
   {{contact.google_review_link}}"

3. ADD TAG → "wf:review-request-sent"

4. WAIT → 3 days

5. SEND EMAIL
   Subject: "Quick favor — 30-second review?"
   Body: Friendly ask with direct Google review link

6. WAIT → 5 days

7. SEND SMS (final)
   "Last reminder — your review helps other people find great service. 
   {{contact.google_review_link}}"

8. END WORKFLOW
```

---

## Workflow 4.1: Monthly Client Check-In

**Workflow Name:** `WF-4.1 — Monthly Client Health Check`

### Trigger
- **Type:** Date/Time Based → 1st of every month
- **Filter:** Contact has tag "status:client"

### Actions

```
1. SEND EMAIL
   Subject: "Your Monthly Performance Summary — {{current_month}}"
   Body: Template with performance highlights, next month priorities

2. WAIT → 3 days

3. IF/ELSE → Contact has tag "client:starter" AND contact created > 90 days ago?
   → YES: 
     a. SEND EMAIL (upsell)
        Subject: "Ready for the next level?"
        Body: Growth Engine upgrade pitch with results comparison
     b. ADD TAG → "upsell:growth-engine-offered"
   → NO: Continue

4. CREATE TASK
   → "Account review: {{contact.first_name}} {{contact.last_name}}"
   → Assigned to: Account Manager
   → Due: 5 days from now

5. END WORKFLOW
```

---

## Workflow 4.2: Churn Prevention

**Workflow Name:** `WF-4.2 — Churn Prevention Alert`

### Trigger
- **Type:** Tag Added = "status:at-risk"

### Actions

```
1. INTERNAL NOTIFICATION (HIGH PRIORITY)
   → "⚠️ AT RISK: {{contact.first_name}} {{contact.last_name}} — immediate action needed"
   → Notify Account Manager + Owner

2. CREATE TASK
   → "Retention call: {{contact.first_name}} — within 24 hours"
   → Assigned to: Account Manager
   → Due: Tomorrow
   → Priority: Urgent

3. SEND EMAIL (from founder)
   Subject: "Hey {{contact.first_name}} — checking in personally"
   Body: Personal tone, acknowledge the issue, offer to jump on a call

4. WAIT → 48 hours

5. IF/ELSE → Tag "status:at-risk" removed?
   → YES: END (issue resolved)
   → NO: 
     a. INTERNAL NOTIFICATION → "🔴 ESCALATION: {{contact.first_name}} still at risk"
     b. CREATE TASK → "Management escalation: client retention"

6. END WORKFLOW
```

---

## Workflow 5.1: Reactivation Campaign

**Workflow Name:** `WF-5.1 — Lead Reactivation`

### Trigger
- **Type:** Tag Added = "reactivation"

### Actions

```
1. IF/ELSE → DND Enabled?
   → YES: END (respect opt-outs)
   → NO: Continue

2. ADD TAG → "wf:reactivation-active"

3. SEND SMS
   "Hey {{contact.first_name}}, it's Leon from Lovoson Media. 
   Are you still looking to automate your lead follow-up and bookings? 
   We just opened a few spots this week: [CALENDAR LINK]"

4. WAIT → 3 days

5. IF/ELSE → Appointment booked OR contact replied?
   → YES: REMOVE TAG "wf:reactivation-active" → END
   → NO: Continue

6. SEND EMAIL
   Subject: "Quick question, {{contact.first_name}}"
   Body: Short, curiosity-driven follow-up with value hook

7. WAIT → 3 days

8. IF/ELSE → Still no response?
   → YES: SEND SMS (final)
     "Last check-in from me, {{contact.first_name}}. 
     If this ever becomes a priority, reach out anytime. Have a great one."
   → NO: END

9. REMOVE TAG → "wf:reactivation-active"

10. END WORKFLOW
```

---

## Forms to Build

### Form 1: Lead Capture Form
**Location:** Sites → Forms → Builder
**Fields:**
- First Name (required)
- Last Name (required)
- Email (required)
- Phone (required)
- Business Name (text)
- What does your business do? (text)
- How did you hear about us? (dropdown: Instagram / Facebook / LinkedIn / X / Referral / Google / Other)

**On Submit:** Create/Update Contact → Apply source tag

### Form 2: Client Onboarding Form
**Location:** Sites → Forms → Builder
**Fields:**
- Business Name (required)
- Business Address (text)
- Website URL (URL, if existing)
- Business Phone (phone)
- Business Email (email)
- Logo Upload (file upload)
- Brand Colors (text — hex codes or description)
- Google Business Profile Link (URL)
- Preferred Calendar Availability (text)
- Current Tools in Use (multi-select: Website / CRM / Booking System / Email Marketing / Social Media Tools / None)
- Top 3 Services You Offer (text)
- Anything else we should know? (large text)

**On Submit:** Notify fulfillment team → Update onboarding pipeline stage

### Form 3: Pre-Discovery Call Qualification
**Location:** Sites → Forms → Builder
**Fields:**
- Business Name (required)
- Your Role/Title (text)
- Monthly Marketing Spend (dropdown: $0–$500 / $500–$2K / $2K–$5K / $5K+)
- Monthly Lead Volume (dropdown: 0–10 / 10–50 / 50–100 / 100+)
- What's the biggest challenge in your business right now? (large text)
- What tools do you currently use? (multi-select)
- How soon are you looking to make a change? (dropdown: ASAP / 1-2 months / Just exploring)

**On Submit:** Update opportunity notes → Notify closer

---

## Build Priority Order

1. ✅ WF-1.2 (Missed Call Text-Back) — 15 min, instant ROI
2. ✅ WF-1.1 (New Lead Engagement) — 45 min, critical for lead response time
3. ✅ WF-2.1 (Appointment Reminders) — 45 min, reduces no-shows
4. ✅ WF-2.2 (No-Show Recovery) — 30 min, recovers lost opportunities
5. ✅ WF-3.1 (Onboarding Kickoff) — 45 min, systematizes client handoff
6. ✅ WF-3.2 (Review System) — 30 min, fulfills Growth Engine deliverable
7. ✅ WF-5.1 (Reactivation) — 30 min, activates dormant leads
8. ✅ WF-4.1 (Monthly Check-In) — 30 min, retention
9. ✅ WF-4.2 (Churn Prevention) — 30 min, retention safety net
