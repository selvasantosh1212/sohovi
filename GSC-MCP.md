# Google Search Console MCP Servers

Reference for the two independent Google Search Console MCP servers connected to this project — `gscServer` and `suganthanGsc` — plus a concrete SEO playbook for sohovi.com built around them. Both talk to the same `sc-domain:sohovi.com` property via the same underlying Google Cloud OAuth client, but they are two unrelated npm/PyPI packages with mostly-disjoint tool sets. Read "Which server do I use?" below before calling a tool if you're unsure which server has it.

## Which server do I use?

| Situation | Use this tool | Server |
|---|---|---|
| Don't know the exact `site_url` yet | `list_properties` | `gscServer` only — `suganthanGsc` has no site-discovery tool, it requires a known `site_url` at startup |
| Need >500 rows, custom filters, `search_type` (WEB/IMAGE/VIDEO/NEWS/DISCOVER), or pagination past 25,000 rows | `get_advanced_search_analytics` | `gscServer` — its advanced tool goes to 25,000 rows with `start_row` pagination; `suganthanGsc`'s `advanced_search_analytics` caps at 500 rows with no pagination |
| Want a curated, pre-interpreted opportunity report instead of raw rows (quick wins, CTR gaps, content gaps/decay, cannibalization, topic clusters, recommendations) | `quick_wins`, `ctr_opportunities`, `content_gaps`, `content_decay`, `cannibalization_check`, `topic_cluster_performance`, `content_recommendations`, `ctr_vs_benchmark`, `check_alerts` | `suganthanGsc` only — no equivalents on `gscServer` |
| Submit a sitemap to Google | `submit_sitemap` ⚠️ | **Both servers have a tool with this exact name.** Always tell Claude which server explicitly ("gscServer's submit_sitemap" / "suganthanGsc's submit_sitemap") — do not assume it'll pick the right one from context. |
| List submitted sitemaps | `get_sitemaps` / `list_sitemaps_enhanced` (gscServer) vs `list_sitemaps` (suganthanGsc) | Near-identical names, not the same tool — double check which you meant. **Use `gscServer`'s** — `suganthanGsc`'s `list_sitemaps` errors on this domain property (verified 2026-07-12): `"The Sitemaps API does not support domain properties ... with service accounts"`, even though this server is configured in OAuth mode, not service-account mode. Likely a bug/limitation in `suganthan-gsc-mcp`'s sitemaps implementation for `sc-domain:` properties specifically — `gscServer`'s `get_sitemaps` on the identical property works fine. |
| Deep single-URL inspection with rich-results detail | `inspect_url_enhanced` | `gscServer` |
| Fast single-URL indexing check | `inspect_url` | `suganthanGsc` — similar name to the above, not the same tool |
| Directly request Google re-crawl specific URLs (not via sitemap) | `submit_url` ⚠️ / `submit_batch` ⚠️ | `suganthanGsc` only. Requires the Web Search Indexing API enabled — see its Setup notes below. |
| Add/remove a GSC property, or force `gscServer` to re-authenticate | `add_site` ⚠️ / `delete_site` ⚠️ / `reauthenticate` ⚠️ | `gscServer` only. `suganthanGsc` has no `reauthenticate` equivalent — to force it to redo OAuth, manually delete `~/.gsc-mcp/oauth-token.json` and make any tool call. |
| Save a markdown report to disk | `generate_report` | `suganthanGsc` only. **Always pass `output_path` explicitly** — see its Setup notes below, it writes to local disk, not to Google. |

Rule of thumb: if a tool name sounds close to one you've used before, check both tool-reference tables in this doc before calling it — the exact-match and near-miss pairs above are the ones most likely to get you the wrong server's answer.

## Status — `gscServer` (mcp-search-console)

- Connected via `mcp-search-console` (uvx), registered in this repo's `.mcp.json` (gitignored — personal tooling, not app config).
- Authenticated as `selvaganapathypari@gmail.com`, `siteOwner` on the property `sc-domain:sohovi.com`.
- Domain property covers **all subdomains** — use the `page` dimension/filter to scope queries to a section like `/labs/` or `/tools/`.

## Tool reference — `gscServer`

`site_url` for every tool below is `sc-domain:sohovi.com`.

### Property management

| Tool | Purpose | Key args |
|---|---|---|
| `list_properties` | List every GSC property you have access to, with permission level. Always call this first if unsure of the exact site_url. | — |
| `get_site_details` | Full detail on one property (permission level etc.) | `site_url` |
| `add_site` ⚠️ | Add a new property to the account | `site_url` |
| `delete_site` ⚠️ | Remove a property from the account | `site_url` |

