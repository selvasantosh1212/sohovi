# suganthanGsc — Things You Can Ask

Quick-reference cheat sheet of example questions/requests for the `suganthanGsc` MCP server (connected via this project's `.mcp.json`). For technical details — exact arguments, and how this compares to the other connected GSC server (`gscServer`) — see [GSC-MCP.md](GSC-MCP.md).

Site is fixed to `sc-domain:sohovi.com` for every tool below — no need to specify it when asking.

## Find opportunities

### `quick_wins`
Queries ranking position 4–15 with real impressions — closest things to breaking onto page one.
- "Any quick wins on sohovi.com right now?"
- "What keywords are close to page one?"
- "Show me quick wins from the last 60 days"

### `ctr_opportunities`
Pages getting impressions but underperforming CTR for their ranking position — title/meta-description rewrite candidates.
- "Which pages have impressions but nobody's clicking?"
- "Find CTR opportunities"

### `content_gaps`
Queries with real demand where we rank worse than position 20 (or don't show at all) — undertargeted topics.
- "What are we not ranking for that we should be?"
- "Find content gaps over the last 90 days"

### `content_recommendations`
A prioritized action list synthesizing several of the tools above.
- "What should I work on this week for SEO?"
- "Give me your top 5 content recommendations"

## Diagnose problems

### `traffic_drops`
Pages losing traffic period-over-period, with a diagnosed cause (ranking, CTR, or demand drop).
- "Has anything dropped in traffic recently?"
- "Why did clicks fall this month?"

### `content_decay`
Pages in sustained decline across 3+ consecutive periods — not just a one-off dip.
- "Is anything in long-term decline?"

### `check_alerts`
Threshold-based alerts on recent position/CTR/click drops.
- "Any alerts I should know about?"
- "Check for recent ranking drops"

### `cannibalization_check`
Your own pages competing against each other for the same query.
- "Are any of our pages cannibalizing each other?"

## Check specific things

### `site_snapshot`
Overall totals + period-over-period comparison.
- "How's the site doing overall?"
- "Give me a snapshot for the last 28 days"

### `topic_cluster_performance`
Aggregate performance for a URL path pattern.
- "How's the /blog/seo section performing?"
- "Aggregate stats for everything under /tools/"

### `ctr_vs_benchmark`
Your CTR vs. the typical CTR for that ranking position.
- "Are we underperforming CTR benchmarks anywhere?"

### `inspect_url`
Indexing/crawl/canonical/mobile status for one URL.
- "Is /labs/snapback indexed?"
- "Check the indexing status of [url]"

### `verify_claim`
Re-queries live data to fact-check a specific number before stating it externally.
- "Double-check that 188 impressions figure before I quote it"

### `advanced_search_analytics`
Custom-dimension query with filters — the raw-data escape hatch when the curated tools above don't fit (capped at 500 rows, no pagination — use `gscServer`'s `get_advanced_search_analytics` instead for bigger pulls).
- "Break down clicks by query and page for the last 28 days"

### `multi_site_dashboard`
Cross-property view — not very useful yet, only one property is configured here.

## Output

### `generate_report` 📝 writes a file to disk
Builds a markdown report (snapshot/alerts/quick wins/traffic drops/content decay/recommendations). **Always tell me where to save it** — its default silently drops a file into the project root.
- "Generate a report and save it to the scratchpad"
- "Write a monthly SEO report to [specific path]"

## Avoid — known broken (verified 2026-07-12)

- `list_sitemaps` — errors on this domain property. `submit_sitemap` likely shares the same bug (untested). Ask for `gscServer`'s sitemap tools instead.

## Confirm before running — mutating, pushes changes to Google

- `submit_url`
- `submit_batch`
- `submit_sitemap` (also currently broken, see above)
