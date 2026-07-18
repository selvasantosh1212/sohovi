"use client";

import { useState, useEffect } from "react";
import { HardCTA } from "@/components/tools/HardCTA";
import { SoftCTA } from "@/components/tools/SoftCTA";
import { ToolFAQ, type FAQItem } from "@/components/tools/ToolFAQ";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { UseCases, type UseCase } from "@/components/tools/UseCases";
import { Plus, Trash2, Download, Loader2, AlertCircle } from "lucide-react";

type ColType = "firstName" | "lastName" | "fullName" | "email" | "phone" | "uuid" | "integer" | "float" | "boolean" | "date" | "country" | "city" | "company" | "url" | "lorem" | "incrementId";

interface ColDef { name: string; type: ColType; }

const COL_TYPE_LABELS: Record<ColType, string> = {
  firstName: "First name", lastName: "Last name", fullName: "Full name",
  email: "Email address", phone: "Phone number", uuid: "UUID (random)",
  integer: "Integer (1–10000)", float: "Float (0.00–100.00)", boolean: "Boolean (true/false)",
  date: "Date (2020–2025)", country: "Country", city: "City",
  company: "Company name", url: "URL", lorem: "Lorem ipsum (2–4 sentences)", incrementId: "Auto-increment ID",
};

const FIRST_NAMES = ["Alice","Bob","Charlie","Diana","Eve","Frank","Grace","Hank","Iris","Jack","Kate","Liam","Mia","Noah","Olivia","Paul","Quinn","Rachel","Sam","Tina","Uma","Victor","Wendy","Xander","Yara","Zoe","Aiden","Bella","Carlos","Daisy","Ethan","Fiona","George","Hannah","Ian","Julia","Kevin","Laura","Marcus","Nina","Oscar","Priya","Ravi","Sofia","Tomas","Ursula","Vikram","Wei","Ximena","Yusuf","Zara","Amir","Bianca","Chen","Deepa","Elena","Felix","Gita","Hiro","Ingrid","Jamal","Keiko","Leo","Maya","Nasser","Olga","Pedro","Qiang","Rosa","Stefan","Tara","Ulysses","Valentina","Wolfgang","Ximing","Yolanda","Zane","Aisha","Bruno","Camille","Dmitri","Elif","Fatima","Gabriel","Hana","Ivan","Jasmine","Kenji","Lucia","Mohammed","Natasha","Omar","Petra","Quentin","Rania","Sven","Tanvir","Vera","Wanda","Xiomara","Yasmin","Zoltan","Anders","Beatrice","Cyrus","Delphine","Esteban","Farah","Giulia","Henrik","Imani","Joaquin"];
const LAST_NAMES = ["Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Rodriguez","Martinez","Hernandez","Lopez","Wilson","Anderson","Thomas","Taylor","Moore","Jackson","Martin","Lee","Perez","Thompson","White","Harris","Sanchez","Clark","Ramirez","Lewis","Robinson","Walker","Young","Allen","King","Wright","Scott","Torres","Nguyen","Hill","Flores","Green","Adams","Nelson","Baker","Hall","Rivera","Campbell","Mitchell","Carter","Roberts","Gomez","Phillips","Evans","Turner","Diaz","Parker","Cruz","Edwards","Collins","Reyes","Stewart","Morris","Morales","Murphy","Cook","Rogers","Gutierrez","Ortiz","Morgan","Cooper","Peterson","Bailey","Reed","Kelly","Howard","Ramos","Kim","Cox","Ward","Richardson","Watson","Brooks","Chavez","Wood","James","Bennett","Gray","Mendoza","Ruiz","Hughes","Price","Alvarez","Castillo","Sanders","Patel","Myers","Long","Ross","Foster","Jimenez","Powell","Jenkins","Perry","Russell","Sullivan","Bell","Coleman","Butler","Henderson","Barnes","Gonzales","Fisher"];
const COMPANIES = ["Acme Corp","BrightPath Inc","CloudNova","DataSync","EdgeWave","Finova","GreenBridge","HorizonAI","InfoQuest","JetStream","Keystone Labs","Luminary","Metasoft","NexGen","Optimus Systems","PeakData","QuantumLeap","RapidFlow","Skyline Tech","Titan Solutions","Apex Dynamics","BlueOak Partners","Catalyst Works","Driftwood Digital","Everline Group","Fernway Systems","Gridlock Analytics","Harbor Point Tech","Ironclad Software","Junction Labs","Kindred Data","Lighthouse Ventures","Maple Ridge Co","Northstar Solutions","Orbital Systems","Pinnacle Softworks","Redwood Analytics","Summit Cloud","Tandem Technologies","Union Square Labs","Vertex Dynamics","Westbrook Group","Yellowstone Data","Zenith Networks","Ashford Technologies"];
const COUNTRIES = ["United States","United Kingdom","Canada","Australia","Germany","France","India","Brazil","Japan","Mexico","Spain","Italy","Netherlands","Singapore","Sweden","Norway","Denmark","South Korea","New Zealand","Switzerland","Argentina","Austria","Belgium","Chile","China","Colombia","Czech Republic","Egypt","Finland","Greece","Hong Kong","Hungary","Iceland","Indonesia","Ireland","Israel","Kenya","Malaysia","Nigeria","Pakistan","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Saudi Arabia","South Africa","Sri Lanka","Taiwan","Thailand","Turkey","Ukraine","United Arab Emirates","Uruguay","Venezuela","Vietnam","Bangladesh","Bulgaria","Croatia","Cyprus","Ecuador","Estonia","Ethiopia","Ghana","Guatemala","Iraq","Jamaica","Jordan","Kazakhstan","Kuwait","Latvia","Lebanon","Lithuania","Luxembourg","Malta","Mauritius","Mongolia","Morocco","Myanmar","Nepal","Nicaragua","Oman","Panama","Paraguay","Serbia","Slovakia","Slovenia","Tanzania","Tunisia","Uganda","Uzbekistan","Zambia","Zimbabwe"];
const CITIES = ["New York","London","Toronto","Sydney","Berlin","Paris","Mumbai","São Paulo","Tokyo","Mexico City","Madrid","Milan","Amsterdam","Singapore","Stockholm","Oslo","Copenhagen","Seoul","Auckland","Zurich","Los Angeles","Chicago","Houston","Miami","San Francisco","Boston","Vancouver","Montreal","Melbourne","Brisbane","Munich","Hamburg","Frankfurt","Lyon","Marseille","Barcelona","Valencia","Rome","Naples","Rotterdam","The Hague","Gothenburg","Bergen","Aarhus","Busan","Wellington","Geneva","Basel","Vienna","Brussels","Antwerp","Santiago","Bogota","Lima","Buenos Aires","Rio de Janeiro","Brasilia","Delhi","Bangalore","Chennai","Hyderabad","Kolkata","Osaka","Kyoto","Nagoya","Shanghai","Beijing","Shenzhen","Guangzhou","Hong Kong","Taipei","Manila","Jakarta","Bangkok","Kuala Lumpur","Ho Chi Minh City","Hanoi","Cairo","Lagos","Nairobi","Cape Town","Johannesburg","Casablanca","Dubai","Abu Dhabi","Riyadh","Doha","Istanbul","Warsaw","Prague","Budapest","Dublin","Lisbon","Athens"];
const DOMAINS = ["gmail.com","yahoo.com","outlook.com","hotmail.com","icloud.com","proton.me","company.io","business.com","enterprise.co","aol.com","live.com","msn.com","zoho.com","mail.com","fastmail.com","corp.net","work.io"];
const LOREM = ["The quick brown fox jumps over the lazy dog.","Lorem ipsum dolor sit amet, consectetur adipiscing elit.","Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.","Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.","Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.","Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia.","Nulla pariatur at vero eos et accusamus et iusto odio dignissimos.","Nam libero tempore cum soluta nobis est eligendi optio cumque.","The team reviewed the quarterly report before the meeting began.","A gentle breeze carried the scent of rain across the valley.","Every dataset tells a story if you know how to read it.","The old lighthouse stood silent against the darkening sky.","Innovation often starts with a simple question nobody else asked.","The recipe called for three eggs and a pinch of salt.","Markets fluctuated wildly after the announcement was made public.","She spent the afternoon sketching the skyline from her window.","The engineers debated the tradeoffs of the new architecture.","A distant train whistle echoed through the quiet countryside.","The library was unusually crowded during exam week.","He planted rows of tomatoes along the garden fence.","The conference attracted researchers from over forty countries.","Rain tapped softly against the windowpane all night long.","The startup pivoted twice before finding product-market fit.","Children laughed as they chased kites across the open field.","The committee postponed its decision until further notice.","A single candle flickered in the otherwise dark room.","The algorithm sorted the records in under two seconds.","Travelers lined up early to catch the first ferry.","The museum unveiled a new exhibit on ancient trade routes.","Sunlight filtered through the canopy of tall pine trees.","The negotiations continued well past midnight without resolution.","Her presentation covered three years of customer feedback data.","The bridge was closed for repairs following the storm.","Local farmers gathered at the market to sell fresh produce.","The software update fixed several long-standing bugs.","A curious cat wandered into the open bakery door.","The professor assigned a lengthy reading for the weekend.","Waves crashed steadily against the rocky shoreline.","The company reported strong earnings for the third quarter.","Volunteers spent the weekend cleaning up the riverbank.","The orchestra rehearsed the symphony one final time.","New regulations require additional disclosures from vendors.","The hikers reached the summit just before sunset.","A faint aroma of coffee drifted from the kitchen.","The city council approved funding for the new park.","Researchers published their findings in a peer-reviewed journal.","The bakery sold out of croissants before nine in the morning.","Traffic slowed to a crawl near the downtown exit."];

