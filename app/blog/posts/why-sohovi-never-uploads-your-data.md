---
title: "Why We Built a Data Quality Tool That Never Uploads Your Data"
slug: "why-sohovi-never-uploads-your-data"
category: "Tools, Technology & Buying Guides"
primaryKeyword: "data quality tool never uploads data"
supportingKeywords: ["browser local data quality", "privacy first data tool", "data quality without upload", "sohovi privacy", "client side data processing"]
searchIntent: "informational"
wordCountTarget: 1400
audience: "privacy-conscious buyer or evaluator who wants to understand why Sohovi's browser-local architecture exists and what it actually means technically"
status: "published"
seo_title: "Why We Built a Data Quality Tool That Never Uploads Your Data"
seo_description: "Most data quality tools send your file to a server. Sohovi doesn't. Here's why we built it this way, what it means technically, and how you can verify it yourself."
---

# Why We Built a Data Quality Tool That Never Uploads Your Data

**The short version:** When you upload a file to most online tools, it travels to their server. With Sohovi, your file is loaded into your browser's memory and all processing happens locally on your device. Nothing is transmitted to our servers. You can verify this with your browser's developer tools — open the Network tab and watch what happens when you process a file. You'll see zero upload requests.

---

## How Most Online Tools Work

The typical architecture for an online data tool:

1. You select a file and click "Upload" or "Process"
2. The file is transmitted to the tool's server via an HTTP POST request
3. The server processes the file (runs the dedup, conversion, or analysis)
4. Results are sent back to your browser
5. Depending on the tool's retention policy, your file may be stored on their servers for minutes, hours, or indefinitely

This is efficient for the tool builder (server-side compute is cheaper and more powerful) but creates an obvious privacy problem: every file you process becomes temporarily — or permanently — in possession of a third party.

---

## How Sohovi Works Instead

**Browser-local processing via WebAssembly:**

When you open Sohovi, your browser downloads the processing code. That code runs locally on your device using JavaScript and WebAssembly — the same technology that powers browser-based games, video editors, and code compilers. When you load a file:

1. The file is read into your browser's memory using the File API
2. All processing (profiling, deduplication, validation, PII detection) runs in your browser tab
3. Results are rendered directly in your browser
4. The file never leaves your device

The only network traffic Sohovi generates: loading the application itself (HTML, CSS, JS) and authentication. Processing requests generate no network traffic.

[IMAGE: Diagram showing traditional tool flow (file to server and back) vs Sohovi flow (file stays on device, only results rendered in browser)]

---

## Why We Built It This Way

**The GDPR problem:** When EU customer data is processed by a third-party tool, that tool becomes a data processor under GDPR. Using a processor without a Data Processing Agreement (DPA) is a violation. Most free online tools have no DPA. Browser-local processing sidesteps this entirely — if the data never leaves your browser, no processor relationship is created.

**The trust problem:** We're building a data quality tool. Our customers' biggest pain point is data they can't trust. Asking them to trust us with their sensitive data files — and trust that we handle it correctly, store it securely, delete it promptly — adds a new trust problem on top of the one we're solving. Browser-local processing eliminates this.

**The compliance problem:** Healthcare data (HIPAA), financial data, personal data of Indian customers (DPDP Act), California residents (CCPA) — these all have different rules about third-party data sharing. Browser-local processing is compatible with all of them because the data stays on the user's device.

---

## Verifying It Yourself

We encourage skepticism. Here's how to verify the claim:

1. Open Sohovi in Chrome or Firefox
2. Open Developer Tools (F12)
3. Click the **Network** tab
4. Upload a file and run the profiler or dedup
5. Watch the Network tab during processing

You'll see network requests for static assets (JavaScript files) but no data transmission requests. The file bytes never appear in any network request payload.

This is the strongest form of transparency we can offer: the claim is technically verifiable by any user at any time.

---

## The Trade-Offs

Browser-local processing isn't free. The trade-offs:

**Speed:** Server-side processing can use more powerful hardware. For very large files (500k+ rows), browser-local processing is slower than server-side. We've optimized significantly using WebAssembly, but there's a fundamental ceiling.

**Features:** Some features require server-side components — user accounts, saved profiles, team collaboration, and scheduled monitoring all involve our servers (though never for data processing, only for metadata and settings).

**File size limits:** Your browser has a finite memory budget. Files larger than your device's available memory can cause issues. For most business use cases (files under 100MB), this isn't a practical constraint.

---

## Frequently Asked Questions

**Q: Does this mean Sohovi has no servers?**
No — Sohovi uses servers for account management, saved settings, authentication, and the application itself (serving the HTML/JS files you download to your browser). What we don't use servers for is processing your data. The distinction is important: our servers never receive your file.

**Q: If our processing is browser-local, what do we get from having an account?**
Your validation rules, saved quality profiles, column configurations, and team settings are stored (on our servers, encrypted) so you don't have to recreate them. Your data files are not.

**Q: Can I use Sohovi offline?**
After the initial application load, most processing functionality works without a network connection because it runs locally. You'd need network access to log in, sync settings, or export shared reports.

**Q: Is this the same as how OpenRefine works?**
Architecturally similar — OpenRefine also runs locally (as a Java process on your machine) and processes files locally. The difference: OpenRefine requires installation; Sohovi runs in your browser without installation.

---

We built Sohovi this way because we believe privacy and utility shouldn't be a trade-off. Your customer data belongs on your device — not on someone else's server. Verify it yourself: open the network tab and watch.
