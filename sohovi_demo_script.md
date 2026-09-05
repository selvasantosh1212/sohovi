# Sohovi Demo Script

**Target runtime: 4:45**

Resolution notes from the advocate/critic/manager review:
- Hook → pain → outcome, in that order (not one replacing the other).
- All 6 profiling metrics kept at full depth, but threaded through ONE running example (a duplicate/malformed transaction) instead of listed independently, to avoid a "feature inventory" feel.
- "Runs locally" repeated 3x, each time a different angle: trust claim (intro) → domain-fear defusal (right as sensitive finance data loads) → operational angle (no IT approval, works on your laptop).
- Explicit one-line pricing bridge going into the DQ rules section, so "free" doesn't go silent and read as bait-and-switch.
- "Monitored to closure" reframed in solo/freelancer language ("you see it, you fix it, you check it off") instead of governance/ticket-queue language.
- Rule reuse framed as "don't rebuild from scratch every time a new file lands" — this also implicitly answers the "why not just use Excel/pandas" objection.
- Concrete CTA added at the close (link + no signup wall).

---

## [0:00–0:18] HOOK + PAIN + OUTCOME

[SCREEN: Black background, Sohovi logo fades in, then cuts straight to a blurred preview of a spreadsheet with red flags appearing on it]

**VOICEOVER:**
"Just by watching this demo, you could save yourself hundreds, maybe thousands of dollars.

Ever shipped a report to a client, and three days later found out there were duplicate transaction IDs sitting in it the whole time?

That's what this video is about — catching that stuff before it leaves your hands, in minutes, not days."

---

## [0:18–0:45] INTRO + PRIVACY

[SCREEN: Sohovi opens in browser tab — clean UI, "Upload a file to begin" screen]

**VOICEOVER:**
"This is Sohovi. It's a data profiling and data quality tool that runs right here, in your browser.

No install. No account setup that takes three months to get approved. And — this matters — nothing you upload ever leaves this tab. There's no cloud server involved. Your data stays on your machine, the whole time.

Let me show you what that actually looks like."

---

## [0:45–1:10] WHY PROFILING COMES FIRST (DOMAIN-AGNOSTIC)

