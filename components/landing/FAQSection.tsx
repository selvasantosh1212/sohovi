"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Is my data actually safe? How do I know it never leaves my browser?",
    a: "This deserves a direct answer. When you drop a file into Sohovi, it's read using the browser's File API — no network request is made. The actual analysis runs inside a Web Worker, which is a sandboxed browser thread that cannot make outbound HTTP calls. You can verify this yourself: open DevTools → Network tab → drop a file in Sohovi. You'll see zero requests containing your file data. The only network calls Sohovi makes are to save your DQ scores and rule definitions — never your actual rows.",
  },
  {
    q: "How does Sohovi compare to traditional data quality tools?",
    a: "Most established DQ platforms are built for enterprise IT departments — they require months of implementation, dedicated ops teams, and significant annual budgets. Sohovi is built for data analysts and small teams who need to trust their data now. You can be scoring your first dataset in under 10 minutes with zero setup. We cover 90% of real-world DQ use cases at a fraction of the cost, and your data never has to leave your environment.",
  },
  {
    q: "How is Sohovi different from just using Excel or Power Query?",
    a: "Excel can do basic checks, but it doesn't give you a structured quality score you can track over time, automatically suggest rules based on your column types, or detect PII and schema drift. Sohovi gives you a reproducible, comparable DQ score across runs — so you can say 'our data quality improved from 74 to 89 over 8 weeks' and back it up with a report. Rules also follow your column names automatically when they change.",
  },
  {
    q: "What file types and sizes does Sohovi support?",
    a: "CSV and Excel (.xlsx, .xls) files up to 200MB. For very large files, Sohovi automatically samples up to 100,000 rows for profiling while still applying rules across all rows. JSON and Parquet support are on the roadmap. You can also connect live data sources (Google Sheets, Airtable, REST APIs) on the Business plan.",
  },
  {
    q: "Does the Free plan actually work, or is it intentionally limited?",
    a: "The Free plan is genuinely useful for individuals. You get 5 data assets, unlimited profiling runs, 5 DQ rules per asset, and 7-day run history. It's not a 14-day trial — it's free forever for solo use. When you need unlimited assets, AI DQ Rule suggestions, PDF reports, and full trend history, that's when Pro ($29/mo) makes sense.",
  },
  {
    q: "Does the Business plan have a free trial?",
    a: "Yes — Business includes a 7-day free trial with no credit card required. You get full access to all Business features: unlimited business units, team collaboration, cross-column validations, remediation tools, and priority support. If you don't upgrade by the end of the trial, you move to the Free plan automatically — no charges.",
  },
  {
    q: "How does the DQ scoring work? Can I trust the numbers?",
    a: "Each of the 10 DQ dimensions has a defined formula. Completeness = (non-null rows / total rows) × 100. Validity = (rows matching your rule / total rows) × 100. Every score shows exactly which rule was applied and how many rows failed — there are no proprietary algorithms or opaque weighting. The overall score is a weighted average of all dimension scores. It's transparent math you can verify.",
  },
  {
    q: "Can I use Sohovi for regulated industries?",
    a: "Yes — and this is Sohovi's strongest compliance story. Because your raw data never leaves your browser, there is no data transfer to our servers, which means Sohovi doesn't become a data processor under GDPR for your customer data. We only store DQ metadata (scores, rule configs). Legal teams in healthcare, finance, and HR typically approve Sohovi in 24 hours because there's simply nothing to audit on our end.",
  },
  {
    q: "What happens to my rules and score history if I cancel?",
    a: "You can export your rules as JSON anytime. Your run history and score data are available in your account until you delete them. We don't hold your data hostage — there's an export button in every section.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24" style={{ background: "#FFFFFF" }}>
      <div className="mx-auto max-w-2xl px-6">
        <div className="mb-16 space-y-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: "#5B5B63" }}>
            FAQ
          </p>
          <h2
            className="font-bold"
            style={{ fontSize: "clamp(32px, 4.4vw, 56px)", letterSpacing: "-0.025em", lineHeight: 1.05, color: "#0A0A0A" }}
          >
            Questions we hear most often.
          </h2>
          <p style={{ color: "#5B5B63" }}>
            Still have questions?{" "}
            <a href="mailto:hello@sohovi.com" className="underline hover:no-underline transition-all" style={{ color: "#0A0A0A" }}>
              Email us.
            </a>
          </p>
        </div>

        <div>
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} style={{ borderBottom: "1px solid #E9E9EC" }}>
                <button
                  className="w-full flex items-center justify-between gap-4 py-5 text-left focus:outline-none"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span className="font-medium" style={{ color: "#0A0A0A" }}>{faq.q}</span>
                  <ChevronDown
                    className="w-5 h-5 shrink-0 transition-transform duration-200"
                    style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", color: "#5B5B63" }}
                  />
                </button>
                <div
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{ maxHeight: isOpen ? "24rem" : "0" }}
                >
                  <div className="rounded-[16px] px-5 py-4 mb-5 text-sm leading-relaxed" style={{ background: "#fff", border: "1px solid #E9E9EC", color: "#5B5B63" }}>
                    {faq.a}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
