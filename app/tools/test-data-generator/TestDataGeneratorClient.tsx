"use client";

import { useState } from "react";
import { HardCTA } from "@/components/tools/HardCTA";
import { SoftCTA } from "@/components/tools/SoftCTA";
import { ToolFAQ, type FAQItem } from "@/components/tools/ToolFAQ";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { UseCases, type UseCase } from "@/components/tools/UseCases";
import { Plus, Trash2, Download } from "lucide-react";

type ColType = "firstName" | "lastName" | "fullName" | "email" | "phone" | "uuid" | "integer" | "float" | "boolean" | "date" | "country" | "city" | "company" | "url" | "lorem" | "incrementId";

interface ColDef { name: string; type: ColType; }

const COL_TYPE_LABELS: Record<ColType, string> = {
  firstName: "First name", lastName: "Last name", fullName: "Full name",
  email: "Email address", phone: "Phone number", uuid: "UUID (random)",
  integer: "Integer (1–10000)", float: "Float (0.00–100.00)", boolean: "Boolean (true/false)",
  date: "Date (2020–2025)", country: "Country", city: "City",
  company: "Company name", url: "URL", lorem: "Lorem ipsum (sentence)", incrementId: "Auto-increment ID",
};

const FIRST_NAMES = ["Alice","Bob","Charlie","Diana","Eve","Frank","Grace","Hank","Iris","Jack","Kate","Liam","Mia","Noah","Olivia","Paul","Quinn","Rachel","Sam","Tina","Uma","Victor","Wendy","Xander","Yara","Zoe","Aiden","Bella","Carlos","Daisy"];
const LAST_NAMES = ["Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Rodriguez","Martinez","Hernandez","Lopez","Wilson","Anderson","Thomas","Taylor","Moore","Jackson","Martin","Lee","Perez","Thompson","White","Harris","Sanchez","Clark","Ramirez","Lewis","Robinson","Walker"];
const COMPANIES = ["Acme Corp","BrightPath Inc","CloudNova","DataSync","EdgeWave","Finova","GreenBridge","HorizonAI","InfoQuest","JetStream","Keystone Labs","Luminary","Metasoft","NexGen","Optimus Systems","PeakData","QuantumLeap","RapidFlow","Skyline Tech","Titan Solutions"];
const COUNTRIES = ["United States","United Kingdom","Canada","Australia","Germany","France","India","Brazil","Japan","Mexico","Spain","Italy","Netherlands","Singapore","Sweden","Norway","Denmark","South Korea","New Zealand","Switzerland"];
const CITIES = ["New York","London","Toronto","Sydney","Berlin","Paris","Mumbai","São Paulo","Tokyo","Mexico City","Madrid","Milan","Amsterdam","Singapore","Stockholm","Oslo","Copenhagen","Seoul","Auckland","Zurich"];
const DOMAINS = ["gmail.com","yahoo.com","outlook.com","hotmail.com","icloud.com","proton.me","company.io","business.com","enterprise.co"];
const LOREM = ["The quick brown fox jumps over the lazy dog.","Lorem ipsum dolor sit amet consectetur adipiscing elit.","Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.","Ut enim ad minim veniam quis nostrud exercitation.","Duis aute irure dolor in reprehenderit in voluptate velit esse.","Excepteur sint occaecat cupidatat non proident sunt in culpa.","Nulla pariatur at vero eos et accusamus et iusto odio dignissimos.","Nam libero tempore cum soluta nobis est eligendi optio cumque."];

function rnd<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function uuid() { return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => { const r = Math.random() * 16 | 0; return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16); }); }

function generateCell(type: ColType, rowIndex: number): string {
  switch (type) {
    case "firstName": return rnd(FIRST_NAMES);
    case "lastName": return rnd(LAST_NAMES);
    case "fullName": return `${rnd(FIRST_NAMES)} ${rnd(LAST_NAMES)}`;
    case "email": { const fn = rnd(FIRST_NAMES).toLowerCase(); const ln = rnd(LAST_NAMES).toLowerCase(); return `${fn}.${ln}@${rnd(DOMAINS)}`; }
    case "phone": return `+1${randInt(200, 999)}${randInt(1000000, 9999999)}`;
    case "uuid": return uuid();
    case "integer": return String(randInt(1, 10000));
    case "float": return (Math.random() * 100).toFixed(2);
    case "boolean": return Math.random() > 0.5 ? "true" : "false";
    case "date": { const y = randInt(2020, 2025); const m = String(randInt(1, 12)).padStart(2, "0"); const d = String(randInt(1, 28)).padStart(2, "0"); return `${y}-${m}-${d}`; }
    case "country": return rnd(COUNTRIES);
    case "city": return rnd(CITIES);
    case "company": return rnd(COMPANIES);
    case "url": return `https://www.${rnd(COMPANIES).toLowerCase().replace(/\s+/g, "")}.com`;
    case "lorem": return rnd(LOREM);
    case "incrementId": return String(rowIndex + 1);
    default: return "";
  }
}