### Search analytics

| Tool | Purpose | Key args |
|---|---|---|
| `get_search_analytics` | Quick query/page/device/country/date breakdown, up to 500 rows | `days` (default 28), `dimensions` (comma-separated: query, page, device, country, date), `row_limit` |
| `get_performance_overview` | Totals (clicks, impressions, ctr, position) + a daily trend array | `days` (default 28) |
| `get_search_by_page_query` | All queries driving traffic to one specific page | `page_url`, `days`, `row_limit` |
| `compare_search_periods` | Diff two date ranges on a chosen dimension (e.g. this week vs last week) | `period1_start/end`, `period2_start/end`, `dimensions` (default query), `limit` |
| `get_advanced_search_analytics` | The full-power version: filters (AND logic across query/page/country/device), sort, pagination up to 25,000 rows, `search_type` (WEB/IMAGE/VIDEO/NEWS/DISCOVER), `data_state` | `start_date`, `end_date`, `dimensions`, `filters` (JSON array), `sort_by`, `sort_direction`, `row_limit`, `start_row`, `data_state` |

**`data_state` matters**: `"all"` (default) matches what you see on the GSC dashboard, including fresh/partial data. `"final"` only returns confirmed data (2-3 day lag) — use it if numbers need to be stable/reproducible rather than up-to-the-minute.

### URL inspection

| Tool | Purpose | Key args |
|---|---|---|
| `inspect_url_enhanced` | Indexing status + rich results for one URL | `page_url` |
| `batch_url_inspection` | Same, for multiple URLs at once (within API limits) | `urls` (one per line) |
| `check_indexing_issues` | Scan multiple URLs specifically for indexing problems | `urls` (one per line) |

### Sitemap management

| Tool | Purpose | Key args |
|---|---|---|
| `get_sitemaps` / `list_sitemaps_enhanced` | List submitted sitemaps (enhanced version supports sitemap indexes) | `sitemap_index` (optional) |
| `get_sitemap_details` | Detail on one sitemap (status, errors, warnings, last read) | `sitemap_url` |
| `submit_sitemap` ⚠️ | Submit/resubmit a sitemap to Google | `sitemap_url` |
| `delete_sitemap` ⚠️ | Unsubmit a sitemap | `sitemap_url` |
| `manage_sitemaps` ⚠️ | All-in-one: `action` = list / details / submit / delete | `action`, `sitemap_url` |

### Meta

| Tool | Purpose |
|---|---|
| `get_capabilities` | Full tool list + current auth status — call this if ever unsure what's available |
| `get_creator_info` | Info about the mcp-gsc project author |
| `reauthenticate` ⚠️ | Deletes the cached OAuth token and re-triggers browser login — use only to switch Google accounts |

⚠️ = mutates state (adds/removes a property, submits/deletes a sitemap, or resets auth). Confirm with the user before calling these — everything else is read-only and safe to call freely.

## Usage guidelines — `gscServer`

1. **Default to read-only.** For SEO analysis, you never need the ⚠️ tools — `get_*` and `check_*`/`inspect_*`/`compare_*`/`list_*` cover the full analysis workflow.
2. **Pick the right analytics tool for the job**: `get_search_analytics` for a quick look (≤500 rows, no filters); `get_advanced_search_analytics` when you need filters, multi-dimension breakdowns, sorting, or >500 rows.
3. **Always confirm exact URLs via `list_properties`** before assuming the site_url format — domain properties use `sc-domain:example.com`, URL-prefix properties use the full `https://example.com/`.
4. **Section-scope a domain property** by filtering the `page` dimension (e.g. `contains /labs/`) rather than treating `/labs/` and `/tools/` pages as separate properties — they're all under the one `sc-domain:sohovi.com` property.

## Status — `suganthanGsc` (suganthan-gsc-mcp)