function rnd<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function uuid() { return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => { const r = Math.random() * 16 | 0; return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16); }); }

function pickN<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  const out: T[] = [];
  for (let i = 0; i < n && copy.length; i++) {
    out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
  }
  return out;
}

function generateLorem(): string {
  return pickN(LOREM, randInt(2, 4)).join(" ");
}

interface RowIdentity { firstName: string; lastName: string; email: string; }

function buildIdentity(nameOccurrences: Map<string, number>): RowIdentity {
  const firstName = rnd(FIRST_NAMES);
  const lastName = rnd(LAST_NAMES);
  const key = `${firstName}|${lastName}`;
  const n = (nameOccurrences.get(key) ?? 0) + 1;
  nameOccurrences.set(key, n);
  const suffix = n > 1 ? String(n) : "";
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${suffix}@${rnd(DOMAINS)}`;
  return { firstName, lastName, email };
}

type CellValue = string | number | boolean;

function generateCell(type: ColType, rowIndex: number, id: RowIdentity): CellValue {
  switch (type) {
    case "firstName": return id.firstName;
    case "lastName": return id.lastName;
    case "fullName": return `${id.firstName} ${id.lastName}`;
    case "email": return id.email;
    case "phone": return `+1${randInt(200, 999)}${randInt(200, 999)}${randInt(1000, 9999)}`;
    case "uuid": return uuid();
    case "integer": return randInt(1, 10000);
    case "float": return Number((Math.random() * 100).toFixed(2));
    case "boolean": return Math.random() > 0.5;
    case "date": { const y = randInt(2020, 2025); const m = randInt(1, 12); const daysInMonth = new Date(y, m, 0).getDate(); const d = randInt(1, daysInMonth); return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`; }
    case "country": return rnd(COUNTRIES);
    case "city": return rnd(CITIES);
    case "company": return rnd(COMPANIES);
    case "url": return `https://www.${rnd(COMPANIES).toLowerCase().replace(/[^a-z0-9]/gi, "")}.com`;
    case "lorem": return generateLorem();
    case "incrementId": return rowIndex + 1;
    default: return "";
  }
}