function generateCSV(cols: ColDef[], rowCount: number): string {
  const esc = (v: string) => v.includes(",") || v.includes('"') || v.includes("\n") ? `"${v.replace(/"/g, '""')}"` : v;
  const header = cols.map((c) => esc(c.name)).join(",");
  const rows: string[] = [];
  for (let i = 0; i < rowCount; i++) {
    rows.push(cols.map((c) => esc(generateCell(c.type, i))).join(","));
  }
  return [header, ...rows].join("\n");
}

const PRESETS: { label: string; cols: ColDef[] }[] = [
  { label: "Customer list", cols: [{ name: "id", type: "incrementId" }, { name: "first_name", type: "firstName" }, { name: "last_name", type: "lastName" }, { name: "email", type: "email" }, { name: "phone", type: "phone" }, { name: "country", type: "country" }] },
  { label: "Sales records", cols: [{ name: "order_id", type: "uuid" }, { name: "customer_name", type: "fullName" }, { name: "email", type: "email" }, { name: "amount", type: "float" }, { name: "date", type: "date" }, { name: "status", type: "boolean" }] },
  { label: "Employee directory", cols: [{ name: "employee_id", type: "incrementId" }, { name: "name", type: "fullName" }, { name: "email", type: "email" }, { name: "company", type: "company" }, { name: "city", type: "city" }, { name: "country", type: "country" }] },
];

const faqs: FAQItem[] = [
  { q: "What is a test data generator?", a: "A test data generator creates realistic fake data for software testing, database seeding, UI development, and demos. Instead of using real customer data (which raises privacy concerns), you generate synthetic data that looks real but isn't." },
  { q: "How do I generate fake CSV data?", a: "Use the presets to start quickly, or define your own columns by choosing a name and data type. Set the row count, click Generate, and download your CSV or JSON file instantly." },
  { q: "Is there a row limit?", a: "No. You can generate up to 100,000 rows in a single download. The generation runs entirely in your browser — nothing is sent to a server." },
  { q: "What data types are available?", a: "First/last/full name, email, phone, UUID, integer, float, boolean, date, country, city, company name, URL, lorem ipsum text, and auto-increment ID." },
  { q: "Can I use this data in production?", a: "No — this is synthetic test data. Names, emails, and phone numbers are randomly generated and not real. Use it for testing, demos, and development only." },
];

const USE_CASES: UseCase[] = [
  {
    persona: "QA Engineer",
    domain: "Software Testing",
    icon: "🧪",
    scenario: "Building automated tests for a new user import feature. Needs 10,000 realistic user records with name, email, phone, and country — without touching any real production data or risking GDPR exposure.",
    outcome: "Defines 6 columns, sets 10,000 rows, downloads in 4 seconds. Uploads to staging environment. Zero compliance risk, test suite runs immediately.",
  },
  {
    persona: "Full-Stack Developer",
    domain: "Software Engineering",
    icon: "💻",
    scenario: "Local development environment needs seed data to test UI rendering and pagination. Writing a faker script from scratch would take 30 minutes and isn't worth it for a one-off task.",
    outcome: "Uses the 'Sales Records' preset, sets 500 rows, feeds the CSV into the seeder script. Environment is up and running in 2 minutes.",
  },
  {
    persona: "Database Administrator",
    domain: "Enterprise IT",
    icon: "🛡️",
    scenario: "A new schema needs performance testing under realistic load conditions. Requires 500,000 rows with varied data distributions to stress-test indexes and query execution plans.",
    outcome: "Generates 100,000 rows per batch with UUID, integer, date, and varchar columns. Runs 5 batches. 500,000 rows loaded in minutes — index issues caught before production.",
  },
  {
    persona: "Data Science Student",
    domain: "Education / Research",
    icon: "🎓",
    scenario: "Machine learning course project needs a realistic dataset for a binary classification task. Kaggle datasets are overused and recognisable — the professor wants original work.",
    outcome: "Generates a 5,000-row customer churn dataset with custom columns. Splits into train and test CSVs. Submits a unique, credible project.",
  },
];