[SCREEN: Quick montage — icons/text labels flashing: "Finance," "Healthcare," "Supply Chain," "HR" — then settling back on Sohovi's upload screen]

**VOICEOVER:**
"No matter what kind of data you work with — finance, healthcare, supply chain, HR — the first step is always the same: you have to actually understand what you're looking at before you can trust it, clean it, or report on it.

So I'm going to show you this on a finance dataset — a transaction ledger — but everything I'm about to do works exactly the same on patient records, shipment logs, or an employee roster. Same steps, different columns."

---

## [1:10–2:35] FULL PROFILING WALKTHROUGH (running example thread)

[SCREEN: Drag-and-drop "finance_transactions.csv" into Sohovi. File loads — 12,000 rows, columns: transaction_id, customer_id, date, amount, currency, category, status]

**VOICEOVER:**
"Here's a transaction file — about twelve thousand rows. And because this is financial data, it's exactly the kind of thing you'd never want sitting on someone else's server. Everything you're about to watch is happening locally, right in this browser tab.

Let's hit profile."

[SCREEN: Click "Profile Dataset" — panel populates with column cards]

**VOICEOVER:**
"First thing Sohovi does — it looks at every column and flags which ones are probably mandatory. Transaction ID, customer ID, amount, date — it's guessed those four, because they're filled in almost every row. That's mandatory-column identification, and it's already telling me where to look first."

[SCREEN: Highlight "customer_id" column card — completeness score: 92%]

**VOICEOVER:**
"Now, completeness. Customer ID is one of those mandatory columns — but it's only ninety-two percent complete. That means roughly one in twelve rows is missing the one field that tells you who this transaction belongs to."

[SCREEN: Click into customer_id column detail — null percentage chart, 8% shown as red bar]

**VOICEOVER:**
"Drilling in, that's an eight percent null rate on customer ID specifically. Not huge — but on twelve thousand rows, that's almost a thousand transactions you can't tie back to a customer."

[SCREEN: Scroll to "transaction_id" column — uniqueness score flagged, one row highlighted: TXN-10482 appears twice]

**VOICEOVER:**
"Now here's where it gets interesting. Transaction ID is supposed to be unique — every transaction gets its own ID. Sohovi's uniqueness check just caught one that isn't: TXN-10482 shows up twice."

[SCREEN: Click on the duplicate rows — side-by-side comparison of the two TXN-10482 rows]

**VOICEOVER:**
"Same ID, two different rows. That alone could mean this transaction got double-billed, or double-counted in a report — and nobody would know unless they went looking."

[SCREEN: Highlight the "amount" column on one of the two duplicate rows — value shown as -450.00, flagged red]

**VOICEOVER:**
"And look at this — one of those two rows has a negative amount. Validity check catches this: a transaction amount shouldn't go negative in this dataset, that's not how the business rule works. So now we know this isn't just a duplicate — one of the two copies is also broken."

[SCREEN: Highlight "transaction_id" formatting — pattern view shows most IDs as "TXN-#####" and this one row as "TXN10482" without the dash]

**VOICEOVER:**
"And this is why it slipped through in the first place — data shapes. Every other transaction ID follows the pattern TXN, dash, five digits. This one's missing the dash. It looks almost right, so it got typed in twice under two slightly different formats, and both versions ended up in the file.

So in about ninety seconds, just from profiling — no rules written yet — we've found a missing customer link, a duplicate transaction, a negative amount that shouldn't exist, and the formatting slip that caused it. That's completeness, null percentage, uniqueness, validity, data shapes, and mandatory-column detection — all on one row that would've walked straight into a client report."

---

## [2:35–3:00] IT'S FREE + LOCAL + SMALL BUSINESS POSITIONING

[SCREEN: Cut to pricing page — "Profiling: $0" clearly on screen]

**VOICEOVER:**
"And everything I just showed you — all of that profiling — is completely free in Sohovi. Not a trial, not a limited tier. Free.

Combine that with the fact that it's running locally — no setup, no IT approval process, no waiting on a vendor contract — and this is exactly why Sohovi works for small businesses, small teams, and freelancers. You don't need a data engineering team to get this. You need a browser tab and a file."

---

## [3:00–3:15] BRIDGE TO DQ RULES

[SCREEN: Transition — click from "Profile" tab to "Rules" tab]

**VOICEOVER:**
"Now — profiling tells you what's wrong right now. But what if you want Sohovi to keep watching for this automatically? That's what rules are for. And rule creation is the same story: still free, still yours."

---

## [3:15–4:15] DQ RULES — 4 DIMENSIONS + MONITORING TO CLOSURE (solo framing) + implicit Excel/pandas rebuttal

[SCREEN: "Create Rule" panel opens, dropdown of rule types visible]

**VOICEOVER:**
"Let's turn what we just found into rules, so we're never caught by surprise again.

First — completeness. I'll set a rule: customer ID must be filled on every row."

[SCREEN: Rule builder — select "customer_id," condition "must not be null," save]

**VOICEOVER:**
"Next — uniqueness. Transaction ID must never repeat."

[SCREEN: Rule builder — select "transaction_id," condition "must be unique," save]

**VOICEOVER:**
"Then validity — amount must always be greater than zero."

[SCREEN: Rule builder — select "amount," condition "greater than 0," save]

**VOICEOVER:**
"And accuracy — transaction ID has to match the actual pattern, TXN followed by five digits, so a typo like the one we saw doesn't sneak back in."

[SCREEN: Rule builder — select "transaction_id," condition "matches pattern TXN-#####," save]

**VOICEOVER:**
"Four rules, maybe ninety seconds of setup. Compare that to writing a script from scratch every time you want to check a file — this is a checklist you build once."

[SCREEN: Click "Run Rules" — dashboard shows 3 rules passed, 1 failed (uniqueness), with the TXN-10482 row flagged red]

**VOICEOVER:**
"Now run them, and you can see exactly what's broken — the duplicate transaction is still flagged, right where we left it.

And here's the part that actually matters day-to-day: this isn't just a list of problems. You fix the issue — say, delete the duplicate row — rerun the rule, and it clears. You see it, you fix it, you check it off. That's the whole workflow. No ticket system, no assigning it to someone else — just you, the file, and a clean pass before you hit send."

[SCREEN: Rerun — dashboard now shows all 4 rules passed, green checkmarks]

**VOICEOVER:**
"All green. That report is safe to send."

---

## [4:15–4:40] REUSE ON SECOND DATASET

[SCREEN: Upload a new file — "finance_transactions_Q3.csv" — different data, same columns]

**VOICEOVER:**
"Now, next month a new file lands on your desk — same kind of data, all new rows. You don't rebuild any of this from scratch."

[SCREEN: Click "Apply Existing Rule Set" — same 4 rules run instantly against the new file]

**VOICEOVER:**
"Same four rules, applied instantly to the new file. No rewriting a script, no starting over — just point it at the new data and run."

[SCREEN: Results panel — 2 rules pass, 2 flagged with new issues highlighted]

**VOICEOVER:**
"And it's already caught something new in this file too. That's the real value — you build your checks once, and every file after that gets faster to trust."

---

## [4:40–5:00] CLOSE + CTA

[SCREEN: Sohovi homepage, URL visible on screen: sohovi.com — "Start Free" button highlighted]

**VOICEOVER:**
"That's Sohovi — profile your data for free, catch what's broken before it costs you, and turn what you find into rules you can reuse forever. All of it running right in your browser, nothing uploaded, nothing to set up.

Go try it yourself at sohovi.com — it's free to start, and there's no signup wall to get in the way."

[SCREEN: Logo + URL hold for 2 seconds, fade out]