function generateRows(cols: ColDef[], rowCount: number): CellValue[][] {
  const nameOccurrences = new Map<string, number>();
  const rows: CellValue[][] = [];
  for (let i = 0; i < rowCount; i++) {
    const id = buildIdentity(nameOccurrences);
    rows.push(cols.map((c) => generateCell(c.type, i, id)));
  }
  return rows;
}

function esc(v: string): string {
  const s = /^[=+\-@]/.test(v) ? `'${v}` : v;
  return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s.replace(/"/g, '""')}"` : s;
}

function generateCSV(cols: ColDef[], rowCount: number): string {
  const header = cols.map((c) => esc(c.name)).join(",");
  const rows = generateRows(cols, rowCount).map((row) => row.map((v) => esc(String(v))).join(","));
  return [header, ...rows].join("\n");
}

function nextColumnName(existingNames: string[]): string {
  const existing = new Set(existingNames);
  let n = existingNames.length + 1;
  while (existing.has(`column_${n}`)) n++;
  return `column_${n}`;
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { setGenerated(false); }, [cols, rowCount, format]);

  const nameCounts = cols.reduce((m, c) => m.set(c.name, (m.get(c.name) ?? 0) + 1), new Map<string, number>());
  const hasBlankName = cols.some((c) => !c.name.trim());
  const hasDuplicateName = cols.some((c) => (nameCounts.get(c.name) ?? 0) > 1);
  const hasValidationError = hasBlankName || hasDuplicateName;

  function addCol() {
    setCols((prev) => [...prev, { name: nextColumnName(prev.map((c) => c.name)), type: "firstName" }]);
  }

  function removeCol(i: number) {
    setCols((prev) => prev.filter((_, idx) => idx !== i));
  }

  function updateCol(i: number, patch: Partial<ColDef>) {
    setCols((prev) => prev.map((c, idx) => idx === i ? { ...c, ...patch } : c));
  }

  function handleDownload() {
    setError(null);
    setIsGenerating(true);
    setTimeout(() => {
      try {
        if (format === "csv") {
          const csv = generateCSV(cols, rowCount);
          const blob = new Blob([csv], { type: "text/csv" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a"); a.href = url; a.download = "test-data.csv"; a.click();
          URL.revokeObjectURL(url);
        } else {
          const rows = generateRows(cols, rowCount).map((row) =>
            Object.fromEntries(row.map((v, i) => [cols[i].name, v]))
          );
          const blob = new Blob([JSON.stringify(rows, null, 2)], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a"); a.href = url; a.download = "test-data.json"; a.click();
          URL.revokeObjectURL(url);
        }
        setGenerated(true);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Generation failed. Please try again.");
      } finally {
        setIsGenerating(false);
      }
    }, 30);
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
          {cols.map((col, i) => {
            const nameInvalid = !col.name.trim() || (nameCounts.get(col.name) ?? 0) > 1;
            return (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 px-4 py-3 border-b" style={{ borderColor: "var(--hair)", background: "var(--paper)" }}>
                <input
                  value={col.name}
                  onChange={(e) => updateCol(i, { name: e.target.value })}
                  aria-label={`Column ${i + 1} name`}
                  className="w-full sm:flex-1 sm:min-w-0 rounded-lg border px-3 py-1.5 text-[13px] font-mono focus:outline-none"
                  style={{ borderColor: nameInvalid ? "#FCA5A5" : "var(--hair-strong)", background: "var(--cream)", color: "var(--ink)", fontFamily: "var(--font-geist-mono)" }}
                  placeholder="column_name"
                />
                <div className="flex gap-2">
                  <select
                    value={col.type}
                    onChange={(e) => updateCol(i, { type: e.target.value as ColType })}
                    aria-label={`Column ${i + 1} type`}
                    className="flex-1 sm:flex-none sm:w-[190px] rounded-lg border px-3 py-1.5 text-[13px] focus:outline-none"
                    style={{ borderColor: "var(--hair-strong)", background: "var(--cream)", color: "var(--ink)" }}
                  >
                    {(Object.keys(COL_TYPE_LABELS) as ColType[]).map((t) => (
                      <option key={t} value={t}>{COL_TYPE_LABELS[t]}</option>
                    ))}
                  </select>
                  <button onClick={() => removeCol(i)} disabled={cols.length <= 1} aria-label={`Remove column ${i + 1}`} className="p-2 rounded-lg transition-all disabled:opacity-30" style={{ color: "var(--ink-mute)" }}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
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
              <button key={f} onClick={() => setFormat(f)} aria-pressed={format === f} className="flex-1 py-2 rounded-lg border text-[13px] font-medium transition-all" style={{ borderColor: format === f ? "var(--mint)" : "var(--hair-strong)", background: format === f ? "rgba(0,201,167,0.06)" : "transparent", color: format === f ? "#007A65" : "var(--ink-soft)" }}>
                .{f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {hasValidationError && (
        <div className="flex items-center gap-3 p-4 rounded-xl mb-5" style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}>
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="text-[14px] text-red-700">Column names must be non-empty and unique.</p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl mb-5" style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}>
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="text-[14px] text-red-700">{error}</p>
        </div>
      )}

      <button
        onClick={handleDownload}
        disabled={isGenerating || hasValidationError}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-[15px] transition-all disabled:opacity-40 mb-5"
        style={{ background: "var(--ink)", color: "white" }}
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating…
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            Generate &amp; download {rowCount.toLocaleString()} rows ({format.toUpperCase()})
          </>
        )}
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