const relatedTools = [
  { name: "CSV to JSON Converter", href: "/tools/csv-to-json", description: "Convert your test CSV to JSON" },
  { name: "CSV to SQL Generator", href: "/tools/csv-to-sql", description: "Insert test data into a database" },
  { name: "Duplicate Row Remover", href: "/tools/remove-duplicates", description: "Clean up test datasets" },
];

export function TestDataGeneratorClient() {
  const [cols, setCols] = useState<ColDef[]>(PRESETS[0].cols);
  const [rowCount, setRowCount] = useState(100);
  const [format, setFormat] = useState<"csv" | "json">("csv");
  const [generated, setGenerated] = useState(false);

  function addCol() {
    setCols((prev) => [...prev, { name: `column_${prev.length + 1}`, type: "firstName" }]);
  }

  function removeCol(i: number) {
    setCols((prev) => prev.filter((_, idx) => idx !== i));
  }

  function updateCol(i: number, patch: Partial<ColDef>) {
    setCols((prev) => prev.map((c, idx) => idx === i ? { ...c, ...patch } : c));
  }

  function handleDownload() {
    if (format === "csv") {
      const csv = generateCSV(cols, rowCount);
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = "test-data.csv"; a.click();
      URL.revokeObjectURL(url);
    } else {
      const rows: Record<string, string>[] = [];
      for (let i = 0; i < rowCount; i++) {
        const obj: Record<string, string> = {};
        cols.forEach((c) => { obj[c.name] = generateCell(c.type, i); });
        rows.push(obj);
      }
      const blob = new Blob([JSON.stringify(rows, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = "test-data.json"; a.click();
      URL.revokeObjectURL(url);
    }
    setGenerated(true);
  }

  return (
    <article className="mx-auto max-w-[780px] px-6 py-12">
      <header className="mb-10">
        <div className="inline-block text-[12px] font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4" style={{ background: "rgba(224,113,80,0.08)", color: "#C45A3C", border: "1px solid rgba(224,113,80,0.2)" }}>
          Free tool — no signup
        </div>
        <h1 className="text-[32px] sm:text-[40px] font-bold leading-tight mb-3" style={{ color: "var(--ink)" }}>
          Free Random Test Data Generator
        </h1>
        <p className="text-[16px] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
          Generate realistic fake CSV or JSON data for testing and development. Define your columns, set the row count, download instantly.
          <strong style={{ color: "var(--ink)" }}> 100% browser-based. No signup.</strong>
        </p>
      </header>

      {/* Presets */}
      <div className="mb-6">
        <p className="text-[13px] font-semibold mb-2.5" style={{ color: "var(--ink-soft)" }}>Quick presets</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button key={p.label} onClick={() => setCols(p.cols)} className="px-4 py-2 rounded-full text-[13px] font-medium border transition-all" style={{ borderColor: "var(--hair-strong)", background: "var(--paper)", color: "var(--ink-soft)" }}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Column editor */}
      <div className="rounded-xl border overflow-hidden mb-5" style={{ borderColor: "var(--hair-strong)" }}>
        <div className="px-4 py-2.5 text-[12px] font-semibold uppercase tracking-wider" style={{ background: "var(--cream-deep)", color: "var(--ink-mute)", borderBottom: "1px solid var(--hair)" }}>
          Column definitions
        </div>
        <div>
          {cols.map((col, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: "var(--hair)", background: "var(--paper)" }}>
              <input
                value={col.name}
                onChange={(e) => updateCol(i, { name: e.target.value })}
                className="flex-1 min-w-0 rounded-lg border px-3 py-1.5 text-[13px] font-mono focus:outline-none"
                style={{ borderColor: "var(--hair-strong)", background: "var(--cream)", color: "var(--ink)", fontFamily: "var(--font-geist-mono)" }}
                placeholder="column_name"
              />
              <select
                value={col.type}
                onChange={(e) => updateCol(i, { type: e.target.value as ColType })}
                className="rounded-lg border px-3 py-1.5 text-[13px] focus:outline-none"
                style={{ borderColor: "var(--hair-strong)", background: "var(--cream)", color: "var(--ink)" }}
              >
                {(Object.keys(COL_TYPE_LABELS) as ColType[]).map((t) => (
                  <option key={t} value={t}>{COL_TYPE_LABELS[t]}</option>
                ))}
              </select>
              <button onClick={() => removeCol(i)} disabled={cols.length <= 1} className="p-2 rounded-lg transition-all disabled:opacity-30" style={{ color: "var(--ink-mute)" }}>
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <button onClick={addCol} className="w-full flex items-center justify-center gap-2 py-3 text-[13px] font-medium transition-all" style={{ color: "var(--ink-mute)", borderTop: "1px solid var(--hair)" }}>
          <Plus className="w-4 h-4" />
          Add column
        </button>
      </div>

      {/* Row count + format */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[180px]">
          <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "var(--ink-soft)" }}>Number of rows</label>
          <select value={rowCount} onChange={(e) => setRowCount(Number(e.target.value))} className="w-full rounded-lg border px-3 py-2 text-[13px] focus:outline-none" style={{ borderColor: "var(--hair-strong)", background: "var(--paper)", color: "var(--ink)" }}>
            {[10, 50, 100, 500, 1000, 5000, 10000, 50000, 100000].map((n) => (
              <option key={n} value={n}>{n.toLocaleString()}</option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[180px]">
          <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "var(--ink-soft)" }}>Output format</label>
          <div className="flex gap-2">
            {(["csv", "json"] as const).map((f) => (
              <button key={f} onClick={() => setFormat(f)} className="flex-1 py-2 rounded-lg border text-[13px] font-medium transition-all" style={{ borderColor: format === f ? "var(--mint)" : "var(--hair-strong)", background: format === f ? "rgba(0,201,167,0.06)" : "transparent", color: format === f ? "#007A65" : "var(--ink-soft)" }}>
                .{f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={handleDownload}
        disabled={cols.length === 0}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-[15px] transition-all disabled:opacity-40 mb-5"
        style={{ background: "var(--ink)", color: "white" }}
      >
        <Download className="w-5 h-5" />
        Generate &amp; download {rowCount.toLocaleString()} rows ({format.toUpperCase()})
      </button>

      <SoftCTA text="Testing with fake data? When real data arrives, Sohovi validates its quality automatically →" />

      {generated && (
        <HardCTA
          headline="Your test data is ready — now validate the real thing"
          body="Fake data is great for testing. But when real data comes in from customers, partners, or exports, Sohovi profiles it automatically — catching quality issues before they reach your app or database."
          bullets={[
            "Null rate, type consistency, and uniqueness profiling — automatic",
            "DQ scores across 10 dimensions with threshold alerts",
            "Track quality over time as new data arrives",
          ]}
        />
      )}

      <UseCases cases={USE_CASES} toolName="Test Data Generator" />

      <section className="mt-14">
        <h2 className="text-[22px] font-bold mb-5" style={{ color: "var(--ink)" }}>How to generate fake CSV test data</h2>
        <div className="space-y-4">
          {[
            { step: "1", title: "Choose a preset or define your columns", body: "Start with a customer list, sales records, or employee directory preset — or define your own columns by choosing a name and data type. Supported types include names, emails, UUIDs, dates, countries, and more." },
            { step: "2", title: "Set row count and format", body: "Choose how many rows you need (10 to 100,000) and whether you want CSV or JSON output. CSV is great for spreadsheets and database imports. JSON is useful for APIs and frontend testing." },
            { step: "3", title: "Generate and download", body: "Click Generate. Your file is created instantly in the browser and downloaded automatically. No data is sent to any server." },
          ].map((s) => (
            <div key={s.step} className="flex gap-4 p-5 rounded-xl border" style={{ borderColor: "var(--hair)", background: "var(--paper)" }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[13px] font-bold" style={{ background: "var(--cream-deep)", color: "var(--ink)" }}>{s.step}</div>
              <div>
                <p className="font-semibold text-[14px]" style={{ color: "var(--ink)" }}>{s.title}</p>
                <p className="text-[13px] mt-1 leading-relaxed" style={{ color: "var(--ink-soft)" }}>{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <ToolFAQ items={faqs} toolUrl="/tools/test-data-generator" />
      <RelatedTools tools={relatedTools} />
    </article>
  );
}
