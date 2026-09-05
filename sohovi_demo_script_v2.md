# Sohovi Demo Script — v2 (real data + TTS delivery annotations)

This is your corrected script, with the invented example swapped for real data from **CustomerAccounts.csv** (profiling + all 4 DQ rules) and **TransactionMonitoring.csv** (reuse beat), plus inline delivery annotations for the AI voice tool. Everything else — your wording, jokes, structure — is untouched.

## Annotation legend
- `*word*` — stress/emphasis on that word or phrase
- `[pause]` — a short beat (comma-length)
- `[pause-long]` — a longer beat — before a reveal, or between paragraphs
- `(tone: ...)` — delivery direction for the line(s) that follow, until the next `(tone: ...)` tag
- Em dashes and `...` in the text are intentional pacing — read them as real pauses, not just punctuation

---

## [0:00–0:20] HOOK + PAIN + OUTCOME

[SCREEN: black, Sohovi logo fades in]

(tone: direct, a little conspiratorial — like you're about to let the viewer in on something)

"Would you *believe* it if I said... [pause] just by watching this demo, you could save yourself hundreds — maybe *thousands* — of dollars?

[pause-long]

(tone: shift to a relatable, slightly rueful story-telling voice)

Ever shipped a report to a client, and three days later found out there were duplicate records sitting in it the whole time? [pause] Yeah — that's painful. That's *losing trust* with the client.

(tone: back to direct, confident)

That's what this video is about — catching that stuff before it leaves your hands, in minutes, not days."

---

## [0:20–0:45] INTRO + PRIVACY

[SCREEN: Sohovi opens in browser tab — clean UI, "Upload a file to begin" screen]

(tone: calm, matter-of-fact — this is the credibility section, no hype)

"This is Sohovi. It's a data profiling and data quality tool that runs right here, in your browser.

[pause]

No install. No account setup that takes three months to get approved. And — *this* matters — nothing you upload ever leaves this tab. There's no cloud server involved. Your data stays on your machine, the whole time.

[pause]

Let me show you what that actually looks like."

---

## [0:45–1:10] WHY PROFILING COMES FIRST — DOMAIN-AGNOSTIC

[SCREEN: quick montage — "Finance," "Healthcare," "Supply Chain," "HR" labels flash, then settle back on the upload screen]

"No matter what kind of data you work with — finance, healthcare, supply chain, HR — the first step is always the same: you have to actually understand the data before you can trust it, clean it, or report on it.

[pause]

So I'm going to show you this on a finance dataset — a bank's customer account file — but everything I'm about to do works exactly the same on patient records, shipment logs, or an employee roster. Same steps, different columns."

---

## [1:10–2:45] FULL PROFILING WALKTHROUGH — CustomerAccounts.csv

[SCREEN: drag-and-drop `CustomerAccounts.csv` into Sohovi. File loads — four hundred and thirty rows: `customer_id, first_name, last_name, email, phone, branch_country, account_number, balance, kyc_status, account_opened`]

(tone: light, practical)

"Here's a customer account file — four hundred and thirty rows. And because this is financial data — real names, account numbers, balances — it's exactly the kind of thing you'd *never* want sitting on someone else's server. Everything you're about to watch is happening locally, right in this browser tab.

Let's hit profile."

[SCREEN: click "Profile Dataset"]

(tone: quick, a bit pleased with how easy it is)

"It's very simple — [pause] just a few clicks, and data profiling is *done*."

[SCREEN: column cards populate]

"First thing Sohovi does — it looks at every column and flags which ones are probably mandatory. Customer ID, first name, last name, account number — it's flagged those, because they're filled in for over ninety-five percent of rows. That's mandatory-column identification, and it's already telling me where to look first."

[SCREEN: highlight "email" column card — completeness score 92.6%]

(tone: neutral, building)

"Now, completeness. Email is one of those fields you'd expect to be filled in every time — but it's only about ninety-two and a half percent complete. That means roughly one in thirteen rows is missing the one field you'd actually need to reach that customer."

[SCREEN: click into email column detail — null percentage chart]

"Drilling in, that's about a seven percent null rate on email specifically. Not huge — but across four hundred and thirty rows, that's thirty-two people you have *no way* of actually contacting."

[SCREEN: scroll to "customer_id" column — uniqueness flagged, ID 12 highlighted]

(tone: shift into "here's the interesting part" — a little more energy)

"Now here's where it gets interesting. Customer ID is supposed to be unique — one record per customer. Sohovi's uniqueness check just caught one that isn't: [pause] customer ID *twelve* shows up twice. [pause] And it's not alone — thirty different customer IDs in this file show up more than once."

[SCREEN: click the two customer_id=12 rows — side-by-side comparison, "Mark Cohen," same account_number, different balance]

"Same customer, two different rows. That alone could mean this person gets double-counted in a report — or double-contacted by two different reps who both think they own the account — and nobody would know unless they went looking."

[SCREEN: highlight the "balance" column on one of the two rows — value shown as 999,999,999.99, flagged red]

(tone: almost a laugh — this is the "aha, that's obviously wrong" beat)

"And look at *this* — one of those two rows shows a balance of nine hundred ninety-nine million, nine hundred ninety-nine thousand, nine hundred ninety-nine dollars and ninety-nine cents. [pause] Validity check catches this: no real customer at this bank has a balance like that. And it's not just a typo — that *exact* number shows up on five completely different customers in this file. [pause] That's a placeholder value baked into whatever system exported this data, not a one-off mistake. So now we know this isn't just a duplicate — one of the two copies is also *broken*."

[SCREEN: highlight "account_number" column — most rows show a UUID-style code, a few rows show the literal text "TEST-0000"]

(tone: a little wry — "here's the real-world explanation")

"And this ties into something else — data shapes. Every other account number in this file follows the same pattern — a long, unique code. Seven rows show the exact same thing instead: literally the word 'TEST' followed by four zeros. [pause] That's test data that never got cleaned out before this file went out the door.

[pause-long]

(tone: land the summary with a bit of pride in the tool)

So in about ninety seconds — just from profiling, no rules written yet — we've found data quality issues hiding in the data that would've gone *straight* into a report."

---

## [2:45–3:15] "IT'S FREE" + LOCAL + SMALL-BUSINESS POSITIONING

[SCREEN: cut to pricing page — "Profiling: $0" clearly on screen]

(tone: confident, slightly emphatic on "free" and the dollar figure)

"And everything I just showed you — all of that profiling — is *completely free* in Sohovi.

[pause]

Combine that with the fact that it's running locally — no setup, no IT approval process, no waiting on a vendor contract — and that's exactly why I said you could save hundreds, even *thousands* of dollars. Data quality tools can charge you that much just to identify issues in your data — and a lot of that cost goes into building and maintaining the pipeline, not actually fixing anything.

[pause]

That's exactly where this works — for small businesses, small teams, and freelancers. You don't need a data engineering team to get this. You need a browser tab and a file."

---

## [3:15–3:25] BRIDGE TO DQ RULES

[SCREEN: click from "Profile" tab to "Rules" tab]

"Now — profiling tells you what's wrong *right now*. But what if you want Sohovi to keep watching for this automatically? That's what rules are for."

---

## [3:25–4:20] DATA QUALITY RULES — 4 dimensions, monitoring to closure

[SCREEN: "Create Rule" panel opens]

"Let's turn what we just found into rules, so we're never caught by surprise again.

First — completeness. I'll set a rule: email must be filled in on every row."

[SCREEN: rule builder — select "email," condition "must not be null," save]

"Next — uniqueness. Customer ID must never repeat."

[SCREEN: rule builder — select "customer_id," condition "must be unique," save]

"Then validity — balance can't be that placeholder value. A real balance, not a sentinel number that shouldn't exist."

[SCREEN: rule builder — select "balance," condition "not equal to 999999999.99," save]

"And accuracy — account number has to match the real format, a proper unique code, so test data like the one we saw doesn't sneak back in."

[SCREEN: rule builder — select "account_number," condition "matches UUID pattern," save]

(tone: brisk, a little proud of the speed)

"Four rules, maybe ninety seconds of setup. Compare that to writing a script from scratch every time you want to check a file — this is a checklist you build *once*."

[SCREEN: click "Run Rules" — dashboard shows 3 passed, 1 failed (uniqueness — 30 customer IDs flagged), customer_id=12 rows highlighted as the example]

"Now run them, and you can see exactly what's broken — thirty customer IDs get flagged for having a duplicate somewhere in the file, including the one we just looked at.

[pause]

(tone: settle into the practical, day-to-day payoff — this is the emotional core of the section)

And here's the part that actually matters day-to-day: this isn't just a list of problems. You fix the issue — say, delete the duplicate row — rerun the rule, and it clears. You see it, you fix it, you check it off. That's the whole workflow. No ticket system, no assigning it to someone else — just you, the file, and a clean pass before you hit send."

[SCREEN: rerun — all 4 rules pass, green checkmarks]

(tone: satisfied, simple)

"All green. That report is safe to send."

---

## [4:20–4:50] REUSE ON A SECOND DATASET — TransactionMonitoring.csv

[SCREEN: upload `TransactionMonitoring.csv` — different columns: `transaction_id, customer_name, date_of_birth, amount, flag_reason`]

"Now, let's say a different file lands on your desk — this time it's transaction monitoring data, not account records. Different columns, same kind of mess. You don't rebuild any of this from scratch."

[SCREEN: click "Apply Existing Rule Set" — map completeness/uniqueness checks to the new columns]

"I just point the same *kinds* of checks at the matching columns in this new file — a name field for completeness, an ID field for uniqueness — no rewriting a script, no starting over. Just point it at the new data and run."

[SCREEN: results panel — flags on `customer_name` format inconsistency and missing `date_of_birth`]

(tone: a little surprised, like you weren't expecting to find this — makes it feel live, not staged)

"And it's already caught something new in this file too — about a quarter of the names in here don't follow one consistent format, some written 'Last, First,' some just initials — and forty-eight rows are missing a birthdate entirely, which would matter a *lot* if this were a compliance check.

[pause]

That's the real value — you build your checks once, and every file after that gets faster to trust."

---

## [4:50–5:05] CLOSE

[SCREEN: Sohovi homepage]

(tone: warm, confident, wrapping up — slightly slower pace than the rest of the video)

"That's Sohovi — profile your data for free, catch what's broken before it costs you, and turn what you find into rules you can reuse forever. All of it running right in your browser — [pause] nothing uploaded, nothing to set up."

[SCREEN: logo hold, fade out]
