# New Tools — Landing Pages

Pre-launch validation pages for 7 unreleased micro-SaaS ideas, hosted on sohovi.com. Not linked from the main site nav/footer (deliberately unlisted) — reachable only by direct URL or organic search. Full build details in `projectplan.md`.

| Idea | URL |
|---|---|
| SnapBack — automated backups for Supabase/Neon/Turso | https://sohovi.com/labs/snapback |
| Encore — booking + student management for music teachers | https://sohovi.com/labs/encore |
| SignSync — email signature manager for small teams | https://sohovi.com/labs/signsync |
| Shopify Tools — single-workflow Shopify automation | https://sohovi.com/labs/shopify-tools |
| RefTrack — flat-fee affiliate tracking for micro-SaaS | https://sohovi.com/labs/reftrack |
| ShipNotes — GitHub-release-to-changelog tool | https://sohovi.com/labs/shipnotes |
| KickoffBox — client content collection for web designers | https://sohovi.com/labs/kickoffbox |

Every page ends in a two-step waitlist + feedback form. Submissions write to the shared `newtools_form` table in Supabase and email a notification to selvaganapathypari@gmail.com.

## What every page must do (validation-page requirements)

Each page exists to test demand for an unbuilt tool, not to sell a finished product. Every page is built from the same shared section components (`components/labs/*`) and must include:

1. **Demand signal** — a single low-friction "count me in" CTA (email, optionally name) as the primary conversion event.
2. **Core value proposition** — hero headline + subheadline naming the specific pain, who it's for, and the one-line differentiator.
3. **Problem validation** — a Pain Point section grounding the pitch in a concrete, named frustration.
4. **Solution mapping** — a Solution section listing the specific features that address those pains.
5. **Competitive differentiation** — a Comparison section naming the real alternative (an incumbent tool or "doing it manually") and why this is better.
6. **Pre-sale pricing signal** — a Pricing Preview framed as "not final, tell us if this works," not a locked price.
7. **Two-phase feedback capture** (`FeedbackForm`) — Step 1 is just email; Step 2 asks 5-8 directed questions and should always include, at minimum: `wouldPay` (would you pay for this), `howSolveToday` (current workaround), and `mustHaveReason` (what makes it a must-have), plus 1-2 tool-specific questions and an optional open-ended `additionalFeedback`.

**Audit note (2026-07-13):** all 7 pages met requirements 1-6. Requirement 7 was inconsistent — SignSync, Shopify Tools, RefTrack, and ShipNotes were missing `wouldPay` and/or `mustHaveReason` (2-3 questions instead of 5-8). Fixed by adding the missing fields to match the SnapBack/Encore/KickoffBox pattern. Also fixed KickoffBox's JSON-LD `offers.price` (was "9", an early-bird sub-price; every other page's schema price matches its lowest listed plan, so KickoffBox now correctly reads "0" for its Free tier).

**Content accuracy + completeness pass (2026-07-13):** web-verified every competitor stat/price cited across all 7 pages. Snaplet's shutdown date, EZ Fulfill's $8k MRR/1,200 stores, Rewardful/FirstPromoter's ~$49/mo starting price, Content Snare's ~$35/mo starting price, and Senja's ARR growth-loop story all checked out. SignSync's Exclaimer comparison did not — it claimed "$2/user/month, ~100-seat minimum," but current pricing sources show Exclaimer starting near $0.90-$1.75/user/month with a 10-user minimum. Reworked SignSync's hero, pain point, comparison table, pricing intro, and two FAQ answers around a defensible differentiator instead (flat self-serve pricing vs. Exclaimer's tiered, sales-quoted pricing). Also added a founder-pricing/early-bird scarcity hook (proven waitlist-conversion pattern) to the 4 pages that didn't have one yet — SnapBack, SignSync, RefTrack, ShipNotes (Encore, KickoffBox, and Shopify Tools already had one). Finally, added 3-5 new FAQ items per page addressing real objections/logistics questions a skeptical visitor would have that weren't previously answered (e.g. SnapBack: DB permissions & backup portability; RefTrack: affiliate payout mechanics; SignSync: mailbox/directory-sync handling; KickoffBox: template customization & PM-tool integration). A live "N people already joined" signup counter was considered (per current best-practice research on high-converting waitlist pages) but deliberately deferred — submission volume is still low and the email pipeline isn't fully live yet, so a real-time count would currently undercut credibility rather than build it.