- Connected via `npx -y suganthan-gsc-mcp@2.2.2` (pinned version), registered in this repo's `.mcp.json` (gitignored).
- Reuses the *same* OAuth client secrets file as `gscServer` (`~/.config/gsc-mcp/client_secrets.json`, project `gsc-mcp-502206`) but keeps its own, completely separate token cache at `~/.gsc-mcp/oauth-token.json` (hardcoded path, not configurable). Re-authenticating one server never affects the other.
- Auth is lazy/automatic: the first tool call that needs a Google client and finds no valid cached token opens a local callback listener on `127.0.0.1:3847` and launches the browser automatically. No separate login command.
- Requested OAuth scopes: `webmasters.readonly`, `webmasters`, `indexing` (all three requested upfront regardless of which tool triggers auth).
- `site_url` fixed at server-start via the `GSC_SITE_URL` env var (`sc-domain:sohovi.com`) — not passed per-call, unlike some `gscServer` tools. No site-discovery tool exists on this server.
- No `get_capabilities` equivalent — this doc and the [source repo](https://github.com/Suganthan-Mohanadasan/Suganthans-GSC-MCP) are the authoritative reference for its tool list.

## Tool reference — `suganthanGsc`

`site_url` for every tool below is fixed at `sc-domain:sohovi.com` via the server's env config.

### Opportunity & diagnostic analysis

| Tool | Purpose | Key args (all optional/defaulted) |
|---|---|---|
| `quick_wins` | Queries at position 4-15 with high impressions — page-one opportunities | `days` (28), `min_impressions` (100), `max_position` (15) |
| `ctr_opportunities` | High-impression pages with CTR well below expected for their position | `days` (28), `min_impressions` (500) |
| `traffic_drops` | Pages losing the most traffic, with a diagnosed cause (ranking/CTR/demand) | `days` (28, period-over-period) |
| `content_gaps` | Queries with impressions but ranking worse than position 20 — undertargeted demand | `days` (90), `min_impressions` (50), `min_position` (20) |
| `cannibalization_check` | Queries where multiple of your own pages compete against each other | `days` (28), `min_impressions` (50) |
| `content_decay` | Pages declining for 3 consecutive 30-day periods | — (no args) |
| `topic_cluster_performance` | Aggregated performance for all pages matching a URL path pattern | `path_pattern` (required, e.g. `/blog/seo`), `days` (28) |
| `ctr_vs_benchmark` | Actual CTR vs. position-based industry benchmark | `days` (28), `min_impressions` (200) |
| `content_recommendations` | Prioritized update/create/consolidate actions, cross-referencing several of the above | `days` (28), `max_recommendations` (10) |
| `check_alerts` | Position/CTR/click-drop alerts above configurable thresholds | `days` (7), plus threshold overrides |

### Analytics, reporting & verification

| Tool | Purpose | Key args |
|---|---|---|
| `site_snapshot` | Quick totals + period-over-period comparison | `days` (28) |
| `advanced_search_analytics` | Custom-dimension query with filters (contains/equals/regex on query/page/country/device) | `days` (28), `dimensions`, `filters`, `row_limit` (max 500, no pagination), `order_by`, `order_direction`, `site_url` (optional per-call override) |
| `multi_site_dashboard` | Cross-property health check | `site_urls` (optional array, falls back to `GSC_SITE_URLS` env var — not currently set), `days` (28) |
| `verify_claim` | Re-queries live data to self-check a specific numeric claim before presenting it | `claim`, `metric` (clicks/impressions/ctr/position), `expected_value`, optional `url`/`query` filter, `days` (28) |
| `generate_report` 📝 | Builds a markdown report and **writes it to local disk** via `fs.writeFileSync` | `output_path` (optional — **always pass this explicitly**, defaults to `./gsc-report-{date}.md` relative to the server process's working directory if omitted — that's this repo root), `days` (28), `include_sections` |

### URL inspection

| Tool | Purpose | Key args |
|---|---|---|
| `inspect_url` | Indexing status, last crawl, canonical, robots/noindex, mobile usability for one URL | `url` (required) |

### Sitemaps & indexing

| Tool | Purpose | Key args |
|---|---|---|
| `list_sitemaps` | List submitted sitemaps with status/errors/warnings/indexed counts | — (no args) |
| `submit_sitemap` ⚠️ | Notify Google of a new/updated sitemap | `sitemap_url` (optional, defaults to `{site_url}/sitemap.xml`) |
| `submit_url` ⚠️ | Submit one URL to the Indexing API | `url` (required), `action` (`URL_UPDATED` default / `URL_DELETED`). Google officially scopes this API to JobPosting/BroadcastEvent pages, though it processes other URLs in practice. |
| `submit_batch` ⚠️ | Submit up to 200 URLs/day to the Indexing API | `urls` (array, max 200), `action` |

⚠️ = mutates Google-side state (Indexing API or sitemap submission) — confirm with the user before calling, same convention as `gscServer`. 📝 = writes a file to local disk (not Google) — different kind of caution, see Setup notes.

## Usage guidelines — `suganthanGsc`

1. **Default to read-only**, same as `gscServer` — 17 of the 20 tools never touch Google-mutating state.
2. **`generate_report` always needs an explicit `output_path`.** Its default (`./gsc-report-{date}.md`) is a *relative* path resolved against the MCP server's own working directory, which is this repo root — an unqualified call can silently drop a `gsc-report-YYYY-MM-DD.md` file into the repo. Point it somewhere deliberate (or a gitignored scratch path) every time.
3. **`submit_url`/`submit_batch` need the Web Search Indexing API enabled** in the `gsc-mcp-502206` GCP project — a one-time, optional, manual Console step (see Setup notes). Every other tool only needs the Search Console API, already enabled.
4. **No `reauthenticate` tool.** To force a fresh login for this server specifically (e.g. switching Google accounts), delete `~/.gsc-mcp/oauth-token.json` and make any tool call.
5. Don't be alarmed if server startup logs or a `generate_report` footer print an internal version string that doesn't match the npm package version (2.2.2) — that can be a stale hardcoded literal in the package's own source, not a sign the wrong version got installed.
6. **`list_sitemaps` is broken for this domain property** (verified 2026-07-12) — errors with a "Sitemaps API does not support domain properties ... with service accounts" message despite OAuth mode being configured correctly (`site_snapshot`/`quick_wins` against the same property work fine, and `gscServer`'s `get_sitemaps` on the identical `sc-domain:sohovi.com` succeeds, ruling out a real Google-side domain-property limitation). `submit_sitemap` likely shares the same underlying Sitemaps API call and may hit the same error — untested, treat with suspicion. Use `gscServer`'s sitemap tools instead until/unless this is fixed upstream.

### Setup notes

- Enable Web Search Indexing API (optional, only for `submit_url`/`submit_batch`): Google Cloud Console → APIs & Services → Library → search "Web Search Indexing API" (project `gsc-mcp-502206`) → Enable. Separate from Search Console API, which already works.
- OAuth callback port: `127.0.0.1:3847`, loopback-only, only bound during an actual auth flow (first use, or after manually clearing the token cache) — not held open in steady state.

## Sohovi.com SEO playbook

Site structure (from `app/sitemap.ts`):
- Static marketing pages: `/`, `/pricing`, `/security`, `/about`, `/features/data-profiling`, `/features/data-quality-scoring`, `/features/pii-detection`
- 12 `/tools/*` pages (pii-audit, compare, de-identify, remove-duplicates, csv-to-json, json-to-csv, csv-columns, csv-to-markdown, csv-to-sql, csv-merger, test-data-generator, formula-explainer)
- 6 `/labs/*` pre-launch validation pages (snapback, encore, signsync, shopify-tools, reftrack, shipnotes)
- `/blog/*` and `/blog/category/*` (dynamic, DB-backed)

### Baseline (as of 2026-07-12, trailing 28 days, pulled via `gscServer`)
- 188 impressions, 1 click, CTR 0.53%, average position ~59.3
- Nearly flat through mid-June, then a sharp impression spike starting **2026-07-08** (16 → 26 → 77 → 43/day) — worth investigating first since it's the most recent signal.

### Recommended next actions, in order

1. **Investigate the July 8+ spike** — run `get_advanced_search_analytics` with `dimensions="query,page,date"`, `start_date=2026-07-08`, `end_date=2026-07-11`, sorted by impressions, to find which query/page combo is newly getting impressions. Cross-reference against recent commits (the `/labs` pages and Vercel Analytics both landed around then).
2. **Indexing sweep on newer sections** — `check_indexing_issues` (or `batch_url_inspection`) across all 6 `/labs/*` URLs and all 12 `/tools/*` URLs. These are the newest/least-established pages and most likely to have crawl or indexing gaps.
3. **Find high-impression, low-CTR pages** — `get_advanced_search_analytics` with `dimensions="page,query"`, filtered to reasonable position (e.g. `position < 20` isn't a direct filter dimension, so pull top rows by impressions and eyeball CTR/position) to find pages ranking decently but not getting clicks — these are title/meta-description rewrite candidates.
4. **Sitemap health check** — `get_sitemaps` to confirm Google has successfully read the sitemap and see submitted vs indexed counts; `get_sitemap_details` on `https://sohovi.com/sitemap.xml` for errors/warnings.
5. **Page-level deep dives** — for any specific page underperforming, `get_search_by_page_query` to see exactly which queries are driving (or failing to drive) its impressions.

### Recurring cadence

- **Weekly**: `compare_search_periods` (this week vs. last week, dimension=query or page) to catch regressions or new opportunities early.
- **After every new page/section ships** (e.g. a new `/labs/*` or `/tools/*` page): `inspect_url_enhanced` on it within a few days to confirm Google picked it up, and add it to the sitemap check.
- **Monthly**: full `get_advanced_search_analytics` pull (dimensions=query,page) sorted by impressions descending, to review the broader query/page landscape and prioritize title/content updates.
